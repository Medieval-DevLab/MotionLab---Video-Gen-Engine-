# The engine

Any script plus a voiceover goes in; a calm, premium B2B story film comes out. The engine is not a program that
designs films. It is four things that let the model design every film **the same way, to the same standard, with a
different look each time**.

| Part | What it is | Changes per film? |
|---|---|---|
| **The process** ([DIRECTOR.md](DIRECTOR.md)) | The fixed sequence every film goes through: intake → segments → film system → plan → **storyboard + owner tuning** → style frames → build → checks → review render → notes → final | Never |
| **The craft rules** (`styles/*/STYLE.md` §2–§3, §7–§11; summarised below) | Grid maths, type scale ratio, readability, one primary mover, purposeful continuity, facts, sound levels, banned list | Never |
| **The film system** (`films/<slug>/FILM.md` §2) | This film's look: style, palette, ground, signature device, motion character, pacing, illustration world, music | **Always.** Chosen fresh for each film |
| **The kit** (`engine/`) | The runtime (timeline, easing, camera, continuity moves), the components, the renderer, the audio mixer, the checks | Grows when a film needs something new |

## What never changes: the craft invariants
1. **Text sits only in slots, on a 12-column grid with 8 px units.** Sizes come only from the type scale. Slots are
   top, middle or bottom, aligned left, centre or right; vary them through a film (owner 2026-11-02: not all
   left-aligned). Entrances vary too: rise, drop, from either side, pop, blur, mask wipe, word by word, letter by
   letter, and word swaps that keep the shared words. Subtext is weight 500, never slim.
2. **One spoken idea per segment.** Text follows the voice: key phrases, appearing as they are spoken.
3. **One primary mover at a time.** Every element has a job. Nothing exists for its own sake.
4. **Every boundary uses a named continuity move** (Swap, Build, Travel, Gather, Become, Chapter), with a reason.
5. **The ground is never flat and never static.** One lit world per film whose light, tint, wash and arc move with
   the story from segment to segment (owner 2026-11-02: the background must not look the same everywhere).
6. **Every number on screen is in the facts ledger.** Its source is the script, the VO or supplied material.
7. **Delivery standard:** −14 LUFS and a true peak of −1 dBTP or lower, measured on the final MP4.
8. **The film follows the script.** Segments come in script order, on-screen text uses the script's own words
   (trims flagged, never reworded), and every visual shows what its line says.
9. **Scenes build; nothing lingers.** Every segment opens sparse and reaches its peak late. During a hold something
   still changes with purpose. Change is continuous, not crowded: one primary mover at a time.
10. **Show people and real things.** When the line is about people (teams, reinventors, planners), show real people
    doing something (photos or footage), and when it is about video, show real footage. Abstract nodes are for
    systems, not for people or outcomes. Every concept must read without the voice.

## What changes: the variety dimensions
Each film picks one option per dimension and records the choice in its `FILM.md` §2. **A new film must differ from
the previous film on at least three dimensions** (checked against `films/HISTORY.md`). Every option stays inside the
invariants, so variety never costs quality.

| Dimension | Options (grow over time) |
|---|---|
| **Style** | `journey` (light-led, thread through the story). New styles are added as `styles/<name>/STYLE.md` |
| **Palette** | Primary: the brand colour (Accenture Purple by default) · one secondary hue from a curated set (teal, coral, amber, blue, green) used only for state or one supporting role · ground temperature (cool lavender, neutral, warm paper) |
| **Ground** | V1 light + arc · V2 + story depth field · V3 lattice · arc anchor (lower right, upper left, bottom band) |
| **Signature device** | Journey line · orbit around a core · a growing grid · a tracked object · a light band |
| **Illustration world** | Soft-flat scenes · isometric system · photo-led with drawn overlays · data-led |
| **Motion character** | Calm (long glides, more holds) · measured (default) · brisk (shorter holds, more Travel and Build). All under the one-mover rule |
| **Pacing** | The VO sets the clock. The profile sets the hold after each line (0.4–1.0 s), the segment entry style, and how often camera travel is used |
| **Type** | Inter (default) · one alternative OFL display face for headlines only (e.g. Manrope, Plus Jakarta Sans) |
| **Music** | Chosen per film from licensed or owner-supplied tracks, to match the film's energy |

**How much: the tuning scale.** The variety dimensions choose the kind of look. The tuning scale
([styles/SCALE.md](styles/SCALE.md)) sets the amounts:
- eight dials (Energy, Pace, Camera, Density, Background, Type, Realism, Sound), each from −2 to +2;
- Aether is 0 on every dial;
- presets by theme;
- live previews of every step in `styles/scale/index.html`.

The dials change amounts and never the invariants above. The scale is a director's target, not engine code: the
runtime and kit don't read it.

## Optional helpers (not a pipeline)
- **Treatments for single segments:** `engine/kit/sketch.js` (hand-drawn line), `iso.js` (isometric), `data.js`
  (charts drawn as spoken) and `screen.js` (living screencast), after lemo-opuscar's styles, which are pinned in
  `third_party/lemo-opuscar/`.
- **Shader grounds:** `engine/kit/shader.js`. Each treatment's rules are in `styles/treatments/`.
- **Kinetic text:** `engine/kit/text.js` (`KT` and `KTswap`: varied placement, entrances and word swaps), shared by all films.
- A film calls these only when a segment needs one. They use the same runtime, curves, grid and process, and add no
  stages. Demos are in `films/_gallery/` (parked; see its README).
- **GSAP and the old pattern library** stay archived outside the repo. Bring a GSAP plugin back only if a technique
  truly needs it and the runtime can't do it simply.

## Folder map
```
README.md            what it is, the films, how to run it
ENGINE.md            this file
DIRECTOR.md          the process, stage by stage
styles/journey/      STYLE.md, BACKGROUNDS.md, tokens.css, fonts, icon licence
styles/studio/       studio.css: the warm studio world (the frame motif)
styles/SCALE.md      the tuning scale: eight dials vs Aether, presets by theme · styles/scale/ live previews + storyboard card
engine/runtime/      film.js: timeline, easing, camera, continuity helpers, sound events, text export
engine/kit/          kit.js components (text slots, cards, chips, scenes, hub, photos) · icons.js (Lucide) ·
                     ground.js: the living ground (drifting washes, story textures, floating frames, light sweeps)
engine/render/       frames.mjs (stills at times) · video.mjs (frames -> MP4, in parts) · still.mjs · page.mjs (long pages) ·
                     chrome.mjs (headless Chrome that can't hang)
engine/audio/        vo-clock.py (VO -> segment clock, no speech model) · mix.mjs (VO + music cues + SFX, measured)
films/_template/     FILM.md to copy for each new film
films/<slug>/        FILM.md · phrases.txt + vo.mp3 -> timing.js · storyboard/ · film.html + film code · assets/ · out/
films/HISTORY.md     one line per film: its film-system choices (for the variety rule)
library/             photos, music, sfx, fonts, icons + LEDGER.md
tools/heavy-lock.mjs one heavy job at a time
tools/measure.mjs    reads the scale's measured dials from a final render
```
