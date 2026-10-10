"""Verify public delivery of the exact authored build; does not claim browser QA."""
import hashlib, json, os, urllib.request
from pathlib import Path

game=Path(__file__).resolve().parents[1]
revision=os.environ.get('TOGO_SOURCE_SHA','feat/togo-life-interface-jeu')
expected=hashlib.sha256((game/'dist/TOGO_LIFE_MONTAGNE.html').read_bytes()).hexdigest()
report={'expectedSha256':expected,'checks':[],'browserValidated':False}
urls=([os.environ['TOGO_PREVIEW_URL']] if os.environ.get('TOGO_PREVIEW_URL') else [])+[f'https://raw.githack.com/Louistatch/louis/{revision}/togo-life-3d/TOGO_LIFE_MONTAGNE.html',
      f'https://rawcdn.githack.com/Louistatch/louis/{revision}/togo-life-3d/TOGO_LIFE_MONTAGNE.html']
for url in urls:
    row={'url':url}
    try:
        with urllib.request.urlopen(url,timeout=15) as response:
            data=response.read(3_000_001)
            row.update(status=response.status,mime=response.headers.get('Content-Type'),bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
            row['matchesBuild']=row['sha256']==expected
    except Exception as e:row['error']=str(e)
    report['checks'].append(row)
out=game/'artifacts/public-preview.json'
out.write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
if not any(c.get('matchesBuild') and c.get('status')==200 and 'text/html' in c.get('mime','') for c in report['checks']):raise SystemExit(1)
