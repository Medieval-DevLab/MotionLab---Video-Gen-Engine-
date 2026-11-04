// Renders one still per style demo (at its `still` time) into style-library/stills/<id>.jpg, 960x540. Uses the
// engine's Chrome helper read-only. usage: node style-library/demos/stills.mjs [id ...]   (wrap in the heavy lock)
import { launch, close } from '../../engine/render/chrome.mjs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { mkdirSync } from 'node:fs';
const HERE = dirname(fileURLToPath(import.meta.url)), OUT = join(HERE, '..', 'stills'), URL0 = pathToFileURL(join(HERE, 'demo.html')).href;
mkdirSync(OUT, { recursive: true });
const b = await launch();
try {
  const p = await b.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.setViewport({ width: 1920, height: 1080, deviceScaleFactor: .5 });
  await p.goto(URL0 + '#', { waitUntil: 'load' }); await p.waitForFunction('window.READY === true');
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : await p.evaluate(() => window.STYLE_IDS);
  for (const id of ids) {
    await p.goto('about:blank'); await p.goto(URL0 + '#' + id, { waitUntil: 'networkidle0' }); await p.waitForFunction('window.READY === true', { timeout: 30000 });
    await p.evaluate(() => window.render(window.STILL)); await new Promise((r) => setTimeout(r, 150));
    await p.screenshot({ path: join(OUT, id + '.jpg'), type: 'jpeg', quality: 82 }); console.log('still', id);
  }
  console.log(errs.length ? 'PAGE ERRORS:\n  ' + [...new Set(errs)].join('\n  ') : `${ids.length} stills, no page errors`);
} finally { await close(b); }
