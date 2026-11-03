// VGE data treatment: charts that are drawn as they are spoken.
// After lemo-opuscar's dataviz style (MIT, third_party/lemo-opuscar): one mark = one fact, axes arrive when the unit is
// named, notes are pinned to their marks (a leader and an unclosed ring), one highlighted series and the rest muted.
// Every value on screen must be in the film's facts ledger. Every frame is a pure function of t.
(function () {
  const V = window.VGE, K = window.VGEKit;
  const PUR = '#A100FF', MUTE = '#D5CCE3', INK = '#1A1323', GRID = '#E2DCEA';
  const BACK = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
  // a plot box: x, y (top-left), w, h, value range [min, max]
  const box = (x, y, w, h, min = 0, max = 1) => ({ x, y, w, h, min, max, X: (i, n) => x + (n <= 1 ? 0 : i / (n - 1)) * w, Y: (v) => y + h - (v - min) / (max - min) * h });
  const D = {
    box,
    // a baseline and a few faint gridlines; the baseline draws first
    axes: (svg, b, { t0 = 0, lines = 3 } = {}) => {
      const base = K.sv(svg, 'path', { d: `M${b.x} ${b.y + b.h} L${b.x + b.w} ${b.y + b.h}`, stroke: INK, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }); V.draw(base, { t0, dur: .5, ease: V.glide });
      for (let i = 1; i <= lines; i++) { const y = b.y + b.h - i * b.h / lines, g = K.sv(svg, 'path', { d: `M${b.x} ${y} L${b.x + b.w} ${y}`, stroke: GRID, 'stroke-width': 2, fill: 'none' }); V.draw(g, { t0: t0 + .15 + i * .08, dur: .5, ease: V.glide }); }
    },
    // a line that draws left to right, an area that fills behind it, and a dot that lands on the last value
    line: (svg, b, values, { t0 = 0, dur = 1.2, color = PUR, width = 7, area = true, dot = true } = {}) => {
      const n = values.length, pts = values.map((v, i) => [b.X(i, n), b.Y(v)]), d = 'M' + pts.map((p) => p.map((q) => q.toFixed(1)).join(' ')).join(' L');
      if (area) { const id = 'ga' + Math.random().toString(36).slice(2, 7), defs = svg.querySelector('defs') || K.sv(svg, 'defs', {}), lg = K.sv(defs, 'linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 });
        K.sv(lg, 'stop', { offset: 0, 'stop-color': color, 'stop-opacity': .22 }); K.sv(lg, 'stop', { offset: 1, 'stop-color': color, 'stop-opacity': 0 });
        const a = K.sv(svg, 'path', { d: d + ` L${b.x + b.w} ${b.y + b.h} L${b.x} ${b.y + b.h} Z`, fill: `url(#${id})` });
        V.on((t) => { const p = V.glide(V.seg(t, t0, dur)); a.style.clipPath = `inset(0 ${(100 * (1 - p)).toFixed(2)}% 0 0)`; a.style.visibility = p > 0 ? 'visible' : 'hidden'; }); }
      const ln = K.sv(svg, 'path', { d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }); V.draw(ln, { t0, dur, ease: V.glide });
      if (dot) { const [ex, ey] = pts[n - 1], c = K.sv(svg, 'circle', { cx: ex, cy: ey, r: 0, fill: '#fff', stroke: color, 'stroke-width': 6 }), rp = K.sv(svg, 'circle', { cx: ex, cy: ey, r: 0, fill: 'none', stroke: color, 'stroke-width': 3 });
        V.on((t) => { const p = V.seg(t, t0 + dur - .05, .35), q = V.seg(t, t0 + dur, .7); c.setAttribute('r', (13 * BACK(p)).toFixed(1)); rp.setAttribute('r', (13 + 40 * V.glide(q)).toFixed(1)); rp.style.opacity = (q > 0 && q < 1 ? 1 - q : 0).toFixed(3); }); }
      return { pts, d };
    },
    // bars that grow from the baseline with a small overshoot; one highlighted, the rest muted; values count up
    bars: (svg, b, values, { t0 = 0, stagger = .12, dur = .55, highlight = -1, color = PUR, muted = MUTE, gap = .32, labels, fmt = (v) => Math.round(v), valueSize = 36 } = {}) => {
      const n = values.length, bw = b.w / n * (1 - gap);
      return values.map((v, i) => {
        const x = b.x + i * b.w / n + (b.w / n - bw) / 2, h = (v - b.min) / (b.max - b.min) * b.h, base = b.y + b.h, ts = t0 + i * stagger, hi = highlight < 0 || i === highlight;
        const r = K.sv(svg, 'rect', { x, width: bw, rx: 8, fill: hi ? color : muted }), tx = K.sv(svg, 'text', { x: x + bw / 2, 'text-anchor': 'middle', 'font-size': valueSize, 'font-weight': 600, fill: hi ? INK : '#8A8394', 'font-family': 'Inter' });
        if (labels) { const lb = K.sv(svg, 'text', { x: x + bw / 2, y: base + 44, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 500, fill: '#4A4453', 'font-family': 'Inter' }); lb.textContent = labels[i]; V.anim(lb, 'opacity', [[0, 0], [ts, 1, .3]]); }
        V.on((t) => { const p = V.seg(t, ts, dur), k = BACK(p), hh = h * k; r.setAttribute('y', (base - hh).toFixed(1)); r.setAttribute('height', Math.max(0, hh).toFixed(1)); r.style.visibility = p > 0 ? 'visible' : 'hidden';
          tx.setAttribute('y', (base - hh - 16).toFixed(1)); tx.textContent = fmt(v * V.glide(p)); tx.style.opacity = V.seg(t, ts + .1, .3).toFixed(3); });
        return r;
      });
    },
    // a donut that sweeps to a share (0..1)
    donut: (svg, { cx, cy, r = 120, w = 34, value, t0 = 0, dur = 1, color = PUR, track = '#F2EAFD' }) => {
      const tr = K.sv(svg, 'circle', { cx, cy, r, fill: 'none', stroke: track, 'stroke-width': w }); V.anim(tr, 'opacity', [[0, 0], [t0 - .2, 1, .3]]); // the track arrives with the donut, not before
      const c = K.sv(svg, 'circle', { cx, cy, r, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', transform: `rotate(-90 ${cx} ${cy})` }), C = 2 * Math.PI * r;
      c.style.strokeDasharray = `${C} ${C}`; V.on((t) => { const p = V.glide(V.seg(t, t0, dur)); c.style.strokeDashoffset = (C * (1 - value * p)).toFixed(1); c.style.visibility = p > 0 ? 'visible' : 'hidden'; });
      return c;
    },
    // a big number counting to its value (only when the claim is about a change or a total)
    counter: (parent, { x, y, from = 0, to, fmt = (v) => Math.round(v).toLocaleString('en-US'), t0 = 0, dur = 1.2, size = 168, color = INK, align = 'left' }) => {
      const e = K.div(parent, 'dv-num', `left:${x}px;top:${y}px;font-size:${size}px;line-height:1;font-weight:600;color:${color};letter-spacing:-.02em;${align === 'center' ? 'transform:translateX(-50%);' : ''}`);
      V.on((t) => { const p = V.seg(t, t0, dur); e.textContent = fmt(V.mix(from, to, V.glide(p))); e.style.opacity = V.glide(V.seg(t, t0, .3)).toFixed(3); e.style.visibility = p > 0 ? 'visible' : 'hidden'; });
      return e;
    },
    // a note pinned to a mark: a curved leader, an unclosed ring round the point, handwriting written on
    note: (svg, parent, { x, y, text, dx = 160, dy = -120, t0 = 0, color = PUR, size = 44 }) => {
      const ring = K.sv(svg, 'path', { d: `M${x + 22} ${y - 6} A 24 22 0 1 1 ${x + 14} ${y - 18}`, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round' }); V.draw(ring, { t0, dur: .35, ease: V.glide });
      const lx = x + dx, ly = y + dy, lead = K.sv(svg, 'path', { d: `M${x + 18} ${y - 22} Q${x + dx * .2} ${y + dy * .9} ${lx - 12} ${ly + 14}`, fill: 'none', stroke: color, 'stroke-width': 3.5, 'stroke-linecap': 'round' }); V.draw(lead, { t0: t0 + .3, dur: .35, ease: V.glide });
      const tx = K.div(parent, 'dv-note', `left:${lx}px;top:${ly - size * .6}px;font-size:${size}px;color:${color};`, text);
      V.on((t) => { const p = V.linear(V.seg(t, t0 + .6, .2 + text.length * .03)); tx.style.clipPath = `inset(-20% ${(100 * (1 - p)).toFixed(2)}% -20% -2%)`; tx.style.visibility = p > 0 ? 'visible' : 'hidden'; });
      V.text('dv:' + text, text, t0 + .6, Infinity);
      return tx;
    },
    // a unit (waffle / Isotype) chart: n of cols x rows units pop in, in reading order
    units: (svg, { x, y, cols, rows, n, size = 30, gap = 10, t0 = 0, dur = 1.2, color = PUR, muted = '#EDE6F5', round = true }) => {
      const tot = cols * rows, step = dur / Math.max(1, n), grid = K.sv(svg, 'g', {}); V.anim(grid, 'opacity', [[0, 0], [t0 - .25, 1, .3]]); // the empty grid arrives with the chart
      for (let i = 0; i < tot; i++) { const cx = x + (i % cols) * (size + gap) + size / 2, cy = y + Math.floor(i / cols) * (size + gap) + size / 2, on = i < n;
        const u = round ? K.sv(grid, 'circle', { cx, cy, r: size / 2, fill: muted }) : K.sv(grid, 'rect', { x: cx - size / 2, y: cy - size / 2, width: size, height: size, rx: 6, fill: muted });
        if (on) V.on((t) => { const p = V.seg(t, t0 + i * step, .3); u.setAttribute('fill', p > 0 ? color : muted); u.setAttribute('transform', `translate(${cx} ${cy}) scale(${p > 0 ? BACK(p).toFixed(3) : 1}) translate(${-cx} ${-cy})`); }); }
    },
  };
  window.VGEData = D;
})();
