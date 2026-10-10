"""Record real inputs as timed screenshots, then encode their actual cadence."""
import json, os, subprocess, time, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

game=Path(__file__).resolve().parents[1]
out=game/'artifacts/motion';out.mkdir(parents=True,exist_ok=True)
report={'status':'running','method':'Real Chromium screenshots; VFR durations from monotonic clock','frames':[],'sourceSha':os.environ.get('TOGO_SOURCE_SHA')}
try:
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        context=browser.new_context(viewport={'width':1280,'height':720})
        page=context.new_page();page.set_default_timeout(15000)
        page.goto((game/'dist/TOGO_LIFE_MONTAGNE.html').as_uri()+'?qa=1',wait_until='commit')
        page.wait_for_selector('#start[open]');page.click('#startBtn');page.wait_for_selector('#start[open]',state='hidden')
        started=time.monotonic();phase=None
        while time.monotonic()-started<7:
            elapsed=time.monotonic()-started
            next_phase='walk' if elapsed<2 else 'run' if elapsed<4 else 'turn' if elapsed<5.2 else 'stop'
            if next_phase!=phase:
                for key in ['w','a','Shift']:page.keyboard.up(key)
                if next_phase in ['walk','run']:page.keyboard.down('w')
                if next_phase=='run':page.keyboard.down('Shift')
                if next_phase=='turn':page.keyboard.down('a')
                phase=next_phase
            index=len(report['frames']);name=f'frame-{index:03d}.png'
            page.screenshot(path=str(out/name),timeout=10000)
            state=page.evaluate('window.__THREE_GAME_DIAGNOSTICS__.state')
            report['frames'].append({'file':name,'seconds':time.monotonic()-started,'input':phase,'player':state['player']})
            (out/'motion-results.json').write_text(json.dumps(report,indent=2))
            page.wait_for_timeout(80)
        context.close();browser.close()
    lines=[]
    for i,frame in enumerate(report['frames']):
        lines.append("file '"+str(out/frame['file']).replace("'","'\\''")+"'")
        duration=report['frames'][i+1]['seconds']-frame['seconds'] if i+1<len(report['frames']) else .1
        lines.append(f'duration {duration:.6f}')
    lines.append("file '"+str(out/report['frames'][-1]['file'])+"'")
    manifest=out/'frames.ffconcat';manifest.write_text('\n'.join(lines)+'\n')
    encoded=subprocess.run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(manifest),'-vf','scale=960:-2','-c:v','libvpx-vp9','-b:v','1M','-fps_mode','vfr',str(out/'locomotion.webm')],capture_output=True,text=True,timeout=20)
    if encoded.returncode:raise RuntimeError(encoded.stderr[-2000:])
    report['status']='pass'
    report['durationSeconds']=report['frames'][-1]['seconds']-report['frames'][0]['seconds']
except Exception as e:
    report['status']='failed';report['error']=str(e);report['traceback']=traceback.format_exc()
finally:
    (out/'motion-results.json').write_text(json.dumps(report,indent=2))
    print(json.dumps({'status':report['status'],'frames':len(report['frames'])}),flush=True)
if report['status']!='pass':raise SystemExit(1)
