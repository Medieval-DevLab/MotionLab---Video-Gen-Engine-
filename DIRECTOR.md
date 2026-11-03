# The process: every film, every time

Follow these stages in order. Each stage has an output file and a check. Never skip a gate. When a stage fails, fix
the cause and repeat that stage.

## 1. Intake
- **Inputs:**
  - the script;
  - the voiceover WAV (or "none": time it as if narrated, at about 2.5 words/s);
  - supplementary material;
  - brand assets (logo, colours, fonts) if any.
- **Ask the owner once** for anything only they can decide (names, facts, assets). Then proceed.
- **Name the theme and propose a tuning-scale preset** ([styles/SCALE.md](styles/SCALE.md)), for example Launch,
  Explainer or Walkthrough. Aether is the base.
- **Output:** `FILM.md` §1 (the brief) and §3 (the **facts ledger**: every number and claim, each with its source
  line).

## 2. Segments and clock
- **Split the script into segments,** one spoken idea each: usually one or two sentences, 2–8 s.
- **Time each segment:**
  - from the VO, by the model-free alignment of the script words;
  - with no VO, at about 2.5 words/s plus a 0.4–1.0 s hold.
- **Group segments into acts,** usually 3–5: situation, problem, turn, proof, close.
- **Output:** the segment table skeleton in `FILM.md` §4 (id, words, t0, t1, act).

## 3. Film system (the variety step)
- **Choose one option per variety dimension** ([ENGINE.md](ENGINE.md)) to fit this story and its brand.
- **Check `films/HISTORY.md`:** differ from the previous film on at least three dimensions.
- **Pick 2–3 reference moments** (film + timestamp) for what to learn.
- **Output:** `FILM.md` §2.

## 4. Plan
For every segment write:
- the **on-screen text**: the script's own words (a verbatim excerpt at most, never reworded), the slot and the keyword.
  Any trim is flagged;
- the **visual** as three states:
  - **start:** sparse;
  - **build:** what arrives or changes on which spoken word;
  - **peak:** late in the segment, never at its first frame;
- the **primary mover**: the one thing moving at each moment;
- the **move into the next segment**: Swap / Build / Travel / Gather / Become / Chapter;
- the **reason** for that move;
- the **sound event**: none, or one soft SFX on the primary move.

**Gate:**
- the film follows the script: segments come in script order and every visual shows what its line says;
- every number traces to the facts ledger;
- every visual element has a job;
- at most 3 floating icons per scene, and none on chapters;
- no segment opens at its peak.

**Output:** `films/<slug>/storyboard/segments.js` (the plan), and a summary in `FILM.md` §4.

## 4b. Storyboard and tuning (owner gate, every film)
- Render the plan as `films/<slug>/storyboard/index.html`. Every segment shows:
  - its script lines with VO times;
  - wireframe panels (start → peak) on the real grid and type scale;
  - the plan fields;
  - **tuning options:** energy (calmer / as planned / more dynamic), elements (fewer / as planned / more), an
    alternative layout, and, where useful, an alternative concept. Each option has a specific description;
  - a free note.
- Film-wide choices (look, energy, music, colour, type, sound) are offered with a recommendation preselected.
- **The tuning scale** sits first in Film-wide choices (`styles/scale/card.js`). It shows the proposed preset and
  the eight dials against Aether, linked to the live previews (`styles/scale/index.html`). The per-segment chips
  stay: they tune one board relative to the film's setting.
- **Self-check** the page (no page errors; a contact sheet of every panel for collisions) before showing it.
- The owner returns the "Copy my choices" text. Fold it into the plan, then continue to stage 5. **Never build
  before the owner has tuned the storyboard.**

## 5. Style frames (owner gate on a new film system)
- Render **3 stills** at the plan's key moments with the real kit: one problem scene, one chapter card, one
  diagram or proof scene.
- **Self-check** them at full size against the style. Fix collisions, crowding, off-grid placement and repetition.
- **Show the owner when the film system is new;** reuse approval when the film system repeats.

## 6. Build
- Write `film.html` and `film.js` on the kit.
- **Rules:**
  - every frame is a pure function of time;
  - positions come from the grid helpers;
  - motion uses the two curves;
  - continuity uses the named moves;
  - sound events are emitted by the moves themselves.
- **Build to the scale.** Use the numbers in [styles/SCALE.md](styles/SCALE.md) for the chosen setting: entrance
  speeds, beats, camera moves, element count, ground, words, realism and sound.

## 7. Checks (before showing anything)
- **Stills:** a contact sheet every 2 s, plus 0.2 s strips at every boundary and hero moment.
- **Look for:**
  - text out of its slot;
  - overlaps and clipping;
  - two things moving at once;
  - text gone before it can be read;
  - a boundary with nothing carried across, unless it's a Chapter;
  - an empty or flat frame.
- **Fix everything found in one pass, then re-check once.**

## 8. Review render
- Run `video.mjs` (MP4), then `mix.mjs` (music + SFX, loudness-normalised).
- **Measure the final MP4** (−14 LUFS, TP ≤ −1 dBTP) and verify the exact frame count.
- **Measure the scale:** `node tools/measure.mjs films/<slug>`. A measured dial more than half a step off its
  setting is fixed, or flagged to the owner.
- **Deliver to the owner:**
  - the MP4;
  - the contact sheet;
  - `FILM.md`;
  - a short note on what to judge and what is known to be weak.

## 9. Notes and revision
- Owner notes come per segment or timestamp.
- **Change only the segments named.** Re-check those boundaries; re-render; re-measure.

## 10. Final and record
- Run the final render, then add one line to `films/HISTORY.md` (the film-system choices, the scale setting and
  its readings) so the next film varies.
- Record the source and licence of every third-party or owner-supplied asset in `FILM.md` §5 (CREDITS).
