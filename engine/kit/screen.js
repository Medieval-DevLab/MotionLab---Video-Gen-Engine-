// VGE living-screencast treatment: a product walkthrough that looks recorded but is redrawn in HTML, so the camera can
// go anywhere. After lemo-opuscar's living-screencast style (MIT, third_party/lemo-opuscar): real UI only (no lorem
// ipsum, no invented features), the cursor is the user and never teleports, every click causes a visible state change,
// focus by pushing in rather than by blurring text that must be read. Every frame is a pure function of t.
(function () {
  const V = window.VGE, K = window.VGEKit;
  const BACK = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
  const show = (el, t0, o = {}) => V.vis(el, { tin: t0, rise: o.rise ?? 16, x: o.x || 0, scaleFrom: o.scaleFrom ?? 1, tout: o.tout, din: o.din ?? .5 });
  const S = {
    // an app window: title bar with three dots and a title; returns { el, body }
    window: (parent, { x, y, w, h, title = '', t0 = 0, tout }) => {
      const el = K.div(parent, 'scr-window', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`);
      K.div(el, 'scr-bar', '', `<i></i><i></i><i></i><span>${title}</span>`); const body = K.div(el, 'scr-body');
      show(el, t0, { scaleFrom: .96, rise: 30, tout }); return { el, body };
    },
    // a sidebar of navigation items; `active` is highlighted (and can change at times: [{t, i}])
    sidebar: (body, { items, active = [{ t: 0, i: 0 }], t0 = 0 }) => {
      const s = K.div(body, 'scr-side'); const its = items.map(([ic, label], i) => { const e = K.div(s, 'it', '', K.icon(ic, 24) + `<span>${label}</span>`); show(e, t0 + .1 + i * .06, { x: -20, rise: 0 }); return e; });
      V.on((t) => { let a = active[0].i; for (const k of active) if (t >= k.t) a = k.i; its.forEach((e, i) => e.classList.toggle('on', i === a)); });
      return s;
    },
    button: (body, { x, y, text, icon, primary = false, t0 = 0, press }) => {
      const b = K.div(body, 'scr-btn' + (primary ? ' primary' : ''), `left:${x}px;top:${y}px;`, (icon ? K.icon(icon, 24) : '') + text); show(b, t0, { scaleFrom: .9, rise: 0 });
      if (press != null) V.on((t) => { const p = Math.sin(Math.PI * V.seg(t, press, .22)); b.style.filter = p > 0 ? `brightness(${(1 - .12 * p).toFixed(3)})` : 'none'; b.style.transform = `scale(${(1 - .05 * p).toFixed(4)})`; });
      return b;
    },
    // list rows sliding in one by one: rows [{ icon, title, meta }]
    list: (body, { x, y, w, rows, t0 = 0, stagger = .09, gap = 92 }) => rows.map((r, i) => { const e = K.div(body, 'scr-row', `left:${x}px;top:${y + i * gap}px;width:${w}px;`, `<div class="ic">${K.icon(r.icon || 'file-text', 24)}</div><div class="tt">${r.title}</div>${r.meta ? `<div class="mt">${r.meta}</div>` : ''}`); show(e, t0 + i * stagger, { rise: 18 }); return e; }),
    // an input that is typed into: characters appear at cps, the caret blinks while idle
    input: (body, { x, y, w, placeholder = '', text = '', t0 = 0, typeAt, cps = 16 }) => {
      const e = K.div(body, 'scr-input', `left:${x}px;top:${y}px;width:${w}px;`), val = K.div(e, '', 'display:inline;'), car = document.createElement('i'); car.className = 'caret'; e.appendChild(car);
      show(e, t0, { rise: 12 });
      V.on((t) => { const n = typeAt == null ? 0 : Math.max(0, Math.min(text.length, Math.floor((t - typeAt) * cps))); val.innerHTML = n ? text.slice(0, n) : `<span class="ph">${placeholder}</span>`;
        const typing = typeAt != null && t >= typeAt && n < text.length; car.style.opacity = typing ? 1 : (Math.floor(t * 2.2) % 2 ? 0 : 1); });
      if (text) V.text('scr:' + text, text, typeAt, Infinity);
      return e;
    },
    // a modal over a dimmed backdrop (inside the window body)
    modal: (body, { x, y, w, h, title, t0 = 0, tout }) => {
      const dim = K.div(body, 'fill', 'background:rgba(26,19,35,.28);'); V.anim(dim, 'opacity', [[0, 0], [t0, 1, .3], ...(tout ? [[tout, 0, .3]] : [])]);
      const m = K.div(body, 'scr-modal', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`, `<h4>${title}</h4>`); show(m, t0, { scaleFrom: .94, rise: 24, tout }); return m;
    },
    // a toast notification sliding in from the right
    toast: (parent, { x, y, title, body = '', icon = 'circle-check', t0 = 0, tout }) => {
      const e = K.div(parent, 'scr-toast', `left:${x}px;top:${y}px;`, `<div class="ic">${K.icon(icon, 28)}</div><div><b>${title}</b>${body ? `<small>${body}</small>` : ''}</div>`);
      show(e, t0, { x: 80, rise: 0, tout }); V.text('toast:' + title, title, t0, tout ?? Infinity); return e;
    },
    // the cursor: eased between keys [{ t, x, y, click }]; a click squashes it and leaves a ripple
    cursor: (parent, keys, { t0 = keys[0].t, tout } = {}) => {
      const c = K.div(parent, 'scr-cursor', '', '<svg viewBox="0 0 44 56" width="44" height="56"><path d="M4 2 L4 46 L15 36 L23 54 L31 50 L23 33 L39 33 Z" fill="#1A1323" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/></svg>');
      const rip = K.div(parent, 'ring', 'border-color:var(--purple);');
      V.on((t) => {
        let x = keys[0].x, y = keys[0].y;
        for (let i = 1; i < keys.length; i++) { const k = keys[i], pk = keys[i - 1], d = k.d ?? .7; if (t < k.t - d) break; const p = V.travel(V.seg(t, k.t - d, d)); x = V.mix(pk.x, k.x, p); y = V.mix(pk.y, k.y, p); }
        let sq = 1, rp = 0, rx = 0, ry = 0; for (const k of keys) if (k.click) { const p = V.seg(t, k.t, .5); if (p > 0 && p < 1) { rp = p; rx = k.x; ry = k.y; } sq = Math.min(sq, 1 - .14 * Math.sin(Math.PI * V.seg(t, k.t - .05, .2))); }
        c.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${sq.toFixed(3)})`; const op = V.glide(V.seg(t, t0, .3)) * (tout ? 1 - V.glide(V.seg(t, tout, .3)) : 1); c.style.opacity = op.toFixed(3);
        const r = 14 + 46 * V.glide(rp); Object.assign(rip.style, { left: (rx + 4) + 'px', top: (ry + 2) + 'px', width: 2 * r + 'px', height: 2 * r + 'px', opacity: (rp > 0 ? (1 - rp) * .8 : 0).toFixed(3) });
      });
      return c;
    },
    // push in on a region of a stage: keys [{ t, x, y, s, d }] (x, y = the point brought to the centre)
    camera: (stage, keys) => V.camera(stage, keys.map((k, i) => ({ t: k.t, x: (k.x ?? 960) - 960, y: (k.y ?? 540) - 540, s: k.s ?? 1, d: k.d ?? .8, ease: k.ease }))),
    BACK,
  };
  window.VGEScreen = S;
})();
