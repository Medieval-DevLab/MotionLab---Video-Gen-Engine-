// VGE kit: DOM/SVG components on the style grid. Depends on runtime/film.js (window.VGE) and kit/icons.js.
(function () {
  const ns = 'http://www.w3.org/2000/svg', V = window.VGE, I = window.VGE_ICONS;

  // The grid (styles/journey/tokens.css): 12 columns of 118 px, 24 px gutters, 120 px margins, 8 px unit.
  const col = (n) => 120 + (n - 1) * 142, right = (n) => col(n) + 118;
  const G = { col, right, span: (a, b) => right(b) - col(a), mid: (a, b) => (col(a) + right(b)) / 2, top: 120, opt: 520, bottom: 984, mx: 120 };

  function div(parent, cls = '', style = '', html = '') { const e = document.createElement('div'); if (cls) e.className = cls; if (style) e.style.cssText = style; if (html) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  function svg(parent, w = 1920, h = 1080, style = '') {
    const s = document.createElementNS(ns, 'svg'); s.setAttribute('width', w); s.setAttribute('height', h); s.setAttribute('viewBox', `0 0 ${w} ${h}`);
    s.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;' + style; s.appendChild(document.createElementNS(ns, 'defs')); parent.appendChild(s); return s;
  }
  function sv(parent, tag, attrs = {}) { const e = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); parent.appendChild(e); return e; }
  const icon = (name, size = 28) => `<svg class="ico" viewBox="0 0 24 24" width="${size}" height="${size}">${I[name] || ''}</svg>`;

  // The ground: light, lattice, arc, vignette, grain (variants via .bg-v1/.bg-v2/.bg-v3 on the frame).
  function ground(parent) { const g = div(parent, 'ground'); const L = { root: g }; for (const k of ['light', 'lattice', 'arc', 'vignette', 'grain']) L[k] = div(g, k); return L; }

  // A text block in a slot (T1/T2/T3). lines: [{t: 'text with *keyword*', role: 'head'|'sub'|'state'|'display'|'label', dt, kwAt, gap}]
  function textBlock(parent, { slot = 'T2', lines, tin, tout = Infinity, stagger = .08, deep = false }) {
    const b = div(parent, slot + (deep ? ' on-deep' : ''));
    const els = lines.map((ln, i) => {
      const e = div(b, 't-' + (ln.role || 'head'));
      if (ln.gap) e.style.marginTop = ln.gap + 'px';
      e.innerHTML = ln.t.replace(/\*(.+?)\*/g, '<span class="kw">$1</span>');
      const lt = tin + (ln.dt ?? i * stagger);
      if (!ln.manual) V.vis(e, { tin: lt, tout: (ln.tout ?? tout), din: .6 });
      e.querySelectorAll('.kw').forEach((k) => V.keyword(k, ln.kwAt ?? lt + .3, deep ? '#FFFFFF' : '#1A1323', deep ? '#D7A8FF' : '#A100FF'));
      V.text(`${slot}:${ln.t}`, ln.t.replace(/\*/g, ''), lt, ln.tout ?? tout);
      return e;
    });
    return { block: b, lines: els };
  }

  // A card with a badge and a label (or a title), at a grid position.
  function card(parent, { x, y, w, h = 96, ic, label = '', title = false }) {
    const c = div(parent, 'card kcard', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`);
    div(c, 'row', '', `${ic ? `<div class="badge">${icon(ic)}</div>` : ''}<div class="${title ? 'title' : 't-label'}">${label}</div>`);
    return c;
  }
  function pill(parent, { x, y, text, ic, kind = 'neutral' }) { const p = div(parent, 'k-pill ' + kind, `left:${x}px;top:${y}px;`); p.innerHTML = (ic ? icon(ic, 26) : '') + `<span>${text}</span>`; return p; }
  function chip(parent, { x, y, ic, size = 'm' }) { const c = div(parent, `chip ${size}`, `left:${x}px;top:${y}px;`); c.innerHTML = icon(ic, size === 's' ? 22 : 26); return c; }
  function core(parent, { cx, cy, r = 120, label = '' }) { return div(parent, 'k-core', `left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${2 * r}px;`, label); }
  function photo(parent, { x, y, w, h, src }) { const p = div(parent, 'k-photo', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`); const img = document.createElement('img'); img.src = src; p.appendChild(img); return { el: p, img }; }

  // Soft-flat scene objects (palette tints, no outlines). (x, y) is the object's top-left.
  function ship(s, x, y) {
    const g = sv(s, 'g', { transform: `translate(${x - 296} ${y - 660})` });
    g.innerHTML = `<rect x="312" y="672" width="64" height="64" rx="6" fill="#4A3A63"/><rect x="324" y="684" width="16" height="10" rx="2" fill="#F7F5FA" opacity=".8"/><rect x="348" y="684" width="16" height="10" rx="2" fill="#F7F5FA" opacity=".8"/>
      ${[[392, 700, '#A100FF'], [452, 700, '#CFA0FF'], [512, 700, '#A100FF'], [572, 700, '#E4CCFF'], [632, 700, '#B84DFF'], [422, 660, '#E4CCFF'], [482, 660, '#A100FF'], [542, 660, '#CFA0FF'], [602, 660, '#B84DFF']].map(([cx, cy, f]) => `<rect x="${cx}" y="${cy}" width="56" height="36" rx="3" fill="${f}"/>`).join('')}
      <polygon points="296,736 720,736 688,800 328,800" fill="#2E2240"/>`;
    return g;
  }
  function port(s, x0 = 0) {
    const g = sv(s, 'g', { transform: `translate(${x0} 0)` });
    g.innerHTML = `<defs><linearGradient id="sea${x0}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E2F4"/><stop offset="1" stop-color="#F4F0FA"/></linearGradient></defs>
      <rect x="120" y="776" width="640" height="128" rx="16" fill="url(#sea${x0})"/>
      <g stroke="#DCD2EA" stroke-width="3" stroke-linecap="round"><line x1="160" y1="828" x2="280" y2="828"/><line x1="520" y1="844" x2="700" y2="844"/><line x1="232" y1="872" x2="440" y2="872"/></g>
      <rect x="184" y="560" width="20" height="216" fill="#DCD2EA"/><rect x="184" y="560" width="188" height="16" fill="#DCD2EA"/><rect x="152" y="560" width="32" height="16" fill="#DCD2EA"/>
      <line x1="352" y1="576" x2="352" y2="640" stroke="#CFC3E3" stroke-width="2"/>`;
    return g;
  }
  function factory(s, x, y) { // 118 x 112, (x, y) = top-left including the chimney
    const g = sv(s, 'g', { transform: `translate(${x - 1398} ${y - 484})` });
    g.innerHTML = `<rect x="1398" y="532" width="118" height="64" rx="6" fill="#E6DCF3"/><polygon points="1398,532 1398,504 1437,532 1437,504 1476,532 1476,504 1516,532" fill="#D6C6EE"/>
      <rect x="1490" y="484" width="14" height="36" fill="#D6C6EE"/><rect x="1414" y="556" width="24" height="24" rx="3" fill="#F7F5FA"/><rect x="1450" y="556" width="24" height="24" rx="3" fill="#F7F5FA"/>`;
    return g;
  }
  // A path element (journey line, connector, route)
  function path(s, d, { stroke = '#A100FF', width = 4, dash = null, opacity = 1, cap = 'round' } = {}) {
    const a = { d, fill: 'none', stroke, 'stroke-width': width, 'stroke-linecap': dash ? 'butt' : cap, opacity };
    if (dash) a['stroke-dasharray'] = dash; return sv(s, 'path', a);
  }
  // A point moving along a path between t0 and t1 (an object in transit)
  function travelAlong(el, p, { t0, t1, ease = V.travel, base = 'translate(-50%,-50%)' }) {
    const len = p.getTotalLength();
    V.on((t) => { const q = p.getPointAtLength(len * ease(V.seg(t, t0, t1 - t0))); el.style.left = q.x.toFixed(1) + 'px'; el.style.top = q.y.toFixed(1) + 'px'; el.style.transform = base; });
  }
  // Seeded random (deterministic frames)
  const rand = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  window.VGEKit = { G, div, svg, sv, icon, ground, textBlock, card, pill, chip, core, photo, ship, port, factory, path, travelAlong, rand };
})();
