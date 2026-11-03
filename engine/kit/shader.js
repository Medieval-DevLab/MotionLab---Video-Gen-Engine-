// VGE shader grounds: full-screen WebGL2 backgrounds driven by the film clock (deterministic: the time uniform is the
// film's t, nothing else). Looks in the spirit of ShaderGradient, Paper Shaders, Vanta and React Bits; the GLSL here is
// our own (value noise + fbm). Rendered at half resolution and scaled up: these are soft fields, not detail.
// effects: mesh (moving mesh gradient) · aurora · silk · topo (contour lines) · grain (grain gradient) · rays · halftone
(function () {
  const V = window.VGE;
  const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };
  const VS = `#version 300 es\nin vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const HEAD = `#version 300 es
precision highp float;
uniform float uT; uniform vec2 uRes; uniform vec3 uC0, uC1, uC2, uC3; uniform vec4 uP; uniform vec2 uS; uniform float uA;
out vec4 o;
float hash(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ float a = .5, s = 0.; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= .5; } return s; }
float grain(){ return hash(vec3(gl_FragCoord.xy, floor(uT * 24.))) - .5; }
`;
  // uP = (intensity, scale, speed, extra)
  const FX = {
    mesh: `void main(){ vec2 uv = gl_FragCoord.xy / uRes, p = uv * vec2(uRes.x / uRes.y, 1.); float t = uT * uP.z;
      vec2 w = p + .38 * uP.y * vec2(fbm(vec3(p * 1.2, t * .1)) - .5, fbm(vec3(p * 1.2 + 7., t * .1)) - .5);
      vec2 a = vec2(.3 + .25 * sin(t * .31), .3 + .2 * cos(t * .27)), b = vec2(1.45 + .25 * cos(t * .23), .25 + .2 * sin(t * .29)),
           c = vec2(.55 + .3 * sin(t * .19 + 2.), .85 + .12 * cos(t * .33)), d = vec2(1.4 + .25 * sin(t * .37 + 1.), .85 + .15 * cos(t * .21));
      float wa = 1. / (.03 + pow(distance(w, a), 2.2)), wb = 1. / (.03 + pow(distance(w, b), 2.2)), wc = 1. / (.03 + pow(distance(w, c), 2.2)), wd = 1. / (.03 + pow(distance(w, d), 2.2));
      vec3 col = (uC0 * wa + uC1 * wb + uC2 * wc + uC3 * wd) / (wa + wb + wc + wd); col = mix(uC0, col, uP.x); col += grain() * .03; o = vec4(col, uA); }`,
    aurora: `void main(){ vec2 uv = gl_FragCoord.xy / uRes, p = uv * vec2(uRes.x / uRes.y, 1.); float t = uT * uP.z; vec3 col = uC0;
      for (int i = 0; i < 3; i++){ float fi = float(i); float y0 = .5 + .1 * fi + .07 * sin(p.x * 1.6 + t * .35 + fi * 2.1) + .14 * (fbm(vec3(p.x * 1.1 + fi * 3., t * .07, fi)) - .5);
        float band = exp(-pow((uv.y - y0) * (5. + fi * 2.2), 2.)) * (.55 + .45 * smoothstep(y0 - .25, y0, uv.y));
        float rays = .55 + .45 * fbm(vec3(p.x * 7. * uP.y + fi * 3., uv.y * 1.2, t * .12));
        vec3 cc = i == 0 ? uC1 : (i == 1 ? uC2 : uC3); col = mix(col, cc, clamp(band * rays * uP.x * (1. - fi * .2), 0., 1.)); }
      col += grain() * .025; o = vec4(col, uA); }`,
    silk: `void main(){ vec2 uv = gl_FragCoord.xy / uRes, p = uv * vec2(uRes.x / uRes.y, 1.) * uP.y; float t = uT * uP.z * .2;
      float f = p.x * 1.3 + p.y * .7 + sin(p.y * 2.2 + t) * .7 + fbm(vec3(p * .55, t)) * 1.8; float v = .5 + .5 * sin(f * 3.14159);
      float sheen = pow(v, 7.), shade = smoothstep(.0, 1., v); vec3 col = mix(uC0, uC1, shade * .55 * uP.x); col = mix(col, uC2, sheen * .55 * uP.x);
      col += grain() * .02; o = vec4(col, uA); }`,
    topo: `void main(){ vec2 uv = gl_FragCoord.xy / uRes, p = uv * vec2(uRes.x / uRes.y, 1.) * uP.y; float h = fbm(vec3(p * 1.4, uT * .035 * uP.z));
      float lv = h * 16.; float d = abs(fract(lv + .5) - .5) / fwidth(lv); float line = 1. - clamp(d - .4, 0., 1.);
      float major = 1. - clamp(abs(fract(lv / 5. + .5) - .5) / fwidth(lv / 5.) - .6, 0., 1.);
      vec3 col = mix(uC0, uC2, smoothstep(.3, .8, h) * .25 * uP.x); col = mix(col, uC1, clamp(line * .32 + major * .35, 0., 1.) * uP.x); o = vec4(col, uA); }`,
    grain: `void main(){ vec2 uv = gl_FragCoord.xy / uRes; float t = uT * uP.z; float n = fbm(vec3(uv * 2.2 * uP.y, t * .08));
      float g = clamp(uv.x * .55 + uv.y * .45 + (n - .5) * .7, 0., 1.); vec3 col = g < .5 ? mix(uC0, uC1, g * 2.) : mix(uC1, uC2, (g - .5) * 2.);
      col = mix(uC0, col, uP.x); col += grain() * .09 * (uP.w > 0. ? uP.w : 1.); o = vec4(col, uA); }`,
    rays: `void main(){ vec2 uv = gl_FragCoord.xy / uRes; vec2 d = (uv - uS) * vec2(uRes.x / uRes.y, 1.); float a = atan(d.y, d.x), r = length(d); float t = uT * uP.z;
      float ray = fbm(vec3(cos(a) * 3. * uP.y, sin(a) * 3. * uP.y, t * .12)); ray = smoothstep(.35, .85, ray) * smoothstep(1.6, .05, r);
      float glow = exp(-r * 3.2); vec3 col = mix(uC0, uC1, clamp(ray * .85 * uP.x + glow * .35 * uP.x, 0., 1.)); col = mix(col, uC2, glow * .25 * uP.x); col += grain() * .02; o = vec4(col, uA); }`,
    halftone: `void main(){ float cs = 22. * uP.y; vec2 g = gl_FragCoord.xy / cs, c = fract(g) - .5; float t = uT * uP.z;
      float n = fbm(vec3(floor(g) * .07, t * .08)); float r = smoothstep(.35, .75, n) * .46; float dt = 1. - smoothstep(r - .06, r + .06, length(c));
      vec3 col = mix(uC0, uC1, dt * uP.x); o = vec4(col, uA); }`,
  };

  // a shader layer: keys [{t, d, e, a (opacity), i (intensity), s (scale), v (speed), x (extra)}]; colors [4 hex]; src [x, y] 0..1
  function layer(parent, { effect, keys = [{ t: 0 }], colors = ['#F7F4EF', '#E9D7FB', '#FCE3C1', '#D7E3FF'], src = [.5, .8], scale = .5, z = 0 }) {
    const c = document.createElement('canvas'); c.width = Math.round(1920 * scale); c.height = Math.round(1080 * scale);
    c.style.cssText = `position:absolute;left:0;top:0;width:1920px;height:1080px;z-index:${z};`; parent.appendChild(c);
    const gl = c.getContext('webgl2', { preserveDrawingBuffer: true, premultipliedAlpha: false, alpha: true, antialias: false });
    if (!gl) { console.error('VGEShader: no WebGL2'); return c; }
    const sh = (ty, s) => { const x = gl.createShader(ty); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) console.error('VGEShader ' + effect + ': ' + gl.getShaderInfoLog(x)); return x; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, HEAD + FX[effect])); gl.linkProgram(pr); gl.useProgram(pr);
    const bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = Object.fromEntries(['uT', 'uRes', 'uC0', 'uC1', 'uC2', 'uC3', 'uP', 'uS', 'uA'].map((n) => [n, gl.getUniformLocation(pr, n)]));
    colors.forEach((h, i) => gl.uniform3fv(U['uC' + i], hex(h))); gl.uniform2f(U.uRes, c.width, c.height); gl.uniform2f(U.uS, src[0], 1 - src[1]); gl.viewport(0, 0, c.width, c.height);
    const META = new Set(['t', 'd', 'e', 'cut']), D0 = { a: 1, i: 1, s: 1, v: 1, x: 0 };
    const at = (t) => { const s = { ...D0 }; for (const n in keys[0]) if (!META.has(n)) s[n] = keys[0][n]; for (let k = 1; k < keys.length; k++) { const K2 = keys[k]; if (t < K2.t) break; const p = K2.cut ? 1 : (K2.e || V.travel)(V.seg(t, K2.t, K2.d ?? 1)); for (const n in K2) if (!META.has(n)) s[n] = V.mix(s[n], K2[n], p); } return s; };
    V.on((t) => {
      const s = at(t); c.style.opacity = s.a.toFixed(3); if (s.a < .003) { c.style.visibility = 'hidden'; return; } c.style.visibility = 'visible';
      gl.useProgram(pr); gl.uniform1f(U.uT, t); gl.uniform4f(U.uP, s.i, s.s, s.v, s.x); gl.uniform1f(U.uA, 1); gl.drawArrays(gl.TRIANGLES, 0, 3);
    });
    return c;
  }
  window.VGEShader = { layer, effects: Object.keys(FX) };
})();
