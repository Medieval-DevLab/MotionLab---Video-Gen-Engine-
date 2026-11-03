// MotionLab acts 1-3 (0 - 82.3 s): the problem, the turn, MotionLab. Plan: storyboard/segments.js + the owner's tuning
// (FILM.md §6): people first; clear concepts; a camera-focus for attention; varied text placement and entrances.
(function () {
  const { V, K, L, W, S1, sfx, amS, amDeep, amT, scene, KT, KTswap, kf, box, mframe, sv, photo, strip, samples, ring, badge, spec, at01 } = ML;
  const R = K.rand(4242);
  const PH = (f) => '../../library/photos/' + f;
  const tile = (parent, file, x, y, w, h, cls = '') => { const e = K.div(parent, 'tile ' + cls, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`); const im = document.createElement('img'); im.src = PH(file); e.appendChild(im); ML.ASSETS.push(PH(file)); return e; };
  const PEOPLE = ['lab-engineer-bd39a82e.jpg', 'team-discussion-84004c3d.jpg', 'whiteboard-624bd043.jpg', 'welder-cbe6832c.jpg', 'presenting-1069c7e6.jpg', 'portrait-woman-1a857d9d.jpg',
    'desk-work-c99fd139.jpg', 'team-meeting-053e5e97.jpg', 'handshake-125521f4.jpg', 'portrait-man-bc14816f.jpg'];

  // ================= s01 · Accenture's reinventors: people at work arrive from every side, then become thousands
  const s1 = scene(amS, 0, 16.0);
  const mos = K.div(s1, 'fill'); mos.style.transformOrigin = '960px 520px';
  const tThou = W('s01', 1, 'thousands'), tBuild = W('s01', 1, 'building');
  // the mosaic: many small tiles of people, filling the frame around a clear centre (the "thousands")
  const cells = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 15; c++) {
    const x = 24 + c * 128, y = 12 + r * 120, cx = x + 56, cy = y + 52, e = ((cx - 960) / 700) ** 2 + ((cy - 520) / 250) ** 2;
    if (e < 1) continue; cells.push({ x, y, d: Math.hypot(cx - 960, cy - 520), f: PEOPLE[(r * 7 + c * 3) % PEOPLE.length] });
  }
  const dmax = Math.max(...cells.map((c) => c.d));
  cells.forEach((c, i) => {
    const el = tile(mos, c.f, c.x, c.y, 112, 104, 'tint'), gl = K.div(el, 'glow'), ta = tThou + .15 + (c.d / dmax) * 1.5;
    box(el, [{ t: 0, o: 0, s: .6 }, { t: ta, o: .9, s: 1, d: .5, e: V.glide }]);
    const tg = tBuild + R() * 1.8; V.on((t) => { const p = V.seg(t, tg, .7); gl.style.opacity = (Math.sin(Math.PI * p) * .95).toFixed(3); });
  });
  // six people, each doing something, arriving from a different side
  const big = [['lab-engineer-bd39a82e.jpg', 100, 64, 480, 286, -700, 0, -6], ['team-discussion-84004c3d.jpg', 720, 40, 480, 250, 0, -420, 0], ['whiteboard-624bd043.jpg', 1340, 64, 480, 286, 700, 0, 6],
    ['welder-cbe6832c.jpg', 100, 716, 480, 296, -700, 200, 5], ['presenting-1069c7e6.jpg', 720, 770, 480, 270, 0, 420, 0], ['portrait-woman-1a857d9d.jpg', 1340, 716, 480, 296, 700, 200, -5]];
  big.forEach(([f, x, y, w, h, dx, dy, rot], i) => {
    const el = tile(s1, f, x, y, w, h); el.style.boxShadow = '0 18px 40px rgba(42,8,70,.16)';
    const ti = .1 + i * .16, cx = 960 - (x + w / 2), cy = 520 - (y + h / 2);
    box(el, [{ t: 0, o: 0, tx: dx, ty: dy, rot, s: 1 }, { t: ti, o: 1, tx: 0, ty: 0, rot: 0, d: .8, e: V.glide },
      { t: tThou, tx: cx * .18, ty: cy * .18, s: .42, o: 0, d: 1.0 }]);
    if (i % 2 === 0) sfx(ti + .1, 'swish');
  });
  V.on((t) => { mos.style.transform = `scale(${(1 + .05 * V.seg(t, tThou, 4.0)).toFixed(4)})`; mos.style.opacity = ((1 - .78 * at01(t, 5.05, .7)) * (1 - at01(t, 9.9, .6))).toFixed(3); mos.style.filter = t > 5.05 ? `blur(${(6 * at01(t, 5.05, .7)).toFixed(2)}px)` : 'none'; });
  KT(amT, 'C', [{ t: 'At Accenture,', role: 'state', at: .05, mode: 'letters' },
    { t: 'thousands of *reinventors*', at: L('s01', 1), mode: 'words', gap: 16, kwAt: W('s01', 1, 'reinventors') },
    { t: "constantly building what's next.", role: 'sub', at: W('s01', 1, 'constantly'), mode: 'blur', gap: 16 }], { tout: S1('s01') - .15, out: 'blur' });
  sfx(tThou + .1, 'aura');

  // ================= s02 · three people, three clear things they make: a solution, a capability, a new way
  const FT = [L('s02', 0), W('s02', 0, 'New capabilities'), L('s02', 1)];
  const CARD = [[120, 'team-discussion-84004c3d.jpg', -520, 0, -5], [700, 'lab-engineer-bd39a82e.jpg', 0, 520, 0], [1280, 'whiteboard-624bd043.jpg', 520, 0, 5]];
  const ROW = [[120, 'presenting-1069c7e6.jpg'], [465], [810], [1155], [1500, 'desk-work-c99fd139.jpg']]; // s03: five innovations in a row
  const cardsEl = CARD.map(([x, f, dx, dy, rot], i) => {
    const el = tile(s1, f, x, 330, 520, 560); el.style.boxShadow = '0 18px 44px rgba(42,8,70,.16)';
    const rx = ROW[i + 1][0], tf = FT[i] - .2;
    box(el, [{ t: 0, x, y: 330, w: 520, h: 560, o: 0, tx: dx, ty: dy, rot }, { t: tf, o: 1, tx: 0, ty: 0, rot: 0, d: .75, e: V.glide },
      { t: 10.1, x: rx, y: 330, w: 300, h: 400, d: .75 }]);
    sfx(tf + .1, 'swoosh');
    return el;
  });
  // the solution: an app window assembles over the team's screen
  const ov = (i) => { const o = K.div(cardsEl[i], 'fill'); V.anim(o, 'opacity', [[0, 1], [10.1, 0, .3]]); return o; };
  const o0 = ov(0), app = K.div(o0, 'card', 'position:absolute;left:206px;top:36px;width:280px;height:200px;overflow:hidden;');
  app.innerHTML = `<div style="height:40px;background:var(--purple)"></div><div style="position:absolute;left:20px;top:58px;width:150px;height:14px;border-radius:7px;background:#1A1323"></div><div style="position:absolute;left:20px;top:84px;width:100px;height:10px;border-radius:5px;background:#D5CCE3"></div>`;
  [.5, .75, .95].forEach((v, i) => { const b = K.div(app, '', `position:absolute;left:${24 + i * 46}px;bottom:20px;width:30px;height:${70 * v}px;border-radius:6px;background:${i === 2 ? 'var(--purple)' : '#D7A8FF'};transform-origin:50% 100%;`); V.on((t) => { b.style.transform = `scaleY(${at01(t, FT[0] + .7 + i * .12, .45).toFixed(3)})`; }); });
  const chk = K.div(app, '', 'position:absolute;right:18px;bottom:18px;width:52px;height:52px;border-radius:50%;background:var(--ok);color:#fff;display:flex;align-items:center;justify-content:center;', K.icon('check', 30));
  V.vis(app, { tin: FT[0] + .4, scaleFrom: .6, rise: 0 }); V.vis(chk, { tin: FT[0] + 1.1, scaleFrom: .4, rise: 0 }); sfx(FT[0] + .45, 'pop'); sfx(FT[0] + 1.1, 'confirm');
  // capabilities: four abilities light up around the engineer, joined by one arc
  const o1 = ov(1), arcS = K.svg(o1, 520, 560); const arcP = K.path(arcS, 'M 80 150 C 160 40, 360 40, 440 150', { stroke: '#fff', width: 4, dash: '10 10', opacity: .9 });
  V.draw(arcP, { t0: FT[1] + .25, dur: .7, ease: V.glide });
  [['cpu', 80, 150], ['cloud', 196, 76], ['bot', 324, 76], ['shield-check', 440, 150]].forEach(([ic, x, y], i) => { const b = badge(o1, ic, x, y, 84, { round: true }); V.vis(b, { tin: FT[1] + .35 + i * .17, scaleFrom: .3, rise: 0 }); sfx(FT[1] + .35 + i * .17, 'tick'); });
  // a new way of solving problems: a tangle on the whiteboard straightens into one clear path
  const o2 = ov(2), pan = K.div(o2, 'card', 'position:absolute;left:36px;top:300px;width:448px;height:220px;background:rgba(255,255,255,.92);'), pS = K.svg(pan, 448, 220);
  const N = 64, tangle = samples('M 40 150 C 90 20, 150 210, 190 90 C 230 -10, 120 60, 200 150 C 270 220, 300 30, 250 70 C 200 110, 330 190, 360 110 C 380 60, 410 120, 408 110'), straight = (u) => [40 + 368 * u, 110];
  const sp = K.sv(pS, 'path', { fill: 'none', stroke: '#A100FF', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  const head = K.sv(pS, 'path', { d: 'M 386 92 L 412 110 L 386 128', fill: 'none', stroke: '#A100FF', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  V.on((t) => { const dr = at01(t, FT[2] + .3, .7), m = V.travel(V.seg(t, FT[2] + 1.15, .8)), n = Math.max(2, Math.round(N * dr)); let d = '';
    for (let i = 0; i < n; i++) { const u = i / (N - 1), [ax, ay] = tangle(u), [bx, by] = straight(u); d += (i ? 'L' : 'M') + V.mix(ax, bx, m).toFixed(1) + ' ' + V.mix(ay, by, m).toFixed(1) + ' '; }
    sp.setAttribute('d', d); head.style.opacity = V.seg(t, FT[2] + 1.75, .2).toFixed(3); });
  V.vis(pan, { tin: FT[2] + .2, rise: 16 }); sfx(FT[2] + 1.15, 'swish'); sfx(FT[2] + 1.8, 'snap');
  KTswap(amT, { x: 120, y: 120, w: 1680 }, { prefix: 'New', items: [{ t: '*solutions*.', at: FT[0] }, { t: '*capabilities*.', at: FT[1] }, { t: '*ways of solving problems*.', at: FT[2] }], tout: S1('s02') - .2 });

  // ================= s03 · attention: the camera focuses on one innovation; the rest, ours included, blur and fade
  const extra = [0, 4].map((k) => { const [x, f] = ROW[k]; const el = tile(s1, f, x, 330, 300, 400); el.style.boxShadow = '0 18px 44px rgba(42,8,70,.16)'; box(el, [{ t: 0, o: 0, tx: k ? 400 : -400 }, { t: 10.2, o: 1, tx: 0, d: .7, e: V.glide }]); return el; });
  const rowEls = [extra[0], cardsEl[0], cardsEl[1], cardsEl[2], extra[1]];
  const tLock = 13.3;
  rowEls.forEach((el, i) => {
    const d = Math.abs(i), st = tLock - .1 + d * .22; // focus falls off with distance from the chosen card (index 0)
    V.on((t) => { if (t < 10) return; const k = i === 0 ? 0 : at01(t, st, .9), z = i === 0 ? at01(t, tLock, .5) : 0;
      el.style.filter = k > .01 ? `blur(${(9 * k).toFixed(2)}px) saturate(${(1 - .5 * k).toFixed(2)})` : 'none'; el.style.opacity = ((+el.style.opacity || 0) * (1 - .7 * k) * (1 - V.seg(t, 15.3, .5))).toFixed(3);
      if (i === 0 && t >= tLock) el.style.transform = `scale(${(1 + .07 * z).toFixed(4)})`; });
  });
  const vf = K.div(s1, 'vf', ''); vf.innerHTML = '<i></i><i></i><i></i><i></i><b></b><u></u>';
  box(vf, [{ t: 0, x: 1125, y: 300, w: 360, h: 460, o: 0 }, { t: 10.7, o: 1, d: .3, e: V.glide }, { t: 11.3, x: 1110, w: 390, d: .5 }, { t: 11.9, x: 1135, w: 340, d: .4 },
    { t: 12.45, x: 90, y: 300, w: 360, h: 460, d: .85 }, { t: tLock, x: 104, y: 314, w: 332, h: 432, d: .2 }, { t: 15.2, o: 0, d: .4, e: V.glide }]);
  sfx(10.8, 'tick'); sfx(12.5, 'swoosh'); sfx(tLock, 'focus');
  KT(amT, 'TC', [{ t: "But here's the *challenge*…", at: L('s03', 0), mode: 'words', kwAt: W('s03', 0, 'challenge') }], { tout: L('s03', 1) - .1, out: 'mask' });
  KT(amT, 'BC', [{ t: 'Not every innovation gets the', at: L('s03', 1), mode: 'wordsAlt' }, { t: '*attention* it deserves.', at: W('s03', 1, 'attention'), mode: 'wordsAlt', kwAt: W('s03', 1, 'attention') + .1 }], { tout: S1('s03') - .2, out: 'drop' });

  // ================= s04-s06 · one frame becomes an inbox, a slide, a player (the trap, three times)
  const s2 = scene(amS, 15.3, 31.9);
  const fA = mframe(s2, 660, 96, 600, 888); fA.style.zIndex = 2;
  box(fA, [{ t: 0, x: 660, y: 96, w: 600, h: 888, o: 0, s: .96 }, { t: 15.42, o: 1, s: 1, d: .45, e: V.glide }, { t: 18.85, x: 560, y: 360, w: 800, h: 450, d: .5 },
    { t: 23.2, x: 120, y: 287, w: 900, h: 506, d: .5 }, { t: 26.8, x: 120, y: 120, w: 480, h: 270, d: .7 }, { t: 31.2, o: 0, d: .4, e: V.glide }]);
  // s04: the inbox fills, faster and faster; ours is pushed down and out of the bottom of the screen
  const hdr = K.div(fA, '', 'position:absolute;left:0;top:0;right:0;height:72px;background:#F4EFFA;', `<div style="position:absolute;left:28px;top:26px;width:140px;height:18px;border-radius:9px;background:#D9CFE6"></div><div style="position:absolute;right:28px;top:20px;color:#A100FF">${K.icon('mail', 32)}</div>`);
  V.anim(hdr, 'opacity', [[0, 1], [18.8, 0, .3]]);
  const arr = []; { let tt = 16.2; for (let k = 0; k < 15; k++) { arr.push(+tt.toFixed(3)); tt += .4 * Math.pow(.84, k); } }
  const nArr = (t) => arr.reduce((s, a2) => s + V.glide(V.seg(t, a2, .22)), 0);
  const rowEl = (ours) => { const r2 = K.div(s2, 'mrow' + (ours ? ' ours' : ''), 'left:676px;width:568px;z-index:3;'); r2.innerHTML = `<i></i><b style="width:${ours ? 260 : 150 + Math.round(R() * 140)}px"></b><u style="width:${260 + Math.round(R() * 150)}px"></u>`; return r2; };
  const place = (el, y, op) => { el.style.top = y.toFixed(1) + 'px'; const o = op * V.clamp(1 - (y - 900) / 200); el.style.opacity = o.toFixed(3); el.style.visibility = o < .003 ? 'hidden' : 'visible'; };
  const ours = rowEl(true);
  V.on((t) => place(ours, 192 + 88 * nArr(t), at01(t, 15.85, .2) * (1 - V.seg(t, 18.8, .3))));
  arr.forEach((a2, k) => { const el = rowEl(false); V.on((t) => place(el, 104 + 88 * (nArr(t) - k), at01(t, a2, .22) * (1 - V.seg(t, 18.8, .3)))); if (k < 9) sfx(a2, 'tick', -32); });
  KT(amT, { x: 120, y: 120, w: 500, align: 'left' }, [{ t: 'Some get', at: L('s04'), mode: 'left' }, { t: '*buried*', at: W('s04', 0, 'buried'), mode: 'drop', kwAt: W('s04', 0, 'buried') + .1 }], { tout: S1('s04') - .1, out: 'left' });
  KT(amT, { x: 1300, y: 984, w: 500, align: 'right', v: 'bottom' }, [{ t: 'in overflowing', role: 'sub', at: W('s04', 0, 'in overflowing'), mode: 'right' }, { t: 'inboxes.', role: 'sub', at: W('s04', 0, 'inboxes'), mode: 'right' }], { tout: S1('s04') - .1, out: 'right' });

  // s05: a slide; a deck stacks behind and over it; a demo bar stretches off the screen
  const slideHTML = (dot) => `<div style="position:absolute;left:48px;top:48px;width:360px;height:26px;border-radius:8px;background:#1A1323"></div>${[0, 1, 2].map((i) => `<div style="position:absolute;left:48px;top:${110 + i * 34}px;width:${[380, 330, 240][i]}px;height:12px;border-radius:6px;background:#E2DCEA"></div>`).join('')}<div style="position:absolute;left:510px;top:100px;width:240px;height:230px;border-radius:12px;background:#F2EAFD">${dot ? '<div style="position:absolute;left:104px;top:99px;width:32px;height:32px;border-radius:50%;background:#A100FF;box-shadow:0 0 30px 12px rgba(161,0,255,.3)"></div>' : ''}</div>`;
  const sl = K.div(fA, 'fill', '', slideHTML(true)); V.vis(sl, { tin: 18.95, tout: 23.15, rise: 0 });
  const tP = W('s05', 0, 'presentations'), tLen = W('s05', 0, 'lengthy');
  [1, 2, 3, 4].forEach((i) => { const d = mframe(s2, 560 + i * 34, 360 - i * 16, 800, 450); d.style.zIndex = 1; d.innerHTML = slideHTML(false); box(d, [{ t: 0, o: 0, tx: -i * 34, ty: i * 16, s: 1 - i * .03 }, { t: tP + (i - 1) * .13, o: 1 - i * .16, tx: 0, ty: 0, d: .45, e: V.glide }, { t: 23.1, o: 0, tx: -i * 34, ty: i * 16, d: .35 }]); });
  [1, 2].forEach((k) => { const d = mframe(s2, 560 + k * 30, 360 + k * 34, 800, 450); d.style.zIndex = 3; d.innerHTML = slideHTML(false); box(d, [{ t: 0, o: 0, tx: 520, rot: 4 }, { t: tP + .55 + k * .28, o: 1, tx: 0, rot: 0, d: .5, e: V.glide }, { t: 23.1, o: 0, tx: -30 * k, ty: -34 * k, d: .35 }]); sfx(tP + .55 + k * .28, 'slide'); });
  const pb = K.div(s2, 'bar-track', 'left:560px;top:880px;width:800px;z-index:4;'); const pbf = K.div(pb, 'fill'), pbh = K.div(pb, 'head');
  V.vis(pb, { tin: tLen - .1, tout: 23.1, rise: 0 });
  V.on((t) => { pb.style.width = V.mix(800, 2200, at01(t, tLen, 1.4)).toFixed(1) + 'px'; const x = 30 + 22 * Math.max(0, t - tLen); pbf.style.width = x.toFixed(1) + 'px'; pbh.style.left = x.toFixed(1) + 'px'; });
  KT(amT, 'TC', [{ t: 'Others get *lost*', at: L('s05'), mode: 'mask', kwAt: W('s05', 0, 'lost') }, { t: 'in presentations and lengthy demonstrations.', role: 'sub', at: W('s05', 0, 'in presentations'), mode: 'blur', gap: 16 }], { tout: S1('s05') - .1, out: 'mask' });

  // s06: a real video plays (a clip of the Aether film); then making one: time, effort, specialized skills
  const vid = K.div(fA, 'fill'); strip(vid, { src: 'assets/clip-hub.jpg', cols: 6, rows: 5, n: 30, fps: 10, t0: 23.55 }); V.vis(vid, { tin: 23.3, tout: 31.2, rise: 0 });
  const pl = K.div(s2, 'bar-track', 'left:120px;top:821px;width:900px;'); const plf = K.div(pl, 'fill'), plh = K.div(pl, 'head');
  V.vis(pl, { tin: 23.5, tout: 26.6, rise: 0 }); V.on((t) => { const x = 900 * V.mix(.12, .58, V.clamp((t - 23.5) / 3.1)); plf.style.width = x.toFixed(1) + 'px'; plh.style.left = x.toFixed(1) + 'px'; });
  const playB = K.div(s2, 'play', 'left:570px;top:540px;'); V.vis(playB, { tin: 23.3, tout: 23.9, scaleFrom: 1.3, rise: 0, base: '' });
  KT(amT, 'MR', [{ t: 'Videos can bring', at: L('s06', 0), mode: 'right' }, { t: 'these stories', at: L('s06', 0) + .25, mode: 'right' }, { t: 'to *life*…', at: W('s06', 0, 'life') - .2, mode: 'pop', kwAt: W('s06', 0, 'life') }], { tout: L('s06', 1) - .15, out: 'right' });
  const tC = L('s06', 1), tTime = W('s06', 1, 'time'), tEff = L('s06', 2), tSk = W('s06', 2, 'specialized');
  const ed = mframe(s2, 120, 460, 1680, 520); V.vis(ed, { tin: tC + .15, tout: 31.25, rise: 30 });
  const es = K.svg(ed, 1680, 520);
  const tracks = K.sv(es, 'g', {});
  const side = K.sv(es, 'g', {}); side.innerHTML = `<rect width="200" height="520" fill="#F4EFFA"/>` + ['layers', 'film', 'wand-sparkles', 'settings', 'audio-lines', 'image'].map((ic, i) => `<g transform="translate(46 ${46 + i * 72}) scale(1.5)" fill="none" stroke="#A100FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${window.VGE_ICONS[ic]}</g><rect x="96" y="${58 + i * 72}" width="72" height="12" rx="6" fill="#D9CFE6"/>`).join('');
  V.on((t) => { const k = at01(t, tSk, .5); side.setAttribute('transform', `translate(${(-200 * (1 - k)).toFixed(1)} 0)`); side.style.opacity = k.toFixed(3); });
  // tracks: the first is a filmstrip of real frames, then audio, then clip tracks with keyframes
  const X0 = 220, X1 = 1650;
  const film = K.sv(tracks, 'g', {}); for (let i = 0; i < 10; i++) { const im = K.sv(film, 'svg', { x: X0 + i * 143, y: 34, width: 136, height: 76, viewBox: `${i * 192} 0 192 108`, preserveAspectRatio: 'none' }); K.sv(im, 'image', { href: 'assets/strip-aether.jpg', x: 0, y: 0, width: 1920, height: 108, preserveAspectRatio: 'none' }); }
  ML.ASSETS.push('assets/strip-aether.jpg');
  V.on((t) => { const k = at01(t, tTime, .6); film.setAttribute('transform', `translate(${X0} 0) scale(${k.toFixed(3)} 1) translate(${-X0} 0)`); film.style.opacity = Math.min(1, k * 2).toFixed(3); });
  const wav = K.sv(tracks, 'g', {}); for (let i = 0; i < 96; i++) { const h = 10 + 36 * Math.abs(Math.sin(i * .9) * Math.cos(i * .23)); K.sv(wav, 'rect', { x: X0 + i * 14.9, y: 150 - h / 2, width: 8, height: h, rx: 4, fill: '#D7A8FF' }); }
  V.on((t) => { const k = at01(t, tTime + .15, .6); wav.setAttribute('transform', `translate(${X0} 0) scale(${k.toFixed(3)} 1) translate(${-X0} 0)`); wav.style.opacity = Math.min(1, k * 2).toFixed(3); });
  const keys = [];
  for (let r2 = 0; r2 < 4; r2++) { const y = 196 + r2 * 72; K.sv(tracks, 'rect', { x: X0, y, width: X1 - X0, height: 52, rx: 8, fill: '#FBFAFD' }); let cx = X0 + 8;
    while (cx < X1 - 70) { const cw = Math.min(90 + R() * 260, X1 - 10 - cx), cl = K.sv(tracks, 'rect', { x: cx, y: y + 6, width: cw, height: 40, rx: 6, fill: ['#D7A8FF', '#E9D5FF', '#D5CCE3', '#F2EAFD'][r2] });
      const c0 = cx, ts = tTime + .2 + r2 * .07 + R() * .25; V.on((t) => { const k = at01(t, ts, .45); cl.setAttribute('transform', `translate(${c0} 0) scale(${k.toFixed(3)} 1) translate(${-c0} 0)`); });
      for (let kx = cx + 24; kx < cx + cw - 16; kx += 70 + R() * 60) keys.push([kx, y + 26]); cx += cw + 12; } }
  keys.forEach(([x, y], i) => { const d = K.sv(tracks, 'rect', { x: -9, y: -9, width: 18, height: 18, fill: '#A100FF' }); const ts = tEff + .05 + i * .012; V.on((t) => { const k = at01(t, ts, .3); d.setAttribute('transform', `translate(${x} ${y}) rotate(45) scale(${k.toFixed(3)})`); }); });
  const phd = K.sv(tracks, 'rect', { x: X0 + 520, y: 20, width: 4, height: 480, fill: '#E5484D' }); V.anim(phd, 'opacity', [[0, 0], [tTime, 1, .3]]);
  V.on((t) => { const k = V.travel(V.seg(t, 31.28, .5)); tracks.setAttribute('transform', `translate(0 260) scale(1 ${(1 - .985 * k).toFixed(4)}) translate(0 -260)`); });
  // the clock (time) and a curves panel (skills)
  const clk = K.div(s2, '', 'position:absolute;left:1690px;top:392px;width:96px;height:96px;'), cks = K.svg(clk, 96, 96);
  K.sv(cks, 'circle', { cx: 48, cy: 48, r: 42, fill: '#fff', stroke: '#1A1323', 'stroke-width': 5 }); const hand = K.sv(cks, 'line', { x1: 48, y1: 48, x2: 48, y2: 16, stroke: '#A100FF', 'stroke-width': 6, 'stroke-linecap': 'round' });
  V.vis(clk, { tin: tTime, tout: 31.2, scaleFrom: .5, rise: 0 }); V.on((t) => hand.setAttribute('transform', `rotate(${(Math.max(0, t - tTime) * 220).toFixed(1)} 48 48)`));
  const cur = K.div(s2, 'card', 'position:absolute;left:1380px;top:540px;width:380px;height:200px;'), cs = K.svg(cur, 380, 200);
  K.sv(cs, 'path', { d: 'M 30 170 L 350 170 M 30 170 L 30 30', stroke: '#E2DCEA', 'stroke-width': 3, fill: 'none' }); const crv = K.sv(cs, 'path', { d: 'M 30 170 C 150 170, 160 40, 350 40', stroke: '#A100FF', 'stroke-width': 6, fill: 'none' });
  V.draw(crv, { t0: tSk + .35, dur: .6, ease: V.glide }); V.vis(cur, { tin: tSk + .25, tout: 31.2, x: 40, rise: 0 });
  [tTime, tEff, tSk].forEach((t0) => sfx(t0, 'click'));
  KT(amT, 'TR', [{ t: 'Creating them takes', at: tC, mode: 'mask' }, { t: '*time*,', role: 'sub', at: tTime - .1, mode: 'pop', gap: 16, kwAt: tTime }, { t: '*effort*,', role: 'sub', at: tEff - .05, mode: 'pop', kwAt: tEff + .1 }, { t: 'and *specialized skills*.', role: 'sub', at: W('s06', 2, 'and'), mode: 'pop', kwAt: tSk }], { tout: 31.15, out: 'mask' });

  // ================= s07 · the turn: everything folds into one line, then one point; the question
  const s3 = scene(amS, 31.0, 39.0);
  const fold = K.div(s3, '', 'position:absolute;left:340px;top:718px;width:1440px;height:4px;border-radius:2px;background:var(--purple);');
  V.on((t) => { const k = V.travel(V.seg(t, 31.62, .32)); fold.style.transform = `scaleX(${(1 - k).toFixed(4)})`; fold.style.transformOrigin = '620px 50%'; fold.style.opacity = (V.seg(t, 31.55, .08) * (1 - V.seg(t, 31.9, .05))).toFixed(3); });
  sfx(31.3, 'swoosh'); sfx(31.9, 'shimmer');
  KT(amT, 'C', [{ t: 'What if *AI* could', role: 'state', at: L('s07', 1), mode: 'wordsPop', kwAt: W('s07', 1, 'AI') + .05 }, { t: 'change that?', role: 'state', at: L('s07', 1) + .45, mode: 'wordsPop' }], { tout: S1('s07') - .12, out: 'blur', y: 470 });
  ring(s3, 960, 800, W('s07', 1, 'AI'), { r0: 18, r1: 110, d: 1.0 }); ring(s3, 960, 800, W('s07', 1, 'AI') + .3, { r0: 18, r1: 150, d: 1.1 });

  // ================= s08 · videos for... anything? (the owner liked this one as planned)
  const fB = mframe(s3, 560, 400, 800, 450); fB.style.transformOrigin = '64px 102px';
  box(fB, [{ t: 0, o: 0, s: .06 }, { t: 34.32, o: 1, s: 1, d: .5, e: V.glide }, { t: 36.85, x: 820, y: 430, w: 300, h: 169, d: .45 }, { t: 38.2, tx: -360, o: 0, d: .45 }]);
  const cu = K.div(fB, 'cursor-i', 'left:56px;top:70px;'); V.on((t) => { cu.style.opacity = t < 34.6 || t > 36.85 ? 0 : (Math.floor((t - 34.6) * 2.4) % 2 ? .15 : 1); });
  const grid = [];
  for (let r2 = 0; r2 < 2; r2++) for (let c = 0; c < 5; c++) { if (r2 === 0 && c === 2) continue; const x = 140 + c * 340, y = 430 + r2 * 260, g = mframe(s3, 960 - 150, 625 - 85, 300, 169), k = grid.length;
    box(g, [{ t: 0, x: 810, y: 540, o: 0, s: .5 }, { t: 36.9 + k * .055, x, y, o: .6, s: 1, d: .5 }, { t: 38.2, tx: -360, o: 0, d: .45 }]); grid.push(g); }
  [36.9, 37.15, 37.4].forEach((t) => sfx(t, 'tick'));
  const any = K.div(amT, 't-display pjs', 'position:absolute;left:0;top:616px;width:1920px;text-align:center;color:var(--purple);', 'anything?');
  V.vis(any, { tin: L('s08', 2), tout: 38.2, scaleFrom: .82, rise: 0 }); V.text('any', 'anything?', L('s08', 2), 38.2); sfx(L('s08', 2), 'pop');
  KT(amT, 'TL', [{ t: 'What if we could create', at: L('s08', 0), mode: 'rise' }, { t: 'videos for…', at: L('s08', 0) + .5, mode: 'rise' }], { tout: 38.25, out: 'left' });

  // ================= s09 · the formats: the camera travels a row of frames; each plays a tiny version of itself
  const s4 = scene(amS, 38.0, 46.5);
  const row = K.div(s4, 'fill'); const TI = [0, 1, 2, 3, 4].map((k) => L('s09', k));
  const camX = kf([{ t: 0, x: -890 }, { t: 38.2, x: -490, d: .55 }, ...TI.slice(1).map((ti, i) => ({ t: ti - .38, x: -490 + 800 * (i + 1), d: .6 }))]);
  V.on((t) => { row.style.transform = `translateX(${(-camX(t).x).toFixed(1)}px)`; });
  const kinds = ['product', 'demo', 'comms', 'training', 'fresh'], labels = ['Product showcases', 'Software demos', 'Client communications', 'Training videos', 'Something entirely new'], lm = ['left', 'drop', 'right', 'pop', 'words'];
  kinds.forEach((k, i) => {
    const f = mframe(row, 120 + i * 800, 300, 700, 394), w = K.div(f, 'fill'); spec(k, w, TI[i]); V.vis(w, { tin: TI[i] - .1, rise: 0, din: .4 });
    V.on((t) => f.classList.toggle('lit', t >= TI[i] && (i === 4 || t < TI[i + 1] - .2)));
    KT(row, { x: 120 + i * 800, y: 718, w: 700, align: 'left' }, [{ t: labels[i], role: 'sub', at: TI[i], mode: lm[i], c: '#1A1323' }]);
    sfx(TI[i], 'tick'); if (i) sfx(TI[i] - .38, 'swish');
  });

  // ================= s10-s11 · one frame: any format, any style; then a reference, and AI does the rest
  const s5 = scene(amS, 46.4, 53.3);
  const fC = mframe(s5, 610, 300, 700, 394, 'lit'), tF = L('s10', 0), tS = L('s10', 1);
  box(fC, [{ t: 0, x: 610, y: 300, w: 700, h: 394, r: 20 }, { t: 46.5, x: 510, y: 360, w: 900, h: 506, d: .45 },
    { t: tF + .1, x: 810, y: 346, w: 300, h: 534, d: .28 }, { t: tF + .42, x: 707, y: 360, w: 506, h: 506, d: .28 }, { t: tF + .74, x: 510, y: 360, w: 900, h: 506, d: .28 },
    { t: 48.95, x: 680, y: 360, w: 1120, h: 600, d: .5 }, { t: 52.55, x: 0, y: 0, w: 1920, h: 1080, r: 0, d: .6 }]);
  V.on((t) => fC.classList.toggle('lit', t < 46.9 || (t >= 50.6 && t < 52.5)));
  const fr = K.div(fC, 'fill'); spec('fresh', fr, L('s09', 4)); V.anim(fr, 'opacity', [[0, 1], [46.6, 0, .3]]);
  const st0 = K.div(fC, 'fill'); spec('light', st0, 46.7); V.anim(st0, 'opacity', [[0, 0], [46.6, 1, .3], [48.9, 0, .25]]);
  [['editorial', tS - .02], ['mograph', tS + .36]].forEach(([k, t0]) => { const l = K.div(fC, 'fill'); spec(k, l, t0); V.on((t) => { const p = at01(t, t0, .3); l.style.clipPath = `inset(0 ${(100 * (1 - p)).toFixed(2)}% 0 0)`; l.style.visibility = p <= 0 ? 'hidden' : 'visible'; l.style.opacity = (1 - V.seg(t, 48.9, .25)).toFixed(3); }); sfx(t0, 'swish'); });
  [tF + .1, tF + .42, tF + .74].forEach((t) => sfx(t, 'snap'));
  KT(amT, 'TC', [{ t: 'Any *format*.', at: tF, mode: 'letters' }, { t: 'Any *style*.', at: tS, mode: 'letters' }], { tout: S1('s10') - .05, out: 'mask' });
  // s11
  const ref = K.div(s5, 'card', 'position:absolute;left:120px;top:420px;width:440px;height:248px;overflow:hidden;');
  ref.innerHTML = '<img src="assets/reference-still.jpg" style="width:100%;height:100%;object-fit:cover;display:block">'; ML.ASSETS.push('assets/reference-still.jpg');
  box(ref, [{ t: 0, tx: -620, o: 0, rot: -6 }, { t: L('s11', 0), tx: 0, o: 1, rot: 0, d: .65, e: V.glide }, { t: 52.45, o: 0, d: .3 }]); sfx(L('s11', 0) + .1, 'swoosh');
  const lk = K.svg(s5); const lkp = K.path(lk, 'M 560 544 C 620 544, 620 660, 680 660', { width: 5 }); V.draw(lkp, { t0: 49.95, dur: .45, ease: V.glide, tout: 52.45 });
  const tR = L('s11', 1), cas = K.div(fC, 'fill');
  V.anim(cas, 'opacity', [[0, 1], [52.55, 0, .3]]);
  const bgc = K.div(cas, 'fill', 'background:#F4EEFB;'); V.anim(bgc, 'opacity', [[0, 0], [tR + .05, 1, .3]]);
  const ttl = K.div(cas, '', 'position:absolute;left:8%;top:14%;width:40%;height:9%;border-radius:10px;background:#1A1323;transform-origin:0 50%;'); V.on((t) => { ttl.style.transform = `scaleX(${at01(t, tR + .35, .4).toFixed(3)})`; });
  const sub2 = K.div(cas, '', 'position:absolute;left:8%;top:27%;width:26%;height:5%;border-radius:8px;background:#5E5868;transform-origin:0 50%;'); V.on((t) => { sub2.style.transform = `scaleX(${at01(t, tR + .5, .4).toFixed(3)})`; });
  const wfw = K.div(cas, '', 'position:absolute;left:46%;top:40%;width:48%;height:50%;'); spec('workflow', wfw, tR + .75); V.anim(wfw, 'opacity', [[0, 0], [tR + .7, 1, .2]]);
  const arcL = K.div(cas, '', 'position:absolute;left:58%;top:62%;width:70%;height:124%;border-radius:50%;box-shadow:inset 0 0 0 3px #E2D3F4;'); V.anim(arcL, 'opacity', [[0, 0], [tR + 1.05, 1, .4]]);
  [[tR + .05, 'pop'], [tR + .35, 'tap'], [tR + .75, 'click'], [tR + 1.05, 'confirm']].forEach(([t, k]) => sfx(t, k));
  const dp = K.div(fC, 'fill deep'); V.anim(dp, 'opacity', [[0, 0], [52.6, 1, .35]]);
  KT(amT, 'TL', [{ t: 'Just provide a *reference*…', at: L('s11', 0), mode: 'drop', kwAt: W('s11', 0, 'reference') }], { tout: S1('s11') - .1, out: 'lift' });
  KT(amT, { x: 120, y: 700, w: 600, align: 'left' }, [{ t: 'and let AI do the rest.', role: 'sub', at: tR, mode: 'words' }], { tout: S1('s11') - .1, out: 'blur' });

  // ================= s12 · chapter: Introducing MotionLab (the wordmark lands in the studio's bar)
  const ch1 = ML.win(K.div(amDeep, 'chapter deep'), 52.9, 55.8); K.ground(ch1); V.anim(ch1, 'opacity', [[0, 1], [55.1, 0, .55]]);
  const intro = KT(amT, 'C', [{ t: 'Introducing', role: 'sub', at: L('s12', 0), mode: 'blur', tout: 55.0 }, { t: 'MotionLab', role: 'display', at: L('s12', 1), mode: 'letters', gap: 16 }], { deep: true });
  const wm = intro.lines[1]; wm.style.transformOrigin = '50% 50%';
  V.on((t) => { const b = V.travel(V.seg(t, 55.05, .7)); wm.style.transform = `translate(${(-471 * b).toFixed(1)}px, ${(-194 * b).toFixed(1)}px) scale(${V.mix(1, 30 / 168, b).toFixed(4)})`; wm.style.opacity = (1 - V.seg(t, 55.62, .12)).toFixed(3); });
  V.colorTo(wm, 'color', '#FFFFFF', '#1A1323', 55.15, .4);
  const trS = K.svg(ch1), tr = K.path(trS, 'M 560 700 C 800 770, 1100 770, 1360 690', { stroke: '#D7A8FF', width: 8 }); V.draw(tr, { t0: L('s12', 1) + .05, dur: .7, ease: V.glide, tout: 55.0 });
  const trP = samples('M 560 700 C 800 770, 1100 770, 1360 690'), trD = K.div(ch1, 'spark white');
  V.on((t) => { const [x, y] = trP(at01(t, L('s12', 1) + .05, .7)); trD.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; trD.style.opacity = (V.seg(t, L('s12', 1), .1) * (1 - V.seg(t, 54.95, .2))).toFixed(3); });
  sfx(52.6, 'whoosh'); sfx(L('s12', 1), 'bass');

  // ================= s13 · the engine: a large studio window, in focus
  const s6 = scene(amS, 55.0, 60.4);
  const stw = K.div(s6, 'fill'); stw.style.transformOrigin = '1053px 600px';
  box(stw, [{ t: 0, s: 1, o: 1, tx: 0, ty: 0 }, { t: 55.4, s: 1.03, d: 4.1, e: V.linear }, { t: 59.55, s: 2.4, tx: -93, ty: -60, d: .7 }, { t: 59.8, o: 0, d: .45, e: V.glide }]);
  const glow = K.div(stw, '', 'position:absolute;left:300px;top:260px;width:1320px;height:780px;border-radius:60px;background:radial-gradient(closest-side, rgba(161,0,255,.22), rgba(161,0,255,0));'); V.anim(glow, 'opacity', [[0, 0], [55.5, 1, 1.2]]);
  const wnd = mframe(stw, 384, 330, 1152, 648); V.vis(wnd, { tin: 55.3, rise: 0, scaleFrom: .97, din: .5 });
  K.div(wnd, '', 'position:absolute;left:0;top:0;right:0;height:64px;border-bottom:2px solid #ECE6F2;background:#fff;');
  const bwm = K.div(wnd, 'pjs', 'position:absolute;left:28px;top:12px;font-family:"Plus Jakarta Sans";font-size:30px;line-height:40px;font-weight:600;color:#1A1323;', 'MotionLab'); V.anim(bwm, 'opacity', [[0, 0], [55.55, 1, .2]]);
  const pIn = K.div(wnd, '', 'position:absolute;left:16px;top:80px;width:170px;height:552px;border-radius:12px;background:#F7F3FB;');
  [['file-text', 0], ['audio-lines', 1], ['image', 2]].forEach(([ic, i]) => K.div(pIn, 'card', `position:absolute;left:16px;top:${16 + i * 112}px;width:138px;height:96px;display:flex;align-items:center;justify-content:center;color:var(--purple);`, K.icon(ic, 40)));
  V.vis(pIn, { tin: W('s13', 0, 'video') - .1, x: -40, rise: 0 });
  const cnv = K.div(wnd, '', 'position:absolute;left:202px;top:80px;width:934px;height:380px;border-radius:12px;overflow:hidden;box-shadow:inset 0 0 0 2px #ECE6F2;'); spec('finished', cnv, 56.0); V.vis(cnv, { tin: 55.75, rise: -30 });
  const tlE = K.div(wnd, '', 'position:absolute;left:202px;top:476px;width:934px;height:156px;border-radius:12px;background:#F7F3FB;');
  [0, 1, 2, 3].forEach((i) => { const c = K.div(tlE, '', `position:absolute;left:${16 + i * 228}px;top:20px;width:216px;height:52px;border-radius:8px;background:${['#D7A8FF', '#A100FF', '#E9D5FF', '#D5CCE3'][i]};transform-origin:0 50%;`); V.on((t) => { c.style.transform = `scaleX(${at01(t, W('s13', 0, 'engine') + .15 + i * .1, .4).toFixed(3)})`; }); });
  K.div(tlE, '', 'position:absolute;left:16px;top:92px;width:902px;height:44px;border-radius:8px;background:#fff;'); V.vis(tlE, { tin: W('s13', 0, 'engine') - .1, rise: 40 });
  const cop = K.pill(wnd, { x: 892, y: 4, text: 'Claude Opus', ic: 'sparkles', kind: 'accent' }); V.vis(cop, { tin: W('s13', 0, 'built') + .35, scaleFrom: .7, rise: 0 });
  V.on((t) => wnd.classList.toggle('lit', t >= W('s13', 0, 'built') + .35));
  [[55.3, 'slide'], [55.75, 'click'], [W('s13', 0, 'video'), 'click'], [W('s13', 0, 'engine'), 'click'], [W('s13', 0, 'built') + .35, 'shimmer'], [59.55, 'zin']].forEach(([t, k]) => sfx(t, k));
  KT(amT, 'TC', [{ t: 'An AI-powered *video creation engine*,', at: L('s13'), mode: 'words', kwAt: W('s13', 0, 'video') }, { t: 'built on Claude Opus', role: 'sub', at: W('s13', 0, 'built'), mode: 'blur', gap: 8 }], { tout: 59.55, out: 'lift' });

  // ================= s14-s16 · what it makes, the whole process, what it needs
  const s7 = scene(amS, 59.7, 74.4);
  const TT = [W('s14', 0, 'animated'), W('s14', 0, 'product'), W('s14', 1, 'motion'), W('s14', 1, 'synchronized')];
  const tk = ['workflow', 'sim', 'mograph', 'voice'], tlb = ['Animated workflows', 'Product simulations', 'Motion graphics', 'Synchronized voiceovers'];
  const G2 = [[232, 128, 0, -160], [988, 128, 160, 0], [232, 556, -160, 0], [988, 556, 0, 160]], CLR = ['#D7A8FF', '#A100FF', '#E9D5FF', '#D5CCE3'];
  G2.forEach(([x, y, dx, dy], i) => {
    const f = mframe(s7, x, y, 700, 330); spec(tk[i], f, TT[i]);
    box(f, [{ t: 0, x, y, w: 700, h: 330, o: 0, s: .9, tx: dx, ty: dy }, { t: TT[i] - .15, o: 1, s: 1, tx: 0, ty: 0, d: .55, e: V.glide },
      { t: 65.85 + i * .05, x: 120 + i * 430, y: 380, w: 400, h: 225, d: .55 }, { t: 66.9 + i * .18, x: 140 + i * 412, y: 780, w: 400, h: 80, d: .45 }, { t: 69.0, o: 0, d: .3 }]);
    V.on((t) => f.classList.toggle('lit', t >= TT[i] && t < (TT[i + 1] ?? 65.8)));
    const cv = K.div(f, 'fill', `background:${CLR[i]};`); V.anim(cv, 'opacity', [[0, 0], [66.95 + i * .18, 1, .35]]);
    KT(amT, { x, y: y + 342, w: 700, align: i % 2 ? 'right' : 'left' }, [{ t: tlb[i], role: 'sub', at: TT[i], mode: ['left', 'right', 'left', 'right'][i], c: '#1A1323' }], { tout: 65.75, out: 'blur' });
    sfx(TT[i], 'tick'); sfx(67.1 + i * .18, 'snap');
  });
  const tlF = mframe(s7, 120, 760, 1680, 120); V.vis(tlF, { tin: 66.3, tout: 69.0, rise: 30 });
  const ph2 = K.div(s7, '', 'position:absolute;top:740px;width:6px;height:160px;border-radius:3px;background:var(--risk);');
  V.on((t) => { ph2.style.left = V.mix(140, 1790, V.clamp((t - 67.75) / .9)).toFixed(1) + 'px'; ph2.style.opacity = (V.seg(t, 67.6, .2) * (1 - V.seg(t, 69.0, .3))).toFixed(3); }); sfx(67.75, 'scan');
  const fF = mframe(s7, 660, 372, 600, 338); const fFi = K.div(fF, 'fill'); spec('finished', fFi, 67.9); V.anim(fFi, 'opacity', [[0, 1], [69.3, 0, .3]]);
  box(fF, [{ t: 0, x: 660, y: 372, w: 600, h: 338, o: 0, s: .9 }, { t: 67.75, o: 1, s: 1, d: .5, e: V.glide }, { t: 69.05, x: 120, y: 382, w: 560, h: 316, d: .6 }, { t: 73.85, o: 0, d: .35, e: V.glide }]);
  V.on((t) => fF.classList.toggle('lit', (t >= 67.75 && t < 69.3) || t >= 73.0));
  const okB = K.div(s7, '', 'position:absolute;left:1220px;top:332px;width:80px;height:80px;border-radius:50%;background:var(--ok);color:#fff;display:flex;align-items:center;justify-content:center;', K.icon('check', 44));
  V.vis(okB, { tin: 68.65, tout: 69.0, scaleFrom: .4, rise: 0 }); sfx(68.65, 'confirm');
  KT(amT, 'TC', [{ t: 'MotionLab handles the', at: L('s15'), mode: 'words' }, { t: '*entire* production process.', at: L('s15') + .45, mode: 'words', kwAt: W('s15', 0, 'entire') }], { tout: 69.05, out: 'mask' });
  // s16: what it needs, arriving from three sides into the frame
  const TS = [W('s16', 0, 'your'), L('s16', 1), L('s16', 2)];
  const cardH = (k) => k === 0 ? '<div class="hd" style="width:40%;height:14px;border-radius:7px;background:var(--purple);margin:30px 24px 18px"></div>' + [0, 1, 2].map((i) => `<div style="margin:0 24px 12px;height:10px;border-radius:5px;background:#E2DCEA;width:${[80, 64, 72][i]}%"></div>`).join('')
    : k === 1 ? `<div style="position:absolute;inset:26px;display:flex;align-items:center;gap:6px">${[...Array(14)].map((_, i) => `<i style="flex:1;border-radius:4px;background:#D7A8FF;height:${20 + 70 * Math.abs(Math.sin(i * 1.1))}%"></i>`).join('')}</div>`
      : `<div style="position:absolute;inset:16px;border-radius:10px;background:#F1EAFA;overflow:hidden"><div style="position:absolute;left:-10%;bottom:-30%;width:70%;height:90%;background:#D7A8FF;transform:rotate(38deg)"></div><div style="position:absolute;right:-12%;bottom:-40%;width:70%;height:90%;background:#C48BFF;transform:rotate(-34deg)"></div><div style="position:absolute;right:26px;top:22px;width:30px;height:30px;border-radius:50%;background:#F5A524"></div></div>`;
  [[0, -320, -8], [420, 0, 6], [0, 340, -5]].forEach(([dx, dy, rot], k) => {
    const y = 250 + k * 215, c = mframe(s7, 800, y, 200, 150); c.innerHTML = cardH(k);
    box(c, [{ t: 0, o: 0, tx: dx, ty: dy, rot }, { t: TS[k], o: 1, tx: 0, ty: 0, rot: 0, d: .6, e: V.glide }, { t: 73.85, o: 0, d: .3 }]);
    const lp = K.path(K.svg(s7), `M 800 ${y + 75} C 740 ${y + 75}, 740 ${500 + k * 40}, 680 ${500 + k * 40}`, { width: 5, stroke: '#D7A8FF' }); V.draw(lp, { t0: TS[k] + .4, dur: .35, ease: V.glide, tout: 73.85 });
    sfx(TS[k] + .45, 'magnet');
  });
  KT(amT, 'MR', [{ t: 'All it needs is…', at: L('s16', 0), mode: 'right' }, { t: 'your *story*,', role: 'sub', at: TS[0] - .1, mode: 'drop', gap: 16, kwAt: TS[0] + .25 }, { t: 'a *voiceover*,', role: 'sub', at: TS[1] - .05, mode: 'right' }, { t: 'or a creative *reference*.', role: 'sub', at: TS[2] - .05, mode: 'rise', kwAt: W('s16', 2, 'reference') }], { tout: 73.85, out: 'right' });

  // ================= s17 · sounds interesting? (icons carry each line) · s18 · the story goes into MotionLab
  const s8 = scene(amS, 73.9, 82.9);
  const bulb = badge(s8, 'lightbulb', 960, 300, 140, { round: true, bg: '#FFF4DF', c: '#E08A00' }); box(bulb, [{ t: 0, o: 0, s: .3, rot: -20 }, { t: L('s17', 0) - .1, o: 1, s: 1, rot: 0, d: .6, e: V.glide }, { t: L('s17', 1) + .3, o: 0, s: .8, ty: -30, d: .4 }]);
  [[-120, -70], [110, -84], [130, 60]].forEach(([dx, dy], i) => { const sp = K.div(s8, '', `position:absolute;left:${960 + dx - 20}px;top:${300 + dy - 20}px;width:40px;height:40px;color:#F5A524;`, K.icon('sparkles', 40)); box(sp, [{ t: 0, o: 0, s: .2 }, { t: L('s17', 0) + .25 + i * .1, o: 1, s: 1, d: .4, e: V.glide }, { t: L('s17', 1) + .3, o: 0, d: .3 }]); });
  KT(amT, 'C', [{ t: 'Sounds interesting?', role: 'state', at: L('s17', 0), mode: 'wordsPop' }], { tout: L('s17', 1) + .35, out: 'blur', y: 560 });
  const bub = badge(s8, 'message-circle', 960, 330, 140, { round: true }); box(bub, [{ t: 0, o: 0, s: .4, tx: -60 }, { t: L('s17', 2) - .15, o: 1, s: 1, tx: 0, d: .55, e: V.glide }, { t: L('s17', 3) - .2, o: 0, s: .7, d: .35 }]);
  const nx = K.div(s8, '', 'position:absolute;left:1000px;top:270px;width:64px;height:64px;border-radius:50%;background:var(--risk);color:#fff;display:flex;align-items:center;justify-content:center;', K.icon('x', 36)); box(nx, [{ t: 0, o: 0, s: .2 }, { t: W('s17', 2, 'word') - .05, o: 1, s: 1, d: .4, e: V.glide }, { t: L('s17', 3) - .2, o: 0, d: .3 }]);
  KT(amT, 'C', [{ t: "Don't take our word for it.", at: L('s17', 2), mode: 'blur' }], { tout: L('s17', 3) - .2, out: 'drop', y: 560 });
  const tTest = W('s17', 3, 'test');
  const fT = mframe(s8, 710, 440, 500, 282, 'lit'); box(fT, [{ t: 0, x: 710, y: 440, w: 500, h: 282, o: 0, s: .92 }, { t: L('s17', 3) + .15, o: 1, s: 1, d: .5, e: V.glide }, { t: 79.2, x: 760, y: 380, w: 1040, h: 585, d: .6 }]);
  const flask = badge(s8, 'flask-conical', 590, 580, 112, { round: true }); box(flask, [{ t: 0, o: 0, s: .3, rot: 30 }, { t: tTest - .1, o: 1, s: 1, rot: 0, d: .5, e: V.glide }, { t: 79.15, o: 0, d: .3 }]);
  const play = K.div(s8, 'play', 'left:960px;top:820px;'); V.on((t) => { const a2 = at01(t, L('s17', 3) + .5, .45), pr = Math.sin(Math.PI * V.seg(t, tTest + .25, .25)); play.style.transform = `scale(${(a2 * (1 - .14 * pr)).toFixed(3)})`; play.style.opacity = (a2 * (1 - V.seg(t, 79.15, .3))).toFixed(3); });
  ring(s8, 960, 820, tTest + .3, { r0: 52, r1: 130, d: .8 }); sfx(tTest + .25, 'click'); sfx(L('s17', 0) - .1, 'pop'); sfx(L('s17', 2) - .15, 'pop');
  KT(amT, { x: 120, y: 300, w: 1680, align: 'center', v: 'mid' }, [{ t: "Let's put it to the *test*.", at: L('s17', 3), mode: 'words', kwAt: tTest }], { tout: 79.25, out: 'lift' });
  // s18
  const AETHER = ['Imagine managing a global', 'supply chain.', 'Thousands of shipments.', 'Hundreds of suppliers.', 'Millions of moving parts.', 'Now imagine… a critical', 'shipment gets delayed in', 'Singapore, putting three', 'manufacturing facilities…', 'Meet Aether.'];
  const doc = K.div(s8, 'mdoc', 'left:120px;top:380px;width:520px;height:560px;', '<div class="hd"></div>' + AETHER.map((l) => `<p>${l}</p>`).join(''));
  box(doc, [{ t: 0, tx: -680, o: 0, rot: -4 }, { t: 79.7, tx: 0, o: 1, rot: 0, d: .6, e: V.glide }]); sfx(79.75, 'swoosh');
  doc.querySelectorAll('p').forEach((p, i) => V.colorTo(p, 'color', '#4A4453', '#A100FF', 80.95 + i * .085, .2));
  const lk2 = K.path(K.svg(s8), 'M 640 660 C 700 660, 700 672, 760 672', { width: 6 }); V.draw(lk2, { t0: 80.85, dur: .35, ease: V.glide });
  const scanL = K.div(fT, '', 'position:absolute;left:0;right:0;height:8px;background:linear-gradient(90deg, rgba(161,0,255,0), #A100FF, rgba(161,0,255,0));');
  V.on((t) => { scanL.style.top = V.mix(0, 577, V.clamp((t - 81.0) / .8)).toFixed(1) + 'px'; scanL.style.opacity = (V.seg(t, 81.0, .1) * (1 - V.seg(t, 81.75, .1))).toFixed(3); });
  sfx(81.0, 'scan'); sfx(81.95, 'whoosh'); sfx(82.0, 'zin');
  KT(amT, 'TL', [{ t: "Here's a simple product", at: L('s18'), mode: 'mask' }, { t: '*story* we gave MotionLab.', at: L('s18') + .4, mode: 'mask', kwAt: W('s18', 0, 'story') }], { tout: 81.85, out: 'mask' });
})();
