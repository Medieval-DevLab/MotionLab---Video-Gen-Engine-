// MotionLab: shared setup. Two worlds: AM (the MotionLab studio look, acts 1-3 and 5) and A4 (the Aether film,
// act 4, the journey look) inside its own container, so MotionLab's frame can zoom into it and pull back out of it.
// Every time comes from the VO clock (timing.js): L(id, k) = start of phrase k of segment id; W(...) = a word in it.
(function () {
  const V = VGE, K = VGEKit, F = document.getElementById('frame'), TM = window.TIMING;
  const SEG = Object.fromEntries(TM.segments.map((s) => [s.id, s]));
  const L = (id, k = 0) => SEG[id].lines[k].t0, LE = (id, k = 0) => SEG[id].lines[k].t1, S0 = (id) => SEG[id].t0, S1 = (id) => SEG[id].t1;
  const W = (id, k, word) => { const l = SEG[id].lines[k], i = l.text.indexOf(word); if (i < 0) throw new Error(`W: "${word}" not in ${id}:${k}`); return +(l.t0 + (l.t1 - l.t0) * i / l.text.length).toFixed(2); };
  window.DUR = TM.dur;
  const ASSETS = [];

  // ---- sound: the VO, two scores (MotionLab bed, the Aether film's own score), soft SFX on primary moves
  window.VO = { file: 'films/motionlab/vo.mp3', at: 0, lufs: -16 };
  const M1 = 'library/audio/music/bgm-tech-house.mp3', M2 = 'library/audio/music/uplifting-inspiring.mp3';
  window.MUSIC = [{ file: M1, from: 0, at: 0, until: 82.4, fadeIn: 1.0, fadeOut: .9, lufs: -31 },
    { file: M2, from: 0, at: 81.9, until: 152.7, fadeIn: .9, fadeOut: 1.0, lufs: -30 },
    { file: M1, from: 152.3, at: 152.3, until: TM.dur, fadeIn: 1.0, fadeOut: 3.5, lufs: -31 }];
  const a = 'library/audio/sfx/';
  const SX = { tick: [a + 'counter/clock-tick-single.mp3', -30], click: [a + 'ui/ui-select-modern.mp3', -28], tap: [a + 'ui/switch-tap.mp3', -28],
    pop: [a + 'ui/pop.mp3', -30], confirm: [a + 'ui/ui-success-soft.mp3', -26], notify: [a + 'ui/ui-notify-tech.mp3', -28], magnet: [a + 'ui/hitech-touch-magnet.mp3', -28],
    whoosh: [a + 'impact/impact-deep-whoosh.mp3', -24], swoosh: [a + 'transition/swoosh-slow.mp3', -28], swish: [a + 'transition/sweep-short.mp3', -30],
    zin: [a + 'camera/ui-zoom-in.mp3', -26], zout: [a + 'camera/ui-zoom-out.mp3', -26], bass: [a + 'impact/bass-hit-short.mp3', -22], focus: [a + 'camera/camera-autofocus.mp3', -26],
    shimmer: [a + 'light/sparkle-touch.mp3', -28], sweepL: [a + 'light/shimmer-sparkle-sweep.mp3', -30], aura: [a + 'light/light-aura.mp3', -30],
    glitch: [a + 'data/glitch-electric-small.mp3', -30], snap: [a + 'mech/lock-quick.mp3', -28], scan: [a + 'data/data-scan.mp3', -32], slide: [a + 'transition/transition-soft.mp3', -30] };
  const sfx = (t, k, g) => V.sfx(t, SX[k][0], g ?? SX[k][1]);

  // ---- keyframes for any numeric props: [{t, d, e, cut, ...props}] -> at(t); props hold between keys
  const META = new Set(['t', 'd', 'e', 'cut']);
  function kf(keys) {
    return (t) => {
      const c = {}; for (const k in keys[0]) if (!META.has(k)) c[k] = keys[0][k];
      for (let i = 1; i < keys.length; i++) { const k = keys[i]; if (t < k.t) break; const p = k.cut ? 1 : (k.e || V.travel)(V.seg(t, k.t, k.d ?? .6)); for (const n in k) if (!META.has(n)) c[n] = V.mix(c[n] ?? k[n], k[n], p); }
      return c;
    };
  }
  // drive an element's box: x y w h (px) o (opacity) s (scale) r (radius) rot (deg) tx ty (px) bl (blur px)
  function box(el, keys, o = {}) {
    const at = kf(keys);
    V.on((t) => {
      const c = at(t), st = el.style;
      if (c.x != null) st.left = c.x.toFixed(1) + 'px'; if (c.y != null) st.top = c.y.toFixed(1) + 'px';
      if (c.w != null) st.width = c.w.toFixed(1) + 'px'; if (c.h != null) st.height = c.h.toFixed(1) + 'px';
      if (c.r != null) st.borderRadius = c.r.toFixed(1) + 'px';
      if (c.o != null) { st.opacity = c.o.toFixed(3); st.visibility = c.o < .003 ? 'hidden' : 'visible'; }
      if (c.bl != null) st.filter = c.bl > .05 ? `blur(${c.bl.toFixed(2)}px)` : 'none';
      if (c.s != null || c.tx != null || c.ty != null || c.rot != null) st.transform = `${o.base || ''} translate(${(c.tx || 0).toFixed(1)}px, ${(c.ty || 0).toFixed(1)}px) scale(${(c.s ?? 1).toFixed(4)}) rotate(${(c.rot || 0).toFixed(2)}deg)`;
    });
    return at;
  }

  // ---- layers
  const AM = K.div(F, 'fill');
  // the living ground (engine/kit/ground.js): look and texture change with each section, light sweeps at the big moves
  const AMB = (r, g, b) => ({ w1r: r, w1g: g, w1b: b }), PUR = { pr: 161, pg: 0, pb: 255 };
  VGEGround.live(AM, [
    { t: 0, r: 248, g: 245, b: 240, r2: 244, g2: 238, b2: 246, ang: 160, lx: 84, ly: 0, la: .92, w1r: 245, w1g: 165, w1b: 36, w1a: .16, w1x: 12, w1y: 88, w2a: .08, w3a: .08, ax: 80, ay: 1180, as: 1320, aa: .8, ...PUR, vig: .06 },  // s01-s02 people: warm
    { t: 10.1, r: 238, g: 235, b: 231, r2: 233, g2: 230, b2: 238, la: .7, w1a: .06, w2a: .05, w3a: .03, pRings: .9, rx: 14, ry: 49, vig: .24, ax: 260, ay: 1300 },          // s03 attention: focus rings
    { t: 15.5, r: 242, g: 241, b: 247, r2: 236, g2: 236, b2: 244, ang: 180, lx: 50, ly: -10, ...AMB(90, 110, 255), w1a: .07, w1x: 10, w1y: 20, w2a: .05, w2x: 90, w2y: 10, w3r: 150, w3g: 150, w3b: 170, w3a: .05,
      pRings: 0, pGrid: .9, pr: 94, pg: 88, pb: 130, ax: 1840, ay: -120, ar: 161, ag: 0, ab: 255, vig: .08 },                                                              // s04-s06 the trap: cool grid
    { t: 31.1, r: 250, g: 249, b: 253, r2: 246, g2: 244, b2: 252, lx: 50, ly: 62, la: 1, w1a: .03, w2a: .03, w3a: .02, pGrid: 0, pRays: .9, rx: 50, ry: 74, ...PUR, ax: 960, ay: 1560, as: 1900, vig: .04 }, // s07 the turn: light rays
    { t: 34.2, r: 248, g: 244, b: 238, r2: 246, g2: 240, b2: 248, ang: 140, lx: 80, ly: 8, ...AMB(245, 165, 36), w1a: .15, w1x: 14, w1y: 86, w2a: .12, w2x: 86, w2y: 16, w3r: 255, w3g: 80, w3b: 170, w3a: .07, w3x: 60, w3y: 60,
      pRays: 0, pWaves: .9, wy: 80, pFrames: .7, ax: 1700, ay: 1150, as: 1320, ar: 176, ag: 128, ab: 76 },                                                                 // s08-s09 possibility: waves + frames
    { t: 46.6, w2a: .14, w2x: 84, w2y: 22, pWaves: .6, wy: 84, pFrames: .9 },                                                                                            // s10-s11
    { t: 55.0, r: 243, g: 239, b: 250, r2: 236, g2: 230, b2: 248, ang: 180, lx: 50, ly: 0, la: .9, ...AMB(161, 0, 255), w1a: .14, w1x: 50, w1y: 62, w2r: 80, w2g: 60, w2b: 255, w2a: .08, w2x: 15, w2y: 20, w3r: 245, w3g: 165, w3b: 36, w3a: .05, w3x: 85, w3y: 80,
      pWaves: 0, pFrames: .5, pFloor: .9, ax: 960, ay: 1720, as: 2400, ar: 161, ag: 0, ab: 255, vig: .16 },                                                               // s13-s15 the studio: a floor
    { t: 69.2, ...AMB(245, 165, 36), w1a: .10, w1x: 80, w1y: 30, pFloor: .45, pDots: .5, vig: .08, ax: -200, ay: 540, as: 1400 },                                        // s16
    { t: 73.9, r: 248, g: 245, b: 240, r2: 245, g2: 240, b2: 248, ...AMB(161, 0, 255), w1a: .07, w1x: 50, w1y: 55, w2r: 245, w2g: 165, w2b: 36, w2a: .08, w2x: 20, w2y: 20, pFloor: 0, pDots: .3, pFrames: .3, pRays: .5, rx: 50, ry: 30, ax: 960, ay: 1320, as: 1600, ar: 176, ag: 128, ab: 76, vig: .06 }, // s17
    { t: 79.3, w1a: .12, w1x: 66, w1y: 58, pRays: 0, pWaves: .7, wy: 70, pDots: 0 },                                                                                     // s18 into the frame
    { t: 152.3, cut: true, r: 243, g: 239, b: 250, r2: 236, g2: 230, b2: 248, ang: 180, lx: 50, ly: 0, la: .9, ...AMB(161, 0, 255), w1a: .1, w1x: 70, w1y: 60, w2r: 80, w2g: 60, w2b: 255, w2a: .06, w3a: .04, pWaves: 0, pFloor: .8, pFrames: .4, pRays: 0, pDots: 0, ax: 1840, ay: 1200, as: 1500, ar: 161, ag: 0, ab: 255, vig: .1 }, // s31-s32 studio
    { t: 164.2, r: 246, g: 243, b: 248, pFloor: 0, pDots: .5, pFrames: .8, ...AMB(245, 165, 36), w1a: .08, w1x: 20, w1y: 20 },                                          // s33 gallery
    { t: 172.8, r: 248, g: 244, b: 238, r2: 246, g2: 240, b2: 246, w1a: .16, w1x: 30, w1y: 62, w2r: 161, w2g: 0, w2b: 255, w2a: .1, w2x: 75, w2y: 50, pDots: 0, pFrames: .3, pWaves: .7, wy: 82, ax: 80, ay: 1180, as: 1320, ar: 176, ag: 128, ab: 76, vig: .06 }, // s34 the idea
    { t: 176.3, d: 1.0, r: 238, g: 235, b: 231, r2: 233, g2: 230, b2: 238, la: .7, pWaves: 0, pFrames: 0, pRings: .9, rx: 68, ry: 49, vig: .22 },                            // s35 unseen
    { t: 178.1, r: 248, g: 245, b: 240, r2: 245, g2: 240, b2: 248, la: .96, w1a: .16, pRings: .5, pRays: .6, vig: .05 }],                                                // ...then seen
    { sweeps: [15.4, 31.15, 46.5, 59.6, 69.0, 152.5, 164.3, 178.0], seed: 11 });
  const amS = K.div(AM, 'fill'), amSpark = K.div(AM, 'fill'), amDeep = K.div(AM, 'fill'), amT = K.div(AM, 'fill pjs');
  const A4 = K.div(F, 'a4');
  VGEGround.live(A4, [
    { t: 0, r: 246, g: 245, b: 251, r2: 238, g2: 240, b2: 250, ang: 180, lx: 18, ly: 0, la: .92, w1r: 90, w1g: 120, w1b: 255, w1a: .08, w1x: 20, w1y: 20, w2r: 161, w2g: 0, w2b: 255, w2a: .07, w2x: 90, w2y: 90,
      w3r: 120, w3g: 200, w3b: 230, w3a: .05, w3x: 60, w3y: 40, ax: 1840, ay: 1160, as: 1600, aa: .8, ar: 161, ag: 0, ab: 255, pr: 161, pg: 0, pb: 255, pWaves: .5, wy: 76, vig: .06 },  // s19 one ship, the sea
    { t: 83.7, d: 1.6, pWaves: 0, pTopo: .9, rx: 50, ry: 78 },                                                                                                                     // ...the world: contours
    { t: 90.7, w1r: 245, w1g: 165, w1b: 36, w1a: .12, w1x: 88, w1y: 18, w3a: .03, lx: 70, pTopo: 0, pWaves: .8, wy: 80 },                                                         // s20 the port at dawn: the sea
    { t: 102.9, r: 245, g: 243, b: 250, r2: 238, g2: 234, b2: 248, lx: 50, w1r: 161, w1g: 0, w1b: 255, w1a: .1, w1x: 50, w1y: 56, w2r: 80, w2g: 60, w2b: 255, w2a: .06, w2x: 15, w2y: 25, pWaves: 0, pRings: .8, rx: 50, ry: 55.6, pDots: .4, ax: 960, ay: 600, as: 1080, vig: .1 }, // s22 the hub
    { t: 111.1, w1r: 229, w1g: 72, w1b: 77, w1a: .06, w1x: 16, w1y: 70, pRings: 0, pDots: .2, pGrid: .5, pr: 94, pg: 88, pb: 130, ax: 1840, ay: 1160, as: 1600 },                 // s23 disruption
    { t: 119.2, w1r: 161, w1g: 0, w1b: 255, w1a: .07, w1x: 60, w1y: 60, pGrid: .4 },                                                                                               // s24
    { t: 126.4, d: 1.0, pGrid: 0, pDots: 0, w1a: .04, ax: 200, ay: 1220, as: 1500 },                                                                                             // s25 the planner
    { t: 128.9, d: 1.0, w1r: 229, w1g: 72, w1b: 77, w1a: .06, w1x: 80, w1y: 56, lx: 30, pTopo: .5, rx: 20, ry: 59, pr: 161, pg: 0, pb: 255 },                                     // s26 rejected
    { t: 133.0, d: 1.4, w1r: 30, w1g: 158, w1b: 106, w1a: .07, w1x: 80, w1y: 82, pTopo: .4 },                                                                                     // s27 recovered
    { t: 140.0, w1r: 161, w1g: 0, w1b: 255, w1a: .07, w1x: 50, w1y: 40, pTopo: 0, pFloor: .6 },                                                                                   // s28 dashboards
    { t: 145.9, pFloor: 0, lx: 50, ly: 70, la: 1, w1r: 30, w1g: 158, w1b: 106, w1a: .07, w1x: 90, w1y: 76, pRays: .5, rx: 92, ry: 74, ax: 1760, ay: 1240, as: 1500 },            // s29 the whole line
    { t: 148.4, w1r: 161, w1g: 0, w1b: 255, w1a: .07, w1x: 50, w1y: 50, pRays: .6, rx: 50, ry: 74, ax: 960, ay: 1320, as: 1500 }],                                              // s30 the end card
    { sweeps: [90.6, 97.85, 109.2, 128.8, 140.0, 146.3], seed: 23 });
  const a4S = K.div(A4, 'fill'), a4Deep = K.div(A4, 'fill'), a4T = K.div(A4, 'fill');
  const TOP = K.div(F, 'fill');

  const win = (el, a0, b0) => { V.on((t) => { el.style.display = t >= a0 && t < b0 ? '' : 'none'; }); return el; };
  const scene = (parent, a0, b0) => win(K.div(parent, 'fill'), a0, b0);

  // kinetic text lives in the kit now (engine/kit/text.js)
  const { KT, KTswap, SL } = window.VGEText;

  const mframe = (parent, x, y, w, h, cls = '') => K.div(parent, 'mframe ' + cls, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`);
  const sv = K.sv;
  const PH = (f) => '../../library/photos/' + f;
  function photo(parent, file, x, y, w, h, r = 18) { const p = K.photo(parent, { x, y, w, h, src: PH(file) }); p.el.style.borderRadius = r + 'px'; p.el.style.boxShadow = 'var(--shadow)'; ASSETS.push(PH(file)); return p; }
  // a clip from an image strip (cols x rows frames): a real video played frame by frame, deterministic
  function strip(el, { src, cols, rows, n, fps, t0, loop = false }) {
    el.style.overflow = 'hidden'; const img = document.createElement('img'); img.src = src; img.style.cssText = `position:absolute;left:0;top:0;width:${cols * 100}%;height:${rows * 100}%;`; el.appendChild(img); ASSETS.push(src);
    V.on((t) => { let f = Math.floor((t - t0) * fps); f = loop ? ((f % n) + n) % n : V.clamp(f, 0, n - 1); img.style.transform = `translate(${(-(f % cols) * 100 / cols).toFixed(4)}%, ${(-Math.floor(f / cols) * 100 / rows).toFixed(4)}%)`; });
    return img;
  }
  // sampled path (geometry read once at build time; frames then only interpolate)
  function samples(d, n = 240) { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); const s0 = K.svg(document.body, 1, 1); s0.appendChild(p); const L0 = p.getTotalLength(), pts = []; for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(L0 * i / n); pts.push([q.x, q.y]); } s0.remove(); return (u) => { const f = V.clamp(u) * n, i = Math.min(n - 1, Math.floor(f)), r = f - i; return [V.mix(pts[i][0], pts[i + 1][0], r), V.mix(pts[i][1], pts[i + 1][1], r)]; }; }
  const pulse = (el, t0, d = .8, r0 = 20, r1 = 90) => V.on((t) => { const p = V.seg(t, t0, d), r = V.mix(r0, r1, V.glide(p)); el.style.width = el.style.height = (2 * r).toFixed(1) + 'px'; el.style.opacity = (p > 0 && p < 1 ? (1 - p) * .8 : 0).toFixed(3); });
  const ring = (parent, x, y, t0, o = {}) => { const e = K.div(parent, 'ring', `left:${x}px;top:${y}px;border-color:${o.c || 'var(--purple)'};`); pulse(e, t0, o.d, o.r0, o.r1); return e; };
  const badge = (parent, ic, x, y, size = 96, o = {}) => K.div(parent, '', `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:${o.round ? '50%' : size * .28 + 'px'};background:${o.bg || '#fff'};color:${o.c || 'var(--purple)'};display:flex;align-items:center;justify-content:center;box-shadow:0 12px 30px rgba(42,8,70,.12);`, K.icon(ic, size * .5));

  // ---- specimens: small living versions of formats and features, drawn in a 700x394 box that scales with its frame
  const NS = 'http://www.w3.org/2000/svg';
  function specSvg(parent) { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 700 394'); s.setAttribute('preserveAspectRatio', 'xMidYMid slice'); s.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;'; parent.appendChild(s); return s; }
  const at01 = (t, t0, d) => V.glide(V.seg(t, t0, d));
  function spec(kind, parent, t0) {
    const s = specSvg(parent), g = (attrs) => sv(s, 'g', attrs), R = (p, a2) => sv(p, 'rect', a2), Ci = (p, a2) => sv(p, 'circle', a2), P = (p, a2) => sv(p, 'path', a2);
    const grow = (el, ts, d = .5, ox = 0, oy = 0, axis = 'xy') => V.on((t) => { const k = at01(t, ts, d); el.setAttribute('transform', `translate(${ox} ${oy}) scale(${axis === 'y' ? 1 : k} ${axis === 'x' ? 1 : k}) translate(${-ox} ${-oy})`); el.style.opacity = Math.min(1, k * 1.5).toFixed(3); });
    if (kind === 'product') {
      R(s, { width: 700, height: 394, fill: '#F1EAFA' }); Ci(s, { cx: 210, cy: 120, r: 210, fill: 'url(#gSpark)', opacity: .55 });
      sv(s, 'ellipse', { cx: 350, cy: 352, rx: 170, ry: 16, fill: 'rgba(42,8,70,.12)' });
      const dv = g({}); R(dv, { x: -84, y: -120, width: 168, height: 240, rx: 24, fill: '#1A1323' }); R(dv, { x: -72, y: -106, width: 144, height: 212, rx: 14, fill: '#A100FF' });
      const sh = R(dv, { x: -72, y: -106, width: 60, height: 212, fill: '#fff', opacity: .28 });
      V.on((t) => { const k = at01(t, t0, 1.2); dv.setAttribute('transform', `translate(350 ${200 - 6 * Math.sin((t - t0) * 1.7)}) rotate(${(-16 + 12 * k).toFixed(2)})`); sh.setAttribute('x', (-140 + 220 * V.seg(t, t0 + .3, 1.1)).toFixed(1)); });
    } else if (kind === 'demo' || kind === 'sim') {
      R(s, { width: 700, height: 394, fill: '#FBFAFD' }); R(s, { width: 154, height: 394, fill: '#EFE9F6' });
      for (let i = 0; i < 5; i++) R(s, { x: 28, y: 48 + i * 46, width: 96, height: 12, rx: 6, fill: '#D9CFE6' });
      R(s, { x: 196, y: 48, width: 224, height: 126, rx: 14, fill: '#fff', stroke: '#E2DCEA', 'stroke-width': 2 });
      const st = R(s, { x: 448, y: 48, width: 210, height: 126, rx: 14, fill: '#F2EAFD' });
      for (let i = 0; i < 3; i++) R(s, { x: 196, y: 206 + i * 30, width: 462 - i * 90, height: 12, rx: 6, fill: '#E6E0EC' });
      const bt = R(s, { x: 196, y: 316, width: 170, height: 48, rx: 24, fill: '#fff', stroke: '#A100FF', 'stroke-width': 3 });
      const rp = Ci(s, { cx: 281, cy: 340, r: 10, fill: 'none', stroke: '#A100FF', 'stroke-width': 3 });
      const cu = P(s, { d: 'M0 0 L0 46 L12 35 L21 54 L29 50 L20 32 L37 32 Z', fill: '#1A1323', stroke: '#fff', 'stroke-width': 3, 'stroke-linejoin': 'round' });
      V.on((t) => { const m = V.travel(V.seg(t, t0 + .15, .8)), x = V.mix(620, 286, m), y = V.mix(120, 334, m); cu.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(1 - .12 * Math.sin(Math.PI * V.seg(t, t0 + 1.0, .2))).toFixed(3)})`);
        const c = V.seg(t, t0 + 1.05, .5); rp.setAttribute('r', (10 + 50 * V.glide(c)).toFixed(1)); rp.style.opacity = (c > 0 && c < 1 ? 1 - c : 0).toFixed(3);
        const on = t >= t0 + 1.05; bt.setAttribute('fill', on ? '#A100FF' : '#fff'); st.setAttribute('fill', on ? '#A100FF' : '#F2EAFD'); });
    } else if (kind === 'comms') {
      R(s, { width: 700, height: 394, fill: '#fff' }); R(s, { x: 56, y: 52, width: 322, height: 34, rx: 8, fill: '#1A1323' }); R(s, { x: 56, y: 104, width: 210, height: 22, rx: 6, fill: '#D5CCE3' });
      [.45, .62, .82].forEach((v, i) => grow(R(s, { x: 84 + i * 104, y: 350 - 200 * v, width: 70, height: 200 * v, rx: 8, fill: i === 2 ? '#A100FF' : '#D7A8FF' }), t0 + .2 + i * .15, .5, 0, 350, 'y'));
      R(s, { x: 56, y: 350, width: 380, height: 3, fill: '#E2DCEA' });
      Ci(s, { cx: 566, cy: 236, r: 80, fill: 'none', stroke: '#F2EAFD', 'stroke-width': 28 });
      const arc = Ci(s, { cx: 566, cy: 236, r: 80, fill: 'none', stroke: '#A100FF', 'stroke-width': 28, transform: 'rotate(-90 566 236)' }); const C0 = 2 * Math.PI * 80;
      arc.style.strokeDasharray = `${C0} ${C0}`; V.on((t) => { arc.style.strokeDashoffset = (C0 * (1 - .68 * at01(t, t0 + .5, 1.0))).toFixed(1); });
    } else if (kind === 'training') {
      R(s, { width: 700, height: 394, fill: '#fff' });
      [0, 1, 2].forEach((i) => { const c = Ci(s, { cx: 100, cy: 90 + i * 90, r: 26, fill: '#fff', stroke: '#A100FF', 'stroke-width': 4 }); const b = R(s, { x: 158, y: 80 + i * 90, width: 380 - i * 60, height: 20, rx: 10, fill: '#D5CCE3' });
        V.on((t) => { const on = t >= t0 + .3 + i * .45; c.setAttribute('fill', on ? '#A100FF' : '#fff'); b.setAttribute('fill', on ? '#1A1323' : '#D5CCE3'); }); });
      R(s, { x: 56, y: 340, width: 588, height: 14, rx: 7, fill: '#E2DCEA' }); const pf = R(s, { x: 56, y: 340, width: 0, height: 14, rx: 7, fill: '#A100FF' });
      V.on((t) => pf.setAttribute('width', (588 * .66 * at01(t, t0 + .2, 1.4)).toFixed(1)));
    } else if (kind === 'fresh') {
      R(s, { width: 700, height: 394, fill: '#FBF8FF' }); const gl = Ci(s, { cx: 350, cy: 197, r: 120, fill: 'url(#gSpark)' }); const rays = g({});
      for (let i = 0; i < 10; i++) { const an = i * Math.PI / 5; sv(rays, 'line', { x1: (Math.cos(an) * 44).toFixed(1), y1: (Math.sin(an) * 44).toFixed(1), x2: (Math.cos(an) * 130).toFixed(1), y2: (Math.sin(an) * 130).toFixed(1), stroke: i % 2 ? '#D7A8FF' : '#F5A524', 'stroke-width': 9, 'stroke-linecap': 'round' }); }
      Ci(s, { cx: 350, cy: 197, r: 18, fill: '#A100FF' });
      V.on((t) => { const k = at01(t, t0, .7); rays.setAttribute('transform', `translate(350 197) rotate(${((t - t0) * 14).toFixed(2)}) scale(${(.3 + .7 * k).toFixed(3)})`); rays.style.opacity = k.toFixed(3); gl.setAttribute('r', (110 + 16 * Math.sin((t - t0) * 2.4)).toFixed(1)); });
    } else if (kind === 'workflow' || kind === 'finished') {
      const fin = kind === 'finished'; R(s, { width: 700, height: 394, fill: fin ? '#F4EEFB' : '#fff' });
      let ox = 0, oy = 0, sc = 1;
      if (fin) { Ci(s, { cx: 560, cy: 380, r: 220, fill: 'none', stroke: '#E2D3F4', 'stroke-width': 3 }); grow(R(s, { x: 56, y: 60, width: 290, height: 38, rx: 8, fill: '#1A1323' }), t0, .4, 56, 79); grow(R(s, { x: 56, y: 116, width: 190, height: 22, rx: 6, fill: '#5E5868' }), t0 + .12, .4, 56, 127); ox = 300; oy = 150; sc = .55; }
      const N = [[.16, .5], [.42, .26], [.42, .74], [.72, .5], [.9, .5]].map(([x, y]) => [ox + x * 700 * sc, oy + y * 394 * sc]);
      [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]].forEach(([p, q], i) => { const d = `M${N[p][0]} ${N[p][1]} C${(N[p][0] + N[q][0]) / 2} ${N[p][1]} ${(N[p][0] + N[q][0]) / 2} ${N[q][1]} ${N[q][0]} ${N[q][1]}`; const e = P(s, { d, fill: 'none', stroke: '#D7A8FF', 'stroke-width': 7 * sc + 1 }); V.draw(e, { t0: t0 + .15 + i * .1, dur: .4, ease: V.glide }); });
      N.forEach(([x, y], i) => grow(R(s, { x: x - 34 * sc, y: y - 26 * sc, width: 68 * sc, height: 52 * sc, rx: 12 * sc, fill: i === 3 ? '#A100FF' : '#fff', stroke: '#A100FF', 'stroke-width': 3 }), t0 + .05 + i * .1, .35, x, y));
      const path = samples(`M${N[0][0]} ${N[0][1]} C${(N[0][0] + N[1][0]) / 2} ${N[0][1]} ${(N[0][0] + N[1][0]) / 2} ${N[1][1]} ${N[1][0]} ${N[1][1]} C${(N[1][0] + N[3][0]) / 2} ${N[1][1]} ${(N[1][0] + N[3][0]) / 2} ${N[3][1]} ${N[3][0]} ${N[3][1]} L${N[4][0]} ${N[4][1]}`);
      const tok = Ci(s, { r: 11 * sc + 3, fill: '#F5A524' });
      V.on((t) => { const u = (((t - t0 - .8) / 1.6) % 1 + 1) % 1, [x, y] = path(u); tok.setAttribute('cx', x.toFixed(1)); tok.setAttribute('cy', y.toFixed(1)); tok.style.opacity = t > t0 + .8 ? 1 : 0; });
    } else if (kind === 'mograph') {
      R(s, { width: 700, height: 394, fill: 'url(#gDeep)' });
      const c = Ci(s, { cx: 230, cy: 196, r: 104, fill: '#A100FF' }), sq = R(s, { x: -76, y: -76, width: 152, height: 152, rx: 20, fill: 'none', stroke: '#D7A8FF', 'stroke-width': 10 });
      const b1 = R(s, { x: 420, y: 272, width: 214, height: 30, rx: 8, fill: '#fff' }), b2 = R(s, { x: 420, y: 320, width: 140, height: 20, rx: 6, fill: '#F5A524' });
      V.on((t) => { const k = at01(t, t0, .6); c.setAttribute('r', (104 * k * (1 + .05 * Math.sin((t - t0) * 3))).toFixed(1)); sq.setAttribute('transform', `translate(330 170) rotate(${((t - t0) * 36 + 18).toFixed(2)}) scale(${k.toFixed(3)})`);
        b1.setAttribute('x', V.mix(720, 420, at01(t, t0 + .35, .5)).toFixed(1)); b2.setAttribute('x', V.mix(720, 420, at01(t, t0 + .5, .5)).toFixed(1)); });
    } else if (kind === 'voice') {
      R(s, { width: 700, height: 394, fill: '#fff' }); const bars = [];
      for (let i = 0; i < 30; i++) bars.push(R(s, { x: 56 + i * 19.6 + 4, width: 11, rx: 5.5, fill: '#D7A8FF' }));
      const ph = R(s, { x: 56, y: 56, width: 4, height: 170, fill: '#A100FF' });
      const caps = [[58, 120], [196, 140], [354, 190]].map(([x, w]) => R(s, { x, y: 290, width: w, height: 30, rx: 8, fill: '#D5CCE3' }));
      V.on((t) => { const tt = Math.max(0, t - t0), u = V.clamp(tt / 3.2); bars.forEach((b, i) => { const h = 150 * (.25 + .75 * Math.abs(Math.sin(tt * 3.1 + i * .7)) * (.4 + .6 * Math.abs(Math.sin(i * 1.3)))); b.setAttribute('y', (141 - h / 2).toFixed(1)); b.setAttribute('height', h.toFixed(1)); });
        ph.setAttribute('x', (56 + 588 * u).toFixed(1)); caps.forEach((c, i) => c.setAttribute('fill', t > t0 && u >= i / 3 ? (u < (i + 1) / 3 ? '#A100FF' : '#1A1323') : '#D5CCE3')); });
    } else if (kind === 'editorial') {
      R(s, { width: 700, height: 394, fill: '#F3E7D3' }); R(s, { x: 56, y: 70, width: 380, height: 52, rx: 4, fill: '#2B1E14' }); R(s, { x: 56, y: 140, width: 260, height: 52, rx: 4, fill: '#2B1E14' });
      R(s, { x: 56, y: 236, width: 300, height: 12, rx: 6, fill: '#B08A5E' }); R(s, { x: 56, y: 262, width: 220, height: 12, rx: 6, fill: '#B08A5E' }); Ci(s, { cx: 560, cy: 200, r: 96, fill: '#C9622F' });
    } else if (kind === 'light') {
      R(s, { width: 700, height: 394, fill: '#FFFFFF' }); Ci(s, { cx: 540, cy: 196, r: 110, fill: '#F2EAFD' }); Ci(s, { cx: 540, cy: 196, r: 54, fill: '#A100FF' });
      R(s, { x: 56, y: 120, width: 300, height: 40, rx: 8, fill: '#1A1323' }); R(s, { x: 56, y: 180, width: 200, height: 22, rx: 6, fill: '#D5CCE3' });
    }
    return s;
  }

  // ---- the point of light: one object across the film (ignored, buried; a cursor; the idea; finally seen)
  const sparkEl = K.div(amSpark, 'spark');
  const OURS = { x: 1427, y: 358 }; // our innovation's corner in s03 (the whiteboard card)
  const spk = [{ t: 0, x: OURS.x, y: OURS.y, r: 9, o: 0 }, { t: 10.9, o: 1, r: 12, d: .5, e: V.glide }, { t: 13.6, o: .4, r: 9, d: 1.1 },
    { t: 15.25, x: 716, y: 228, r: 9, o: 1, d: .6 }, { t: 15.9, o: 0, d: .08 },
    { t: 31.85, x: 960, y: 720, r: 6, cut: true }, { t: 31.86, o: 1, d: .12 }, { t: 31.95, x: 960, y: 800, r: 16, d: .55 }, { t: 34.3, x: 624, y: 502, r: 7, d: .35 }, { t: 34.6, o: 0, d: .12 },
    { t: 172.45, x: 1630, y: 868, r: 10, cut: true }, { t: 172.47, o: 1, d: .15 }, { t: 172.7, x: 560, y: 660, r: 18, d: .65 },
    { t: W('s34', 1, 'brings'), x: 1400, y: 625, r: 30, d: .5 }, { t: W('s34', 1, 'brings') + .5, o: 0, d: .15 },
    { t: 176.5, x: OURS.x, y: OURS.y, r: 9, cut: true }, { t: 176.7, o: .5, d: .4 }, { t: 177.85, o: 1, r: 13, d: .5 }, { t: 179.5, r: 40, o: 0, d: .6 }];
  const spAt = kf(spk);
  V.on((t) => { const c = spAt(t); sparkEl.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) scale(${(c.r / 10).toFixed(3)})`; sparkEl.style.opacity = c.o.toFixed(3); sparkEl.style.visibility = c.o < .003 ? 'hidden' : 'visible'; });

  // ---- the seams: MotionLab's frame opens into the Aether film (s18 -> s19) and the film shrinks back into it (s30 -> s31)
  const a4at = kf([{ t: 0, x: 760, y: 380, s: 1040 / 1920, o: 0, r: 37 }, { t: 81.82, o: 1, d: .18, e: V.glide }, { t: 82.02, x: 0, y: 0, s: 1, r: 0, d: .72 },
    { t: 152.4, x: 360, y: 240, s: .625, r: 32, d: .75 }, { t: 154.45, x: 880, y: 456, s: 920 / 1920, r: 42, d: .6 }, { t: 158.7, o: 0, d: .35, e: V.glide }]);
  const edge = K.div(TOP, 'mframe lit', 'background:none;');
  V.on((t) => {
    const c = a4at(t), on = t >= 81.8 && t < 159.1;
    A4.style.display = on ? '' : 'none'; AM.style.display = t >= 82.8 && t < 152.35 ? 'none' : '';
    A4.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) scale(${c.s.toFixed(5)})`; A4.style.opacity = c.o.toFixed(3);
    A4.style.clipPath = c.r > .1 ? `inset(0 round ${c.r.toFixed(1)}px)` : 'none';
    const eo = c.o * (t < 120 ? 1 - V.seg(t, 82.05, .3) : V.seg(t, 152.95, .3));
    Object.assign(edge.style, { left: c.x + 'px', top: c.y + 'px', width: 1920 * c.s + 'px', height: 1080 * c.s + 'px', opacity: eo.toFixed(3), visibility: eo < .003 || !on ? 'hidden' : 'visible' });
  });

  // ---- start: wait for fonts and every image, then render frame 0
  const ready = () => Promise.all([...new Set(ASSETS)].map((src) => new Promise((res) => { const i = new Image(); i.onload = () => (i.decode ? i.decode().then(res, res) : res()); i.onerror = () => { console.error('missing asset ' + src); res(); }; i.src = src; }))).then(() => V.ready());

  window.ML = { V, K, D: window.SBD, F, SEG, L, LE, S0, S1, W, sfx, AM, amS, amDeep, amT, A4, a4S, a4Deep, a4T, TOP, win, scene, KT, KTswap, SL, kf, box, mframe, sv, photo, strip, samples, pulse, ring, badge, spec, sparkEl, ASSETS, ready, at01 };
})();
