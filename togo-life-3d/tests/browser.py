"""Real-input QA; run only on an executor allowing Chromium sockets.
No screenshots or performance claims exist until this script succeeds.
python tests/browser.py --url http://127.0.0.1:8000/dist/
"""
import argparse,json,time,math,traceback,mimetypes,os
from urllib.parse import urlsplit,unquote
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:8000/dist/');parser.add_argument('--browser',default=None,help='Optional Chromium executable path');parser.add_argument('--output-dir',default=None);parser.add_argument('--static-root',default=None,help='Serve real built assets through an explicit Playwright fixture');args=parser.parse_args()
output=Path(args.output_dir).resolve() if args.output_dir else Path(__file__).resolve().parents[1]/'artifacts';output.mkdir(parents=True,exist_ok=True)
report={'status':'running','checks':[],'captures':[],'errors':[], 'network':[], 'browserEvents':[]}
report['transport']='playwright-static-fixture' if args.static_root else 'http'
report['headSha']=os.environ.get('GITHUB_SHA')
fixture_root=Path(args.static_root).resolve() if args.static_root else None
if fixture_root:args.url='http://togo-life.test/'
report['entryUrl']=args.url
report['fixtureRequests']=[]
page=None
def install_transport(context):
 if fixture_root is None:return
 def serve(route):
  request_path=unquote(urlsplit(route.request.url).path).lstrip('/') or 'index.html'
  asset=(fixture_root/request_path).resolve()
  if not asset.is_relative_to(fixture_root):
   route.fulfill(status=403,body='Outside asset fixture');return
  if asset.is_dir():asset=asset/'index.html'
  if not asset.is_file():
   report['fixtureRequests'].append({'path':request_path,'status':404});route.fulfill(status=404,body='Asset not found');return
  mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.gltf':'model/gltf+json','.glb':'model/gltf-binary'}.get(asset.suffix,mimetypes.guess_type(str(asset))[0] or 'application/octet-stream')
  report['fixtureRequests'].append({'path':request_path,'status':200,'mime':mime,'bytes':asset.stat().st_size})
  route.fulfill(status=200,path=str(asset),content_type=mime)
 context.route('http://togo-life.test/**',serve)
def observe_page(page):
 page.on('requestfailed',lambda request:report['network'].append({'event':'requestfailed','url':request.url,'failure':request.failure}))
 page.on('response',lambda response:report['network'].append({'event':'response','url':response.url,'status':response.status,'mime':response.headers.get('content-type'),'contentDisposition':response.headers.get('content-disposition')}) if response.request.is_navigation_request() or response.status>=400 else None)
 page.on('crash',lambda:report['browserEvents'].append('page crashed'))
 page.on('close',lambda:report['browserEvents'].append('page closed'))
 page.on('download',lambda download:report['browserEvents'].append({'event':'download','url':download.url,'filename':download.suggested_filename}))
 page.on('pageerror',lambda error:report['errors'].append(str(error)))
 page.on('console',lambda message:report['errors'].append(message.text) if message.type=='error' else None)
def goto_game(page):
 page.goto(args.url+'?qa=1',wait_until='domcontentloaded',timeout=60000)
 page.wait_for_selector('#start[open]',timeout=60000)
 page.wait_for_function('!!window.__THREE_GAME_DIAGNOSTICS__',timeout=60000)
def check(name,condition):
 report['checks'].append({'name':name,'pass':bool(condition)})
 if not condition:raise AssertionError(name)
