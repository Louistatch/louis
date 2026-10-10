"""Capture actual Chromium compositor frames for ~12 seconds.

python qa/capture_screencast.py --entry-file dist/TOGO_LIFE_MONTAGNE.html \
  --output-dir artifacts/screencast-proposal

No interpolation, synthetic frames, state setters, teleportation or FPS target.
The compositor swap timestamp and actual event receipt time are both preserved.
State observations prove gameplay phases independently; they are not asserted
as the exact state represented by an individual JPEG.
"""
import argparse
import asyncio
import base64
import hashlib
import json
import math
import os
import subprocess
import time
import traceback
from pathlib import Path
from playwright.async_api import async_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--entry-file', required=True)
parser.add_argument('--output-dir', required=True)
args = parser.parse_args()
entry = Path(args.entry_file).resolve()
out = Path(args.output_dir).resolve()
out.mkdir(parents=True, exist_ok=True)
report = {'status': 'running', 'sourceSha': os.environ.get('TOGO_SOURCE_SHA'),
          'method': 'Actual Page.screencastFrame JPEG events; VFR intervals from monotonic event receipt times',
          'stateObservationMethod': 'Independent read-only diagnostics during each actual-input phase; not frame-presentation-matched',
          'frames': [], 'phases': [], 'errors': [],
          'physicalAndroidValidated': False}
keys = ('w', 'a', 's', 'd', 'Shift')
requested_phase = 'initializing'
received_origin = 0


def checkpoint(label):
    report['stage'] = label
    (out / 'screencast-results.json').write_text(json.dumps(report, indent=2))
    print('SCREENCAST_CAPTURE', label, flush=True)


async def release(page):
    for key in keys:
        await page.keyboard.up(key)


async def read(page):
    return await page.evaluate('window.__THREE_GAME_DIAGNOSTICS__.state')


async def main():
    global requested_phase, received_origin
    report['entrySha256'] = hashlib.sha256(entry.read_bytes()).hexdigest()
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle',
            '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        report['version'] = browser.version
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()
        page.set_default_timeout(15000)
        page.on('pageerror', lambda error: report['errors'].append(str(error)))
        cdp = None
        ack_tasks = set()
        screencast_active = False
        try:
            checkpoint('load real offline game')
            await page.goto(entry.as_uri() + '?qa=1', wait_until='commit')
            await page.wait_for_selector('#start[open]')
            await page.locator('#startBtn').click()
            await page.wait_for_selector('#start[open]', state='hidden')
            await page.wait_for_function('!!window.__THREE_GAME_DIAGNOSTICS__')
            state = await read(page)
            yaw = state.get('camera', {}).get('yaw')
            if yaw is None:
                raise AssertionError('Safe route requires the read-only camera yaw')
            if not await page.evaluate("document.elementFromPoint(640,324)===document.getElementById('world')"):
                raise AssertionError('Camera drag origin is covered by HUD')
            await page.mouse.move(640, 324)
            await page.mouse.down()
            try:
                await page.mouse.move(640 + yaw / .006, 324, steps=4)
            finally:
                await page.mouse.up()
            aligned = await read(page)
            if abs(aligned['camera']['yaw']) > .001:
                raise AssertionError('Actual drag did not align the walking route')
            if abs(aligned['player']['x'] + 7) > .1:
                raise AssertionError('Fresh player is not on the verified spawn sidewalk')
            report['route'] = {'method': 'Real camera drag and W/S key events on x=-7 sidewalk',
                               'alignedCamera': aligned['camera'], 'spawn': aligned['player']}
            cdp = await context.new_cdp_session(page)
            await cdp.send('Page.enable')

            async def acknowledge(session_id):
                try:
                    await cdp.send('Page.screencastFrameAck', {'sessionId': session_id})
                except Exception as error:
                    report['errors'].append('Frame acknowledgement: ' + str(error))

            def on_frame(params):
                # Save immediately and acknowledge without diagnostic reads in the frame
                # pipeline. The independent phase reads cannot throttle the acknowledgements.
                received = time.monotonic()
                filename = f"frame-{len(report['frames']):04d}.jpg"
                frame = {'file': filename, 'receivedSeconds': received - received_origin,
                         'requestedInputAtReceipt': requested_phase,
                         'sessionId': params['sessionId'], 'metadata': params.get('metadata', {})}
                try:
                    (out / filename).write_bytes(base64.b64decode(params['data'], validate=True))
                    frame['bytes'] = (out / filename).stat().st_size
                    report['frames'].append(frame)
                except Exception as error:
                    report['errors'].append('Frame write: ' + str(error))
                finally:
                    task = asyncio.create_task(acknowledge(params['sessionId']))
                    ack_tasks.add(task)
                    task.add_done_callback(ack_tasks.discard)

            cdp.on('Page.screencastFrame', on_frame)
            received_origin = time.monotonic()
            requested_phase = 'idle'
            await cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 75,
                                                  'maxWidth': 960, 'maxHeight': 540,
                                                  'everyNthFrame': 1})
            screencast_active = True
            checkpoint('record actual compositor frame stream')

            async def phase(name, duration, direction=None, running=False):
                global requested_phase
                await release(page)
                requested_phase = name
                began = time.monotonic()
                item = {'input': name, 'beginReceivedSeconds': began - received_origin,
                        'direction': direction, 'running': running, 'observations': [],
                        'observedExpectedAnimation': False}
                report['phases'].append(item)
                if running:
                    await page.keyboard.down('Shift')
                if direction:
                    await page.keyboard.down(direction)
                expected = 'Run' if running else 'Walk' if direction else 'Idle'
                # Observe actual player state at short intervals while real frames stream.
                while time.monotonic() - began < duration:
                    state = await read(page)
                    player = state['player']
                    observation = {'receivedSeconds': time.monotonic() - received_origin,
                                   'player': player}
                    item['observations'].append(observation)
                    valid = player['animation'] == expected and (expected != 'Idle' or player['speed'] < .08)
                    item['observedExpectedAnimation'] |= valid
                    await asyncio.sleep(.2)
                item['endReceivedSeconds'] = time.monotonic() - received_origin
                checkpoint('actual phase completed: ' + name)

            async def sequence():
                await phase('idle', 1.5)
                await phase('walk', 2.5, 'w')
                await phase('run', 2.5, 'w', running=True)
                await phase('turn', 2.5, 's')
                await phase('stop', 2.5)

            # Bound the real-input recording, independent of compositor frame throughput.
            await asyncio.wait_for(sequence(), timeout=15)
        finally:
            await release(page)
            if screencast_active:
                await asyncio.wait_for(cdp.send('Page.stopScreencast'), timeout=3)
            if ack_tasks:
                await asyncio.wait_for(asyncio.gather(*list(ack_tasks)), timeout=3)
            if cdp is not None:
                await cdp.detach()
            await context.close()
            await browser.close()


