// Aether: the first film on the rebuilt engine. The plan is FILM.md §4. Timed as if narrated (no VO yet): each
// element enters on its spoken word (~2.5 words/s). World stages: P port · H hub · D decision · A approval ·
// R recovery, joined by the journey line. Text sits in screen slots; the camera moves the world only.
(function () {
  const V = VGE, K = VGEKit;
  const F = document.getElementById('frame');
  window.DUR = 81.0;
  window.MUSIC = { file: 'library/audio/music/uplifting-inspiring.mp3', start: 0, fadeIn: 1.2, fadeOut: 3.5, gain: 0 };
  const a = 'library/audio/sfx/';
  const S = { click: a + 'camera/click-camera.mp3', tick: a + 'counter/clock-tick-single.mp3', sweep: a + 'data/sweep-digital.mp3', zout: a + 'camera/ui-zoom-out.mp3',
    hit: a + 'impact/hit-weak.mp3', bass: a + 'impact/bass-hit-short.mp3', whoosh: a + 'impact/impact-deep-whoosh.mp3', lock: a + 'mech/lock-digital.mp3', lockq: a + 'mech/lock-quick.mp3',
    glitch: a + 'data/glitch-electric-small.mp3', shimmer: a + 'light/sparkle-touch.mp3', shimmerSweep: a + 'light/shimmer-sparkle-sweep.mp3', knob: a + 'counter/clock-knob-spin.mp3' };

  // ---- layers: ground (screen) · depth (parallax 0.8) · world (camera) · chapter disc · text (screen)
  const ground = K.ground(F);
  const depth = K.div(F, 'depth');
  const world = K.div(F); world.id = 'world';
  const chap = K.div(F, 'chapter deep'); K.ground(chap);
  const textL = K.div(F, 'fill');
  const X = { P: 0, H: 1920, D: 3840, A: 5760, R: 7680 };
  const stage = (x0) => K.div(world, 'layer', `left:${x0}px;width:1920px;height:1080px;`);
  const P = stage(X.P), H = stage(X.H), D = stage(X.D), Ast = stage(X.A), R = stage(X.R);
  const far = (sx, x, y, ic, tin, tout) => { const c = K.chip(depth, { x: x + sx * .8, y, ic, size: 's' }); c.classList.add('far'); V.vis(c, { tin, tout, base: 'translate(-50%,-50%)', rise: 12, to: .6 }); };
  const T = (o) => K.textBlock(textL, o);

  // ---- camera: a slow push through the opening; a hidden cut under the chapter; travels between stages
  V.camera(world, [
    { t: 0, x: 0, y: 0, s: 1 }, { t: 0, s: 1.025, d: 12.8, ease: V.linear },
    { t: 13.95, x: X.H, s: 1, cut: true }, { t: 24.4, x: X.H + 480, d: 1.2 }, { t: 33.3, x: X.D, d: 1.6 },
    { t: 51.1, x: X.A, d: 1.4 }, { t: 54.0, x: X.R, d: 1.4 },
  ], [{ el: ground.arc, k: .04, ky: 0 }, { el: depth, k: .8, ky: 0 }]);
  [[33.4, S.sweep], [51.2, S.sweep], [54.1, S.sweep]].forEach(([t, f]) => V.sfx(t, f, -24));

  // ---- chapter disc: grows from the arc (s03), collapses into the hub core (Become), returns for the close (s14)
  V.disc(chap, [{ r: 0, cx: 1840, cy: 1160 }, { t: 12.8, r: 2400, d: 1.1 }, { t: 16.6, r: 120, cx: 1315, cy: 624, d: .9 },
    { t: 17.5, r: 0, d: .01 }, { t: 68.75, r: 0, cx: 1840, cy: 1160, d: .01 }, { t: 68.8, r: 2400, d: 1.1 }]);
  V.anim(chap, 'opacity', [[0, 1], [17.2, 0, .3], [68.7, 1, .05]]);
  V.sfx(12.85, S.whoosh, -24); V.sfx(68.85, S.whoosh, -24);

  // ================= s01–s02 · P: the port. The route flows, a disruption, a standstill, the detail
  const sP = K.svg(P);
  K.port(sP); K.ship(sP, 296, 660);
  const pulse = K.sv(sP, 'circle', { cx: 736, cy: 768, r: 10, fill: 'none', stroke: '#E5484D', 'stroke-width': 3 });
  V.on((t) => { const p = V.seg(t, 1.4, 1.4); pulse.setAttribute('r', (10 + 70 * V.glide(p)).toFixed(1)); pulse.style.opacity = (p > 0 && p < 1 ? (1 - p) * .8 : 0).toFixed(3); });
  K.sv(sP, 'circle', { cx: 736, cy: 768, r: 18, fill: 'none', stroke: '#A100FF', 'stroke-width': 2, opacity: .3 });
  K.sv(sP, 'circle', { cx: 736, cy: 768, r: 9, fill: '#A100FF' });
  ['M 760 768 C 960 768, 960 708, 1102 708', 'M 1126 708 C 1200 696, 1250 560, 1382 560', 'M 1126 708 L 1382 708', 'M 1126 708 C 1200 720, 1250 856, 1382 856'].forEach((d, i) => {
    const r = K.path(sP, d, { dash: '12 12' }); V.draw(r, { t0: .3 + i * .15, dur: 1.0 }); V.flow(r, { t0: 0, t1: 5.0, speed: 36 }); V.anim(r, 'opacity', [[0, .9], [5.0, .5, .6]]);
  });
  const node = K.sv(sP, 'circle', { cx: 1114, cy: 708, r: 7, fill: '#A100FF' }); V.anim(node, 'opacity', [[0, 0], [1.0, .9, .4], [5.0, .5, .6]]);
  for (const y of [484, 632, 780]) K.factory(sP, 1398, y);
  const bracket = K.path(sP, 'M 1532 484 H 1540 V 892 H 1532', { stroke: '#D5CCE3', width: 2, cap: 'butt' }); V.anim(bracket, 'opacity', [[0, 0], [10.6, 1, .5]]);
  V.vis(K.div(P, 't-label', 'position:absolute;left:120px;top:920px;color:var(--ink-2);', 'Singapore'), { tin: .5, rise: 12 });
  V.vis(K.pill(P, { x: 418, y: 588, text: 'Delayed', ic: 'clock', kind: 'risk' }), { tin: 7.4, scaleFrom: .92, rise: 12 });
  V.vis(K.div(P, 't-label', 'position:absolute;left:1564px;top:668px;display:flex;align-items:center;gap:12px;', `<span style="color:var(--risk);display:flex">${K.icon('clock', 32)}</span>48 h left`), { tin: 10.6, rise: 12 });
  far(X.P, 1330, 180, 'ship', 1.0, 13.0); far(X.P, 1730, 170, 'container', 1.2, 13.0); far(X.P, 930, 930, 'package', 1.4, 13.0);
  V.sfx(1.4, S.hit, -18); V.sfx(7.4, S.click, -20); V.sfx(10.6, S.tick, -18);
  T({ slot: 'T2', tin: .6, tout: 5.6, lines: [{ t: 'A single *disruption*', kwAt: 1.4 }, { t: 'can bring a supply chain to a standstill.', role: 'sub', dt: 1.4, gap: 16 }] });
  T({ slot: 'T2', tin: 6.2, tout: 12.8, lines: [{ t: 'A shipment is *delayed*', kwAt: 7.4 }, { t: 'in Singapore' }, { t: 'Three factories have 48 hours of inventory remaining.', role: 'sub', dt: 2.8, gap: 16 }] });

  // ================= s03 · chapter: Introducing Aether (the wordmark becomes the hub core)
  const sC = K.svg(chap);
  const th1 = K.path(sC, 'M 0 790 C 600 820, 1320 760, 1920 790', { stroke: '#D7A8FF', width: 3, opacity: .55 }); V.draw(th1, { t0: 13.6, dur: 1.4, ease: V.glide });
  const st1 = K.sv(sC, 'g'); st1.innerHTML = '<circle cx="960" cy="790" r="20" fill="none" stroke="#D7A8FF" stroke-width="2" opacity=".6"/><circle cx="960" cy="790" r="8" fill="#FFFFFF"/>';
  V.anim(st1, 'opacity', [[0, 0], [14.8, 1, .4], [16.5, 0, .3]]); V.anim(th1, 'opacity', [[0, .55], [16.5, 0, .3]]);
  const intro = T({ slot: 'T3', deep: true, tin: 13.3, tout: 16.4, lines: [{ t: 'Introducing', role: 'label' }, { t: 'Aether', role: 'display', gap: 16, manual: true }, { t: 'The AI-powered supply chain control tower', role: 'sub', dt: 1.1, gap: 24 }] });
  const wm = intro.lines[1]; wm.style.transformOrigin = '50% 50%';
  V.on((t) => { // enter on its word, then move and shrink into the core (centre 960,508 → 1315,624; 168 → 40 px)
    const e = V.glide(V.seg(t, 13.8, .7)), b = V.travel(V.seg(t, 16.6, .9)), op = t >= 17.45 ? 0 : e;
    wm.style.transform = `translate(${(355 * b).toFixed(1)}px, ${(116 * b + (1 - e) * 24).toFixed(1)}px) scale(${V.mix(1, 40 / 168, b).toFixed(4)})`;
    wm.style.opacity = op.toFixed(3); wm.style.visibility = op < .002 ? 'hidden' : 'visible';
  });
  V.sfx(13.8, S.bass, -18);

  // ================= s04–s06 · H: the hub. Inputs build per mention, data gathers into the core; risk assessment
  const sH = K.svg(H);
  V.draw(K.sv(sH, 'circle', { cx: 1315, cy: 624, r: 184, fill: 'none', stroke: '#E2DCEA', 'stroke-width': 2 }), { t0: 17.6, dur: .9, ease: V.glide });
  const grpIn = K.div(H, 'layer'); V.anim(grpIn, 'opacity', [[0, 1], [24.5, 0, .6]]);
  const sHc = K.svg(grpIn);
  const inputs = [['truck', 'Live shipment tracking', 384, 18.4, 'M 664 432 C 900 432, 1000 553, 1218 553', 'map-pin', .62],
    ['database', 'ERP systems', 512, 19.6, 'M 664 560 C 900 560, 1000 599, 1198 599', 'file-text', .48],
    ['warehouse', 'Warehouse inventories', 640, 20.4, 'M 664 688 C 900 688, 1000 649, 1198 649', 'boxes', .58],
    ['network', 'Carrier networks', 768, 21.6, 'M 664 816 C 900 816, 1000 695, 1218 695', 'route', .45]];
  inputs.forEach(([ic, label, y, t0, d, chipIc, rest], i) => {
    V.vis(K.card(grpIn, { x: 120, y, w: 544, ic, label }), { tin: t0, x: -24, rise: 0 }); V.sfx(t0, S.click, -24);
    const p = K.path(sHc, d, { stroke: '#D5CCE3', width: 2 }); V.draw(p, { t0: t0 + .2, dur: .8, ease: V.glide });
    const c = K.chip(grpIn, { x: 0, y: 0, ic: chipIc, size: i % 2 ? 's' : 'm' }), len = p.getTotalLength(), tc = t0 + .5;
    V.on((t) => { // the data travels in, rests on its connector, then gathers into the core on "one intelligent ecosystem"
      const m = V.glide(V.seg(t, tc, 1.4)), g = V.travel(V.seg(t, 22.8, .7)), q = p.getPointAtLength(len * rest * m);
      c.style.left = V.mix(q.x, 1315, g).toFixed(1) + 'px'; c.style.top = V.mix(q.y, 624, g).toFixed(1) + 'px';
      const op = V.glide(V.seg(t, tc, .4)) * (1 - g); c.style.opacity = op.toFixed(3); c.style.visibility = op < .002 ? 'hidden' : 'visible';
      c.style.transform = `translate(-50%,-50%) scale(${V.mix(1, .4, g).toFixed(3)})`;
    });
  });
  const coreEl = K.core(H, { cx: 1315, cy: 624, label: 'Aether' });
  V.on((t) => { const pu = Math.sin(Math.PI * V.seg(t, 23.0, .6)) + Math.sin(Math.PI * V.seg(t, 25.6, .6)); coreEl.style.opacity = t >= 16.9 ? 1 : 0; coreEl.style.transform = `scale(${(1 + .05 * pu).toFixed(4)})`; });
  V.sfx(23.1, S.shimmer, -24);
  V.draw(K.path(sH, 'M 1435 624 C 1650 624, 1700 880, 1920 880'), { t0: 23.6, dur: .8 });
  far(X.H, 1590, 360, 'package', 18.2, 24.3); far(X.H, 1704, 808, 'boxes', 18.4, 24.3);
  T({ slot: 'T2', tin: 17.9, tout: 25.4, lines: [{ t: 'One *intelligent* ecosystem', kwAt: 23.2 }] });
  // s05: the delay arrives at the core; the assessment opens and scans · s06: three results, one per sentence
  const rr = K.sv(sH, 'circle', { cx: 1315, cy: 624, r: 124, fill: 'none', stroke: '#E5484D', 'stroke-width': 3 });
  V.on((t) => { const p = V.seg(t, 25.6, 1.2); rr.setAttribute('r', (124 + 60 * V.glide(p)).toFixed(1)); rr.style.opacity = (p > 0 && p < 1 ? (1 - p) * .7 : 0).toFixed(3); });
  V.vis(K.pill(H, { x: 1232, y: 440, text: 'Delayed', ic: 'clock', kind: 'risk' }), { tin: 25.6, tout: 33.1, scaleFrom: .92, rise: 12 }); V.sfx(25.6, S.click, -20);
  const rc = K.div(H, 'card kcard risk-card', 'left:1640px;top:344px;width:560px;height:328px;',
    `<div class="hdr"><div class="badge">${K.icon('scan-search')}</div><div class="title">Risk assessment</div></div><div class="scan"><i></i></div>`);
  V.vis(rc, { tin: 26.2, tout: 33.1 }); V.sfx(26.2, S.lock, -22);
  const bar = rc.querySelector('.scan i'); V.on((t) => { bar.style.transform = `scaleX(${V.glide(V.seg(t, 26.4, 1.4)).toFixed(4)})`; });
  [['Demand forecasts', 'Recalculated', 'refresh-cw', 'accent', 28.4], ['Affected orders', 'Flagged', 'flag', 'risk', 30.0], ['Production risks', 'Surfaced', 'triangle-alert', 'risk', 32.0]].forEach(([l, s, ic, kind, t0], i) => {
    const r = K.div(rc, 'rrow', `top:${120 + i * 64}px;`, `<div class="t-label">${l}</div>`); K.pill(r, { x: 0, y: 0, text: s, ic, kind }).classList.add('inline');
    V.vis(r, { tin: t0, rise: 12 }); V.sfx(t0, S.click, -24);
  });
  T({ slot: 'T2', tin: 25.8, tout: 33.0, lines: [{ t: 'An automated *risk assessment*', kwAt: 26.6 }] });

  // ================= s07–s09 · D: three alternatives, evaluated, gathered into one recommendation
  const sD = K.svg(D);
  V.draw(K.path(sD, 'M 0 880 L 288 880'), { t0: 33.4, dur: .6 });
  V.anim(K.sv(sD, 'circle', { cx: 300, cy: 880, r: 9, fill: '#A100FF' }), 'opacity', [[0, 0], [34.6, 1, .3]]);
  const optX = [192, 760, 1328], optT = [35.0, 36.2, 37.4];
  const opts = [['clock', 'Wait for delivery', 'M 312 880 C 340 880, 392 860, 392 800'], ['route', 'Reroute shipments', 'M 312 880 C 600 880, 960 880, 960 800'], ['warehouse', 'Redistribute inventory', 'M 312 880 C 900 880, 1528 900, 1528 800']];
  opts.forEach(([ic, title, d], i) => {
    const w = K.div(D, 'layer'); w.style.transformOrigin = `${optX[i] + 200}px 590px`;
    const c = K.div(w, 'card kcard opt', `left:${optX[i]}px;top:380px;width:400px;height:420px;`, `<div class="badge">${K.icon(ic)}</div><div class="otitle">${title}</div><div class="divider"></div>`);
    V.vis(c, { tin: optT[i] }); V.sfx(optT[i], S.click, -24);
    const b = K.path(sD, d, { dash: '12 12' }); V.draw(b, { t0: optT[i] + .1, dur: .7, ease: V.glide }); V.anim(b, 'opacity', [[0, .7], [45.0, 0, .5]]);
    ['Cost', 'Capacity', 'Delivery'].forEach((k, j) => V.vis(K.div(c, 'crit t-label', `top:${256 + j * 44}px;`, K.icon('circle-check', 26) + k), { tin: [41.6, 42.0, 42.8][j], rise: 8 }));
    const dx = 605 - (optX[i] + 200), dy = 520 - 590; // gather toward the recommendation
    V.on((t) => { const g = V.travel(V.seg(t, 45.0, .7)); w.style.transform = `translate(${(dx * g).toFixed(1)}px, ${(dy * g).toFixed(1)}px) scale(${V.mix(1, .6, g).toFixed(3)})`; w.style.opacity = (1 - V.glide(V.seg(t, 45.35, .45))).toFixed(3); });
  });
  [41.6, 42.0, 42.8].forEach((t) => V.sfx(t, S.tick, -24));
  const rec = K.div(D, 'card kcard', 'left:262px;top:400px;width:686px;height:240px;', `<div class="row"><div class="badge">${K.icon('split')}</div><div class="title">Split-shipment strategy</div></div>`);
  V.vis(rec, { tin: 45.35, scaleFrom: .9 }); V.sfx(45.0, S.zout, -22); V.sfx(45.9, S.lockq, -22);
  V.vis(K.pill(rec, { x: 20, y: 104, text: 'Recommended', ic: 'check', kind: 'accent' }), { tin: 46.0, rise: 8 });
  V.vis(K.div(rec, '', 'position:absolute;left:20px;top:180px;display:flex;align-items:center;gap:12px;color:var(--ok);', K.icon('shield-check', 28) + '<span class="t-label" style="color:var(--ink)">Production protected</span>'), { tin: 50.0, rise: 8 });
  V.sfx(50.0, S.shimmer, -24);
  ['M 312 880 C 800 880, 900 820, 1300 820 C 1600 820, 1700 880, 1920 880', 'M 312 880 C 800 880, 900 940, 1300 940 C 1600 940, 1700 880, 1920 880'].forEach((d) => V.draw(K.path(sD, d), { t0: 45.6, dur: 1.0, ease: V.glide }));
  const big = K.div(D, 't-display', 'position:absolute;left:1114px;top:392px;color:var(--purple);', '0%');
  V.vis(big, { tin: 48.0, rise: 16 }); V.count(big, { t0: 48.2, dur: 1.0, from: 0, to: 12, fmt: (v) => Math.round(v) + '%' }); V.sfx(48.2, S.knob, -22);
  V.vis(K.div(D, 't-sub', 'position:absolute;left:1114px;top:576px;', 'lower projected costs'), { tin: 48.4, rise: 12 });
  V.text('d:12', '12% lower projected costs', 48.0, 51.1);
  T({ slot: 'T2', tin: 34.2, tout: 39.3, lines: [{ t: 'Three *alternatives*,', kwAt: 34.6 }, { t: 'simulated' }] });
  T({ slot: 'T2', tin: 39.6, tout: 43.9, lines: [{ t: 'Each scenario, *evaluated*', kwAt: 40.8 }] });
  T({ slot: 'T2', tin: 45.4, tout: 51.0, lines: [{ t: 'A *split-shipment*', kwAt: 45.8 }, { t: 'strategy' }] });

  // ================= s10 · A: the human decision (people panel)
  const sA = K.svg(Ast);
  V.draw(K.path(sA, 'M 0 880 L 848 880'), { t0: 51.4, dur: .9, ease: V.glide });
  V.draw(K.path(sA, 'M 872 880 C 1200 880, 1500 648, 1920 648'), { t0: 52.3, dur: .6 }); // continues behind the photo
  V.anim(K.sv(sA, 'circle', { cx: 860, cy: 880, r: 9, fill: '#A100FF' }), 'opacity', [[0, 0], [52.2, 1, .3]]);
  const ph = K.photo(Ast, { x: 972, y: 0, w: 948, h: 1080, src: '../../library/photos/laptop-work-ed1c4fde.jpg' });
  V.on((t) => { ph.img.style.transform = `scale(${V.mix(1, 1.05, V.seg(t, 50.0, 7.0)).toFixed(4)})`; });
  V.vis(K.div(Ast, 'card kcard', 'left:1036px;top:776px;width:560px;height:96px;', `<div class="row"><div class="badge">${K.icon('split')}</div><div class="title">Split-shipment strategy</div></div>`), { tin: 52.0, rise: 16 });
  V.vis(K.pill(Ast, { x: 1036, y: 888, text: 'Approved', ic: 'user-check', kind: 'ok' }), { tin: 52.4, scaleFrom: .92, rise: 8 }); V.sfx(52.4, S.lockq, -20);
  T({ slot: 'T1', tin: 51.8, tout: 54.4, lines: [{ t: 'A planner *approves*', role: 'state', kwAt: 52.2 }, { t: 'the recommendation', role: 'sub', dt: .8, gap: 16 }] });

  // ================= s11–s13 · R: rejection, the exception handled, recovery
  const sR = K.svg(R);
  V.draw(K.path(sR, 'M 0 648 L 120 648'), { t0: 54.4, dur: .5 });
  V.vis(K.card(R, { x: 120, y: 600, w: 402, ic: 'package', label: 'Shipment booking' }), { tin: 54.6 });
  const c1w = K.div(R, 'layer'); V.anim(c1w, 'opacity', [[0, 1], [61.8, .35, .6]]);
  V.vis(K.card(c1w, { x: 688, y: 400, w: 544, ic: 'ship', label: 'First carrier' }), { tin: 54.8 });
  const r1 = K.path(sR, 'M 522 648 C 610 648, 600 448, 688 448', { dash: '12 12' }); V.draw(r1, { t0: 55.0, dur: .5 });
  V.anim(r1, 'stroke', [[0, '#A100FF'], [55.8, '#E5484D', .3], [61.8, '#D5CCE3', .6]]);
  const r1f = K.path(sR, 'M 1232 448 C 1310 448, 1310 664, 1382 664', { dash: '12 12' }); V.draw(r1f, { t0: 55.3, dur: .5 }); V.anim(r1f, 'opacity', [[0, .6], [55.8, .25, .3], [61.8, 0, .6]]);
  const fac = K.svg(R); for (const y of [456, 584, 712]) K.factory(fac, 1398, y); V.anim(fac, 'opacity', [[0, 0], [54.9, 1, .5]]);
  const dots = [520, 648, 776].map((y) => K.sv(fac, 'circle', { cx: 1500, cy: y - 40, r: 7, fill: '#E5484D' }));
  dots.forEach((d) => V.anim(d, 'fill', [[0, '#E5484D'], [68.2, '#1E9E6A', .5]]));
  V.vis(K.div(R, 't-label', 'position:absolute;left:1398px;top:848px;display:flex;align-items:center;gap:12px;', `<span style="color:var(--risk);display:flex">${K.icon('clock', 32)}</span>48 h left`), { tin: 55.4, tout: 66.2, rise: 8 });
  V.vis(K.div(R, 't-label', 'position:absolute;left:1398px;top:848px;display:flex;align-items:center;gap:12px;', `<span style="color:var(--ok);display:flex">${K.icon('trending-up', 32)}</span>Coverage improving`), { tin: 66.4, rise: 8 });
  V.vis(K.pill(c1w, { x: 688, y: 504, text: 'Rejected', ic: 'circle-x', kind: 'risk' }), { tin: 55.8, scaleFrom: .92, rise: 8 }); V.sfx(55.8, S.glitch, -26);
  const xm = K.div(R, 'chip s', 'left:605px;top:548px;color:var(--risk);', K.icon('x', 22)); V.vis(xm, { tin: 55.9, tout: 61.8, base: 'translate(-50%,-50%)', scaleFrom: .8, rise: 0 });
  // s12: detected → alternative carrier → executed (the line is redrawn ahead of the story)
  const det = K.div(R, 'chip m', 'left:1290px;top:448px;', K.icon('scan-search', 26)); V.vis(det, { tin: 58.8, tout: 61.8, base: 'translate(-50%,-50%)', scaleFrom: .8, rise: 0 }); V.sfx(58.8, S.lock, -22);
  const dr = K.sv(sR, 'circle', { cx: 1290, cy: 448, r: 30, fill: 'none', stroke: '#A100FF', 'stroke-width': 2 });
  V.on((t) => { const p = V.seg(t, 58.9, 1.0); dr.setAttribute('r', (30 + 40 * V.glide(p)).toFixed(1)); dr.style.opacity = (p > 0 && p < 1 ? (1 - p) * .6 : 0).toFixed(3); });
  V.vis(K.card(R, { x: 688, y: 760, w: 544, ic: 'ship', label: 'Alternative carrier' }), { tin: 60.0 }); V.sfx(60.0, S.click, -22);
  V.draw(K.path(sR, 'M 522 648 C 610 648, 600 808, 688 808'), { t0: 60.2, dur: .8, ease: V.glide });
  const r2f = K.path(sR, 'M 1232 808 C 1310 808, 1310 664, 1382 664'); V.draw(r2f, { t0: 61.8, dur: 1.0, ease: V.glide });
  V.vis(K.pill(R, { x: 688, y: 864, text: 'Booking…', kind: 'neutral' }), { tin: 60.2, tout: 61.6, rise: 8 });
  V.vis(K.pill(R, { x: 688, y: 864, text: 'Booked', ic: 'check', kind: 'ok' }), { tin: 61.6, tout: 64.6, rise: 8 }); V.sfx(61.6, S.lockq, -20);
  V.vis(K.pill(R, { x: 688, y: 864, text: 'In transit', ic: 'refresh-ccw', kind: 'accent' }), { tin: 64.6, rise: 8 });
  V.vis(K.pill(R, { x: 120, y: 704, text: 'In transit', ic: 'refresh-ccw', kind: 'accent' }), { tin: 64.6, rise: 8 }); V.sfx(64.6, S.click, -22);
  const shp = K.div(R, 'chip s', 'left:0;top:0;', K.icon('package', 22)); K.travelAlong(shp, r2f, { t0: 62.9, t1: 65.9 }); V.anim(shp, 'opacity', [[0, 0], [62.9, 1, .3], [65.9, 0, .3]]);
  V.sfx(66.2, S.tick, -22); V.sfx(68.2, S.shimmer, -22);
  T({ slot: 'T2', tin: 54.9, tout: 58.0, lines: [{ t: 'The first carrier' }, { t: '*rejects* the booking', kwAt: 55.8 }] });
  T({ slot: 'T2', tin: 58.2, tout: 63.5, lines: [{ t: 'Aether *executes*', kwAt: 61.6 }, { t: 'the revised workflow' }] });
  T({ slot: 'T2', tin: 63.8, tout: 68.9, lines: [{ t: 'Statuses sync.' }, { t: 'Coverage *improves*.', kwAt: 66.2 }] });

  // ================= s14–s15 · chapter: the close. Hundreds of variables gather into one decision; the end card
  const th2 = K.path(sC, 'M 0 900 C 600 930, 1320 870, 1920 900', { stroke: '#D7A8FF', width: 3, opacity: .55 }); V.draw(th2, { t0: 72.6, dur: 1.2, ease: V.glide });
  const st2 = K.sv(sC, 'g'); st2.innerHTML = '<circle cx="960" cy="900" r="20" fill="none" stroke="#D7A8FF" stroke-width="2" opacity=".6"/><circle cx="960" cy="900" r="8" fill="#FFFFFF"/>';
  V.anim(st2, 'opacity', [[0, 0], [73.2, 1, .4]]);
  const rnd = K.rand(7), dotsL = K.div(chap, 'fill');
  for (let i = 0; i < 160; i++) {
    const x = 60 + rnd() * 1800, y = 60 + rnd() * 960, t0 = 70.6 + rnd() * .8, tg = 72.3 + rnd() * .3, sz = .6 + rnd() * .9;
    const d = K.div(dotsL, 'dot', `left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;`);
    V.on((t) => { const e = V.glide(V.seg(t, t0, .6)), g = V.travel(V.seg(t, tg, 1.0)), op = e * .55 * (1 - V.seg(t, tg + .8, .2));
      d.style.transform = `translate(${((960 - x) * g).toFixed(1)}px, ${((900 - y) * g).toFixed(1)}px) scale(${(sz * (1 - .5 * g)).toFixed(3)})`;
      d.style.opacity = op.toFixed(3); d.style.visibility = op < .002 ? 'hidden' : 'visible'; });
  }
  V.sfx(72.4, S.shimmerSweep, -26);
  T({ slot: 'T3', deep: true, tin: 69.2, tout: 73.9, lines: [{ t: 'One disruption.' }, { t: 'Hundreds of variables.', dt: 1.2 }, { t: 'One coordinated *decision*.', dt: 2.8, kwAt: 72.8 }] });
  T({ slot: 'T3', deep: true, tin: 74.2, lines: [{ t: 'Aether', role: 'display' }, { t: 'Turning supply chain complexity into intelligent action.', role: 'sub', dt: .6, gap: 24 }] });
  V.sfx(74.2, S.bass, -20);

  V.ready();
})();
