// Parametric style demos: six base scenes (title, ui, data, diagram, photo, ident) dressed by a style's demo spec
// (library.json -> params.js): palette, font, case, texture, shapes, layout. Every style without a hand-built demo in
// demos.js plays through here. Built only from the engine's kit; sample copy only.
(function () {
  const V = VGE, K = VGEKit, KT = (...a) => VGEText.KT(...a);
  const FONTS = { grotesk: 'Inter, sans-serif', display: "'Plus Jakarta Sans', Inter, sans-serif", serif: "Georgia, 'Times New Roman', serif",
    condensed: "Impact, 'Arial Narrow', sans-serif", mono: "Consolas, 'Courier New', monospace", hand: 'Caveat, cursive', black: "'Arial Black', Inter, sans-serif" };
  const PH = { city: 'city-skyline-db28e157', desk: 'desk-work-c99fd139', lab: 'lab-engineer-bd39a82e', laptop: 'laptop-work-ed1c4fde', man: 'portrait-man-bc14816f', woman: 'portrait-woman-1a857d9d',
    present: 'presenting-1069c7e6', team: 'team-discussion-84004c3d', meeting: 'team-meeting-053e5e97', warehouse: 'warehouse-967a52c8', welder: 'welder-cbe6832c', whiteboard: 'whiteboard-624bd043', handshake: 'handshake-125521f4' };
  const photo = (n) => '../../library/photos/' + (PH[n] || PH.team) + '.jpg';
  const BACK = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
  const lum = (h) => { if (!/^#[0-9a-f]{6}$/i.test(h || '')) return .9; const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); return .2126 * r + .7152 * g + .0722 * b; };
  const pop = (el, tin, d = .45) => V.on((t) => { const p = V.seg(t, tin, d); el.style.opacity = Math.min(1, p * 3).toFixed(3); el.style.visibility = p > 0 ? 'visible' : 'hidden'; el.style.transform = (el.dataset.base || '') + ` scale(${p > 0 ? (.6 + .4 * BACK(p)).toFixed(4) : .6})`; });
  const show = (el, tin, o = {}) => V.vis(el, { tin, din: .6, rise: 26, ...o });

  // ---- the dressing every kind shares: ground, texture, background shapes
  function dress(F, s, faint = 1) { // faint: how strongly the background shapes show (charts, diagrams and marks need quiet)
    const dark = s.bg ? lum((s.bg.match(/#[0-9a-f]{6}/i) || ['#ffffff'])[0]) < .45 : s.colors ? lum(s.colors[0]) < .45 : false;
    const c = { ink: s.ink || (dark ? '#FFFFFF' : '#1A1323'), accent: s.accent || '#A100FF', accent2: s.accent2 || s.accent || '#A100FF', dark, font: FONTS[s.font] || FONTS.grotesk };
    c.sub = c.ink + 'B3'; c.bgl = s.bg ? lum((s.bg.match(/#[0-9a-f]{6}/i) || ['#ffffff'])[0]) : s.colors ? lum(s.colors[0]) : .95;
    if (s.ground && VGEShader) VGEShader.layer(F, { effect: s.ground, colors: s.colors || ['#F4EEFB', '#E3CCFA', '#FCE2C6', '#D8E3FF'], keys: [{ t: 0, a: 1, i: 1, s: 1, v: .8 }] });
    else K.div(F, 'fill', `background:${s.bg || '#F7F4EF'};`);
    const sh = K.div(F, 'fill', `opacity:${faint};`), A = c.accent, B = c.accent2;
    switch (s.shapes) {
      case 'circles': [[1420, 300, 360, A], [1660, 720, 220, B], [1180, 820, 140, A]].forEach(([x, y, r, col], i) => { const e = K.div(sh, '', `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${col};opacity:.9;`); pop(e, .2 + i * .25, .6); V.on((t) => { e.style.marginTop = (10 * Math.sin(t * .8 + i)).toFixed(1) + 'px'; }); }); break;
      case 'stripes': { const e = K.div(sh, 'fill', `background:repeating-linear-gradient(135deg, ${A}33 0 40px, transparent 40px 120px);`); V.on((t) => { e.style.backgroundPosition = `${(t * 60).toFixed(1)}px 0`; e.style.opacity = V.glide(V.seg(t, .1, .8)); }); break; }
      case 'sunburst': { const e = K.div(sh, 'fill', `background:repeating-conic-gradient(from 0deg at 50% 50%, ${A}40 0deg 7deg, transparent 7deg 20deg);transform-origin:50% 50%;`); V.on((t) => { e.style.transform = `rotate(${(t * 6).toFixed(2)}deg) scale(1.8)`; e.style.opacity = V.glide(V.seg(t, .1, 1)); }); break; }
      case 'blobs': [[1350, 330, 520, A], [1650, 760, 420, B], [420, 880, 380, A]].forEach(([x, y, r, col], i) => { const e = K.div(sh, '', `position:absolute;left:${x - r / 2}px;top:${y - r / 2}px;width:${r}px;height:${r}px;border-radius:50%;background:${col};filter:blur(70px);opacity:.55;`); V.on((t) => { e.style.transform = `translate(${(40 * Math.sin(t * .5 + i * 2)).toFixed(1)}px, ${(30 * Math.cos(t * .4 + i)).toFixed(1)}px)`; e.style.opacity = (.55 * V.glide(V.seg(t, .1, 1.2))).toFixed(3); }); }); break;
      case 'lines': { const g = K.svg(sh); for (let i = 0; i < 9; i++) V.draw(K.path(g, `M ${1100 + i * 70} 80 L ${1100 + i * 70} 1000`, { stroke: i % 3 ? c.ink + '22' : A, width: i % 3 ? 2 : 4 }), { t0: .2 + i * .08, dur: .8, ease: V.glide }); break; }
      case 'frames': [[1180, 160, 520, 340], [1320, 560, 420, 300], [1060, 640, 220, 160]].forEach(([x, y, w, h], i) => { const e = K.div(sh, '', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:22px;border:3px solid ${i === 1 ? A : c.ink + '33'};`); show(e, .3 + i * .2, { rise: 40 }); V.on((t) => { e.style.marginTop = (8 * Math.sin(t * .7 + i * 2)).toFixed(1) + 'px'; }); }); break;
      case 'blocks': [['circle', 1300, 260, 260, A], ['square', 1560, 260, 220, B], ['tri', 1300, 600, 260, c.ink], ['square', 1580, 560, 160, A]].forEach(([k, x, y, w, col], i) => { const e = K.div(sh, '', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w}px;background:${col};${k === 'circle' ? 'border-radius:50%;' : k === 'tri' ? 'clip-path:polygon(50% 0, 100% 100%, 0 100%);' : ''}`); pop(e, .3 + i * .2); }); break;
      case 'rings': for (let i = 0; i < 4; i++) { const e = K.div(sh, '', `position:absolute;left:1440px;top:540px;border-radius:50%;border:3px solid ${i % 2 ? A : c.ink + '33'};transform:translate(-50%,-50%);`); V.on((t) => { const r = 160 + i * 150 + 30 * Math.sin(t * .6 + i); e.style.width = e.style.height = (r * V.glide(V.seg(t, .2 + i * .15, .9))).toFixed(1) + 'px'; }); } break;
      case 'arcs': { const g = K.svg(sh); [[1920, 1080, 700, A], [1920, 1080, 520, B], [1920, 1080, 340, c.ink + '44']].forEach(([cx, cy, r, col], i) => V.draw(K.path(g, `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy - r}`, { stroke: col, width: 26 - i * 6 }), { t0: .2 + i * .2, dur: 1.0, ease: V.glide })); break; }
    }
    const tx = { grain: 'fill grain-live', scanlines: '', grid: '', dots: '', halftone: '', paper: 'fill grain-live', vignette: '' }[s.texture];
    if (s.texture === 'scanlines') K.div(F, 'fill', 'background:repeating-linear-gradient(rgba(0,0,0,.14) 0 2px, transparent 2px 4px);pointer-events:none;');
    if (s.texture === 'grid') K.div(F, 'fill', `background-image:linear-gradient(${c.ink}14 1px, transparent 1px),linear-gradient(90deg, ${c.ink}14 1px, transparent 1px);background-size:80px 80px;`);
    if (s.texture === 'dots') K.div(F, 'fill', `background-image:radial-gradient(${c.ink}26 2px, transparent 2.5px);background-size:36px 36px;`);
    if (s.texture === 'halftone') K.div(F, 'fill', `background-image:radial-gradient(${A}55 30%, transparent 33%);background-size:18px 18px;-webkit-mask-image:linear-gradient(120deg, transparent 30%, #000 100%);mask-image:linear-gradient(120deg, transparent 30%, #000 100%);`);
    if (s.texture === 'paper') K.div(F, 'fill', 'background:radial-gradient(80% 90% at 30% 20%, rgba(255,250,240,.35) 0%, rgba(120,90,50,.10) 100%);');
    if (s.texture === 'vignette') K.div(F, 'fill', 'background:radial-gradient(85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%);');
    if (tx) K.div(F, tx, 'opacity:.5;pointer-events:none;');
    return c;
  }
  // a headline + sub in the style's type; returns the block
  function words(F, s, c, { x = 120, y = 300, w = 900, align = 'left', size = 132, at = .5, v } = {}) {
    const box = K.div(F, '', `position:absolute;left:${x}px;top:${y}px;width:${w}px;text-align:${align};font-family:${c.font};color:${c.ink};${v === 'mid' ? 'transform:translateY(-50%);' : ''}`);
    let h = (s.headline || 'A clear idea, beautifully told').replace(/\*/g, '');
    const lines = s.layout === 'stacked' ? h.split(' ') : [h];
    lines.forEach((ln, i) => {
      const e = K.div(box, '', `font-size:${size}px;line-height:${(s.font === 'condensed' ? .96 : 1.04)};font-weight:${s.weight || 700};letter-spacing:${s.tracking ?? -.02}em;text-transform:${s.case === 'upper' ? 'uppercase' : 'none'};`);
      const mark = Math.abs(lum(c.accent) - (c.bgl ?? (c.dark ? .1 : .95))) < .3; // a keyword too close to its ground becomes a highlighter mark
      e.innerHTML = s.accentWord ? ln.replace(new RegExp('\\b(' + s.accentWord.replace(/[^\w-]/g, '') + ')\\b', 'i'), mark ? `<span style="background:${c.accent};color:${c.dark ? '#111' : c.ink};padding:0 .12em">$1</span>` : `<span style="color:${c.accent}">$1</span>`) : ln;
      e.style.overflow = 'hidden'; const inner = document.createElement('div'); inner.innerHTML = e.innerHTML; e.innerHTML = ''; e.appendChild(inner);
      V.on((t) => { const p = V.glide(V.seg(t, at + i * .18, .6)); inner.style.transform = `translateY(${((1 - p) * 105).toFixed(1)}%)`; });
    });
    if (s.sub) show(K.div(box, '', `margin-top:28px;font-family:${s.font === 'mono' ? FONTS.mono : FONTS.grotesk};font-size:38px;line-height:1.3;font-weight:500;color:${c.sub};`, s.sub), at + .5 + lines.length * .12, { rise: 14 });
    return box;
  }

  const KINDS = {
    title(F, s) {
      const c = dress(F, s), L = s.layout;
      if (L === 'center') words(F, s, c, { x: 160, y: 540, w: 1600, align: 'center', size: 150, v: 'mid' });
      else if (L === 'split') { const p = K.div(F, '', `position:absolute;left:0;top:0;width:900px;height:1080px;background:${c.dark ? '#00000055' : '#FFFFFF88'};`); show(p, .1, { x: -60, rise: 0 }); words(F, s, c, { x: 110, y: 540, w: 700, size: 112, v: 'mid' }); }
      else words(F, s, c, { x: 120, y: L === 'stacked' ? 520 : 540, w: 1100, size: L === 'stacked' ? 150 : 132, v: 'mid' });
    },
    ui(F, s) {
      const c = dress(F, s), th = s.theme || 'light', r = s.radius ?? 20, A = c.accent;
      const T = { light: ['#FFFFFF', '#1A1323', '#EEEAF3', '0 30px 80px rgba(20,10,40,.18)', 'none'], dark: ['#16161D', '#F2F2F7', '#262631', '0 30px 80px rgba(0,0,0,.5)', 'none'],
        glass: ['rgba(255,255,255,.12)', c.dark ? '#FFFFFF' : '#1A1323', 'rgba(255,255,255,.18)', '0 30px 80px rgba(0,0,0,.25), inset 0 0 0 1.5px rgba(255,255,255,.35)', 'blur(24px)'],
        soft: [s.bg && /^#/.test(s.bg) ? s.bg : '#ECEAF0', '#2A2635', 'rgba(0,0,0,.05)', '18px 18px 40px rgba(0,0,0,.12), -18px -18px 40px rgba(255,255,255,.8)', 'none'],
        brutal: ['#FFFFFF', '#111111', '#F1F1F1', '14px 14px 0 #111111', 'none'], wire: ['transparent', c.ink, c.ink + '22', 'none', 'none'] }[th];
      const card = K.div(F, '', `position:absolute;left:${s.layout === 'center' ? 460 : 820}px;top:${s.layout === 'center' ? 270 : 200}px;width:1000px;height:680px;border-radius:${th === 'brutal' ? 0 : r}px;background:${T[0]};color:${T[1]};box-shadow:${T[3]};backdrop-filter:${T[4]};${th === 'brutal' ? 'border:4px solid #111;' : th === 'wire' ? `border:2px solid ${c.ink}88;` : ''}overflow:hidden;font-family:${c.font === FONTS.hand ? FONTS.grotesk : c.font};`);
      V.on((t) => { const p = V.glide(V.seg(t, .3, 1.1)); card.style.opacity = p; card.style.transform = `perspective(1800px) rotateY(${((s.tilt || 0) * (1 - .6 * p)).toFixed(2)}deg) translateY(${(50 * (1 - p)).toFixed(1)}px)`; });
      const bar = (x, y, w, h, col, tin, rr = 10) => { const e = K.div(card, '', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${rr}px;background:${col};`); show(e, tin, { rise: 14, din: .45 }); return e; };
      const txt = (x, y, html, size, tin, col = T[1], w = 600) => show(K.div(card, '', `position:absolute;left:${x}px;top:${y}px;width:${w}px;font-size:${size}px;font-weight:600;color:${col};`, html), tin, { rise: 12, din: .45 });
      const cont = s.content || 'dashboard';
      if (cont === 'dashboard') { txt(50, 44, 'Overview', 34, .8); [['Revenue', '$4.2M'], ['Active', '18.4k'], ['Growth', '+24%']].forEach(([l, v], i) => { bar(50 + i * 310, 120, 280, 150, T[2], 1.0 + i * .15, 16); txt(76 + i * 310, 146, `<span style="font-size:22px;opacity:.6">${l}</span><br>${v}`, 46, 1.2 + i * .15, i === 2 ? A : T[1], 240); });
        [62, 88, 74, 120, 98, 150, 136, 190].forEach((h, i) => { const e = K.div(card, '', `position:absolute;left:${80 + i * 110}px;bottom:70px;width:64px;border-radius:10px 10px 0 0;background:${i === 7 ? A : T[2]};`); V.on((t) => { e.style.height = (h * 1.6 * BACK(V.seg(t, 1.8 + i * .08, .5))).toFixed(1) + 'px'; }); }); }
      else if (cont === 'chat') { [['How did Q3 go?', 0], ['Revenue is up 24%. Want the full summary?', 1], ['Yes, as slides.', 0], ['Done: 6 slides, shared with your team.', 1]].forEach(([m, me], i) => { const e = K.div(card, '', `position:absolute;${me ? 'left:50px' : 'right:50px'};top:${60 + i * 140}px;max-width:620px;padding:22px 28px;border-radius:24px;font-size:30px;line-height:1.35;background:${me ? T[2] : A};color:${me ? T[1] : '#fff'};`, m); show(e, .9 + i * .55, { x: me ? -30 : 30, rise: 0 }); }); }
      else if (cont === 'list') { txt(50, 44, 'Projects', 34, .8); ['Website refresh', 'Q4 launch film', 'Onboarding flow', 'Partner portal', 'Annual report'].forEach((l, i) => { bar(50, 120 + i * 104, 900, 84, T[2], 1.0 + i * .14, 14); txt(80, 144 + i * 104, `<span style="color:${i === 1 ? A : T[1]}">●</span>&nbsp; ${l}`, 30, 1.1 + i * .14, T[1], 700); }); }
      else if (cont === 'player') { bar(60, 60, 380, 380, A, .9, r); txt(480, 90, 'Morning focus', 52, 1.2, T[1], 480); txt(480, 160, 'Ambient · 42 min', 30, 1.35, T[1] + 'AA', 480); const tr = bar(480, 320, 460, 12, T[2], 1.5, 6), pg = K.div(tr, '', `height:12px;border-radius:6px;background:${A};`); V.on((t) => { pg.style.width = (460 * V.glide(V.seg(t, 1.8, 2.5)) * .62).toFixed(1) + 'px'; });
        ['◀◀', '▶', '▶▶'].forEach((g, i) => txt(520 + i * 130, 380, g, 46, 1.7 + i * .1, i === 1 ? A : T[1], 100)); bar(60, 500, 880, 120, T[2], 2.0, 16); txt(90, 536, 'Up next · Deep work', 30, 2.1); }
      else if (cont === 'form') { txt(50, 50, 'Create account', 40, .8); ['Full name', 'Work email', 'Company'].forEach((l, i) => { txt(50, 140 + i * 130, `<span style="font-size:22px;opacity:.6">${l}</span>`, 22, 1.0 + i * .2); bar(50, 176 + i * 130, 900, 72, T[2], 1.05 + i * .2, 12); }); const b = bar(50, 560, 300, 80, A, 1.9, th === 'brutal' ? 0 : 40); b.innerHTML = '<div style="color:#fff;font-size:30px;font-weight:700;text-align:center;line-height:80px">Continue</div>'; }
      else { const L = ['<span style="color:#C792EA">const</span> film = <span style="color:#82AAFF">render</span>(script, {', '  voice: <span style="color:#C3E88D">"supplied"</span>,', '  scale: { energy: <span style="color:#F78C6C">+1</span> },', '});', '<span style="color:#697098">// every frame is a function of time</span>'];
        K.div(card, 'fill', 'background:#0F111A;'); L.forEach((l, i) => show(K.div(card, '', `position:absolute;left:60px;top:${90 + i * 70}px;font-family:${FONTS.mono};font-size:32px;color:#E6E6F0;white-space:pre;`, l), .9 + i * .35, { x: -16, rise: 0, din: .3 })); }
      if (s.layout !== 'center') words(F, s, c, { x: 110, y: 540, w: 660, size: 92, v: 'mid' }); else words(F, { ...s, sub: '' }, c, { x: 160, y: 96, w: 1600, align: 'center', size: 76 });
    },
    data(F, s) {
      const c = dress(F, s, .25), A = c.accent, ch = s.chart || 'bars', g = K.svg(F);
      // the number shown comes from the style's own headline or sub (digits, or number words like "one million")
      const NUMW = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, hundred: 100, thousand: 1000, million: 1e6, billion: 1e9 };
      const num = (() => { const txt = `${s.headline || ''} ${s.sub || ''}`, m = txt.match(/(\d[\d,.]*)\s*(%|×|x\b|th|st|nd|rd)?/i);
        if (m) return { v: parseFloat(m[1].replace(/,/g, '')), suf: (m[2] || '').replace(/^x$/i, '×') };
        let cur = 0; for (const w of txt.toLowerCase().match(/[a-z]+/g) || []) { const n = NUMW[w]; if (n == null) { if (cur) break; continue; } cur = n >= 100 ? (cur || 1) * n : cur + n; }
        return cur ? { v: cur, suf: '' } : null; })();
      words(F, s, c, { x: 120, y: 120, w: 1400, size: 76 });
      const note = (x, y, text, tin) => { const st = s.note === 'hand' ? `font-family:${FONTS.hand};font-size:52px;color:${A};` : s.note === 'mono' ? `font-family:${FONTS.mono};font-size:26px;letter-spacing:.08em;color:${c.ink};text-transform:uppercase;` : `font-size:26px;font-weight:600;color:#fff;background:${A};border-radius:999px;padding:8px 20px;`; show(K.div(F, '', `position:absolute;left:${x}px;top:${y}px;${st}`, text), tin, { rise: 10 }); };
      if (ch === 'bars' || ch === 'compare') { const v = ch === 'bars' ? [32, 45, 41, 58, 66, 92] : [48, 92]; const bw = ch === 'bars' ? 150 : 300, gap = ch === 'bars' ? 70 : 200, x0 = ch === 'bars' ? 300 : 520;
        V.draw(K.path(g, `M 240 880 L 1680 880`, { stroke: c.ink + '55', width: 3 }), { t0: .8, dur: .6, ease: V.glide });
        v.forEach((h, i) => { const hi = i === v.length - 1, x = x0 + i * (bw + gap), e = K.div(F, '', `position:absolute;left:${x}px;bottom:200px;width:${bw}px;border-radius:12px 12px 0 0;background:${hi ? A : c.ink + '2E'};`), n = K.div(F, '', `position:absolute;left:${x}px;width:${bw}px;text-align:center;font-family:${c.font};font-size:${ch === 'compare' ? 64 : 40}px;font-weight:700;color:${hi ? A : c.ink};`);
          V.on((t) => { const p = V.seg(t, 1.0 + i * .14, .6), hh = h * 5.2 * BACK(p); e.style.height = Math.max(0, hh).toFixed(1) + 'px'; n.style.top = (880 - hh - 70).toFixed(1) + 'px'; n.textContent = Math.round(h * V.glide(p)) + (ch === 'compare' ? '%' : ''); n.style.opacity = V.seg(t, 1.1 + i * .14, .3); }); });
        note(ch === 'bars' ? 1420 : 1240, 340, ch === 'bars' ? 'best quarter' : 'after', 2.6); if (ch === 'compare') note(560, 600, 'before', 2.4); }
      else if (ch === 'line') { const pts = [30, 34, 31, 42, 47, 45, 58, 66, 63, 80, 88].map((v, i) => [260 + i * 140, 880 - v * 5.6]), d = 'M' + pts.map((p) => p.join(' ')).join(' L');
        V.draw(K.path(g, 'M 240 880 L 1680 880', { stroke: c.ink + '55', width: 3 }), { t0: .8, dur: .6 }); V.draw(K.path(g, d, { stroke: A, width: 7 }), { t0: 1.0, dur: 1.6, ease: V.glide });
        const dot = K.sv(g, 'circle', { cx: pts[10][0], cy: pts[10][1], r: 16, fill: A }); pop(dot, 2.6, .4); note(1180, pts[10][1] - 30, 'record high', 2.8); }
      else if (ch === 'donut') { const pv = num && num.v <= 100 ? num.v : 72; VGEData.donut(g, { cx: 700, cy: 600, r: 220, w: 56, value: pv / 100, t0: 1.0, dur: 1.4, color: A, track: c.ink + '1F' }); VGEData.counter(F, { x: 700, y: 520, to: pv, fmt: (v) => Math.round(v) + '%', t0: 1.0, dur: 1.4, size: 140, color: c.ink, align: 'center' }); note(1100, 560, 'of teams adopted it', 2.2); }
      else if (ch === 'units') { VGEData.units(g, { x: 300, y: 380, cols: 20, rows: 6, n: num && num.v <= 120 ? Math.round(num.v) : 86, size: 48, gap: 16, t0: 1.0, dur: 2.0, color: A, muted: c.ink + '1F' }); note(300, 820, `${num && num.v <= 120 ? Math.round(num.v) : 86} of 120`, 2.8); }
      else { const to = num ? num.v : 3.2, dec = to % 1 ? 1 : 0, suf = num ? num.suf : '×'; VGEData.counter(F, { x: 120, y: 380, from: 0, to, fmt: (v) => (dec ? v.toFixed(1) : Math.round(v).toLocaleString('en-US')) + suf, t0: 1.0, dur: 1.6, size: to >= 1e5 ? 200 : 320, color: A }); }
    },
    diagram(F, s) {
      const c = dress(F, s, .3), A = c.accent, g = K.svg(F), lay = s.layout || 'hub', nd = s.node || 'card', lk = s.link || 'curve';
      words(F, s, c, { x: 120, y: 110, w: 1500, size: 70 });
      const P = { hub: [[1060, 600], [700, 420], [700, 780], [1420, 420], [1420, 780], [1060, 330]], chain: [[360, 620], [700, 620], [1040, 620], [1380, 620], [1720, 620]],
        tree: [[1040, 380], [700, 600], [1380, 600], [520, 840], [880, 840], [1200, 840], [1560, 840]], grid: [[620, 420], [1040, 420], [1460, 420], [620, 680], [1040, 680], [1460, 680], [620, 920], [1040, 920], [1460, 920]],
        cycle: [0, 1, 2, 3, 4].map((i) => [1040 + 330 * Math.cos(i / 5 * 6.283 - 1.57), 640 + 290 * Math.sin(i / 5 * 6.283 - 1.57)]) }[lay];
      const E = { hub: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]], chain: [[0, 1], [1, 2], [2, 3], [3, 4]], tree: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], grid: [[0, 1], [1, 2], [0, 3], [3, 6], [4, 5], [4, 7], [5, 8], [1, 4]], cycle: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] }[lay];
      const LB = { timeline: ['1998', '2004', '2011', '2017', '2026', '2030', '1990', '1985', '2040'], 'scale-dive': ['North', 'Market', 'Central', 'Harbour', 'Airport', 'Park', 'Docks', 'Hill', 'Bay'],
        'assembly-iso': ['Lobby', 'Studio', 'Kitchen', 'Lab', 'Store', 'Office', 'Lounge', 'Deck', 'Hall'], 'print-treatments': ['Port', 'Coast', 'Pass', 'Valley', 'Desert', 'Oasis', 'Ridge', 'Ford', 'Bay'] }[s.family] || ['Data', 'Ingest', 'Model', 'Review', 'Ship', 'Learn', 'Store', 'Report', 'Alert'];
      E.forEach(([a, b], i) => { const [x1, y1] = P[a], [x2, y2] = P[b], mx = (x1 + x2) / 2, d = lk === 'curve' ? `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}` : `M ${x1} ${y1} L ${x2} ${y2}`;
        const p = K.path(g, d, { stroke: lk === 'flow' ? A : c.ink + '66', width: lk === 'flow' ? 5 : 3, dash: lk === 'dashed' || lk === 'flow' ? '12 12' : null }); V.draw(p, { t0: 1.0 + i * .15, dur: .6, ease: V.glide }); if (lk === 'flow') V.flow(p, { t0: 1.6, speed: 70 }); });
      P.forEach(([x, y], i) => { const hub = lay === 'hub' && i === 0, lb = LB[i % LB.length];
        if (nd === 'sketch') { VGESketch.rect(g, x - 110, y - 56, 220, 112, { t0: .6 + i * .15, seed: 3 + i, color: c.ink }); VGESketch.write(F, { x: x - 80, y: y - 34, text: lb, size: 52, t0: .9 + i * .15, color: hub ? A : c.ink }); return; }
        const css = nd === 'circle' ? `width:${hub ? 200 : 150}px;height:${hub ? 200 : 150}px;border-radius:50%;` : nd === 'iso' ? 'width:150px;height:150px;border-radius:18px;transform:rotateX(55deg) rotateZ(45deg);' : 'width:220px;height:110px;border-radius:20px;';
        const e = K.div(F, '', `position:absolute;left:${x}px;top:${y}px;${css}background:${hub || (lay === 'cycle' && i === 0) ? A : c.dark ? '#FFFFFF14' : nd === 'iso' ? A + '40' : '#FFFFFF'};box-shadow:${c.dark ? 'inset 0 0 0 2px #FFFFFF33' : `0 12px 30px rgba(20,10,40,.14), inset 0 0 0 2px ${c.ink}26`};display:flex;align-items:center;justify-content:center;font-family:${c.font};font-size:30px;font-weight:600;color:${hub ? '#fff' : c.ink};`, nd === 'iso' ? '' : lb);
        e.dataset.base = 'translate(-50%,-50%)' + (nd === 'iso' ? ' rotateX(55deg) rotateZ(45deg)' : ''); e.style.transform = e.dataset.base; pop(e, .6 + i * .15);
        if (nd === 'iso') show(K.div(F, '', `position:absolute;left:${x - 100}px;top:${y + 70}px;width:200px;text-align:center;font-family:${c.font};font-size:28px;font-weight:600;color:${c.ink};`, lb), .9 + i * .15, { rise: 8 }); });
    },
    photo(F, s) {
      const c = dress(F, s), tr = s.treatment || 'full', A = c.accent;
      const ph = (x, y, w, h, n, tin, css = '') => { const p = K.photo(F, { x, y, w, h, src: photo(n) }); p.el.style.cssText += css; show(p.el, tin, { rise: 30, scaleFrom: .97 }); return p; };
      if (tr === 'full' || tr === 'duotone' || tr === 'bw') { const p = ph(0, 0, 1920, 1080, s.photo, .1); V.on((t) => { p.img.style.transform = `scale(${(1.1 - .06 * V.seg(t, 0, 6)).toFixed(4)})`; });
        if (tr === 'bw') p.img.style.filter = 'grayscale(1) contrast(1.2)'; if (tr === 'duotone') { p.img.style.filter = 'grayscale(1) contrast(1.1)'; K.div(F, 'fill', `background:${A};mix-blend-mode:multiply;opacity:.85;`); K.div(F, 'fill', `background:${c.accent2};mix-blend-mode:screen;opacity:.25;`); }
        K.div(F, 'fill', 'background:linear-gradient(90deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.15) 60%, transparent 100%);'); words(F, s, { ...c, ink: '#FFFFFF', sub: '#FFFFFFCC' }, { x: 120, y: 540, w: 1000, size: 120, v: 'mid' }); }
      else if (tr === 'polaroid') { [['team', 1060, 200, -6], ['desk', 1380, 340, 5], ['present', 1150, 560, -2]].forEach(([n, x, y, r], i) => { const card = K.div(F, '', `position:absolute;left:${x}px;top:${y}px;width:440px;height:500px;background:#fff;padding:22px 22px 90px;box-shadow:0 20px 50px rgba(0,0,0,.25);`); card.dataset.base = `rotate(${r}deg)`;
          const im = document.createElement('img'); im.src = photo(i === 0 ? s.photo : n); im.style.cssText = 'width:396px;height:388px;object-fit:cover;display:block;'; card.appendChild(im); pop(card, .4 + i * .35, .6); }); words(F, s, c, { x: 120, y: 540, w: 860, size: 110, v: 'mid' }); }
      else if (tr === 'split') { ph(960, 0, 960, 1080, s.photo, .1); words(F, s, c, { x: 120, y: 540, w: 720, size: 104, v: 'mid' }); }
      else if (tr === 'mosaic') { [[s.photo, 1000, 120, 420, 400], ['desk', 1440, 120, 360, 260], ['lab', 1440, 400, 360, 560], ['meeting', 1000, 540, 420, 420]].forEach(([n, x, y, w, h], i) => ph(x, y, w, h, n, .3 + i * .2, `border-radius:${s.radius ?? 18}px;`)); words(F, s, c, { x: 120, y: 540, w: 820, size: 104, v: 'mid' }); }
      else { const p = ph(1060, 140, 700, 800, s.photo, .2, 'border-radius:350px 350px 24px 24px;'); words(F, s, c, { x: 120, y: 540, w: 860, size: 110, v: 'mid' }); }
    },
    ident(F, s) {
      const c = dress(F, s, .45), A = c.accent, B = c.accent2, g = K.svg(F), mk = s.mark || 'ring', fin = s.finish || 'solid', cx = 700, cy = 540;
      const defs = g.querySelector('defs') || K.sv(g, 'defs', {}), lg = K.sv(defs, 'linearGradient', { id: 'idg', x1: 0, y1: 0, x2: 1, y2: 1 }); K.sv(lg, 'stop', { offset: 0, 'stop-color': A }); K.sv(lg, 'stop', { offset: 1, 'stop-color': B });
      const paint = fin === 'gradient' ? 'url(#idg)' : A;
      const D = { ring: `M ${cx - 130} ${cy} a 130 130 0 1 0 260 0 a 130 130 0 1 0 -260 0`, triangle: `M ${cx} ${cy - 140} L ${cx + 140} ${cy + 110} L ${cx - 140} ${cy + 110} Z`, square: `M ${cx - 120} ${cy - 120} L ${cx + 120} ${cy - 120} L ${cx + 120} ${cy + 120} L ${cx - 120} ${cy + 120} Z`,
        blob: `M ${cx} ${cy - 140} C ${cx + 120} ${cy - 150}, ${cx + 160} ${cy - 20}, ${cx + 120} ${cy + 80} C ${cx + 80} ${cy + 170}, ${cx - 90} ${cy + 160}, ${cx - 130} ${cy + 60} C ${cx - 170} ${cy - 50}, ${cx - 110} ${cy - 130}, ${cx} ${cy - 140} Z`,
        monogram: `M ${cx - 130} ${cy} a 130 130 0 1 0 260 0 a 130 130 0 1 0 -260 0`, stack: `M ${cx - 130} ${cy - 110} L ${cx + 130} ${cy - 110} M ${cx - 130} ${cy} L ${cx + 90} ${cy} M ${cx - 130} ${cy + 110} L ${cx + 40} ${cy + 110}` }[mk];
      const out = K.path(g, D, { stroke: fin === 'outline' ? A : c.ink, width: mk === 'stack' ? 46 : 6 }); out.setAttribute('stroke-linejoin', 'round'); V.draw(out, { t0: .3, dur: 1.0, ease: V.glide });
      if (fin !== 'outline' && mk !== 'stack') { const f = K.sv(g, 'path', { d: D, fill: paint }); if (fin === 'glow') f.style.filter = `drop-shadow(0 0 40px ${A})`; V.on((t) => { f.style.opacity = V.glide(V.seg(t, 1.2, .5)); }); }
      if (mk === 'stack') { out.setAttribute('stroke', paint); out.setAttribute('stroke-linecap', 'round'); }
      if (mk === 'monogram') { const m = K.div(F, '', `position:absolute;left:${cx - 130}px;top:${cy - 130}px;width:260px;height:260px;display:flex;align-items:center;justify-content:center;font-family:${c.font};font-size:150px;font-weight:800;color:${fin === 'outline' ? A : '#fff'};`, (s.headline || 'N')[0]); pop(m, 1.5); }
      const name = (s.headline || 'Nova').split(' ')[0];
      words(F, { ...s, headline: name, layout: 'left', accentWord: '' }, c, { x: 900, y: 540, w: 960, size: 160, at: 1.6, v: 'mid' });
    },
  };
  // ---- story: characters on jointed limbs in a layered world (2D, all code). Spec keys: world, character, cast, action,
  // time, line (+ the usual palette/font/texture/headline/sub). The world scrolls in parallax while the cast walks in place.
  const SKY = { day: ['#BFE3FF', '#FDF6E9'], dusk: ['#FF9A6B', '#6A4C93'], night: ['#0B1030', '#2A3366'] };
  const LAND = { day: ['#B5D99C', '#86BE77', '#5E9B5E'], dusk: ['#D98C88', '#A6627F', '#704269'], night: ['#34467A', '#253461', '#182345'] };
  const SKIN = ['#F2C7A5', '#C98B62', '#8D5A3B'];
  KINDS.story = function (F, s) {
    const tm = s.time || 'day', W = s.world || 'hills', ch = s.character || 'flat', n = Math.max(1, Math.min(3, s.cast || 1)), act = s.action || 'walk';
    const sky = s.world === 'space' ? ['#05040C', '#1A1440'] : SKY[tm], land = LAND[tm], c = dress(F, { ...s, bg: s.bg && W === 'paper-town' ? s.bg : `linear-gradient(180deg, ${sky[0]} 0%, ${sky[1]} 100%)`, shapes: 'none', texture: 'none' });
    if (!s.ink || ((tm === 'night' || W === 'space') && lum(s.ink) < .5)) c.ink = tm === 'day' && W !== 'space' ? '#1A1323' : '#FFFFFF'; c.sub = c.ink + 'B3'; // titles stay readable on a night sky
    const R = K.rand(23), g = K.svg(F), defs = g.querySelector('defs') || K.sv(g, 'defs', {}), stroke = s.line === 'ink' || s.line === 'crayon' ? '#1A1323' : 'none';
    if (s.line === 'crayon') { const f = K.sv(defs, 'filter', { id: 'crayon' }); K.sv(f, 'feTurbulence', { type: 'fractalNoise', baseFrequency: .035, numOctaves: 2, seed: 4, result: 'n' }); K.sv(f, 'feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 6 }); }
    const sty = (el) => { if (el.getAttribute('fill') === 'none') return el; if (stroke !== 'none') { el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', 4); el.setAttribute('stroke-linejoin', 'round'); } if (s.line === 'crayon') el.setAttribute('filter', 'url(#crayon)'); return el; }; // stroke-only parts (limbs) keep their own colour and no filter
    // the sky: sun or moon, stars at night or in space
    if (tm === 'night' || W === 'space') for (let i = 0; i < 80; i++) { const st = K.sv(g, 'circle', { cx: R() * 1920, cy: R() * 600, r: 1 + R() * 2.2, fill: '#FFFFFF' }), ph = R() * 6; V.on((t) => { st.style.opacity = (.4 + .6 * Math.abs(Math.sin(t * 1.3 + ph))).toFixed(3); }); }
    if (W !== 'office') { const sun = K.sv(g, 'circle', { cx: 1560, cy: 230, r: tm === 'night' ? 70 : 110, fill: tm === 'night' ? '#F4F1E1' : tm === 'dusk' ? '#FFD27A' : '#FFE9A8' }); if (tm !== 'night') sun.style.filter = 'drop-shadow(0 0 40px rgba(255,210,120,.7))'; V.vis(sun, { tin: .1, rise: 30, din: 1 }); }
    // parallax layers: each drawn twice across 3840 px so the scroll loops; speed per layer
    const layer = (speed, draw) => { const L = K.sv(g, 'g', {}); [0, 1920].forEach((ox) => draw(L, ox)); if (W !== 'office') V.on((t) => L.setAttribute('transform', `translate(${(-(t * speed) % 1920).toFixed(1)} 0)`)); return L; };
    const hill = (L, ox, y, amp, col, seed) => { const r = K.rand(seed); let d = `M ${ox} 1080 L ${ox} ${y}`; for (let x = 0; x <= 1920; x += 160) d += ` Q ${ox + x + 80} ${y - amp * (.4 + r())} ${ox + x + 160} ${y}`; sty(K.sv(L, 'path', { d: d + ` L ${ox + 1920} 1080 Z`, fill: col })); };
    const GROUND = 840;
    if (W === 'hills' || W === 'forest' || W === 'paper-town') { layer(20, (L, ox) => hill(L, ox, 640, 120, land[0], 3)); layer(45, (L, ox) => hill(L, ox, 730, 90, land[1], 7)); }
    if (W === 'forest') [[60, .55, land[1]], [110, .8, land[2]]].forEach(([sp, k, col], j) => layer(sp, (L, ox) => { const r = K.rand(11 + j); for (let x = 40; x < 1920; x += 150 + r() * 120) { const h = (180 + r() * 160) * k, y = GROUND - 20 + j * 30; sty(K.sv(L, 'path', { d: `M ${ox + x} ${y - h} L ${ox + x + h * .35} ${y} L ${ox + x - h * .35} ${y} Z`, fill: col })); } }));
    if (W === 'city') [[25, .55, tm === 'night' ? '#26305A' : '#9DB2CF'], [60, .85, tm === 'night' ? '#161D3D' : '#5D6F8F']].forEach(([sp, k, col], j) => layer(sp, (L, ox) => { const r = K.rand(31 + j); for (let x = 0; x < 1920; ) { const w = 90 + r() * 130, h = (220 + r() * 360) * k, y = GROUND - (j ? 0 : 90); sty(K.sv(L, 'rect', { x: ox + x, y: y - h, width: w, height: h, fill: col }));
        for (let wy = y - h + 26; wy < y - 30; wy += 46) for (let wx = x + 16; wx < x + w - 24; wx += 34) if (r() > .35) K.sv(L, 'rect', { x: ox + wx, y: wy, width: 16, height: 22, fill: tm === 'night' ? (r() > .4 ? '#FFD86B' : '#3A4578') : 'rgba(255,255,255,.55)' }); x += w + 8; } }));
    if (W === 'desert') { layer(18, (L, ox) => hill(L, ox, 700, 70, tm === 'night' ? '#4A3F6B' : '#F2C98B', 5)); layer(40, (L, ox) => hill(L, ox, 780, 60, tm === 'night' ? '#382F57' : '#E3A86A', 9)); layer(70, (L, ox) => { const r = K.rand(14); for (let x = 200; x < 1920; x += 500 + r() * 300) sty(K.sv(L, 'path', { d: `M ${ox + x} ${GROUND} L ${ox + x} ${GROUND - 170} M ${ox + x} ${GROUND - 100} L ${ox + x - 40} ${GROUND - 100} L ${ox + x - 40} ${GROUND - 150} M ${ox + x} ${GROUND - 120} L ${ox + x + 40} ${GROUND - 120} L ${ox + x + 40} ${GROUND - 160}`, stroke: '#4E8F57', 'stroke-width': 26, 'stroke-linecap': 'round', fill: 'none' })); }); }
    if (W === 'sea') { K.sv(g, 'rect', { x: 0, y: 620, width: 1920, height: 460, fill: tm === 'night' ? '#152451' : tm === 'dusk' ? '#5C4A8C' : '#4FA3D9' }); for (let i = 0; i < 4; i++) { const wv = sty(K.sv(g, 'path', { fill: 'none', stroke: 'rgba(255,255,255,.55)', 'stroke-width': 4, 'stroke-linecap': 'round' })); V.on((t) => { let d = ''; for (let x = -40; x <= 1960; x += 40) d += `${x === -40 ? 'M' : 'L'} ${x} ${(660 + i * 50 + 8 * Math.sin(x / 90 + t * 2 + i)).toFixed(1)} `; wv.setAttribute('d', d); }); }
      const boat = sty(K.sv(g, 'path', { d: 'M 1200 640 L 1360 640 L 1330 680 L 1230 680 Z M 1280 640 L 1280 520 L 1350 630 Z', fill: '#FFFFFF' })); V.on((t) => boat.setAttribute('transform', `translate(${(-30 * t).toFixed(1)} ${(4 * Math.sin(t * 2)).toFixed(1)})`)); }
    if (W === 'space') { const pl = sty(K.sv(g, 'circle', { cx: 960, cy: 2300, r: 1500, fill: '#5B3FA8' })); K.sv(g, 'circle', { cx: 1500, cy: 260, r: 90, fill: '#F2A65A' }); K.sv(g, 'ellipse', { cx: 1500, cy: 260, rx: 160, ry: 26, fill: 'none', stroke: '#FFD9A8', 'stroke-width': 6 }); V.on((t) => pl.setAttribute('transform', `rotate(${(-t * 1.2).toFixed(2)} 960 2300)`)); }
    if (W === 'office') { K.sv(g, 'rect', { x: 0, y: 0, width: 1920, height: GROUND, fill: tm === 'night' ? '#2A2F4A' : '#EFE8DD' }); sty(K.sv(g, 'rect', { x: 1180, y: 150, width: 520, height: 380, rx: 12, fill: `url(#skyg)` })); const sg = K.sv(defs, 'linearGradient', { id: 'skyg', x1: 0, y1: 0, x2: 0, y2: 1 }); K.sv(sg, 'stop', { offset: 0, 'stop-color': sky[0] }); K.sv(sg, 'stop', { offset: 1, 'stop-color': sky[1] });
      sty(K.sv(g, 'rect', { x: 1240, y: 640, width: 520, height: 26, fill: '#8C6A4F' })); sty(K.sv(g, 'rect', { x: 1400, y: 520, width: 200, height: 120, rx: 10, fill: '#1A1323' })); sty(K.sv(g, 'path', { d: 'M 300 840 L 330 700 L 390 700 L 420 840 Z', fill: '#C98B62' })); sty(K.sv(g, 'circle', { cx: 360, cy: 650, r: 70, fill: '#5E9B5E' })); }
    if (W === 'paper-town') layer(75, (L, ox) => { const r = K.rand(41); for (let x = 30; x < 1920; x += 230 + r() * 80) { const w = 150 + r() * 60, h = 140 + r() * 120, col = [s.accent || '#FF8A5B', s.accent2 || '#7EC8B0', '#FFD86B', '#C9B6F2'][Math.floor(r() * 4)];
      const hs = K.sv(L, 'g', { style: 'filter:drop-shadow(5px 7px 0 rgba(60,40,20,.2))' }); sty(K.sv(hs, 'rect', { x: ox + x, y: GROUND - h, width: w, height: h, fill: col })); sty(K.sv(hs, 'path', { d: `M ${ox + x - 14} ${GROUND - h} L ${ox + x + w / 2} ${GROUND - h - 90} L ${ox + x + w + 14} ${GROUND - h} Z`, fill: '#E2552F' })); K.sv(hs, 'rect', { x: ox + x + w / 2 - 20, y: GROUND - 70, width: 40, height: 70, fill: '#5E3A2A' }); } });
    if (W !== 'space' && W !== 'sea') sty(K.sv(g, 'rect', { x: 0, y: GROUND, width: 1920, height: 240, fill: W === 'office' ? (tm === 'night' ? '#1D2136' : '#C9B8A3') : W === 'desert' ? (tm === 'night' ? '#2E2648' : '#D9944F') : W === 'city' ? (tm === 'night' ? '#3A4470' : '#7F8BA0') : land[2] }));
    if (W === 'sea') sty(K.sv(g, 'path', { d: `M 0 ${GROUND + 20} Q 960 ${GROUND - 30} 1920 ${GROUND + 20} L 1920 1080 L 0 1080 Z`, fill: tm === 'night' ? '#2E2648' : '#E9CD94' }));
    // the cast: jointed puppets, feet on the ground
    const feet = W === 'space' ? 830 : GROUND + 20;
    const puppet = (x, k, i) => {
      const P = K.sv(g, 'g', {}), skin = SKIN[i % 3], body = [c.accent, c.accent2, '#FFB547'][i % 3], dark = ch === 'silhouette' ? '#0A0812' : ch === 'stick' && (tm !== 'day' || W === 'space') ? '#F2EEF8' : '#2A2433'; // limbs stay visible on dark ground
      if (ch === 'paper') P.style.filter = 'drop-shadow(5px 7px 0 rgba(60,40,20,.22))'; if (ch === 'silhouette') P.style.filter = 'drop-shadow(0 0 26px rgba(255,200,120,.65))';
      const fillOf = (col) => ch === 'silhouette' ? '#0A0812' : col, part = (tag, a, piv) => { const gp = K.sv(P, 'g', {}); const e = sty(K.sv(gp, tag, a)); gp.piv = piv; return gp; };
      const stick = ch === 'stick', round = ch === 'round', masc = ch === 'mascot', LW = stick ? 10 : 30;
      const limb = (px, py, len, col) => part('path', { d: `M ${px} ${py} L ${px} ${py + len}`, stroke: fillOf(col), 'stroke-width': LW, 'stroke-linecap': 'round', fill: 'none' }, [px, py]);
      const legL = limb(-16, -110, 110, dark), legR = limb(16, -110, 110, dark);
      let torso, head;
      if (masc) { torso = part('ellipse', { cx: 0, cy: -190, rx: 110, ry: 130, fill: fillOf(body) }, [0, -110]); }
      else if (stick) torso = part('path', { d: 'M 0 -110 L 0 -240', stroke: fillOf(dark), 'stroke-width': 10, 'stroke-linecap': 'round', fill: 'none' }, [0, -110]);
      else torso = part('rect', { x: round ? -56 : -48, y: -235, width: round ? 112 : 96, height: 130, rx: round ? 50 : 26, fill: fillOf(body) }, [0, -110]);
      const armL = limb(masc ? -100 : -50, masc ? -200 : -222, masc ? 70 : 100, masc ? body : stick ? dark : skin), armR = limb(masc ? 100 : 50, masc ? -200 : -222, masc ? 70 : 100, masc ? body : stick ? dark : skin);
      const hy = masc ? -200 : round ? -310 : -292, hr = masc ? 0 : round ? 78 : stick ? 40 : 54;
      head = K.sv(P, 'g', {}); if (!masc) sty(K.sv(head, 'circle', { cx: 0, cy: hy, r: hr, fill: stick ? (ch === 'silhouette' ? '#0A0812' : '#FFFFFF') : fillOf(skin) }));
      if (!masc && !stick && ch !== 'silhouette') sty(K.sv(head, 'path', { d: `M ${-hr} ${hy - 6} Q ${-hr * .6} ${hy - hr * 1.5} ${hr * .2} ${hy - hr * 1.05} Q ${hr * 1.1} ${hy - hr * 1.2} ${hr} ${hy - 6} Q ${hr * .3} ${hy - hr * .55} ${-hr} ${hy - 6} Z`, fill: ['#3A2A22', '#1A1323', '#7A4A2A'][i % 3] }));
      if (masc) { [-34, 34].forEach((ex) => { K.sv(head, 'circle', { cx: ex, cy: -230, r: 26, fill: '#FFFFFF' }); K.sv(head, 'circle', { cx: ex + 4, cy: -228, r: 12, fill: '#1A1323' }); }); sty(K.sv(head, 'path', { d: 'M 0 -318 L 0 -360', stroke: fillOf(body), 'stroke-width': 8 })); K.sv(head, 'circle', { cx: 0, cy: -366, r: 12, fill: c.accent2 }); }
      const eyes = K.sv(head, 'g', {}); if (!masc && ch !== 'silhouette') [-hr * .34, hr * .34].forEach((ex) => K.sv(eyes, 'circle', { cx: ex, cy: hy + 2, r: Math.max(4, hr * .09), fill: '#1A1323' }));
      const mouth = ch === 'silhouette' ? null : K.sv(head, 'ellipse', { cx: 0, cy: masc ? -170 : hy + hr * .42, rx: masc ? 22 : hr * .22, ry: 3, fill: '#1A1323' });
      const ph = i * 1.7, speaker = i === 0;
      V.on((t) => {
        const w = act === 'walk' ? Math.sin(t * 6 + ph) : 0, bob = act === 'walk' ? Math.abs(Math.sin(t * 6 + ph)) * 8 : 0;
        const jp = act === 'jump' ? Math.max(0, Math.sin(((t + ph * .2) % 1.6) / 1.6 * Math.PI)) : 0, y = -bob - jp * 160;
        const rot = (gp, a) => gp.setAttribute('transform', `rotate(${a.toFixed(2)} ${gp.piv[0]} ${gp.piv[1]})`);
        rot(legL, 26 * w); rot(legR, -26 * w);
        const wave = act === 'wave' && (speaker || i === 2) ? 150 + 22 * Math.sin(t * 7 + ph) : null;
        rot(armL, act === 'walk' ? -24 * w : jp > 0 ? -150 * jp : 6 * Math.sin(t * 1.4 + ph)); rot(armR, wave != null ? -wave : act === 'walk' ? 24 * w : jp > 0 ? 150 * jp : act === 'talk' && speaker ? -40 - 20 * Math.sin(t * 2.4) : -6 * Math.sin(t * 1.4 + ph));
        const look = act === 'look' ? 14 * Math.sin(t * 1.1 + ph) : act === 'talk' ? 4 * Math.sin(t * 2.2) : 0;
        head.setAttribute('transform', `rotate(${look.toFixed(2)} 0 ${hy + hr})`);
        const blink = ((t + ph) % 3.1) < .12; eyes.setAttribute('transform', `translate(0 ${hy}) scale(1 ${blink ? .1 : 1}) translate(0 ${-hy})`);
        if (mouth) mouth.setAttribute('ry', (act === 'talk' && speaker ? 3 + 9 * Math.abs(Math.sin(t * 11)) * (Math.sin(t * 1.7) > -.3 ? 1 : 0) : 3).toFixed(1));
        const q = ch === 'paper' ? Math.floor(t * 12) / 12 : t, j = ch === 'paper' ? Math.sin(q * 41 + i) * .8 : 0;
        P.setAttribute('transform', `translate(${x} ${(feet + y).toFixed(1)}) scale(${k}) rotate(${j.toFixed(2)})`);
        P.style.opacity = V.glide(V.seg(t, .3 + i * .25, .6)).toFixed(3);
      });
      return P;
    };
    const X = n === 1 ? [880] : n === 2 ? [720, 1060] : [620, 900, 1180];
    X.forEach((x, i) => puppet(x, [1.15, 1.0, .9][i] * (ch === 'mascot' ? .9 : 1), i));
    if (act === 'talk' && s.sub) { const b = K.div(F, '', `position:absolute;left:${X[0] + 90}px;top:${feet - 560}px;max-width:560px;padding:22px 30px;border-radius:30px;background:#FFFFFF;color:#1A1323;font-family:${c.font};font-size:34px;font-weight:600;box-shadow:0 12px 30px rgba(0,0,0,.18);`, s.sub); show(b, 1.2, { rise: 16, scaleFrom: .9 }); }
    words(F, { ...s, sub: act === 'talk' ? '' : s.sub }, c, { x: 120, y: 90, w: 1100, size: 76 });
    if (s.texture && s.texture !== 'none') { if (s.texture === 'paper' || s.texture === 'grain') K.div(F, 'fill grain-live', 'opacity:.45;pointer-events:none;'); if (s.texture === 'vignette') K.div(F, 'fill', 'background:radial-gradient(85% 85% at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%);'); if (s.texture === 'halftone') K.div(F, 'fill', `background-image:radial-gradient(rgba(0,0,0,.18) 30%, transparent 33%);background-size:14px 14px;mix-blend-mode:multiply;`); }
  };
  // register every style that has a spec but no hand-built demo
  const P = window.VGEStyleParams || {}, all = window.VGEStyleDemos = window.VGEStyleDemos || {};
  Object.entries(P).forEach(([id, s]) => { if (!all[id] && KINDS[s.kind]) all[id] = { dur: 6, still: s.still ?? 4.6, build: (F) => KINDS[s.kind](F, s) }; });
  window.VGEKinds = KINDS;
})();
