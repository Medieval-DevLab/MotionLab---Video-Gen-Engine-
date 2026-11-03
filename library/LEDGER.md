# Asset ledger

Everything in `library/` is free to use, and nothing in it was paid for. Per-file sources and hashes are in
[`ledgers/`](ledgers/).

| Asset | Where | Source | Licence |
|---|---|---|---|
| Photos of people and places (13) | `photos/` (`index.json` lists source, author and hash for each) | Openverse (StockSnap and others) | CC0 1.0 |
| Music beds | `audio/music/` | Mixkit; `uplifting-inspiring.mp3` is owner-supplied | Mixkit Stock Music Free License; owner-cleared |
| Sound effects | `audio/sfx/` | Mixkit | Mixkit Sound Effects Free License |
| Inter, Plus Jakarta Sans | `fonts/` | rsms/inter; tokotype/PlusJakartaSans | OFL-1.1 |
| Caveat (handwriting, for the sketch treatment) | `fonts/caveat/` (`Caveat-wght.ttf`, sha256 `0bdb6b660482d315…`) | github.com/google/fonts (ofl/caveat) | OFL-1.1 |
| Lucide icons | `icons/lucide/` (the engine's set is built into `engine/kit/icons.js`) | lucide-icons/lucide | ISC |

**Third-party references and code** (outside `library/`):

| What | Where | Source | Licence |
|---|---|---|---|
| lemo-opuscar style library (68 styles, docs and demo code; pinned commit) | `third_party/lemo-opuscar/` ([PINNED.md](../third_party/lemo-opuscar/PINNED.md)) | github.com/lemomo-ai/lemo-opuscar | MIT |
| puppeteer-core (drives Chrome for rendering) | `node_modules/` (npm) | github.com/puppeteer/puppeteer | Apache-2.0 |

**Film inputs** live with each film, not here. For example, MotionLab's voiceover is `films/motionlab/vo.mp3`: the
owner supplied it and generated it with ElevenLabs. Each film's credits are in its `FILM.md` §5.

**Rules:**
- Only free assets are used.
- Every new asset gets a row here (or in `ledgers/`) with its source and licence.
- Stock is used only for people and real-world things. Diagrams, UI and illustrations are drawn in code.
