// Rendu image par image : node render.mjs [--preview t1,t2,...]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const FPS = 30;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0);
const url = `http://127.0.0.1:${server.address().port}/index.html`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(url);
await page.waitForFunction(() => window.__ready);

const prev = process.argv.indexOf('--preview');
if (prev > -1) {
  fs.mkdirSync(path.join(ROOT, 'out/preview'), { recursive: true });
  for (const t of process.argv[prev + 1].split(',').map(Number)) {
    await page.evaluate(t => window.__seek(t), t);
    await page.screenshot({ path: path.join(ROOT, `out/preview/t${t.toFixed(1)}.jpg`), type: 'jpeg', quality: 85 });
  }
} else {
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * FPS);
  fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', path.join(ROOT, 'out/video_silent.mp4')],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.__seek(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}
await browser.close();
server.close();
