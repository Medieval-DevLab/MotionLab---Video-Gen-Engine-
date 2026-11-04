# Craft techniques across styles

Techniques that make the difference in every style, and how each applies to our engine. They are notes for the director; none of them is built into the engine yet.

1. **One cue grid.** Hang every event on one grid (VO word times for us, music beats as a secondary snap) and start each move about 0.05 s early so it lands on the cue. Keep all cue times in one table, so retiming is one edit.
2. **Closed-form springs, summed per retarget.** Use the critically damped step response `1 − (1 + ωt)·e^(−ωt)` (or lightly underdamped), adding one response per target change. It stays a pure function of time: a tiny helper beside our two eases.
3. **One carried object.** One dot, card or number carries identity across scenes and lands on the same pixels on both sides of a handoff. Record those handoff boxes before building scenes; this is our continuity move made exact.
4. **Floods and irises.** Floods overshoot the corners in about 0.3 s with a soft start, then become a plain rectangle. Irises ease by area. A flood must finish before the next scene starts.
5. **Separate enter and exit timing.** Text in a morphing container has its own mask, enters after the morph starts and leaves before the next. Outgoing titles clear before incoming ones take the space.
6. **Speed always changes.** Land slowly, leave fast, overlap a lead move with smaller ones under it. Nothing starts or stops all at once.
7. **Camera discipline.** One eased move per scene, no zoom-in-then-out, zoom interpolated in log space, camera settling more slowly than its subject. No layer promotion on anything the camera scales, or text blurs.
8. **Motion blur by sub-frame blending.** Average 3–8 sub-frames per frame (8 for whips). Counters and typed text read frame time, not sub-frame time, so they stay sharp. Fits headless Chrome plus an ffmpeg blend.
9. **The first frame is finished; the last frame holds.** Frame one is a composed picture. The end holds long enough to read. Loops match geometry and cursor velocity at the wrap.
10. **Measured freeze and pop QA.** After a render, measure frozen time (about 1 s per 30 s at most, no unplanned still over about 0.5 s) and flag single-frame pops (frame difference about 3× its neighbours). Cheap to add to our regression check.
11. **Stills first, then a fresh critic.** One still per beat or segment, plus a dense strip around each transition, before the full render. A reviewer who never saw the build returns ranked, timestamped problems, and each round goes in a ledger. This maps onto our board gate and per-segment notes.
12. **Ask for inputs, with defaults.** The best briefs list their inputs, say what happens if one is skipped, and show a beat map plus 4–8 stills before building. Add an "inputs" block to our board.
13. **Facts file and claim guardrails.** Every on-screen number or claim comes from one facts file. Never fabricate customers or results, and list what must not be claimed.
14. **SFX by measured peak.** Align each effect's transient peak, not its file start, to the event. Use one soft whoosh per real scene change and clicks only on real actions. Duck the music under VO, finish at −14 LUFS, and keep a music-only stem.
15. **A ban list per style.** Each family names what it refuses (particles, glows, crossfades, bouncy easing, long holds). A short ban list on each board guards against "too much in too little time".
16. **Cursor grammar.** Aim at where the target will be, cap the speed (under about 65 px per frame), scale the cursor with the camera, and spring drags from the release point and speed. Typing shows `floor(progress × length)` characters, and the caret blinks only when idle.
17. **Legibility guards.** At least 4.5:1 contrast, a backing behind any text on busy picture, a minimum size for the phrase being read, and no ornamental motion before the reading hold ends.
18. **Footage as frames.** Use all-intra or JPEG-sequence clips, draw frame `floor(t·fps)` and await decode, so real footage stays deterministic.
19. **Film finish as a post pass.** Per-frame grain, halation, a soft vignette and an edge-clamped one-pixel colour fringe, as an optional final shader or ffmpeg step.
