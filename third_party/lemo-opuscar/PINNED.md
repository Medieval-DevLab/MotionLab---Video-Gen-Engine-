# lemo-opuscar (pinned reference)

- **Source:** https://github.com/lemomo-ai/lemo-opuscar
- **Commit:** `bebbbe1aa92a3cb4bb6f83500e61b23a17d1aa00` (2026-11-01, "Gallery and README: new films for eight styles")
- **Licence:** MIT (see [LICENSE](LICENSE)). Copyright (c) 2026 LemoLab.
- **Pinned on:** 2026-11-03, as a style reference for VideoGenEngine.

**What is here:**
- The project docs: README, DIRECTOR, TECHNIQUE, MY-STYLES.
- All 68 styles. Each has `STYLE.md` (the style prompt), `style.json`, `DEMO.md`, the subtitle file, the demo code, and
  `poster.jpg` (downscaled to 640 px).

**What is left out:**
- The demo media: audio, fonts, footage, textures, and images other than posters. Some of these carry their own
  third-party credits (see each demo's `CREDITS`).
- Any file of 300 kB or more, plus the `core/` render library (VideoGenEngine has its own).

**How VideoGenEngine uses it:**
- We read a style's `STYLE.md` and demo code to learn its grammar and techniques.
- We rebuild what we need as our own kit modules and segment treatments (`engine/kit/`, `styles/treatments/`), and
  credit the source style in each one.
- Code taken from here keeps its MIT notice.
