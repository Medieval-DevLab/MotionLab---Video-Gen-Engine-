// Plays one style demo (demo.html#<id>): a pure function of t like any film, looping in a browser, driven by the
// renderer when headless. The demos live in demos.js as VGEStyleDemos[id] = { dur, still, build(F) }.
(function () {
  const V = VGE, K = VGEKit, all = window.VGEStyleDemos, id = location.hash.slice(1), D = all[id], root = document.getElementById('root');
  window.STYLE_IDS = Object.keys(all);
  addEventListener('hashchange', () => location.reload());
  if (!D) { root.innerHTML = `<div style="color:#fff;font:32px Inter;padding:80px">Styles: ${window.STYLE_IDS.join(' · ')}</div>`; window.DUR = 1; V.ready(); return; }
  window.DUR = D.dur; window.STILL = D.still;
  const F = K.div(root, 'frame', 'background:#F7F4EF;'); D.build(F); // paper by default; a demo paints its own ground over it
  const fit = () => { root.style.transform = `scale(${Math.min(innerWidth / 1920, innerHeight / 1080).toFixed(5)})`; }; fit(); addEventListener('resize', fit);
  V.ready().then(() => {
    if (navigator.webdriver) return;
    let t0 = performance.now(), last = 0;
    const tick = (now) => { requestAnimationFrame(tick); if (now - last < 33) return; last = now; window.render(((now - t0) / 1000) % D.dur); };
    requestAnimationFrame(tick);
  });
})();
