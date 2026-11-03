// VGE kinetic text (promoted from films/motionlab/film.js, unchanged): text blocks in grid slots whose lines and words
// enter and leave in varied ways, and word swaps that keep the shared words. Every frame is a pure function of t.
// usage: VGEText.KT(parent, 'TL' | {x, y, w, align, v}, [{ t, role, at, mode, gap, kwAt, kc, c, tout }], { tout, out, deep })
//        VGEText.KTswap(parent, slot, { prefix, role, items: [{ t, at, kwAt }], tout, deep })
(function () {
  const V = window.VGE, K = window.VGEKit;
  // kinetic text. A block sits in a slot (top / middle / bottom; left / centre / right). Each line has its own
  // spoken time and entrance: rise, drop, left, right, pop, blur, mask (wipe up), maskDown, words (word by word),
  // wordsAlt (words from alternating sides), wordsPop, letters. Exits: lift, drop, blur, left, right, mask, scale.
  const SL = { TL: { x: 120, y: 120, w: 1112, align: 'left' }, TLw: { x: 120, y: 120, w: 1680, align: 'left' }, TC: { x: 120, y: 120, w: 1680, align: 'center' },
    TR: { x: 688, y: 120, w: 1112, align: 'right' }, ML: { x: 120, y: 520, w: 830, align: 'left', v: 'mid' }, MR: { x: 970, y: 520, w: 830, align: 'right', v: 'mid' },
    C: { x: 404, y: 520, w: 1112, align: 'center', v: 'mid' }, Cw: { x: 120, y: 520, w: 1680, align: 'center', v: 'mid' },
    BL: { x: 120, y: 984, w: 1112, align: 'left', v: 'bottom' }, BC: { x: 120, y: 984, w: 1680, align: 'center', v: 'bottom' }, BR: { x: 688, y: 984, w: 1112, align: 'right', v: 'bottom' } };
  const BACK = (x) => 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);
  const MASKED = new Set(['mask', 'maskDown', 'words', 'letters']);
  const STAG = { words: .07, wordsAlt: .08, wordsPop: .07, letters: .028 };
  function tokens(t) { const out = []; t.split(/(\*[^*]+\*)/).forEach((part) => { if (!part) return; const kw = part.startsWith('*'); part.replace(/\*/g, '').split(/(\s+)/).forEach((w) => { if (w) out.push({ w, kw, sp: /^\s+$/.test(w) }); }); }); return out; }
  function pose(mode, p, i) {
    const g = V.glide(p);
    switch (mode) {
      case 'drop': return { ty: -(1 - g) * 44, op: g };
      case 'left': return { tx: -(1 - g) * 120, op: g };
      case 'right': return { tx: (1 - g) * 120, op: g };
      case 'pop': case 'wordsPop': return { s: .55 + .45 * BACK(V.clamp(p)), op: Math.min(1, p * 2.5) };
      case 'blur': return { bl: (1 - g) * 18, op: g, s: 1.05 - .05 * g };
      case 'mask': case 'words': case 'letters': return { typ: (1 - g) * 130 };
      case 'maskDown': return { typ: -(1 - g) * 130 };
      case 'wordsAlt': return { ty: (i % 2 ? -1 : 1) * (1 - g) * 56, op: g };
      default: return { ty: (1 - g) * 30, op: g };
    }
  }
  function KT(parent, slot, lines, o = {}) {
    const S = { ...(typeof slot === 'string' ? SL[slot] : slot), ...o };
    const b = K.div(parent, 'kt' + (o.deep ? ' on-deep' : ''), `position:absolute;left:${S.x}px;width:${S.w}px;text-align:${S.align || 'left'};`);
    if (S.v === 'mid') { b.style.top = S.y + 'px'; b.style.transform = 'translateY(-50%)'; } else if (S.v === 'bottom') b.style.bottom = (1080 - S.y) + 'px'; else b.style.top = S.y + 'px';
    const tout = o.tout ?? Infinity, out = o.out || 'lift';
    const els = lines.map((ln) => {
      const e = K.div(b, 't-' + (ln.role || 'head')); if (ln.gap) e.style.marginTop = ln.gap + 'px'; if (ln.c) e.style.color = ln.c;
      const mode = ln.mode || 'rise', per = mode === 'letters' ? 'letter' : mode.startsWith('words') ? 'word' : 'line', masked = MASKED.has(mode), units = [];
      if (per === 'line') {
        const inner = document.createElement('span'); inner.style.display = 'inline-block'; inner.innerHTML = tokens(ln.t).map((k) => k.kw ? `<span class="kw">${k.w}</span>` : k.w).join('');
        if (masked) { e.style.overflow = 'hidden'; e.style.paddingBottom = '.08em'; e.style.marginBottom = '-.08em'; }
        e.appendChild(inner); units.push(inner);
      } else tokens(ln.t).forEach((k) => {
        if (k.sp) { e.appendChild(document.createTextNode(' ')); return; }
        const ww = document.createElement('span'); ww.style.display = 'inline-block'; if (k.kw) ww.className = 'kw';
        if (masked) { ww.style.overflow = 'hidden'; ww.style.verticalAlign = 'top'; ww.style.paddingBottom = '.08em'; ww.style.marginBottom = '-.08em'; }
        (per === 'letter' ? [...k.w] : [k.w]).forEach((ch) => { const s = document.createElement('span'); s.style.display = 'inline-block'; s.textContent = ch; ww.appendChild(s); units.push(s); });
        e.appendChild(ww);
      });
      const stg = STAG[mode] || 0, lout = ln.tout ?? tout, din = ln.din ?? (per === 'letter' ? .45 : .6);
      V.on((t) => units.forEach((u, i) => {
        const p = V.seg(t, ln.at + i * stg, din), q = V.glide(V.seg(t, lout + i * (per === 'line' ? 0 : .015), .42));
        const c = pose(mode, p, i); let tx = c.tx || 0, ty = c.ty || 0, typ = c.typ || 0, s = c.s ?? 1, op = c.op ?? 1, bl = c.bl || 0;
        if (q > 0) { if (out === 'drop') ty += 30 * q; else if (out === 'blur') { bl += 14 * q; } else if (out === 'left') tx -= 150 * q; else if (out === 'right') tx += 150 * q; else if (out === 'mask' && masked) typ -= 130 * q; else if (out === 'scale') s *= 1 - .14 * q; else ty -= 22 * q; if (!(out === 'mask' && masked)) op *= 1 - q; }
        u.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)${typ ? ` translateY(${typ.toFixed(1)}%)` : ''}${s !== 1 ? ` scale(${s.toFixed(4)})` : ''}`;
        u.style.opacity = op.toFixed(3); u.style.filter = bl > .05 ? `blur(${bl.toFixed(1)}px)` : 'none';
        u.style.visibility = p <= 0 || op < .003 || (masked && q >= 1 && out === 'mask') ? 'hidden' : 'visible';
      }));
      e.querySelectorAll('.kw').forEach((k) => V.keyword(k, ln.kwAt ?? ln.at + .3, o.deep ? '#FFFFFF' : '#1A1323', ln.kc || (o.deep ? '#D7A8FF' : '#A100FF')));
      V.text(`kt:${ln.t}`, ln.t.replace(/\*/g, ''), ln.at, lout);
      return e;
    });
    return { block: b, lines: els };
  }
  // a word swap: the prefix stays, the rest rolls (old part up and out, new part up from below). Left aligned.
  function KTswap(parent, slot, { prefix, role = 'head', items, tout, deep }) {
    const S = typeof slot === 'string' ? SL[slot] : slot, lh = { head: 96, state: 120, display: 168, sub: 56 }[role];
    const b = K.div(parent, 'kt' + (deep ? ' on-deep' : ''), `position:absolute;left:${S.x}px;top:${S.y}px;width:${S.w}px;`);
    const e = K.div(b, 't-' + role, 'white-space:nowrap;');
    const pre = document.createElement('span'); pre.style.display = 'inline-block'; pre.textContent = prefix + ' '; e.appendChild(pre);
    const slotEl = document.createElement('span'); slotEl.style.cssText = `display:inline-block;position:relative;vertical-align:top;overflow:hidden;width:1560px;height:${lh + 8}px;`; e.appendChild(slotEl);
    V.on((t) => { const p = V.glide(V.seg(t, items[0].at, .55)), q = V.glide(V.seg(t, tout, .42)); pre.style.opacity = (p * (1 - q)).toFixed(3); pre.style.transform = `translateY(${((1 - p) * 30 - q * 22).toFixed(1)}px)`; });
    items.forEach((it, i) => {
      const s = document.createElement('span'); s.style.cssText = 'position:absolute;left:0;top:0;white-space:nowrap;'; s.innerHTML = it.t.replace(/\*(.+?)\*/g, '<span class="kw">$1</span>'); slotEl.appendChild(s);
      const tEnd = i + 1 < items.length ? items[i + 1].at : tout;
      V.on((t) => { const p = V.glide(V.seg(t, it.at, .5)), q = V.glide(V.seg(t, tEnd, .45)); s.style.transform = `translateY(${((1 - p) * 105 - q * 105).toFixed(1)}%)`; s.style.visibility = p <= 0 || q >= 1 ? 'hidden' : 'visible'; });
      s.querySelectorAll('.kw').forEach((k) => V.keyword(k, it.kwAt ?? it.at + .3, deep ? '#FFFFFF' : '#1A1323', deep ? '#D7A8FF' : '#A100FF'));
      V.text(`sw:${it.t}`, prefix + ' ' + it.t.replace(/\*/g, ''), it.at, tEnd);
    });
    return b;
  }
  window.VGEText = { KT, KTswap, SL, tokens };
})();
