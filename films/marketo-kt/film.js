// Marketo KT: automated audience segmentation, a screen walkthrough. The owner's script and voiceover (the script
// used for the 3:30 take); the screens are the owner's captures (raw/, git-ignored). One set of helpers drives every
// step: screen swaps, camera, highlight (one at a time), cursor, learning cards. The screen leads the voice by LEAD s,
// and while a learning card is up nothing moves (checked into window.QA). Rects are screenshot pixels (1918 wide).
(function () {
  const V = VGE, K = VGEKit, KT = VGEText.KT, TM = window.TIMING, F = document.getElementById('frame');
  const seg = Object.fromEntries(TM.segments.map((s) => [s.id, s])), ids = TM.segments.map((s) => s.id);
  const L = (id, i = 0) => seg[id].lines[i].t0, E = (id, i = 0) => seg[id].lines[i].t1, S1 = (id) => seg[id].t1;
  const LT = (id, i, f) => L(id, i) + (E(id, i) - L(id, i)) * f;   // a point inside a long line
  window.DUR = TM.dur;
  window.VO = { file: 'films/marketo-kt/vo.mp3', at: 0, lufs: -16 };
  window.MUSIC = [{ file: 'library/audio/music/uplifting-inspiring.mp3', from: 0, at: 0, until: TM.dur, fadeIn: 1.5, fadeOut: 2.5, lufs: -34 }];
  const A = 'library/audio/sfx/', CLICK = A + 'camera/click-camera.mp3', POP = A + 'light/sparkle-touch.mp3', WHOOSH = A + 'impact/impact-deep-whoosh.mp3';

  // ---- ground: a living ground that changes per act (intro: dots · concepts: rings · build: a quiet grid · close: light)
  VGEGround.live(F, [
    { t: 0, r: 246, g: 244, b: 250, r2: 238, g2: 236, b2: 246, ang: 165, lx: 80, ly: 0, la: .9, w1r: 161, w1g: 0, w1b: 255, w1a: .08, w1x: 12, w1y: 85,
      w2r: 90, w2g: 120, w2b: 255, w2a: .07, w2x: 88, w2y: 16, w3a: .05, ax: 1700, ay: 1200, as: 1300, aa: .7, ar: 161, ag: 0, ab: 255, pr: 161, pg: 0, pb: 255, pDots: .4, vig: .05 },
    { t: L('s04'), d: 1.4, pDots: 0, pRings: .55, rx: 50, ry: 50, w1a: .1, ax: 220, ay: -160 },
    { t: L('s10'), d: 1.4, pRings: 0, pGrid: .4, w1a: .05, w2a: .05, ax: 1760, ay: 1220, la: .95 },
    { t: L('s24'), d: 1.4, pGrid: 0, pRays: .5, rx: 50, ry: 46, w1a: .1 },
  ], { sweeps: [L('s02'), L('s04'), L('s10'), L('s24')], seed: 21 });
  [L('s04'), L('s10'), L('s24')].forEach((t) => V.sfx(t, WHOOSH, -30));

  // ---- the screen: a framed capture in a world the camera moves; headers, cards and captions sit on top
  const world = K.div(F, ''); world.id = 'world';
  const FX = 174, FY = 186, KS = .82, FW = Math.round(1918 * KS), FH = Math.round(830 * KS);
  const frame = K.div(world, 'shotframe', `left:${FX}px;top:${FY}px;width:${FW}px;height:${FH}px;`);
  const shots = K.div(frame, 'shots', `transform:scale(${KS});`), imgs = K.div(shots, 'fill'), typing = K.div(shots, 'fill'), over = K.div(shots, 'fill');
  const scr = K.div(F, 'fill'), svgS = K.svg(scr), LS = K.svg(scr);
  const ON = [L('s11') - .6, L('s24') + .3];
  V.on((t) => { const p = V.glide(V.seg(t, ON[0], .7)), q = V.glide(V.seg(t, ON[1], .6)), op = t >= ON[0] ? p * (1 - q) : 0;
    frame.style.opacity = op.toFixed(3); frame.style.visibility = op < .003 ? 'hidden' : 'visible'; frame.style.transform = `translateY(${((1 - p) * 60 + q * 40).toFixed(1)}px)`; });

  const plan = [], ck = [{ t: 0, x: 0, y: 0, s: 1 }], cks = [], cards = [], cardsWin = [], RG = [];
  const LEAD = .9; // the screen leads the voice; never inside a learning card's still window (it waits for the card)
  const early = (t) => { let u = t - LEAD; for (const [a, b] of cardsWin) if (u > a - .05 && u < b) u = b; return u; };
  const shot = (n, t, dir = 'raw/') => plan.push({ n, t: early(t), src: dir + n + '.png' });
  const ring0 = (r, tin, tout) => { // one highlight at a time: each ends where the next begins (set at the end)
    const o = { r, tin, tout, e: K.div(over, 'hl', `left:${r[0] - 4}px;top:${r[1] - 4}px;width:${r[2] + 8}px;height:${r[3] + 8}px;`) }; RG.push(o);
    V.on((t) => { const a = V.glide(V.seg(t, o.tin, .3)), op = a * (1 - V.glide(V.seg(t, o.tout, .25))); o.e.style.opacity = op.toFixed(3); o.e.style.visibility = op < .003 ? 'hidden' : 'visible'; o.e.style.transform = `scale(${(1.04 - .04 * a).toFixed(4)})`; });
    return o;
  };
  const ring = (r, tin, tout) => ring0(r, early(tin), early(tout) + LEAD * .5);
  const wx = (x) => FX + x * KS, wy = (y) => FY + y * KS;
  const cam = (t, r, z = 1, d = .9) => { // bring rect r to the centre at zoom z, kept inside the frame
    let cx = r ? wx(r[0] + r[2] / 2) : FX + FW / 2, cy = r ? wy(r[1] + r[3] / 2) : FY + FH / 2; const hx = 960 / z, hy = 540 / z;
    cx = FW > 2 * hx ? Math.min(FX + FW - hx, Math.max(FX + hx, cx)) : FX + FW / 2; cy = FH > 2 * hy ? Math.min(FY + FH - hy, Math.max(FY + hy, cy)) : FY + FH / 2;
    ck.push({ t: early(t), x: cx - 960, y: cy - 540, s: z, d, ease: V.travel });
  };
  const cur = (t, p, click = false, d = .7) => { // arrives at p at t; after a click the cursor rests 1 s before moving
    t = early(t); const last = cks[cks.length - 1]; if (last && last.click && t - d < last.t + 1) t = last.t + 1 + d;
    for (const [a, b] of cardsWin) if (t - d > a - .05 && t - d < b) t = b + d;
    cks.push({ t, x: p[0], y: p[1], d, click }); if (click) V.sfx(t, CLICK, -26); return t + LEAD;
  };
  const mid = (r) => [r[0] + r[2] / 2, r[1] + r[3] / 2];
  const click = (t, r, next, d = .7) => { const tl = cur(t, mid(r), true, d); if (next) plan.push({ n: next, t: tl - LEAD + .25, src: 'raw/' + next + '.png' }); return tl; };
  const reveal = (src, r, t0, dur, tEnd) => { // a typed field: the next capture's pixels, uncovered left to right
    t0 = early(t0); tEnd = early(tEnd); const im = document.createElement('img'); im.src = src; im.style.cssText = 'position:absolute;left:0;top:0;width:1918px;'; typing.appendChild(im);
    V.on((t) => { const p = V.linear(V.seg(t, t0, dur)), on = t >= t0 && t < tEnd; im.style.visibility = on ? 'visible' : 'hidden'; im.style.clipPath = `inset(${r[1]}px ${(1918 - r[0] - r[2] * p).toFixed(1)}px ${831 - r[1] - r[3]}px ${r[0]}px)`; });
  };
  const hdr = (n, title, tin, tout) => { const dots = [...Array(8)].map((_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
    V.vis(K.div(scr, 'hdr', '', `<span class="no">STEP ${n} <b>OF 8</b></span><span class="dots">${dots}</span><span class="tt pj">${title}</span>`), { tin: early(tin), tout: early(tout), x: -30, rise: 0, din: .45 }); };
  const card = (n, sid, text, anchors, o = {}) => { cards.push({ n, sid, text, anchors, ...o }); const k = ids.indexOf(sid); cardsWin.push([L(sid) - .1, (k + 1 < ids.length ? L(ids[k + 1]) : TM.dur) - .5 + .45]); };
  const pop = (el, tin, tout, d = .5) => V.on((t) => { const p = V.seg(t, tin, d), q = V.glide(V.seg(t, tout, .35)), op = Math.min(1, p * 3) * (1 - q), b = p > 0 ? 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2) : 0;
    el.style.opacity = op.toFixed(3); el.style.visibility = op < .003 ? 'hidden' : 'visible'; el.style.transform = `scale(${(.5 + .5 * b).toFixed(4)})`; });

  // ================= intro (s01-s03): the real screens fan in around the title; the outcomes build; the setup
  const outFan = L('s02') - .1;
  [['Database_Tab', -600, -262, -8], ['Smart_List_Filters', 600, -270, 7], ['KT_Campaign_View', -610, 268, 6], ['Campaign_Result', 610, 262, -7]].forEach(([n, dx, dy, rot], i) => {
    const c = K.div(scr, 'fancard', `left:680px;top:419px;background-image:url(raw/${n}.png);`), tin = .15 + i * .22;
    V.on((t) => { const p = V.glide(V.seg(t, tin, 1.1)), q = V.travel(V.seg(t, outFan, .9)), dr = 7 * Math.sin(t * .7 + i * 1.7);
      c.style.transform = `translate(${(dx * p + dx * .45 * q).toFixed(1)}px, ${(dy * p + dr + dy * .3 * q).toFixed(1)}px) rotate(${(rot * p).toFixed(2)}deg) scale(${(.6 + .4 * p).toFixed(4)})`;
      const op = Math.min(1, p * 1.6) * (1 - q); c.style.opacity = op.toFixed(3); c.style.visibility = op < .003 ? 'hidden' : 'visible'; });
  });
  V.vis(K.div(scr, 'titlecard', 'left:510px;top:375px;width:900px;height:330px;'), { tin: .5, tout: outFan, din: .7, scaleFrom: .94, rise: 0 });
  KT(scr, 'Cw', [{ t: 'Hello, and welcome.', role: 'sub', at: L('s01'), mode: 'rise' }, { t: 'Automatically segment an audience', role: 'head', at: L('s01', 1) + .3, mode: 'words', gap: 14 },
    { t: 'in *Marketo Engage*', role: 'head', at: L('s01', 1) + 1.4, mode: 'words', kwAt: L('s01', 1) + 2.0 }], { tout: outFan - .1, out: 'lift' });
  // the three outcomes, each with its own small picture
  const out02 = L('s03') - .2;
  V.vis(K.div(scr, 't-label', 'position:absolute;left:0;width:1920px;top:240px;text-align:center;font-size:32px;color:#5E5868;letter-spacing:.04em;', 'By the end, we will know'), { tin: L('s02') + .1, tout: out02 });
  const oc = (i, art, label, tin) => V.vis(K.div(scr, 'tile', `left:${180 + i * 540}px;top:320px;width:480px;height:390px;`, `<div class="oc-art">${art}</div><div class="oc-t">${label}</div>`), { tin, tout: out02, rise: 40, din: .6, scaleFrom: .95 });
  oc(0, `<svg viewBox="0 0 400 200" width="400" height="200"><path d="M60 40 H220 L160 115 V170 H120 V115 Z" fill="#F2EAFD" stroke="#A100FF" stroke-width="6" stroke-linejoin="round"/><path d="M262 82 V170 H362 V82 M262 82 L282 60 M362 82 L342 60" fill="none" stroke="#1A1323" stroke-width="6" stroke-linecap="round"/><circle cx="295" cy="140" r="12" fill="#A100FF"/><circle cx="330" cy="140" r="12" fill="#A100FF"/></svg>`, 'a Smart List and a Static List', LT('s02', 0, .5));
  oc(1, `<svg viewBox="0 0 400 200" width="400" height="200"><rect x="40" y="70" width="110" height="70" rx="14" fill="#F2EAFD" stroke="#A100FF" stroke-width="5"/>${[40, 105, 170].map((y) => `<path d="M150 105 C 200 105, 210 ${y}, 250 ${y}" fill="none" stroke="#A100FF" stroke-width="4"/><rect x="250" y="${y - 18}" width="110" height="36" rx="10" fill="#fff" stroke="#D5CCE3" stroke-width="3"/>`).join('')}</svg>`, 'how a campaign reuses a shared list', L('s02', 1));
  oc(2, `<div class="pj" style="font-size:96px;font-weight:700;color:#1A1323;display:flex;align-items:center;gap:22px"><span id="c586">586</span><span style="font-size:60px;color:#A100FF">→</span><span id="c216" style="color:#A100FF">216</span></div>`, 'check with real numbers', L('s02', 2));
  V.count(document.getElementById('c586'), { t0: L('s02', 2) + .2, dur: .9, to: 586 }); V.count(document.getElementById('c216'), { t0: L('s02', 2) + .8, dur: .9, to: 216 });
  // the setup: Marketo and some test people; no email is sent
  const out03 = L('s04') - .2, T3 = L('s03');
  V.vis(K.div(scr, 'fancard', 'left:150px;top:290px;width:840px;height:362px;background-image:url(raw/redacted/Dashboard.png);'), { tin: T3 - .1, tout: out03, x: -60, rise: 0, din: .6 });
  [0, 1, 2, 3, 4, 5].forEach((i) => pop(K.div(scr, 'avatar', `left:${200 + i * 96}px;top:700px;`, K.icon('users', 30)), LT('s03', 0, .65) + i * .1, out03));
  const env = K.div(scr, 'tile', 'left:1170px;top:290px;width:600px;height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;',
    `<div style="position:relative;color:#A100FF">${K.icon('mail', 150)}<svg width="170" height="170" viewBox="0 0 170 170" style="position:absolute;left:-10px;top:-10px"><path class="slash" d="M20 150 L150 20" stroke="#E5484D" stroke-width="12" stroke-linecap="round" fill="none"/></svg></div><div class="oc-t">No email is sent</div><div class="t-sub">nothing reaches a real inbox</div>`);
  V.vis(env, { tin: L('s03', 1) - .1, tout: out03, rise: 30 }); V.draw(env.querySelector('.slash'), { t0: L('s03', 1) + .4, dur: .45, ease: V.glide });

  // ================= concepts (s04-s10), drawn
  KT(scr, 'C', [{ t: 'First, the *ideas*.', role: 'state', at: L('s04'), mode: 'words', kwAt: L('s04', 1) }], { tout: S1('s04') - .1, out: 'blur' });
  const sv = K.sv, G = K.svg(scr), T05 = (i) => L('s05', i), out05 = L('s07') - .3;
  V.draw(sv(G, 'path', { d: 'M 400 340 L 720 340 L 600 520 L 600 600 L 520 600 L 520 520 Z', fill: '#F2EAFD', stroke: '#A100FF', 'stroke-width': 5, 'stroke-linejoin': 'round' }), { t0: T05(0), dur: .9, ease: V.glide, tout: out05 });
  [[440, 380, 230], [480, 420, 150], [510, 460, 90]].forEach(([x, y, w], i) => V.vis(sv(G, 'rect', { x, y, width: w, height: 16, rx: 8, fill: '#A100FF', opacity: .55 }), { tin: T05(1) + i * .15, tout: out05, rise: 10 }));
  const lab = (x, top, title, sub, tin, tout) => V.vis(K.div(scr, '', `position:absolute;left:${x - 300}px;width:600px;top:${top}px;text-align:center;`, `<div class="t-head">${title}</div><div class="t-sub" style="margin-top:6px">${sub}</div>`), { tin, tout, din: .6 });
  lab(560, 640, 'Smart List', 'rules, not people', T05(0) + .3, out05);
  V.draw(sv(G, 'path', { d: 'M 1200 400 L 1200 600 L 1520 600 L 1520 400 M 1200 400 L 1250 350 M 1520 400 L 1470 350', fill: 'none', stroke: '#1A1323', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), { t0: T05(3), dur: .8, ease: V.glide, tout: out05 });
  lab(1360, 640, 'Static List', 'People are placed in it', T05(3) + .2, out05);
  [1250, 1310, 1370, 1430].forEach((x, i) => { const p = K.div(scr, 'avatar', `left:${x}px;top:516px;width:48px;height:48px;`, K.icon('users', 24)), tin = T05(4) + i * .2;
    V.on((t) => { const p0 = V.seg(t, tin, .5), b = V.glide(p0), q = V.glide(V.seg(t, out05, .4)), op = Math.min(1, p0 * 3) * (1 - q); p.style.opacity = op.toFixed(3); p.style.visibility = op < .003 ? 'hidden' : 'visible'; p.style.transform = `translateY(${(-(1 - b) * 220).toFixed(1)}px)`; }); });
  card(1, 's06', 'A Smart List stores rules. A Static List stores people.', [[410, 640, 300, 84], [1210, 640, 300, 84]], { screen: true, at: [610, 92] });
  const T07 = (i) => L('s07', i), out07 = L('s08') - .2;
  [['Who', 'the Smart List', 'users'], ['What', 'the Flow', 'route'], ['When', 'the Schedule', 'clock'], ['Wow', 'the Results', 'trending-up']].forEach(([w, s, ic], i) => {
    V.vis(K.div(scr, 'tile', `left:${150 + i * 420}px;top:300px;width:360px;height:300px;padding:34px 30px;`, `<div style="color:#A100FF">${K.icon(ic, 56)}</div><div class="t-state pj" style="margin-top:18px;color:#1A1323">${w}</div><div class="t-sub" style="margin-top:4px">${s}</div>`),
      { tin: T07(1 + i) - .1, tout: out07, rise: 40, din: .55, scaleFrom: .96 });
  });
  V.vis(K.div(scr, 'tile', 'left:560px;top:670px;padding:18px 30px;display:flex;align-items:center;gap:18px;font-size:34px;font-weight:600;', `<span style="color:#A100FF">${K.icon('zap', 40)}</span><span>batch, which runs when we tell it to</span>`), { tin: T07(5), tout: out07, rise: 20 });
  const t8 = L('s08'), d8 = E('s08') - t8, out08 = L('s10') - .3;
  [220, 400, 580].forEach((y, i) => {
    V.vis(K.div(scr, 'tile', `left:1180px;top:${y}px;width:440px;height:130px;padding:30px;display:flex;align-items:center;gap:20px;`, `<span style="color:#A100FF">${K.icon('mail', 44)}</span><span class="t-head" style="font-size:48px">Campaign</span>`), { tin: t8 + .2 + i * .2, tout: out08, x: 40, rise: 0 });
    const p = K.path(LS, `M 1180 ${y + 65} C 960 ${y + 65}, 940 495, 724 495`, { stroke: '#A100FF', width: 4 }); V.draw(p, { t0: t8 + d8 * .6 + i * .15, dur: .6, ease: V.glide, tout: out08 });
    const dot = K.sv(LS, 'circle', { r: 9, fill: '#A100FF' }), len = p.getTotalLength();
    V.on((t) => { const q = V.seg(t, t8 + d8 * .75 + i * .2, 1.1), pt = p.getPointAtLength(len * (1 - V.travel(q))); dot.setAttribute('cx', pt.x.toFixed(1)); dot.setAttribute('cy', pt.y.toFixed(1)); dot.style.opacity = q > 0 && q < 1 ? 1 : 0; });
  });
  V.vis(K.div(scr, 'tile', 'left:260px;top:360px;width:460px;height:270px;padding:34px;', `<div style="color:#A100FF">${K.icon('layers', 56)}</div><div class="t-head pj" style="margin-top:16px;font-size:52px">Member of Smart List</div><div class="t-sub" style="margin-top:6px">an existing Smart List</div>`), { tin: t8 + d8 * .45, tout: out08, rise: 30 });
  card(2, 's09', 'Change the master list, and every campaign that uses it changes with it.', [[260, 360, 460, 270]], { screen: true, at: [160, 668] });
  KT(scr, 'C', [{ t: "Now, let's *build* it.", role: 'state', at: L('s10'), mode: 'words', kwAt: L('s10', 1) }], { tout: L('s10', 1) + .75, out: 'lift' });

  // ================= the build (s11-s23) on the captures: 8 steps, as the voice counts them
  const tree = [0, 60, 560, 500];
  shot('Dashboard', L('s11') - .2, 'raw/redacted/');
  // step one · the shared list, its count, and what uses it
  hdr(1, 'In the Database tab', L('s11'), L('s13') - .2);
  let tc = click(LT('s11', 1, .12), [588, 8, 62, 30], 'Database_Tab');
  cam(LT('s11', 1, .3), tree, 1.6); tc = click(LT('s11', 1, .5), [112, 258, 136, 22], 'Database_Group_Smart_Lists_Dropdown');
  click(LT('s11', 1, .85), [140, 429, 170, 26], 'Database_People_Audit_Smart_List');
  cam(L('s11', 2) - .4, [960, 528, 220, 22], 1.6); ring([965, 528, 215, 22], L('s11', 2), L('s11', 3));
  cam(L('s11', 4) - .5, [992, 296, 100, 38], 1.3); ring([992, 296, 100, 38], L('s11', 4), L('s13') - .3); cur(L('s11', 4) + .5, [1041, 318]);
  card(3, 's12', 'Open Used By before you edit or delete a shared list.', [[992, 296, 100, 38]]);
  // step two · the one rule, and the baseline
  hdr(2, 'Its one rule', L('s13'), L('s15') - .2);
  cam(L('s13') + .05, null, 1); click(L('s13', 1) - .2, [868, 62, 78, 30], 'Smart_List_Filters');
  cam(L('s13', 1) + .4, [572, 183, 1016, 140], 1.45); ring([572, 183, 1016, 30], L('s13', 1) + .6, L('s13', 2)); ring([1155, 265, 350, 28], L('s13', 2), L('s13', 4));
  cam(L('s13', 4) - .3, null, 1); click(L('s13', 4) + .4, [775, 62, 60, 30], 'Smart_List_People');
  cam(L('s13', 5) - .6, [1700, 798, 200, 26], 1.2); ring([1700, 798, 200, 26], L('s13', 5), L('s15') - .3);
  card(4, 's14', 'Every later number needs a filter that explains it.', [[1700, 798, 200, 26]]);
  // step three · a new Smart Campaign, and its before state
  hdr(3, 'In Marketing Activities', L('s15'), L('s16') - .2);
  cam(L('s15') + .05, null, 1); tc = click(L('s15', 1) + .3, [330, 8, 128, 30], 'Marketing_Activities_Tab');
  cam(tc + .2, tree, 1.6); shot('Marketing_Activities_Folders', tc + .6); // the tree opens
  click(L('s15', 2) + .5, [150, 226, 110, 22], 'Create_new_campaign', .6);
  tc = click(L('s15', 3) + .4, [118, 240, 168, 22], 'New_Smart_Campaign', .5);
  cam(tc + .3, [926, 238, 602, 409], 1.35);
  const tN = Math.max(tc + .5, L('s15', 4)); // the name and description type in, then CREATE
  reveal('raw/Naming_the_Campaign.png', [1122, 365, 330, 20], tN, .6, tN + 1.7); reveal('raw/Naming_the_Campaign.png', [1122, 399, 330, 84], tN + .65, .9, tN + 1.7);
  shot('Naming_the_Campaign', tN + 1.6); tc = click(tN + 2.2, [1440, 610, 56, 22], 'KT_Campaign_View', .5);
  cam(Math.max(tc + .3, L('s15', 5) - .5), [910, 470, 600, 240], 1.5);
  ring([925, 492, 185, 26], L('s15', 5), L('s15', 6)); ring([920, 562, 140, 60], L('s15', 6), L('s15', 7)); ring([920, 632, 140, 58], L('s15', 7), L('s15', 8));
  ring([915, 486, 200, 210], L('s15', 8), L('s16') - .3);
  // step four · two filters
  hdr(4, 'In the Smart List tab', L('s16'), L('s18') - .2);
  cam(L('s16') + .05, null, 1); click(L('s16', 1) + .2, [705, 66, 80, 26], 'Smart_List_addes_to_campaign');
  ring([1600, 198, 318, 132], LT('s16', 2, .1), LT('s16', 2, .6)); tc = cur(LT('s16', 2, .3), [1700, 316], true); cur(tc + 1.9, [1000, 232], true, .9);
  ring([572, 187, 1016, 28], tc + 2.0, L('s16', 3) + .3);
  shot('Person_Attribute', L('s16', 3) + .1); cam(L('s16', 3) + .3, [572, 150, 1016, 230], 1.4);
  ring([572, 304, 1016, 66], L('s16', 4), L('s16', 5)); ring([566, 150, 116, 22], L('s16', 5), L('s18') - .3);
  card(5, 's17', 'Use ALL filters means AND.', [[566, 150, 116, 22]]);
  // step five · one flow step
  hdr(5, 'In the Flow tab', L('s18'), L('s20') - .2);
  cam(L('s18') + .05, null, 1); click(L('s18', 1) + .3, [810, 66, 56, 30], 'Flow_step');
  cam(L('s18', 3) - .5, [572, 189, 1016, 140], 1.4); ring([572, 189, 1016, 28], L('s18', 3), L('s18', 4)); ring([692, 272, 788, 26], L('s18', 4), L('s20') - .3);
  card(6, 's19', 'Create the Static List first. The Flow can only select a list that already exists.', [[692, 272, 788, 26]]);
  // step six · the schedule and its estimate
  hdr(6, 'On the Schedule tab', L('s20'), L('s22') - .2);
  cam(L('s20') + .05, null, 1); click(L('s20', 1) + .3, [888, 66, 84, 30], 'Schedule_Tab');
  cam(L('s20', 2) - .3, [580, 300, 620, 280], 1.4); ring([582, 345, 220, 24], L('s20', 2), L('s20', 3)); ring([870, 385, 146, 24], L('s20', 3), L('s20', 5));
  ring([592, 505, 450, 50], L('s20', 5), L('s22') - .3);
  card(7, 's21', 'An empty or incomplete filter blocks the run. Fix every empty value first.', [[592, 505, 450, 50]]);
  // step seven · run once
  hdr(7, 'We click Run Once', L('s22'), L('s23') - .2);
  cam(L('s22') + .05, null, 1); tc = click(L('s22', 1) + .2, [800, 112, 92, 22], 'Run_now', .5);
  cam(tc + .2, [926, 314, 604, 260], 1.5); click(L('s22', 2) + .3, [1452, 540, 60, 22], null, .5);
  // step eight · the result
  hdr(8, 'In Results', L('s23'), L('s24') - .2);
  cam(L('s23') + .1, null, 1); shot('Schedule_Tab', L('s23') + .1); click(L('s23', 1) + .3, [995, 66, 72, 30], 'Campaign_Result');
  ring([790, 186, 670, 612], LT('s23', 2, .2), L('s23', 3) - .2); cam(L('s23', 3) - .7, [1765, 798, 130, 24], 1.2); ring([1765, 798, 130, 24], L('s23', 3) + .1, L('s24') + .2);

  // ================= the close (s24-s26): the counts, then thanks
  const T24 = (i) => L('s24', i), out24 = L('s26') - .3;
  [[400, 586, 'people in the database'], [960, 216, 'passed both filters'], [1520, 216, 'rows']].forEach(([x, n, l], i) => {
    const b = K.div(scr, '', `position:absolute;left:${x - 260}px;width:520px;top:340px;text-align:center;`);
    const num = K.div(b, 'big pj', i ? 'color:#A100FF' : ''); V.count(num, { t0: T24(i), dur: .9, from: 0, to: n }); V.vis(b, { tin: T24(i) - .1, tout: out24, rise: 30 });
    const lb = K.div(b, 't-sub', 'margin-top:14px;font-size:38px;'); lb.textContent = l; V.vis(lb, { tin: T24(i) + .3, tout: out24 });
    pop(K.div(scr, 'avatar', `left:${x - 30}px;top:640px;width:60px;height:60px;background:#1E9E6A;`, K.icon('check', 32)), T24(3) + i * .2, out24);
    if (i < 2) V.draw(K.path(LS, `M ${x + 200} 440 L ${x + 360} 440`, { stroke: '#D5CCE3', width: 5 }), { t0: T24(i + 1) - .3, dur: .4, ease: V.glide, tout: out24 });
  });
  card(8, 's25', 'If a count differs, find the filter or the step that explains it.', [[140, 330, 1640, 380]], { screen: true, at: [610, 64] });
  KT(scr, 'C', [{ t: 'Thank you for watching.', role: 'state', at: L('s26'), mode: 'words' }, { t: 'automatically segment an audience in *Marketo Engage*', role: 'sub', at: L('s26') + .6, gap: 20, kwAt: L('s26') + 1.0 }], { tout: TM.dur - .6 });

  // ---- assemble: screens, camera, cursor
  plan.sort((a, b) => a.t - b.t).forEach((p, i) => {
    const im = document.createElement('img'); im.src = p.src; imgs.appendChild(im); const tOut = i + 1 < plan.length ? plan[i + 1].t + .4 : Infinity;
    V.on((t) => { const on = t >= p.t && t < tOut; im.style.opacity = on ? V.glide(V.seg(t, p.t, .35)).toFixed(3) : 0; im.style.visibility = on ? 'visible' : 'hidden'; });
  });
  ck.sort((a, b) => a.t - b.t); const at = V.camera(world, ck);
  cks.sort((a, b) => a.t - b.t); VGEScreen.cursor(over, [{ t: ON[0] + .3, x: 1300, y: 640 }, ...cks], { t0: ON[0] + .4, tout: L('s24') });

  // ---- learning cards: placed once the camera is known, beside their anchor (never over it), with a connector
  const QA = [];
  cards.forEach((c) => {
    const k = ids.indexOf(c.sid), tin = L(c.sid), tout = (k + 1 < ids.length ? L(ids[k + 1]) : TM.dur) - .5, v = at(tin + .01);
    const toS = (r) => c.screen ? r : [(wx(r[0]) - (v.x + 960)) * v.s + 960, (wy(r[1]) - (v.y + 540)) * v.s + 540, r[2] * KS * v.s, r[3] * KS * v.s];
    const As = c.anchors.map(toS), W = 700, H = 26 + 46 + 18 + Math.ceil(c.text.length / 31) * 50 + 30;
    let x, y;
    if (c.at) [x, y] = c.at;
    else { const a = As[0]; y = a[1] + a[3] / 2 < 540 ? 930 - H : 150; x = a[0] + a[2] + 100 + W <= 1840 ? a[0] + a[2] + 100 : a[0] - 100 - W >= 80 ? a[0] - 100 - W : (1920 - W) / 2; }
    const el = K.div(scr, 'lcard', `left:${x}px;top:${y}px;`, `<div class="bd">${K.icon('sparkles', 28)}Learning ${c.n} of 8</div><div class="tx">${c.text}</div>`);
    V.vis(el, { tin, tout, din: .5, rise: 20, scaleFrom: .97 }); V.sfx(tin, POP, -26);
    As.forEach((a, j) => {
      if (c.screen) V.vis(K.div(scr, 'hl', `left:${a[0] - 6}px;top:${a[1] - 6}px;width:${a[2] + 12}px;height:${a[3] + 12}px;box-shadow:0 0 14px rgba(161,0,255,.45);`), { tin: tin - .2, tout, rise: 0, scaleFrom: 1.03 });
      else { const r = c.anchors[j], o = RG.find((q) => q.r.join() === r.join() && q.tin < tin && q.tout > tin - .4); if (o) o.tout = Math.max(o.tout, tout); else ring0(r, tin - .2, tout); }
      const ax = Math.min(Math.max(x + W / 2, a[0]), a[0] + a[2]), ay = a[1] + a[3] / 2 < y ? a[1] + a[3] : a[1] + a[3] / 2 > y + H ? a[1] : a[1] + a[3] / 2;
      const ex = ax < x ? x : ax > x + W ? x + W : ax, ey = ay < y ? y : ay > y + H ? y + H : y + H / 2;
      V.draw(K.path(svgS, `M ${ax.toFixed(0)} ${ay.toFixed(0)} L ${ex.toFixed(0)} ${ey.toFixed(0)}`, { stroke: '#A100FF', width: 4 }), { t0: tin + .25, dur: .4, ease: V.glide, tout });
      V.vis(K.sv(svgS, 'circle', { cx: ax.toFixed(0), cy: ay.toFixed(0), r: 7, fill: '#A100FF' }), { tin: tin + .2, tout, rise: 0 });
    });
    const busy = [...ck.filter((q) => q.t < tout + .35 && q.t + (q.d || 0) > tin - .05).map((q) => `camera ${q.t.toFixed(2)}`),
      ...cks.filter((q) => q.t > tin - .05 && q.t - q.d < tout + .35).map((q) => `cursor ${q.t.toFixed(2)}`), ...plan.filter((q) => q.t > tin - .05 && q.t < tout + .35).map((q) => `screen ${q.t.toFixed(2)}`)];
    QA.push({ id: `L${c.n}`, scene: c.sid, in: +tin.toFixed(2), out: +tout.toFixed(2), dur: +(tout - tin).toFixed(2), still: busy.length ? 'N' : 'Y', pass: tout - tin >= 5 && !busy.length ? 'Pass' : 'Fail', busy: busy.join(', ') });
  });
  window.QA = QA;
  // one highlight at a time: each ends where the next one begins
  RG.sort((a, b) => a.tin - b.tin).forEach((o, i) => { const n = RG.slice(i + 1).find((q) => q.tin > o.tin + .01); if (n) o.tout = Math.min(o.tout, n.tin + .05); });

  // ---- captions: the spoken words, phrase by phrase
  const all = TM.segments.flatMap((s) => s.lines), capBox = K.div(scr, 'cap');
  all.forEach((l, i) => { const nx = all[i + 1], tout = nx && nx.t0 - l.t1 < .7 ? nx.t0 : l.t1 + .6; V.vis(K.div(capBox, '', 'position:absolute;left:0;right:0;bottom:0;', `<span>${l.text}</span>`), { tin: l.t0, tout, din: .15, dout: .1, rise: 6, lift: 0 }); });
  V.ready();
})();
