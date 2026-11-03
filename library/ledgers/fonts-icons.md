# Visual asset ledger

> Carried over from the first engine. Paths are relative to `library/`; placeholder rows refer to test images that were removed. (W1-brand)

Every adopted visual asset or library, one row per group. Licence classes per `_builder-rules.md` rule 4.
Tarballs were fetched with `npm pack` (system CA, no install scripts run) and are cached in
`library/.cache/pkgs/`. Per-file sha256 values are listed under "File hashes" below.

| Group | Source URL | Version | Licence | Class | Tarball sha256 | What we keep, and where |
|---|---|---|---|---|---|---|
| Inter (font) | https://github.com/rsms/inter (npm `inter-ui`) | 4.1.1 | OFL-1.1 | Free | `e392e4d71f18a7c1f23dfecd833d68fa05eeab41862686584e80fd2b5d87e9c0` | `library/fonts/inter/` InterVariable (+Italic) woff2 with `opsz` axis, so Inter Display comes from optical sizing; `LICENSE.txt`. Byte-identical to `assets/fonts/InterVariable.woff2`. |
| Plus Jakarta Sans (font) | https://github.com/tokotype/PlusJakartaSans (npm `@fontsource-variable/plus-jakarta-sans`) | 5.3.0 | OFL-1.1 | Free | `271d7863880f0de211d9d44534e16907fba50cf6d47245de1938ff392ab5a30a` | `library/fonts/plus-jakarta-sans/` latin + latin-ext variable woff2 (wght 200-800), latin italic, `LICENSE.txt`. The geometric display face for kinetic themes. |
| Lucide icons | https://github.com/lucide-icons/lucide (npm `lucide-static`) | 1.63.0 | ISC | Free | `521f0d535c03b159c6ea9b475920724dee2755005ad7360fd621b9bab7bf211d` | `library/icons/lucide/` 2,193 SVGs, normalised by `build-icons.mjs`; `LICENSE`. Tags come from `tags.json`. |
| Tabler icons | https://github.com/tabler/tabler-icons (npm `@tabler/icons`) | 3.50.0 | MIT | Free | `4c2eb678ed71cdcbf57a3e899c4e91f3445d680fbc1d57d27c7083a321c47303` | `library/icons/tabler/` 5,203 outline SVGs, normalised; `LICENSE`. Tags and category come from `icons.json`. |
| Icon index | generated (ours) | 1 | n/a (metadata from the two sets above) | Free | n/a | `library/icons/index.json`: 7,396 entries `{name,set,tags,categories}`. |
| world-atlas (map data) | https://github.com/topojson/world-atlas (Natural Earth data, public domain) | 2.0.2 | ISC | Free | `032e7765f2ce00edaeafec23ff22bc3b77e42987c257da944cc585b452c05b97` | `library/maps/countries-110m.json`, `land-110m.json`, `LICENSE-world-atlas`. |
| d3-geo | https://github.com/d3/d3-geo | 3.1.1 | ISC | Free | `fe1f2dd81a87d942790c5a7786f4aab03df2b357d46d8af56b613fb8a1bb9be5` | `library/maps/vendor/d3-geo.min.js` + `LICENSE-d3-geo`: projections, antimeridian clipping, fitting. |
| d3-array (d3-geo dependency) | https://github.com/d3/d3-array | 3.2.4 | ISC | Free | `6dbf3f2be39e48f86775be6e166a5d3e5a585ca7144453cd6ad1912f5ae4417f` | `library/maps/vendor/d3-array.min.js` + `LICENSE-d3-array`. |
| topojson-client | https://github.com/topojson/topojson-client | 3.1.0 | ISC | Free | `889fadb422f6236d0f8337a236ce6499f258b75e44b81733b13bd971067322bf` | `library/maps/vendor/topojson-client.min.js` + `LICENSE-topojson-client`: arc decoding, `mesh()` (border lines drawn once). |
| simplex-noise | https://github.com/jwagner/simplex-noise.js | 4.0.3 | MIT | Free | `51beccf6bcbd9ed4a895af10a99e2806f996fc7f6766daaf61c261776c7bdc62` | `library/textures/vendor/simplex-noise.mjs` (renamed from `dist/esm/simplex-noise.js` so Node loads it as ESM) + `LICENSE-simplex-noise`. Always seeded with mulberry32. |
| Paper Shaders (referenced, not vendored) | https://github.com/paper-design/shaders (npm `@paper-design/shaders`) | 0.0.82 | Apache-2.0 | Free | `0d0f695dcd31445f6ea237a19de18bca56b61d2e7e2de282814912576808b981` | Not copied into the repo. `base.json` `backgrounds.mesh.shader` / `grain.shader` record its `meshGradient` / `grainGradient` params (`speed:0`, `frame=t*1000`) for the archetype builders. The tarball is cached. |
| Textures | generated (ours, `library/textures/gen-textures.mjs`) | 1 | project | Free | n/a | `line-wave-mesh.svg`, `line-wave-mesh-b.svg`, `dot-halftone.svg`, `dot-field-corner.svg`, `dot-grid.svg`, `grain.svg`. Seeded and deterministic. |
| Line-art maps | generated (ours, `library/maps/build-map.mjs` on d3-geo + world-atlas) | 1 | ISC data + project code | Free | n/a | `world-line-110m.svg` (0°), `world-line-110m-apac.svg` (140°E), `world-arcs-demo.svg` (14 hub arcs). |
| Theme palettes | sampled from owner reference clips K1-K4 and 03 §3 (Accenture refs) | 1 | owner-provided references (colour values only, no pixels kept) | Free | n/a | `engine/tokens/themes/*.json`. |

