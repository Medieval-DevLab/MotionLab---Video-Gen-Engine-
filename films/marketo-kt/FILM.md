# Marketo KT: automated audience segmentation

## 1. Brief
- **What:** a knowledge-transfer screen walkthrough. It shows how one Smart Campaign segments an audience in Marketo
  Engage and proves the result with a number at every step.
- **Script and voiceover:** the owner's 3:30 script and its ElevenLabs take (Lauren), read verbatim. The 9.5-minute draft
  and the 7-minute take were not used.
- **Screens:** the owner's 17 captures, kept in `raw/` (git-ignored). `Marketo_Visibility_1` was left out because it
  shows another project. The owner said the data is fake, so there is no blurring. The Dashboard banner is removed
  (`redact.py`).
- **Length and format:** 3:32, 1920×1080, 30 fps.
- **Owner's process note:** no storyboard gate for this film ("Build the complete video now").

## 2. Film system
| Dimension | Choice |
|---|---|
| Tuning scale | The Walkthrough preset nudged up, at the owner's request ("slightly more dynamic and elemental than Aether and MotionLab, but don't overdo it"). Energy 0, Pace 0, Camera +1, Density 0, Background 0, Type +1, Realism +2, Sound −1 |
| Style | A screen stage: each capture in a framed window on a living ground, with a camera that zooms to the element being explained |
| Signature device | The highlight ring (placed before the cursor arrives), and purple "Learning N of 8" cards with a connector to their anchor |
| Ground | Living ground: dots (intro) → focus rings (concepts) → a quiet grid (build) → light (close) |
| Motion | Ease-in-out travel. The cursor rests 1 s after every click. The camera is completely still while a card is up |
| Type | Inter, with Plus Jakarta Sans for the step headers. Captions show the spoken phrases |
| Music | uplifting-inspiring, low under the voice. Soft clicks on clicks and a soft chime per card |

## 3. Facts (every number on screen comes from a capture or the script)
| Fact | Source |
|---|---|
| 586 people in Database People Audit | Database_People_Audit_Smart_List (Person Count), Smart_List_People ("1-50 of 586") |
| Filter: Person was Created, on or before 08/20/2031 | Smart_List_Filters |
| 0 members, no rules, no steps (the before state) | KT_Campaign_View |
| About 216 existing people (estimate); each person runs through the flow once | Schedule_Tab |
| 216 Add to List activities | Campaign_Result ("1-200 of 216 items") |

## 4. Plan and timing
- **Script:** the one used for the 3:30 take, which the owner supplied on 2026-11-04. A first pass used an earlier
  draft, which is why the steps and concept lines were out of sync; it was fixed.
- **Clock:** `phrases.txt` → `timing.js`, using `engine/audio/vo-clock.py` (no speech model). A `+ ` line shares a
  speech run with the line above; `~` marks a breath.
- **How the run grouping was checked:** by matching sounds against the voiceover itself. That found all 8
  "Remember:", all 8 "Step" words, and every spoken 586 and 216.
- **Cut from the audio, because there is no screenshot for them:**
  - "In the Qualified People list, we see 216 members." (Step eight);
  - "216 members." (the closing count).
- **Reading pauses after short "Remember" lines** (no words changed): s06 +0.47 s, s09 +0.52 s, s12 +1.09 s,
  s14 +1.87 s, s17 +2.3 s, s25 +0.82 s.
- **Shape of the film:**
  - the intro, where the real screens fan in around the title, then the three outcomes and the setup;
  - the concepts, drawn;
  - Step one to Step eight, each with a "STEP N OF 8" header and progress dots;
  - the close, with the counter 586 → 216 → 216.
- **Screen sync:** every screen action leads the voice by 0.9 s, but never inside a learning card's still window.
  There is one highlight at a time. The cursor glows purple, and each click blooms a soft purple light.

## 5. Learning card QA (from `window.QA`; the camera, cursor and screen are checked to be still while each card is up)
| Learning | Scene | Card in (s) | Card out (s) | Duration (s) | Camera still | Pass |
|---|---|---|---|---|---|---|
| L1 | s06 | 36.67 | 42.31 | 5.64 | Y | Pass |
| L2 | s09 | 61.50 | 67.08 | 5.58 | Y | Pass |
| L3 | s12 | 85.49 | 91.05 | 5.56 | Y | Pass |
| L4 | s14 | 105.03 | 110.63 | 5.60 | Y | Pass |
| L5 | s17 | 140.94 | 146.47 | 5.53 | Y | Pass |
| L6 | s19 | 155.25 | 161.42 | 6.17 | Y | Pass |
| L7 | s21 | 174.02 | 180.23 | 6.21 | Y | Pass |
| L8 | s25 | 202.96 | 208.48 | 5.52 | Y | Pass |

## 6. Credits
- Screens: the owner's Marketo Engage sandbox captures.
- Voiceover: the owner's (ElevenLabs).
- Music and SFX: library (see `library/LEDGER.md`).

## 7. Known gaps
- **P16 (the Qualified People member list) was never captured.** Its lines were cut, so the close shows three
  counts, not four.
- **Person_Attribute** still has the SFDC Type dropdown open (Contact is in the field, User is highlighted).
- **The tree in the Create/New/Naming captures** shows 00.Testing; later captures show KT Programme.
