# Isometric (`engine/kit/iso.js`)

**For:** a system with places and flows, such as a supply chain, a factory floor, an architecture or a journey between
sites. It shows the whole and its parts together.

**Rules:**
- **True isometric, flat colour.** Axes at 30°, and the projection never tilts. Each solid has three tones from one
  base colour (top light, left mid, right dark) and no outlines.
- **Ink is only for furniture.** Label pins (dot, leader, rule, text), routes and leaders are the only lines.
- **Solids arrive by motion, never by fading.** They grow up from the ground or drop in with a squash.
- **Nothing moves without a line leading it.** The route draws before the truck runs it.
- **One hue per meaning,** used consistently. Focus on one part by greying everything else (`focus`).
- **Painter order:** add solids back to front (smaller x + y first). Draw composites, such as a building with its roof,
  as one group.

**Calls:**
- `const I = VGEIso.scene(svg, { ox, oy, k })`.
- Solids: `I.board`, `I.box({ mode: 'grow' | 'drop' })`, `I.roof`, `I.cyl`, `I.plate`.
- Flows: `I.route({ points })`, and `I.along(el, points, { t0, t1 })` to move something along a route.
- Labels and focus: `I.pin(htmlParent, { x, y, z, text })` and `I.focus(others, { t0 })`.

**Learned from:** lemo-opuscar `iso-infographic` (`third_party/lemo-opuscar/styles/iso-infographic/`).
