// Storyboard panel drawing: 1920x1080 SVG wireframes on the real grid and type scale. Blue dashed = motion annotation.
(function () {
  const C = {
    paper: '#F7F4EF', paperJ: '#F7F5FA', ink: '#1A1323', ink2: '#5E5868', line: '#E6E0D8', lineJ: '#E2DCEA',
    p: '#A100FF', pl: '#D7A8FF', pp: '#F2EAFD', deepA: '#5B12A8', deepB: '#2A0846', amber: '#F5A524',
    risk: '#E5484D', ok: '#1E9E6A', idle: '#D5CCE3', ann: '#0B8FD8', white: '#fff',
  };
  const X = (n) => 120 + (n - 1) * 142, SP = (k) => 142 * k - 24;
  const R = { label: [30, 40, 400], sub: [40, 56, 400], head: [72, 96, 600], state: [96, 120, 600], disp: [168, 168, 600] };
  let UID = 0, G = 'studio', F = 'pjs';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const kw = (s, k) => esc(s).replace(/\*(.+?)\*/g, `<tspan fill="${k}">$1</tspan>`);
  const rnd = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  // ---- text in slots (T1 / T2 / T3 or {x,y,a}) ------------------------------------------------------------
  function block(slot, items) {
    let h = 0; const rows = [];
    items.forEach(([role, t, o = {}], i) => { const [fs, lh, fw] = R[role]; const L = Array.isArray(t) ? t : [t]; if (i) h += 16; rows.push({ role, L, o, fs, lh, fw, y: h }); h += L.length * lh; });
    let x = 120, y0 = 120, a = 'start';
    if (slot === 'T1') y0 = 520 - h / 2;
    else if (slot === 'T3') { x = 960; y0 = 520 - h / 2; a = 'middle'; }
    else if (typeof slot === 'object') { x = slot.x; y0 = slot.y; a = slot.a || 'start'; if (slot.cy) y0 = slot.cy - h / 2; }
    const deep = G === 'deep';
    return rows.map((r) => {
      const big = r.role === 'head' || r.role === 'state' || r.role === 'disp';
      const fam = big && F === 'pjs' ? "'Plus Jakarta Sans'" : 'Inter';
      const col = r.o.c || (deep ? (big ? '#fff' : 'rgba(255,255,255,.78)') : (big ? C.ink : C.ink2));
      const k = r.o.k || (deep ? C.pl : C.p);
      const ls = big ? (r.role === 'disp' ? -3.4 : -0.8) : 0;
      return r.L.map((ln, i) => `<text x="${x}" y="${(y0 + r.y + i * r.lh + r.lh / 2 + r.fs * 0.36).toFixed(1)}" font-size="${r.fs}" font-weight="${r.fw}" fill="${col}" text-anchor="${a}" letter-spacing="${ls}" font-family="${fam}">${kw(ln, k)}</text>`).join('');
    }).join('');
  }
  const T1 = (...it) => block('T1', it), T2 = (...it) => block('T2', it), T3 = (...it) => block('T3', it), TB = (slot, ...it) => block(slot, it);

  // ---- grounds -----------------------------------------------------------------------------------------------
  function ground(g) {
    if (g === 'deep') return `<rect width="1920" height="1080" fill="url(#gDeep)"/><circle cx="1840" cy="1160" r="620" fill="none" stroke="rgba(215,168,255,.22)" stroke-width="2"/>`;
    if (g === 'journey') return `<rect width="1920" height="1080" fill="${C.paperJ}"/><rect width="1920" height="1080" fill="url(#gLightJ)"/><circle cx="1840" cy="1160" r="640" fill="url(#gArcJ)"/><circle cx="1840" cy="1160" r="640" fill="none" stroke="#E4D9F2" stroke-width="2"/>`;
    return `<rect width="1920" height="1080" fill="${C.paper}"/><rect width="1920" height="1080" fill="url(#gLightS)"/><circle cx="80" cy="1180" r="660" fill="url(#gArcS)"/><circle cx="80" cy="1180" r="660" fill="none" stroke="#E9DCCB" stroke-width="2"/>`;
  }
  function panel(g, f, inner) { G = g; F = f; const body = inner(); return `<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" font-family="Inter">${ground(g)}${body}</svg>`; }

  // ---- annotations -------------------------------------------------------------------------------------------
  const A = {
    arr: (d) => `<path d="${d}" fill="none" stroke="${C.ann}" stroke-width="6" stroke-dasharray="18 12" stroke-linecap="round" marker-end="url(#ah)"/>`,
    note: (x, y, t, a = 'start') => `<text x="${x}" y="${y}" font-size="40" font-weight="600" fill="${C.ann}" text-anchor="${a}" font-family="Inter">${esc(t)}</text>`,
    n: (x, y, k) => `<circle cx="${x}" cy="${y}" r="30" fill="${C.ann}"/><text x="${x}" y="${y + 12}" font-size="34" font-weight="700" fill="#fff" text-anchor="middle" font-family="Inter">${k}</text>`,
    ghost: (x, y, w, h, r = 16) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${C.ann}" stroke-width="4" stroke-dasharray="14 10"/>`,
    cam: (x, y, w, h) => { const k = 60; return [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].map(([a, b, sx, sy]) => `<path d="M${a} ${b + sy * k} L${a} ${b} L${a + sx * k} ${b}" fill="none" stroke="${C.ann}" stroke-width="6"/>`).join(''); },
  };

  // ---- primitives --------------------------------------------------------------------------------------------
  const P = {
    rect: (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 16}" fill="${o.f || '#fff'}"${o.s ? ` stroke="${o.s}" stroke-width="${o.sw || 2}"` : ''}${o.sh === false ? '' : ' filter="url(#sh)"'} opacity="${o.o ?? 1}"${o.tf ? ` transform="${o.tf}"` : ''}/>`,
    spark: (x, y, r = 12, o = {}) => `<circle cx="${x}" cy="${y}" r="${r * 5}" fill="url(#${o.amber ? 'gSpot' : 'gSpark'})" opacity="${o.o ?? 1}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${o.c || C.p}" opacity="${o.o ?? 1}"/>`,
    line: (d, o = {}) => `<path d="${d}" fill="none" stroke="${o.c || C.p}" stroke-width="${o.w || 6}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} stroke-linecap="round" stroke-linejoin="round" opacity="${o.o ?? 1}"/>`,
    dot: (x, y, r, c, o = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o}"/>`,
    icon: (name, x, y, s = 48, c = C.p, sw = 2) => `<g transform="translate(${x - s / 2},${y - s / 2}) scale(${s / 24})" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${(window.VGE_ICONS || {})[name] || ''}</g>`,
    txt: (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 30}" font-weight="${o.w || 400}" fill="${o.c || C.ink}" text-anchor="${o.a || 'start'}" font-family="${o.f || 'Inter'}">${kw(t, o.k || C.p)}</text>`,
    photo: (file, x, y, w, h, r = 16) => { const id = 'cp' + (++UID); return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath><image href="../../../library/photos/${file}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#gPhoto)"/>`; },
    cursor: (x, y, s = 1) => `<path transform="translate(${x},${y}) scale(${s})" d="M0 0 L0 46 L12 35 L21 54 L29 50 L20 32 L37 32 Z" fill="${C.ink}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>`,
    pill: (x, y, t, kind = 'neutral', w) => { const K = { risk: ['#FDECEC', C.risk], ok: ['#E6F5EE', C.ok], accent: [C.pp, C.p], neutral: ['#fff', C.ink2], deep: [C.p, '#fff'] }[kind]; const ww = w || 36 + t.length * 17; return `<rect x="${x}" y="${y}" width="${ww}" height="56" rx="28" fill="${K[0]}"${kind === 'neutral' ? ' filter="url(#sh)"' : ''}/><text x="${x + ww / 2}" y="${y + 38}" font-size="30" font-weight="600" fill="${K[1]}" text-anchor="middle">${esc(t)}</text>`; },
    bars: (x, y, w, h, n, seed, c = C.idle) => { const r = rnd(seed); let s = ''; const bw = w / n; for (let i = 0; i < n; i++) { const bh = h * (0.25 + r() * 0.75); s += `<rect x="${(x + i * bw + bw * 0.2).toFixed(1)}" y="${(y + (h - bh) / 2).toFixed(1)}" width="${(bw * 0.6).toFixed(1)}" height="${bh.toFixed(1)}" rx="${bw * 0.3}" fill="${c}"/>`; } return s; },
    rows: (x, y, w, n, gap = 22, c = C.line) => { let s = ''; for (let i = 0; i < n; i++) s += `<rect x="${x}" y="${y + i * gap}" width="${w * (i % 3 === 2 ? 0.62 : 1)}" height="10" rx="5" fill="${c}"/>`; return s; },
  };

  // ---- the network of reinventors ----------------------------------------------------------------------------
  function net(seed, n, cx, cy, rx, ry, o = {}) {
    const r = rnd(seed), pts = [];
    for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.pow(r(), o.spread || 0.62); pts.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d]); }
    let s = '';
    if (o.links) for (let i = 0; i < pts.length; i += o.links) { const a = pts[i]; let b = null, bd = 1e12; for (let j = 0; j < pts.length; j++) { if (j === i) continue; const d = (a[0] - pts[j][0]) ** 2 + (a[1] - pts[j][1]) ** 2; if (d < bd) { bd = d; b = pts[j]; } } s += `<line x1="${a[0] | 0}" y1="${a[1] | 0}" x2="${b[0] | 0}" y2="${b[1] | 0}" stroke="${o.lc || '#DCCBF1'}" stroke-width="2.5" opacity="${o.lo ?? 1}"/>`; }
    pts.forEach((p, i) => { s += `<circle cx="${p[0] | 0}" cy="${p[1] | 0}" r="${(o.r || 4) + (i % 6 === 0 ? 2 : 0)}" fill="${o.c || C.p}" opacity="${((o.o ?? 1) * (0.3 + (i % 7) / 10)).toFixed(2)}"/>`; });
    if (o.glow) pts.filter((_, i) => i % o.glow === 0).forEach((p) => { s += `<circle cx="${p[0] | 0}" cy="${p[1] | 0}" r="22" fill="url(#gSpark)"/>`; });
    return s;
  }

  // ---- the frame (MotionLab's signature object) --------------------------------------------------------------
  const frame = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 20}" fill="${o.f || '#fff'}" filter="url(#sh)"${o.lit ? ` stroke="${C.p}" stroke-width="5"` : ` stroke="#ECE6F2" stroke-width="2"`} opacity="${o.o ?? 1}"/>`;

  // ---- mini scenes inside a frame (x, y, w, h) ---------------------------------------------------------------
  const M = {
    product(x, y, w, h) { const cx = x + w * 0.5, cy = y + h * 0.52; return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#F1EAFA"/><ellipse cx="${cx}" cy="${y + h * 0.86}" rx="${w * 0.26}" ry="${h * 0.05}" fill="rgba(42,8,70,.12)"/><circle cx="${x + w * 0.3}" cy="${y + h * 0.3}" r="${h * 0.5}" fill="url(#gSpark)" opacity=".5"/><rect x="${cx - w * 0.12}" y="${cy - h * 0.32}" width="${w * 0.24}" height="${h * 0.6}" rx="${w * 0.03}" fill="${C.ink}" transform="rotate(-12 ${cx} ${cy})"/><rect x="${cx - w * 0.1}" y="${cy - h * 0.28}" width="${w * 0.2}" height="${h * 0.52}" rx="${w * 0.02}" fill="${C.p}" transform="rotate(-12 ${cx} ${cy})"/>`; },
    ui(x, y, w, h, o = {}) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#FBFAFD"/><rect x="${x}" y="${y}" width="${w * 0.22}" height="${h}" rx="18" fill="#EFE9F6"/>${P.rows(x + w * 0.04, y + h * 0.14, w * 0.12, 5, h * 0.12, '#D9CFE6')}${P.rect(x + w * 0.28, y + h * 0.12, w * 0.32, h * 0.32, { sh: false, f: '#fff', s: C.line })}${P.rect(x + w * 0.64, y + h * 0.12, w * 0.3, h * 0.32, { sh: false, f: C.pp })}${P.rows(x + w * 0.28, y + h * 0.56, w * 0.66, 4, h * 0.1)}${o.cursor === false ? '' : P.cursor(x + w * 0.74, y + h * 0.3, h / 260)}`; },
    comms(x, y, w, h) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff"/><rect x="${x + w * 0.08}" y="${y + h * 0.14}" width="${w * 0.46}" height="${h * 0.09}" rx="6" fill="${C.ink}"/><rect x="${x + w * 0.08}" y="${y + h * 0.29}" width="${w * 0.3}" height="${h * 0.06}" rx="5" fill="${C.idle}"/>${[0.45, 0.62, 0.8].map((v, i) => `<rect x="${x + w * (0.12 + i * 0.16)}" y="${y + h * (0.9 - v * 0.5)}" width="${w * 0.1}" height="${h * v * 0.5}" rx="6" fill="${i === 2 ? C.p : C.pl}"/>`).join('')}<line x1="${x + w * 0.08}" y1="${y + h * 0.9}" x2="${x + w * 0.62}" y2="${y + h * 0.9}" stroke="${C.line}" stroke-width="3"/><circle cx="${x + w * 0.8}" cy="${y + h * 0.6}" r="${h * 0.2}" fill="none" stroke="${C.pp}" stroke-width="${h * 0.07}"/><path d="M${x + w * 0.8} ${y + h * 0.4} A${h * 0.2} ${h * 0.2} 0 0 1 ${x + w * 0.8 + h * 0.2} ${y + h * 0.6}" fill="none" stroke="${C.p}" stroke-width="${h * 0.07}"/>`; },
    training(x, y, w, h) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff"/>${[0, 1, 2].map((i) => `<circle cx="${x + w * 0.14}" cy="${y + h * (0.24 + i * 0.22)}" r="${h * 0.07}" fill="${i < 2 ? C.p : '#fff'}" stroke="${C.p}" stroke-width="3"/><rect x="${x + w * 0.24}" y="${y + h * (0.21 + i * 0.22)}" width="${w * (0.5 - i * 0.08)}" height="${h * 0.06}" rx="5" fill="${i < 2 ? C.ink : C.idle}"/>`).join('')}<rect x="${x + w * 0.08}" y="${y + h * 0.86}" width="${w * 0.84}" height="${h * 0.04}" rx="4" fill="${C.line}"/><rect x="${x + w * 0.08}" y="${y + h * 0.86}" width="${w * 0.56}" height="${h * 0.04}" rx="4" fill="${C.p}"/>`; },
    fresh(x, y, w, h) { const cx = x + w / 2, cy = y + h / 2; let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#FBF8FF"/>`; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; s += `<line x1="${cx + Math.cos(a) * h * 0.12}" y1="${cy + Math.sin(a) * h * 0.12}" x2="${cx + Math.cos(a) * h * 0.34}" y2="${cy + Math.sin(a) * h * 0.34}" stroke="${i % 2 ? C.pl : C.amber}" stroke-width="${h * 0.025}" stroke-linecap="round"/>`; } return s + P.spark(cx, cy, h * 0.05); },
    workflow(x, y, w, h) { const n = [[0.16, 0.5], [0.42, 0.26], [0.42, 0.74], [0.72, 0.5], [0.9, 0.5]].map(([a, b]) => [x + a * w, y + b * h]); let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff"/>`; [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]].forEach(([a, b]) => { s += `<path d="M${n[a][0]} ${n[a][1]} C${(n[a][0] + n[b][0]) / 2} ${n[a][1]} ${(n[a][0] + n[b][0]) / 2} ${n[b][1]} ${n[b][0]} ${n[b][1]}" fill="none" stroke="${C.pl}" stroke-width="${h * 0.018}"/>`; }); n.forEach(([a, b], i) => { s += `<rect x="${a - h * 0.09}" y="${b - h * 0.07}" width="${h * 0.18}" height="${h * 0.14}" rx="${h * 0.03}" fill="${i === 3 ? C.p : '#fff'}" stroke="${C.p}" stroke-width="3"/>`; }); return s + P.spark(x + w * 0.57, y + h * 0.38, h * 0.025); },
    mograph(x, y, w, h) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.deepB}"/><circle cx="${x + w * 0.32}" cy="${y + h * 0.48}" r="${h * 0.26}" fill="${C.p}"/><rect x="${x + w * 0.42}" y="${y + h * 0.22}" width="${h * 0.42}" height="${h * 0.42}" rx="${h * 0.06}" fill="none" stroke="${C.pl}" stroke-width="${h * 0.03}" transform="rotate(18 ${x + w * 0.42 + h * 0.21} ${y + h * 0.43})"/><rect x="${x + w * 0.6}" y="${y + h * 0.7}" width="${w * 0.3}" height="${h * 0.07}" rx="6" fill="#fff"/><rect x="${x + w * 0.6}" y="${y + h * 0.82}" width="${w * 0.2}" height="${h * 0.05}" rx="5" fill="${C.amber}"/>`; },
    voice(x, y, w, h) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff"/>${P.bars(x + w * 0.08, y + h * 0.18, w * 0.84, h * 0.36, 30, 7, C.pl)}<rect x="${x + w * 0.08 + w * 0.84 * 0.55}" y="${y + h * 0.12}" width="4" height="${h * 0.48}" fill="${C.p}"/><rect x="${x + w * 0.1}" y="${y + h * 0.72}" width="${w * 0.2}" height="${h * 0.08}" rx="6" fill="${C.ink}"/><rect x="${x + w * 0.33}" y="${y + h * 0.72}" width="${w * 0.22}" height="${h * 0.08}" rx="6" fill="${C.p}"/><rect x="${x + w * 0.58}" y="${y + h * 0.72}" width="${w * 0.3}" height="${h * 0.08}" rx="6" fill="${C.idle}"/>`; },
    styleDeep(x, y, w, h) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#gDeep)"/><circle cx="${x + w * 0.74}" cy="${y + h * 0.5}" r="${h * 0.26}" fill="none" stroke="${C.pl}" stroke-width="${h * 0.02}"/><rect x="${x + w * 0.08}" y="${y + h * 0.36}" width="${w * 0.4}" height="${h * 0.1}" rx="8" fill="#fff"/><rect x="${x + w * 0.08}" y="${y + h * 0.52}" width="${w * 0.26}" height="${h * 0.06}" rx="6" fill="${C.pl}"/>`; },
    finished(x, y, w, h) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#F4EEFB"/><circle cx="${x + w * 0.78}" cy="${y + h * 0.95}" r="${h * 0.55}" fill="none" stroke="#E2D3F4" stroke-width="3"/><rect x="${x + w * 0.08}" y="${y + h * 0.16}" width="${w * 0.42}" height="${h * 0.1}" rx="8" fill="${C.ink}"/><rect x="${x + w * 0.08}" y="${y + h * 0.31}" width="${w * 0.28}" height="${h * 0.06}" rx="6" fill="${C.ink2}"/>${M.workflow(x + w * 0.46, y + h * 0.42, w * 0.46, h * 0.46)}`; },
    routes(x, y, w, h) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.paperJ}"/>${P.line(`M${x + w * 0.12} ${y + h * 0.55} C${x + w * 0.4} ${y + h * 0.1} ${x + w * 0.6} ${y + h * 0.2} ${x + w * 0.88} ${y + h * 0.4}`, { c: C.p, w: h * 0.03 })}${P.line(`M${x + w * 0.12} ${y + h * 0.55} C${x + w * 0.4} ${y + h * 0.9} ${x + w * 0.6} ${y + h * 0.8} ${x + w * 0.88} ${y + h * 0.6}`, { c: C.idle, w: h * 0.02, dash: '10 10' })}${P.dot(x + w * 0.12, y + h * 0.55, h * 0.05, C.risk)}${P.dot(x + w * 0.88, y + h * 0.4, h * 0.05, C.ok)}`; },
    hub(x, y, w, h) { const cx = x + w / 2, cy = y + h / 2; let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.paperJ}"/>`; [[0.18, 0.28], [0.18, 0.72], [0.82, 0.28], [0.82, 0.72]].forEach(([a, b]) => { s += `<line x1="${x + a * w}" y1="${y + b * h}" x2="${cx}" y2="${cy}" stroke="${C.pl}" stroke-width="${h * 0.015}"/><rect x="${x + a * w - w * 0.1}" y="${y + b * h - h * 0.08}" width="${w * 0.2}" height="${h * 0.16}" rx="8" fill="#fff" filter="url(#sh)"/>`; }); return s + `<circle cx="${cx}" cy="${cy}" r="${h * 0.16}" fill="url(#gDeep)"/>`; },
    port(x, y, w, h) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.paperJ}"/><rect x="${x}" y="${y + h * 0.72}" width="${w}" height="${h * 0.28}" rx="0" fill="#ECE4F7"/>${[0.55, 0.7].map((a) => `<path d="M${x + w * a} ${y + h * 0.72} L${x + w * a} ${y + h * 0.2} L${x + w * (a - 0.14)} ${y + h * 0.2}" fill="none" stroke="${C.ink2}" stroke-width="${h * 0.02}"/>`).join('')}<path d="M${x + w * 0.1} ${y + h * 0.64} L${x + w * 0.46} ${y + h * 0.64} L${x + w * 0.42} ${y + h * 0.76} L${x + w * 0.14} ${y + h * 0.76} Z" fill="${C.ink}"/>${[0, 1, 2].map((i) => `<rect x="${x + w * (0.16 + i * 0.09)}" y="${y + h * 0.54}" width="${w * 0.08}" height="${h * 0.1}" fill="${[C.p, C.pl, C.idle][i]}"/>`).join('')}${P.dot(x + w * 0.86, y + h * 0.4, h * 0.05, C.risk)}`; },
    dash(x, y, w, h) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff"/>${P.line(`M${x + w * 0.06} ${y + h * 0.7} L${x + w * 0.18} ${y + h * 0.55} L${x + w * 0.3} ${y + h * 0.62} L${x + w * 0.44} ${y + h * 0.3}`, { c: C.p, w: h * 0.025 })}<rect x="${x + w * 0.54}" y="${y + h * 0.3}" width="${w * 0.4}" height="${h * 0.08}" rx="6" fill="${C.line}"/><rect x="${x + w * 0.54}" y="${y + h * 0.3}" width="${w * 0.3}" height="${h * 0.08}" rx="6" fill="${C.ok}"/><path d="M${x + w * 0.6} ${y + h * 0.82} A${w * 0.14} ${w * 0.14} 0 0 1 ${x + w * 0.88} ${y + h * 0.82}" fill="none" stroke="${C.ok}" stroke-width="${h * 0.05}"/>`; },
  };

  // ---- Aether pieces (journey look) --------------------------------------------------------------------------
  const J = {
    ship: (x, y, s = 1, o = {}) => `<g transform="translate(${x},${y}) scale(${s})" opacity="${o.o ?? 1}"><path d="M-120 0 L120 0 L92 44 L-100 44 Z" fill="${C.ink}"/>${[0, 1, 2, 3].map((i) => `<rect x="${-96 + i * 50}" y="-38" width="44" height="36" rx="3" fill="${[C.p, C.pl, C.idle, C.p][i]}"/>`).join('')}<rect x="86" y="-60" width="22" height="58" rx="3" fill="${C.ink2}"/></g>`,
    crane: (x, y, h = 300) => `<path d="M${x} ${y} L${x} ${y - h} M${x - 150} ${y - h} L${x + 60} ${y - h} M${x - 110} ${y - h} L${x - 110} ${y - h + 120}" fill="none" stroke="${C.ink2}" stroke-width="10" stroke-linecap="round"/>`,
    factory: (x, y, c = C.idle, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-70 0 L-70 -60 L-35 -85 L-35 -60 L0 -85 L0 -60 L35 -85 L35 -60 L70 -60 L70 0 Z" fill="#fff" stroke="${C.ink2}" stroke-width="4" filter="url(#sh)"/><rect x="44" y="-120" width="18" height="60" fill="${C.ink2}"/><circle cx="0" cy="-130" r="16" fill="${c}"/></g>`,
    core: (x, y, r = 120, label = 'Aether') => `<circle cx="${x}" cy="${y}" r="${r * 1.5}" fill="url(#gSpark)" opacity=".5"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gDeep)"/><circle cx="${x}" cy="${y}" r="${r + 18}" fill="none" stroke="${C.pl}" stroke-width="3"/><text x="${x}" y="${y + r * 0.13}" font-size="${r * 0.36}" font-weight="600" fill="#fff" text-anchor="middle">${label}</text>`,
    card: (x, y, w, h, ic, label, o = {}) => `${P.rect(x, y, w, h, { o: o.o })}<rect x="${x + 24}" y="${y + (h - 64) / 2}" width="64" height="64" rx="16" fill="${C.pp}" opacity="${o.o ?? 1}"/>${P.icon(ic, x + 56, y + h / 2, 38)}<text x="${x + 108}" y="${y + h / 2 + 11}" font-size="30" font-weight="600" fill="${C.ink}" opacity="${o.o ?? 1}">${esc(label)}</text>${o.tick ? P.icon('circle-check', x + w - 44, y + h / 2, 36, C.ok) : ''}`,
    station: (x, y, ic, c = C.p) => `<circle cx="${x}" cy="${y}" r="40" fill="#fff" stroke="${c}" stroke-width="4" filter="url(#sh)"/>${P.icon(ic, x, y, 40, c)}`,
  };

  window.SBD = { C, X, SP, T1, T2, T3, TB, panel, A, P, net, frame, M, J, rnd };
})();
