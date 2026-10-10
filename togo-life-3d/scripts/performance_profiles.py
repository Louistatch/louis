"""Compare actual offline game quality profiles using only product UI controls.

No movement, teleportation, renderer mutation or inferred FPS. Run after build.
The reported FPS is the game's rolling active-RAF measurement, not hardware
Android performance. Samples are sequential: traffic/NPC positions evolve.
"""
import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import time
import traceback

from playwright.sync_api import sync_playwright

GAME = Path(__file__).resolve().parents[1]
FLAGS = ["--no-sandbox", "--disable-dev-shm-usage", "--use-gl=angle",
         "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
READ_SAMPLE = """() => {
 const d=window.__THREE_GAME_DIAGNOSTICS__,c=document.getElementById('world');
 const gl=c.getContext('webgl2')||c.getContext('webgl');
 const ext=gl&&gl.getExtension('WEBGL_debug_renderer_info');
 return {state:d.state,renderer:{calls:d.renderer.render.calls,
 triangles:d.renderer.render.triangles,memory:{...d.renderer.memory}},
 framebuffer:{width:c.width,height:c.height,drawingBufferWidth:gl?.drawingBufferWidth,
 drawingBufferHeight:gl?.drawingBufferHeight,cssWidth:c.clientWidth,cssHeight:c.clientHeight,
 devicePixelRatio:devicePixelRatio},gpu:gl?{vendor:ext?gl.getParameter(ext.UNMASKED_VENDOR_WEBGL):null,
 renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):null,
 maskedVendor:gl.getParameter(gl.VENDOR),maskedRenderer:gl.getParameter(gl.RENDERER),
 debugExtensionAvailable:!!ext}:null,
 openDialogs:[...document.querySelectorAll('dialog[open]')].map(x=>x.id),
 visibility:document.visibilityState};
}"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--entry', type=Path, default=GAME/'dist/TOGO_LIFE_MONTAGNE.html')
    parser.add_argument('--out', type=Path, default=GAME/'artifacts/performance-profiles.json')
    args = parser.parse_args()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    started = time.monotonic()
    report = {'status':'running','engine':'chromium','transport':'offline-file',
              'launchFlags':FLAGS,'viewport':{'width':1440,'height':900},
              'sampleSeconds':10,'profiles':{},'errors':[],
              'performanceMethod':'Product diagnostic rolling mean of up to 180 active RAF intervals; each profile runs for 10 wall-clock seconds after resuming. No FPS inferred from draw calls.',
              'limitations':['Software Chromium renderer; not physical Android or hardware GPU validation.',
                             'Sequential samples have evolving NPC and traffic positions; camera and player remain fixed.',
                             'Renderer.info counts are latest render-pass counters, not GPU timings or guaranteed total multipass calls.']}

    def checkpoint(stage):
        report['stage']=stage
        report['elapsedSeconds']=round(time.monotonic()-started,3)
        args.out.write_text(json.dumps(report,ensure_ascii=False,indent=2))
        print('PERFORMANCE_PROFILES',stage,flush=True)

    def remaining():
        seconds=90-(time.monotonic()-started)
        if seconds<=0:
            raise TimeoutError('90-second probe budget exhausted')
        return min(10000,max(1,int(seconds*1000)))

    try:
        entry=args.entry.resolve()
        data=entry.read_bytes()
        report.update(entryUrl=entry.as_uri()+'?qa=1',entryBytes=len(data),
                      entrySha256=hashlib.sha256(data).hexdigest(),sourceSha=os.environ.get('TOGO_SOURCE_SHA'))
        if not report['sourceSha']:
            report['sourceSha']=subprocess.check_output(['git','rev-parse','HEAD'],cwd=GAME,text=True,timeout=5).strip()
        report['sourceDirty']=bool(subprocess.check_output(['git','status','--porcelain','--untracked-files=no'],cwd=GAME,text=True,timeout=5).strip())
        checkpoint('launch bundled Chromium')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(headless=True,args=FLAGS,timeout=remaining())
            report['version']=browser.version
            context=browser.new_context(viewport=report['viewport'],device_scale_factor=1)
            page=context.new_page()
            page.set_default_timeout(10000)
            page.on('pageerror',lambda e:report['errors'].append(str(e)))
            checkpoint('navigate real monofile')
            load_started=time.monotonic()
            page.goto(report['entryUrl'],wait_until='commit',timeout=remaining())
            page.wait_for_selector('#start[open]',timeout=remaining())
            page.wait_for_function("document.getElementById('previewStatus').textContent.includes('aperçu en direct')",timeout=remaining())
            page.wait_for_function('!!window.__THREE_GAME_DIAGNOSTICS__',timeout=remaining())
            report['onboardingSeconds']=round(time.monotonic()-load_started,3)
            checkpoint('start through real button')
            page.locator('#startBtn').click(timeout=remaining())
            page.wait_for_selector('#start[open]',state='hidden',timeout=remaining())
            initial=page.evaluate(READ_SAMPLE)
            report['initialPlayer']=initial['state']['player']
            if initial['state']['quality']!='balanced':
                raise AssertionError('Default profile is not balanced')

            def select_profile(value):
                page.locator('#pauseBtn').click(timeout=remaining())
                page.wait_for_selector('#pause[open]',timeout=remaining())
                page.locator('#quality').select_option(value,timeout=remaining())
                page.locator('#pause button[data-close="pause"]').click(timeout=remaining())
                page.wait_for_selector('#pause[open]',state='hidden',timeout=remaining())

            for quality in ['balanced','low','high']:
                checkpoint('prepare '+quality)
                if quality!='balanced':
                    select_profile(quality)
                before=page.evaluate(READ_SAMPLE)
                if before['openDialogs'] or before['visibility']!='visible':
                    raise AssertionError('Profile sample is not an active visible game')
                if remaining()<10000:
                    raise TimeoutError('Insufficient budget for full 10-second sample')
                sample_started=time.monotonic()
                page.wait_for_timeout(10000)
                sample=page.evaluate(READ_SAMPLE)
                sample['sampleWallSeconds']=round(time.monotonic()-sample_started,3)
                sample['beforePlayer']=before['state']['player']
                report['profiles'][quality]=sample
                checkpoint('sampled '+quality)
                if sample['state']['quality']!=quality or sample['openDialogs']:
                    raise AssertionError('Profile changed or sample was paused')
                player=sample['state']['player']
                origin=report['initialPlayer']
                if any(abs(player[k]-origin[k])>1e-6 for k in ['x','z']):
                    raise AssertionError('Player moved during fixed-camera comparison')
                perf=sample['state']['performance']
                if not all(isinstance(perf.get(k),(int,float)) and math.isfinite(perf[k]) and perf[k]>0 for k in ['fps','frameMs']):
                    raise AssertionError('Missing finite measured RAF performance')
            checkpoint('restore balanced through product menu')
            select_profile('balanced')
            report['restored']=page.evaluate(READ_SAMPLE)
            if report['restored']['state']['quality']!='balanced' or report['restored']['openDialogs']:
                raise AssertionError('Balanced profile was not restored and resumed')
            context.close()
            browser.close()
        if report['errors']:
            raise AssertionError('Browser page errors recorded')
        report['status']='pass'
        checkpoint('complete')
    except Exception as error:
        report['status']='failed'
        report['errors'].append(str(error))
        report['traceback']=traceback.format_exc()
        checkpoint('failed')
    return 0 if report['status']=='pass' else 1


if __name__=='__main__':
    raise SystemExit(main())