try:
 with sync_playwright() as p:
  try:
   browser_path=args.browser or ('/usr/bin/chromium' if Path('/usr/bin/chromium').is_file() else None)
   browser=p.chromium.launch(executable_path=browser_path,headless=True,args=['--no-sandbox','--disable-crashpad-for-testing','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
   browser.on('disconnected',lambda:report['browserEvents'].append('browser disconnected'))
   context=browser.new_context(viewport={'width':1440,'height':900},record_video_dir=str(output/'motion'))
   install_transport(context)
   page=context.new_page();observe_page(page);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
   start=time.monotonic();goto_game(page);report['loadSeconds']=time.monotonic()-start
   preview=page.locator('#start canvas, #start [data-avatar-preview]').first
   check('avatar preview visible before start',preview.is_visible())
   page.wait_for_function('document.querySelector("#previewStatus").textContent.includes("aperçu en direct")',timeout=30000)
   page.screenshot(path=str(output/'desktop-start.png'));report['captures'].append('desktop-start.png')
   page.select_option('#shirt','#217d7b');page.select_option('#skin','#936044');page.click('#startBtn');page.wait_for_selector('#start[open]',state='hidden');page.wait_for_timeout(500)
   def state():return page.evaluate('window.__THREE_GAME_DIAGNOSTICS__.state')
   check('start preserves selected avatar appearance',state()['simulation']['appearance']=={'shirt':'#217d7b','skin':'#936044'})
   def same_position(a,b):return math.hypot(a['x']-b['x'],a['z']-b['z'])<.02
   def target_without_teleport():
    before=state()['player'];buttons=page.locator('[data-target]:visible');check('map has local destination controls',buttons.count()>0);buttons.first.click();page.wait_for_timeout(200);check('destination sets orientation without teleport',same_position(before,state()['player']))
   check('local mini-map visible',page.locator('#minimap, #miniMap, [data-minimap]').first.is_visible())
   page.locator('#quartierBtn, #mapBtn').first.click();page.wait_for_selector('#map[open]');page.screenshot(path=str(output/'local-map.png'));report['captures'].append('local-map.png');target_without_teleport()
   if page.locator('#map').evaluate('(d)=>d.open'):page.locator('#map [data-close]').first.click()
   page.click('#lifeBtn');page.wait_for_selector('#life[open]');life_text=page.locator('#life').inner_text().lower()
   check('profile panel explains needs',all(t in life_text for t in ['énergie','satiété']))
   page.click('#tab-business');business_text=page.locator('#life-business').inner_text().lower()
   check('commerce panel explains stock and money',all(t in business_text for t in ['stock','recettes']) and ('dépenses' in business_text or 'coûts' in business_text))
   page.screenshot(path=str(output/'life-commerce.png'));report['captures'].append('life-commerce.png')
   before_money=state()['simulation']['money'];before_pos=state()['player'];life_targets=page.locator('#life [data-target]:visible')
   if life_targets.count():life_targets.first.click();page.wait_for_timeout(200)
   check('management never performs remote transactions',state()['simulation']['money']==before_money and same_position(before_pos,state()['player']))
   if page.locator('#life').evaluate('(d)=>d.open'):page.locator('#life [data-close]').first.click()
   camera_before=page.locator('#cameraBtn').get_attribute('aria-pressed');before=state()['player'];page.click('#cameraBtn');page.wait_for_timeout(300)
   check('overview toggle has observable state',camera_before in ['true','false'] and page.locator('#cameraBtn').get_attribute('aria-pressed')!=camera_before)
   page.screenshot(path=str(output/'overview.png'));report['captures'].append('overview.png')
   check('overview does not move avatar',same_position(before,state()['player']));page.click('#cameraBtn');check('overview returns to initial camera mode',page.locator('#cameraBtn').get_attribute('aria-pressed')==camera_before)
   initial=state()['player'];page.keyboard.down('w');page.wait_for_timeout(1400);page.keyboard.up('w');moved=state()['player'];check('walk changes position',math.hypot(initial['x']-moved['x'],initial['z']-moved['z'])>1)
   page.keyboard.down('Shift');page.keyboard.down('w');page.wait_for_timeout(1000);check('run state',state()['player']['animation']=='Run');page.keyboard.up('w');page.keyboard.up('Shift');page.wait_for_timeout(500);check('progressive stop',state()['player']['speed']<.1)
   def walk_to(x,z):
    end=time.monotonic()+40
    while time.monotonic()<end:
     pos=state()['player'];dx=x-pos['x'];dz=z-pos['z'];dist=math.hypot(dx,dz)
     if dist<.65:return
     ix=dx*math.cos(.2)-dz*math.sin(.2);iz=dx*math.sin(.2)+dz*math.cos(.2)
     chosen=[]
     if abs(ix)>.35*dist:chosen.append('d' if ix>0 else 'a')
     if abs(iz)>.35*dist:chosen.append('s' if iz>0 else 'w')
     for key in chosen:page.keyboard.down(key)
     page.wait_for_timeout(160)
     for key in chosen:page.keyboard.up(key)
    raise AssertionError('real-input route blocked')
   walk_to(-7,0);walk_to(-15,0);page.keyboard.press('e')
   disabled=page.locator('#choices button:disabled')
   check('disabled choices include visible reasons',disabled.evaluate_all('bs=>bs.every(b=>{const r=b.querySelector("small,.reason,[data-reason]")||b.parentElement.querySelector("small,.reason,[data-reason]");return r&&r.textContent.trim()&&getComputedStyle(r).display!=="none"})'))
   page.get_by_role('button',name='Acheter 4 produits').click();check('market buy debits 1400 F',state()['simulation']['money']==13600)
   walk_to(-7,0);walk_to(-7,25);walk_to(-13,25);page.keyboard.press('e')
   disabled=page.locator('#choices button:disabled');check('kiosk has disabled unavailable actions',disabled.count()>0)
   check('unavailable commerce actions explain reason',disabled.evaluate_all('bs=>bs.every(b=>{const r=b.querySelector(".reason");return r&&r.textContent.trim()&&getComputedStyle(r).display!=="none"})'))
   page.get_by_role('button',name='Ouvrir mon comptoir').click();page.keyboard.press('e');page.get_by_role('button',name='Déposer mon sac').click();check('physical delivery stocks kiosk',state()['simulation']['stock']==4)
   page.wait_for_function('window.__THREE_GAME_DIAGNOSTICS__.state.simulation.sales > 0',timeout=60000);check('demand makes sales',state()['simulation']['sales']>0)
   page.screenshot(path=str(output/'desktop-active.png'));report['captures'].append('desktop-active.png');before=state()['npcs'];page.wait_for_timeout(2000);after=state()['npcs'];check('NPC routines move',any(abs(a['z']-b['z'])>.1 for a,b in zip(before,after)))
   page.click('#pauseBtn');before=state()['simulation'];page.wait_for_timeout(1000);check('pause freezes economy',state()['simulation']==before);page.get_by_role('button',name='Reprendre',exact=True).click()
   page.click('#lifeBtn');page.click('#shareBtn');page.wait_for_selector('#share[open]');check('share excludes personal name',state()['simulation']['name'] not in page.locator('#whatsapp').get_attribute('href'));page.screenshot(path=str(output/'share-card.png'));report['captures'].append('share-card.png');page.locator('#share [data-close]').first.click()
   report['desktop']=state();report['renderer']=page.evaluate('({calls:window.__THREE_GAME_DIAGNOSTICS__.renderer.render.calls,triangles:window.__THREE_GAME_DIAGNOSTICS__.renderer.render.triangles,memory:window.__THREE_GAME_DIAGNOSTICS__.renderer.memory})')
   saved=state()['simulation'];page.reload(wait_until='domcontentloaded',timeout=60000);page.wait_for_selector('#start[open]',timeout=60000);page.click('#continueBtn');page.wait_for_selector('#start[open]',state='hidden');check('save restores appearance',state()['simulation']['appearance']==saved['appearance']);check('save restores business',state()['simulation']['biz']==True)
   check('no console/page errors',not errors);report['errors']=errors;context.close()
   mobile=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1.5,is_mobile=True,has_touch=True);install_transport(mobile);page=mobile.new_page();observe_page(page);goto_game(page);page.click('#startBtn');page.wait_for_selector('#start[open]',state='hidden');page.wait_for_timeout(600);initial=state()['player']
   sizes=page.locator('nav button, #interactBtn, #runBtn').evaluate_all('bs=>bs.filter(b=>b.getBoundingClientRect().width).map(b=>({id:b.id,w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height}))')
   report['mobileControlSizes']=sizes;check('mobile controls have 48px touch targets',all(b['w']>=48 and b['h']>=48 for b in sizes))
   check('center of world remains unobstructed by HUD',page.evaluate('()=>{const x=innerWidth/2,y=innerHeight*.48;return ![...document.querySelectorAll("header,nav,#objectiveBtn,#radar,#cameraBtn,#status,#context,#joystick,#runBtn")].some(e=>{const r=e.getBoundingClientRect();return r.width&&x>r.left&&x<r.right&&y>r.top&&y<r.bottom})}'))
   joy=page.locator('#joystick').bounding_box();check('mobile joystick has 48px target',joy is not None and joy['width']>=48 and joy['height']>=48)
   touch=mobile.new_cdp_session(page);touch.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':joy['x']+joy['width']/2,'y':joy['y']+18,'id':7}]});page.wait_for_timeout(1200);touch.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]});page.wait_for_timeout(500)
   check('mobile joystick changes position',math.hypot(initial['x']-state()['player']['x'],initial['z']-state()['player']['z'])>.5);check('pointercancel stops movement',state()['player']['speed']<.1);check('responsive width',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   page.screenshot(path=str(output/'mobile-active.png'));report['captures'].append('mobile-active.png');report['mobile']=state();check('no mobile console/page errors',not report['errors']);page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(400)
   check('landscape joystick and run visible',page.locator('#joystick').is_visible() and page.locator('#runBtn').is_visible())
   check('landscape controls do not overlap dock',page.evaluate('()=>{const dock=document.querySelector("nav").getBoundingClientRect();return ["joystick","runBtn"].every(id=>{const r=document.getElementById(id).getBoundingClientRect();return !(r.left<dock.right&&r.right>dock.left&&r.top<dock.bottom&&r.bottom>dock.top)})}'))
   page.screenshot(path=str(output/'mobile-landscape.png'));report['captures'].append('mobile-landscape.png');report['status']='pass';mobile.close();browser.close()
  except Exception:
   if page is not None:
    try:
     report['failurePage']={'url':page.url,'closed':page.is_closed()}
     if not page.is_closed():
      report['failurePage'].update(page.evaluate('({contentType:document.contentType,title:document.title,body:document.body?.innerText?.slice(0,1500)})'))
      page.screenshot(path=str(output/'failure.png'),timeout=10000);report['captures'].append('failure.png')
    except Exception as diagnostic_error:report['failureCaptureError']=str(diagnostic_error)
   raise

except Exception as e:
 report['status']='blocked' if 'BrowserType.launch' in str(e) else 'failed';report['errors'].append(str(e));report['traceback']=traceback.format_exc()
finally:
 (output/'browser-results.json').write_text(json.dumps(report,indent=2,ensure_ascii=False));print(json.dumps({'status':report['status'],'checks':len(report['checks']),'captures':report['captures']}))
 if report['status']!='pass':raise SystemExit(1)
