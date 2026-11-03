// Render HTML style frames to PNG at 1920x1080 with the installed Chrome.
// usage: node engine/render/still.mjs films/<slug>/frames/a.html[?bg=v1] [...]  ->  films/<slug>/frames/out/<name>[-v1].png
import { launch, close } from './chrome.mjs';
import { pathToFileURL } from 'node:url';
import { resolve, basename, dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
if (!args.length) { console.error('usage: node engine/render/still.mjs <frame.html[?bg=v1]> [...]'); process.exit(2); }

const browser = await launch();
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  for (const a of args) {
    const [f, q = ''] = a.split('?');
    const url = pathToFileURL(resolve(f)).href + (q ? '?' + q : '');
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const fontOk = await page.evaluate(() => document.fonts.check('600 72px Inter'));
    const tag = new URLSearchParams(q).get('bg');
    const outDir = join(dirname(resolve(f)), 'out'); mkdirSync(outDir, { recursive: true });
    const out = join(outDir, basename(f).replace(/\.html$/, tag ? `-${tag}.png` : '.png'));
    await page.screenshot({ path: out });
    console.log(`${out}  font Inter loaded: ${fontOk}`);
  }
} finally { await close(browser); }
