# Gallery: segment treatments and shader grounds

These are demo reels for the optional kit helpers. A film uses a helper only when a segment calls for it, and a film
that uses none of them is the MotionLab engine unchanged.

| Page | What it shows | Helpers |
|---|---|---|
| [treatments.html](treatments.html) (28 s) | Hand-drawn line · isometric · data storytelling · living screencast, 7 s each | `engine/kit/sketch.js`, `iso.js`, `data.js`, `screen.js` (+ `treatments.css`) |
| [grounds.html](grounds.html) (32 s) | Eight shader grounds: mesh, aurora, silk, contour lines, grain, light rays, halftone, deep mesh | `engine/kit/shader.js` (WebGL2, timed by the film clock) |

**Status (2026-11-03, finished):**
- Both reels are rendered: `out/treatments.mp4` (28 s) and `out/grounds.mp4` (32 s).
- Fixes made on review:
  - the sketch layout;
  - a softer aurora;
  - the hatching cleared off its label;
  - the donut track and dot grid no longer show before their cue;
  - the gallery labels sit above every background.
- The style guides are in `styles/treatments/`.
- MotionLab's kinetic text moved into the kit (`engine/kit/text.js`). MotionLab still renders pixel-identical frames
  (checked at 3 s, 21 s and 56 s).

**Next, when needed:** walkthroughs from screenshots (product KT). They need four small helpers on top of
`screen.js`: target boxes per screenshot, in-place reveals, callouts with spotlight, and redaction. See memory
"project-walkthrough-videos".

Keep to the rule in ENGINE.md: small helpers on the same runtime and process, no new machinery.
