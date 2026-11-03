# MotionLab: Your imagination. In motion.

**Status:** storyboard tuned by the owner (2026-11-02), film built: [film.html](film.html) with [film.js](film.js), [ml-a.js](ml-a.js) (acts 1-3), [aether.js](aether.js) (act 4) and [ml-b.js](ml-b.js) (act 5). The owner asked to build straight away, so the style-frame gate was skipped.

## 1. Brief
- **Script:** owner-supplied (2026-11-02), verbatim in [timing.js](timing.js) as 87 phrases.
- **Voiceover:** [vo.mp3](vo.mp3), owner-supplied. 183.64 s, mono, 44.1 kHz.
- **Clock:** taken from the VO with no speech model.
  - ffmpeg `silencedetect` (−40 dB, ≥ 0.18 s) finds 87 speech runs, which match the 87 script phrases one to one.
  - The speaking rate is consistent (median 4.9 syllables/s). The only outliers are the drawn-out "well,", "And…" and "there you have it.".
  - Segment boundaries sit at the middle of the pause between phrases.
- **Length and aspect:** 186.5 s (the VO plus a 3 s end hold), 16:9, 30 fps.
- **Purpose:** a portfolio promo for MotionLab, the engine itself. Its proof is a film-within-a-film: the Aether product story, played full screen as "what MotionLab made".
- **Brand:**
  - MotionLab has no logo supplied, so the wordmark is typeset.
  - Accenture is named in the voice only. No Accenture logo is used unless supplied.
  - "Claude Opus" appears as text only, with no Claude or Anthropic marks.
- **Structure:** 5 acts and 36 segments ([timing.js](timing.js)):
  - **Act 1, the problem (0:00–0:31):** innovation goes unseen, and video takes time, effort and skills.
  - **Act 2, the turn (0:31–0:53):** what if AI could make any video, in any format and style, from a reference?
  - **Act 3, MotionLab (0:53–1:22):** what it is, what it does and what it needs; then "let's put it to the test".
  - **Act 4, the Aether showcase (1:22–2:32):** the product story, in the journey look the owner approved.
  - **Act 5, the reveal and close (2:32–3:06):** it was made by MotionLab, and anything else can be too.

## 2. Film system (proposed; the owner picks in the storyboard's film-wide choices)
| Dimension | MotionLab parts (acts 1–3, 5) | Aether showcase (act 4) |
|---|---|---|
| Style | `studio` (new; same craft rules as `journey`) | `journey` (as approved) |
| Palette | Accenture Purple · amber "attention" light · warm paper | as Aether |
| Ground | Light from the upper right, arc from the lower left, grain | V2, arc lower right |
| Signature device | The point of light (the idea) and the frame (the video) | The journey line |
| Illustration world | UI and product specimens (frames, studio, tiles) + a network of points | Soft-flat scenes + hub + photo panel |
| Motion character | Brisk: every scene opens sparse and builds | Brisk |
| Pacing | 0.4 s holds, more camera travel | 0.4 s holds |
| Type | Plus Jakarta Sans headlines + Inter | Inter |
| Music | `bgm-tech-house` (Mixkit) | `uplifting-inspiring` (owner) |

**Variety check against `films/HISTORY.md`:** the MotionLab parts differ from aether on style, ground, signature, illustration,
motion, pacing, type and music. The act 4 reuse is deliberate: it *is* the Aether film, so act 4 is exempt.

**Recurring objects (continuity across the whole film):**
- **The point of light:**
  - born in s01; ignored in s03; buried in s04–05;
  - it becomes the cursor in s07–08 and the bloom in s34;
  - finally seen in s35.
- **The frame:**
  - inbox → slide → player → canvas → studio → the Aether film → gallery.
- **The spotlight:**
  - passes our point by in s03, and lands on it in s35.
- **The document:**
  - the Aether story goes in at s18 and comes back in s31 as the source of what we just watched.

## 3. Facts ledger
| On screen | Source |
|---|---|
| Accenture; thousands of reinventors | Script line 1 |
| Product showcases, software demos, client communications, training videos | Script, act 2 |
| An AI-powered video creation engine, built on Claude Opus | Script, act 3 |
| Animated workflows, product simulations, motion graphics, synchronized voiceovers; the entire production process | Script, act 3 |
| Your story, a voiceover, a creative reference | Script, act 3 |
| Thousands of shipments, hundreds of suppliers, millions of moving parts | Script, act 4 (words only, no counters) |
| Singapore; a critical shipment delayed; three manufacturing facilities at risk | Script, act 4 |
| Enterprise systems, warehouses, logistics networks, forecasts; one intelligent command center | Script, act 4 |
| Analyzes inventory, identifies production risks, simulates alternative routes | Script, act 4 |
| Costs, capacity, delivery commitments (bars only, **no numbers or scores**) | Script, act 4 |
| A planner approves; the carrier rejects; finds an alternative, reroutes, synchronizes | Script, act 4 |
| Real-time dashboards: costs, deliveries, operational risks (**no axis numbers**) | Script, act 4 |
| Animated workflows, enterprise interfaces, intelligent visual storytelling; product demos, client communications, explainers | Script, act 5 |

**Carried over from the first Aether film, and must not appear:** "48 hours" and "12 %". This script doesn't contain them.

## 4. Segment plan
The plan for every segment lives in [storyboard/segments.js](storyboard/segments.js) and is rendered by
[storyboard/index.html](storyboard/index.html). For each segment it records:
- the text flow;
- start, build and peak;
- the primary mover;
- the move into the next segment;
- the sound;
- the tuning options.

The owner's choices are folded in here after tuning.

## 5. Credits
| Asset | Source | Licence |
|---|---|---|
| Voiceover `vo.mp3` | Owner-supplied (generated by the owner with ElevenLabs, voice "Lauren") | The owner's; ElevenLabs terms depend on the owner's plan |
| Inter | rsms/inter | OFL-1.1 |
| Plus Jakarta Sans | `library/fonts/plus-jakarta-sans` (fontsource) | OFL-1.1 |
| Lucide icons | lucide.dev | ISC |
| `bgm-tech-house.mp3` (if chosen) | Mixkit | Mixkit Stock Music Free License |
| `uplifting-inspiring.mp3` | Owner-supplied | Cleared by the owner, 2026-11-02 |
| SFX | Mixkit (`library/audio/sfx`) | Mixkit Sound Effects Free License |
| Planner photo `laptop-work-ed1c4fde.jpg` | Openverse (`library/photos/index.json`) | CC0 1.0 |

## 6. Review log
| Round | Owner notes | Changes |
|---|---|---|
| Storyboard v1 | Film-wide: all recommended. s01: "At Accenture" too small and timid; left-aligned text repetitive; show people doing something. s02: the concepts are unclear (just nodes). s03: show attention as camera focus. s04: inbox centred, text in T2; not all text left aligned. s06: real video snippets. s08: good. s13: more focus on the window. s16: the background is the same everywhere. s17: icons, not just text; subtext too slim. | s01: people photos arrive from every side and become a mosaic of thousands; big centred text, letter by letter. s02: three people, three clear things (an app is built, four capabilities light up, a tangle straightens into a path); a word-swap headline. s03: a camera viewfinder focuses one innovation while the rest blur and fade. s04: centred full-height inbox, headline top-left, sub bottom-right. s06: a real clip from the Aether film plays; the editor shows a real filmstrip. s13: a large centred window, glow and push-in. Living background through the whole film. s17: lightbulb, speech-bubble and flask icons. Subtext weight 500 across the engine. Text placement and entrances varied everywhere. |
