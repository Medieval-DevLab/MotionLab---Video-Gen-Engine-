// MotionLab act 5 (152.4 - 186.5 s): the reveal and the close. The Aether film shrinks back into MotionLab's frame;
// its own scenes become the proof; one possibility becomes many; the idea is brought to life and, finally, seen.
(function () {
  const { V, K, L, W, S1, sfx, amS, amDeep, amT, TOP, scene, KT, kf, box, mframe, photo, strip, samples, ring, spec, at01 } = ML;
  const PH = (f) => '../../library/photos/' + f;
  const tile = (parent, file, x, y, w, h) => { const e = K.div(parent, 'tile', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;box-shadow:0 18px 44px rgba(42,8,70,.16);`); const im = document.createElement('img'); im.src = PH(file); e.appendChild(im); ML.ASSETS.push(PH(file)); return e; };

  // ================= s31 · there you have it: the story (a document) became the film (the frame)
  const s1 = scene(amS, 152.3, 159.2);
  const AETHER = ['Imagine managing a global', 'supply chain.', 'Thousands of shipments.', 'Hundreds of suppliers.', 'Millions of moving parts.', 'Now imagine… a critical', 'shipment gets delayed in', 'Singapore, putting three', 'manufacturing facilities…'];
  const doc = K.div(s1, 'mdoc', 'left:120px;top:456px;width:520px;height:517px;', '<div class="hd"></div>' + AETHER.map((l) => `<p>${l}</p>`).join(''));
  box(doc, [{ t: 0, tx: -680, o: 0, rot: -4 }, { t: L('s31', 2), tx: 0, o: 1, rot: 0, d: .6, e: V.glide }, { t: 158.6, o: 0, d: .35 }]); sfx(L('s31', 2), 'swoosh');
  const tTr = W('s31', 2, 'transformed');
  doc.querySelectorAll('p').forEach((p, i) => V.colorTo(p, 'color', '#4A4453', '#A100FF', tTr + .1 + i * .1, .2));
  const lk = K.path(K.svg(s1), 'M 640 715 L 880 715', { width: 6 }); V.draw(lk, { t0: tTr, dur: .45, ease: V.glide, tout: 158.6 });
  sfx(152.45, 'zout'); sfx(tTr, 'shimmer');
  KT(amT, 'TL', [{ t: 'And… there you have it.', at: L('s31', 0), mode: 'words' }], { tout: L('s31', 2) - .15, out: 'mask' });
  KT(amT, 'TL', [{ t: 'A simple story, transformed', at: L('s31', 2), mode: 'mask' }, { t: 'into a complete product', at: tTr + .1, mode: 'mask' }, { t: '*showcase*.', at: W('s31', 2, 'showcase') - .1, mode: 'pop', kwAt: W('s31', 2, 'showcase') }], { tout: 158.5, out: 'mask' });
  // the film's own scenes, along the bottom of the frame (frames taken from the act-4 render)
  const top = scene(TOP, 152.3, 173.6);
  const thumbs = [];
  for (let i = 0; i < 8; i++) {
    const th = K.div(top, 'tile', `left:${892 + i * 112}px;top:905px;width:100px;height:56px;box-shadow:0 6px 14px rgba(42,8,70,.25);background:#E9E2F2;`);
    const im = document.createElement('img'); im.src = 'assets/a4-thumbs.jpg'; im.style.cssText = `width:800%;height:100%;object-fit:fill;transform:translateX(${-i * 12.5}%);`; th.appendChild(im);
    box(th, [{ t: 0, o: 0, s: .5 }, { t: tTr + .3 + i * .08, o: 1, s: 1, d: .4, e: V.glide }, { t: 158.62, o: 0, d: .2 }]); thumbs.push(th);
  }
  ML.ASSETS.push('assets/a4-thumbs.jpg');

  // ================= s32 · three of those scenes lift out and play: workflows, interfaces, storytelling
  const TT = [L('s32', 0), L('s32', 1), L('s32', 2)];
  const CL = [['a4-routes', 5, ['Animated workflows']], ['a4-dash', 7, ['Enterprise interfaces']], ['a4-port', 2, ['Intelligent visual', 'storytelling']]];
  const tiles = CL.map(([clip, ti, lab], k) => {
    const x = 120 + k * 580, f = mframe(top, 892 + ti * 112, 905, 100, 56); strip(K.div(f, 'fill'), { src: `assets/${clip}.jpg`, cols: 5, rows: 4, n: 20, fps: 10, t0: TT[k] + .3, loop: true });
    box(f, [{ t: 0, o: 0 }, { t: 158.6, o: 1, d: .05 }, { t: TT[k] - .05, x, y: 300, w: 520, h: 293, d: .6 },
      ...(k === 2 ? [{ t: 164.3, x: 560, y: 400, w: 800, h: 450, d: .6 }, { t: 165.45, x: 800, y: 584, w: 300, h: 169, d: .7 }, { t: 172.4, o: 0, d: .3 }] : [{ t: 164.2, o: 0, d: .35 }])]);
    V.on((t) => f.classList.toggle('lit', t >= TT[k] + .5 && t < 164.2));
    KT(amT, { x, y: 616, w: 520, align: 'left' }, [{ t: lab[0], role: 'sub', at: TT[k] + .05, mode: ['left', 'drop', 'right'][k], c: '#1A1323' }, ...(lab[1] ? [{ t: lab[1], role: 'sub', at: TT[k] + .3, mode: 'right', c: '#1A1323' }] : [])], { tout: 164.1, out: 'blur' });
    sfx(TT[k], 'swish');
    return f;
  });

  // ================= s33 · just one possibility: the gallery builds outward; four more formats light up
  const tOne = L('s33', 0);
  const LIT = { '0,0': ['demo', 'Product demos', L('s33', 1)], '3,0': ['comms', 'Client communications', L('s33', 2)], '1,2': ['workflow', 'Explainers', L('s33', 3)], '4,2': ['fresh', 'Something entirely different', W('s33', 4, 'something')] };
  for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) {
    if (c === 2 && r === 1) continue;
    const x = 120 + c * 340, y = 384 + r * 200, ring2 = Math.max(Math.abs(c - 2), Math.abs(r - 1)), lit = LIT[c + ',' + r];
    const g = mframe(top, x, y, 300, 169); box(g, [{ t: 0, o: 0, s: .6 }, { t: 165.55 + ring2 * .16, o: .55, s: 1, d: .5, e: V.glide }, ...(lit ? [{ t: lit[2] - .05, o: 1, d: .3 }] : []), { t: 172.4, o: c === 4 && r === 2 ? 1 : 0, d: .3 }, { t: 172.75, o: 0, d: .2 }]);
    if (lit) { const w = K.div(g, 'fill'); spec(lit[0], w, lit[2]); V.anim(w, 'opacity', [[0, 0], [lit[2] - .05, 1, .3]]); V.on((t) => g.classList.toggle('lit', t >= lit[2]));
      const p = K.pill(top, { x: x + 12, y: y + 169 - 68, text: lit[1], kind: 'deep' }); p.style.fontWeight = 600; V.vis(p, { tin: lit[2], tout: 172.4, scaleFrom: .8, rise: 8 }); V.text('g:' + lit[1], lit[1], lit[2], 172.4); sfx(lit[2], 'tick'); }
  }
  sfx(165.5, 'zout');
  KT(amT, 'TC', [{ t: "And that's just *one* possibility.", at: tOne, mode: 'wordsAlt', kwAt: W('s33', 0, 'one') }], { tout: 172.6, out: 'mask' });

  // ================= s34 · you bring the idea; MotionLab brings it to life
  const s3 = scene(amS, 172.6, 177.0);
  const tBr = W('s34', 1, 'brings');
  const fI = mframe(s3, 1000, 400, 800, 450); box(fI, [{ t: 0, o: 0, s: .92 }, { t: 173.3, o: 1, s: 1, d: .5, e: V.glide }, { t: 176.2, x: 1155, y: 330, w: 300, h: 400, o: 0, d: .5 }]);
  const bl = K.div(fI, 'fill'); spec('mograph', bl, tBr + .5); V.anim(bl, 'opacity', [[0, 0], [tBr + .48, 1, .25]]);
  V.on((t) => fI.classList.toggle('lit', t >= tBr + .45));
  [[-460, -260, '#F5A524', 36], [460, -240, '#D7A8FF', 28], [430, 250, '#A100FF', 44], [-420, 230, '#C48BFF', 24], [0, -300, '#F5A524', 20], [10, 300, '#D7A8FF', 30], [-250, 0, '#A100FF', 18], [260, 20, '#F5A524', 22]].forEach(([dx, dy, c, r]) => {
    const d = K.div(s3, '', `position:absolute;left:${1400 - r}px;top:${625 - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${c};`);
    V.on((t) => { const p = V.seg(t, tBr + .5, .9), out = V.glide(Math.min(1, p * 1.6)), back = V.glide(V.seg(t, tBr + 1.05, .5)); d.style.transform = `translate(${(dx * out * (1 - .55 * back)).toFixed(1)}px, ${(dy * out * (1 - .55 * back)).toFixed(1)}px) scale(${(1 - .5 * back).toFixed(3)})`; d.style.opacity = (p > 0 ? 1 - V.seg(t, tBr + 1.2, .5) : 0).toFixed(3); });
  });
  sfx(tBr + .5, 'sweepL'); sfx(tBr, 'swoosh');
  KT(amT, 'TL', [{ t: 'You bring the *idea*.', at: L('s34', 0), mode: 'left', kwAt: W('s34', 0, 'idea') }], { tout: 176.2, out: 'left' });
  KT(amT, 'TR', [{ t: 'MotionLab brings it to *life*.', at: L('s34', 1), mode: 'right', kwAt: W('s34', 1, 'life') }], { tout: 176.2, out: 'right' });

  // ================= s35 · every innovation deserves to be seen: the camera finds ours; then every one comes into focus
  const s4 = scene(amS, 176.0, 181.0);
  const ROW = [[120, 'presenting-1069c7e6.jpg'], [465, 'team-discussion-84004c3d.jpg'], [810, 'lab-engineer-bd39a82e.jpg'], [1155, 'whiteboard-624bd043.jpg'], [1500, 'desk-work-c99fd139.jpg']];
  const tLock = 177.85;
  ROW.forEach(([x, f], i) => {
    const el = tile(s4, f, x, 330, 300, 400), d = Math.abs(i - 3), tSeen = tLock + .35 + d * .22, gl = K.div(el, 'glow');
    box(el, [{ t: 0, o: 0, s: .9 }, { t: 176.3 + i * .05, o: 1, s: 1, d: .5, e: V.glide }, ...(i === 3 ? [{ t: tLock, s: 1.07, d: .5, e: V.glide }] : []), { t: 179.4, o: 0, d: .4, e: V.glide }]);
    V.on((t) => { const k = i === 3 ? 1 - at01(t, tLock - .2, .5) : 1 - at01(t, tSeen, .6); el.style.filter = k > .01 ? `blur(${(9 * k).toFixed(2)}px) saturate(${(1 - .5 * k).toFixed(2)})` : 'none'; el.style.opacity = ((+el.style.opacity || 0) * (1 - .6 * k)).toFixed(3); gl.style.opacity = (at01(t, i === 3 ? tLock : tSeen, .4) * (1 - V.seg(t, 179.3, .3))).toFixed(3); });
    sfx(tSeen, 'tick', -32);
  });
  const vf = K.div(s4, 'vf'); vf.innerHTML = '<i></i><i></i><i></i><i></i><b></b><u></u>';
  box(vf, [{ t: 0, x: -400, y: 300, w: 360, h: 460, o: 0 }, { t: 176.6, x: 90, o: 1, d: .5, e: V.glide }, { t: 177.0, x: 1125, d: .8 }, { t: tLock, x: 1139, y: 314, w: 332, h: 432, d: .2 }, { t: 179.0, o: 0, d: .4, e: V.glide }]);
  sfx(177.0, 'swoosh'); sfx(tLock, 'focus'); sfx(tLock + .4, 'sweepL');
  KT(amT, 'TC', [{ t: 'Because every innovation', at: L('s35', 0), mode: 'words' }, { t: 'deserves to be *seen*.', at: W('s35', 0, 'deserves'), mode: 'words', kwAt: W('s35', 0, 'seen') }], { tout: 179.55, out: 'blur' });

  // ================= s36 · MotionLab. Your imagination... in motion.
  const ch = ML.win(K.div(amDeep, 'chapter deep'), 179.4, 999); K.ground(ch);
  V.disc(ch, [{ r: 0, cx: 1427, cy: 358 }, { t: 179.5, r: 2600, d: 1.0 }]);
  KT(amT, 'C', [{ t: 'MotionLab', role: 'display', at: L('s36', 0) - .05, mode: 'letters' }, { t: 'Your imagination… in *motion*.', role: 'sub', at: L('s36', 1), mode: 'words', gap: 24, kwAt: L('s36', 2) + .2 }], { deep: true, y: 500 });
  const trS = K.svg(ch), d0 = 'M 640 720 C 860 790, 1080 790, 1300 720', tr = K.path(trS, d0, { stroke: '#D7A8FF', width: 8 }); V.draw(tr, { t0: L('s36', 2), dur: .8, ease: V.glide });
  const trP = samples(d0), trD = K.div(ch, 'spark white');
  V.on((t) => { const [x, y] = trP(at01(t, L('s36', 2), .8)); trD.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; trD.style.opacity = V.seg(t, L('s36', 2), .1).toFixed(3); });
  sfx(179.5, 'whoosh'); sfx(L('s36', 0), 'bass'); sfx(L('s36', 2), 'shimmer');
})();
