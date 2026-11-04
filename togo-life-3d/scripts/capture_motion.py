"""Record real inputs and screenshots at their actual capture cadence.

Read-only diagnostics bracket each screenshot. They are not its exact presentation
timestamp. A slow capture is never described as a 60 FPS video.
"""
import asyncio
import json
import os
import subprocess
import time
import traceback
from pathlib import Path
from playwright.async_api import async_playwright

game = Path(__file__).resolve().parents[1]
out = game / 'artifacts/motion'
out.mkdir(parents=True, exist_ok=True)
report = {
    'status': 'running',
    'method': 'Real Chromium screenshots; VFR durations from monotonic capture completion times',
    'stateObservationMethod': 'Read-only states immediately before/after each screenshot, plus pending-capture samples; not presentation-timestamp-matched',
    'frames': [], 'phases': [], 'errors': [],
    'sourceSha': os.environ.get('TOGO_SOURCE_SHA'),
}
started = time.monotonic()
KEYS = ('w', 'a', 's', 'd', 'Shift')


def checkpoint(stage):
    report['stage'] = stage
    (out / 'motion-results.json').write_text(json.dumps(report, indent=2))
    print('MOTION_CAPTURE', stage, flush=True)


async def read_state(page):
    return await page.evaluate('window.__THREE_GAME_DIAGNOSTICS__.state')


async def release_inputs(page):
    for key in KEYS:
        await page.keyboard.up(key)


async def capture_phase(page, name, direction=None):
    """Use the open x=-7 sidewalk; avoid long lateral crossings during captures."""
    await release_inputs(page)
    expected = 'Run' if name == 'run' else 'Idle' if name == 'stop' else 'Walk'
    phase = {'input': name, 'expectedAnimation': expected, 'initialDirection': direction,
             'samples': [], 'directionChanges': [], 'confirmed': False}
    report['phases'].append(phase)
    if name == 'run':
        await page.keyboard.down('Shift')
    if direction:
        await page.keyboard.down(direction)
    checkpoint('wait for actual ' + name + ' animation')
    await page.wait_for_function(
        '(expected) => {const p=window.__THREE_GAME_DIAGNOSTICS__.state.player; return p.animation===expected && (expected!=="Idle" || p.speed<.08)}',
        arg=expected, timeout=6000,
    )
    before = await read_state(page)
    phase['beforeCapture'] = {'seconds': time.monotonic() - started, 'player': before['player']}
    checkpoint('actual ' + name + ' observed before capture')
    done = asyncio.Event()
    held_direction = direction

    async def watch_path():
        nonlocal held_direction
        while not done.is_set():
            sample = await read_state(page)
            player = sample['player']
            phase['samples'].append({'seconds': time.monotonic() - started, 'player': player})
            # Ordinary key events, with a turn well before the bounds if capture is slow.
            if held_direction and ((held_direction == 'w' and player['z'] < -30) or
                                   (held_direction == 's' and player['z'] > 30)):
                previous = held_direction
                await page.keyboard.up(previous)
                held_direction = 's' if previous == 'w' else 'w'
                await page.keyboard.down(held_direction)
                phase['directionChanges'].append({'seconds': time.monotonic() - started,
                                                 'from': previous, 'to': held_direction,
                                                 'player': player})
            await asyncio.sleep(.15)

    guard = asyncio.create_task(watch_path())
    filename = f"frame-{len(report['frames']):03d}.png"
    began = time.monotonic()
    try:
        await page.screenshot(path=str(out / filename), timeout=10000)
        completed = time.monotonic()
        after = await read_state(page)
        phase['afterCapture'] = {'seconds': time.monotonic() - started, 'player': after['player']}
        moved = ((after['player']['x'] - before['player']['x']) ** 2 +
                 (after['player']['z'] - before['player']['z']) ** 2) ** .5
        phase['displacementMetres'] = moved
        phase['confirmed'] = before['player']['animation'] == expected and after['player']['animation'] == expected
        if name == 'stop':
            phase['confirmed'] = phase['confirmed'] and after['player']['speed'] < .08 and moved < .03
        else:
            phase['confirmed'] = phase['confirmed'] and moved > .1
        report['frames'].append({'file': filename, 'seconds': completed - started,
                                 'captureSeconds': completed - began, 'input': name,
                                 'player': after['player'], 'playerBeforeCapture': before['player']})
    finally:
        done.set()
        try:
            await guard
        finally:
            # Release even when the screenshot, diagnostic read or path guard fails.
            await release_inputs(page)
            phase['finalDirection'] = held_direction
            checkpoint(name + ' inputs released')
    return held_direction


