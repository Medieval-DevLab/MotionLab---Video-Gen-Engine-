// Preset examples: one short film per preset, made for its theme at its own dial setting (styles/SCALE.md). Each one
// shows what that preset is best at. Demo content only: names, products and numbers are samples, not claims. Every
// frame is a pure function of t, as in any film; each loop opens sparse, builds, then clears.
(function () {
  const V = VGE, K = VGEKit, KT = (...a) => VGEText.KT(...a);
  const PH = (f) => '../../library/photos/' + f + '.jpg';
  const P = { team: 'team-discussion-84004c3d', meeting: 'team-meeting-053e5e97', lab: 'lab-engineer-bd39a82e', woman: 'portrait-woman-1a857d9d', presenting: 'presenting-1069c7e6' };
  const BACK = (x) => 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);
  const kw = (el, t0, to) => el.querySelectorAll('.kw').forEach((k) => V.keyword(k, t0, '#1A1323', to || '#A100FF'));
  const pop = (el, tin, tout, d = .45) => V.on((t) => { // a pop entrance with overshoot (launch energy)
    const p = V.seg(t, tin, d), q = V.glide(V.seg(t, tout, .35)), op = Math.min(1, p * 3) * (1 - q);
    el.style.opacity = op.toFixed(3); el.style.visibility = op < .003 ? 'hidden' : 'visible';
    el.style.transform = `scale(${(p > 0 ? .6 + .4 * BACK(p) : .6) * (1 + .1 * q)})`;
  });

  const F = {
    // Base: a product story. A problem, the product acting, the result. Measured glides, a slow push, one line.
    base: { dur: 9, build(F) {
      F.className = 'frame bg-v2'; K.ground(F);
      const OUT = 8.4, depth = K.div(F, 'fill'), world = K.div(F, 'fill', 'transform-origin:0 0;'), tl = K.div(F, 'fill');
      V.camera(world, [{ t: 0, x: 0, y: 0, s: 1 }, { t: 0, s: 1.03, d: 8.4, ease: V.linear }], [{ el: depth, k: .8, ky: .8 }]);
      [[900, 240, 'package'], [1720, 940, 'boxes'], [640, 920, 'truck']].forEach(([x, y, ic], i) => { const c = K.chip(depth, { x, y, ic, size: 's' }); c.classList.add('far'); V.vis(c, { tin: .6 + i * .3, tout: OUT, base: 'translate(-50%,-50%)', rise: 12, to: .6 }); });
      const T2 = K.div(tl, 'T2');
      const h1 = K.div(T2, 't-head', '', 'A shipment is <span class="kw">delayed</span>'); V.vis(h1, { tin: .3, tout: 5.0 }); kw(h1, 1.4, '#E5484D');
      const h2 = K.div(T2, 't-head', 'position:absolute;left:0;top:0;width:1100px;', 'Rerouted, and <span class="kw">on time</span>'); V.vis(h2, { tin: 5.2, tout: OUT }); kw(h2, 5.8, '#1E9E6A');
      const s2 = K.div(T2, 't-sub', 'position:absolute;left:0;top:100px;width:1100px;', 'Decided in minutes, not days'); V.vis(s2, { tin: 5.8, tout: OUT });
      const sv = K.svg(world);
      V.vis(K.card(world, { x: 200, y: 470, w: 470, ic: 'ship', label: 'Shipment SG-204' }), { tin: .9, tout: OUT, x: -24, rise: 0 });
      V.vis(K.pill(world, { x: 236, y: 596, text: 'Delayed 3 days', ic: 'clock', kind: 'risk' }), { tin: 1.6, tout: 5.6, scaleFrom: .92, rise: 12 });
      V.vis(K.pill(world, { x: 236, y: 596, text: 'On time', ic: 'check', kind: 'ok' }), { tin: 5.8, tout: OUT, scaleFrom: .92, rise: 12 });
      V.draw(K.path(sv, 'M 670 518 C 820 518, 900 540, 1066 540'), { t0: 2.2, dur: .8, tout: OUT });
      V.draw(K.sv(sv, 'circle', { cx: 1180, cy: 540, r: 160, fill: 'none', stroke: '#E2DCEA', 'stroke-width': 2 }), { t0: 2.4, dur: .9, ease: V.glide, tout: OUT });
      V.vis(K.core(world, { cx: 1180, cy: 540, r: 110, label: 'Platform' }), { tin: 2.7, tout: OUT, scaleFrom: .9, rise: 0 });
      V.draw(K.path(sv, 'M 1290 530 C 1360 530, 1380 430, 1440 430', { stroke: '#D5CCE3', width: 3 }), { t0: 3.4, dur: .6, ease: V.glide, tout: OUT });
      V.draw(K.path(sv, 'M 1290 550 C 1360 550, 1380 650, 1440 650'), { t0: 3.6, dur: .6, ease: V.glide, tout: OUT });
      const wait = K.div(world, 'fill'); V.vis(K.card(wait, { x: 1440, y: 382, w: 380, ic: 'clock', label: 'Wait for the ship' }), { tin: 3.6, tout: OUT, rise: 16 }); V.fade(wait, 4.6, .5, 1, .45);
      V.vis(K.card(world, { x: 1440, y: 602, w: 380, ic: 'route', label: 'Reroute via Busan' }), { tin: 3.9, tout: OUT, rise: 16 });
      V.vis(K.div(world, '', 'position:absolute;left:1432px;top:594px;width:396px;height:112px;border-radius:22px;box-shadow:0 0 0 4px #A100FF;'), { tin: 4.6, tout: OUT, scaleFrom: .96, rise: 0 });
      V.vis(K.pill(world, { x: 1600, y: 528, text: 'Recommended', ic: 'sparkles', kind: 'accent' }), { tin: 4.8, tout: OUT, scaleFrom: .9, rise: 10 });
    } },

    // Showreel: what a team can do. Quick cuts between real people at work, big kinetic words, a living ground.
    showreel: { dur: 8, build(F) {
      F.className = 'frame';
      VGEGround.live(F, [{ t: 0, w1a: .18, w2a: .1, w3a: .1, pDots: .6, vig: .08 }, { t: 1.9, d: .8, w1r: 90, w1g: 120, w1b: 255, w1a: .14, pDots: 0, pGrid: .7 },
        { t: 3.9, d: .8, w1r: 245, w1g: 165, w1b: 36, w1a: .2, pGrid: 0, pRings: .8, rx: 70, ry: 50 }, { t: 5.9, d: .8, pRings: 0, pRays: .7, rx: 50, ry: 42 }], { sweeps: [1.9, 3.9, 5.9], seed: 11 });
      [['We *design*.', P.team, 0, 'letters'], ['We *build*.', P.lab, 2, 'mask'], ['We *launch*.', P.presenting, 4, 'words']].forEach(([txt, ph, a, mode]) => {
        const p = K.photo(F, { x: 900, y: 140, w: 900, h: 800, src: PH(ph) }); p.el.style.borderRadius = '32px';
        V.on((t) => {
          const q = V.glide(V.seg(t, a, .45)), r = V.glide(V.seg(t, a + 1.75, .35)), op = q * (1 - r);
          p.el.style.opacity = op.toFixed(3); p.el.style.visibility = op < .003 ? 'hidden' : 'visible';
          p.el.style.transform = `translateX(${((1 - q) * 140 - r * 90).toFixed(1)}px)`; p.img.style.transform = `scale(${(1.14 - .1 * V.seg(t, a, 2.2)).toFixed(4)})`;
        });
        KT(F, { x: 120, y: 540, w: 760, align: 'left', v: 'mid' }, [{ t: txt, role: 'display', at: a + .15, mode, kwAt: a + .55, din: .4 }], { tout: a + 1.75, out: 'left' });
      });
      const ec = K.div(F, '', 'position:absolute;left:0;width:1920px;top:410px;text-align:center;');
      const e1 = K.div(ec, 't-display', '', 'Made by <span class="kw">our team</span>'); V.vis(e1, { tin: 6.1, tout: 7.6, din: .45, rise: 40, scaleFrom: .96 }); kw(e1, 6.5);
      V.vis(K.div(ec, 't-sub', 'margin-top:24px;', 'Strategy · Design · Engineering · Launch'), { tin: 6.5, tout: 7.6, din: .45, rise: 20 });
    } },

    // Launch: a countdown and a reveal. A dark moving ground, a burst of light, the name, three features that pop.
    launch: { dur: 8, build(F) {
      F.className = 'frame deep';
      VGEShader.layer(F, { effect: 'mesh', colors: ['#1B0533', '#2A0846', '#5B12A8', '#A100FF'], keys: [{ t: 0, a: 1, i: 1, s: 1.2, v: 1.1 }] });
      ['3', '2', '1'].forEach((n, i) => { const e = K.div(F, '', 'position:absolute;left:0;width:1920px;top:330px;text-align:center;font-size:320px;line-height:1;font-weight:700;color:#fff;letter-spacing:-.04em;', n); pop(e, .3 + i * .62, .3 + i * .62 + .5, .35); });
      const burst = K.div(F, '', 'position:absolute;left:960px;top:520px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(215,168,255,.55) 28%, rgba(161,0,255,0) 70%);');
      V.on((t) => { const p = V.glide(V.seg(t, 2.15, .9)), r = 40 + 2800 * p; burst.style.width = burst.style.height = r + 'px'; burst.style.opacity = (V.seg(t, 2.15, .05) * (1 - V.seg(t, 2.6, .9))).toFixed(3); });
      const big = K.div(F, 'fill', 'transform:scale(1.45);transform-origin:960px 470px;');
      KT(big, { x: 120, y: 470, w: 1680, align: 'center', v: 'mid' }, [{ t: 'Introducing', role: 'sub', at: 2.45, mode: 'rise', din: .35 }, { t: '*Nova*', role: 'display', at: 2.6, mode: 'letters', kwAt: 2.6, kc: '#D7A8FF', din: .35 }], { tout: 7.3, out: 'scale', deep: true });
      KT(F, { x: 120, y: 760, w: 1680, align: 'center' }, [{ t: 'The fastest way from idea to launch', role: 'sub', at: 3.7, mode: 'words', din: .35 }], { tout: 7.3, deep: true });
      const row = K.div(F, '', 'position:absolute;left:0;width:1920px;top:880px;display:flex;justify-content:center;gap:22px;');
      [['zap', 'Real-time'], ['cpu', 'AI-native'], ['shield-check', 'Secure by design']].forEach(([ic, l], i) => {
        const c = K.div(row, '', 'display:flex;align-items:center;gap:12px;padding:14px 28px;border-radius:999px;background:rgba(255,255,255,.12);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.32);color:#fff;font-size:30px;font-weight:600;', K.icon(ic, 30) + `<span>${l}</span>`);
        pop(c, 4.5 + i * .3, 7.3);
      });
    } },

    // Explainer: how it works, one step at a time. Hand-drawn boxes and arrows on paper, calm, plenty of air.
    explainer: { dur: 9, build(F) {
      F.className = 'frame'; K.div(F, 'fill', 'background:radial-gradient(70% 80% at 30% 20%, #FBF8F1 0%, #F2ECE0 100%);'); K.div(F, 'fill grain-live');
      const SK = VGESketch, g = K.svg(F), OUT = 8.4;
      const T2 = K.div(F, 'T2'), h = K.div(T2, 't-head', '', 'How it <span class="kw">works</span>'); V.vis(h, { tin: .3, tout: OUT, din: .8, rise: 12 }); kw(h, 1.0);
      [[200, '1 · Connect', 'your data sources', 1.0, 'database'], [760, '2 · Analyse', 'patterns and risks', 2.8, 'scan-search'], [1320, '3 · Act', 'the right next step', 4.6, 'circle-check']].forEach(([x, label, sub, t0, ic], i) => {
        SK.rect(g, x, 420, 400, 260, { t0, seed: 3 + i * 5, tout: OUT });
        SK.write(F, { x: x + 36, y: 452, text: label, size: 68, t0: t0 + .6, tout: OUT });
        V.vis(K.div(F, '', `position:absolute;left:${x + 40}px;top:570px;color:#A100FF;`, K.icon(ic, 60)), { tin: t0 + 1.0, tout: OUT, din: .8, rise: 8 });
        V.vis(K.div(F, 't-sub', `position:absolute;left:${x + 124}px;top:574px;width:260px;font-size:30px;line-height:38px;`, sub), { tin: t0 + 1.1, tout: OUT, din: .8, rise: 8 });
        if (i < 2) SK.arrow(g, x + 420, 550, x + 540, 550, { t0: t0 + 1.5, bend: .22, head: 22, seed: 30 + i, tout: OUT });
      });
      SK.ellipse(g, 1520, 550, 250, 170, { t0: 6.3, color: '#A100FF', width: 5, seed: 9, tout: OUT });
      SK.write(F, { x: 1360, y: 760, text: 'that’s it', size: 60, t0: 6.9, color: '#A100FF', tout: OUT });
    } },

    // Executive: results at a glance. Three numbers that count up, a quarter-by-quarter chart, a pinned note. Restrained.
    executive: { dur: 9, build(F) {
      F.className = 'frame bg-v1'; K.ground(F);
      const D = VGEData, OUT = 8.4, W = K.div(F, 'fill'), s = K.svg(W);
      V.anim(W, 'opacity', [[0, 1], [OUT, 0, .5]]);
      const T2 = K.div(W, 'T2'); V.vis(K.div(T2, 't-head', '', 'Q3 at a glance'), { tin: .3, din: .8, rise: 12 });
      [[120, 0, 12, (v) => '+' + Math.round(v) + '%', 'cost savings', 1.0], [700, 90, 98.6, (v) => v.toFixed(1) + '%', 'on-time delivery', 1.6], [1280, 1, 3.2, (v) => v.toFixed(1) + '×', 'faster decisions', 2.2]].forEach(([x, from, to, fmt, l, t0]) => {
        D.counter(W, { x, y: 270, from, to, fmt, t0, dur: 1.1, size: 120 });
        V.vis(K.div(W, 't-sub', `position:absolute;left:${x}px;top:408px;`, l), { tin: t0 + .2, din: .8, rise: 8 });
      });
      const b = D.box(120, 600, 900, 300, 0, 100); D.axes(s, b, { t0: 3.0 }); D.bars(s, b, [42, 55, 49, 68, 81], { t0: 3.2, stagger: .14, highlight: 4, labels: ['Q3 ’25', 'Q4', 'Q1', 'Q2', 'Q3'], valueSize: 30 });
      const b2 = D.box(1200, 640, 600, 260, 0, 100); D.axes(s, b2, { t0: 4.4, lines: 2 }); const L = D.line(s, b2, [30, 34, 33, 41, 45, 52, 58, 64], { t0: 4.6, dur: 1.2 });
      D.note(s, W, { x: L.pts[7][0], y: L.pts[7][1], text: 'record quarter', dx: -320, dy: -64, t0: 6.0, size: 40 });
      V.vis(K.div(W, 't-label', 'position:absolute;right:120px;bottom:56px;color:#8A8394;font-size:22px;', 'Sample data'), { tin: .5, din: .8, rise: 0 });
    } },

    // Human story: a person and their words. Full-height portraits, a slow push, a quote that arrives word by word.
    human: { dur: 9, build(F) {
      F.className = 'frame'; VGEGround.live(F, [{ t: 0, w1a: .2, w2a: .06, w3a: .12, vig: .1 }]);
      const OUT = 8.4;
      [[P.woman, 0, 5.0, 1.0, 1.1], [P.meeting, 5.0, OUT, 1.08, 1.0]].forEach(([ph, a, b, s0, s1]) => {
        const p = K.photo(F, { x: 900, y: 0, w: 1020, h: 1080, src: PH(ph) }); p.el.style.borderRadius = '0';
        V.on((t) => { const op = V.glide(V.seg(t, a, .8)) * (1 - V.glide(V.seg(t, b, .8))); p.el.style.opacity = op.toFixed(3); p.el.style.visibility = op < .003 ? 'hidden' : 'visible'; p.img.style.transform = `scale(${V.mix(s0, s1, V.seg(t, a, b - a + .8)).toFixed(4)})`; });
      });
      K.div(F, '', 'position:absolute;left:900px;top:0;width:280px;height:1080px;background:linear-gradient(90deg, rgba(248,243,236,1) 0%, rgba(248,243,236,0) 100%);');
      KT(F, { x: 120, y: 300, w: 780, align: 'left' }, [{ t: '“We finally see', role: 'state', at: 1.0, mode: 'words' }, { t: '*the whole*', role: 'state', at: 1.6, mode: 'words', kwAt: 2.3 }, { t: '*picture*.”', role: 'state', at: 1.9, mode: 'words', kwAt: 2.3 }], { tout: 4.8, out: 'blur' });
      V.vis(K.div(F, 't-sub', 'position:absolute;left:120px;top:700px;width:700px;', 'Operations lead, global retailer'), { tin: 2.9, tout: 4.8 });
      KT(F, { x: 120, y: 380, w: 780, align: 'left' }, [{ t: 'Now the whole', role: 'state', at: 5.5, mode: 'words' }, { t: '*team* does.', role: 'state', at: 6.0, mode: 'words', kwAt: 6.4 }], { tout: OUT });
    } },

    // Walkthrough: a product screen, step by step. The cursor clicks, the camera zooms in, a caption card names each step.
    walkthrough: { dur: 10, build(F) {
      F.className = 'frame'; VGEGround.live(F, [{ t: 0, w1a: .03, w2a: .03, w3a: 0, drift: .4, aa: 0, la: .7, vig: .03 }]);
      const SC = VGEScreen, OUT = 9.4, st = K.div(F, 'stage');
      const W = SC.window(st, { x: 200, y: 120, w: 1520, h: 840, title: 'Campaigns', t0: .2, tout: OUT });
      SC.sidebar(W.body, { items: [['layers', 'Dashboard'], ['mail', 'Campaigns'], ['users', 'Audiences'], ['trending-up', 'Reports']], active: [{ t: 0, i: 0 }, { t: 1.6, i: 1 }], t0: .4 });
      V.vis(K.div(W.body, '', 'position:absolute;left:300px;top:34px;font-size:36px;font-weight:600;color:#1A1323;', 'Campaigns'), { tin: 1.8, rise: 10 });
      SC.button(W.body, { x: 1190, y: 26, text: 'New email', icon: 'sparkles', primary: true, t0: 1.9, press: 3.8 });
      SC.list(W.body, { x: 300, y: 120, w: 1160, rows: [{ icon: 'mail', title: 'Spring newsletter', meta: 'Sent' }, { icon: 'mail', title: 'Webinar invite', meta: 'Draft' }, { icon: 'mail', title: 'Product update', meta: 'Scheduled' }], t0: 2.0 });
      const M = SC.modal(W.body, { x: 380, y: 180, w: 760, h: 360, title: 'New email', t0: 4.1, tout: 7.4 });
      SC.input(M, { x: 36, y: 110, w: 688, placeholder: 'Name your email', text: 'Spring launch', typeAt: 4.8, cps: 12 });
      SC.button(M, { x: 560, y: 250, text: 'Save', primary: true, t0: 4.2, press: 7.0 });
      SC.toast(st, { x: 1290, y: 190, title: 'Email saved', body: 'Ready to schedule', t0: 7.6, tout: OUT });
      SC.cursor(st, [{ t: .7, x: 1500, y: 900 }, { t: 1.6, x: 320, y: 278, click: true }, { t: 3.8, x: 1500, y: 232, click: true, d: 1.0 }, { t: 4.7, x: 980, y: 520, d: .6 }, { t: 7.0, x: 1190, y: 634, click: true, d: .8 }, { t: 8.3, x: 1300, y: 760, d: .8 }], { t0: .7, tout: OUT });
      SC.camera(st, [{ t: 0, x: 960, y: 540, s: 1 }, { t: 3.3, x: 1420, y: 260, s: 1.6, d: .8 }, { t: 4.4, x: 960, y: 520, s: 1.12, d: .8 }, { t: 7.8, x: 960, y: 540, s: 1, d: .8 }]);
      [[1, 'Open Campaigns', .5, 3.0], [2, 'Create a new email', 3.1, 6.4], [3, 'Name it and save', 6.5, OUT]].forEach(([n, l, a, b]) => {
        const c = K.div(F, '', 'position:absolute;left:120px;top:960px;display:flex;align-items:center;gap:18px;background:#fff;border-radius:20px;box-shadow:0 10px 30px rgba(42,8,70,.14);padding:14px 28px 14px 14px;',
          `<span style="width:52px;height:52px;border-radius:14px;background:#A100FF;color:#fff;font-size:28px;font-weight:700;display:flex;align-items:center;justify-content:center">${n}</span><span style="font-size:34px;font-weight:600;color:#1A1323">${l}</span>`);
        V.vis(c, { tin: a, tout: b, x: -40, rise: 0, din: .5 });
      });
    } },
  };
  window.VGEPresetFilms = F;
})();
