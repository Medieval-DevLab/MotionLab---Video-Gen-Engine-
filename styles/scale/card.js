// The tuning-scale card for a storyboard's film-wide choices: a preset by theme and the eight dials (-2..+2) around the
// Base (0), and a link to the live previews. It only adds to the storyboard. Every segment keeps
// its own board, tuning chips and notes. Needs dials.js.
// usage: const sc = VGEScaleCard.mount(container, { key, preset, link, onChange }); sc.text() -> the line for "Copy my choices"
(function () {
  const css = `.sc-card h3 { margin: 0 0 2px; } .sc-card .sc-sub { color: #5E5868; font-size: 13.5px; }
    .sc-card .sc-pre { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 4px; }
    .sc-card .sc-grid { display: grid; grid-template-columns: 150px repeat(5, 1fr); gap: 6px 6px; align-items: center; margin-top: 10px; }
    .sc-card .sc-n { font-weight: 600; font-size: 14px; } .sc-card .sc-n small { display: block; font-weight: 500; color: #5E5868; font-size: 12px; }
    .sc-card .sc-s { position: relative; border: 1.5px solid #E6E0EC; background: #fff; border-radius: 8px; padding: 4px 8px; font: inherit; font-size: 13px; cursor: pointer; text-align: center; color: #1A1323; }
    .sc-card .sc-s:hover { border-color: #CDB3EE; } .sc-card .sc-s.on { background: #A100FF; border-color: #A100FF; color: #fff; }
    .sc-card .sc-s.zero::after { content: ' Base'; font-size: 11px; font-weight: 600; opacity: .75; }
    .sc-card .sc-foot { margin-top: 10px; font-size: 13px; color: #5E5868; }
    .sc-card .sc-note { margin-top: 10px; width: 100%; min-height: 44px; font: inherit; font-size: 13.5px; border: 1.5px solid #E6E0EC; border-radius: 10px; padding: 8px 10px; resize: vertical; }`;
  function mount(box, { key, preset = 'base', link = '', onChange = () => {} }) {
    const { dials, presets, sign, text } = window.VGEScaleDials;
    if (!document.getElementById('sc-css')) { const s = document.createElement('style'); s.id = 'sc-css'; s.textContent = css; document.head.appendChild(s); }
    const base = presets.find((p) => p.id === preset) || presets[0];
    const st = JSON.parse(localStorage.getItem(key) || 'null') || { preset: base.id, v: { ...base.v } }, rec = base.id;
    const c = document.createElement('div'); c.className = 'card sc-card';
    c.innerHTML = `<h3>Tuning scale (vs Base)</h3><div class="sc-sub">Preset by the film's theme, then any dial from −2 to +2 around the Base (0).${link ? ` <a href="${link}" target="_blank">See every step move →</a>` : ''}</div>
      <div class="sc-pre"></div><div class="sc-grid"></div>
      <textarea class="sc-note" placeholder="Custom: describe what you want in your own words (the feel, a reference, what to avoid)"></textarea><div class="sc-foot"></div>`;
    const pre = c.querySelector('.sc-pre'), grid = c.querySelector('.sc-grid'), foot = c.querySelector('.sc-foot');
    presets.forEach((p) => { const b = document.createElement('button'); b.className = 'chip'; b.dataset.p = p.id; b.innerHTML = p.name + (p.id === rec ? '<span class="rec">recommended</span>' : ''); b.title = p.for; b.onclick = () => { st.preset = p.id; st.v = { ...p.v }; paint(); }; pre.appendChild(b); });
    dials.forEach((d) => {
      const n = document.createElement('div'); n.className = 'sc-n'; n.innerHTML = `${d.name}<small>${d.q}</small>`; grid.appendChild(n);
      [-2, -1, 0, 1, 2].forEach((v, i) => {
        const b = document.createElement('button'); b.className = 'sc-s' + (v === 0 ? ' zero' : ''); b.dataset.d = d.id; b.dataset.v = v; b.title = d.say[i];
        b.textContent = v === 0 ? '0' : sign(v);
        b.onclick = () => { st.v[d.id] = v; const p = presets.find((x) => Object.keys(x.v).every((k) => x.v[k] === st.v[k])); st.preset = p ? p.id : 'custom'; paint(); };
        grid.appendChild(b);
      });
    });
    const note = c.querySelector('.sc-note'); note.value = st.note || ''; note.oninput = () => { st.note = note.value; paint(); };
    const line = () => text(st.preset, st.v) + (st.preset === rec ? ' (recommended)' : ' (CHANGED)') + ((st.note || '').trim() ? ` · What I want: "${st.note.trim()}"` : '');
    function paint() {
      pre.querySelectorAll('.chip').forEach((b) => b.classList.toggle('on', b.dataset.p === st.preset));
      grid.querySelectorAll('.sc-s').forEach((b) => b.classList.toggle('on', st.v[b.dataset.d] === +b.dataset.v));
      foot.textContent = line(); localStorage.setItem(key, JSON.stringify(st)); onChange();
    }
    box.appendChild(c); paint();
    return { text: line, state: st };
  }
  window.VGEScaleCard = { mount };
})();
