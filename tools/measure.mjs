// Measures a rendered film for the tuning scale (styles/SCALE.md). It reads the final MP4 and the event log and
// prints the readings that can be measured: motion (Energy), scene changes (Pace), frame fill (Density), words on
// screen per minute (Type) and sound effects per minute (Sound). It reads files only, so it cannot change a film.
// usage: node tools/measure.mjs films/<slug>    (needs out/<slug>.mp4, and out/events.json from frames.mjs)
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';

const dir = resolve(process.argv[2] || ''), slug = basename(dir), mp4 = join(dir, 'out', slug + '.mp4');
const ev = JSON.parse(readFileSync(join(dir, 'out', 'events.json'), 'utf8')), min = ev.dur / 60;

// Grey frames at a low resolution: the downscale averages the grain away, so only real movement counts.
function frames(w, h, fps, each) {
  return new Promise((res, rej) => {
    const ff = spawn('ffmpeg', ['-v', 'error', '-i', mp4, '-vf', `fps=${fps},scale=${w}:${h}:flags=area,format=gray`, '-f', 'rawvideo', '-']);
    const N = w * h; let buf = Buffer.alloc(0), n = 0;
    ff.stdout.on('data', (d) => { buf = Buffer.concat([buf, d]); while (buf.length >= N) { each(Buffer.from(buf.subarray(0, N)), n++); buf = buf.subarray(N); } });
    ff.on('close', (c) => (c === 0 ? res(n) : rej(new Error('ffmpeg exit ' + c))));
  });
}

// Energy: the share of the frame that moves between frames (15 fps, 160x90). A frame where most of it changes is a cut.
let prev = null, moving = 0, pairs = 0, cuts = 0;
await frames(160, 90, 15, (f) => {
  if (prev) { let m = 0; for (let i = 0; i < f.length; i++) if (Math.abs(f[i] - prev[i]) > 10) m++; const s = m / f.length; moving += s; pairs++; if (s > .4) cuts++; }
  prev = f;
});
// Density: the share of the frame that carries an edge (1 fps, 480x270, Sobel).
let fill = 0, nf = 0;
await frames(480, 270, 1, (f) => {
  const W = 480, H = 270; let e = 0;
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const p = (dx, dy) => f[(y + dy) * W + x + dx];
    const gx = p(1, -1) + 2 * p(1, 0) + p(1, 1) - p(-1, -1) - 2 * p(-1, 0) - p(-1, 1), gy = p(-1, 1) + 2 * p(0, 1) + p(1, 1) - p(-1, -1) - 2 * p(0, -1) - p(1, -1);
    if (gx * gx + gy * gy > 60 * 60) e++;
  }
  fill += e / (W * H); nf++;
});
const words = (ev.texts || []).reduce((n, x) => n + x.text.split(/\s+/).filter(Boolean).length, 0);
const r = {
  film: slug, dur: ev.dur,
  motion: +(100 * moving / pairs).toFixed(2),   // % of the frame moving, on average
  cutsPerMin: +(cuts / min).toFixed(1),         // hard changes per minute
  fill: +(100 * fill / nf).toFixed(2),          // % of the frame carrying edges
  wordsPerMin: +(words / min).toFixed(1),
  sfxPerMin: +(ev.ev.length / min).toFixed(1),
};
console.log(JSON.stringify(r));