## File hashes
```
e564f652916db6c139570fefb9524a77c4d48f30c92928de9db19b6b5c7a262a  library/fonts/inter/InterVariable-Italic.woff2
693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3  library/fonts/inter/InterVariable.woff2
cc36dd53b88f8c7f138b9708e0c4b598816e4e52c7e252859e67e1e7edbcf117  library/fonts/inter/LICENSE.txt
e07fd1167c2aaaa6fb965dd66e1e73b13c9c95b76b2d648b6e938780f30b37af  library/fonts/plus-jakarta-sans/LICENSE.txt
38e3b8fd8045048eb311d90170a4429ed2c8f405852dc3d91b5af8452758703f  library/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-ext-wght-normal.woff2
bb113d8f5be89636a9a31ffa0966762126546b98be171d6fa81115abb2cd5352  library/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-wght-italic.woff2
153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79  library/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-wght-normal.woff2
2516c915867c7baf18ddec727aec46c315541a07cfb3d79a6559b05d5e94eee8  library/maps/countries-110m.json
ead5f68119c49a9250902e7da303bcb209341bbb8fefe7369a439b48b704658a  library/maps/land-110m.json
ecc4dd91bed68611b57999d09c76c6cbbe9edc367ec9a1a57d60577ad592b2b7  library/maps/world-arcs-demo.svg
b0af6bd91cf17f92ca60c7e7e96402931ad3ccb2865e577d13b2e873e06b7cf9  library/maps/world-line-110m-apac.svg
ec2eac5756bfb200b986761a7fecca6f109a2e605bab54ea3c8f3c2b63084aa7  library/maps/world-line-110m.svg
3e6849627f74ff73c257a3ae1efb574015d94fc1035c05ec3c15805165efcbc4  library/maps/vendor/LICENSE-d3-array
3e3edc1224eec9c39cd26491a21304a62883c1e5b6a65c5283ccc7a6cc94baee  library/maps/vendor/LICENSE-d3-geo
4c4d15b635e04e691825a76db7d33f7f2033b55669a7430011694f31e6c65999  library/maps/vendor/LICENSE-topojson-client
80aa70d0cd17dabddf6d056494ea17926a45a69da8b7850220aace331bad671d  library/maps/vendor/d3-array.min.js
23e574f1e8d4716d622bce45356a379b66a277162b145f5f147e4c8daefb73d2  library/maps/vendor/d3-geo.min.js
25cd02ae486cc5063e0215a4e4cfb15de83700c87ac48bac4d57dc6aaf3ebb89  library/maps/vendor/topojson-client.min.js
bb6af227f77a879b9f8bc5dc7fd9cf087fdf777c6f3885417e8de5182e6beaac  library/textures/dot-field-corner.svg
268bbab182cd7e7caaf193569415c732c09455cb3907094b64851062c751f44a  library/textures/dot-grid.svg
7c70734e57a8cfabc7a30641cc866b789f8377f11660749ef0da78d51ef0e761  library/textures/dot-halftone.svg
1fad1a640824fe5a240996f3740a77969872fdacdcb1b7c099d93fdbdc0edc2c  library/textures/grain.svg
d9b85eb3f076b3e1fca3156eec8b376d1b8884dcf6cd519e85656f38fdec42ae  library/textures/line-wave-mesh-b.svg
13138a7224f880184a7dd8db78464b06c28008d25ba564b1081279a78f656518  library/textures/line-wave-mesh.svg
01951c4f7d8e7ce92540c4f575a2aec39738b39d25a06a96059d82ed83fb594e  library/textures/vendor/LICENSE-simplex-noise
64e571e6d28da06fdd230110b8ce242285e76137e7258938f3b68a0fd6ff8146  library/textures/vendor/simplex-noise.mjs
ca16efe6a94752f3774ff1f7a41e2cbaf09340e730e910061959da5eb7713269  library/icons/index.json
b495047bd93a9b06913511076f504daba17d5bbeb3e0650f3bb53a4220329c57  library/icons/lucide/LICENSE
b740a1d46122672da62833e97f7e7c8a13fa85cbc7445b584b297cc00dde93db  library/icons/tabler/LICENSE
lucide/*.svg  d3701fd7c8beced1649fcfb51189b353828d336861e3600ca9bd7cba01e78efa  (concatenated, sorted)
tabler/*.svg  c706350f7c652a4d82131bd176c0cab02b87196f62d3268ba2f67759ac4da8c3  (concatenated, sorted)
```
