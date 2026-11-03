# Hand-drawn line (`engine/kit/sketch.js`)

**For:** ideas, plans, drafts and "how we got here": anything that should feel human and unfinished. It is not for
data or UI.

**Rules:**
- **Ink and one accent.** Warm black ink (`VGESketch.INK`). Accenture Purple marks the one thing that matters:
  a circle, an underline or a tick. No fills, except hatching.
- **Drawn in order.** Each stroke draws on in the order a hand would draw it: the box, then its label, then the
  arrow to the next box.
- **Imperfect on purpose.** Strokes wobble, overshoot and never quite close; a thinner second pass follows the first.
  Don't straighten them.
- **Written, not typed.** Labels are handwriting (Caveat, OFL) written on left to right in about 0.2 s plus 30 ms per
  character. Keep them short: three or four words.
- **One mover at a time.** One stroke draws at a time, and the next starts as it finishes.

**Calls:**
- `stroke(svg, d, o)`, `line`, `rect`, `ellipse` (encircle), `arrow`, `underline` (`double`), `check`, `cross`,
  `hatch`, and `write(parent, { x, y, text, size, t0 })`.
- Options common to all: `t0`, `dur`, `color`, `width`, `seed`, `amp` (wobble), `tout`.

**Learned from:** lemo-opuscar `one-line`, `whiteboard` and `urban-sketch`
(`third_party/lemo-opuscar/styles/`).
