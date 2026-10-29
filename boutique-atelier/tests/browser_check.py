from pathlib import Path
import json,base64,mimetypes,os
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist' if (ROOT/'dist').exists() else ROOT;QA=ROOT/'qa';QA.mkdir(exist_ok=True)
Image.new('RGB',(120,160),(160,185,210)).save(QA/'test-photo.png')
OWNER='11111111-1111-4111-8111-111111111111'
products=[{'id':'22222222-2222-4222-8222-222222222222','name':'Chemise réelle test','category':'Chemise','description':'Photo fournie par le vendeur.','price':18000,'status':'published','media':[{'path':OWNER+'/33333333-3333-4333-8333-333333333333.webp','kind':'image','name':'chemise.webp'}],'created_at':'2026-10-29T00:00:00Z','updated_at':'2026-10-29T00:00:00Z','atelier_variants':[{'size':'M','color':'Bleu','stock':3},{'size':'L','color':'Bleu','stock':2}]}]
errors=[];requests=[];saved=[];authorized=True
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox']) if os.environ.get('ATELIER_CI_BROWSER')=='1' else pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1440,'height':1100})
 def route_handler(route):
  global authorized
  r=route.request;u=r.url;requests.append(u)
  if u.startswith('https://atelier.test/'):
   name=u.split('https://atelier.test/',1)[1].split('?',1)[0] or 'index.html'
   if name=='backend-config.js':return route.fulfill(content_type='text/javascript',body="export const BACKEND={url:'https://backend.test',key:'sb_publishable_test',bucket:'atelier-media'};")
   p=DIST/name
   if p.is_file():return route.fulfill(content_type=mimetypes.guess_type(str(p))[0] or 'text/plain',body=p.read_bytes())
   return route.fulfill(status=404,body='Not found')
  if u.startswith('https://backend.test/'):
   body=r.post_data_json if r.headers.get('content-type','').startswith('application/json') else None
   if '/auth/v1/token?' in u:
    authorized=body['email']=='owner@example.com'
    return route.fulfill(json={'access_token':'test-access','refresh_token':'test-refresh','user':{'id':OWNER}})
   if u.endswith('/auth/v1/user'):return route.fulfill(json={'id':OWNER})
   if 'atelier_admins?' in u:return route.fulfill(json=[{'user_id':OWNER}] if authorized else [])
   if 'atelier_products?' in u:return route.fulfill(json=[p for p in products if 'status=eq.published' not in u or p['status']=='published'])
   if 'atelier_settings?' in u:return route.fulfill(json=[{'brand':'ATELIER TEST','whatsapp':'22890123456'}])
   if 'token=fixture' in u:return route.fulfill(content_type='image/png',body=(QA/'test-photo.png').read_bytes())
   if '/storage/v1/object/sign/' in u:return route.fulfill(json={'signedURL':'/object/sign/atelier-media/test-photo.webp?token=fixture'})
   if '/storage/v1/object/' in u:return route.fulfill(json={'Key':'uploaded'})
   if '/rpc/atelier_save_product' in u:
    p=body['p_product'].copy();p['id']=p.get('id') or '44444444-4444-4444-8444-444444444444';p['atelier_variants']=body['p_variants'];p['updated_at']='2026-10-29T01:00:00Z';p['created_at']=p['updated_at'];products[:]=[x for x in products if x['id']!=p['id']];products.append(p);saved.append(body)
    return route.fulfill(json=p)
   if '/auth/v1/logout' in u:return route.fulfill(json={})
   return route.fulfill(status=404,json={'message':'Unexpected endpoint'})
  return route.abort()
 context.route('**/*',route_handler)
 page=context.new_page();page.on('pageerror',lambda err: errors.append(str(err)))
 page.goto('https://atelier.test/');page.get_by_role('button',name='Chemise réelle test, 18').wait_for()
 page.locator('#catalog .card').click();page.locator('#sizes button').filter(has_text='M').click();page.locator('#add-cart').click();assert page.locator('#cart-count').inner_text()=='1'
 page.locator('#cart-open').click();page.locator('#checkout-open').click();page.locator('[name=name]').fill('Client de test');page.locator('[name=phone]').fill('90000000');page.locator('[name=address]').fill('Lomé');page.locator('[type=checkbox]').check();page.locator('#checkout-form button').click();page.locator('#order-result').wait_for(state='visible');assert 'NON EFFECTUÉ' in page.locator('#order-summary').inner_text();assert 'NON RÉSERVÉ' in page.locator('#order-summary').inner_text();assert 'wa.me/22890123456' in page.locator('#whatsapp-order').get_attribute('href')
 page.locator('#checkout-modal [data-close]').click();page.screenshot(path=str(QA/'boutique-desktop.png'),full_page=True)
 page.goto('https://atelier.test/admin.html');page.locator('#login-form [name=email]').fill('intrus@example.com');page.locator('#login-form [name=password]').fill('incorrect-role-password');page.locator('#login-button').click();page.wait_for_timeout(800);print(json.dumps({'auth_notice':page.locator('#notice').inner_text(),'errors':errors,'recent_requests':requests[-12:]},ensure_ascii=False),flush=True);page.get_by_role('status').filter(has_text='droits administrateur').wait_for();assert page.locator('#dashboard').is_hidden()
 page.locator('#login-form [name=email]').fill('owner@example.com');page.locator('#login-form [name=password]').fill('example-owner-password');page.locator('#login-button').click();page.locator('#new-product').wait_for(state='visible')
 page.locator('#product-list button').first.click();assert page.locator('#variant-grid input').first.input_value()=='3';page.locator('#back-list').click()
 page.locator('#new-product').click();page.locator('#product-form [name=name]').fill('Robe de test');page.locator('#product-form [name=category]').fill('Robe');page.locator('#product-form [name=price]').fill('25000');page.locator('#product-form [name=description]').fill('Vêtement de test avec photo importée.');page.locator('#photos').set_input_files(str(QA/'test-photo.png'));page.locator('#media-list img').wait_for();page.locator('#variant-grid input').first.fill('4');page.locator('#product-form [name=status]').select_option('published');page.locator('#save-product').click();page.locator('#new-product').wait_for(state='visible');assert saved and saved[-1]['p_product']['media'][0]['kind']=='image';assert saved[-1]['p_variants'][0]['stock']==4
 page.screenshot(path=str(QA/'admin-desktop.png'),full_page=True)
 page.locator('#logout').click();page.locator('#login-panel').wait_for(state='visible');assert page.locator('#dashboard').is_hidden()
 mobile=context.new_page(viewport={'width':390,'height':844});mobile.on('pageerror',lambda err: errors.append(str(err)));mobile.goto('https://atelier.test/');mobile.locator('#catalog .card').first.wait_for();mobile.screenshot(path=str(QA/'boutique-mobile.png'),full_page=True);assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth+2')
 mobile.goto('https://atelier.test/admin.html');mobile.locator('#login-panel').wait_for();mobile.screenshot(path=str(QA/'admin-mobile.png'),full_page=True);assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth+2')
 assert not errors,errors
 report={'status':'passed','backend':'mock HTTP, not live Supabase','checks':['catalogue publié','fiche et variantes','panier','demande non payée non réservée','WhatsApp','refus non-admin','connexion propriétaire','conservation stocks à l’édition','import photo compressée','sauvegarde atomique RPC','déconnexion','mobile sans débordement'],'page_errors':errors,'saved_products':len(saved)}
 (QA/'browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False));browser.close()
