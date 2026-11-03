#!/usr/bin/env node
// Fair cooperative lock so parallel agents take turns on RAM-heavy work (renders, video decodes,
// headless browsers). This machine has very little free RAM; two heavy jobs at once thrash it.
//
//   node tools/heavy-lock.mjs acquire <owner> [ttlMinutes=10]   exit 0 = acquired, 3 = busy (you're queued)
//   node tools/heavy-lock.mjs release <owner>
//   node tools/heavy-lock.mjs status
//
// Fairness (2026-10-29, after one builder held the lock 75 min and starved two others):
//  - FIFO queue: a busy `acquire` enqueues a ticket. When the lock frees, only the OLDEST live
//    ticket may take it. Retry `acquire` to keep your ticket alive (tickets idle > 5 min are dropped).
//  - Max hold: the TTL is capped at 15 min. Past its TTL a hold is stale and the next in line takes over.
//    Long batches must release between items (acquire → render one module → release).
//  - Re-acquiring your own live lock refreshes it only while nobody else is queued; otherwise you
//    must release and queue again behind them.

import { openSync, writeSync, closeSync, readFileSync, unlinkSync, existsSync, mkdirSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CACHE = join(dirname(fileURLToPath(import.meta.url)), '..', 'library', '.cache');
const LOCK = join(CACHE, 'heavy.lock');
const QDIR = join(CACHE, 'heavy-queue');
const MAX_TTL = 15, DEFAULT_TTL = 10, TICKET_IDLE_MIN = 5;
mkdirSync(QDIR, { recursive: true });

const now = () => Date.now();
const read = () => { try { return JSON.parse(readFileSync(LOCK, 'utf8')); } catch { return null; } };
const ageMin = (l) => (now() - l.since) / 60000;
const live = (l) => l && ageMin(l) < l.ttl;
const safe = (o) => String(o).replace(/[^A-Za-z0-9._-]/g, '_');

function tickets() {
  const out = [];
  for (const f of readdirSync(QDIR)) {
    const p = join(QDIR, f);
    try {
      const t = JSON.parse(readFileSync(p, 'utf8'));
      if ((now() - statSync(p).mtimeMs) / 60000 > TICKET_IDLE_MIN) { unlinkSync(p); continue; } // abandoned
      out.push({ ...t, path: p });
    } catch { try { unlinkSync(p); } catch {} }
  }
  return out.sort((a, b) => a.enq - b.enq);
}
function touchTicket(owner) {
  const p = join(QDIR, safe(owner) + '.json');
  const prev = existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null;
  writeFileSync(p, JSON.stringify({ owner, enq: prev?.enq ?? now() })); // keeps FIFO position, refreshes mtime
}
const dropTicket = (owner) => { try { unlinkSync(join(QDIR, safe(owner) + '.json')); } catch {} };

const [cmd, owner, ttlArg] = process.argv.slice(2);

if (cmd === 'acquire') {
  if (!owner) { console.error('usage: acquire <owner> [ttlMinutes]'); process.exit(1); }
  const ttl = Math.min(MAX_TTL, Number(ttlArg) || DEFAULT_TTL);
  const held = read();
  const queue = tickets().filter((t) => t.owner !== owner);

  if (live(held) && held.owner !== owner) {
    touchTicket(owner);
    const pos = tickets().findIndex((t) => t.owner === owner) + 1;
    console.log(`BUSY: held by ${held.owner} for ${ageMin(held).toFixed(1)} min (ttl ${held.ttl}). You are #${pos} in queue — do non-heavy work and retry (retrying keeps your place).`);
    process.exit(3);
  }
  if (live(held) && held.owner === owner && queue.length) {
    console.log(`BUSY: you hold it but ${queue.length} agent(s) are waiting — release, then acquire again to queue behind them.`);
    process.exit(3);
  }
  // Lock free, stale, or ours with nobody waiting. FIFO: only the oldest waiter may take a free lock.
  const head = tickets()[0];
  if (head && head.owner !== owner && !(live(held) && held.owner === owner)) {
    touchTicket(owner);
    const pos = tickets().findIndex((t) => t.owner === owner) + 1;
    console.log(`BUSY: lock is free but ${head.owner} is first in queue. You are #${pos} — retry shortly.`);
    process.exit(3);
  }
  if (held) { try { unlinkSync(LOCK); } catch {} }
  try {
    const fd = openSync(LOCK, 'wx'); // atomic create: loses cleanly if another agent raced us
    writeSync(fd, JSON.stringify({ owner, since: now(), ttl }));
    closeSync(fd);
    dropTicket(owner);
    console.log(`ACQUIRED by ${owner} (ttl ${ttl} min${Number(ttlArg) > MAX_TTL ? `, capped from ${ttlArg}` : ''})${held && held.owner !== owner ? ` — took over stale lock from ${held.owner}` : ''}`);
  } catch {
    touchTicket(owner);
    console.log('BUSY: another agent acquired it first. You are queued — retry.'); process.exit(3);
  }
} else if (cmd === 'release') {
  const held = read();
  dropTicket(owner);
  if (held && held.owner === owner) { unlinkSync(LOCK); console.log(`RELEASED by ${owner}`); }
  else console.log(held ? `not yours (held by ${held.owner})` : 'not held');
} else if (cmd === 'status') {
  const held = read();
  const q = tickets();
  console.log(held ? `held by ${held.owner} for ${ageMin(held).toFixed(1)} min (ttl ${held.ttl})${live(held) ? '' : ' — STALE'}` : 'free');
  console.log(q.length ? 'queue: ' + q.map((t, i) => `#${i + 1} ${t.owner}`).join(', ') : 'queue: empty');
} else {
  console.error('usage: acquire <owner> [ttl] | release <owner> | status'); process.exit(1);
}
