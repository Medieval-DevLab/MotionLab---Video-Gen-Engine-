// Tuning-scale previews: one example scene ("One intelligent ecosystem", an 8 s loop), built with the real kit, at any
// setting of the eight dials. All dials at 0 is the Base.
//   #v=e,p,c,d,g,t,r,s   one full-size scene at that setting (&lane=1 draws the sound lane)
//   #preset=<id>         that preset's own example film (presets.js)
//   #<dial>              that dial's five steps in a row, the others at 0
//   (no hash)            all eight dials x five steps on one 1920x1080 sheet, for checks
// Like a film it is a pure function of t, so the renderer can draw it; in a browser it loops by itself. It only reads
// the engine (styles/SCALE.md).
(function () {
  const V = VGE, K = VGEKit, D = VGEScaleDials, OUT = 7.3;
  const H = new URLSearchParams(location.hash.slice(1)), vs = H.get('v'), pf = window.VGEPresetFilms[H.get('preset')], root = document.getElementById('root');
  const LOOP = pf ? pf.dur : 8; window.DUR = LOOP;
  const single = vs ? Object.fromEntries(D.dials.map((d, i) => [d.id, +(vs.split(',')[i] || 0)])) : null;
  const one = !single && !pf && location.hash.slice(1), rows = one ? D.dials.filter((d) => d.id === one) : D.dials;
  addEventListener('hashchange', () => location.reload());
  const LIB = '../../library/', PH = (f) => LIB + 'photos/' + f + '.jpg', SND = (f) => LIB + 'audio/' + f + '.mp3';
  const PHOTO = { desk: 'desk-work-c99fd139', laptop: 'laptop-work-ed1c4fde', warehouse: 'warehouse-967a52c8', city: 'city-skyline-db28e157', woman: 'portrait-woman-1a857d9d' };
  const BACK = (x) => 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);
  const cells = [];

  // ---- layout: one scene or one row (embedded, scaled to the frame width), or the full sheet at 1920x1080
  let S, X, Y;
  if (single || pf) { document.body.className = 'single'; S = 1; X = () => 0; Y = () => 0; }
  else if (one) { document.body.className = 'row'; S = 374.4 / 1920; X = (i) => i * (374.4 + 12); Y = () => 0; }
  else {
    document.body.className = 'sheet'; root.classList.add('sheet'); S = .1127;
    const w = 1920 * S, h = 1080 * S; X = (i) => 600 + i * (w + 14); Y = (r) => 50 + r * (h + 8);
    ['−2', '−1', 'Base', '+1', '+2'].forEach((l, i) => K.div(root, 'hd' + (i === 2 ? ' zero' : ''), `left:${X(i)}px;width:${w}px;`, l));
    rows.forEach((d, r) => K.div(root, 'rl', `top:${Y(r) + h / 2 - 34}px;`, `<b>${d.name}</b><small>${d.q}</small>`));
  }
  const fit = () => { if (single || pf || one) root.style.transform = `scale(${(innerWidth / 1920).toFixed(5)})`; };
  fit(); addEventListener('resize', fit);

  if (pf) {
    const box = K.div(root, 'cellbox', 'left:0;top:0;width:1920px;height:1080px;border-radius:0;box-shadow:none;'), F = K.div(box, 'frame');
    pf.build(F); cells.push({ box, d: { id: 'film' }, v: 0, sfx: [], music: null });
  } else if (single) {
    const box = K.div(root, 'cellbox', 'left:0;top:0;width:1920px;height:1080px;border-radius:0;box-shadow:none;'), F = K.div(box, 'frame bg-v2');
    cells.push({ box, d: { id: 'sound' }, v: 0, ...scene(F, single, H.get('lane') === '1') });
  } else rows.forEach((d, r) => [-2, -1, 0, 1, 2].forEach((v, i) => {
    const box = K.div(root, 'cellbox', `left:${X(i)}px;top:${Y(r)}px;width:${(1920 * S).toFixed(1)}px;height:${(1080 * S).toFixed(1)}px;`);
    const F = K.div(box, 'frame bg-v2', `transform:scale(${S.toFixed(5)});`);
    const c = { energy: 0, pace: 0, camera: 0, density: 0, ground: 0, type: 0, real: 0, sound: 0, [d.id]: v };
    cells.push({ box, d, v, ...scene(F, c, d.id === 'sound') });
  }));

  function scene(F, c, soundRow) {
    // energy: how things move (SCALE.md); the Base is index 2
    const e = c.energy + 2, din = [1, .8, .6, .45, .35][e], rise = [0, 12, 24, 40, 64][e], slide = [0, 12, 24, 48, 96][e];
    const trav = [2, 1.7, 1.4, 1.1, .8][e], idle = [0, 0, 0, 5, 9][e];
    // pace: when the beats land, and whether the scene swaps (A: the hub · B: the risk assessment · C: the result)
    const pc = c.pace, endA = pc >= 2 ? 3.0 : pc >= 1 ? 4.6 : OUT;
    const cardAt = pc <= -2 ? [1.6, 1.6, 1.6, 1.6] : pc === -1 ? [1.2, 1.2, 2.4, 2.4] : pc === 1 ? [1.2, 1.7, 2.2, 2.7] : pc >= 2 ? [.9, 1.3, 1.7, 2.1] : [.9, 1.6, 2.3, 3.0];
    const gather = pc >= 2 ? 2.5 : pc >= 1 ? 3.6 : 4.4, kwAt = gather + .3, ty = c.type;
    const dest = pc <= -2 || pc >= 1 || ty >= 2 ? null : 5.3, CX = ty >= 2 ? 1480 : 1250, CY = 624;

    // ---- the ground
    const g = c.ground;
    if (g === -2) { F.className = 'frame'; VGEGround.live(F, [{ t: 0, w1a: .04, w2a: .03, w3a: 0, drift: .4, aa: 0, la: .7, vig: .03 }]); }
    else if (g === -1) { F.className = 'frame bg-v1'; K.ground(F); }
    else if (g === 0) K.ground(F);
    else if (g === 1) {
      F.className = 'frame';
      VGEGround.live(F, [{ t: 0, w1a: .16, w2a: .1, w3a: .08, pDots: .8, ax: 1560, ay: 1180, vig: .08 },
        { t: 4.2, d: 1.4, r: 242, g: 241, b: 247, r2: 236, g2: 236, b2: 246, w1r: 90, w1g: 120, w1b: 255, w1a: .1, pDots: 0, pRings: .8, rx: 65, ry: 58, ax: 1840, ay: -120 }], { sweeps: [4.4], seed: 7 });
    } else {
      F.className = 'frame';
      VGEShader.layer(F, { effect: 'mesh', colors: ['#F4EEFB', '#E3CCFA', '#FCE2C6', '#D8E3FF'], keys: [{ t: 0, a: 1, i: 1, s: 1, v: .7 }, { t: 4.2, a: 0, d: 1.2, e: V.glide }] });
      VGEShader.layer(F, { effect: 'aurora', colors: ['#F6F3FA', '#D9BDF8', '#C3EBE0', '#FCDCC0'], keys: [{ t: 0, a: 0, i: .6, s: 1, v: 1 }, { t: 4.2, a: 1, d: 1.2, e: V.glide }] });
    }
    if (c.real >= 2) { // photo-led: a real place behind everything, under a light veil
      const bp = K.photo(F, { x: 0, y: 0, w: 1920, h: 1080, src: PH(PHOTO.warehouse) }); K.div(F, 'fill', 'background:linear-gradient(100deg, rgba(247,244,239,.9) 0%, rgba(247,244,239,.76) 42%, rgba(247,244,239,.52) 100%);'); // the text side stays readable
      V.on((t) => { bp.img.style.transform = `scale(${(1.04 + .05 * t / LOOP).toFixed(4)})`; });
    }
    const depth = K.div(F, 'fill'), world = K.div(F, 'fill', 'transform-origin:0 0;'), tl = K.div(F, 'fill');

    // ---- the camera, timed to the scene's beats (Base: a slow push, then the line leads and the camera follows)
    const cam = c.camera, lay = [{ el: depth, k: .8, ky: .8 }], next = dest ? dest - .4 : endA, hub = { x: CX - 960, y: CY - 540 };
    if (cam === -1) V.camera(world, [{ t: 0, x: 0, y: 0, s: 1 }, { t: 0, s: 1.03, d: OUT, ease: V.linear }]);
    else if (cam === 0) V.camera(world, [{ t: 0, x: 0, y: 0, s: 1 }, { t: 0, s: 1.025, d: 4.6, ease: V.linear }, ...(dest ? [{ t: 4.9, x: 200, d: 1.2 }] : [])], lay);
    else if (cam === 1) V.camera(world, [{ t: 0, x: 0, y: 0, s: 1 }, { t: gather - .5, ...hub, s: 1.5, d: 1.0 }, { t: next + .1, x: dest ? 200 : 0, y: 0, s: 1, d: 1.2 }], lay);
    else if (cam === 2) V.camera(world, [{ t: 0, x: 0, y: 0, s: 1 }, { t: gather - .7, ...hub, s: 3.2, d: 1.0 }, { t: gather + .3, x: dest ? 420 : 0, y: 0, s: dest ? .78 : .92, d: 1.7 }], lay);

    // ---- the depth field (far chips, parallax)
    if (g >= 0 && c.density >= 0) [[880, 250, 'package'], [1010, 960, 'boxes']].forEach(([x, y, ic], i) => {
      const ch = K.chip(depth, { x, y, ic, size: 's' }); ch.classList.add('far'); V.vis(ch, { tin: .6 + i * .3, tout: OUT, base: 'translate(-50%,-50%)', rise: 12, to: .6 });
    });

    // ---- the hub
    const sW = K.svg(world);
    V.draw(K.sv(sW, 'circle', { cx: CX, cy: CY, r: 184, fill: 'none', stroke: '#E2DCEA', 'stroke-width': 2 }), { t0: .3, dur: .9, ease: V.glide, tout: endA });
    const core = K.core(world, { cx: CX, cy: CY, label: 'Hub' });
    V.on((t) => {
      const p = V.seg(t, .4, din), a = V.glide(p), b = V.glide(V.seg(t, endA, .4)), op = a * (1 - b), pu = Math.sin(Math.PI * V.seg(t, gather + .2, .6));
      const s = (c.energy >= 1 ? .8 + .2 * BACK(p) : .92 + .08 * a) + .06 * pu;
      core.style.opacity = op.toFixed(3); core.style.visibility = op < .003 ? 'hidden' : 'visible';
      core.style.transform = `translateY(${(idle * Math.sin(t * 1.7)).toFixed(1)}px) scale(${s.toFixed(4)})`;
    });

    // ---- the four inputs, one per mention; their data travels in and gathers into the core
    const show = (el, t0, tout, o = {}) => {
      if (c.energy >= 1) V.on((t) => {
        const p = V.seg(t, t0, din), q = V.glide(V.seg(t, tout, .4)), op = Math.min(1, p * 2.5) * (1 - q);
        el.style.opacity = op.toFixed(3); el.style.visibility = op < .003 ? 'hidden' : 'visible';
        const s = p > 0 ? .9 + .1 * BACK(p) : .9, dx = -(1 - V.glide(p)) * (o.x ?? slide), dy = (o.y ?? 0) * (1 - V.glide(p)) + idle * Math.sin(t * 1.3 + t0 * 3) - q * 16;
        el.style.transform = `${o.base || ''} translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(4)})`;
      });
      else V.vis(el, { tin: t0, tout, din, x: -(o.x ?? slide), rise: o.y ?? 0, base: o.base || '' });
    };
    const INP = [['truck', 'Live shipment tracking', 'map-pin', .62, 'laptop', 'Live'], ['database', 'ERP systems', 'file-text', .48, 'desk', 'Synced'],
      ['warehouse', 'Warehouse inventories', 'boxes', .58, 'warehouse', 'Stocked'], ['network', 'Carrier networks', 'route', .45, 'city', 'Booked']];
    const outA = dest ? dest - .4 : endA; // once their data has gathered, the inputs leave as the line leads on
    const n = ty >= 2 || c.density <= -2 ? 0 : c.density === -1 ? 2 : 4, ys = n === 2 ? [448, 576] : [384, 512, 640, 768];
    for (let i = 0; i < n; i++) {
      const [ic, label, chipIc, rest, ph, status] = INP[i], y = ys[i], t0 = cardAt[i];
      const card = K.card(world, { x: 120, y, w: 544, ic, label }); show(card, t0, outA);
      if (c.real >= 1) { const p = K.photo(card, { x: 456, y: 16, w: 64, h: 64, src: PH(PHOTO[ph]) }); p.el.style.borderRadius = '12px'; }
      if (c.density >= 1) show(K.pill(world, { x: 700, y: y + 20, text: status, ic: 'check', kind: 'accent' }), t0 + .5, outA, { x: 0, y: 12 });
      const yy = y + 48, d = `M 664 ${yy} C 880 ${yy}, 960 ${(CY + (yy - CY) * .35).toFixed(0)}, ${CX - 128} ${(CY + (yy - CY) * .25).toFixed(0)}`;
      const p = K.path(sW, d, { stroke: '#D5CCE3', width: 2 }); V.draw(p, { t0: t0 + .2, dur: .8, ease: V.glide, tout: outA });
      const tc = t0 + .3, tr = Math.min(trav, gather - tc - .1);
      if (tr < .3) continue;
      const ch = K.chip(world, { x: 0, y: 0, ic: chipIc, size: i % 2 ? 's' : 'm' }), len = p.getTotalLength();
      V.on((t) => {
        const m = V.glide(V.seg(t, tc, tr)), gg = V.travel(V.seg(t, gather, .7)), q = p.getPointAtLength(len * rest * m);
        ch.style.left = V.mix(q.x, CX, gg).toFixed(1) + 'px'; ch.style.top = V.mix(q.y, CY, gg).toFixed(1) + 'px';
        const op = V.glide(V.seg(t, tc, .4)) * (1 - gg); ch.style.opacity = op.toFixed(3); ch.style.visibility = op < .002 ? 'hidden' : 'visible';
        ch.style.transform = `translate(-50%,-50%) scale(${V.mix(1, .4, gg).toFixed(3)})`;
      });
    }

    // ---- density +2: a chart and a photo inset join the frame
    if (c.density >= 2) {
      const cc = K.div(world, 'card', 'position:absolute;left:1500px;top:96px;width:340px;height:200px;'); show(cc, 3.2, endA, { x: 0, y: rise });
      const s = K.svg(cc, 340, 200); K.path(s, 'M 24 168 L 316 168', { stroke: '#E2DCEA', width: 2 });
      V.draw(K.path(s, 'M 24 156 C 90 150, 120 112, 170 118 S 262 62, 316 46', { stroke: '#A100FF', width: 5 }), { t0: 3.4, dur: .9, ease: V.glide });
      const pi = K.photo(world, { x: 1500, y: 760, w: 340, h: 200, src: PH(PHOTO.warehouse) }); pi.el.style.borderRadius = '16px'; show(pi.el, 3.7, endA, { x: 0, y: rise });
    }

    // ---- the destination: the line leads to the human moment (a planner approves); realism sets how real it is
    if (dest) {
      V.draw(K.path(sW, `M ${CX + 124} ${CY} C ${CX + 220} ${CY}, 1440 480, 1536 480`), { t0: dest - .5, dur: .6, ease: V.glide, tout: OUT });
      const r = c.real; let el, py = 660;
      if (r <= -2) { el = K.card(world, { x: 1540, y: 432, w: 330, ic: 'check', label: 'Recommendation' }); py = 560; }
      else if (r === -1) el = K.div(world, 'card', 'position:absolute;left:1560px;top:340px;width:280px;height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;',
        `<svg width="132" height="132" viewBox="0 0 132 132"><circle cx="66" cy="66" r="66" fill="#F2EAFD"/><circle cx="66" cy="52" r="22" fill="#A100FF" opacity=".85"/><path d="M26 112 C 32 84, 100 84, 106 112" fill="#A100FF" opacity=".85"/></svg><div class="t-label">Planner</div>`);
      else { const big = r >= 1; el = K.photo(world, { x: big ? 1520 : 1540, y: big ? 290 : 330, w: big ? 340 : 300, h: big ? 380 : 300, src: PH(r >= 2 ? PHOTO.woman : PHOTO.desk) }).el; el.style.borderRadius = '20px'; if (big) py = 700; }
      show(el, dest, OUT, { x: 0, y: rise });
      show(K.pill(world, { x: 1556, y: py, text: 'Approved', ic: 'check', kind: 'ok' }), dest + .7, OUT, { x: 0, y: 12 });
      if (cam >= 2) [['Plant A', 330], ['Plant B', 560]].forEach(([l, y], i) => show(K.card(world, { x: 1990, y, w: 380, ic: 'factory', label: l }), 4.9 + i * .2, OUT, { x: 0, y: rise }));
    }

    // ---- pace +1/+2: the scene swaps to the risk assessment, then (+2) to the result
    if (pc >= 1) {
      const b0 = endA + .3, bEnd = pc >= 2 ? 5.4 : OUT, rowsB = pc >= 2 ? [['Demand forecasts', 'Recalculated', 'refresh-cw', 'accent'], ['Affected orders', 'Flagged', 'flag', 'risk']] : [['Demand forecasts', 'Recalculated', 'refresh-cw', 'accent']];
      const rc = K.div(world, 'card kcard', `left:560px;top:320px;width:800px;height:${128 + rowsB.length * 88 + 24}px;`,
        `<div class="row"><div class="badge">${K.icon('scan-search')}</div><div class="title" style="font-size:40px;line-height:48px">Risk assessment</div></div>`);
      show(rc, b0, bEnd, { x: 0, y: rise });
      rowsB.forEach(([l, s, ic, kind], i) => {
        const rw = K.div(rc, '', `position:absolute;left:28px;right:28px;top:${128 + i * 88}px;height:64px;display:flex;align-items:center;justify-content:space-between;`, `<div class="t-label" style="font-size:32px">${l}</div>`);
        K.pill(rw, { x: 0, y: 0, text: s, ic, kind }).classList.add('inline'); show(rw, b0 + .6 + i * .6, bEnd, { x: 0, y: 12 });
      });
      if (pc >= 2) {
        const cc = K.div(world, '', 'position:absolute;left:0;width:1920px;top:340px;text-align:center;');
        const num = K.div(cc, 't-display', 'font-size:220px;line-height:1;color:#A100FF;'); V.count(num, { t0: 5.7, dur: .8, from: 0, to: 12, fmt: (v) => Math.round(v) + '%' }); show(num, 5.7, OUT, { x: 0, y: rise });
        show(K.div(cc, 't-sub', 'margin-top:28px;', 'lower projected costs'), 6.1, OUT, { x: 0, y: 12 });
      }
    }

    // ---- the words
    const KT = VGEText.KT;
    if (ty <= -2) show(K.div(world, 't-label', `position:absolute;left:${CX - 300}px;width:600px;top:${CY + 150}px;text-align:center;font-size:36px;font-weight:600;color:#5E5868;`, 'One ecosystem'), kwAt, endA, { x: 0, y: 12 });
    else if (ty >= 2) KT(tl, { x: 120, y: 200, w: 1160, align: 'left' }, [{ t: 'One', role: 'display', at: .2, mode: 'letters' }, { t: '*intelligent*', role: 'display', at: .7, mode: 'mask', kwAt }, { t: 'ecosystem.', role: 'display', at: 1.3, mode: 'words' }], { tout: endA });
    else if (ty === 1) KT(tl, 'TL', [{ t: 'One *intelligent* ecosystem', role: 'state', at: .3, mode: 'words', kwAt, din }, { t: 'Tracking, ERP, inventory and carriers, connected', role: 'sub', at: 1.0, gap: 16, din }], { tout: endA });
    else if (c.energy >= 1) KT(tl, 'TL', [{ t: 'One *intelligent* ecosystem', at: .3, mode: c.energy >= 2 ? 'words' : 'mask', kwAt, din }], { tout: endA });
    else {
      const lines = ty === -1 ? [['One ecosystem', .3]] : pc >= 1 ? [['One *intelligent*', .2], ['ecosystem', .6]] : [['One *intelligent* ecosystem', .3]];
      if (c.density >= 1) lines.push(['Tracking, ERP, inventory and carriers', 1.0, 'sub']);
      const b = K.div(tl, 'T2');
      lines.forEach(([txt, at, role]) => {
        const el = K.div(b, 't-' + (role || 'head'), role ? 'margin-top:16px;' : ''); el.innerHTML = txt.replace(/\*(.+?)\*/g, '<span class="kw">$1</span>');
        V.vis(el, { tin: at, tout: endA, din, rise }); el.querySelectorAll('.kw').forEach((k) => V.keyword(k, kwAt));
      });
    }

    // ---- sound: which moves make a sound, and the music under it (heard on click; drawn as a lane)
    const sd = c.sound, CLICK = 'sfx/camera/click-camera', SPARK = 'sfx/light/sparkle-touch', LOCK = 'sfx/mech/lock-digital', WHOOSH = 'sfx/impact/impact-deep-whoosh';
    const sfx = sd <= -2 ? [[.3, WHOOSH], [6.0, LOCK]] : sd === -1 ? [[.9, CLICK], [4.4, SPARK], [6.0, LOCK]] : [[.9, CLICK], [1.6, CLICK], [2.3, CLICK], [3.0, CLICK],
      ...(sd >= 1 ? [[4.4, SPARK], [6.0, LOCK]] : []), ...(sd >= 2 ? [[3.7, 'sfx/impact/impact-zoom-quick'], [4.5, 'sfx/impact/hit-weak'], [4.9, WHOOSH]] : [])].sort((a, b) => a[0] - b[0]);
    const music = [['music/uplifting-inspiring', .5], ['music/uplifting-inspiring', .4], ['music/uplifting-inspiring', .36], ['music/uplifting-inspiring', .36], ['music/bgm-tech-house', .5]][sd + 2];
    if (soundRow) {
      const lane = K.div(tl, 'lane'), hp = K.div(lane, 'head-p'), lv = K.div(tl, 'lvl');
      for (let i = 0; i < 5; i++) K.div(lv, i <= sd + 2 ? 'b on' : 'b', `height:${14 + i * 9}px;`); // the music level
      K.div(lv, '', '', `<span>${sfx.length} effects</span>`);
      const ticks = sfx.map(([tt]) => K.div(lane, 'tick', `left:${(tt / LOOP * 100).toFixed(2)}%;`));
      V.on((t) => {
        hp.style.left = (t / LOOP * 100).toFixed(2) + '%';
        ticks.forEach((k, i) => { const p = V.seg(t, sfx[i][0], .5); k.style.transform = `scale(${(p > 0 && p < 1 ? 1 + .6 * Math.sin(Math.PI * p) : .55).toFixed(3)})`; k.style.opacity = p > 0 ? 1 : .45; });
      });
    }
    return { sfx, music };
  }

  // ---- in a browser: loop at 30 fps while visible, and play a sound cell on click
  let t0 = performance.now(), lastT = 0, playing = null, track = null;
  function listen(cell) {
    if (track) { track.pause(); track = null; } if (playing) playing.box.classList.remove('listening');
    if (!cell || playing === cell) { playing = null; return; }
    playing = cell; cell.box.classList.add('listening'); t0 = performance.now(); lastT = 0;
    track = new Audio(SND(cell.music[0])); track.volume = cell.music[1]; track.loop = true; track.play().catch(() => {});
  }
  cells.forEach((cell) => { if (cell.d.id === 'sound') { cell.box.style.cursor = 'pointer'; cell.box.onclick = () => listen(cell); } });
  addEventListener('message', (m) => {
    if (!m.data) return;
    if ('listen' in m.data) listen(single ? (playing ? null : cells[0]) : cells.find((c) => c.v === m.data.listen && c.d.id === 'sound'));
    if (m.data.restart) { t0 = performance.now(); lastT = 0; }
  });
  V.ready().then(() => {
    if (navigator.webdriver) return; // the renderer drives the clock
    let visible = true, last = 0;
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(root);
    const tick = (now) => {
      requestAnimationFrame(tick);
      if (!visible || document.hidden || now - last < 33) return; last = now;
      const t = ((now - t0) / 1000) % LOOP; window.render(t);
      if (playing) for (const [tt, f] of playing.sfx) if ((lastT < tt && t >= tt) || (t < lastT && tt <= t)) { const a = new Audio(SND(f)); a.volume = .55; a.play().catch(() => {}); }
      lastT = t;
    };
    requestAnimationFrame(tick);
  });
})();
