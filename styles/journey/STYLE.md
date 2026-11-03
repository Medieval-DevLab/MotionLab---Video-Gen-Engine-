# Journey: house style v1 (draft for owner review)

> A calm, premium B2B story film. The voice tells the journey; the screen paints it. One world, one purple
> thread, one idea at a time.

This is the film's design language. Every film plan is written inside it, and the checks hold every film to it.
It is a v1 draft: the style frames and the bake-off will test it. Each rule carries its source:
- **[owner]:** your words or taste-board verdicts;
- **[ANZ]:** measured from the ANZ film;
- **[PIN]:** measured from the Pinterest set;
- **[craft]:** standard design practice.

## 1. Essence, and what it is not
- The film is a **journey**: a situation, what goes wrong, what changes, where it leads. The screen **paints the
  picture**: places, people, objects and flows the viewer recognises. Product screens are one ingredient among
  several, never the whole film [owner].
- **The ANZ base (structure).** One idea per segment, held while the voice speaks, with text you can follow
  [owner, ANZ].
- **The Pinterest layer (motion).** Elements connect to and grow out of each other, and transitions are smooth and
  meaningful [owner: loved 03, 04].
- **Not:**
  - a product walkthrough;
  - an abstract shape world (08 Just AI);
  - characters or mascots (09);
  - a harsh, flat, disruptive dark film (10, 13);
  - a fast showreel;
  - a slideshow of cards.

## 2. Frame and grid (the placement maths)
- **Frame:** 1920 × 1080, 30 fps. Landscape is the master [owner]. **Unit u = 8 px**; every position and size is a
  multiple of u [craft].
- **Margins:** 120 px left and right (15u, 6.25 % W); 96 px top and bottom (12u) [ANZ 5.5 %, PIN 6–12 %].
- **12 columns, 118 px wide, with 24 px gutters (3u).** Column *n* starts at **x = 120 + (n − 1) × 142**:
  - col 1 = 120, col 3 = 404, col 5 = 688, col 7 = 972, col 9 = 1256, col 11 = 1540;
  - the right content edge is 1800.
- **Baseline: 8 px.** Every text baseline and box edge lands on it.
- **Vertical anchors:**
  - **top band:** y = 120;
  - **optical centre:** y = 520, a hair above the true centre [PIN: centred content sits ~0.7 % high];
  - **bottom limit:** y = 984.
- **Equal divisions for sets** [ANZ: centres at 17/50/82 % and 26/74 %]:
  - 2 items: centred on cols 3–4 and 9–10;
  - 3 items: centred on cols 2–3, 6–7 and 10–11;
  - 4 items: one item per 3 columns.

### Text slots (text goes only here)
| Slot | Where | Use |
|---|---|---|
| **T1 Statement** | cols 1–6, block centred on y = 520 | the voice's key sentence beside a visual (split layout) |
| **T2 Headline band** | cols 1–8, top of block at y = 120; the stage starts 48 px below the block | a headline above a scene or diagram |
| **T3 Centre** | cols 3–10, centred on (960, 520) | chapter cards and statements on their own |
| **Labels** | attached to their object, 16 px (2u) away, aligned to its left edge or centre | names of places, things, inputs, outputs |

### Visual zones
| Zone | Where | Use |
|---|---|---|
| **V-split** | cols 7–12 | with T1 |
| **V-stage** | cols 1–12, from 48 px below the T2 block down to y = 984 | with T2: diagrams, journeys, data |
| **V-world** | full bleed, camera-driven | the journey canvas. Text still sits in a slot, over space the composition leaves free; never on a scrim |

## 3. Type
- **One family: Inter** (OFL) [PIN: one family in 21/21].
- **Two weights:** 600 for statements and headlines, 400 for everything else [PIN: ≤ 2 weights].
- **One scale, ratio 4 : 3** [ANZ: headline : label ≈ 1.33]:

| Role | Size / leading (px) | Use |
|---|---|---|
| Label | 30 / 40 | object labels, small notes (the floor for legibility) |
| Sub | 40 / 56 | a supporting line under a headline |
| Headline | 72 / 96 | T2 headlines |
| Statement | 96 / 120 | T1/T3 statements [ANZ ≈ 96–100 px] |
| Display | 168 / 168 | one hero word or number, at most once per act |

