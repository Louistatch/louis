"""Independent renderer diagnostic using the actual generated game, never a mock."""
import argparse, json, os, time, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

p=argparse.ArgumentParser()
p.add_argument('--engine', choices=['chromium','firefox'], required=True)
args=p.parse_args()
game=Path(__file__).resolve().parents[1]
out=game/'artifacts'
out.mkdir(exist_ok=True)
report={'engine':args.engine,'status':'running','errors':[],'captures':[],'sourceSha':os.environ.get('TOGO_SOURCE_SHA')}
def stage(label):
    report['stage']=label
    (out/f'probe-{args.engine}.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print('PROBE',args.engine,label,flush=True)

try:
    with sync_playwright() as pw:
        stage('launch bundled browser')
        opts={'headless':True}
        if args.engine=='chromium':
            opts['args']=['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
        browser=getattr(pw,args.engine).launch(**opts)
        report['version']=browser.version
        context=browser.new_context(viewport={'width':1440,'height':900})
        page=context.new_page()
        page.set_default_timeout(10000)
        page.on('pageerror',lambda e:report['errors'].append(str(e)))
        stage('minimal document control')
        page.set_content('<!doctype html><title>Browser diagnostic control</title><p>Control document: this is not TOGO LIFE.</p>',wait_until='domcontentloaded',timeout=10000)
        page.screenshot(path=str(out/f'control-{args.engine}.png'),timeout=10000)
        report['controlPassed']=True
        stage('navigate real offline game')
        started=time.monotonic()
        page.goto((game/'dist/TOGO_LIFE_MONTAGNE.html').as_uri()+'?qa=1',wait_until='commit',timeout=20000)
        stage('wait real onboarding and animated avatar')
        page.wait_for_selector('#start[open]',timeout=20000)
        page.wait_for_function('document.getElementById("previewStatus").textContent.includes("aperçu en direct")',timeout=20000)
        report['onboardingSeconds']=time.monotonic()-started
        name=f'probe-{args.engine}-start.png'
        page.screenshot(path=str(out/name),timeout=10000)
        report['captures'].append(name)
        stage('enter actual world')
        page.click('#startBtn')
        page.wait_for_selector('#start[open]',state='hidden')
        page.wait_for_timeout(1000)
        name=f'probe-{args.engine}-active.png'
        page.screenshot(path=str(out/name),timeout=10000)
        report['captures'].append(name)
        page.click('#cameraBtn')
        page.wait_for_timeout(500)
        name=f'probe-{args.engine}-overview.png'
        page.screenshot(path=str(out/name),timeout=10000)
        report['captures'].append(name)
        page.click('#businessBtn')
        name=f'probe-{args.engine}-commerce.png'
        page.screenshot(path=str(out/name),timeout=10000)
        report['captures'].append(name)
        report['state']=page.evaluate('window.__THREE_GAME_DIAGNOSTICS__.state')
        report['status']='pass'
        stage('real render and panels captured')
        context.close()
        browser.close()
except Exception as e:
    report['status']='failed'
    report['errors'].append(str(e))
    report['traceback']=traceback.format_exc()
    stage('failed')
finally:
    stage(report['status'])
if report['status']!='pass':raise SystemExit(1)
