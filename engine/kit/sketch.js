// VGE sketch treatment: hand-drawn ink lines that draw on, and handwriting that writes on.
// After lemo-opuscar's one-line, whiteboard and urban-sketch styles (MIT, third_party/lemo-opuscar): a low-frequency hand
// wobble along the normal plus a finer tremor, a second thinner pass that never quite matches the first, strokes that
// overshoot and don't quite close, written on in stroke order. Every frame is a pure function of t.
(function () {
  const V = window.VGE, K = window.VGEKit, NS = 'http://www.w3.org/2000/svg';
  const INK = '#1D1A17';
  function noise1(seed) { const r = K.rand(seed * 7919 + 13); const v = [...Array(256)].map(() => r() * 2 - 1); return (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return v[i & 255] + (v[(i + 1) & 255] - v[i & 255]) * u; }; }
  function sample(d, step = 6) { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); const s = K.svg(document.body, 1, 1); s.appendChild(p); const L = p.getTotalLength(), n = Math.max(2, Math.ceil(L / step)), pts = []; for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(L * i / n); pts.push([q.x, q.y]); } s.remove(); return pts; }
  function rough(pts, { amp = 2.2, wav = 70, seed = 1 }) {
    const a = noise1(seed), b = noise1(seed + 31); let acc = 0; const out = [];
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i], [px, py] = pts[Math.max(0, i - 1)], [nx, ny] = pts[Math.min(pts.length - 1, i + 1)];
      let tx = nx - px, ty = ny - py; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l; if (i) acc += Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1]);
      const o = amp * a(acc / wav) + amp * .3 * b(acc / (wav * .22)); out.push([x - ty * o, y + tx * o]);
    }
    return out;
  }
  const toD = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');

  // a stroke: a main pass and a thinner echo, drawn on from t0 over dur
  function stroke(svg, d, o = {}) {
    const { t0 = 0, dur = .7, color = INK, width = 5, seed = 1, amp = 2.2, passes = 2, tout = Infinity, ease = V.glide, opacity = .92 } = o;
    const base = sample(d, o.step || 6), g = K.sv(svg, 'g', {});
    for (let k = 0; k < passes; k++) {
      const p = K.sv(g, 'path', { d: toD(rough(base, { amp: amp * (k ? 1.35 : 1), seed: seed + k * 17 })), fill: 'none', stroke: color, 'stroke-width': (width * (k ? .42 : 1)).toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: (opacity * (k ? .5 : 1)).toFixed(2) });
      V.draw(p, { t0: t0 + k * .05, dur, ease, tout });
    }
    return g;
  }
  const S = {
    stroke,
    line: (svg, x1, y1, x2, y2, o) => stroke(svg, `M${x1} ${y1} L${x2} ${y2}`, o),
    // a box drawn in one go: the last side overshoots the first corner
    rect: (svg, x, y, w, h, o = {}) => { const v = Math.min(w, h) * .05; return stroke(svg, `M${x + v} ${y + 2} L${x + w - 2} ${y} L${x + w} ${y + h - 3} L${x + 2} ${y + h} L${x - 1} ${y + v} L${x + v * 4} ${y - 1}`, { dur: .9, ...o }); },
    // an ellipse of about 1.1 turns whose radius drifts, so it never closes exactly
    ellipse: (svg, cx, cy, rx, ry, o = {}) => { let d = ''; const N = 72, a0 = o.a0 ?? -2.3, turns = o.turns ?? 1.1; for (let i = 0; i <= N; i++) { const a = a0 + i / N * turns * 6.2832, k = 1 + .05 * Math.sin(i / N * 3.3) + .03 * (i / N); d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rx * k).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * k).toFixed(1); } return stroke(svg, d, { dur: .8, ...o }); },
    // an arrow: a bent shaft, then two head strokes
    arrow: (svg, x1, y1, x2, y2, o = {}) => {
      const bend = o.bend ?? .18, mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend, t0 = o.t0 || 0, dur = o.dur ?? .6;
      const g = K.sv(svg, 'g', {}); stroke(g, `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, { ...o, dur });
      const an = Math.atan2(y2 - my, x2 - mx), L = o.head ?? 26;
      [-.5, .5].forEach((s, i) => stroke(g, `M${x2} ${y2} L${(x2 - Math.cos(an + s) * L).toFixed(1)} ${(y2 - Math.sin(an + s) * L).toFixed(1)}`, { ...o, t0: t0 + dur + i * .08, dur: .14, seed: (o.seed || 1) + 40 + i }));
      return g;
    },
    underline: (svg, x, y, w, o = {}) => { const g = K.sv(svg, 'g', {}); stroke(g, `M${x} ${y} Q${x + w / 2} ${y + 7} ${x + w} ${y - 2}`, { dur: .4, ...o }); if (o.double) stroke(g, `M${x + w * .08} ${y + 14} Q${x + w / 2} ${y + 20} ${x + w * .94} ${y + 11}`, { dur: .35, ...o, t0: (o.t0 || 0) + .3, seed: (o.seed || 1) + 9 }); return g; },
    check: (svg, x, y, s, o = {}) => stroke(svg, `M${x} ${y + s * .55} L${x + s * .36} ${y + s} L${x + s} ${y}`, { dur: .35, ...o }),
    cross: (svg, x, y, s, o = {}) => { const g = K.sv(svg, 'g', {}); stroke(g, `M${x} ${y} L${x + s} ${y + s}`, { dur: .2, ...o }); stroke(g, `M${x + s} ${y} L${x} ${y + s}`, { dur: .2, ...o, t0: (o.t0 || 0) + .22, seed: (o.seed || 1) + 5 }); return g; },
    // diagonal hatching inside a rectangle, laid down line by line
    hatch: (svg, x, y, w, h, o = {}) => {
      const id = 'h' + Math.random().toString(36).slice(2, 8), gap = o.gap || 20, g = K.sv(svg, 'g', { 'clip-path': `url(#${id})` });
      const cp = K.sv(svg.querySelector('defs') || K.sv(svg, 'defs', {}), 'clipPath', { id }); K.sv(cp, 'rect', { x, y, width: w, height: h });
      const n = Math.ceil((w + h) / gap); for (let i = 0; i < n; i++) { const s = i * gap; stroke(g, `M${x + s} ${y - 4} L${x + s - h - 8} ${y + h + 4}`, { width: o.width || 2.6, passes: 1, amp: 1.2, dur: .16, t0: (o.t0 || 0) + i * (o.stagger ?? .03), color: o.color, seed: i + 3, tout: o.tout }); }
      return g;
    },
    // handwriting (Caveat), written on left to right: about 0.2 s plus 30 ms per character
    write: (parent, { x, y, text, size = 56, color = INK, t0 = 0, tout = Infinity, rot = -1.5, w }) => {
      const e = K.div(parent, 'sk-write', `left:${x}px;top:${y}px;font-size:${size}px;color:${color};transform:rotate(${rot}deg);`, text);
      const dur = o2(.2 + text.length * .03);
      V.on((t) => { const p = V.linear(V.seg(t, t0, dur)), q = V.glide(V.seg(t, tout, .4)); e.style.clipPath = `inset(-20% ${(100 * (1 - p)).toFixed(2)}% -20% -2%)`; e.style.opacity = (1 - q).toFixed(3); e.style.visibility = p <= 0 || q >= 1 ? 'hidden' : 'visible'; });
      V.text('sk:' + text, text, t0, tout);
      return e;
    },
    INK,
  };
  function o2(v) { return +v.toFixed(3); }
  window.VGESketch = S;
})();
