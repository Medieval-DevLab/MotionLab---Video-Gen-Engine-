# Shader grounds (`engine/kit/shader.js`)

**For:** a section that needs a richer world behind it than the living ground gives, such as an opening, a chapter or
a product moment. It works under any treatment.

**Effects:**

| Effect | What it is | Good for |
|---|---|---|
| `mesh` | A slow mesh gradient of four colours | premium openings and product moments; the deep version for chapters |
| `aurora` | Soft light curtains | hope, a turn, an idea arriving |
| `silk` | Folded fabric with a sheen | elegance, a calm close |
| `topo` | Contour lines of a moving terrain | the world, scale, data |
| `grain` | A grainy gradient | warm, human sections |
| `rays` | Light rays from a point (`src`) | a reveal, "seen", a spotlight |
| `halftone` | A moving dot field | tech, systems, texture behind UI |

**Rules:**
- **The background never competes.** Keep its intensity low enough that text and the primary mover read at a glance.
  Light effects sit on light palettes.
- **It changes with the story.** Cross-fade between effects at section changes (`keys` on `a`, the opacity), not
  mid-sentence.
- **It's deterministic.** The time uniform is the film's `t`. It renders at half resolution, which is fine because
  these are soft fields.

**Call:** `VGEShader.layer(parent, { effect, colors: [4 hex], keys: [{ t, a, i, s, v, x }], src: [x, y] })`, where `i` is
intensity, `s` scale, `v` speed, and `x` an extra per-effect setting (the grain amount).

**Looks in the spirit of:** ShaderGradient (MIT), Paper Shaders, Vanta (MIT), React Bits and Magic UI (MIT). The GLSL
here is our own.
