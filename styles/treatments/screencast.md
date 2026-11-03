# Living screencast (`engine/kit/screen.js`)

**For:** using a product, such as a click, a form, a result or a notification, and for training walkthroughs. It
looks recorded but is redrawn, so the camera can push in anywhere.

**Rules:**
- **Real UI only.** Labels, menus and buttons match the real product. No lorem ipsum and no invented features.
- **The cursor is the user, and it never teleports.** It eases between targets, and every click squashes it, leaves a
  ripple and causes a visible change.
- **Cause, then effect.** A click opens the modal; typing fills the field; saving shows the toast and the new row.
- **Focus by pushing in** (`camera`), not by blurring text the viewer must read.
- **One action at a time,** with a beat to read the result before the next.

**Calls:**
- Window and UI: `window(parent, { x, y, w, h, title })` (returns `{ el, body }`), `sidebar`, `button({ press })`, `list`.
- Input and feedback: `input({ typeAt, text })`, `modal`, `toast`.
- Cursor: `cursor(parent, [{ t, x, y, click }])`.
- Camera: `camera(stage, [{ t, x, y, s }])`.

**Walkthroughs from screenshots** (for example, product KT) use the same calls over the screenshots. They will add a few
small helpers: target boxes per screenshot, in-place reveals of the next state, and callouts and redaction.

**Learned from:** lemo-opuscar `living-screencast` (`third_party/lemo-opuscar/styles/living-screencast/`).