async def capture():
    global started
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle',
            '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
        ])
        report['version'] = browser.version
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()
        page.set_default_timeout(15000)
        page.on('pageerror', lambda error: report['errors'].append(str(error)))
        try:
            await page.goto((game / 'dist/TOGO_LIFE_MONTAGNE.html').as_uri() + '?qa=1', wait_until='commit')
            await page.wait_for_selector('#start[open]')
            await page.click('#startBtn')
            await page.wait_for_selector('#start[open]', state='hidden')
            await page.wait_for_function('!!window.__THREE_GAME_DIAGNOSTICS__')
            # Align through the actual drag control, so W/S holds the sidewalk's x.
            state = await read_state(page)
            yaw = state.get('camera', {}).get('yaw')
            if yaw is None:
                raise AssertionError('Read-only camera yaw is required to verify the safe route')
            free = await page.evaluate("document.elementFromPoint(640,324)===document.getElementById('world')")
            if not free:
                raise AssertionError('Camera drag origin is covered by the interface')
            await page.mouse.move(640, 324)
            await page.mouse.down()
            try:
                await page.mouse.move(640 + yaw / .006, 324, steps=4)
            finally:
                await page.mouse.up()
            aligned = await read_state(page)
            report['route'] = {'method': 'Actual camera drag then W/S on the spawn sidewalk',
                               'before': state['camera'], 'after': aligned['camera'],
                               'corridorX': aligned['player']['x'], 'turnBackAtZ': [-30, 30]}
            if abs(aligned['camera']['yaw']) > .001:
                raise AssertionError('Camera drag did not align the walking direction')
            started = time.monotonic()
            await capture_phase(page, 'walk', 'w')
            state = await read_state(page)
            run_direction = 'w' if state['player']['z'] >= 0 else 's'
            last_run_direction = await capture_phase(page, 'run', run_direction)
            await capture_phase(page, 'turn', 's' if last_run_direction == 'w' else 'w')
            await capture_phase(page, 'stop')
            report['phaseCoverage'] = sorted({phase['input'] for phase in report['phases']})
            observed = [frame['player']['animation'] for frame in report['frames']]
            observed += [phase['beforeCapture']['player']['animation'] for phase in report['phases'] if 'beforeCapture' in phase]
            report['animationCoverage'] = sorted(set(observed))
            report['completeLocomotion'] = (set(report['phaseCoverage']) == {'walk', 'run', 'turn', 'stop'}
                and {'Idle', 'Walk', 'Run'}.issubset(report['animationCoverage'])
                and all(phase['confirmed'] for phase in report['phases']) and not report['errors'])
        finally:
            try:
                await release_inputs(page)
            finally:
                await context.close()
                await browser.close()


try:
    checkpoint('launch real locomotion capture')
    asyncio.run(capture())
    lines = []
    for i, frame in enumerate(report['frames']):
        lines.append("file '" + str(out / frame['file']).replace("'", "'\\''") + "'")
        duration = report['frames'][i + 1]['seconds'] - frame['seconds'] if i + 1 < len(report['frames']) else .1
        lines.append(f'duration {duration:.6f}')
    lines.append("file '" + str(out / report['frames'][-1]['file']) + "'")
    manifest = out / 'frames.ffconcat'
    manifest.write_text('\n'.join(lines) + '\n')
    encoded = subprocess.run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(manifest),
        '-vf', 'scale=960:-2', '-c:v', 'libvpx-vp9', '-b:v', '1M', '-fps_mode', 'vfr',
        str(out / 'locomotion.webm')], capture_output=True, text=True, timeout=20)
    if encoded.returncode:
        raise RuntimeError(encoded.stderr[-2000:])
    report['status'] = 'pass' if report['completeLocomotion'] else 'partial'
    report['durationSeconds'] = report['frames'][-1]['seconds'] - report['frames'][0]['seconds']
except Exception as error:
    report['status'] = 'failed'
    report['error'] = str(error)
    report['traceback'] = traceback.format_exc()
finally:
    checkpoint(report['status'])
    print(json.dumps({'status': report['status'], 'frames': len(report['frames'])}), flush=True)
if report['status'] != 'pass':
    raise SystemExit(1)
