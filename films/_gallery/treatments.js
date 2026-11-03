// Treatments gallery: the four segment treatments, 7 s each, written exactly like a film (plain timed calls on the kit).
// Demo content only: the numbers here are sample data, not claims.
(function () {
  const V = VGE, K = VGEKit, SK = VGESketch, D = VGEData, SC = VGEScreen, F = document.getElementById('frame');
  window.DUR = 28;
  const sec = (a, b, bg) => { const s = K.div(F, 'sec', `background:${bg};`); V.on((t) => { s.style.display = t >= a && t < b ? '' : 'none'; }); return s; };
  const tag = (parent, t0, title, sub) => { const e = K.div(parent, 'tag', '', `<b>${title}</b><small>${sub}</small>`); V.vis(e, { tin: t0 + .1, tout: t0 + 6.6, rise: 12 }); };

  // ---- 1 · hand-drawn line (0-7 s): from a sketch to a launch
  const s1 = sec(0, 7, 'radial-gradient(70% 80% at 30% 20%, #FBF8F1 0%, #F2ECE0 100%)'); K.div(s1, 'fill grain-live');
  tag(s1, 0, 'Hand-drawn line', 'after lemo-opuscar one-line · whiteboard · urban-sketch');
  const g1 = K.svg(s1);
  [[300, 'Idea', .4], [780, 'Prototype', 2.0], [1260, 'Launch', 3.5]].forEach(([x, label, t0], i) => {
    SK.rect(g1, x, 470, 320, 200, { t0, seed: 3 + i * 5 });
    SK.write(s1, { x: x + 160 - label.length * 14, y: 538, text: label, size: 64, t0: t0 + .7 });
    if (i < 2) SK.arrow(g1, x + 340, 560, x + 462, 560, { t0: t0 + 1.25, bend: .22, head: 22, seed: 30 + i });
  });
  SK.hatch(g1, 318, 488, 66, 164, { t0: 1.3, gap: 22, color: '#A100FF', width: 2.4 });
  SK.ellipse(g1, 1420, 570, 230, 150, { t0: 4.8, color: '#A100FF', width: 6, seed: 9 });
  SK.underline(g1, 1330, 640, 180, { t0: 5.3, color: '#A100FF', double: true, seed: 4 });
  SK.check(g1, 1560, 440, 60, { t0: 5.7, color: '#1E9E6A', width: 7 });
  SK.write(s1, { x: 300, y: 340, text: 'from a sketch…', size: 72, t0: .2, color: '#5E5868' });
  SK.write(s1, { x: 1240, y: 800, text: '…to a launch', size: 72, t0: 5.9, color: '#A100FF' });

  // ---- 2 · isometric (7-14 s): a supply chain board; buildings rise, a route draws, a truck runs, focus on the factory
  const s2 = sec(7, 14, 'radial-gradient(80% 90% at 50% 30%, #FBF9FE 0%, #EEE7F8 100%)');
  tag(s2, 7, 'Isometric', 'after lemo-opuscar iso-infographic');
  const wrap = K.div(s2, 'stage'); V.on((t) => { wrap.style.transform = `translate(960px, 560px) scale(${(1 + .07 * V.seg(t, 7.3, 6.5)).toFixed(4)}) translate(-960px, -560px)`; });
  const g2 = K.svg(wrap), I = VGEIso.scene(g2, { ox: 900, oy: 380, k: 1 }), pins = K.div(wrap, 'fill');
  I.board({ x: -100, y: -100, w: 700, d: 600, thick: 28, t0: 7.2 });
  const wh = K.sv(g2, 'g', {}), fa = K.sv(g2, 'g', {}), tw = K.sv(g2, 'g', {}), po = K.sv(g2, 'g', {});
  I.box({ parent: wh, x: 0, y: 20, w: 190, d: 130, h: 90, color: '#B98AF0', t0: 7.7 }); I.roof({ parent: wh, x: 0, y: 20, z: 90, w: 190, d: 130, h: 46, color: '#8E6AC8', t0: 8.25 });
  I.box({ parent: fa, x: 300, y: 10, w: 170, d: 170, h: 120, color: '#5FBF9F', t0: 8.1 }); I.cyl({ parent: fa, x: 330, y: 40, z: 120, r: 20, h: 110, color: '#3E8F75', t0: 8.6 });
  I.box({ parent: tw, x: 40, y: 300, w: 120, d: 120, h: 230, color: '#8FA8F2', t0: 8.5, mode: 'drop', dur: .8 });
  I.plate({ parent: po, x: 360, y: 330, w: 200, d: 170, color: '#CFE0FF', t0: 8.8 });
  I.box({ parent: po, x: 400, y: 380, w: 120, d: 50, h: 26, color: '#5E5868', t0: 9.0, mode: 'drop', dur: .7 });
  [[410, 385, '#A100FF'], [440, 385, '#F5A524'], [470, 385, '#D7A8FF']].forEach(([x, y, c], i) => I.box({ parent: po, x, y, z: 26, w: 26, d: 40, h: 22, color: c, t0: 9.3 + i * .1, mode: 'drop', dur: .5 }));
  const R = [[95, 160, 0], [95, 230, 0], [385, 230, 0], [385, 190, 0], [385, 230, 0], [460, 230, 0], [460, 330, 0]];
  I.route({ points: R, t0: 9.6, dur: 1.2 });
  const truck = K.sv(g2, 'g', {}); I.box({ parent: truck, x: 80, y: 150, w: 40, d: 26, h: 22, color: '#F5A524', mode: 'none' }); V.anim(truck, 'opacity', [[0, 0], [10.6, 1, .2]]);
  I.along(truck, R.map(([x, y, z]) => [x - 15, y - 10, z]), { t0: 10.8, t1: 12.8 });
  I.pin(pins, { x: 95, y: 85, z: 136, text: 'Warehouse', up: 90, t0: 9.2 }); I.pin(pins, { x: 385, y: 95, z: 230, text: 'Factory', up: 70, t0: 9.5 }); I.pin(pins, { x: 460, y: 415, z: 0, text: 'Port', up: 120, side: -1, t0: 9.8 });
  I.focus([wh, tw, po, truck], { t0: 12.6 });

  // ---- 3 · data storytelling (14-21 s): bars, a line with a pinned note, a share
  const s3 = sec(14, 21, 'radial-gradient(80% 90% at 40% 20%, #FFFFFF 0%, #F3EFF8 100%)');
  tag(s3, 14, 'Data storytelling', 'after lemo-opuscar dataviz · sample data');
  const g3 = K.svg(s3), b1 = D.box(200, 360, 700, 420, 0, 80);
  D.axes(g3, b1, { t0: 14.3 }); D.bars(g3, b1, [32, 45, 38, 71, 54], { t0: 14.6, stagger: .16, highlight: 3, labels: ['A', 'B', 'C', 'D', 'E'] });
  const b2 = D.box(1080, 360, 640, 280, 0, 100), vals = [18, 22, 20, 31, 29, 38, 44, 41, 55, 62, 58, 74];
  D.axes(g3, b2, { t0: 15.8, lines: 2 }); const L2 = D.line(g3, b2, vals, { t0: 16.0, dur: 1.4 });
  D.note(g3, s3, { x: L2.pts[11][0], y: L2.pts[11][1], text: 'best month', dx: -260, dy: -70, t0: 17.6 });
  D.donut(g3, { cx: 1200, cy: 860, r: 80, w: 28, value: .71, t0: 18.3, dur: 1.1 });
  D.counter(s3, { x: 1330, y: 800, to: 71, fmt: (v) => Math.round(v) + '%', t0: 18.3, dur: 1.1, size: 120 });
  D.units(g3, { x: 1600, y: 800, cols: 5, rows: 3, n: 11, size: 26, gap: 10, t0: 18.6, dur: 1.2 });

  // ---- 4 · living screencast (21-28 s): over a moving mesh-gradient ground; a project is created end to end
  const s4 = sec(21, 28, '#F3EEF9');
  VGEShader.layer(s4, { effect: 'mesh', colors: ['#F4EEFB', '#E3CCFA', '#FCE2C6', '#D8E3FF'], keys: [{ t: 0, i: 1, s: 1, v: .6 }] });
  tag(s4, 21, 'Living screencast', 'after lemo-opuscar living-screencast · over a shader mesh gradient');
  const st = K.div(s4, 'stage');
  const W = SC.window(st, { x: 260, y: 170, w: 1400, h: 800, title: 'MotionLab · Projects', t0: 21.2 });
  SC.sidebar(W.body, { items: [['layers', 'Projects'], ['film', 'Storyboards'], ['image', 'Assets'], ['settings', 'Settings']], t0: 21.4 });
  const hd = K.div(W.body, '', 'position:absolute;left:280px;top:34px;font-size:36px;font-weight:600;color:#1A1323;', 'Projects'); V.vis(hd, { tin: 21.5, rise: 10 });
  SC.button(W.body, { x: 1110, y: 26, text: 'New project', icon: 'sparkles', primary: true, t0: 21.6, press: 22.75 });
  const rows = [{ icon: 'film', title: 'Aether launch film', meta: '3:06' }, { icon: 'presentation', title: 'Onboarding explainer', meta: '1:12' }, { icon: 'mail', title: 'Q3 client update', meta: '0:45' }];
  const rEls = SC.list(W.body, { x: 280, y: 120, w: 1080, rows, t0: 21.7 });
  rEls.forEach((e) => V.anim(e, 'transform', [[0, 0], [25.7, 92, .45]], (v) => `translateY(${v.toFixed(1)}px)`));
  const nr = SC.list(W.body, { x: 280, y: 120, w: 1080, rows: [{ icon: 'sparkles', title: 'Supply-chain promo', meta: 'Draft' }], t0: 25.75 })[0]; nr.style.boxShadow = 'inset 0 0 0 3px #A100FF';
  const M = SC.modal(W.body, { x: 330, y: 160, w: 740, h: 360, title: 'New project', t0: 22.9, tout: 25.45 });
  SC.input(M, { x: 36, y: 110, w: 668, placeholder: 'Name your film', text: 'Supply-chain promo', typeAt: 23.6, cps: 14 });
  SC.button(M, { x: 520, y: 250, text: 'Create', primary: true, t0: 23.0, press: 25.25 });
  SC.toast(st, { x: 1240, y: 210, title: 'Project created', body: 'Storyboard ready to tune', t0: 25.9 });
  SC.cursor(st, [{ t: 21.8, x: 1500, y: 900 }, { t: 22.7, x: 1460, y: 250, click: true }, { t: 23.5, x: 1000, y: 470, d: .6 }, { t: 25.2, x: 990, y: 680, click: true, d: .9 }, { t: 26.4, x: 1180, y: 560, d: .8 }], { t0: 21.8 });
  SC.camera(st, [{ t: 0, x: 960, y: 540, s: 1 }, { t: 26.1, x: 1300, y: 330, s: 1.35, d: 1.0 }]);

  V.ready();
})();
