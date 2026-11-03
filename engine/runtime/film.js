// VGE runtime: every frame is a pure function of time t (seconds). A classic script, so it works from file://.
// A film registers tracks (t => void) with these helpers; window.render(t) runs them all. Nothing keeps state
// between frames, so any frame renders alone, in any order.
(function () {
  // CSS-equivalent cubic-bezier, solved by Newton steps with a bisection fallback
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = (u) => ((ax * u + bx) * u + cx) * u, Y = (u) => ((ay * u + by) * u + cy) * u, dX = (u) => (3 * ax * u + 2 * bx) * u + cx;
    return (x) => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let u = x; for (let i = 0; i < 8; i++) { const e = X(u) - x; if (Math.abs(e) < 1e-6) return Y(u); const d = dX(u); if (Math.abs(d) < 1e-6) break; u -= e / d; }
      let lo = 0, hi = 1; u = x; while (hi - lo > 1e-6) { if (X(u) < x) lo = u; else hi = u; u = (lo + hi) / 2; } return Y(u);
    };
  }
  const glide = bezier(.22, 1, .36, 1), travel = bezier(.65, 0, .35, 1), linear = (x) => x; // the only two curves (+ linear for line draws)
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, t0, d) => clamp((t - t0) / (d || 1e-6));
  const mix = (a, b, p) => a + (b - a) * p;
  const tracks = [], EV = [], TX = [];
  const on = (fn) => { tracks.push(fn); return fn; };
  const sfx = (t, file, gain = -20) => { EV.push({ t: +t.toFixed(3), file, gain }); };

  // Appear (fade + rise, glide 0.6 s) and leave (fade + lift, 0.4 s). `base` keeps an element's own transform.
  function vis(el, o) {
    const { tin, tout = Infinity, rise = 24, din = .6, dout = .4, base = '', scaleFrom = 1, lift = 16, x = 0, to = 1 } = o;
    on((t) => {
      const a = glide(seg(t, tin, din)), b = t >= tout ? glide(seg(t, tout, dout)) : 0, op = a * (1 - b) * to;
      el.style.opacity = op.toFixed(4); el.style.visibility = op <= .002 ? 'hidden' : 'visible';
      const y = (1 - a) * rise - b * lift, dx = (1 - a) * x, s = mix(scaleFrom, 1, a);
      el.style.transform = `${base} translate(${dx.toFixed(2)}px, ${y.toFixed(2)}px) scale(${s.toFixed(4)})`;
    });
  }
  // Opacity only, from a to b over [t0, t0+d] (for dimming or cross-fades).
  function fade(el, t0, d, a, b, ease = glide) { on((t) => { if (t < t0) return; el.style.opacity = mix(a, b, ease(seg(t, t0, d))).toFixed(4); }); }

  // Draw a path along its length. A dashed path keeps its dashes and is revealed through a mask.
  function draw(path, { t0, dur = 1, ease = linear, tout = Infinity, dout = .4 }) {
    const len = path.getTotalLength(); let target = path;
    if (path.getAttribute('stroke-dasharray')) {
      const ns = 'http://www.w3.org/2000/svg', svg = path.ownerSVGElement, id = 'm' + Math.random().toString(36).slice(2, 9);
      const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(ns, 'defs'), svg.firstChild);
      const m = document.createElementNS(ns, 'mask'); m.setAttribute('id', id); m.setAttribute('maskUnits', 'userSpaceOnUse');
      for (const [k, v] of [['x', -20000], ['y', -20000], ['width', 60000], ['height', 60000]]) m.setAttribute(k, v);
      const p = path.cloneNode(); p.removeAttribute('stroke-dasharray'); p.removeAttribute('opacity'); p.removeAttribute('class');
      p.setAttribute('stroke', '#fff'); p.setAttribute('fill', 'none'); p.setAttribute('stroke-width', (+(path.getAttribute('stroke-width') || 4)) + 6);
      m.appendChild(p); defs.appendChild(m); path.setAttribute('mask', `url(#${id})`); target = p;
    }
    target.style.strokeDasharray = `${len} ${len}`;
    on((t) => {
      const p = ease(seg(t, t0, dur));
      target.style.strokeDashoffset = (len * (1 - p)).toFixed(2);
      path.style.visibility = p <= 0 ? 'hidden' : 'visible'; // a round cap would otherwise show a dot before the line starts
      if (tout !== Infinity) path.style.opacity = (1 - glide(seg(t, tout, dout))).toFixed(4);
    });
  }
  // Moving dashes on a dashed path (a working flow), frozen after t1 (a standstill).
  function flow(path, { t0, t1 = Infinity, speed = 40 }) {
    on((t) => { const tt = Math.max(0, Math.min(t, t1) - t0); path.style.strokeDashoffset = (-tt * speed).toFixed(2); });
  }
  // Colour fades
  const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  const rgb = (a, b, p) => `rgb(${a.map((v, i) => Math.round(mix(v, b[i], p))).join(',')})`;
  function colorTo(el, prop, from, to, t0, d = .5) { const A = hex(from), B = hex(to); on((t) => { el.style[prop] = rgb(A, B, glide(seg(t, t0, d))); }); }
  function keyword(el, t0, from = '#1A1323', to = '#A100FF') { colorTo(el, 'color', from, to, t0, .5); }
  // A number counting from a to b (only when the claim is about change)
  function count(el, { t0, dur = 1, from = 0, to, fmt = (v) => Math.round(v) }) { on((t) => { el.textContent = fmt(mix(from, to, glide(seg(t, t0, dur)))); }); }

  // One property, several timed changes: keys [[t, value, d]] (value: number or '#hex'). One track per element
  // property, so the value is always a pure function of t: before the first key it holds the first value.
  function anim(el, prop, keys, fmt = (v) => v.toFixed(4)) {
    const col = typeof keys[0][1] === 'string', K = keys.map(([t, v, d = .5, e = glide]) => ({ t, v: col ? hex(v) : v, d, e }));
    on((t) => {
      let v = K[0].v;
      for (let i = 1; i < K.length; i++) { const k = K[i]; if (t < k.t) break; const p = k.e(seg(t, k.t, k.d)); v = col ? v.map((c, j) => mix(c, k.v[j], p)) : mix(v, k.v, p); }
      el.style[prop] = col ? `rgb(${v.map(Math.round).join(',')})` : fmt(v);
    });
  }

  // Camera: keys [{t, x, y, s, d}] move the view (top-left at scale 1) with the travel curve, holding between keys
  function camera(world, keys, layers = []) {
    const at = (t) => {
      let c = { x: keys[0].x || 0, y: keys[0].y || 0, s: keys[0].s || 1 };
      for (let i = 1; i < keys.length; i++) {
        const k = keys[i], prev = { ...c }, d = k.d ?? 1.6, e = k.ease || travel;
        if (t < k.t) break;
        const p = k.cut ? 1 : e(seg(t, k.t, d));
        c = { x: mix(prev.x, k.x ?? prev.x, p), y: mix(prev.y, k.y ?? prev.y, p), s: mix(prev.s, k.s ?? prev.s, p) };
      }
      return c;
    };
    on((t) => {
      const c = at(t), cx = c.x + 960, cy = c.y + 540;
      world.style.transform = `translate(960px, 540px) scale(${c.s.toFixed(5)}) translate(${(-cx).toFixed(2)}px, ${(-cy).toFixed(2)}px)`;
      for (const { el, k, ky = k, base = '' } of layers) el.style.transform = `${base} translate(${(-c.x * k).toFixed(2)}px, ${(-c.y * ky).toFixed(2)}px)`;
    });
    return at;
  }
  // Chapter disc: a clip circle that grows from (cx, cy) and later shrinks into a target
  function disc(el, keys) {
    on((t) => {
      let c = { r: keys[0].r, cx: keys[0].cx, cy: keys[0].cy };
      for (let i = 1; i < keys.length; i++) { const k = keys[i]; if (t < k.t) break; const p = (k.ease || travel)(seg(t, k.t, k.d ?? 1)), q = { ...c }; c = { r: mix(q.r, k.r, p), cx: mix(q.cx, k.cx ?? q.cx, p), cy: mix(q.cy, k.cy ?? q.cy, p) }; }
      el.style.clipPath = `circle(${Math.max(0, c.r).toFixed(1)}px at ${c.cx.toFixed(1)}px ${c.cy.toFixed(1)}px)`;
      el.style.visibility = c.r <= .5 ? 'hidden' : 'visible';
    });
  }
  // Text export for the read check: [{id, text, tin, tout}]
  const text = (id, txt, tin, tout) => TX.push({ id, text: txt, tin, tout });

  window.VGE = { bezier, glide, travel, linear, clamp, seg, mix, on, sfx, vis, fade, anim, draw, flow, colorTo, keyword, count, camera, disc, text, EV, TX };
  window.EV = EV; window.TEXTS_PLAN = TX;
  window.render = (t) => { for (const f of tracks) f(t); };
  window.VGE.ready = () => document.fonts.ready.then(() => { window.render(0); window.READY = true; });
})();
