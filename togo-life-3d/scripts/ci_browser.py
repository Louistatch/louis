"""Serve the built game and run browser QA on a compatible CI executor."""
import argparse
import functools
import http.server
import json
import subprocess
import sys
import threading
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--output-dir', default='artifacts')
parser.add_argument('--browser', default=None)
args = parser.parse_args()
game = Path(__file__).resolve().parents[1]
output = Path(args.output_dir)
if not output.is_absolute():
    output = game / output
output.mkdir(parents=True, exist_ok=True)
report_path = output / 'browser-results.json'
if report_path.exists():
    report_path.unlink()  # Do not reuse the outcome of a previous execution.

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

server = None
code = 1
try:
    handler = functools.partial(QuietHandler, directory=str(game))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    server.daemon_threads = True
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    command = [sys.executable, str(game / 'tests/browser.py'), '--url',
               f'http://127.0.0.1:{server.server_port}/dist/', '--output-dir', str(output)]
    if args.browser:
        command.extend(['--browser', args.browser])
    code = subprocess.run(command, cwd=game, timeout=240, check=False).returncode
except Exception as error:
    report_path.write_text(json.dumps({'status': 'failed', 'checks': [], 'captures': [],
                                      'errors': [str(error)]}, indent=2))
finally:
    if server:
        server.shutdown()
        server.server_close()
    if report_path.exists():
        report = json.loads(report_path.read_text())
    else:
        report = {'status': 'failed', 'checks': [], 'captures': [], 'errors': ['No browser report produced.']}
        report_path.write_text(json.dumps(report, indent=2))
    print(json.dumps({'status': report.get('status'), 'checks': len(report.get('checks', [])),
                      'captures': report.get('captures', []), 'exitCode': code}))
sys.exit(code)
