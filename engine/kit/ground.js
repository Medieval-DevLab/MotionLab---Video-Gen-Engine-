// VGE living ground: a lit world that changes with the story (owner 2026-11-03: "more dynamic, not just a plain
// background with a circle in it"). Every layer is a pure function of t. Layers, back to front:
//   base gradient (two tones, turning angle) · light · three drifting colour washes · the arc ·
//   one story texture at a time (dots, grid, studio floor, rings, rays, waves, contours) · floating frames at depth ·
//   light sweeps at chosen moments · vignette · grain.
// keys: [{t, d, e, ...props}] (see G_DEFAULT for every prop). Textures are faded by their own props (pDots, pGrid, ...).
(function () {
  const V = window.VGE, K = window.VGEKit, NS = 'http://www.w3.org/2000/svg';
  const META = new Set(['t', 'd', 'e', 'cut']);
  function kf(keys) {
    return (t) => {
      const c = {}; for (const k in keys[0]) if (!META.has(k)) c[k] = keys[0][k];
      for (let i = 1; i < keys.length; i++) { const k = keys[i]; if (t < k.t) break; const p = k.cut ? 1 : (k.e || V.travel)(V.seg(t, k.t, k.d ?? 1.2)); for (const n in k) if (!META.has(n)) c[n] = V.mix(c[n] ?? k[n], k[n], p); }
      return c;
    };
  }
  const G_DEFAULT = {
    r: 247, g: 244, b: 239, r2: 242, g2: 238, b2: 246, ang: 160,                 // base gradient
    lx: 84, ly: 0, la: .9,                                                       // light
    w1r: 245, w1g: 165, w1b: 36, w1a: .12, w1x: 12, w1y: 88,                     // wash 1 (drifts)
    w2r: 161, w2g: 0, w2b: 255, w2a: .08, w2x: 88, w2y: 18,                      // wash 2
    w3r: 255, w3g: 138, w3b: 101, w3a: .06, w3x: 60, w3y: 70,                    // wash 3
    drift: 1,                                                                    // wash drift amount
    ax: 80, ay: 1180, as: 1320, aa: .8, ar: 176, ag: 128, ab: 76,                // the arc
    pr: 161, pg: 0, pb: 255,                                                     // texture colour
    pDots: 0, pGrid: 0, pFloor: 0, pRings: 0, pRays: 0, pWaves: 0, pTopo: 0, pFrames: 0,
    rx: 50, ry: 50, wy: 78,                                                      // rings / rays centre (%), waves height (%)
    vig: .06,
  };
  const rgb = (c, p) => `${c[p + 'r'] | 0},${c[p + 'g'] | 0},${c[p + 'b'] | 0}`;
  const f3 = (v) => v.toFixed(3);

  function live(parent, keys, o = {}) {
    const at = kf([{ t: 0, ...G_DEFAULT, ...keys[0] }, ...keys.slice(1)]);
    const g = K.div(parent, 'fill', 'overflow:hidden;pointer-events:none;');
    const L = (style = '') => K.div(g, 'fill', style);
    const base = L(), light = L(), w1 = L(), w2 = L(), w3 = L();
    const arc = K.div(g, '', 'position:absolute;border-radius:50%;');
    const dots = L('background-size:48px 48px;'), grid = L('background-size:96px 96px;');
    const floorW = L('perspective:900px;perspective-origin:50% 0%;'), floor = K.div(floorW, '', 'position:absolute;left:-960px;top:560px;width:3840px;height:1400px;transform-origin:50% 0%;transform:rotateX(66deg);background-size:120px 120px;');
    const rings = L(), rays = L();
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1920 1080'); svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'; g.appendChild(svg);
    const waves = K.sv(svg, 'g', {}), topo = K.sv(svg, 'g', {}), frames = K.sv(svg, 'g', {});
    const WV = [0, 1, 2, 3, 4].map((i) => K.sv(waves, 'path', { fill: 'none', 'stroke-width': 2.5 - i * .3, 'stroke-linecap': 'round' }));
    const TP = [0, 1, 2, 3, 4, 5, 6, 7].map(() => K.sv(topo, 'path', { fill: 'none', 'stroke-width': 1.8 }));
    const rnd = K.rand(o.seed || 77);
    const FR = [...Array(6)].map((_, i) => ({ x: 120 + rnd() * 1680, y: 80 + rnd() * 920, w: 160 + rnd() * 260, h: 0, rot: (rnd() - .5) * 24, ph: rnd() * 6.28, sp: .12 + rnd() * .1, el: K.sv(frames, 'rect', { fill: 'none', 'stroke-width': 2, rx: 18 }) }));
    FR.forEach((f) => { f.h = f.w * (rnd() > .5 ? .5625 : 1); });
    const sweep = L('background:linear-gradient(105deg, rgba(255,255,255,0) 38%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 62%);mix-blend-mode:soft-light;');
    const vig = L(); L('').className = 'fill grain-live';
    const SW = o.sweeps || [];
    const mask = (el, m) => { el.style.webkitMaskImage = m; el.style.maskImage = m; };
    mask(dots, 'radial-gradient(75% 85% at 50% 55%, #000 0%, rgba(0,0,0,.45) 55%, transparent 90%)');
    mask(grid, 'radial-gradient(80% 90% at 50% 50%, #000 0%, rgba(0,0,0,.35) 60%, transparent 95%)');
    mask(floorW, 'linear-gradient(180deg, transparent 50%, #000 75%)');

    V.on((t) => {
      const c = at(t), dr = c.drift, ts = t * .11;
      base.style.background = `linear-gradient(${c.ang.toFixed(1)}deg, rgb(${rgb(c, '')}) 0%, rgb(${c.r2 | 0},${c.g2 | 0},${c.b2 | 0}) 100%)`;
      light.style.background = `radial-gradient(62% 78% at ${c.lx.toFixed(1)}% ${c.ly.toFixed(1)}%, rgba(255,255,255,${f3(c.la)}) 0%, rgba(255,255,255,0) 64%)`;
      [[w1, 'w1', 0], [w2, 'w2', 2.1], [w3, 'w3', 4.2]].forEach(([el, p, ph]) => {
        const x = c[p + 'x'] + dr * 7 * Math.sin(ts + ph), y = c[p + 'y'] + dr * 6 * Math.cos(ts * .8 + ph), a = c[p + 'a'];
        el.style.background = `radial-gradient(${(44 + 6 * Math.sin(ts * .7 + ph)).toFixed(1)}% ${(56 + 6 * Math.cos(ts * .6 + ph)).toFixed(1)}% at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgba(${rgb(c, p)},${f3(a)}) 0%, rgba(${rgb(c, p)},0) 72%)`;
      });
      Object.assign(arc.style, { left: (c.ax - c.as / 2).toFixed(1) + 'px', top: (c.ay - c.as / 2).toFixed(1) + 'px', width: c.as.toFixed(1) + 'px', height: c.as.toFixed(1) + 'px', opacity: f3(c.aa),
        background: `radial-gradient(circle at 40% 30%, rgba(${rgb(c, 'a')},.10) 0%, rgba(${rgb(c, 'a')},.03) 45%, rgba(${rgb(c, 'a')},0) 70%)`, boxShadow: `inset 0 0 0 1.5px rgba(${rgb(c, 'a')},.17)` });
      const pc = rgb(c, 'p');
      // dots: a slow drifting lattice
      dots.style.opacity = f3(c.pDots); if (c.pDots > .003) { dots.style.backgroundImage = `radial-gradient(circle, rgba(${pc},.36) 1.6px, transparent 2.1px)`; dots.style.backgroundPosition = `${(t * 6 % 48).toFixed(1)}px ${(t * 3 % 48).toFixed(1)}px`; }
      // grid lines (structure)
      grid.style.opacity = f3(c.pGrid); if (c.pGrid > .003) { grid.style.backgroundImage = `linear-gradient(rgba(${pc},.17) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(${pc},.17) 1.5px, transparent 1.5px)`; grid.style.backgroundPosition = `${(t * -5 % 96).toFixed(1)}px ${(t * 4 % 96).toFixed(1)}px`; }
      // a studio floor in perspective, flowing toward the viewer
      floorW.style.opacity = f3(c.pFloor); if (c.pFloor > .003) { floor.style.backgroundImage = `linear-gradient(rgba(${pc},.22) 2px, transparent 2px), linear-gradient(90deg, rgba(${pc},.22) 2px, transparent 2px)`; floor.style.backgroundPosition = `0px ${(t * 40 % 120).toFixed(1)}px`; }
      // focus rings, slowly expanding from a centre
      rings.style.opacity = f3(c.pRings); if (c.pRings > .003) { const ph = (t * 22) % 90; rings.style.background = `repeating-radial-gradient(circle at ${c.rx.toFixed(1)}% ${c.ry.toFixed(1)}%, rgba(${pc},0) 0px, rgba(${pc},0) ${ph.toFixed(1)}px, rgba(${pc},.22) ${(ph + 1).toFixed(1)}px, rgba(${pc},.22) ${(ph + 3).toFixed(1)}px, rgba(${pc},0) ${(ph + 4).toFixed(1)}px, rgba(${pc},0) 90px)`;
        mask(rings, `radial-gradient(48% 62% at ${c.rx.toFixed(1)}% ${c.ry.toFixed(1)}%, #000 0%, rgba(0,0,0,.5) 50%, transparent 100%)`); }
      // light rays turning slowly about a point
      rays.style.opacity = f3(c.pRays); if (c.pRays > .003) { rays.style.background = `repeating-conic-gradient(from ${(t * 3 % 360).toFixed(2)}deg at ${c.rx.toFixed(1)}% ${c.ry.toFixed(1)}%, rgba(${pc},.07) 0deg 5deg, rgba(${pc},0) 5deg 15deg)`;
        mask(rays, `radial-gradient(70% 80% at ${c.rx.toFixed(1)}% ${c.ry.toFixed(1)}%, rgba(0,0,0,.2) 0%, #000 30%, transparent 85%)`); }
      // flowing waves (motion, the sea)
      waves.style.opacity = f3(c.pWaves); if (c.pWaves > .003) WV.forEach((p, i) => { let d = ''; const yb = 1080 * c.wy / 100 + i * 34, A = 26 - i * 3, k = .0042 + i * .0007, sp = .7 + i * .15;
        for (let x = -40; x <= 1960; x += 40) d += (x === -40 ? 'M' : 'L') + x + ' ' + (yb + A * Math.sin(x * k + t * sp + i) + 10 * Math.sin(x * .011 - t * .9)).toFixed(1) + ' ';
        p.setAttribute('d', d); p.setAttribute('stroke', `rgba(${pc},${(.22 - i * .03).toFixed(2)})`); });
      // contour lines (terrain, the world)
      topo.style.opacity = f3(c.pTopo); if (c.pTopo > .003) TP.forEach((p, i) => { let d = ''; const R0 = 120 + i * 78, cx = 1920 * c.rx / 100, cy = 1080 * c.ry / 100;
        for (let j = 0; j <= 48; j++) { const an = j / 48 * 6.2832, r = R0 * (1 + .12 * Math.sin(an * 3 + t * .25 + i * .7) + .07 * Math.sin(an * 5 - t * .18 + i)); d += (j ? 'L' : 'M') + (cx + Math.cos(an) * r * 1.5).toFixed(1) + ' ' + (cy + Math.sin(an) * r).toFixed(1) + ' '; }
        p.setAttribute('d', d + 'Z'); p.setAttribute('stroke', `rgba(${pc},${(.26 - i * .018).toFixed(3)})`); });
      // floating frames at depth (the MotionLab motif), drifting
      frames.style.opacity = f3(c.pFrames); if (c.pFrames > .003) FR.forEach((f) => { const x = f.x + 40 * Math.sin(t * f.sp + f.ph), y = f.y + 30 * Math.cos(t * f.sp * .8 + f.ph);
        f.el.setAttribute('x', (x - f.w / 2).toFixed(1)); f.el.setAttribute('y', (y - f.h / 2).toFixed(1)); f.el.setAttribute('width', f.w.toFixed(1)); f.el.setAttribute('height', f.h.toFixed(1));
        f.el.setAttribute('transform', `rotate(${(f.rot + 6 * Math.sin(t * f.sp * .5 + f.ph)).toFixed(2)} ${x.toFixed(1)} ${y.toFixed(1)})`); f.el.setAttribute('stroke', `rgba(${pc},.24)`); });
      // light sweeps at the big moves
      let sw = 0, sx = -120; for (const s0 of SW) { const p = V.seg(t, s0, 1.3); if (p > 0 && p < 1) { sw = Math.sin(Math.PI * p); sx = V.mix(-120, 120, V.travel(p)); } }
      sweep.style.opacity = f3(sw); sweep.style.transform = `translateX(${sx.toFixed(1)}%)`;
      vig.style.background = `radial-gradient(120% 95% at 50% 45%, rgba(30,16,40,0) 52%, rgba(30,16,40,${f3(c.vig)}) 100%)`;
    });
    return g;
  }
  window.VGEGround = { live, G_DEFAULT };
})();
