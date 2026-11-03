// VGE isometric treatment: a system diagram as a flat, true-isometric diorama.
// After lemo-opuscar's iso-infographic style (MIT, third_party/lemo-opuscar): axes at 30°, three tones per solid
// (top light, left mid, right dark), no outlines on solids, thin ink only for infographic furniture (leaders, pins,
// routes), solids arrive by motion (grow or drop with a squash), never by fading. Every frame is a pure function of t.
// Painter order: add solids back to front (smaller x + y + z first).
(function () {
  const V = window.VGE, K = window.VGEKit;
  const C30 = Math.cos(Math.PI / 6);
  const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * p).toString(16).padStart(2, '0')).join(''); };
  const tones = (base) => ({ top: mix(base, '#FFF8F0', .22), left: base, right: mix(base, '#231A2C', .24) });
  const BACK = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);

  // a scene on an SVG: origin (ox, oy) on screen, k px per world unit
  function scene(svg, { ox = 960, oy = 540, k = 1 } = {}) {
    const P = (x, y, z = 0) => [ox + (x - y) * C30 * k, oy + ((x + y) * .5 - z) * k];
    const pts = (arr) => arr.map(([x, y, z]) => P(x, y, z).map((v) => v.toFixed(1)).join(',')).join(' ');
    const S = { P, tones, svg };
    // a box. mode: 'grow' (rises from the ground), 'drop' (falls in and squashes), 'none'
    S.box = (o) => {
      const { x, y, z = 0, w, d, h, color = '#A100FF', t0 = 0, dur = .6, mode = 'grow', parent = svg } = o, T = tones(color);
      const g = K.sv(parent, 'g', {}), top = K.sv(g, 'polygon', { fill: T.top }), left = K.sv(g, 'polygon', { fill: T.left }), right = K.sv(g, 'polygon', { fill: T.right });
      V.on((t) => {
        let hh = h, zz = z, sq = 1; const p = V.seg(t, t0, dur);
        if (mode === 'grow') hh = h * BACK(p);
        else if (mode === 'drop') { const fall = V.clamp(p / .7), land = V.seg(p, .7, .3); zz = z + 360 * (1 - fall * fall); sq = 1 - .18 * Math.sin(Math.PI * land); hh = h * sq; }
        const vis = mode === 'none' || p > 0; g.style.visibility = vis && hh > .2 ? 'visible' : 'hidden'; if (!vis) return;
        const Z = zz + hh;
        top.setAttribute('points', pts([[x, y, Z], [x + w, y, Z], [x + w, y + d, Z], [x, y + d, Z]]));
        left.setAttribute('points', pts([[x, y + d, zz], [x + w, y + d, zz], [x + w, y + d, Z], [x, y + d, Z]]));
        right.setAttribute('points', pts([[x + w, y, zz], [x + w, y + d, zz], [x + w, y + d, Z], [x + w, y, Z]]));
      });
      return g;
    };
    // a gable roof along x on top of a box (z = the box's height)
    S.roof = (o) => {
      const { x, y, z, w, d, h, color = '#5E5868', t0 = 0, dur = .4, parent = svg } = o, T = tones(color);
      const g = K.sv(parent, 'g', {}), r1 = K.sv(g, 'polygon', { fill: T.right }), r2 = K.sv(g, 'polygon', { fill: T.top }), gab = K.sv(g, 'polygon', { fill: T.left });
      V.on((t) => { const p = V.glide(V.seg(t, t0, dur)), H = h * p; g.style.visibility = p > 0 ? 'visible' : 'hidden'; if (!p) return; const m = y + d / 2;
        r2.setAttribute('points', pts([[x, y, z], [x + w, y, z], [x + w, m, z + H], [x, m, z + H]]));
        r1.setAttribute('points', pts([[x, m, z + H], [x + w, m, z + H], [x + w, y + d, z], [x, y + d, z]]));
        gab.setAttribute('points', pts([[x + w, y, z], [x + w, m, z + H], [x + w, y + d, z]])); });
      return g;
    };
    // a cylinder (tank, silo, server drum): side as a path, top as an ellipse
    S.cyl = (o) => {
      const { x, y, z = 0, r, h, color = '#1E9E6A', t0 = 0, dur = .6, parent = svg } = o, T = tones(color);
      const g = K.sv(parent, 'g', {}), side = K.sv(g, 'path', { fill: T.left }), cap = K.sv(g, 'ellipse', { fill: T.top });
      V.on((t) => { const p = V.seg(t, t0, dur), hh = h * BACK(p); g.style.visibility = p > 0 ? 'visible' : 'hidden'; if (!p) return;
        const [cx, cy] = P(x, y, z), rx = r * C30 * 2 * k * .82, ry = rx * .5, top = cy - hh * k;
        side.setAttribute('d', `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} L${cx + rx} ${top} A${rx} ${ry} 0 0 1 ${cx - rx} ${top} Z`);
        Object.entries({ cx, cy: top, rx, ry }).forEach(([a, v]) => cap.setAttribute(a, v.toFixed(1))); });
      return g;
    };
    // a flat plate on the ground (a station, a road tile)
    S.plate = (o) => { const { x, y, z = 0, w, d, color = '#ECE4F7', t0 = 0, parent = svg } = o; const e = K.sv(parent, 'polygon', { points: pts([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]]), fill: color }); V.anim(e, 'opacity', [[0, 0], [t0, 1, .4]]); return e; };
    // the board: a floating plinth with a visible edge and a soft shadow
    S.board = (o) => {
      const { x, y, w, d, thick = 24, color = '#F2ECFA', edge = '#D9CCEC', t0 = 0, parent = svg } = o, g = K.sv(parent, 'g', {});
      const [sx, sy] = P(x + w / 2, y + d / 2, -thick); K.sv(g, 'ellipse', { cx: sx, cy: sy + 40 * k, rx: (w + d) * C30 * k * .55, ry: (w + d) * k * .14, fill: 'rgba(42,8,70,.10)' });
      K.sv(g, 'polygon', { points: pts([[x, y + d, 0], [x + w, y + d, 0], [x + w, y + d, -thick], [x, y + d, -thick]]), fill: mix(edge, '#FFFFFF', .2) });
      K.sv(g, 'polygon', { points: pts([[x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, -thick], [x + w, y, -thick]]), fill: edge });
      K.sv(g, 'polygon', { points: pts([[x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0]]), fill: color });
      V.on((t) => { const p = V.glide(V.seg(t, t0, .7)); g.style.opacity = p.toFixed(3); g.setAttribute('transform', `translate(0 ${((1 - p) * 40).toFixed(1)})`); });
      return g;
    };
    // a route on the ground: drawn ahead of what follows it, then a flow of dashes
    S.route = (o) => {
      const { points, t0 = 0, dur = 1, color = '#A100FF', width = 5, flow = true, parent = svg } = o;
      const d = 'M' + points.map(([x, y, z = 0]) => P(x, y, z).map((v) => v.toFixed(1)).join(' ')).join(' L');
      const base = K.sv(parent, 'path', { d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .35 }); V.draw(base, { t0, dur, ease: V.glide });
      if (flow) { const f = K.sv(parent, 'path', { d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-dasharray': '14 22' }); V.flow(f, { t0, speed: 60 }); V.anim(f, 'opacity', [[0, 0], [t0 + dur * .9, 1, .3]]); }
      return { d, base };
    };
    // something travelling a polyline of world points (eased), e.g. a truck drawn at points[0]
    S.along = (el, points, { t0, t1, ease = V.travel }) => {
      const L = [0]; for (let i = 1; i < points.length; i++) L.push(L[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
      const [x0, y0] = P(points[0][0], points[0][1], points[0][2] || 0);
      V.on((t) => { const u = ease(V.seg(t, t0, t1 - t0)) * L[L.length - 1]; let i = 1; while (i < L.length - 1 && L[i] < u) i++;
        const f = (u - L[i - 1]) / ((L[i] - L[i - 1]) || 1), a = points[i - 1], b = points[i], [sx, sy] = P(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, (a[2] || 0) + ((b[2] || 0) - (a[2] || 0)) * f);
        el.setAttribute('transform', `translate(${(sx - x0).toFixed(1)} ${(sy - y0).toFixed(1)})`); });
    };
    // a label pin in screen space (HTML parent): dot -> leader -> rule -> text
    S.pin = (parent, { x, y, z = 0, text, up = 110, side = 1, t0 = 0, tout = Infinity }) => {
      const [px, py] = P(x, y, z), e = K.div(parent, 'iso-pin', `left:${px.toFixed(1)}px;top:${py.toFixed(1)}px;`);
      const [I, B, U, SP] = ['i', 'b', 'u', 'span'].map((tg) => e.appendChild(document.createElement(tg))); SP.textContent = text;
      I.style.top = '-9px'; B.style.bottom = '0px'; U.style.top = -up + 'px'; SP.style.top = (-up - 48) + 'px';
      if (side > 0) { U.style.left = '0px'; SP.style.left = '0px'; } else { U.style.right = '0px'; SP.style.right = '0px'; }
      V.on((t) => { const a = V.glide(V.seg(t, t0, .25)), l = V.glide(V.seg(t, t0 + .15, .35)), r = V.glide(V.seg(t, t0 + .45, .3)), q = V.glide(V.seg(t, tout, .35));
        e.style.opacity = (1 - q).toFixed(3); e.style.visibility = a > 0 && q < 1 ? 'visible' : 'hidden';
        I.style.transform = `scale(${a.toFixed(3)})`; B.style.height = (up * l).toFixed(1) + 'px'; U.style.width = (160 * r).toFixed(1) + 'px'; SP.style.opacity = r.toFixed(3); SP.style.transform = `translateY(${((1 - r) * 10).toFixed(1)}px)`; });
      V.text('iso:' + text, text, t0, tout);
      return e;
    };
    // focus + context: everything else greys while the subject keeps its colour
    S.focus = (others, { t0, d = .5, tout = Infinity }) => V.on((t) => { const p = V.glide(V.seg(t, t0, d)) * (1 - V.glide(V.seg(t, tout, d))); others.forEach((g) => { g.style.filter = p > .01 ? `saturate(${(1 - .85 * p).toFixed(3)}) opacity(${(1 - .45 * p).toFixed(3)})` : 'none'; }); });
    return S;
  }
  window.VGEIso = { scene, tones, mix };
})();
