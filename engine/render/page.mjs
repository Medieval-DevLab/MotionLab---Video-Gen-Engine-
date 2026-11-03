// Screenshot a long HTML page (e.g. a storyboard) in viewport-height slices, and report page errors.
// usage: node engine/render/page.mjs <page.html> <outDir> [--width 1320] [--slice 1400]
import { launch, close } from './chrome.mjs';
import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';
import { mkdirSync } from 'node:fs';
const [page0, outDir, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(k); return i >= 0 ? +rest[i + 1] : d; };
const W = opt('--width', 1320), SL = opt('--slice', 1400);
mkdirSync(outDir, { recursive: true });
const browser = await launch();
try {
  const page = await browser.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message)); page.on('requestfailed', (r) => errs.push('request failed: ' + r.url()));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.setViewport({ width: W, height: SL, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(page0)).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < H; y += SL, i++) await page.screenshot({ path: join(outDir, `p${String(i).padStart(2, '0')}.png`), clip: { x: 0, y, width: W, height: Math.min(SL, H - y) }, captureBeyondViewport: true });
  console.log(`height ${H}px · ${i} slices -> ${outDir}`);
  if (errs.length) console.log('ERRORS:\n  ' + [...new Set(errs)].join('\n  '));
} finally { await close(browser); }