try:
    checkpoint('capture start')
    asyncio.run(main())
    frames = report['frames']
    if len(frames) < 2:
        raise AssertionError('Chromium emitted fewer than two actual frames')
    intervals = [b['receivedSeconds'] - a['receivedSeconds'] for a, b in zip(frames, frames[1:])]
    if not all(math.isfinite(interval) and interval > 0 for interval in intervals):
        raise AssertionError('Actual receipt timestamps are not strictly increasing')
    duration = frames[-1]['receivedSeconds'] - frames[0]['receivedSeconds']
    report['stream'] = {'frames': len(frames), 'seconds': duration,
                        'receivedFramesPerSecond': (len(frames) - 1) / duration,
                        'longestReceiptGapSeconds': max(intervals)}
    for item in report['phases']:
        item['receivedFramesInPhaseWindow'] = sum(
            item['beginReceivedSeconds'] <= frame['receivedSeconds'] <= item['endReceivedSeconds']
            for frame in frames)
    lines = []
    for i, frame in enumerate(frames):
        lines.append("file '" + str(out / frame['file']).replace("'", "'\\''") + "'")
        # Every actual JPEG is used. Preserve measured time; add no interpolated image.
        interval = intervals[i] if i < len(intervals) else intervals[-1]
        lines.append(f'duration {interval:.6f}')
    lines.append("file '" + str(out / frames[-1]['file']).replace("'", "'\\''") + "'")
    manifest = out / 'actual-frames.ffconcat'
    manifest.write_text('\n'.join(lines) + '\n')
    encoded = subprocess.run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(manifest),
                              '-c:v', 'libvpx-vp9', '-b:v', '1M', '-fps_mode', 'vfr',
                              str(out / 'actual-compositor-motion.webm')],
                             capture_output=True, text=True, timeout=20)
    if encoded.returncode:
        raise RuntimeError(encoded.stderr[-2000:])
    useful = (len(frames) >= 12 and max(intervals) <= 2
              and len(report['phases']) == 5
              and all(item['observedExpectedAnimation'] and item['receivedFramesInPhaseWindow'] >= 2
                      for item in report['phases']) and not report['errors'])
    report['status'] = 'pass' if useful else 'partial'
    report['usefulContinuousEvidence'] = useful
except Exception as error:
    report['status'] = 'failed'
    report['error'] = str(error)
    report['traceback'] = traceback.format_exc()
finally:
    checkpoint(report['status'])
    print(json.dumps({'status': report['status'], 'actualFrames': len(report['frames'])}), flush=True)
if report['status'] != 'pass':
    raise SystemExit(1)
