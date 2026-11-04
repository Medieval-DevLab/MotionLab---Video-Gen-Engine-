// Style library demos: one short loop per style (style-library/recipes/<id>.md), built only from the engine's kit.
// Sample content only (names, numbers and products are placeholders). Each demo opens sparse, builds, and holds.
(function () {
  const V = VGE, K = VGEKit, KT = (...a) => VGEText.KT(...a), SK = () => VGESketch, DA = () => VGEData, SC = () => VGEScreen;
  const PH = (f) => '../../library/photos/' + f + '.jpg';
  const P = { city: 'city-skyline-db28e157', desk: 'desk-work-c99fd139', lab: 'lab-engineer-bd39a82e', laptop: 'laptop-work-ed1c4fde', man: 'portrait-man-bc14816f',
    woman: 'portrait-woman-1a857d9d', present: 'presenting-1069c7e6', team: 'team-discussion-84004c3d', meeting: 'team-meeting-053e5e97', warehouse: 'warehouse-967a52c8' };
  const BACK = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(V.mix(v, B[i], p))).join(',')})`; };
  const fill = (F, css) => K.div(F, 'fill', css);
  const show = (el, tin, o = {}) => V.vis(el, { tin, din: .6, rise: 24, ...o });
  const kw = (el, t0, to) => el.querySelectorAll('.kw').forEach((k) => V.keyword(k, t0, '#1A1323', to || '#A100FF'));
  const D = {};

  // 1 · morphing-shape UI loop: one shape becomes button, loader, check, slider card, toast
  D['morph-ui-loop'] = { dur: 6, still: 4.0, build(F) {
    fill(F, 'background:#EEECEA;');
    const S = [[0, 360, 96, 48, '#111111'], [1.3, 120, 120, 60, '#111111'], [2.2, 120, 120, 60, '#A100FF'], [3.1, 640, 210, 32, '#FFFFFF'], [4.7, 560, 110, 24, '#111111']];
    const box = K.div(F, '', 'position:absolute;box-shadow:0 18px 50px rgba(0,0,0,.16);overflow:hidden;');
    V.on((t) => { let c = { w: S[0][1], h: S[0][2], r: S[0][3], col: S[0][4] };
      for (let i = 1; i < S.length; i++) { const [t0, w, h, r, col] = S[i]; if (t < t0) break; const p = V.travel(V.seg(t, t0, .55)); c = { w: V.mix(c.w, w, p), h: V.mix(c.h, h, p), r: V.mix(c.r, r, p), col: p >= 1 ? col : mixc(c.col.startsWith('#') ? c.col : S[i - 1][4], col, p) }; }
      const a = V.glide(V.seg(t, .2, .5)); Object.assign(box.style, { left: (960 - c.w / 2) + 'px', top: (540 - c.h / 2) + 'px', width: c.w + 'px', height: c.h + 'px', borderRadius: c.r + 'px', background: c.col, opacity: a, transform: `scale(${.9 + .1 * a})` }); });
    const content = (html, a, b, css = '') => { const e = K.div(F, '', `position:absolute;left:0;top:0;width:1920px;height:1080px;display:flex;align-items:center;justify-content:center;pointer-events:none;${css}`, html); V.vis(e, { tin: a, tout: b, din: .3, dout: .2, rise: 8 }); return e; };
    content('<span style="color:#fff;font-size:38px;font-weight:600">Get started</span>', .4, 1.2);
    const sp = content('<svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="26" stroke="#fff" stroke-width="7" fill="none" stroke-dasharray="110 200" stroke-linecap="round"/></svg>', 1.5, 2.15);
    V.on((t) => { sp.firstChild.style.transform = `rotate(${(t * 420) % 360}deg)`; });
    content(`<span style="color:#fff">${K.icon('check', 64)}</span>`, 2.35, 3.0);
    const sl = content('<div style="width:560px"><div style="display:flex;justify-content:space-between;font-size:30px;font-weight:600;color:#111"><span>Volume</span><span class="pv">70%</span></div><div style="margin-top:34px;height:14px;border-radius:7px;background:#E5E3E0;position:relative"><i style="position:absolute;left:0;top:0;height:14px;border-radius:7px;background:#A100FF;display:block"></i><b style="position:absolute;top:-17px;width:48px;height:48px;border-radius:50%;background:#111;display:block"></b></div></div>', 3.35, 4.6);
    const bar = sl.querySelector('i'), knob = sl.querySelector('b'), pv = sl.querySelector('.pv');
    V.on((t) => { const v = V.mix(.35, .7, V.travel(V.seg(t, 3.7, .7))); bar.style.width = (v * 560) + 'px'; knob.style.left = (v * 560 - 24) + 'px'; pv.textContent = Math.round(v * 100) + '%'; });
    content(`<span style="color:#fff;font-size:32px;font-weight:600;display:flex;gap:16px;align-items:center">${K.icon('circle-check', 36)} Saved to your library</span>`, 4.9, 5.8);
    const st = K.div(F, 'stage'); SC().cursor(st, [{ t: .6, x: 1300, y: 780 }, { t: 1.15, x: 990, y: 552, click: true }, { t: 2.9, x: 980, y: 560, click: true, d: .6 }, { t: 3.7, x: 1012, y: 600, d: .5 }, { t: 4.4, x: 1212, y: 600, d: .7 }, { t: 5.6, x: 1260, y: 760, d: .7 }], { t0: .6 });
  } };

  // 2 · continuous-take launch: the wordmark's dot opens like an iris onto the next world (no cuts)
  D['continuous-take'] = { dur: 6, still: 4.3, build(F) {
    fill(F, 'background:#F6F4F0;');
    const wm = K.div(F, 'pj', 'position:absolute;left:0;width:1920px;top:430px;text-align:center;font-size:190px;font-weight:700;letter-spacing:-.04em;color:#111;', 'orbit<span style="color:#A100FF">.</span>');
    show(wm, .2, { tout: 1.6, dout: .3 });
    const world = K.div(F, 'fill', 'background:#0D0A14;'); const ph = K.photo(world, { x: 0, y: 0, w: 1920, h: 1080, src: PH(P.team) }); fill(world, 'background:linear-gradient(90deg, rgba(13,10,20,.86), rgba(13,10,20,.35));');
    V.on((t) => { const p = V.seg(t, 1.4, 1.0), r = 1250 * Math.sqrt(V.travel(p)); world.style.clipPath = `circle(${r.toFixed(1)}px at 1158px 545px)`; world.style.visibility = r < 1 ? 'hidden' : 'visible'; ph.img.style.transform = `scale(${(1.18 - .1 * V.glide(V.seg(t, 1.4, 4))).toFixed(4)})`; });
    const glass = K.div(world, '', 'position:absolute;left:150px;top:300px;width:820px;height:480px;border-radius:30px;background:rgba(255,255,255,.10);backdrop-filter:blur(22px);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35), 0 30px 80px rgba(0,0,0,.35);');
    show(glass, 2.3, { rise: 40, scaleFrom: .96 });
    KT(glass, { x: 60, y: 70, w: 700, align: 'left' }, [{ t: 'Plan less.', role: 'state', at: 2.7, mode: 'mask' }, { t: '*Ship more.*', role: 'state', at: 3.1, mode: 'mask', kc: '#D7A8FF', kwAt: 3.2 }], { deep: true });
    show(K.div(glass, '', 'position:absolute;left:60px;top:350px;padding:18px 34px;border-radius:999px;background:#A100FF;color:#fff;font-size:30px;font-weight:600;', 'Start free'), 3.7, { rise: 14 });
  } };

  // 3 · restrained premium product: dark, precise, one gold accent, a specular sweep across the hero card
  D['premium-product'] = { dur: 6, still: 4.9, build(F) {
    fill(F, 'background:radial-gradient(90% 90% at 50% 30%, #121A3A 0%, #060918 70%);');
    const card = K.div(F, '', 'position:absolute;left:460px;top:250px;width:1000px;height:560px;border-radius:28px;background:linear-gradient(160deg,#141C3A,#0B1128);box-shadow:inset 0 0 0 1px rgba(255,255,255,.10), 0 40px 120px rgba(0,0,0,.55);overflow:hidden;');
    V.on((t) => { const p = V.glide(V.seg(t, .3, 1.4)); card.style.opacity = p; card.style.transform = `perspective(1600px) rotateX(${(10 * (1 - p)).toFixed(2)}deg) translateY(${(60 * (1 - p)).toFixed(1)}px)`; });
    show(K.div(card, '', 'position:absolute;left:60px;top:56px;font-family:Consolas,monospace;font-size:24px;letter-spacing:.14em;color:#8E95B8;', 'NET REVENUE · Q3'), .9, { rise: 10 });
    const n = K.div(card, '', 'position:absolute;left:56px;top:100px;font-size:120px;font-weight:600;color:#F4E6C8;letter-spacing:-.03em;font-variant-numeric:tabular-nums;'); V.count(n, { t0: 1.2, dur: 1.4, from: 1.2, to: 2.48, fmt: (v) => '$' + v.toFixed(2) + 'M' }); show(n, 1.2, { rise: 10 });
    const s = K.svg(card, 1000, 560), b = DA().box(60, 300, 880, 180, 0, 100);
    DA().line(s, b, [22, 28, 26, 35, 41, 39, 52, 61, 58, 72, 80, 88], { t0: 2.0, dur: 1.4, color: '#E8C07A', width: 5 });
    [['+18%', 'quarter on quarter', 560], ['92%', 'retention', 780]].forEach(([v, l, x], i) => show(K.div(card, '', `position:absolute;left:${x}px;top:118px;color:#E9ECF8;font-size:44px;font-weight:600;`, `${v}<div style="font-size:20px;color:#8E95B8;font-weight:500;margin-top:4px">${l}</div>`), 2.6 + i * .2, { rise: 12 }));
    const sw = K.div(card, 'fill', 'background:linear-gradient(105deg, transparent 35%, rgba(255,240,210,.22) 50%, transparent 65%);mix-blend-mode:screen;');
    V.on((t) => { const p = V.seg(t, 3.6, 1.1); sw.style.transform = `translateX(${V.mix(-1100, 1100, V.travel(p)).toFixed(0)}px)`; sw.style.opacity = p > 0 && p < 1 ? 1 : 0; });
  } };

  // 4 · real-UI product promo: the product's own screens; a search types, a result expands into the hero card
  D['real-ui-promo'] = { dur: 6, still: 4.8, build(F) {
    VGEGround.live(F, [{ t: 0, w1a: .1, w2a: .07, pDots: .4, vig: .05 }]);
    KT(F, { x: 120, y: 330, w: 480, align: 'left' }, [{ t: 'Find any file', role: 'head', at: .3, mode: 'words' }, { t: '*in seconds.*', role: 'head', at: .8, mode: 'words', kwAt: 1.0 }]);
    const st = K.div(F, 'stage'), W = SC().window(st, { x: 640, y: 170, w: 1160, h: 740, title: 'Files', t0: .4 });
    SC().sidebar(W.body, { items: [['layers', 'All files'], ['users', 'Shared'], ['clock', 'Recent'], ['settings', 'Settings']], t0: .6 });
    SC().input(W.body, { x: 280, y: 30, w: 840, placeholder: 'Search files', text: 'quarterly report', typeAt: 1.2, cps: 14, t0: .8 });
    SC().list(W.body, { x: 280, y: 120, w: 840, rows: [{ icon: 'file-text', title: 'Q3 report.pdf', meta: 'Finance' }, { icon: 'file-text', title: 'Q2 report.pdf', meta: 'Finance' }, { icon: 'file-text', title: 'Quarterly plan.docx', meta: 'Strategy' }], t0: 2.5 });
    const hero = K.div(st, '', 'position:absolute;left:940px;top:420px;width:600px;height:330px;border-radius:24px;background:#fff;box-shadow:0 30px 80px rgba(42,8,70,.22), inset 0 0 0 2px #A100FF;padding:34px;',
      `<div style="display:flex;gap:18px;align-items:center;color:#A100FF">${K.icon('file-text', 44)}<span style="font-size:36px;font-weight:600;color:#1A1323">Q3 report.pdf</span></div><div style="margin-top:22px;font-size:26px;color:#5E5868">Shared with Finance · edited 2 h ago</div><div style="margin-top:40px;display:inline-block;padding:12px 26px;border-radius:999px;background:#A100FF;color:#fff;font-size:26px;font-weight:600">Open</div>`);
    show(hero, 3.6, { rise: 40, scaleFrom: .92 });
    SC().cursor(st, [{ t: 2.6, x: 1500, y: 900 }, { t: 3.4, x: 1100, y: 402, click: true }, { t: 4.6, x: 1060, y: 680, d: .7 }], { t0: 2.6 });
  } };

  // 5 · screen walkthrough: a dimmed screen, a spotlight on the next control, the camera pushes in, a step card
  D['screen-walkthrough'] = { dur: 6, still: 3.6, build(F) {
    VGEGround.live(F, [{ t: 0, w1a: .04, w2a: .03, aa: 0, la: .7, drift: .4, vig: .03 }]);
    const st = K.div(F, 'stage'), W = SC().window(st, { x: 200, y: 130, w: 1520, h: 820, title: 'Reports', t0: .2 });
    SC().sidebar(W.body, { items: [['layers', 'Dashboard'], ['trending-up', 'Reports'], ['users', 'Audiences'], ['settings', 'Settings']], active: [{ t: 0, i: 1 }], t0: .3 });
    K.div(W.body, '', 'position:absolute;left:300px;top:34px;font-size:36px;font-weight:600;color:#1A1323;', 'Reports');
    SC().button(W.body, { x: 1210, y: 26, text: 'New report', icon: 'sparkles', primary: true, t0: .5, press: 3.2 });
    SC().list(W.body, { x: 300, y: 120, w: 1160, rows: [{ icon: 'trending-up', title: 'Weekly pipeline', meta: 'Mon' }, { icon: 'trending-up', title: 'Campaign results', meta: 'Fri' }, { icon: 'trending-up', title: 'Lead sources', meta: 'Thu' }], t0: .6 });
    const spot = K.div(st, '', 'position:absolute;left:1400px;top:196px;width:236px;height:68px;border-radius:14px;box-shadow:0 0 0 4px #A100FF, 0 0 0 9999px rgba(20,14,30,.42);'); V.vis(spot, { tin: 1.4, rise: 0, scaleFrom: 1.08, din: .4 });
    SC().cursor(st, [{ t: 1.2, x: 1100, y: 800 }, { t: 3.2, x: 1500, y: 232, click: true, d: 1.2 }, { t: 5.2, x: 1300, y: 560, d: .8 }], { t0: 1.2 });
    SC().camera(st, [{ t: 0, x: 960, y: 540, s: 1 }, { t: 2.0, x: 1300, y: 330, s: 1.45, d: 1.0 }]);
    const c = K.div(F, '', 'position:absolute;left:120px;top:940px;display:flex;align-items:center;gap:18px;background:#fff;border-radius:20px;box-shadow:0 10px 30px rgba(42,8,70,.16);padding:14px 28px 14px 14px;',
      '<span style="width:52px;height:52px;border-radius:14px;background:#A100FF;color:#fff;font-size:28px;font-weight:700;display:flex;align-items:center;justify-content:center">2</span><span style="font-size:34px;font-weight:600;color:#1A1323">Create a report</span>');
    V.vis(c, { tin: 1.0, x: -40, rise: 0 });
  } };

  // 6 · showreel / sizzle: quick full-frame compositions on the beat (held back by the tuning scale)
  D['showreel'] = { dur: 6, still: 4.9, build(F) {
    fill(F, 'background:#0B0712;');
    const rays = fill(F, 'background:repeating-conic-gradient(from 0deg at 50% 55%, rgba(161,0,255,.30) 0deg 8deg, transparent 8deg 22deg);');
    V.on((t) => { rays.style.transform = `rotate(${(t * 9).toFixed(2)}deg) scale(1.6)`; rays.style.opacity = V.glide(V.seg(t, 4.1, .4)); });
    const comp = (txt, a, b, css) => KT(F, { x: 60, y: 540, w: 1800, align: 'center', v: 'mid' }, [{ t: txt, role: 'display', at: a, mode: 'letters', din: .3, c: '#fff' }], { tout: b, out: 'scale' });
    const big = K.div(F, 'fill', 'transform:scale(2.2);transform-origin:960px 540px;'); KT(big, { x: 60, y: 540, w: 1800, align: 'center', v: 'mid' }, [{ t: 'MAKE', role: 'display', at: .2, mode: 'letters', din: .3, c: '#fff' }], { tout: 1.5, out: 'scale' });
    const grid = K.div(F, 'fill'); for (let i = 0; i < 24; i++) { const e = K.div(grid, '', `position:absolute;left:${180 + (i % 8) * 200}px;top:${260 + Math.floor(i / 8) * 200}px;width:150px;height:150px;border-radius:${i % 3 ? 20 : 75}px;background:${i % 5 === 0 ? '#A100FF' : 'rgba(255,255,255,.10)'};`); V.vis(e, { tin: 1.6 + i * .025, tout: 2.9, din: .25, scaleFrom: .3, rise: 0 }); }
    const it = K.div(F, 'fill', 'transform:scale(2.6);transform-origin:960px 540px;'); KT(it, { x: 60, y: 540, w: 1800, align: 'center', v: 'mid' }, [{ t: 'IT', role: 'display', at: 1.9, mode: 'pop', c: '#fff' }], { tout: 2.9, out: 'scale' });
    const mv = K.div(F, 'fill', 'transform:scale(1.9);transform-origin:960px 540px;'); KT(mv, { x: 60, y: 540, w: 1800, align: 'center', v: 'mid' }, [{ t: '*MOVE.*', role: 'display', at: 4.1, mode: 'letters', din: .3, kc: '#D7A8FF', kwAt: 4.1 }], { deep: true });
    const ring = K.div(F, '', 'position:absolute;left:960px;top:540px;border-radius:50%;border:10px solid #A100FF;transform:translate(-50%,-50%);'); V.on((t) => { const p = V.seg(t, 3.0, .9), r = 40 + 1500 * V.glide(p); ring.style.width = ring.style.height = r + 'px'; ring.style.opacity = p > 0 && p < 1 ? 1 - p : 0; });
  } };

  // 7 · kinetic typography: the words act out the line; a baseline bends into an orbit
  D['kinetic-type'] = { dur: 6, still: 4.6, build(F) {
    fill(F, 'background:#0E0B14;'); const s = K.svg(F);
    for (let i = 1; i < 6; i++) V.vis(K.sv(s, 'line', { x1: 0, y1: 180 * i, x2: 1920, y2: 180 * i, stroke: 'rgba(255,255,255,.05)', 'stroke-width': 1 }), { tin: .1, rise: 0 });
    KT(F, { x: 200, y: 300, w: 1500, align: 'left' }, [{ t: 'Build the *floor*,', role: 'display', at: .4, mode: 'words', kwAt: 1.2, kc: '#D7A8FF', c: '#fff' }, { t: 'not the ceiling.', role: 'display', at: 1.7, mode: 'mask', c: 'rgba(255,255,255,.55)' }], { deep: true });
    V.draw(K.path(s, 'M 200 500 L 1060 500', { stroke: '#A100FF', width: 6 }), { t0: 1.2, dur: .6, ease: V.glide });
    V.draw(K.path(s, 'M 1060 500 C 1400 500, 1640 380, 1700 240 C 1760 100, 1560 60, 1460 150', { stroke: '#A100FF', width: 3, dash: '2 12' }), { t0: 2.8, dur: 1.3, ease: V.glide });
    const dot = K.sv(s, 'circle', { r: 12, fill: '#D7A8FF' }), p = s.lastChild.previousSibling; const path = K.path(s, 'M 1060 500 C 1400 500, 1640 380, 1700 240 C 1760 100, 1560 60, 1460 150', { stroke: 'none', width: 0 }), len = path.getTotalLength();
    V.on((t) => { const q = V.travel(V.seg(t, 2.8, 1.3)), pt = path.getPointAtLength(len * q); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); dot.style.opacity = V.seg(t, 2.8, .1); });
  } };

  // 8 · loud poster / op-art: cobalt, a turning sunburst, condensed type, stickers, an edge ticker
  D['loud-poster'] = { dur: 6, still: 4.4, build(F) {
    fill(F, 'background:#2438F5;');
    const sun = fill(F, 'background:repeating-conic-gradient(from 0deg at 50% 60%, #FF8A3D 0deg 9deg, #2438F5 9deg 18deg);opacity:.9;');
    V.on((t) => { sun.style.transform = `rotate(${(t * 6).toFixed(2)}deg) scale(1.7)`; });
    fill(F, 'background:radial-gradient(60% 55% at 50% 60%, rgba(36,56,245,0) 0%, rgba(36,56,245,.92) 70%);');
    const tall = K.div(F, 'fill', 'transform:scaleX(.78) scaleY(1.25);transform-origin:960px 470px;');
    KT(tall, { x: 120, y: 470, w: 1680, align: 'center', v: 'mid' }, [{ t: 'THE BIG', role: 'display', at: .3, mode: 'letters', c: '#FFF4DE' }, { t: 'DROP', role: 'display', at: .9, mode: 'letters', c: '#FFF4DE' }]);
    [['NEW!', 1480, 230, -12, '#FF4FA0'], ['LIVE', 330, 700, 9, '#C6FF3D']].forEach(([l, x, y, r, c], i) => {
      const st = K.div(F, '', `position:absolute;left:${x}px;top:${y}px;width:180px;height:180px;border-radius:50%;background:${c};border:8px solid #fff;box-shadow:0 14px 30px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:800;color:#111;`, l);
      V.on((t) => { const p = V.seg(t, 2.0 + i * .3, .5), op = Math.min(1, p * 3); st.style.opacity = op; st.style.transform = `rotate(${r}deg) scale(${p > 0 ? BACK(p) : .4})`; });
    });
    const tick = K.div(F, '', 'position:absolute;left:0;top:1000px;width:1920px;height:80px;background:#111;overflow:hidden;'), tx = K.div(tick, '', 'position:absolute;top:16px;white-space:nowrap;font-size:40px;font-weight:800;letter-spacing:.06em;color:#FFF4DE;', 'LIVE NOW · ONLINE · LIVE NOW · ONLINE · LIVE NOW · ONLINE · LIVE NOW · ONLINE · LIVE NOW · ONLINE · LIVE NOW · ONLINE ·');
    V.on((t) => { tx.style.transform = `translateX(${(-t * 140).toFixed(1)}px)`; tick.style.transform = `translateY(${(80 * (1 - V.glide(V.seg(t, .2, .5)))).toFixed(1)}px)`; });
  } };

  // 9 · logo ident: the mark draws as a wireframe, fills, the name arrives, a light sweep, a micro-breath on the hold
  D['logo-ident'] = { dur: 6, still: 4.6, build(F) {
    fill(F, 'background:#07050B;'); const s = K.svg(F);
    const ring = K.path(s, 'M 760 540 m -110 0 a 110 110 0 1 0 220 0 a 110 110 0 1 0 -220 0', { stroke: '#fff', width: 4 });
    const tri = K.path(s, 'M 760 470 L 822 578 L 698 578 Z', { stroke: '#fff', width: 4 }); tri.setAttribute('stroke-linejoin', 'round');
    V.draw(ring, { t0: .3, dur: 1.1, ease: V.glide }); V.draw(tri, { t0: .9, dur: .7, ease: V.glide });
    const solid = K.sv(s, 'circle', { cx: 760, cy: 540, r: 110, fill: '#A100FF' }); V.on((t) => { solid.style.opacity = V.glide(V.seg(t, 1.7, .5)); });
    const tri2 = K.sv(s, 'path', { d: 'M 760 470 L 822 578 L 698 578 Z', fill: '#fff' }); V.on((t) => { tri2.style.opacity = V.glide(V.seg(t, 1.9, .4)); });
    KT(F, { x: 920, y: 540, w: 900, align: 'left', v: 'mid' }, [{ t: 'NOVA', role: 'display', at: 2.2, mode: 'letters', c: '#fff' }], { deep: true });
    const sw = fill(F, 'background:linear-gradient(105deg, transparent 40%, rgba(255,255,255,.35) 50%, transparent 60%);mix-blend-mode:overlay;'); V.on((t) => { const p = V.seg(t, 3.3, 1.0); sw.style.transform = `translateX(${V.mix(-1400, 1400, V.travel(p))}px)`; sw.style.opacity = p > 0 && p < 1 ? 1 : 0; });
    V.on((t) => { s.style.transform = `scale(${(1 + .012 * Math.sin(Math.PI * V.seg(t, 4.2, 1.6))).toFixed(4)})`; s.style.transformOrigin = '760px 540px'; });
  } };

  // 10 · data story: the question, the number, past bars muted and this one solid, a pinned note
  D['data-story'] = { dur: 6, still: 4.9, build(F) {
    K.ground(F); F.className = 'frame bg-v1'; const W = fill(F, ''), s = K.svg(W);
    KT(W, 'TL', [{ t: 'How much *faster* are decisions?', role: 'head', at: .3, mode: 'words', kwAt: 1.0 }]);
    DA().counter(W, { x: 120, y: 330, from: 1, to: 3.2, fmt: (v) => v.toFixed(1) + '×', t0: 1.0, dur: 1.4, size: 220, color: '#A100FF' });
    show(K.div(W, 't-sub', 'position:absolute;left:126px;top:580px;width:560px;', 'faster than last year, with the same team'), 1.6);
    const b = DA().box(860, 300, 900, 520, 0, 100); DA().axes(s, b, { t0: 1.4 }); DA().bars(s, b, [24, 31, 38, 47, 77], { t0: 1.7, stagger: .16, highlight: 4, labels: ['2022', 'H1', 'H2', '2025', 'Now'], valueSize: 34 });
    DA().note(s, W, { x: 1660, y: 420, text: 'this quarter', dx: -330, dy: -80, t0: 3.6, size: 44 });
  } };

  // 11 · mechanism explainer: one input turns linked wheels; the output follows (the machine is the argument)
  D['mechanism-explainer'] = { dur: 6, still: 4.4, build(F) {
    fill(F, 'background:#F4F1EA;'); const s = K.svg(F);
    const gear = (cx, cy, r, teeth, col) => { let d = ''; for (let i = 0; i < teeth * 2; i++) { const a = i / (teeth * 2) * 2 * Math.PI, rr = i % 2 ? r : r + 16; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1) + ' '; }
      const g = K.sv(s, 'g', {}); K.sv(g, 'path', { d: d + 'Z', fill: col, stroke: '#2A2630', 'stroke-width': 3, 'stroke-linejoin': 'round' }); K.sv(g, 'circle', { cx, cy, r: r * .32, fill: '#F4F1EA', stroke: '#2A2630', 'stroke-width': 3 }); return g; };
    const G = [[620, 560, 120, 14, '#FFFFFF', 1], [858, 560, 100, 12, '#E9E3F4', -1.2], [1240, 560, 100, 12, '#A100FF', -1.2]].map(([x, y, r, n, c, k], i) => { const g = gear(x, y, r, n, c); V.vis(g, { tin: .4 + i * .3, rise: 16, din: .7 }); return [g, x, y, k]; });
    const belt = K.path(s, 'M 858 450 L 1240 450 M 858 670 L 1240 670', { stroke: '#2A2630', width: 4, dash: '14 10' }); V.draw(belt, { t0: 1.6, dur: .6 }); V.flow(belt, { t0: 2.2, speed: 60 });
    V.on((t) => { const a = Math.max(0, t - 2.0) * 50; G.forEach(([g, x, y, k]) => g.setAttribute('transform', `rotate(${(a * k).toFixed(2)} ${x} ${y})`)); });
    const lab = (x, y, txt, tin) => show(K.div(F, '', `position:absolute;left:${x}px;top:${y}px;font-family:Consolas,monospace;font-size:28px;color:#5E5868;letter-spacing:.04em;`, txt), tin, { rise: 8 });
    lab(470, 760, 'INPUT · one request', 1.2); lab(1120, 760, 'OUTPUT · every answer', 2.6);
    KT(F, 'TL', [{ t: 'One input turns *every wheel*.', role: 'head', at: .2, mode: 'words', kwAt: 2.4 }]);
    for (let i = 0; i < 5; i++) { const d = K.div(F, '', 'position:absolute;width:22px;height:22px;border-radius:50%;background:#A100FF;'); V.on((t) => { const p = ((t - 2.2 - i * .4) / 2.0); const q = p - Math.floor(p); const on = t > 2.2 + i * .4; d.style.left = V.mix(1360, 1780, q) + 'px'; d.style.top = (549 + 30 * Math.sin(q * 6)) + 'px'; d.style.opacity = on ? Math.sin(Math.PI * q) : 0; }); }
  } };

  // 12 · storybook / paper collage: paper, crayon lines that boil on twos, cut-paper pieces that land
  D['storybook'] = { dur: 6, still: 4.6, build(F) {
    fill(F, 'background:radial-gradient(70% 80% at 35% 25%, #FBF7EE 0%, #EFE6D4 100%);'); K.div(F, 'fill grain-live'); const g = K.svg(F), S = SK();
    S.rect(g, 260, 380, 420, 300, { t0: .3, seed: 4 }); S.write(F, { x: 300, y: 410, text: 'an idea…', size: 72, t0: .9 });
    S.arrow(g, 720, 530, 920, 530, { t0: 1.7, bend: .25, head: 24, seed: 8 });
    S.rect(g, 960, 380, 420, 300, { t0: 2.0, seed: 9 }); S.write(F, { x: 1000, y: 410, text: '…a plan', size: 72, t0: 2.6 });
    const cut = (x, y, w, h, c, r, tin, br = '18px') => { const e = K.div(F, '', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c};border-radius:${br};box-shadow:4px 6px 0 rgba(60,40,20,.18);`);
      V.on((t) => { const p = V.seg(t, tin, .5), q = Math.floor(t * 12) / 12, j = Math.sin(q * 37 + x) * 1.2; e.style.opacity = Math.min(1, p * 3); e.style.transform = `translateY(${(-(1 - V.glide(p)) * 120).toFixed(1)}px) rotate(${(r + j).toFixed(2)}deg)`; }); };
    cut(330, 520, 110, 110, '#FF8A5B', -6, 1.2, '50%'); cut(470, 560, 150, 70, '#A100FF', 5, 1.4); cut(1030, 520, 300, 34, '#7EC8B0', -2, 3.0); cut(1030, 574, 220, 34, '#7EC8B0', 3, 3.2); cut(1030, 628, 260, 34, '#7EC8B0', -1, 3.4);
    S.check(g, 1420, 300, 70, { t0: 3.9, color: '#1E9E6A', width: 7 }); S.underline(g, 1000, 470, 300, { t0: 4.1, color: '#A100FF', double: true, seed: 5 });
  } };

  // 13 · blueprint line: one line on a drafting grid becomes a curve with handles; a live dimension; a chapter label
  D['blueprint-line'] = { dur: 6, still: 4.4, build(F) {
    fill(F, 'background:#0F3A8C;background-image:linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px),linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px);background-size:60px 60px,60px 60px,300px 300px,300px 300px;');
    const s = K.svg(F), W = '#FFFFFF';
    V.draw(K.path(s, 'M 360 720 L 1560 720', { stroke: W, width: 3 }), { t0: .3, dur: .8, ease: V.glide });
    const curve = K.path(s, 'M 360 720 C 700 300, 1220 300, 1560 720', { stroke: W, width: 5 }); V.draw(curve, { t0: 1.4, dur: 1.2, ease: V.glide });
    [[360, 720, 700, 300], [1560, 720, 1220, 300]].forEach(([x, y, hx, hy], i) => { V.draw(K.path(s, `M ${x} ${y} L ${hx} ${hy}`, { stroke: 'rgba(255,255,255,.6)', width: 2, dash: '8 8' }), { t0: 1.2 + i * .1, dur: .5 }); V.vis(K.sv(s, 'rect', { x: hx - 10, y: hy - 10, width: 20, height: 20, fill: '#0F3A8C', stroke: W, 'stroke-width': 3 }), { tin: 1.4 + i * .1, rise: 0, scaleFrom: .5 }); });
    V.draw(K.path(s, 'M 360 800 L 1560 800 M 360 785 L 360 815 M 1560 785 L 1560 815', { stroke: '#9EC2FF', width: 2 }), { t0: 2.6, dur: .6 });
    const dim = K.div(F, '', 'position:absolute;left:860px;top:812px;width:200px;text-align:center;font-family:Consolas,monospace;font-size:30px;color:#CFE0FF;'); V.count(dim, { t0: 2.7, dur: 1.0, from: 0, to: 240, fmt: (v) => Math.round(v) + ' mm' }); show(dim, 2.7, { rise: 6 });
    show(K.div(F, '', 'position:absolute;left:60px;top:48px;font-family:Consolas,monospace;font-size:26px;letter-spacing:.12em;color:#CFE0FF;', '02 · CURVE &nbsp;&nbsp; BEAT 3 / 8'), .2, { rise: 0 });
  } };

  // 14 · print treatments: risograph two inks, misregistered on impact, a halftone field, an ink bloom
  D['print-treatments'] = { dur: 6, still: 4.2, build(F) {
    fill(F, 'background:#F3EBDD;');
    const bloom = K.div(F, '', 'position:absolute;left:1300px;top:520px;border-radius:50%;background:#FF4F9A;mix-blend-mode:multiply;filter:blur(6px);transform:translate(-50%,-50%);'); V.on((t) => { const r = 700 * V.glide(V.seg(t, .3, 1.8)); bloom.style.width = bloom.style.height = r + 'px'; });
    const dots = K.div(F, '', 'position:absolute;left:980px;top:200px;width:640px;height:640px;border-radius:50%;background-image:radial-gradient(#3A54FF 32%, transparent 34%);background-size:22px 22px;mix-blend-mode:multiply;');
    V.on((t) => { const p = V.glide(V.seg(t, 1.2, 1.0)); dots.style.opacity = p; dots.style.transform = `translate(${(-40 + 40 * p).toFixed(1)}px, 0) scale(${.8 + .2 * p})`; });
    const type = (c, dx, dy, tin) => { const e = K.div(F, 'pj', `position:absolute;left:${140 + dx}px;top:${300 + dy}px;font-size:200px;line-height:200px;font-weight:800;letter-spacing:-.04em;color:${c};mix-blend-mode:multiply;`, 'Made<br>by hand'); show(e, tin, { rise: 30 }); return e; };
    type('#3A54FF', 0, 0, .6); const pink = type('#FF4F9A', 8, 6, .6);
    V.on((t) => { const k = Math.sin(Math.PI * V.seg(t, 2.6, .25)); pink.style.marginLeft = (14 * k).toFixed(1) + 'px'; });
  } };

  // 15 · timeline chronicle: a rail the camera travels along, a year counter, one photo and one line per stop
  D['timeline'] = { dur: 6, still: 3.3, build(F) {
    VGEGround.live(F, [{ t: 0, w1a: .08, w2a: .06, pGrid: .25, vig: .05 }]);
    const world = K.div(F, 'fill', 'transform-origin:0 0;'), s = K.svg(world, 4400, 1080);
    V.draw(K.path(s, 'M 160 700 L 4300 700', { stroke: '#1A1323', width: 4 }), { t0: .2, dur: 1.2, ease: V.glide });
    [[460, '2019', 'The first office', P.city], [1360, '2021', 'A team of forty', P.meeting], [2260, '2023', 'The lab opens', P.lab], [3160, '2026', 'Worldwide', P.present]].forEach(([x, y, l, ph], i) => {
      V.vis(K.sv(s, 'circle', { cx: x, cy: 700, r: 16, fill: '#A100FF' }), { tin: .6 + i * .9, rise: 0, scaleFrom: .4 });
      const p = K.photo(world, { x: x - 210, y: 250, w: 420, h: 280, src: PH(ph) }); p.el.style.borderRadius = '18px'; show(p.el, .8 + i * .9, { rise: 30 });
      show(K.div(world, '', `position:absolute;left:${x - 210}px;top:740px;width:520px;`, `<div class="pj" style="font-size:72px;font-weight:700;color:#1A1323">${y}</div><div class="t-sub">${l}</div>`), 1.0 + i * .9, { rise: 16 });
    });
    V.camera(world, [{ t: 0, x: 0, y: 0, s: 1 }, { t: 1.6, x: 900, d: 1.0 }, { t: 2.5, x: 1800, d: 1.0 }, { t: 3.4, x: 2700, d: 1.0 }]);
    const yc = K.div(F, 'pj', 'position:absolute;right:120px;top:90px;font-size:140px;font-weight:700;color:rgba(161,0,255,.18);font-variant-numeric:tabular-nums;'); const Y = [[0, 2019], [1.6, 2021], [2.5, 2023], [3.4, 2026]]; V.on((t) => { let y = 2019; for (let i = 1; i < Y.length; i++) { const [t0, v] = Y[i]; if (t < t0) break; y = V.mix(Y[i - 1][1], v, V.travel(V.seg(t, t0, 1.0))); } yc.textContent = Math.round(y); yc.style.opacity = V.glide(V.seg(t, .6, .5)); }); // the year rides with the camera
  } };

  // 16 · scale dive: one continuous zoom from the city into a desk into a chip; the zoom runs in log space
  D['scale-dive'] = { dur: 6, still: 2.6, build(F) {
    fill(F, 'background:#05040A;'); const world = K.div(F, 'fill', 'transform-origin:960px 540px;');
    const L0 = K.photo(world, { x: 0, y: 0, w: 1920, h: 1080, src: PH(P.city) });
    const L1 = K.photo(world, { x: 960 - 120, y: 540 - 67.5, w: 240, h: 135, src: PH(P.laptop) }); L1.el.style.borderRadius = '4px'; L1.el.style.boxShadow = '0 0 0 2px #fff';
    const chip = K.div(world, '', 'position:absolute;left:955px;top:537.2px;width:10px;height:5.6px;border-radius:.6px;background:#1B1430;box-shadow:0 0 0 .25px #D7A8FF;background-image:linear-gradient(90deg, rgba(215,168,255,.6) 1px, transparent 1px), linear-gradient(rgba(215,168,255,.6) 1px, transparent 1px);background-size:1px 1px;');
    V.on((t) => { const z = Math.exp(V.mix(0, Math.log(190), V.travel(V.seg(t, .6, 4.4)))); world.style.transform = `scale(${z.toFixed(4)})`; L0.el.style.opacity = 1; });
    [['City', '1×', .3, 1.7], ['Desk', '8×', 2.0, 3.5], ['Chip', '190×', 4.0, 6]].forEach(([l, z, a, b]) => show(K.div(F, '', 'position:absolute;left:120px;top:880px;display:flex;align-items:baseline;gap:20px;color:#fff;', `<span class="pj" style="font-size:72px;font-weight:700">${l}</span><span style="font-family:Consolas,monospace;font-size:36px;color:#D7A8FF">${z}</span>`), a, { tout: b, dout: .3, rise: 16 }));
  } };

  // 17 · assembly / isometric system: a board, parts build in order, a route draws, labels pin on
  D['assembly-iso'] = { dur: 6, still: 4.8, build(F) {
    fill(F, 'background:radial-gradient(80% 90% at 50% 30%, #FBF9FE 0%, #EEE7F8 100%);');
    const st = K.div(F, 'stage'), g = K.svg(st), I = VGEIso.scene(g, { ox: 900, oy: 380, k: 1 }), pins = K.div(st, 'fill');
    I.board({ x: -100, y: -100, w: 700, d: 600, thick: 28, t0: .2 });
    const wh = K.sv(g, 'g', {}), fa = K.sv(g, 'g', {}), tw = K.sv(g, 'g', {});
    I.box({ parent: wh, x: 0, y: 20, w: 190, d: 130, h: 90, color: '#B98AF0', t0: .7 }); I.roof({ parent: wh, x: 0, y: 20, z: 90, w: 190, d: 130, h: 46, color: '#8E6AC8', t0: 1.2 });
    I.box({ parent: fa, x: 300, y: 10, w: 170, d: 170, h: 120, color: '#5FBF9F', t0: 1.1 }); I.cyl({ parent: fa, x: 330, y: 40, z: 120, r: 20, h: 110, color: '#3E8F75', t0: 1.6 });
    I.box({ parent: tw, x: 40, y: 300, w: 120, d: 120, h: 230, color: '#8FA8F2', t0: 1.5, mode: 'drop', dur: .8 });
    I.route({ points: [[95, 160, 0], [95, 230, 0], [385, 230, 0], [385, 190, 0]], t0: 2.4, dur: 1.0 });
    I.pin(pins, { x: 95, y: 85, z: 136, text: 'Warehouse', up: 90, t0: 2.0 }); I.pin(pins, { x: 385, y: 95, z: 230, text: 'Plant', up: 70, t0: 2.3 }); I.pin(pins, { x: 100, y: 360, z: 230, text: 'Hub', up: 60, side: -1, t0: 2.6 });
    V.on((t) => { st.style.transform = `translate(960px, 560px) scale(${(1 + .06 * V.seg(t, .3, 5)).toFixed(4)}) translate(-960px, -560px)`; });
  } };

  // 18 · documentary / archival: grain and halation, an archive frame, captions lit word by word, one saturated object
  D['documentary'] = { dur: 6, still: 4.5, build(F) {
    fill(F, 'background:#0D0C0B;');
    const tv = K.div(F, '', 'position:absolute;left:300px;top:150px;width:980px;height:640px;border-radius:44px;background:#1C1A17;box-shadow:inset 0 0 0 18px #2A2622, 0 30px 80px rgba(0,0,0,.6);overflow:hidden;');
    const ph = K.photo(tv, { x: 34, y: 34, w: 912, h: 572, src: PH(P.warehouse) }); ph.el.style.borderRadius = '26px'; ph.img.style.filter = 'grayscale(1) contrast(1.15) brightness(.9) sepia(.15)';
    K.div(tv, '', 'position:absolute;left:34px;top:34px;width:912px;height:572px;border-radius:26px;background:repeating-linear-gradient(rgba(0,0,0,.18) 0 2px, transparent 2px 4px), radial-gradient(80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%);');
    V.vis(tv, { tin: .2, din: 1.0, rise: 0, scaleFrom: 1.04 }); V.on((t) => { ph.img.style.transform = `scale(${(1.06 + .05 * t / 6).toFixed(4)})`; });
    const hero = K.div(F, '', 'position:absolute;left:1440px;top:330px;width:240px;height:240px;border-radius:28px;background:linear-gradient(145deg,#FF8A2A,#E2520C);');
    V.on((t) => { const p = V.glide(V.seg(t, 2.0, 1.2)); hero.style.opacity = .15 + .85 * p; hero.style.filter = `saturate(${p.toFixed(3)})`; hero.style.boxShadow = `0 0 ${(80 * p).toFixed(0)}px rgba(255,138,42,${(.45 * p).toFixed(3)}), inset 0 0 0 2px rgba(255,255,255,${(.5 * (1 - p) + .15).toFixed(3)})`; });
    const words = 'It started with a single shipment.'.split(' '), cap = K.div(F, '', 'position:absolute;left:0;width:1920px;top:880px;text-align:center;font-size:48px;font-weight:500;color:#F2EDE4;');
    words.forEach((w, i) => { const e = document.createElement('span'); e.textContent = w + ' '; cap.appendChild(e); V.on((t) => { e.style.opacity = (.22 + .78 * V.glide(V.seg(t, 1.0 + i * .32, .25))).toFixed(3); }); });
    K.div(F, 'fill grain-live', 'opacity:.55;mix-blend-mode:screen;');
    fill(F, 'background:radial-gradient(85% 85% at 50% 50%, transparent 60%, rgba(0,0,0,.6) 100%);');
  } };

  // 19 · podcast / talking-head insert: the explainer card fills the frame, the speaker stays in a corner frame
  D['podcast-inserts'] = { dur: 6, still: 4.6, build(F) {
    fill(F, 'background:#F2EDE3;'); K.div(F, 'fill grain-live', 'opacity:.4;');
    const tape = K.div(F, '', 'position:absolute;left:120px;top:110px;padding:14px 30px;background:#FFE58A;transform:rotate(-1.5deg);box-shadow:0 4px 10px rgba(60,40,20,.15);font-size:44px;font-weight:700;color:#1A1323;', 'What is a Smart List?'); show(tape, .3, { rise: 20 });
    const g = K.svg(F), S = SK();
    S.write(F, { x: 150, y: 330, text: 'rules', size: 64, t0: 1.0, color: '#A100FF' });
    const fun = K.path(g, 'M 150 430 L 470 430 L 360 590 L 360 680 L 260 680 L 260 590 Z', { stroke: '#1A1323', width: 5 }); fun.setAttribute('stroke-linejoin', 'round'); V.draw(fun, { t0: 1.2, dur: .9, ease: V.glide });
    S.arrow(g, 520, 560, 760, 560, { t0: 2.1, bend: .2, head: 22, seed: 3 });
    [0, 1, 2, 3].forEach((i) => { const r = K.div(F, '', `position:absolute;left:800px;top:${440 + i * 66}px;width:380px;height:50px;border-radius:12px;background:#fff;box-shadow:0 4px 12px rgba(60,40,20,.1);display:flex;align-items:center;gap:14px;padding:0 16px;font-size:24px;color:#5E5868;`, `<span style="width:28px;height:28px;border-radius:50%;background:#E9E3F4;display:inline-block"></span>person ${i + 1}`); show(r, 2.6 + i * .2, { x: 30, rise: 0 }); });
    show(K.div(F, 't-sub', 'position:absolute;left:150px;top:760px;width:1000px;color:#1A1323;font-weight:600;', 'A saved question. It recalculates every time you look.'), 3.6);
    const pip = K.div(F, '', 'position:absolute;left:1380px;top:560px;width:420px;height:420px;border-radius:30px;overflow:hidden;box-shadow:0 20px 50px rgba(60,40,20,.25), 0 0 0 6px #fff;');
    const sp = K.photo(pip, { x: 0, y: 0, w: 420, h: 420, src: PH(P.man) }); show(pip, .5, { rise: 30, scaleFrom: .95 });
    show(K.div(pip, '', 'position:absolute;left:18px;bottom:18px;display:flex;align-items:center;gap:10px;background:rgba(0,0,0,.6);color:#fff;border-radius:999px;padding:8px 18px;font-size:22px;font-weight:600;', '<i style="width:12px;height:12px;border-radius:50%;background:#FF4F5E;display:inline-block"></i>Host'), .9, { rise: 8 });
    V.on((t) => { sp.img.style.transform = `scale(${(1.08 + .02 * Math.sin(t * .8)).toFixed(4)})`; });
  } };

  window.VGEStyleDemos = D;
})();
