# The tuning scale

Eight dials tune a film around a **Base** (0). Each runs from −2 to +2. The Base is calibrated on the first film's
measured settings (Aether), but nothing the owner sees is named after a film.

A film starts from a **preset** chosen by its theme. The owner adjusts any dial in the storyboard, film-wide, and can
still tune each segment on its own board as before.

**See it move:** open [scale/index.html](scale/index.html) in a browser.
1. **Pick a preset.** Each preset plays an example made for its theme, at its own setting (`scale/presets.js`): the
   product story, the capability montage, the launch reveal, the step-by-step explainer, results for leadership, a
   person's story, the product walkthrough. There is also **Custom**, to describe what you want in your own words.
2. **Use the recommended setting**, or **customise the dials**. The Customise view fits on one screen. Pick a dial
   and a step, then compare the Base with your setting in two large players. They use one neutral demo scene, so
   only the dial's effect changes.

**The dials change amounts, never the rules.** Even at +2 a film keeps the ENGINE.md invariants:
- one primary mover;
- calm, premium and readable;
- the script's own words;
- scenes open sparse and build;
- the ground is never flat or static.

Pace is also bounded by the voiceover: a scene can't be shorter than its lines.

## The dials

"Measured" dials are read from the final render with `node tools/measure.mjs films/<slug>`. Each step is a fixed
ratio to the Base reading. "Planned" dials are counted from the film's plan.

| Dial | −2 | −1 | **0 · Base** | +1 | +2 | How it's read |
|---|---|---|---|---|---|---|
| **Energy**: how things move | entrances 1.0 s, no rise; holds 1.0 s | 0.8 s, 12 px rise; holds 0.8 s | **0.6 s glide, 24 px rise; holds 0.6 s** | 0.45 s with a little overshoot; varied entrances; things idle-drift | 0.35 s, bigger travel, pops, masks and word-by-word text | measured: % of the frame moving. Each step is ×1.5 (0.57 · 0.86 · **1.29** · 1.94 · 2.90) |
| **Pace**: how often something new arrives | ~10 beats/min; long scenes | ~15 beats/min | **21.5 beats/min; scenes 5.4 s** | ~30 beats/min; word-level beats on keywords | ~42 beats/min; swaps within a line | measured: text arrivals per minute. Each step is ×1.4 |
| **Camera**: how the view moves | locked frame | one slow push per section | **a slow push, a pan at each section change; ≤1.03× zoom; 2 parallax layers** | travels between groups; push-ins to 1.5×; 3 parallax layers | continuous camera: zoom-throughs to 3×, pull-outs, travelling shots | planned: camera moves per minute and depth |
| **Density**: how much is in the frame at its peak | one idea: a line or one object | a headline and 1–2 elements | **a headline, 3–4 cards, the line and the hub** | adds labels, status pills and a second group | layered frames: cards, chart, chips, a photo inset | measured: % of the frame carrying edges. Each step is ×1.25 (3.6 · 4.5 · **5.6** · 7.0 · 8.7) |
| **Background**: how alive the ground is | a near-still tone; only the light drifts | light and arc; one change per act | **CSS ground with light, arc and a parallax depth field; chapter discs** | living ground: keyframed per section, a story texture per section, light sweeps | shader grounds (mesh, aurora…) that change per section | planned: ground type and changes per minute |
| **Type**: text-led or visual-led | keywords only; the visuals carry it | short lines, ~45 words/min | **a headline and a subline per segment, 66 words/min** | kinetic text with varied entrances and display-size hero words, ~90 words/min | type-led: display type is the visual in most scenes, ~120 words/min | measured: words on screen per minute. Each step is ×1.35 |
| **Realism**: drawn or real | everything drawn in code | drawn people (figures, avatars) at human moments | **one photo moment (the planner, ~4 % of the runtime)** | photos at every human moment, about a quarter of segments | photo- and footage-led: real people and footage in half the segments or more | planned: share of segments with photos or footage |
| **Sound**: how much you hear | music only; sound effects at chapters (~13/min) | ~19/min, softer music | **29 sound effects/min, music under the voice** | ~43/min; a sound on most moves | ~65/min; risers and hits, bigger music | measured: sound effects per minute. Each step is ×1.5. The mix is always −14 LUFS |

## Where the two films sit (the Base was calibrated on Aether)

| Dial | Aether | MotionLab (measured 2026-11-03) |
|---|---|---|
| Energy | 0 | **+1.3** (2.21 % moving) |
| Pace | 0 | **+1.4** (34 beats/min) |
| Camera | 0 | **+1** (container zoom-through, pull-outs) |
| Density | 0 | **+1.1** (7.1 % fill) |
| Background | 0 | **+1** (living ground) |
| Type | 0 | **+1.4** (102 words/min) |
| Realism | 0 | **+1.5** (real people and footage in most acts) |
| Sound | 0 | **+1.4** (50 effects/min) |

## Presets by theme

At intake, the director proposes the preset that fits the script's theme. It arrives preselected in the storyboard,
and any dial can be changed from there.

| Preset | For | Energy | Pace | Camera | Density | Background | Type | Realism | Sound |
|---|---|---|---|---|---|---|---|---|---|
| **Base** | a product solving a business problem; B2B promo | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Showreel** | capabilities, a team's or a studio's work (where MotionLab sits) | +1 | +1 | +1 | +1 | +1 | +1 | +2 | +1 |
| **Launch** | a new product, an event opener, an announcement | +2 | +2 | +1 | +1 | +2 | +1 | 0 | +2 |
| **Explainer** | how something works; concepts and systems | −1 | −1 | 0 | 0 | 0 | 0 | −1 | −1 |
| **Executive** | results, strategy and numbers for leadership | −1 | −1 | −1 | 0 | −1 | +1 | 0 | −1 |
| **Human story** | people, culture, a customer's story | 0 | 0 | +1 | −1 | 0 | −1 | +2 | 0 |
| **Walkthrough** | product walkthroughs and training from screenshots | −1 | −1 | +1 | −1 | −2 | +1 | +2 | −2 |

**Notes on the presets:**
- In Walkthrough, Realism +2 means the real product screens, Camera +1 means the zooms into the UI, and Type +1 means
  the kinetic captions.
- The previous film still matters: the variety rule (ENGINE.md) applies on top of the preset.

## In the process

| Stage (DIRECTOR.md) | What happens |
|---|---|
| 1. Intake | The director names the theme and proposes a preset |
| 4b. Storyboard | The dials sit first in Film-wide choices, around the Base. The per-segment Energy and Elements chips stay; they tune one board relative to the film's setting. "Copy my choices" includes the dials |
| 6. Build | The director builds to the numbers in the table above |
| 7. Checks | `tools/measure.mjs` reads the measured dials from the render. Anything more than half a step off the setting is fixed or flagged |
| 10. Record | The setting and the measured readings go in `FILM.md` and `films/HISTORY.md` |
