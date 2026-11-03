// Every frame of a film page to an MP4 (silent). One worker: this machine has little free RAM. It prints a progress line
// every 150 frames, and Chrome cannot hang it (see chrome.mjs).
// usage: node engine/render/video.mjs films/<slug>/film.html [--fps 30] [--out <file>] [--from s --to s]
import { launch, close } from './chrome.mjs';
import { pathToFileURL } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawn, execFileSync } from 'node:child_process';

const args = process.argv.slice(2), page0 = args.shift();
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const FPS = +opt('--fps', 30), outDir = join(dirname(resolve(page0)), 'out'); mkdirSync(outDir, { recursive: true });
const out = resolve(opt('--out', join(outDir, 'picture.mp4')));

const browser = await launch();
const t0 = Date.now(); let n = 0, N = 0;
try {
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(page0)).href, { waitUntil: 'load' });
  await page.waitForFunction('window.READY === true', { timeout: 60000 });
  const meta = await page.evaluate(() => ({ dur: window.DUR, ev: window.EV, music: window.MUSIC || null, vo: window.VO || null }));
  writeFileSync(join(outDir, 'events.json'), JSON.stringify(meta, null, 1));
  const from = +opt('--from', 0), to = +opt('--to', meta.dur); N = Math.round((to - from) * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));
  for (n = 0; n < N; n++) {
    await page.evaluate((tt) => window.render(tt), from + n / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (n % 150 === 0 && n) { const s = (Date.now() - t0) / 1000; console.log(`  frame ${n}/${N} · ${s.toFixed(0)} s · eta ${(s / n * (N - n)).toFixed(0)} s`); } // a heartbeat every 5 s of film; no line = stalled
  }
  ff.stdin.end(); await done;
  if (errors.length) console.log('\nPAGE ERRORS:\n  ' + [...new Set(errors)].join('\n  '));
} finally { await close(browser); }
const got = parseInt(execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', out]).toString(), 10);
console.log(`\n${out}\n  frames ${got} (expected ${N}) ${got === N ? 'OK' : 'MISMATCH'} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
if (got !== N) process.exitCode = 1;
