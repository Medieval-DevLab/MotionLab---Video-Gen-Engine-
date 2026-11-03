# Film history (the variety rule)

One line per film, recording its film-system choices. A new film must differ from the previous one on at least
three dimensions ([ENGINE.md](../ENGINE.md)).

| Film | Date | Style | Palette (primary · secondary · ground) | Ground | Signature | Illustration | Motion | Pacing | Type | Music |
|---|---|---|---|---|---|---|---|---|---|---|
| aether | 2026-11-02 | journey | Accenture Purple · state red→green · cool lavender | V2 sparse, arc lower right | journey line | soft-flat scenes + hub + photo panel | measured | 0.6 s hold | Inter | uplifting-inspiring (owner) |
| motionlab | 2026-11-03 | studio (acts 1-3, 5) + journey (act 4, the Aether showcase) | Accenture Purple · amber "attention" light · warm paper | living ground: drifting washes + one story texture per section | the point of light + the frame | real people + UI/product specimens + real footage | brisk, varied kinetic text | 0.4 s hold, VO-timed | Plus Jakarta Sans + Inter | bgm-tech-house (Mixkit) + uplifting-inspiring under act 4 |
| marketo-kt | 2026-11-04 | screen stage (framed captures, zooming camera) | Accenture Purple · green for checks · cool lavender | living ground: dots → focus rings → quiet grid → light | highlight ring + "Learning N of 8" card with connector | the owner's real captures + drawn concept diagrams | calm-brisk; cursor rests 1 s after clicks; still camera under cards | VO-timed, reading pauses after learnings | Plus Jakarta Sans headers + Inter | uplifting-inspiring, low |

## Tuning scale (vs Aether; [styles/SCALE.md](../styles/SCALE.md))

Measured dials come from `tools/measure.mjs` on the final render; the others are read from the plan.

| Film | Preset | Energy | Pace | Camera | Density | Background | Type | Realism | Sound | Readings |
|---|---|---|---|---|---|---|---|---|---|---|
| aether | the base | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | motion 1.29 % · fill 5.58 % · 21.5 beats, 66 words, 29 sfx per min |
| motionlab | (Showreel, set afterwards) | +1.3 | +1.4 | +1 | +1.1 | +1 | +1.4 | +1.5 | +1.4 | motion 2.21 % · fill 7.09 % · 34 beats, 102 words, 50 sfx per min |
| marketo-kt | Walkthrough, nudged up | 0 | 0 | +1 | 0 | 0 | +1 | +2 | −1 | (to measure after the render) |
