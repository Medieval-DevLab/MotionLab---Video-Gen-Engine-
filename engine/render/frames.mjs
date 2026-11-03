// Stills from a film page at chosen times, plus the film's sound events.
// usage: node engine/render/frames.mjs films/<slug>/film.html <t> [<t> ...] [--range a:b:step] [--w 1920]
//   -> films/<slug>/out/stills/t_<t>.jpg and out/events.json
import { launch, close } from './chrome.mjs';
import { pathToFileURL } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2), page0 = args.shift();
const times = []; let width = 1920;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--range') { const [a, b, s] = args[++i].split(':').map(Number); for (let t = a; t <= b + 1e-9; t += s) times.push(+t.toFixed(3)); }
  else if (args[i] === '--w') width = +args[++i];
  else times.push(+args[i]);
}
const out = join(dirname(resolve(page0)), 'out'); mkdirSync(join(out, 'stills'), { recursive: true });
const browser = await launch();
try {
  const page = await browser.newPage(); const errors = [];
  page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(page0)).href, { waitUntil: 'load' });
  await page.waitForFunction('window.READY === true', { timeout: 60000 });
  const meta = await page.evaluate(() => ({ dur: window.DUR, ev: window.EV, music: window.MUSIC || null, vo: window.VO || null, texts: window.TEXTS_PLAN || [] })); // vo kept, so a mix after stills still has the voice
  writeFileSync(join(out, 'events.json'), JSON.stringify(meta, null, 1));
  for (const t of times) {
    await page.evaluate((tt) => window.render(tt), t);
    const f = join(out, 'stills', `t_${t.toFixed(2).padStart(6, '0')}.jpg`);
    await page.screenshot({ path: f, type: 'jpeg', quality: 90 });
  }
  console.log(`dur ${meta.dur}s · ${meta.ev.length} sound events · ${times.length} stills -> ${join(out, 'stills')}`);
  if (errors.length) { console.log('PAGE ERRORS:\n  ' + [...new Set(errors)].join('\n  ')); process.exitCode = 1; }
} finally { await close(browser); }
