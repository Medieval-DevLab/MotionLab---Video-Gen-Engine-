// Act 4 (81.8 - 152.4 s): the Aether film, the product story MotionLab made. Journey look, inside the A4 container.
// Every scene opens sparse and builds (owner note on the first Aether film: it started at its peak and languished).
(function () {
  const { V, K, L, LE, W, S1, sfx, a4S, a4Deep, a4T, scene, KT, KTswap, kf, box, mframe, sv, photo, samples, ring, badge, at01 } = ML;
  const T = (slot, lines, o) => KT(a4T, slot, lines, o);
  const shipG = (parent) => { const g = sv(parent, 'g', {}); K.ship(g, -212, -70); return g; };

  // ================= s19 · a global supply chain: one ship on a calm sea, then the world around it
  const sc19 = scene(a4S, 81.8, 91.6);
  const gw = K.div(sc19, 'layer'); gw.style.transformOrigin = '0 0';
  const gs = K.svg(gw, 1920, 1080);
  const S = .42, FY = 259, wx = (x) => 960 + (x - 960) / S, wy = (y) => FY + (y - 540) / S;
  const hor = K.path(gs, 'M -3000 800 L 4920 800', { stroke: '#E2DCEA', width: 4 }); V.anim(hor, 'opacity', [[0, 1], [84.0, 0, .8]]);
  const glb = sv(gs, 'path', { d: `M ${wx(-40)} ${wy(1100)} C ${wx(260)} ${wy(560)} ${wx(1660)} ${wy(560)} ${wx(1960)} ${wy(1100)} Z`, fill: '#EEE6F8' }); V.anim(glb, 'opacity', [[0, 0], [83.8, 1, 1.0]]);
  const wake = K.path(gs, 'M 380 796 C 560 790, 680 790, 760 792', { width: 6 }); V.draw(wake, { t0: 82.0, dur: 1.4, ease: V.glide }); V.anim(wake, 'opacity', [[0, 1], [84.4, 0, .6]]);
  const PS = [[230, 980], [560, 812], [960, 742], [1360, 812], [1690, 980]].map(([x, y]) => [wx(x), wy(y)]);
  const RT = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [2, 4], [1, 3]].map(([p, q], i) => { const [x1, y1] = PS[p], [x2, y2] = PS[q], lift = (150 + (i > 3 ? 90 : 0)) / S;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${((x1 + x2) / 2).toFixed(1)} ${(Math.min(y1, y2) - lift).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`; });
  const tGlobal = W('s19', 0, 'global'), tShip = L('s19', 1), tSup = L('s19', 2), tMil = L('s19', 3);
  RT.forEach((d, i) => { const r = K.path(gs, d, { stroke: '#D5CCE3', width: 10, dash: '24 26' }); V.draw(r, { t0: tGlobal + .3 + i * .12, dur: .8, ease: V.glide });
    const fl = K.path(gs, d, { stroke: '#A100FF', width: 9, dash: '18 34' }); V.flow(fl, { t0: tMil, speed: 160 }); V.anim(fl, 'opacity', [[0, 0], [tMil + i * .06, .85, .5]]); });
  PS.forEach(([x, y], i) => { if (i === 2) return; const c = sv(gs, 'circle', { cx: x, cy: y, r: 36, fill: '#fff', stroke: '#A100FF', 'stroke-width': 12 }); V.anim(c, 'opacity', [[0, 0], [tGlobal + .2 + Math.abs(i - 2) * .15, 1, .4]]); });
  const routeS = RT.map((d) => samples(d));
  [[0, .2], [1, .5], [2, .3], [3, .7], [4, .1], [5, .6], [6, .4]].forEach(([k, off], i) => { const g = shipG(gs); V.on((t) => { const [x, y] = routeS[k](((t - tShip) * .07 + off) % 1); g.setAttribute('transform', `translate(${x.toFixed(1)} ${(y - 40).toFixed(1)}) scale(.34)`); g.style.opacity = at01(t, tShip + i * .1, .4).toFixed(3); }); });
  PS.forEach(([x, y], i) => [[-150, 90], [120, 110], [-40, 190]].forEach(([dx, dy], j) => { const q = sv(gs, 'rect', { x: x + dx - 24, y: y + dy - 24, width: 48, height: 48, rx: 10, fill: '#A100FF', opacity: 0 }); V.anim(q, 'opacity', [[0, 0], [tSup + (i * 3 + j) * .05, .6, .3]]); }));
  const hero = shipG(gs); hero.setAttribute('transform', 'translate(960 730)');
  V.camera(gw, [{ t: 0, x: 0, y: 0, s: 1 }, { t: tGlobal - .2, x: 0, y: FY - 540, s: S, d: 2.4 }, { t: tGlobal + 2.2, s: .38, d: 4.6, ease: V.linear }, { t: 90.45, x: PS[1][0] - 960, y: PS[1][1] - 540, s: 1.4, d: .8 }]);
  V.anim(sc19, 'opacity', [[0, 1], [91.0, 0, .35]]);
  [[tGlobal, 'zout'], [tShip, 'tick'], [tSup, 'tick'], [tMil, 'sweepL'], [90.45, 'zin']].forEach(([t, k]) => sfx(t, k));
  T('TL', [{ t: 'Imagine managing a', at: L('s19', 0), mode: 'mask' }, { t: '*global* supply chain.', at: L('s19', 0) + .35, mode: 'mask', kwAt: tGlobal },
    { t: 'Thousands of shipments.', role: 'sub', at: tShip, mode: 'left', gap: 16 }, { t: 'Hundreds of suppliers.', role: 'sub', at: tSup, mode: 'left' }, { t: 'Millions of moving parts.', role: 'sub', at: tMil, mode: 'blur' }], { tout: 90.55, out: 'blur' });

  // ================= s20 · Singapore: a working port; the ship stops; three facilities go red
  const sc20 = scene(a4S, 90.8, 98.9);
  V.anim(sc20, 'opacity', [[0, 0], [90.9, 1, .4]]);
  const port = K.div(sc20, 'layer'); port.style.transformOrigin = '0 1080px';
  const ps = K.svg(port, 1920, 1080);
  sv(ps, 'rect', { x: 0, y: 800, width: 1920, height: 280, fill: '#EDE6F7', opacity: .55 }); sv(ps, 'rect', { x: 1040, y: 840, width: 880, height: 240, fill: '#E3D9F1' });
  const tDel = W('s20', 1, 'delayed');
  [[1180, 360], [1420, 320]].forEach(([x, h], i) => { sv(ps, 'path', { d: `M ${x} 840 L ${x} ${840 - h} M ${x - 190} ${840 - h} L ${x + 70} ${840 - h}`, fill: 'none', stroke: '#5E5868', 'stroke-width': 12, 'stroke-linecap': 'round' });
    const tro = sv(ps, 'g', {}); tro.innerHTML = `<rect x="-22" y="-14" width="44" height="22" rx="4" fill="#1A1323"/><line x1="0" y1="8" x2="0" y2="150" stroke="#5E5868" stroke-width="3"/><rect x="-30" y="150" width="60" height="38" rx="3" fill="${i ? '#D7A8FF' : '#A100FF'}"/>`;
    V.on((t) => { const tt = Math.min(t, tDel); tro.setAttribute('transform', `translate(${(x - 80 + 70 * Math.sin(tt * 1.5 + i * 2)).toFixed(1)} ${840 - h})`); }); });
  [[1560, 4], [1626, 3], [1692, 5], [1758, 2], [1824, 4]].forEach(([x, n], i) => { for (let k = 0; k < n; k++) sv(ps, 'rect', { x, y: 804 - k * 40, width: 60, height: 36, rx: 3, fill: ['#A100FF', '#D7A8FF', '#D5CCE3', '#C48BFF'][(i + k) % 4] }); });
  const ship = shipG(ps), Xd = -460 + 230 * (tDel - 90.9);
  V.on((t) => { const X = t < tDel ? -460 + 230 * (t - 90.9) : Xd + 70 * at01(t, tDel, .6); ship.setAttribute('transform', `translate(${(X + 212).toFixed(1)} 770)`); });
  const dl = K.pill(port, { x: Xd + 150, y: 600, text: 'Delayed', ic: 'clock', kind: 'risk' }); V.vis(dl, { tin: tDel + .1, scaleFrom: .8, rise: 12 });
  const sg = K.pill(port, { x: 140, y: 896, text: 'Singapore', ic: 'map-pin', kind: 'neutral' }); V.vis(sg, { tin: W('s20', 1, 'Singapore'), rise: 12 });
  const tThree = W('s20', 2, 'three'), tRisk = W('s20', 2, 'risk');
  V.on((t) => { port.style.transform = `scale(${V.mix(1, .56, V.travel(V.seg(t, L('s20', 2) - .05, .8))).toFixed(4)})`; });
  const fs = K.svg(sc20, 1920, 1080);
  const FX = [[1180, 590], [1440, 520], [1700, 590]];
  const rte = K.path(fs, 'M 330 880 C 520 760, 760 660, 1060 660 C 1160 660, 1220 680, 1260 690 M 1060 660 C 1260 640, 1420 620, 1520 620 M 1060 660 C 1400 660, 1640 680, 1780 690', { stroke: '#E5484D', width: 6, dash: '14 14' });
  V.draw(rte, { t0: tThree - .2, dur: 1.0, ease: V.glide });
  FX.forEach(([x, y], i) => { const g = sv(fs, 'g', { transform: `translate(${x} ${y}) scale(1.35)` }); K.factory(g, 0, 0); const dot = sv(fs, 'circle', { cx: x + 80, cy: y - 40, r: 20, fill: '#1E9E6A' });
    V.anim(g, 'opacity', [[0, 0], [tThree + i * .3, 1, .4]]); V.anim(dot, 'opacity', [[0, 0], [tThree + i * .3 + .1, 1, .3]]); V.anim(dot, 'fill', [[0, '#1E9E6A'], [tRisk + i * .15, '#E5484D', .3]]);
    const rr = sv(fs, 'circle', { cx: x + 80, cy: y - 40, r: 18, fill: 'none', stroke: '#E5484D', 'stroke-width': 4 }); V.on((t) => { const p = V.seg(t, tRisk + i * .15, .9); rr.setAttribute('r', (18 + 46 * V.glide(p)).toFixed(1)); rr.style.opacity = (p > 0 && p < 1 ? 1 - p : 0).toFixed(3); });
    sfx(tThree + i * .3, 'tick'); });
  sfx(tDel, 'notify'); sfx(tRisk, 'glitch');
  T('TL', [{ t: 'A critical shipment gets', at: L('s20', 1), mode: 'words' }, { t: '*delayed* in Singapore,', at: L('s20', 1) + .45, mode: 'words', kwAt: tDel },
    { t: 'putting three manufacturing facilities at risk.', role: 'sub', at: L('s20', 2), mode: 'left', gap: 16 }], { tout: S1('s20') - .1, out: 'lift' });

  // ================= s21 · Meet Aether: the chapter disc; the wordmark becomes the hub's core
  const ch = ML.win(K.div(a4Deep, 'chapter deep'), 97.8, 103.5); K.ground(ch);
  V.disc(ch, [{ r: 0, cx: 1840, cy: 1160 }, { t: 97.85, r: 2400, d: 1.0 }, { t: 102.6, r: 120, cx: 960, cy: 600, d: .8 }]);
  const meet = T('C', [{ t: 'Meet', role: 'sub', at: L('s21', 0), mode: 'blur', tout: 102.5 }, { t: 'Aether', role: 'display', at: W('s21', 0, 'Aether') - .1, mode: 'letters', gap: 16 },
    { t: 'An AI-powered supply chain intelligence platform.', role: 'sub', at: L('s21', 1), mode: 'words', gap: 16, tout: 102.5 }], { deep: true });
  const awm = meet.lines[1]; awm.style.transformOrigin = '50% 50%';
  V.on((t) => { const b = V.travel(V.seg(t, 102.6, .8)); awm.style.transform = `translate(0px, ${(80 * b).toFixed(1)}px) scale(${V.mix(1, 40 / 168, b).toFixed(4)})`; awm.style.opacity = (1 - V.seg(t, 103.3, .1)).toFixed(3); });
  sfx(97.9, 'whoosh'); sfx(W('s21', 0, 'Aether'), 'bass'); sfx(102.6, 'zout');

  // ================= s22 · one intelligent command center: four sources build around the core, then fold into one view
  const sc22 = scene(a4S, 103.0, 111.6);
  const tE = [W('s22', 0, 'enterprise'), W('s22', 0, 'warehouses'), W('s22', 0, 'logistics'), W('s22', 0, 'forecasts')], tFold = L('s22', 1);
  const wires = K.svg(sc22, 1920, 1080);
  [[200, 330, 'database', 'Enterprise systems', -240, 0], [200, 690, 'warehouse', 'Warehouses', -240, 0], [1280, 330, 'network', 'Logistics networks', 240, 0], [1280, 690, 'trending-up', 'Forecasts', 240, 0]].forEach(([x, y, ic, lab, dx], i) => {
    const c = K.card(sc22, { x, y, w: 440, ic, label: lab }); const cx = 960 - (x + 220), cy = 600 - (y + 48);
    box(c, [{ t: 0, o: 0, tx: dx, s: .9 }, { t: tE[i], o: 1, tx: 0, s: 1, d: .55, e: V.glide }, { t: tFold + .05, tx: cx * .8, ty: cy * .8, s: .4, o: 0, d: .6 }]);
    const x0 = i < 2 ? x + 440 : x, y0 = y + 48, x1 = i < 2 ? 846 : 1074, y1 = i % 2 ? 640 : 560, d = `M ${x0} ${y0} C ${(x0 + x1) / 2} ${y0}, ${(x0 + x1) / 2} ${y1}, ${x1} ${y1}`;
    const p = K.path(wires, d, { stroke: '#D7A8FF', width: 4 }); V.draw(p, { t0: tE[i] + .3, dur: .45, ease: V.glide, tout: tFold, dout: .3 });
    const pt = samples(d); for (let k = 0; k < 3; k++) { const dot = K.div(sc22, '', 'position:absolute;left:0;top:0;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#A100FF;');
      V.on((t) => { const [qx, qy] = pt((((t - tE[i] - .7) * .8 + k / 3) % 1 + 1) % 1); dot.style.transform = `translate(${qx.toFixed(1)}px, ${qy.toFixed(1)}px)`; dot.style.opacity = (V.seg(t, tE[i] + .7, .3) * (1 - V.seg(t, tFold, .3))).toFixed(3); }); }
    sfx(tE[i], 'click');
  });
  const core = K.core(sc22, { cx: 960, cy: 600, r: 120, label: 'Aether' });
  box(core, [{ t: 0, x: 840, y: 480, w: 240, h: 240, o: 0 }, { t: 103.28, o: 1, d: .05 }, { t: tFold + .45, x: 1346, y: 786, w: 140, h: 140, d: .7 }, { t: 111.0, o: 0, d: .35, e: V.glide }]);
  V.on((t) => { core.style.fontSize = V.mix(40, 26, V.travel(V.seg(t, tFold + .45, .7))).toFixed(1) + 'px'; });
  const cc = K.div(sc22, 'card', 'position:absolute;left:200px;top:360px;width:1520px;height:624px;'); V.vis(cc, { tin: tFold + .4, tout: 111.0, scaleFrom: .96, rise: 20 });
  const map = K.div(cc, '', 'position:absolute;left:32px;top:32px;width:880px;height:560px;border-radius:14px;background:#F7F5FA;overflow:hidden;'), ms = K.svg(map, 880, 560);
  const mr = K.path(ms, 'M 110 420 C 320 300, 520 360, 790 230', { width: 6 }); V.draw(mr, { t0: tFold + .7, dur: .8, ease: V.glide });
  sv(ms, 'circle', { cx: 110, cy: 420, r: 18, fill: '#fff', stroke: '#A100FF', 'stroke-width': 5 }); [[600, 300], [700, 262], [790, 230]].forEach(([x, y]) => { const g = sv(ms, 'g', { transform: `translate(${x} ${y - 30}) scale(.55)` }); K.factory(g, -59, -56); });
  const inv = K.div(cc, '', 'position:absolute;left:944px;top:32px;width:544px;height:270px;border-radius:14px;box-shadow:inset 0 0 0 2px var(--line);');
  [0, 1, 2].forEach((i) => { const b = K.div(inv, '', `position:absolute;left:32px;top:${48 + i * 70}px;width:${[440, 380, 300][i]}px;height:22px;border-radius:11px;background:#1E9E6A;transform-origin:0 50%;`); V.on((t) => { b.style.transform = `scaleX(${at01(t, tFold + .9 + i * .1, .5).toFixed(3)})`; }); });
  V.vis(inv, { tin: tFold + .6, x: 30, rise: 0 });
  T('TC', [{ t: 'One intelligent *command center*.', at: tFold, mode: 'words', kwAt: W('s22', 1, 'command') }], { tout: 111.0, out: 'mask' });
  sfx(tFold + .4, 'swoosh'); sfx(tFold + .9, 'snap');

  // ================= s23 · disruption strikes: analyse inventory, find the risks, simulate three routes
  const MS = (parent, x, y, w, h) => { const f = K.div(parent, 'card', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;`), s = K.svg(f, w, h); return { f, s }; };
  const sc23 = scene(a4S, 111.0, 120.0);
  const { f: m23, s: s23 } = MS(sc23, 120, 480, 1680, 504); V.vis(m23, { tin: 111.05, tout: 119.25, rise: 0, din: .4, dout: .3 });
  const P0x = 210, P0y = 300, FAC = [[1290, 150], [1450, 330], [1600, 170]];
  const base = K.path(s23, `M ${P0x} ${P0y} C 600 300, 900 250, 1430 320`, { width: 7 });
  const tStrike = W('s23', 0, 'strike'), tInv = W('s23', 1, 'analyzes'), tRisk2 = L('s23', 2), tAlt = L('s23', 3);
  V.anim(base, 'stroke', [[0, '#A100FF'], [tStrike, '#E5484D', .3]]); base.setAttribute('stroke-dasharray', '1 0'); V.on((t) => base.setAttribute('stroke-dasharray', t >= tStrike ? '14 14' : '1 0'));
  const sh23 = shipG(s23); sh23.setAttribute('transform', `translate(${P0x} ${P0y - 40}) scale(.5)`);
  [0, .35].forEach((d) => ring(m23, P0x, P0y - 40, tStrike + d, { c: 'var(--risk)', r0: 30, r1: 120, d: .9 }));
  K.pill(m23, { x: 120, y: 24, text: 'Singapore', ic: 'map-pin', kind: 'neutral' });
  FAC.forEach(([x, y], i) => { const g = sv(s23, 'g', {}); K.factory(g, x - 59, y - 56);
    const tr = K.div(m23, '', `position:absolute;left:${x - 60}px;top:${y + 76}px;width:120px;height:14px;border-radius:7px;background:#E2DCEA;overflow:hidden;`), fl = K.div(tr, '', 'position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:7px;background:#1E9E6A;');
    V.on((t) => { const k = at01(t, tInv + .4 + i * .15, .5); fl.style.width = V.mix(100, 22, k).toFixed(1) + '%'; fl.style.background = k > .5 ? '#E5484D' : '#1E9E6A'; });
    const scn = K.div(tr, '', 'position:absolute;top:0;bottom:0;width:30px;background:linear-gradient(90deg,transparent,#fff,transparent);'); V.on((t) => { const p = V.seg(t, tInv, .5); scn.style.left = (-30 + 150 * p).toFixed(1) + 'px'; scn.style.opacity = p > 0 && p < 1 ? 1 : 0; });
    const al = K.div(m23, '', `position:absolute;left:${x + 26}px;top:${y - 106}px;color:var(--risk);`, K.icon('triangle-alert', 44)); V.vis(al, { tin: tRisk2 + .1 + i * .2, scaleFrom: .4, rise: 0 }); sfx(tRisk2 + .1 + i * .2, 'tick'); });
  [[-150, .0], [0, .45], [150, .9]].forEach(([dy, d], i) => { const pth = `M ${P0x} ${P0y} C 600 ${P0y + dy}, 1000 ${330 + dy * .7}, 1430 330`; const a2 = K.path(s23, pth, { stroke: '#C48BFF', width: 6, dash: '14 12' }); V.draw(a2, { t0: tAlt + .1 + d, dur: .6, ease: V.glide });
    const pt = samples(pth), dot = K.div(m23, '', 'position:absolute;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#A100FF;'); V.on((t) => { const [x, y] = pt(((t - tAlt - .7 - d) * .6 % 1 + 1) % 1); dot.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; dot.style.opacity = V.seg(t, tAlt + .7 + d, .2).toFixed(3); });
    sfx(tAlt + .1 + d, 'swish'); });
  sfx(tStrike, 'notify'); sfx(tInv, 'scan');
  T('TL', [{ t: 'When disruptions *strike*,', at: L('s23', 0), mode: 'drop', kwAt: tStrike }, { t: 'Aether instantly analyzes inventory,', role: 'sub', at: L('s23', 1), mode: 'left', gap: 16 },
    { t: 'identifies production risks,', role: 'sub', at: tRisk2, mode: 'left' }, { t: 'and simulates alternative routes.', role: 'sub', at: tAlt, mode: 'left' }], { tout: 119.15, out: 'lift' });

  // ================= s24 · the best recovery strategy: three routes compared on costs, capacity and delivery
  const sc24 = scene(a4S, 119.1, 127.0);
  const { f: m24, s: s24 } = MS(sc24, 120, 360, 1060, 624); V.vis(m24, { tin: 119.2, tout: 126.5, rise: 0, din: .4 });
  const RS = [[-170, '#D5CCE3'], [0, '#A100FF'], [170, '#D5CCE3']], tPick = LE('s24', 1) - .35;
  shipG(s24).setAttribute('transform', 'translate(130 300) scale(.42)');
  const fac24 = sv(s24, 'g', {}); K.factory(fac24, 0, 0); fac24.setAttribute('transform', 'translate(880 250) scale(.9)');
  RS.forEach(([dy, c], i) => { const d = `M 150 320 C 400 ${320 + dy}, 700 ${320 + dy * .8}, 900 320`; const p = K.path(s24, d, { stroke: '#C48BFF', width: 6, dash: '14 12' });
    V.on((t) => { const w = i === 1 ? at01(t, tPick, .5) : 0; p.setAttribute('stroke-width', (6 + 8 * w).toFixed(1)); p.setAttribute('stroke', w > .5 ? '#A100FF' : '#C48BFF'); p.setAttribute('stroke-dasharray', w > .5 ? '1 0' : '14 12'); p.style.opacity = i === 1 ? 1 : (1 - .7 * at01(t, tPick, .5)).toFixed(3); }); });
  const rec = K.pill(m24, { x: 380, y: 196, text: 'Recommended', ic: 'check', kind: 'accent' }); V.vis(rec, { tin: tPick + .3, scaleFrom: .7, rise: 0 });
  const cmp = K.div(sc24, 'card', 'position:absolute;left:1220px;top:360px;width:580px;height:624px;'); V.vis(cmp, { tin: L('s24', 0) + .6, tout: 126.5, x: 60, rise: 0 });
  const CR = [['Costs', W('s24', 1, 'costs')], ['Capacity', W('s24', 1, 'capacity')], ['Delivery commitments', W('s24', 1, 'delivery')]];
  CR.forEach(([lab, t0], r) => { const l = K.div(cmp, 't-label', `position:absolute;left:36px;top:${40 + r * 190}px;font-weight:600;color:#1A1323;`, lab); V.vis(l, { tin: t0 - .1, x: -20, rise: 0 });
    [0, 1, 2].forEach((k) => { const b = K.div(cmp, '', `position:absolute;left:36px;top:${96 + r * 190 + k * 34}px;height:22px;border-radius:11px;width:${[[300, 470, 250], [380, 450, 280], [260, 480, 330]][r][k]}px;background:${k === 1 ? '#A100FF' : '#D5CCE3'};transform-origin:0 50%;`);
      V.on((t) => { b.style.transform = `scaleX(${at01(t, t0 + k * .08, .5).toFixed(3)})`; }); }); sfx(t0, 'tick'); });
  sfx(tPick + .3, 'confirm');
  T('TR', [{ t: 'Its AI engine recommends', at: L('s24', 0), mode: 'right' }, { t: 'the best recovery *strategy*…', at: L('s24', 0) + .5, mode: 'right', kwAt: W('s24', 0, 'strategy') }], { tout: 126.35, out: 'right' });

  // ================= s25 · a planner approves (a person, a photo panel)
  const sc25 = scene(a4S, 126.3, 129.6);
  const ph = photo(sc25, 'laptop-work-ed1c4fde.jpg', 972, 96, 828, 888); box(ph.el, [{ t: 0, tx: 200, o: 0 }, { t: 126.45, tx: 0, o: 1, d: .6, e: V.glide }, { t: 128.85, tx: 240, o: 0, d: .45 }]);
  V.on((t) => { ph.img.style.transform = `scale(${V.mix(1, 1.06, V.seg(t, 126.4, 3)).toFixed(4)})`; });
  const ap = K.div(sc25, 'card', 'position:absolute;left:1012px;top:700px;width:460px;height:220px;');
  ap.innerHTML = `<div style="position:absolute;left:28px;top:28px;display:flex;align-items:center;gap:16px"><div class="badge">${K.icon('route')}</div><div class="t-label" style="font-weight:600">Recommendation</div></div>`;
  const btn = K.div(ap, '', 'position:absolute;left:28px;top:128px;height:60px;padding:0 26px;border-radius:30px;display:flex;align-items:center;gap:10px;font-size:28px;font-weight:600;');
  const tApp = W('s25', 0, 'approves') + .35;
  let bOn = null; V.on((t) => { const on = t >= tApp; if (on === bOn) return; bOn = on; btn.style.background = on ? '#A100FF' : '#fff'; btn.style.color = on ? '#fff' : '#A100FF'; btn.style.boxShadow = on ? 'none' : 'inset 0 0 0 3px #A100FF'; btn.innerHTML = on ? `${K.icon('check', 30)}Approved` : 'Approve'; });
  box(ap, [{ t: 0, tx: -500, o: 0 }, { t: 126.55, tx: 0, o: 1, d: .6, e: V.glide }, { t: 128.85, x: 860, y: 540, w: 320, h: 96, d: .5 }, { t: 129.1, o: 0, d: .3 }]);
  [btn, ap.firstChild].forEach((e) => V.anim(e, 'opacity', [[0, 1], [128.75, 0, .2]])); // its contents clear before it becomes the booking card
  ring(sc25, 1150, 858, tApp, { r0: 30, r1: 110, d: .7 }); sfx(tApp, 'confirm');
  T('ML', [{ t: 'A planner *approves*', at: L('s25'), mode: 'left', kwAt: W('s25', 0, 'approves') }, { t: 'the recommendation.', at: L('s25') + .45, mode: 'left' }], { tout: 128.8, out: 'left' });

  // ================= s26-s27 · the carrier rejects; Aether finds another, reroutes, syncs every system
  const sc26 = scene(a4S, 128.8, 140.5);
  const rs = K.svg(sc26, 1920, 1080);
  const c1 = K.core(sc26, { cx: 360, cy: 640, r: 90, label: 'Aether' }); V.vis(c1, { tin: 129.15, scaleFrom: .8, rise: 0 }); c1.style.fontSize = '30px';
  const l1 = K.path(rs, 'M 470 640 L 1440 640', { width: 6 }); V.draw(l1, { t0: 129.2, dur: .5, ease: V.glide });
  const tRej = W('s26', 1, 'rejects');
  V.anim(l1, 'opacity', [[0, 1], [tRej + .1, 0, .3]]);
  const l1r = K.path(rs, 'M 470 640 L 1100 640', { stroke: '#E5484D', width: 6, dash: '14 12' }); V.anim(l1r, 'opacity', [[0, 0], [tRej + .1, 1, .3], [L('s26', 2), .35, .5]]);
  const car1 = K.div(sc26, 'station', 'left:1500px;top:640px;', K.icon('truck')); V.vis(car1, { tin: 129.1, scaleFrom: .6, rise: 0 }); V.anim(car1, 'color', [[0, '#A100FF'], [tRej + .05, '#E5484D', .25], [L('s27', 0) + 1.2, '#D5CCE3', .5]]);
  const bk = K.div(sc26, 'card', 'position:absolute;left:0;top:0;width:300px;height:84px;display:flex;align-items:center;gap:14px;padding:0 22px;', `<div class="badge">${K.icon('package')}</div><div class="t-label" style="font-weight:600">Booking</div>`);
  box(bk, [{ t: 0, x: 860, y: 530, o: 0 }, { t: 129.05, o: 1, d: .2, e: V.glide }, { t: 129.3, x: 1120, y: 520, d: 1.2 }, { t: tRej + .05, x: 1040, d: .35 }, { t: L('s27', 0), o: 0, d: .3 }]);
  const xr = K.div(sc26, '', 'position:absolute;left:1468px;top:500px;width:64px;height:64px;border-radius:50%;background:var(--risk);color:#fff;display:flex;align-items:center;justify-content:center;', K.icon('x', 36)); V.vis(xr, { tin: tRej + .05, tout: L('s27', 0) + .8, scaleFrom: .3, rise: 0 });
  const rj = K.pill(sc26, { x: 1400, y: 720, text: 'Rejected', ic: 'circle-x', kind: 'risk' }); V.vis(rj, { tin: tRej + .2, tout: L('s27', 0) + .8, rise: 10 });
  [0, .3].forEach((d) => ring(sc26, 360, 640, L('s26', 2) + d, { r0: 100, r1: 220, d: 1.0 }));
  sfx(129.3, 'swish'); sfx(tRej, 'glitch'); sfx(L('s26', 2), 'aura');
  T('TC', [{ t: 'But wait…', at: L('s26', 0), mode: 'blur' }], { tout: L('s26', 1) - .1, out: 'blur' });
  T('TC', [{ t: 'The carrier *rejects* the booking.', at: L('s26', 1), mode: 'wordsAlt', kwAt: tRej }], { tout: L('s26', 2) - .15, out: 'drop' });
  T('TC', [{ t: 'No problem.', at: L('s26', 2), mode: 'pop' }], { tout: 133.0, out: 'lift' });
  // s27
  const tAltC = W('s27', 0, 'alternative'), tRe = L('s27', 1), tSync = W('s27', 2, 'synchronizes');
  [0, .3, .6].forEach((d) => ring(sc26, 1500, 880, L('s27', 0) + .2 + d, { r0: 40, r1: 160, d: .9 }));
  const car2 = K.div(sc26, 'station', 'left:1500px;top:880px;', K.icon('truck')); V.vis(car2, { tin: tAltC - .1, scaleFrom: .5, rise: 0 }); V.anim(car2, 'color', [[0, '#A100FF'], [tRe + .4, '#1E9E6A', .3]]);
  const nr = 'M 445 690 C 800 900, 1100 900, 1440 880', l2 = K.path(rs, nr, { width: 7 }); V.draw(l2, { t0: tAltC + .2, dur: .7, ease: V.glide });
  const bkd = K.pill(sc26, { x: 1560, y: 852, text: 'Booked', ic: 'check', kind: 'ok' }); V.vis(bkd, { tin: tRe + .3, scaleFrom: .7, rise: 0 });
  const nrS = samples(nr), sh27 = shipG(rs); V.on((t) => { const [x, y] = nrS(V.travel(V.seg(t, tRe + .1, 2.6))); sh27.setAttribute('transform', `translate(${x.toFixed(1)} ${(y - 26).toFixed(1)}) scale(.36)`); sh27.style.opacity = (V.seg(t, tRe, .3) * (1 - V.seg(t, 139.9, .3))).toFixed(3); });
  [['database', 150, 860], ['warehouse', 290, 930], ['network', 440, 940], ['trending-up', 590, 900]].forEach(([ic, x, y], i) => {
    const st = K.div(sc26, 'station', `left:${x}px;top:${y}px;`, K.icon(ic)); V.vis(st, { tin: tSync - .3 + i * .05, scaleFrom: .5, rise: 0 }); V.anim(st, 'color', [[0, '#A100FF'], [tSync + .45 + i * .15, '#1E9E6A', .3]]);
    const dot = K.div(sc26, '', 'position:absolute;left:0;top:0;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#A100FF;');
    V.on((t) => { const k = V.travel(V.seg(t, tSync + i * .15, .45)); dot.style.transform = `translate(${V.mix(360, x, k).toFixed(1)}px, ${V.mix(640, y, k).toFixed(1)}px)`; dot.style.opacity = (k > 0 && k < 1 ? 1 : 0); });
    sfx(tSync + .45 + i * .15, 'tick');
  });
  sfx(tAltC, 'notify'); sfx(tRe + .3, 'confirm'); sfx(tSync, 'shimmer');
  V.anim(sc26, 'opacity', [[0, 1], [140.0, 0, .4]]);
  T('TL', [{ t: 'Aether automatically finds', at: L('s27', 0), mode: 'mask' }, { t: 'an *alternative*,', at: L('s27', 0) + .4, mode: 'mask', kwAt: tAltC },
    { t: 'reroutes the shipment,', role: 'sub', at: tRe, mode: 'left', gap: 16 }, { t: 'and synchronizes updates across connected systems.', role: 'sub', at: L('s27', 2), mode: 'blur' }], { tout: 139.95, out: 'mask' });

  // ================= s28 · real-time dashboards: costs, deliveries, operational risks (a slow 3D drift)
  const sc28 = scene(a4S, 140.0, 146.4);
  const pers = K.div(sc28, 'fill', 'perspective:2400px;'), dash = K.div(pers, 'card', 'position:absolute;left:120px;top:264px;width:1680px;height:720px;transform-origin:50% 50%;');
  V.vis(dash, { tin: L('s28', 0) - .05, tout: 145.9, rise: 40, din: .7 });
  V.on((t) => { const u = V.seg(t, 140.6, 5.4); dash.style.transform = `rotateX(${V.mix(9, 3, u).toFixed(2)}deg) rotateY(${V.mix(-7, 6, u).toFixed(2)}deg) translateY(${((1 - at01(t, L('s28', 0) - .05, .7)) * 40).toFixed(1)}px)`; });
  const tCo = W('s28', 1, 'costs'), tDe = L('s28', 2), tOp = W('s28', 2, 'operational');
  [['Costs', 32, tCo], ['Deliveries', 584, tDe], ['Operational risks', 1136, tOp]].forEach(([lab, x, t0]) => { const wbx = K.div(dash, 'wbox', `left:${x}px;top:32px;width:512px;height:656px;background:#F7F5FA;`); const tt = K.div(wbx, 'wtitle', '', lab); V.vis(tt, { tin: t0 - .1, x: -20, rise: 0 }); sfx(t0, 'tick'); });
  const cS = K.svg(dash, 1680, 720);
  const cl = K.path(cS, 'M 80 560 L 190 470 L 300 510 L 420 330 L 520 290', { width: 9 }); V.draw(cl, { t0: tCo + .1, dur: .9, ease: V.glide });
  const da = K.div(dash, '', 'position:absolute;left:632px;top:300px;width:416px;height:20px;border-radius:10px;background:#E2DCEA;overflow:hidden;'), daf = K.div(da, '', 'position:absolute;left:0;top:0;bottom:0;border-radius:10px;background:#1E9E6A;');
  V.on((t) => { daf.style.width = (76 * at01(t, tDe + .1, 1.0)).toFixed(1) + '%'; });
  [0, 1, 2, 3, 4].forEach((i) => { const c = K.div(dash, '', `position:absolute;left:${640 + i * 82}px;top:380px;color:#1E9E6A;`, K.icon('circle-check', 52)); V.vis(c, { tin: tDe + .2 + i * .12, scaleFrom: .4, rise: 0 }); });
  sv(cS, 'path', { d: 'M 1232 560 A 160 160 0 0 1 1552 560', fill: 'none', stroke: '#E2DCEA', 'stroke-width': 34 });
  const gArc = sv(cS, 'path', { d: 'M 1232 560 A 160 160 0 0 1 1552 560', fill: 'none', stroke: '#E5484D', 'stroke-width': 34 }); V.draw(gArc, { t0: tOp + .1, dur: 1.0, ease: V.glide });
  V.anim(gArc, 'stroke', [[0, '#E5484D'], [tOp + .5, '#F5A524', .3], [tOp + .9, '#1E9E6A', .3]]);
  T('TC', [{ t: 'Real-time *dashboards* track', at: L('s28', 1), mode: 'letters', kwAt: W('s28', 1, 'dashboards') }], { tout: 145.8, out: 'mask' });

  // ================= s29-s30 · from disruption to resolution (the whole journey line); Aether's end card
  const sc29 = scene(a4S, 145.8, 160.0);
  const lw = K.div(sc29, 'layer'); lw.style.transformOrigin = '0 0'; const ls = K.svg(lw, 1920, 1080);
  const L0 = K.path(ls, 'M 160 800 L 1760 800', { stroke: '#D5CCE3', width: 8 }); V.draw(L0, { t0: 145.85, dur: .3 });
  const glowL = K.path(ls, 'M 160 800 L 1760 800', { stroke: '#A100FF', width: 10 }); V.draw(glowL, { t0: 146.3, dur: 1.6, ease: V.travel });
  sv(ls, 'circle', { cx: 160, cy: 800, r: 24, fill: '#E5484D' }); const endD = sv(ls, 'circle', { cx: 1760, cy: 800, r: 26, fill: '#1E9E6A' }); V.anim(endD, 'opacity', [[0, .3], [147.8, 1, .3]]);
  [['ship', 400], ['network', 640], ['split', 880], ['user-check', 1120], ['truck', 1360], ['trending-up', 1560]].forEach(([ic, x]) => { const st = K.div(lw, 'station', `left:${x}px;top:800px;`, K.icon(ic)); const tp = 146.3 + 1.6 * (x - 160) / 1600; V.vis(st, { tin: tp - .15, scaleFrom: .5, rise: 0 }); });
  V.camera(lw, [{ t: 0, x: -545, y: 142, s: 2.2 }, { t: 146.3, x: 0, y: 0, s: 1, d: 1.6 }, { t: 148.4, x: 800, y: 0, d: .7 }]);
  sfx(146.3, 'sweepL'); sfx(148.66, 'bass');
  T('C', [{ t: 'From *disruption*…', role: 'state', at: L('s29', 0), mode: 'wordsPop', kc: '#E5484D' }], { tout: L('s29', 1) - .1, out: 'blur', y: 470 });
  T('C', [{ t: 'to *resolution*.', role: 'state', at: L('s29', 1), mode: 'wordsPop', kc: '#1E9E6A' }], { tout: 148.3, out: 'blur', y: 470 });
  T('C', [{ t: 'Aether', role: 'display', at: L('s30', 0) - .05, mode: 'letters' }, { t: 'Turning complexity into intelligent action.', role: 'sub', at: L('s30', 1), mode: 'words', gap: 24 }], { y: 500 });
})();