- **Per frame:** at most 2 roles plus labels.
- **Per block:** at most 3 lines and **8 words**. Labels at most 4 words [PIN: median 5 words on screen].
- **Case and alignment:** sentence case; flush left in T1/T2, centred only in T3.
- **Tracking:** −1 % at 72 px and above.
- **On-screen text follows the voice:** it shows the **key phrase** of what is being said, not a transcript. It
  appears as those words are spoken [owner].

## 4. Colour: light-led, purple as the thread
- **Paper `#F7F5FA`** is the light ground, used for **about 70–80 % of the film** [owner: 02/03/04 are light].
- **Text colours:** ink `#1A1323` for text; ink-2 `#5E5868` for secondary text; line `#E2DCEA` for hairlines and
  inactive paths; surfaces are white `#FFFFFF`.
- **Accenture Purple `#A100FF`** (to be confirmed against the official brand guide) is the **only accent**. On light
  scenes it marks meaning only:
  - the spoken keyword;
  - the journey line;
  - the active or chosen element;
  - the key number.

  **It covers at most 10 % of a light frame** [PIN: one accent hue; owner: "not too loud"].
- **Deep purple ground,** a soft radial gradient from `#5B12A8` to `#2A0846` (derived from the core purple), is used
  for **chapter cards and the occasional dark section, about 20–30 % of the film** [owner: dark acceptable; ANZ and
  Wizart alternate purple and white].
  - On it: white text, a light purple `#D7A8FF` accent, and white hairlines at 20 %.
- **State colours only when the story has a state:** risk `#E5484D` and resolved `#1E9E6A`. **The risk colour exists
  only while the problem exists**, then never returns.
- **Photos and footage** are graded toward the palette: slightly cooler shadows, −10 % saturation.

## 5. Material: one construction for everything drawn
- **Soft-flat:**
  - flat fills from the palette;
  - **one soft shadow**: `0 8px 24px rgba(42,8,70,.08)` plus `0 1px 2px rgba(42,8,70,.06)`;
  - corner radius 16 px for cards and panels, full round for pills;
  - no outlines on filled shapes [PIN: one construction; owner: "neat"].
- **Lines:**
  - the **journey line** is 4 px purple with round caps;
  - inactive or past paths are 2 px `#D5CCE3`;
  - planned or simulated routes are dashed (10 / 10).
- **Icons:** one line set (Lucide, ISC licence), 2 px stroke, in 48 or 64 px boxes, ink or purple only.
- **Scenes** (painting the picture): places and objects drawn soft-flat from tints of the palette, such as a port, a
  ship, factories, a warehouse or a city. They are simple, recognisable silhouettes, not detailed illustration.
