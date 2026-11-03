// VO + music + SFX from the film's events -> a loudness-normalised mix, muxed onto the picture, then measured on the MP4.
// usage: node engine/audio/mix.mjs films/<slug>  (reads out/events.json and out/picture.mp4; writes out/<slug>.mp4)
// events.json: { dur, ev: [{t, file, gain}], music: {file, ...} | [{file, from, at, until, fadeIn, fadeOut, gain | lufs}], vo: {file, at, gain | lufs} }
// A cue with `lufs` is set by measurement (gain = lufs - its measured loudness), so levels hold whatever the source.
// Asset paths are relative to the repository root.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const dir = resolve(process.argv[2]), out = join(dir, 'out'), slug = basename(dir);
const meta = JSON.parse(readFileSync(join(out, 'events.json'), 'utf8')), dur = meta.dur;
const TARGET_I = -14, TP_LIMIT = -1.0, TP_SET = -2.0;
const ff = (args) => spawnSync('ffmpeg', ['-hide_banner', '-nostdin', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const loud = (f, ss = 0, t = 0) => { const r = ff([...(ss ? ['-ss', String(ss)] : []), ...(t ? ['-t', String(t)] : []), '-i', f, '-af', 'ebur128', '-f', 'null', '-']).stderr; return +(/I:\s+(-?[\d.]+) LUFS/.exec(r.slice(r.lastIndexOf('Summary')))?.[1]); };
const need = (f) => { const p = join(ROOT, f); if (!existsSync(p)) { console.error('missing', p); process.exit(1); } return p; };

const inputs = [], filters = [], labels = [], report = [];
const add = (args) => { const k = inputs.filter((x) => x === '-i').length; inputs.push(...args); return k; };
// voiceover
if (meta.vo) {
  const V0 = meta.vo, f = need(V0.file), g = V0.lufs != null ? V0.lufs - loud(f) : (V0.gain || 0), ms = Math.round((V0.at || 0) * 1000), k = add(['-i', f]);
  filters.push(`[${k}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${g.toFixed(2)}dB,adelay=${ms}|${ms}[vo]`); labels.push('[vo]'); report.push(`vo ${basename(f)} ${g.toFixed(1)} dB`);
}
// music cues (a single object is one cue for the whole film)
const cues = !meta.music ? [] : Array.isArray(meta.music) ? meta.music : [{ ...meta.music, from: meta.music.start || 0, at: 0, until: dur }];
cues.forEach((c, i) => {
  const f = need(c.file), from = c.from || 0, at = c.at || 0, len = Math.min(c.until ?? dur, dur) - at, fi = c.fadeIn ?? 1, fo = c.fadeOut ?? 3;
  const g = c.lufs != null ? c.lufs - loud(f, from, len) : (c.gain || 0), ms = Math.round(at * 1000), k = add(['-ss', String(from), '-t', String(len), '-i', f]);
  filters.push(`[${k}:a]aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=${fi}:curve=qsin,afade=t=out:st=${(len - fo).toFixed(2)}:d=${fo}:curve=qsin,volume=${g.toFixed(2)}dB,adelay=${ms}|${ms}[m${i}]`);
  labels.push(`[m${i}]`); report.push(`music ${basename(f)} ${at}-${(at + len).toFixed(1)} s ${g.toFixed(1)} dB`);
});
// sound effects
meta.ev.forEach((e, i) => {
  const k = add(['-i', need(e.file)]), ms = Math.round(e.t * 1000);
  filters.push(`[${k}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${e.gain}dB,adelay=${ms}|${ms}[s${i}]`); labels.push(`[s${i}]`);
});
const graph = filters.join(';') + `;${labels.join('')}amix=inputs=${labels.length}:normalize=0:dropout_transition=0,atrim=0:${dur},apad=whole_dur=${dur}[pre]`;

// pass 1: measure the premix
const p1 = ff([...inputs, '-filter_complex', graph + `;[pre]loudnorm=I=${TARGET_I}:TP=${TP_SET}:LRA=11:print_format=json[o]`, '-map', '[o]', '-f', 'null', '-']);
if (p1.status !== 0) { console.error(p1.stderr.slice(-2000)); process.exit(1); }
const m = JSON.parse(p1.stderr.slice(p1.stderr.lastIndexOf('{'), p1.stderr.lastIndexOf('}') + 1));
// pass 2: normalise with the measured values, then a true-peak limiter as a safety net
const ln = `loudnorm=I=${TARGET_I}:TP=${TP_SET}:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
const wav = join(out, 'mix.wav');
const p2 = ff(['-y', ...inputs, '-filter_complex', graph + `;[pre]${ln},alimiter=limit=0.8:level=false,aresample=48000[o]`, '-map', '[o]', '-c:a', 'pcm_s16le', wav]);
if (p2.status !== 0) { console.error(p2.stderr.slice(-2000)); process.exit(1); }
// mux
const mp4 = join(out, `${slug}.mp4`);
const p3 = ff(['-y', '-i', join(out, 'picture.mp4'), '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', mp4]);
if (p3.status !== 0) { console.error(p3.stderr.slice(-2000)); process.exit(1); }
// measure the delivered file (not the premix)
const meas = (f) => { const r = ff(['-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr; const I = +(/I:\s+(-?[\d.]+) LUFS/.exec(r.slice(r.lastIndexOf('Summary')))?.[1]); const TP = +(/Peak:\s+(-?[\d.]+) dBFS/.exec(r.slice(r.lastIndexOf('True peak')))?.[1]); return { I, TP }; };
const w = meas(wav), v = meas(mp4);
const vdur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).toString();
console.log(`${mp4}\n  ${report.join('\n  ')}\n  sfx ${meta.ev.length} · duration ${vdur.toFixed(2)} s`);
console.log(`  mix.wav  I ${w.I} LUFS, TP ${w.TP} dBTP\n  ${slug}.mp4  I ${v.I} LUFS, TP ${v.TP} dBTP  ${v.TP <= TP_LIMIT && Math.abs(v.I - TARGET_I) <= 1 ? 'OK' : 'FAIL'}`);
if (!(v.TP <= TP_LIMIT && Math.abs(v.I - TARGET_I) <= 1)) process.exitCode = 1;
