# Data storytelling (`engine/kit/data.js`)

**For:** a number, a trend, a comparison or a share that the voice states.

**Rules:**
- **One mark = one fact.** Every value on screen must be in the film's facts ledger. Show nothing as "sample data"
  in a real film.
- **Drawn as spoken.** The axis arrives when the unit is named, bars grow on their words, and lines draw left to
  right. Numbers count only when the claim is a change or a total.
- **One highlighted series,** in Accenture Purple, with the rest muted. If everything is highlighted, nothing is.
- **Notes are pinned to marks,** with a leader and an unclosed ring, and written by hand (Caveat). Keep them to a few
  words.
- **Pick the chart the data asks for:** bars to compare, a line for change over time, a donut or units for a share of
  a whole.

**Calls:** `box(x, y, w, h, min, max)`, `axes`, `line(svg, box, values)`, `bars(svg, box, values, { highlight, labels })`,
`donut`, `counter(parent, { to, fmt })`, `note(svg, parent, { x, y, text })`, `units(svg, { cols, rows, n })`.

**Learned from:** lemo-opuscar `dataviz` (`third_party/lemo-opuscar/styles/dataviz/`).