- **People** appear only as **real photos or footage** in panels, never drawn characters [owner: 09].
- **Depth:** layered parallax (the foreground moves 1.2× the background) and a tilt of at most 15° for showcase
  moments [owner liked 06's 3D movement].

### 5a. The ground: never flat [owner]
One persistent, softly lit world, researched in [BACKGROUNDS.md](BACKGROUNDS.md):
- **Always:** directional light, one large soft arc (also the shape that becomes the Chapter sweep) and subtle grain.
- **Where the story supplies them:** a depth field of its own elements.
- **In data and system segments:** a faint lattice.

The ground changes only at Chapter boundaries.

### 5b. Iconography [owner]
- **In cards and lists:** glyphs sit in a 56 px tinted badge (`#F2EAFD`, purple glyph).
- **Floating chips:** white circles with a soft shadow, 48–56 px.
  - **Only for things the voice names or the story contains:** the data travelling into a hub, the supply chain at a
    standstill.
  - **The default is none** [owner: "not too many icons absolutely everywhere unless absolutely needed"]. Use them
    only where the scene would be unclear or lifeless without them.
  - **At most 3 per scene**, and **none on chapter cards**.
  - Never over text, never generic, never moving faster than the primary mover.

## 6. The signature: the journey line
A single purple line runs through the film like a thread:
- It is **drawn just ahead of the story**: it reaches the next place a beat before that place is named.
- Places and steps are **stations on it**.
- When the story **branches**, the line splits; when the story **resolves**, the line continues.
- It **crosses into chapter cards** as a light thread, so even a chapter change stays connected.

This is the "elements connected to each other" quality you loved [owner: 03], made into the film's spine.

## 7. Segments and continuity
- **One segment = one spoken idea** (usually one or two VO sentences). It holds:
  - one text block, in one slot;
  - one visual state;
  - at most one supporting element.
- **Within a segment:** elements appear **when their words are spoken**, at least 0.5 s apart, and no more than 3
  per segment.
- **End of segment:** a hold of at least 0.6 s after the last word.

**At every boundary the plan names one move and the reason for it.** There are no other transitions: no wipes,
irises, glitches or zoom-throughs.

| Move | What happens | When to use it |
|---|---|---|
| **Swap** | The visual holds; only the text changes | The same topic continues [ANZ 0–7 s, 81–96 s] |
| **Build** | The visual holds and gains an element | Adding a detail, or building a list or set [ANZ: goals, stats] |
| **Travel** | The camera follows the journey line to the next station | The next step in a process |
| **Gather** | Several elements converge into one | Consolidation: many tools into one platform [ANZ 34–41 s; Wizart's chips] |
| **Become** | An element turns into the next scene's element | Cause → effect, problem → solution [Shopboxo: cart → button → scene] |
| **Chapter** | A deep-purple shape grows from the journey line and clears the stage | A new act: problem → solution → result |

## 8. Motion
- **Two curves only:**
  - **glide** `cubic-bezier(.22,1,.36,1)` for arrivals;
  - **travel** `cubic-bezier(.65,0,.35,1)` for camera moves and handoffs;
  - linear only for a line being drawn.

  No bounce, no overshoot [owner: calm].
- **Durations:**
  - a text line enters in 0.6 s (a 24 px rise plus fade), with a 0.08 s stagger between lines;
  - an object enters in 0.5–0.7 s;
  - a camera travel takes 1.4–2.4 s;
  - a chapter sweep takes 1.0–1.2 s.
- **One primary mover at a time.** A secondary motion is allowed only when it's caused by the primary (a label
  following its object) and is smaller than it [owner: "never too much at once"].
- **During holds:** at most a very slow camera drift (≤ 1.5 % of the frame per second), so the frame is calm but
  not dead [owner: "not flat"]. No idle wobble.
- **Emphasis, one method:** the keyword turns purple as it is spoken.
- **Numbers count only when the claim is about change,** in sync with the voice, and only from the facts list.
- **Blur** only on fast camera travel; never as a text effect.

## 9. Sound
- **The voiceover is on top.** The music bed is one calm, modern cue from a free library, ducked about 10 dB under
  the voice.
- **SFX only on primary moves:** an arrival, a travel, a gather or a resolution. They are soft, sparse (at most about
  one every 2 s) and sit well under the voice [owner: "motion-tied SFX would be great"].
- **Delivery:** −14 LUFS, with the true peak ≤ −1 dBTP **measured on the final MP4**.

## 10. Segment treatments, drawn in this style
| Content | Treatment |
|---|---|
| A mechanism or platform change | **Hub build:** inputs on one side, the platform as a purple core, outcomes on the other, joined by Gather and Build [ANZ Workday] |
| Data or numbers | **Drawn chart:** the journey line itself draws the data as it's spoken; hairline axes; annotations at label size [owner loved 15] |
| A process or system | **System view:** soft-flat isometric blocks in palette tints, with the subject tracked by a purple ring [12] |
| A product feature | **Product moment:** the UI rebuilt in this material, at most a 15° tilt, one camera glide [16, 06] |
| Human context | **People panel:** a graded photo or clip in V-split or full bleed, with text in T1 or T2 |

## 11. Never
- **Too much at once:** more than one primary mover, or elements arriving faster than they can be read [owner].
- **Decoration without a job:** sparkles, emoji, idle wobble, random icons, a cursor with nothing to click [owner].
- **Off the system:** off-grid placement, a type size off the scale, a third weight, a second accent colour.
- **Unreadable or unfollowable text:** a block over 8 words, text the voice isn't saying, text gone before it can be
  read.
- **Invented facts:** a number on screen that isn't in the script, the VO or the supplementary material [owner
  rule].

## 12. What the checks will verify (later, automatically)
- Every text box sits on the column edges and the baseline, in an allowed slot.
- Every size and weight is on the scale.
- Margins are respected.
- At most 2 type roles per frame.
- Only palette colours are used, with accent coverage ≤ 10 % on light frames.
- There is one primary mover at a time.
- Text stays up for its read time.
- Every on-screen number is in the facts list.
- Loudness and true peak are measured on the MP4.
