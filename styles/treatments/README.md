# Segment treatments

A treatment is a look that a film uses for one segment, or a few, when the line calls for it. It is not a style for a
whole film. Each one is a small helper file in `engine/kit/` with plain functions, on the same runtime, curves, grid and
type scale. A film that uses none of them is unchanged.

| Treatment | Use it when the line is about… | Helper | Learned from (MIT) |
|---|---|---|---|
| [Hand-drawn line](sketch.md) | an idea, a plan, a first draft, "from a sketch to…" | `sketch.js` | lemo-opuscar one-line, whiteboard, urban-sketch |
| [Isometric](isometric.md) | a system with places: a supply chain, a factory, a data flow | `iso.js` | lemo-opuscar iso-infographic |
| [Data storytelling](data.md) | a number, a trend, a comparison, a share | `data.js` | lemo-opuscar dataviz |
| [Living screencast](screencast.md) | using a product: a click, a form, a result | `screen.js` | lemo-opuscar living-screencast |
| [Shader grounds](shader-grounds.md) | a section that needs a richer world behind it | `shader.js` | the looks of ShaderGradient, Paper Shaders, Vanta, React Bits (our own GLSL) |

**How a treatment enters a film:**
- In the plan (DIRECTOR stage 4), as a segment's visual.
- In the storyboard, as a tuning option.
- Its demo is in `films/_gallery/`.

The source styles are pinned in `third_party/lemo-opuscar/styles/`.
