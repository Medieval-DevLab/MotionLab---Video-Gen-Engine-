# Backgrounds: research and the ground system (v1, for owner choice)

**The owner's ask (2026-11-02):** "the background is just plain colour, we don't want that… research and think of
what are the good ways of building backgrounds for such videos".

**Method:**
- Technique counts from the 234 tagged prompt-motion films (`library/examples/prompt-motion/atlas.json`).
- 20 reference frames chosen for their background treatment, viewed side by side: ANZ, Groundswell, Shopboxo,
  Wizart, Liquide, Nexus, RedShip, Lark and three lemo-opuscar films.
- Our three style frames, rendered in three background variants.

## 1. What the references do

| Technique | Seen in | What it does | Fit for our style |
|---|---|---|---|
| **Directional light gradient** | ANZ (diagonal light band on purple, 6 s); lemo keynote (radial lift + vignette); lemo screencast (warm radial) | One light source gives the flat ground depth and leads the eye | **Always**, as the base layer |
| **Large soft shapes / colour fields** | Groundswell (soft grey quarter-circles on off-white, 7.5 s; a half-frame green circle, 33 s); Wizart (a wave, 27.5 s) | Gives the frame structure and a second plane; the same shape later grows into the next ground | **Always**: one arc system, which is also the Chapter move |
| **Depth field of related elements** | Groundswell (category chips floating at several depths on dark green, 20.5 s); Nexus (out-of-focus app icons, 1.2 s); RedShip (a wall of blurred, tilted post cards, 2 s) | Turns the background into the story's world; depth without decoration, because every element is something the story is about | **Selected scenes**: only things the voice names or the story contains |
| **Faint structure: grid / lattice** | Wizart (purple grid lines, 6.5 s); lemo keynote (hairline grid); lemo isometric (dot lattice); Yahoo (graph paper) | A system or technical feel; ties the ground to the layout grid | **Data and system segments**, and chapter cards |
| **Environment** | RedShip (sea and light beam, 13 s); Wizart (orbit rings around the core, 12 s); ANZ (glow behind the hub, 38 s) | The scene itself extends into the background | **Yes**: the picture we paint (port, sea, hub glow) |
| **Photo / footage panels** | ANZ (people beside statements) | Human context | **People segments** |
| **Grain** | 7 atlas films; lemo adds it at delivery | Tactility; stops gradient banding | **Always**, very subtle |
| **Mesh colour clouds** | Nexus (yellow-blue blur, 13 s); Lark | Modern, soft, but loud | **Only inside deep-purple chapters**, if at all |
| **Ghost giant type** | Liquide (huge outlined words, 2 s) | Drama | **No.** Too loud; text duplicated for effect |
| **3D environment** | Lark; property dashboard | Product showcase | **Product-moment segments only** |
| **Flat colour** | Shopboxo | Works only when product screens fill the frame | **No.** The owner rejected it |

## 2. Principles distilled
1. **Three depth planes.**
   - **Far:** the light, the arc and, where used, the pattern.
   - **Mid:** the scene or diagram.
   - **Near:** an occasional out-of-focus element, in motion only.

   The camera moves them by parallax: light 0×, pattern 0.5×, arc 0.8×, scene 1×, near 1.3×.
2. **Quiet behind text, detail where the eye should go.** Low contrast and low detail behind text slots; the lattice
   is masked toward the stage.
3. **One world.** The same light direction and the same arc in every scene. The ground changes only at a Chapter
   boundary, when the arc grows into deep purple.
4. **The background carries meaning when it carries anything.** Floating elements are things from the story
   (Groundswell's chips are the charity categories), never generic decoration.
5. **Slow.** A drift of at most 1.5 % of the frame per second, moving only with the camera. Never competing with the
   primary mover.

## 3. The ground system (implemented in `tokens.css`)
- **Always:**
  - paper base;
  - **light** (white glow from the upper left, a soft purple pool at the lower right);
  - **one large arc** anchored off-frame lower right, faint purple-tinted;
  - **grain** at 5 %.
- **Selected scenes:**
  - **depth field:** 3–6 far chips at 60 % opacity, 56 px, with story icons, only in free space and never behind text;
  - **lattice** in data/system scenes.
- **Deep chapters:** the same layers in a deep-purple version (a lighter purple glow upper left, a white-tinted arc,
  glass chips).

## 4. Variants rendered for the owner (frames A and C, plus B deep)
| Variant | Layers | Character |
|---|---|---|
| **V1 Light + shape** | light, arc, grain | Calm, structured, Groundswell-like |
| **V2 Light + shape + depth** | V1 plus a story depth field | Richer and more immersive; the owner's "little floating elements" |
| **V3 Structure** | light, dot lattice, vignette, grain (no arc) | Technical, Wizart/keynote-like |

**Owner decision (2026-11-02): V2**, "but let's not do too many icons absolutely everywhere unless absolutely needed".
The depth field is therefore **off by default**: at most 3 elements, only where the story needs them, none on chapter
cards.

**Recommendation (before the decision):**
- **V2 as the house ground,** with the depth field used only where the story supplies the elements.
- **V3's lattice** kept as the treatment for data and system segments.
- **V1** is what V2 becomes in scenes with nothing to float.

**Not yet shown in stills:** parallax, slow drift and near-plane depth of field. They read only in motion, and the
bake-off tests them.
