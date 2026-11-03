// Regression check: the finished films must still render exactly as they did. Renders a fixed set of stills of each
// film with engine/render/frames.mjs and compares their sha256 with tools/regress-baseline.json. It takes the heavy
// lock first (one heavy job at a time), restores each film's out/events.json afterwards, and removes its stills.
// usage: node tools/regress.mjs            PASS/FAIL per frame; exit 1 on any mismatch
//        node tools/regress.mjs --update   record the current frames as the baseline
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync, rmdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), BASE = join(ROOT, 'tools', 'regress-baseline.json');
const FILMS = { motionlab: [3, 21, 56, 120, 170], aether: [5, 40, 70] };
const update = process.argv.includes('--update'), ID = 'regress';
const lock = (...a) => spawnSync('node', [join(ROOT, 'tools', 'heavy-lock.mjs'), ...a], { encoding: 'utf8' });
const name = (t) => `t_${t.toFixed(2).padStart(6, '0')}.jpg`;

// wait our turn for the lock (FIFO; the ticket stays alive while we retry)
for (let n = 0; lock('acquire', ID, 10).status !== 0; n++) { if (n % 6 === 0) console.log('waiting for the heavy lock…'); await new Promise((r) => setTimeout(r, 5000)); }
const got = {};
try {
  for (const [film, times] of Object.entries(FILMS)) {
    const out = join(ROOT, 'films', film, 'out'), stills = join(out, 'stills'), ev = join(out, 'events.json');
    const keep = existsSync(ev) ? readFileSync(ev) : null;
    console.log(`${film}: rendering ${times.length} stills…`);
    const r = spawnSync('node', [join(ROOT, 'engine', 'render', 'frames.mjs'), `films/${film}/film.html`, ...times.map(String)], { cwd: ROOT, stdio: 'inherit' });
    if (r.status !== 0) { console.log(`FAIL ${film}: the render failed (exit ${r.status})`); process.exitCode = 1; }
    for (const t of times) { const f = join(stills, name(t)); if (existsSync(f)) { got[`${film}@${t}`] = createHash('sha256').update(readFileSync(f)).digest('hex'); rmSync(f); } }
    if (keep) writeFileSync(ev, keep); // the film's own event log, as it was
    if (existsSync(stills) && !readdirSync(stills).length) rmdirSync(stills);
  }
} finally { lock('release', ID); }

if (update) { writeFileSync(BASE, JSON.stringify(got, null, 1) + '\n'); console.log(`baseline updated: ${Object.keys(got).length} frames -> tools/regress-baseline.json`); process.exit(process.exitCode || 0); }
if (!existsSync(BASE)) { console.log('no baseline yet: run with --update first'); process.exit(1); }
const base = JSON.parse(readFileSync(BASE, 'utf8')); let bad = 0;
for (const k of Object.keys(base)) { const ok = got[k] === base[k]; if (!ok) bad++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${k} s`); }
console.log(bad ? `${bad} frame(s) changed: the films no longer render as before` : `all ${Object.keys(base).length} frames identical`);
process.exit(bad || process.exitCode ? 1 : 0);
