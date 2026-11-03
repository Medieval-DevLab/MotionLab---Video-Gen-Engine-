// MotionLab storyboard: the plan for every segment, its panels (start -> peak) and its tuning options.
// Times come from timing.js (the VO clock). Text on screen is the script's own words; trims are flagged.
(function () {
  const { C, T1, T2, T3, TB, panel, A, P, net, frame, M, J } = window.SBD;
  const S = (f) => panel('studio', 'pjs', f), JN = (f) => panel('journey', 'inter', f), DP = (f) => panel('deep', 'pjs', f), DPJ = (f) => panel('deep', 'inter', f);
  const ink = { c: C.ink };

  // ---- scene helpers -----------------------------------------------------------------------------------------
  const blocks = (x, y) => [0, 1, 2].map((i) => `<rect x="${x + i * 26}" y="${y - (i === 1 ? 26 : 0)}" width="22" height="22" rx="4" fill="${C.p}" opacity="${0.5 + i * 0.2}"/>`).join('');
  const NET = (o = {}) => net(11, 420, 1380, 600, 480, 400, { links: 3, ...o });
  function inbox(x, y, w, h, n, ours, spill = 0) {
    let s = frame(x, y, w, h) + `<rect x="${x}" y="${y}" width="${w}" height="72" rx="20" fill="#F4EFFA"/>` + P.rows(x + 32, y + 30, 160, 1, 0, '#D9CFE6');
    for (let i = 0; i < n; i++) { const ry = y + 96 + i * 88; if (ry + 72 > y + h) break; s += row(x + 16, ry, w - 32, i === ours); }
    for (let i = 0; i < spill; i++) { const ry = y + h - 40 + i * 70; s += `<g opacity="${1 - i * 0.22}">${P.rect(x + 16 + i * 10, ry, w - 32, 72, {})}${row(x + 16 + i * 10, ry, w - 32, i === spill - 1)}</g>`; }
    return s;
  }
  const row = (x, y, w, ours) => `<rect x="${x}" y="${y}" width="${w}" height="72" rx="12" fill="${ours ? C.pp : '#FBFAFD'}"/>${P.dot(x + 40, y + 36, 18, ours ? C.p : C.idle)}<rect x="${x + 76}" y="${y + 20}" width="${w * 0.42}" height="12" rx="6" fill="${ours ? C.p : '#D9CFE6'}"/><rect x="${x + 76}" y="${y + 42}" width="${w * 0.62}" height="10" rx="5" fill="${C.line}"/>`;
  const slide = (x, y, w, h, o = {}) => frame(x, y, w, h, { o: o.o }) + `<g opacity="${o.o ?? 1}"><rect x="${x + 48}" y="${y + 48}" width="${w * 0.46}" height="26" rx="8" fill="${C.ink}"/>${P.rows(x + 48, y + 110, w * 0.5, 3, 34)}<rect x="${x + w * 0.62}" y="${y + 100}" width="${w * 0.3}" height="${h * 0.5}" rx="12" fill="${C.pp}"/></g>` + (o.spark ? P.spark(x + w * 0.77, y + 100 + h * 0.25, 12) : '');
  function editor(x, y, w, h, o = {}) {
    let s = frame(x, y, w, h) + `<rect x="${x}" y="${y}" width="140" height="${h}" rx="20" fill="#F4EFFA"/>` + P.rows(x + 20, y + 30, 96, 8, 30, '#D9CFE6');
    const r = window.SBD.rnd(5);
    for (let t = 0; t < 7; t++) { const ty = y + 40 + t * 62; s += `<rect x="${x + 160}" y="${ty}" width="${w - 184}" height="44" rx="8" fill="#FBFAFD"/>`; let cx = x + 168; while (cx < x + w - 60) { const cw = 60 + r() * 150; s += `<rect x="${cx}" y="${ty + 6}" width="${Math.min(cw, x + w - 40 - cx)}" height="32" rx="6" fill="${[C.pl, C.idle, C.pp, '#E9D5FF'][t % 4]}"/>`; if (o.keys) s += `<rect x="${cx + 20}" y="${ty + 14}" width="14" height="14" fill="${C.p}" transform="rotate(45 ${cx + 27} ${ty + 21})"/>`; cx += cw + 12; } }
    return s + `<rect x="${x + 160 + (w - 184) * 0.36}" y="${y + 24}" width="4" height="${h - 48}" fill="${C.risk}"/>` + (o.clock ? P.icon('clock', x + w - 56, y - 44, 56, C.ink2) : '');
  }
  const bar = (x, y, w, p) => `<rect x="${x}" y="${y}" width="${w}" height="12" rx="6" fill="${C.line}"/><rect x="${x}" y="${y}" width="${w * p}" height="12" rx="6" fill="${C.p}"/><circle cx="${x + w * p}" cy="${y + 6}" r="14" fill="${C.p}"/>`;
  const doc = (x, y, w, h, lines) => frame(x, y, w, h) + `<rect x="${x + 32}" y="${y + 36}" width="${w * 0.3}" height="14" rx="7" fill="${C.p}"/>` + (lines || []).map((l, i) => P.txt(x + 32, y + 104 + i * 40, l, { s: 24, c: C.ink2 })).join('');
  const AETHER_LINES = ['Imagine managing a global', 'supply chain.', 'Thousands of shipments.', 'Hundreds of suppliers.', 'Millions of moving parts.', 'Now imagine… a critical', 'shipment gets delayed in', 'Singapore, putting three', 'manufacturing facilities…', 'Meet Aether.'];
  const wave = (x, y, w, h) => frame(x, y, w, h) + P.bars(x + 20, y + 30, w - 40, h - 60, 14, 3, C.pl);
  const image = (x, y, w, h) => frame(x, y, w, h) + `<rect x="${x + 16}" y="${y + 16}" width="${w - 32}" height="${h - 32}" rx="10" fill="#F1EAFA"/><path d="M${x + 24} ${y + h - 24} L${x + w * 0.38} ${y + h * 0.45} L${x + w * 0.58} ${y + h * 0.66} L${x + w * 0.72} ${y + h * 0.52} L${x + w - 24} ${y + h - 24} Z" fill="${C.pl}"/><circle cx="${x + w * 0.74}" cy="${y + h * 0.3}" r="${h * 0.08}" fill="${C.amber}"/>`;
  const link = (x1, y1, x2, y2, c = C.pl) => P.line(`M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`, { c, w: 5 });
  const studio = (x, y, w, h, full) => frame(x, y, w, h) + `<rect x="${x}" y="${y}" width="${w}" height="64" rx="20" fill="#fff"/><line x1="${x}" y1="${y + 64}" x2="${x + w}" y2="${y + 64}" stroke="${C.line}" stroke-width="2"/>` + P.txt(x + 28, y + 43, 'MotionLab', { s: 30, w: 600, f: "'Plus Jakarta Sans'" }) +
    (full ? `<rect x="${x + 16}" y="${y + 80}" width="150" height="${h - 96}" rx="12" fill="#F7F3FB"/>${[0, 1, 2].map((i) => `<rect x="${x + 32}" y="${y + 100 + i * 100}" width="118" height="80" rx="10" fill="#fff" stroke="${C.line}" stroke-width="2"/>`).join('')}${M.finished(x + 182, y + 80, w - 198, (h - 96) * 0.64)}<rect x="${x + 182}" y="${y + 80 + (h - 96) * 0.68}" width="${w - 198}" height="${(h - 96) * 0.32}" rx="12" fill="#F7F3FB"/>${[0, 1, 2, 3].map((i) => `<rect x="${x + 196 + i * ((w - 226) / 4)}" y="${y + 100 + (h - 96) * 0.68}" width="${(w - 226) / 4 - 10}" height="40" rx="8" fill="${[C.pl, C.p, '#E9D5FF', C.idle][i]}"/>`).join('')}` : '');
  const globe = () => `<path d="M-40 1100 C260 560 1660 560 1960 1100 Z" fill="#EEE6F8"/>`;
  const PORTS = [[230, 980], [560, 812], [960, 742], [1360, 812], [1690, 980]];
  function routes(o = {}) {
    let s = '';
    [[0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [2, 4], [1, 3]].forEach(([a, b], i) => { const [x1, y1] = PORTS[a], [x2, y2] = PORTS[b]; const d = `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 150 - (i > 3 ? 90 : 0)} ${x2} ${y2}`; s += P.line(d, { c: o.flow ? C.pl : C.idle, w: 4, dash: o.flow ? '' : '10 12' }); if (o.flow) for (let k = 1; k < 4; k++) { const t = k / 4, mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 150 - (i > 3 ? 90 : 0); const px = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t * t * x2, py = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t * t * y2; s += P.dot(px, py, 7, C.p); } });
    PORTS.forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="16" fill="#fff" stroke="${C.p}" stroke-width="5"/>`; });
    if (o.suppliers) PORTS.forEach(([x, y], i) => { [[-60, 40], [50, 50], [-20, 80]].forEach(([dx, dy]) => { s += `<rect x="${x + dx}" y="${y + dy}" width="20" height="20" rx="4" fill="${C.p}" opacity=".55"/>`; }); });
    if (o.ships) [[400, 760], [760, 640], [1160, 640], [1520, 760], [960, 580]].forEach(([x, y]) => { s += J.ship(x, y, 0.28); });
    return s;
  }
  const mapStrip = (x, y, w, h, o = {}) => {
    const px = x + 180, py = y + h * 0.55, F = [[x + w - 420, y + h * 0.32], [x + w - 260, y + h * 0.62], [x + w - 120, y + h * 0.36]];
    let s = frame(x, y, w, h) + P.line(`M${px} ${py} C${px + 400} ${py - 40} ${F[1][0] - 400} ${F[1][1]} ${F[1][0]} ${F[1][1]}`, { c: o.alert ? C.risk : C.p, w: 6, dash: o.alert ? '12 12' : '' });
    if (o.alts) [[-220, C.pl], [0, o.win ? C.p : C.pl], [220, C.pl]].forEach(([dy, c], i) => { s += P.line(`M${px} ${py} C${px + 300} ${py + dy} ${F[1][0] - 300} ${F[1][1] + dy * 0.6} ${F[1][0] - 60} ${F[1][1] - 10}`, { c, w: o.win && i === 1 ? 12 : 5, dash: o.win && i === 1 ? '' : '14 12', o: o.win && i !== 1 ? 0.45 : 1 }); });
    s += J.ship(px, py + 10, 0.5) + `<circle cx="${px}" cy="${py - 70}" r="${o.alert ? 46 : 0}" fill="none" stroke="${C.risk}" stroke-width="5"/>`;
    F.forEach(([fx, fy], i) => { s += J.factory(fx, fy + 70, o.risk ? C.risk : C.ok, 0.7); if (o.inv) s += `<rect x="${fx - 50}" y="${fy + 96}" width="100" height="12" rx="6" fill="${C.line}"/><rect x="${fx - 50}" y="${fy + 96}" width="${o.risk ? 24 : 80}" height="12" rx="6" fill="${o.risk ? C.risk : C.ok}"/>`; if (o.risk) s += P.icon('triangle-alert', fx + 52, fy - 30, 40, C.risk); });
    return s + P.pill(px - 110, y + 28, 'Singapore', 'neutral');
  };

  // ---- the plan --------------------------------------------------------------------------------------------
  const SEGS = [
    { id: 's01', title: 'Thousands of reinventors',
      text: 'T1 (left): "At Accenture," → "Thousands of reinventors" → "constantly building what\'s next." Each part appears as it is spoken.',
      visual: { start: 'One point of light on an almost empty, warm ground.', build: 'On "thousands" points spread outward in a wave; on "building" links draw between neighbours and small clusters assemble tiny blocks.', peak: 'A living network of reinventors, linked and working, under a slow camera push.' },
      mover: 'The wave of points, then the links.', move: ['Build', 'The network stays; s02 lights three clusters inside it.'], sfx: 'Soft rising shimmer as the wave spreads.',
      opts: { dyn: 'The camera glides sideways across the network as it spreads; points arrive in two waves.', calm: 'One slow wave, no camera move.', more: 'Three clusters show small working marks (blocks stacking, lines drawing).', fewer: 'Points only, no links.', layout: 'Text centred (T3) with the network ringing it.', concept: 'People-led: a soft mosaic of real people at work (library photos: lab, whiteboard, team) assembling tile by tile, joined by the same links.' },
      panels: [['Start', 0.0, S(() => P.spark(1480, 640, 14) + T1(['sub', 'At Accenture,']) + A.note(1480, 780, 'one point of light', 'middle'))],
        ['Peak', 4.9, S(() => NET() + blocks(1140, 430) + blocks(1600, 520) + blocks(1330, 840) + P.spark(1480, 640, 14) + T1(['sub', 'At Accenture,'], ['head', ['Thousands of', '*reinventors*']], ['sub', "constantly building what's next."]) + A.arr('M1480 640 C1600 560 1700 500 1790 360') + A.note(1840, 1040, 'wave spreads · links draw · slow push', 'end'))]] },

    { id: 's02', title: 'New solutions, capabilities, ways',
      text: 'T1: three lines accumulate, one per phrase: "New solutions." / "New capabilities." / "New ways of solving problems."',
      visual: { start: 'The network from s01, dimmed slightly.', build: 'As each line is spoken one cluster brightens and gathers into a small form: a product card (solution), a linked module (capability), a route finding its way through a grid (a new way of solving).', peak: 'Three lit forms inside the network.' },
      mover: 'One cluster at a time.', move: ['Travel', 'The camera pushes toward one point between the forms: the innovation the story follows.'], sfx: 'A dry click as each form locks.',
      opts: { dyn: 'Each form assembles with a quick spring; the camera nudges to each as it is named.', calm: 'The forms just light up; no gathering.', more: 'Each form gets a small label chip.', fewer: 'Only the third form (the route).', layout: 'Lines in the T2 band across the top; the three forms in a row below.' },
      panels: [['Start', 5.3, S(() => NET({ o: 0.45 }) + P.rect(1060, 360, 180, 120) + `<rect x="1084" y="386" width="100" height="16" rx="8" fill="${C.p}"/>` + T1(['head', 'New *solutions*.']) + A.n(1150, 320, 1))],
        ['Peak', 9.8, S(() => NET({ o: 0.4 }) + P.rect(1060, 360, 180, 120) + `<rect x="1084" y="386" width="100" height="16" rx="8" fill="${C.p}"/>` + [[1520, 520], [1640, 600], [1520, 680]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" fill="#fff" stroke="${C.p}" stroke-width="6"/>`).join('') + P.line('M1520 520 L1640 600 L1520 680 Z', { c: C.p, w: 5 }) + P.line('M1120 820 L1200 820 L1200 900 L1320 900 L1320 800 L1420 800', { c: C.p, w: 8 }) + P.dot(1420, 800, 14, C.p) + T1(['head', ['New *solutions*.', 'New *capabilities*.', 'New *ways of solving*', '*problems*.']]) + A.n(1150, 320, 1) + A.n(1720, 500, 2) + A.n(1100, 760, 3))]] },

    { id: 's03', title: 'The challenge: attention',
      text: 'T1: "But here\'s the challenge…" (sub), then "Not every innovation gets the attention it deserves." (headline; keyword: attention).',
      visual: { start: 'Close on one point of light (the innovation), the network soft behind it.', build: 'An amber spotlight sweeps across the network, lighting other points one after another, and passes ours by.', peak: 'The light rests elsewhere; our point is left in the shade, dimmer.' },
      mover: 'The spotlight.', move: ['Travel', 'The point drops out of frame into the inbox below: the same object, now in its problem.'], sfx: 'A low air sweep with the spotlight.',
      opts: { dyn: 'The spotlight makes two passes, faster the second time; the camera follows it and leaves our point behind.', calm: 'No sweep: our point simply dims as others brighten.', more: 'Small halos where the light lands on other points.', fewer: 'No network behind; just the point and the light.', layout: 'Statement centred (T3), with the spotlight crossing behind the words.' },
      panels: [['Start', 10.4, S(() => net(12, 140, 1320, 560, 600, 420, { o: 0.22, r: 8 }) + P.spark(1400, 560, 26) + T1(['sub', "But here's the challenge…"]))],
        ['Peak', 15.2, S(() => net(12, 140, 1320, 560, 600, 420, { o: 0.22, r: 8 }) + `<ellipse cx="1690" cy="400" rx="320" ry="250" fill="url(#gSpot)"/>` + [[1640, 360], [1760, 430], [1700, 300]].map(([x, y]) => P.dot(x, y, 9, C.p)).join('') + P.spark(1400, 560, 26, { o: 0.4 }) + T1(['sub', "But here's the challenge…"], ['head', ['Not every innovation', 'gets the *attention*', 'it deserves.']]) + A.arr('M1060 330 C1260 200 1480 220 1640 300') + A.note(1400, 700, 'passed by', 'middle'))]] },

    { id: 's04', title: 'Buried in inboxes',
      text: 'T1: "Some get buried" (headline; keyword: buried) → "in overflowing inboxes." (sub).',
      visual: { start: 'The point lands in an inbox card and becomes the top message, marked purple.', build: 'New messages arrive from the top, faster and faster, pushing ours down. Rows are drawn bars: no fake names or numbers.', peak: 'The list overflows the card\'s bottom edge and our message is pushed out of sight.' },
      mover: 'The stream of arriving rows.', move: ['Become', 'The inbox card turns into a presentation slide: the same card, a new trap.'], sfx: 'Soft ticks that speed up with the rows.',
      opts: { dyn: 'Rows arrive in an accelerating rhythm and the card tilts slightly in 3D as it overflows.', calm: 'A steady stream; the card stays flat.', more: 'A small unread badge pulses with each arrival (no number).', fewer: 'Fewer, larger rows.', layout: 'Inbox centred at full height, text in the T2 band top-left.' },
      panels: [['Start', 15.9, S(() => inbox(972, 200, 828, 640, 4, 0) + T1(['head', 'Some get *buried*']) + A.arr('M1386 40 L1386 180'))],
        ['Peak', 18.7, S(() => inbox(972, 200, 828, 640, 7, -1, 3) + T1(['head', 'Some get *buried*'], ['sub', 'in overflowing inboxes.']) + A.arr('M1860 300 L1860 860') + A.note(1386, 160, 'rows arrive faster and faster', 'middle'))]] },

    { id: 's05', title: 'Lost in presentations',
      text: 'T1: "Others get lost" (headline; keyword: lost) → "in presentations and lengthy demonstrations." (sub).',
      visual: { start: 'The inbox card is now a slide with our point on it.', build: 'On "presentations" slides stack behind it into a deep, receding deck and ours slips into the middle; on "lengthy demonstrations" a progress bar under the deck stretches long while its playhead crawls.', peak: 'A deep deck and a long, slow bar.' },
      mover: 'The deck stacking, then the bar.', move: ['Become', 'The deck collapses into one video-player frame.'], sfx: 'Paper-soft slide whooshes, very low.',
      opts: { dyn: 'The deck fans out in 3D and the camera dollies along it.', calm: 'Three slides, gently offset.', more: 'Slides show small chart and bullet shapes.', fewer: 'No progress bar.', layout: 'Deck centred, text in the T2 band above.' },
      panels: [['Start', 19.2, S(() => slide(972, 300, 828, 466, { spark: true }) + T1(['head', 'Others get *lost*']))],
        ['Peak', 22.9, S(() => [5, 4, 3, 2, 1].map((i) => slide(972 + i * 34, 300 - i * 30, 828, 466, { o: 1 - i * 0.14 })).join('') + slide(972, 300, 828, 466, { spark: true }) + bar(972, 860, 828, 0.12) + T1(['head', 'Others get *lost*'], ['sub', ['in presentations and', 'lengthy demonstrations.']]) + A.arr('M1200 920 L1800 920') + A.note(1386, 990, 'the bar stretches, the playhead crawls', 'middle'))]] },

    { id: 's06', title: 'Videos take time, effort, skills',
      flags: ['Text trim: the first line drops "And while" (the rest is verbatim).'],
      text: 'T1: "Videos can bring these stories to life…" (keyword: life), then it swaps to "Creating them takes" with "time," / "effort," / "and specialized skills." building beneath as spoken.',
      visual: { start: 'The deck has become one video player; inside it our point blooms into a small, lively scene ("to life").', build: 'On "creating them takes" the player shrinks up and an editing timeline builds beneath it, one layer per word: "time" (the timeline stretches, a clock), "effort" (keyframes pile onto tracks), "specialized skills" (panels and track after track).', peak: 'A dense, intimidating editor around a small player.' },
      mover: 'The editor building, one layer per word.', move: ['Gather', 'On "But…" every track slides together into one line (s07).'], sfx: 'Three dry clicks, one per layer.',
      opts: { dyn: 'Each layer lands on its word with a short 3D tilt of the whole editor.', calm: 'The editor fades in as a whole on "creating".', more: 'Small generic panel labels (Timeline, Keyframes, Effects).', fewer: 'Timeline only, no side panels.', layout: 'Player and editor centred full width, with text in the T2 band.' },
      panels: [['Start', 24.0, S(() => frame(972, 240, 828, 466) + M.mograph(984, 252, 804, 442) + bar(972, 740, 828, 0.4) + T1(['head', ['Videos can bring these', 'stories to *life*…']]))],
        ['Peak', 30.6, S(() => frame(1240, 96, 560, 315) + M.mograph(1250, 106, 540, 295) + editor(972, 470, 828, 500, { keys: true, clock: true }) + T1(['head', 'Creating them takes'], ['sub', '*time*,', ink], ['sub', '*effort*,', ink], ['sub', 'and *specialized skills*.', ink]) + A.n(940, 520, 1) + A.n(940, 700, 2) + A.n(940, 880, 3))]] },

    { id: 's07', title: 'What if AI could change that?',
      text: 'T3 (centre): "What if AI could change that?" (statement; keyword: AI).',
      visual: { start: 'The dense editor from s06.', build: 'On "But…" everything stops; the tracks slide together and fold into one clean line, which contracts into the point of light.', peak: 'A calm frame: one point and the question. A held breath before the turn.' },
      mover: 'The collapse.', move: ['Become', 'The point becomes a blinking cursor in an empty frame.'], sfx: 'A soft reverse swell into silence, then a single tone.',
      opts: { dyn: 'The collapse snaps (fast in, soft settle) with a small flash as the line becomes the point.', calm: 'A slow dissolve to the point.', more: 'A faint ring pulses once around the point on "AI".', fewer: 'Text only, no point.', layout: 'Question in the T2 band top-left, point at the optical centre.' },
      panels: [['Start', 31.3, S(() => editor(972, 470, 828, 500, { keys: true }) + A.arr('M1386 300 L1386 430') + A.arr('M1386 1060 L1386 1000') + A.note(900, 720, 'tracks fold into one line', 'end'))],
        ['Peak', 33.9, S(() => T3(['state', ['What if *AI* could', 'change that?']]) + P.spark(960, 800, 16))]] },

    { id: 's08', title: 'Videos for… anything?',
      text: 'T2: "What if we could create videos for…" then "anything?" lands at display size in purple, centred.',
      visual: { start: 'An empty frame with a blinking cursor (the point).', build: 'On "anything" the frame copies itself outward: a soft grid of empty frames receding into depth.', peak: 'Rows of blank frames waiting to be filled.' },
      mover: 'Frames multiplying.', move: ['Travel', 'The camera glides along a row of frames; each fills as it is named (s09).'], sfx: 'A light cascade of soft ticks.',
      opts: { dyn: 'Frames fly in from depth in a fast cascade.', calm: 'Three frames only.', more: 'Frames come in mixed shapes (wide, tall, square).', fewer: 'No grid: the single frame scales up on "anything".', layout: '"anything?" alone at display size, with the frames behind it.' },
      panels: [['Start', 34.6, S(() => frame(560, 400, 800, 450) + `<rect x="620" y="470" width="8" height="64" rx="4" fill="${C.p}"/>` + T2(['head', ['What if we could create', 'videos for…']]))],
        ['Peak', 38.0, S(() => [0, 1, 2, 3, 4].flatMap((c) => [0, 1].map((r) => frame(140 + c * 340, 430 + r * 260, 300, 169, { o: 0.55 }))).join('') + T2(['head', ['What if we could create', 'videos for…']]) + TB({ x: 960, cy: 700, a: 'middle' }, ['disp', '*anything?*']))]] },

    { id: 's09', title: 'Product showcases … something new',
      flags: ['Text trim: the last label drops "Or".'],
      text: 'A label under each frame as spoken: "Product showcases" · "Software demos" · "Client communications" · "Training videos" · "Something entirely new".',
      visual: { start: 'A row of empty frames.', build: 'The camera glides along the row. As each is named its frame plays a tiny version of that format: a product turning in light; a UI with a cursor click; a title card with a chart; a 1-2-3 lesson with progress; a frame where the point blooms into something unknown.', peak: 'Five lit frames, the last one glowing.' },
      mover: 'One frame at a time, with the camera between them.', move: ['Gather', 'The five frames gather into one.'], sfx: 'A soft tick per frame.',
      opts: { dyn: 'Faster camera between frames; each mini-film punches in on its word.', calm: 'All five visible at once; each lights in turn, no camera move.', more: 'Each frame also gets a small format icon.', fewer: 'Labels on grey frames, no mini-films.', layout: 'A 2×3 grid instead of a row (no camera).' },
      panels: [['Start', 38.7, S(() => frame(120, 300, 700, 394, { lit: true }) + M.product(130, 310, 680, 374) + frame(920, 300, 700, 394) + frame(1720, 300, 700, 394) + TB({ x: 120, y: 720 }, ['sub', 'Product showcases', ink]) + A.arr('M1400 860 L1800 860') + A.note(1360, 876, 'camera travels', 'end'))],
        ['Peak', 46.0, S(() => frame(-380, 300, 700, 394) + M.comms(-370, 310, 680, 374) + frame(420, 300, 700, 394) + M.training(430, 310, 680, 374) + frame(1220, 300, 700, 394, { lit: true }) + M.fresh(1230, 310, 680, 374) + TB({ x: 420, y: 720 }, ['sub', 'Training videos', ink]) + TB({ x: 1220, y: 720 }, ['sub', 'Something entirely new', ink]))]] },

    { id: 's10', title: 'Any format. Any style.',
      text: 'T2: "Any format." → "Any style." (keywords: format, style).',
      visual: { start: 'One frame, centred.', build: '"Any format": it reshapes from wide to tall to square and back. "Any style": its contents wipe through three looks (light, deep purple, warm editorial).', peak: 'The frame in its final look.' },
      mover: 'The frame.', move: ['Build', 'A reference card slides in beside it.'], sfx: 'Two soft snaps (format), two wipes (style).',
      opts: { dyn: 'Each reshape snaps on the beat with a squash-and-settle.', calm: 'One reshape and one style change.', more: 'Small screen-shape icons tick as it reshapes.', fewer: 'Format only, no style wipes.', layout: 'Text centred, with the frame behind it.' },
      panels: [['Start', 46.9, S(() => frame(510, 330, 900, 506) + T2(['head', 'Any *format*.']))],
        ['Peak', 48.6, S(() => A.ghost(810, 386, 300, 534, 20) + A.ghost(710, 400, 500, 500, 20) + frame(510, 400, 900, 506) + M.styleDeep(520, 410, 880, 486) + [C.paperJ, C.deepB, '#F3E7D3'].map((c, i) => `<circle cx="1620" cy="${520 + i * 120}" r="40" fill="${c}" stroke="#CFC6DA" stroke-width="3"/>`).join('') + T2(['head', ['Any *format*.', 'Any *style*.']]) + A.note(1620, 900, 'three looks', 'middle'))]] },

    { id: 's11', title: 'Provide a reference',
      text: 'T2: "Just provide a reference…" (keyword: reference) → "and let AI do the rest." (sub).',
      visual: { start: 'The frame, empty, on the right.', build: 'A reference card (a still from an existing style) slides in from the left; a link draws to the frame; on "let AI do the rest" the frame fills itself: background, shapes, title and a drawn line, in a quick cascade.', peak: 'A finished-looking frame beside its reference.' },
      mover: 'The card, then the cascade.', move: ['Chapter', 'The frame grows to fill the screen and becomes the deep-purple chapter card.'], sfx: 'A rising four-note cascade.',
      opts: { dyn: 'The cascade fires in four quick hits; the frame lifts toward the camera when done.', calm: 'The frame cross-fades to finished.', more: 'A thin progress line runs around the frame\'s edge while it fills.', fewer: 'No reference card; the frame just fills.', layout: 'Reference above, frame below, both centred.' },
      panels: [['Start', 49.2, S(() => image(120, 420, 440, 248) + frame(680, 330, 1120, 630) + T2(['head', 'Just provide a *reference*…']) + A.arr('M-30 544 L100 544'))],
        ['Peak', 52.3, S(() => image(120, 420, 440, 248) + link(560, 544, 680, 640, C.p) + frame(680, 360, 1120, 600, { lit: true }) + M.finished(692, 372, 1096, 576) + T2(['head', 'Just provide a *reference*…'], ['sub', 'and let AI do the rest.']) + A.n(740, 410, 1) + A.n(1000, 410, 2) + A.n(1260, 410, 3) + A.n(1520, 410, 4))]] },

    { id: 's12', title: 'Introducing MotionLab',
      text: 'T3 on deep purple: "Introducing" (sub) → "MotionLab" (display). Typeset wordmark (no logo supplied).',
      visual: { start: 'The finished frame grows to fill the screen and turns deep purple: the chapter card you approved.', build: '"Introducing" fades up; on "MotionLab" the wordmark builds while the point of light draws a fast motion trail under it.', peak: 'The wordmark with its trail.' },
      mover: 'The trail.', move: ['Become', 'The wordmark shrinks into the top bar of the MotionLab studio.'], sfx: 'Deep whoosh into a low hit on the wordmark.',
      opts: { dyn: 'The trail loops once around the wordmark before settling under it.', calm: 'The wordmark fades up whole; no trail.', more: 'Up to three faint frames drift at depth behind it.', layout: 'Wordmark left-aligned on the arc instead of centred.' },
      panels: [['Start', 52.8, S(() => `<rect x="360" y="200" width="1200" height="675" rx="20" fill="url(#gDeep)"/>` + A.cam(80, 60, 1760, 960) + A.note(960, 560, 'the frame fills the screen', 'middle').replace(C.ann, '#fff'))],
        ['Peak', 54.8, DP(() => T3(['sub', 'Introducing'], ['disp', 'MotionLab']) + P.line('M560 700 C800 770 1100 770 1360 690', { c: C.pl, w: 8 }) + P.spark(1360, 690, 12, { c: '#fff' }))]] },

    { id: 's13', title: 'An AI-powered video creation engine',
      text: 'T1: "An AI-powered video creation engine," (keyword: video creation engine) → "built on Claude Opus" (sub). Text only: no Claude or Anthropic logo.',
      visual: { start: 'The wordmark lands in the top bar of a studio window.', build: 'The studio assembles panel by panel as spoken: the canvas (the frame), an inputs panel, a timeline. On "built on Claude Opus" a small "Claude Opus" chip lights in the bar.', peak: 'The full studio, clean and calm.' },
      mover: 'One panel at a time.', move: ['Travel', 'The camera pushes into the canvas.'], sfx: 'Soft UI clicks per panel.',
      opts: { dyn: 'Panels slide in from their own edges with a 3D tilt of the whole window that settles flat.', calm: 'The studio fades in whole.', more: 'The timeline shows a few clips and the canvas shows the frame from s11.', fewer: 'Canvas and bar only.', layout: 'Studio centred and large, text in the T2 band above.' },
      panels: [['Start', 55.3, S(() => studio(972, 200, 828, 640, false).replace(/<rect x="972" y="200" width="828" height="640"[^>]*>/, '') + A.arr('M720 640 C860 480 900 300 960 240') + T1(['head', ['An AI-powered', '*video creation*', '*engine*,']]))],
        ['Peak', 59.2, S(() => studio(972, 200, 828, 640, true) + P.pill(1584, 204, 'Claude Opus', 'accent') + T1(['head', ['An AI-powered', '*video creation*', '*engine*,']], ['sub', 'built on Claude Opus']))]] },

    { id: 's14', title: 'Workflows, simulations, motion, voice',
      text: 'Four labels, one per tile, as spoken: "Animated workflows" · "Product simulations" · "Motion graphics" · "Synchronized voiceovers".',
      visual: { start: 'The canvas, empty.', build: 'Four tiles build in a 2×2 grid, one per mention, each playing a specimen: nodes linking with a token travelling; a UI where a cursor click changes state; kinetic shapes and type; a waveform with captions lighting word by word.', peak: 'Four specimens, the last still playing.' },
      mover: 'One tile at a time.', move: ['Gather', 'The four tiles slot into a timeline as clips.'], sfx: 'A soft tick per tile.',
      opts: { dyn: 'Each tile flips in on its word; the camera drifts across the grid.', calm: 'Tiles appear together and play one at a time.', more: 'A tiny cursor or icon in each tile to explain it.', fewer: 'Labels only, no specimens.', layout: 'Four tiles in one row across the stage.' },
      panels: [['Start', 60.0, S(() => frame(232, 128, 700, 330, { lit: true }) + M.workflow(242, 138, 680, 310) + TB({ x: 232, y: 468 }, ['sub', 'Animated workflows', ink]) + A.ghost(988, 128, 700, 330) + A.ghost(232, 556, 700, 330) + A.ghost(988, 556, 700, 330) + A.n(1338, 293, 2) + A.n(582, 721, 3) + A.n(1338, 721, 4))],
        ['Peak', 65.6, S(() => [[232, 128, 'workflow', 'Animated workflows'], [988, 128, 'ui', 'Product simulations'], [232, 556, 'mograph', 'Motion graphics'], [988, 556, 'voice', 'Synchronized voiceovers']].map(([x, y, m, l], i) => frame(x, y, 700, 330, { lit: i === 3 }) + M[m](x + 10, y + 10, 680, 310) + TB({ x, y: y + 340 }, ['sub', l, ink])).join(''))]] },

    { id: 's15', title: 'The entire production process',
      text: 'T2: "MotionLab handles the entire production process." (keyword: entire).',
      visual: { start: 'The four tiles above an empty timeline.', build: 'They drop into the timeline as clips, end to end; a playhead sweeps the full length while the canvas plays the result.', peak: 'A complete track, the playhead at the end, a finished check on the frame.' },
      mover: 'The playhead.', move: ['Build', 'The timeline\'s start opens into three input slots.'], sfx: 'A smooth sweep with the playhead, a soft confirm at the end.',
      opts: { dyn: 'The playhead sweeps fast with a light trail; clips pulse as it crosses them.', calm: 'No sweep: the track completes and a check appears.', more: 'Stage words along the track (story · voiceover · motion · video). These add words the line doesn\'t say.', fewer: 'No canvas, track only.', layout: 'Timeline across the middle, text in T1 above-left.' },
      panels: [['Start', 66.1, S(() => [0, 1, 2, 3].map((i) => frame(120 + i * 430, 380, 400, 225) + M[['workflow', 'ui', 'mograph', 'voice'][i]](128 + i * 430, 388, 384, 209)).join('') + frame(120, 760, 1680, 120) + A.arr('M960 640 L960 740') + T2(['head', ['MotionLab handles the', '*entire* production process.']]))],
        ['Peak', 68.9, S(() => frame(660, 372, 600, 338, { lit: true }) + M.finished(668, 380, 584, 322) + `<circle cx="1260" cy="372" r="40" fill="${C.ok}"/>` + P.icon('check', 1260, 372, 44, '#fff', 3) + frame(120, 760, 1680, 120) + [0, 1, 2, 3].map((i) => `<rect x="${140 + i * 412}" y="780" width="400" height="80" rx="10" fill="${[C.pl, C.p, '#E9D5FF', C.idle][i]}"/>`).join('') + `<rect x="1786" y="740" width="6" height="160" fill="${C.risk}"/>` + A.arr('M200 940 L1760 940') + T2(['head', ['MotionLab handles the', '*entire* production process.']]))]] },

    { id: 's16', title: 'Your story, a voiceover, a reference',
      text: 'T1: "All it needs is…" then three items as spoken: "your story," · "a voiceover," · "or a creative reference."',
      visual: { start: 'The frame, waiting.', build: 'Three input cards arrive one per mention: a page of text, a sound wave, an image. Each docks into the frame with a short link.', peak: 'Three inputs connected to the frame.' },
      mover: 'One card at a time.', move: ['Swap', 'The studio steps back and the question takes the stage.'], sfx: 'A soft magnetic snap per card.',
      opts: { dyn: 'Cards are thrown in from off-frame and snap into place.', calm: 'Cards fade in where they sit.', more: 'Each card carries a small icon.', fewer: 'Text list only.', layout: 'Cards in a row under T2 text, frame on the right.' },
      panels: [['Start', 69.5, S(() => frame(1240, 382, 560, 316) + doc(980, 250, 200, 150) + A.arr('M860 325 L960 325') + T1(['head', 'All it needs is…']))],
        ['Peak', 73.5, S(() => frame(1240, 382, 560, 316, { lit: true }) + doc(980, 250, 200, 150) + wave(980, 465, 200, 150) + image(980, 680, 200, 150) + link(1180, 325, 1240, 500) + link(1180, 540, 1240, 540) + link(1180, 755, 1240, 580) + T1(['head', 'All it needs is…'], ['sub', 'your *story*,', ink], ['sub', 'a *voiceover*,', ink], ['sub', 'or a creative *reference*.', ink]))]] },

    { id: 's17', title: 'Sounds interesting? Put it to the test',
      text: 'T3 swaps line by line: "Sounds interesting?" → "Don\'t take our word for it." → "Let\'s put it to the test." (keyword: test). ("Well…" is voice only.)',
      visual: { start: 'The question alone, centred, on a quiet ground.', build: 'On "test" the frame returns below the text and a single play button appears and presses itself.', peak: 'The frame lit and ready.' },
      mover: 'The text swaps, then the button.', move: ['Build', 'A document slides into the frame (s18).'], sfx: 'One soft click on the button.',
      opts: { dyn: 'Each line enters with a short word-by-word cascade; the frame turns slightly toward the camera on "test".', calm: 'Lines cross-fade.', more: 'A ring of light starts to run around the frame on "test".', fewer: 'Text only, no frame.', layout: 'Frame on the right, text in T1 left.' },
      panels: [['Start', 74.3, S(() => T3(['state', 'Sounds interesting?']) + A.note(960, 760, 'then: "Don\'t take our word for it."', 'middle'))],
        ['Peak', 78.9, S(() => TB({ x: 960, cy: 300, a: 'middle' }, ['head', "Let's put it to the *test*."]) + frame(710, 440, 500, 282, { lit: true }) + `<circle cx="960" cy="820" r="52" fill="${C.p}"/><path d="M944 796 L944 844 L984 820 Z" fill="#fff"/>`)]] },

    { id: 's18', title: 'A simple product story we gave MotionLab',
      text: 'T2: "Here\'s a simple product story we gave MotionLab." (keyword: story).',
      visual: { start: 'The frame, empty, on the right.', build: 'A document slides in, with the first lines of the Aether story readable on it; it feeds into the frame, which lights and scans.', peak: 'At 82.3 s the frame rushes toward the camera and fills the screen: we are inside the film MotionLab made.' },
      mover: 'The document, then the frame.', move: ['Become (zoom-through)', 'The frame becomes the whole screen and the Aether film starts. The hero seam of the film.'], sfx: 'A rising whoosh into the seam; the music changes here (see Music).',
      opts: { dyn: 'The zoom-through is a fast push with a short light flash at the seam.', calm: 'A slow push-in with a cross-fade.', more: 'A thin progress ring runs around the frame before it opens.', fewer: 'No document; the frame just opens.', layout: 'Document centred above, frame below.' },
      panels: [['Start', 79.6, S(() => doc(120, 380, 520, 560, AETHER_LINES) + frame(760, 380, 1040, 585) + A.arr('M-40 660 L100 660') + T2(['head', ["Here's a simple product", '*story* we gave MotionLab.']]))],
        ['Peak', 82.2, S(() => doc(120, 380, 520, 560, AETHER_LINES) + link(640, 660, 760, 672, C.p) + frame(760, 380, 1040, 585, { lit: true }) + `<rect x="780" y="560" width="1000" height="6" fill="${C.p}" opacity=".6"/>` + A.cam(40, 30, 1840, 1020) + A.note(1280, 700, 'zoom-through: the frame becomes the screen', 'middle') + T2(['head', ["Here's a simple product", '*story* we gave MotionLab.']]))]] },

    // ---------------- the showcase: the Aether film (journey look) ----------------
    { id: 's19', title: 'A global supply chain',
      text: 'T2: "Imagine managing a global supply chain." (keyword: global), then three lines accumulate below: "Thousands of shipments." · "Hundreds of suppliers." · "Millions of moving parts."',
      visual: { start: 'Fix for your note: it opens sparse. One ship on a calm horizon, the journey line just starting behind it.', build: '"global supply chain": the camera pulls back to a wide arc of the world with ports along it. "thousands of shipments": small ships move along the routes. "hundreds of suppliers": supplier nodes pop on near the ports. "millions of moving parts": every route starts to flow.', peak: 'At about 90 s, the whole network alive while the camera is still pulling back.' },
      mover: 'The camera pull-back, then each layer in turn.', move: ['Travel', 'The camera dives toward one port: Singapore.'], sfx: 'A low swell building under the layers.',
      opts: { dyn: 'A continuous pull-back with the layers arriving on the beat, plus a slight 3D tilt of the world.', calm: 'A still wide shot; the layers fade in.', more: 'Small cargo icons ride some routes (at most 3 kinds).', fewer: 'Routes and ports only, no ships.', layout: 'Headline in T1 left, the world arc on the right.' },
      panels: [['Start', 82.6, JN(() => P.line('M0 800 C640 780 1280 780 1920 800', { c: C.lineJ, w: 4 }) + P.line('M380 796 C560 788 720 784 840 782', { c: C.p, w: 6 }) + J.ship(960, 760, 1) + T2(['head', ['Imagine managing a', '*global* supply chain.']]))],
        ['Peak', 90.3, JN(() => globe() + routes({ flow: true, suppliers: true, ships: true }) + T2(['head', ['Imagine managing a', '*global* supply chain.']], ['sub', 'Thousands of shipments.', ink], ['sub', 'Hundreds of suppliers.', ink], ['sub', 'Millions of moving parts.', ink]) + A.cam(1300, 140, 520, 300) + A.note(1560, 480, 'still pulling back', 'middle'))]] },

    { id: 's20', title: 'Delayed in Singapore; three facilities at risk',
      flags: ['Text trim: drops "Now imagine…" (voice only).'],
      text: 'T2: "A critical shipment gets delayed in Singapore," (keyword: delayed) → "putting three manufacturing facilities at risk." (sub).',
      visual: { start: 'The dive lands on the port of Singapore. One ship is coming in and the cranes are working: moving, not static.', build: 'On "delayed" the ship stops, the cranes freeze and a "Delayed" tag lands. The route runs inland, and on "three manufacturing facilities" three factories appear one by one, each turning red on "at risk".', peak: 'Three factories at risk, the line to them dashed and stalled.' },
      mover: 'The ship stopping, then each factory.', move: ['Chapter', 'The deep-purple disc grows out of the arc.'], sfx: 'The port ambience cuts on "delayed"; a small low alert.',
      opts: { dyn: 'On "delayed" the camera jolts (a short shake) and the route snaps red.', calm: 'No freeze moment; the tag just appears.', more: 'Each factory shows a small production line that slows to a stop.', fewer: 'The factories as simple pins.', layout: 'Text in T1 left, port and factories stacked on the right.' },
      panels: [['Start', 91.0, JN(() => `<rect x="0" y="860" width="1920" height="220" fill="#ECE4F7"/>` + J.crane(1180, 860, 360) + J.crane(1420, 860, 320) + [0, 1, 2, 3].map((i) => `<rect x="${1540 + i * 66}" y="${780 - (i % 2) * 60}" width="60" height="${80 + (i % 2) * 60}" fill="${[C.p, C.pl, C.idle, C.pl][i]}"/>`).join('') + J.ship(820, 840, 1.6) + A.arr('M300 800 L560 800') + A.note(1300, 420, 'cranes working', 'middle'))],
        ['Peak', 97.6, JN(() => `<rect x="0" y="880" width="1920" height="200" fill="#ECE4F7"/>` + J.crane(860, 880, 280) + J.ship(520, 860, 1.2) + P.pill(400, 640, 'Delayed', 'risk') + P.pill(640, 940, 'Singapore', 'neutral') + P.line('M680 820 C900 700 1100 720 1300 700 L1540 640 L1780 700', { c: C.risk, w: 6, dash: '14 14' }) + J.factory(1300, 760, C.risk) + J.factory(1540, 700, C.risk) + J.factory(1780, 760, C.risk) + T2(['head', ['A critical shipment gets', '*delayed* in Singapore,']], ['sub', 'putting three manufacturing facilities at risk.']) + A.n(1300, 560, 1) + A.n(1540, 500, 2) + A.n(1780, 560, 3))]] },

    { id: 's21', title: 'Meet Aether',
      text: 'T3 on deep purple: "Meet" (sub) → "Aether" (display) → "An AI-powered supply chain intelligence platform." (sub).',
      visual: { start: 'The disc grows out of the arc, over the at-risk scene.', build: 'The wordmark, then the line.', peak: 'The chapter card, as in the Aether film you approved.' },
      mover: 'The disc.', move: ['Become', 'The disc shrinks into the hub\'s core, carrying the wordmark (the move you liked).'], sfx: 'Deep whoosh, then a low hit on the wordmark.',
      opts: { dyn: 'The disc grows on a fast curve; the wordmark builds letter by letter.', calm: 'As in the first Aether film.', more: 'A thin ring of light orbits the wordmark.', layout: 'Wordmark left-aligned on the arc.' },
      panels: [['Start', 98.0, JN(() => J.factory(1300, 760, C.risk) + J.factory(1540, 700, C.risk) + `<circle cx="1840" cy="1160" r="760" fill="url(#gDeep)"/>` + A.arr('M1500 760 L1100 480') + A.note(900, 440, 'the disc grows from the arc', 'middle'))],
        ['Peak', 102.5, DPJ(() => T3(['sub', 'Meet'], ['disp', 'Aether'], ['sub', 'An AI-powered supply chain intelligence platform.']))]] },

    { id: 's22', title: 'One intelligent command center',
      flags: ['Text trim: the headline is the end of the line, "into one intelligent command center."'],
      text: 'Four card labels as spoken: "Enterprise systems" · "Warehouses" · "Logistics networks" · "Forecasts". Then T2: "One intelligent command center." (keyword: command center).',
      visual: { start: 'The core alone at the centre, just landed from the disc.', build: 'Four source cards build around it, one per mention, each wired to the core with data flowing in.', peak: 'On "into one intelligent command center" the cards fold in and the hub opens into a command-center view (map, inventory, alerts) around the core.' },
      mover: 'One card at a time, then the fold.', move: ['Build', 'An alert pulses on the map (s23).'], sfx: 'A dry click per card; a soft swell on the fold.',
      opts: { dyn: 'Cards fly in on curved paths; the command center opens with a 3D tilt.', calm: 'Cards appear in place; the command center cross-fades in.', more: 'Small data chips travel along each wire.', fewer: 'Cards only, no command-center view.', layout: 'Cards in a column feeding the core from the left.' },
      panels: [['Start', 103.1, JN(() => J.core(960, 600, 120) + A.note(960, 860, 'the disc lands as the core', 'middle'))],
        ['Build', 108.2, JN(() => [[200, 330, 'database', 'Enterprise systems'], [200, 690, 'warehouse', 'Warehouses'], [1300, 330, 'network', 'Logistics networks'], [1300, 690, 'trending-up', 'Forecasts']].map(([x, y, ic, l], i) => link(i < 2 ? x + 420 : x, y + 60, i < 2 ? 840 : 1080, 600) + J.card(x, y, 420, 120, ic, l)).join('') + J.core(960, 600, 120) + A.n(170, 330, 1) + A.n(170, 690, 2) + A.n(1750, 330, 3) + A.n(1750, 690, 4))],
        ['Peak', 110.7, JN(() => frame(200, 360, 1520, 624) + `<rect x="232" y="392" width="880" height="560" rx="14" fill="${C.paperJ}"/>` + P.line('M320 760 C520 640 760 700 1020 600', { c: C.p, w: 6 }) + `<circle cx="320" cy="760" r="18" fill="#fff" stroke="${C.p}" stroke-width="5"/>` + [[700, 680], [880, 650], [1020, 600]].map(([x, y]) => J.factory(x, y + 40, C.ok, 0.5)).join('') + `<rect x="1144" y="392" width="544" height="170" rx="14" fill="#fff" stroke="${C.line}" stroke-width="2"/>` + [0, 1, 2].map((i) => `<rect x="1170" y="${440 + i * 36}" width="${380 - i * 70}" height="18" rx="9" fill="${C.pl}"/>`).join('') + `<rect x="1144" y="578" width="544" height="170" rx="14" fill="#fff" stroke="${C.line}" stroke-width="2"/>` + P.pill(1170, 630, 'All clear', 'ok') + J.core(1416, 856, 70) + T2(['head', ['One intelligent', '*command center*.']]))]] },

    { id: 's23', title: 'Disruption strikes: analyse, identify, simulate',
      text: 'T2: "When disruptions strike," (keyword: strike), then three lines build beneath as spoken: "Aether instantly analyzes inventory," · "identifies production risks," · "and simulates alternative routes."',
      visual: { start: 'The camera moves into the command center\'s map: the route from Singapore to the three factories, calm.', build: 'The alert strikes: a red pulse at the port. Inventory bars at the factories scan and drop, risk flags pin onto the factories, and on "simulates alternative routes" three dashed routes draw out from the stalled ship, one after another.', peak: 'Three candidate routes glowing on the map.' },
      mover: 'Each layer in turn, then the routes.', move: ['Gather', 'The three routes resolve into one recommendation (s24).'], sfx: 'An alert ping, then three soft ticks.',
      opts: { dyn: 'The camera moves panel to panel with each verb (inventory → factories → map).', calm: 'Everything in one wide shot.', more: 'A moving dot runs along each route (a simulated run).', fewer: 'Routes only, no inventory or risk marks.', layout: 'Map on the right, the three verbs in T1 left.' },
      panels: [['Start', 111.4, JN(() => mapStrip(120, 480, 1680, 504, { inv: true }) + T2(['head', 'When disruptions *strike*,']))],
        ['Peak', 118.8, JN(() => mapStrip(120, 480, 1680, 504, { inv: true, risk: true, alert: true, alts: true }) + T2(['head', 'When disruptions *strike*,'], ['sub', 'Aether instantly analyzes inventory,', ink], ['sub', 'identifies production risks,', ink], ['sub', 'and simulates alternative routes.', ink]) + A.n(1290, 560, 1) + A.n(1560, 520, 2) + A.n(760, 560, 3))]] },

    { id: 's24', title: 'The best recovery strategy',
      text: 'T2: "Its AI engine recommends the best recovery strategy…" (keyword: strategy). The three criteria appear as row labels in a comparison card: "Costs" · "Capacity" · "Delivery commitments". No numbers or scores.',
      visual: { start: 'Three candidate routes.', build: 'A comparison card opens. As each criterion is spoken its row fills with three bars (one per route); the winning route brightens and thickens while the other two fade.', peak: 'One route, marked "Recommended".' },
      mover: 'The bars, then the winning route.', move: ['Travel', 'The recommendation card travels to the planner.'], sfx: 'Three soft ticks, then a warm confirm.',
      opts: { dyn: 'The bars race each other; the winning route draws over the others with a sweep.', calm: 'All the bars fill together.', more: 'A balance mark (three weights) settles above the card.', fewer: 'No bars; the winning route simply lights.', layout: 'The three routes as three side-by-side cards.' },
      panels: [['Start', 119.5, JN(() => mapStrip(120, 360, 1680, 624, { alts: true, risk: true }) + T2(['head', ['Its AI engine recommends', 'the best recovery *strategy*…']]))],
        ['Peak', 126.0, JN(() => mapStrip(120, 360, 1060, 624, { alts: true, win: true }) + P.pill(560, 840, 'Recommended', 'accent') + frame(1220, 360, 580, 624) + [['Costs', 0], ['Capacity', 1], ['Delivery commitments', 2]].map(([l, i]) => P.txt(1252, 430 + i * 190, l, { s: 30, w: 600 }) + [0, 1, 2].map((k) => `<rect x="1252" y="${456 + i * 190 + k * 34}" width="${[300, 460, 260][(k + i) % 3]}" height="22" rx="11" fill="${k === 1 ? C.p : C.idle}"/>`).join('')).join('') + T2(['head', ['Its AI engine recommends', 'the best recovery *strategy*…']]))]] },

    { id: 's25', title: 'A planner approves',
      text: 'T1: "A planner approves the recommendation." (keyword: approves).',
      visual: { start: 'The recommendation card arrives beside a photo of a planner at work (the same library photo as the Aether film; CC0, graded).', build: 'The Approve button fills and a check draws.', peak: '"Approved".' },
      mover: 'The card, then the check.', move: ['Travel', 'The approved booking travels to the carrier.'], sfx: 'A soft confirm on the check.',
      opts: { dyn: 'The photo slides in as a panel from the right; the camera pushes gently on the check.', calm: 'Photo and card cross-fade in.', more: 'A cursor clicks Approve.', fewer: 'No photo; just the card.', layout: 'Photo full-bleed across the left half, text on the right.' },
      panels: [['Start', 126.7, JN(() => P.photo('laptop-work-ed1c4fde.jpg', 972, 96, 828, 888) + P.rect(1012, 700, 460, 220) + P.icon('route', 1064, 760, 40) + P.txt(1104, 772, 'Recommendation', { s: 30, w: 600 }) + `<rect x="1040" y="828" width="200" height="60" rx="30" fill="#fff" stroke="${C.p}" stroke-width="3"/>` + P.txt(1140, 868, 'Approve', { s: 28, w: 600, c: C.p, a: 'middle' }) + A.arr('M760 810 L990 810') + T1(['head', ['A planner *approves*', 'the recommendation.']]))],
        ['Peak', 128.6, JN(() => P.photo('laptop-work-ed1c4fde.jpg', 972, 96, 828, 888) + P.rect(1012, 700, 460, 220) + P.icon('route', 1064, 760, 40) + P.txt(1104, 772, 'Recommendation', { s: 30, w: 600 }) + `<rect x="1040" y="828" width="220" height="60" rx="30" fill="${C.p}"/>` + P.icon('check', 1076, 858, 32, '#fff', 3) + P.txt(1170, 868, 'Approved', { s: 28, w: 600, c: '#fff', a: 'middle' }) + T1(['head', ['A planner *approves*', 'the recommendation.']]))]] },

    { id: 's26', title: 'The carrier rejects. No problem.',
      text: 'T2 swaps per line: "But wait…" → "The carrier rejects the booking." (keyword: rejects) → "No problem."',
      visual: { start: 'The booking card travels down the line to a carrier.', build: 'On "rejects" a red cross appears; the route retracts and turns red (a small glitch).', peak: 'On "No problem." the core pulses, calm purple, over the red route.' },
      mover: 'The booking, then the rejection.', move: ['Build', 'A second carrier appears (s27).'], sfx: 'A small glitch on "rejects"; a calm low tone on "No problem."',
      opts: { dyn: 'The rejection hits with a short shake and the card bounces back.', calm: 'Just a red state change.', more: 'A small "Rejected" toast slides in.', layout: 'Text centred (T3) over the route.' },
      panels: [['Start', 129.2, JN(() => J.core(360, 640, 90) + P.line('M470 640 L1440 640', { c: C.p, w: 6 }) + J.station(1500, 640, 'truck') + P.rect(860, 540, 320, 80) + P.txt(900, 592, 'Booking', { s: 30, w: 600 }) + A.arr('M1200 580 L1380 580') + T2(['head', 'But wait…']))],
        ['Rejects', 131.0, JN(() => J.core(360, 640, 90) + P.line('M470 640 L1100 640', { c: C.risk, w: 6, dash: '14 12' }) + J.station(1500, 640, 'truck', C.risk) + P.icon('circle-x', 1500, 540, 64, C.risk) + P.pill(1400, 740, 'Rejected', 'risk') + T2(['head', ['The carrier *rejects*', 'the booking.']]))],
        ['Peak', 132.6, JN(() => `<circle cx="360" cy="640" r="190" fill="none" stroke="${C.pl}" stroke-width="4"/>` + J.core(360, 640, 90) + P.line('M470 640 L1100 640', { c: C.risk, w: 6, dash: '14 12', o: 0.4 }) + J.station(1500, 640, 'truck', C.risk) + T2(['head', 'No problem.']))]] },

    { id: 's27', title: 'Finds an alternative, reroutes, synchronizes',
      text: 'T2: "Aether automatically finds an alternative," (keyword: alternative) → "reroutes the shipment," → "and synchronizes updates across connected systems." (each sub as spoken).',
      visual: { start: 'The rejected route; a search ping finds a second carrier.', build: 'The line redraws a new path to it ("Booked"), and the ship from s20 starts moving again along the new route. Then pulses ripple from the core to the connected systems from s22, each ticking.', peak: 'Everything flowing again.' },
      mover: 'The ping, the line, the ship, then the pulses, in that order.', move: ['Swap', 'Dashboards take the stage.'], sfx: 'A ping, a sweep along the line, a soft shimmer on the sync.',
      opts: { dyn: 'The camera follows the ship along the new route, then pulls back for the sync.', calm: 'A wide shot; things change in place.', more: 'An "Updated" chip on each system.', fewer: 'No sync: just the reroute.', layout: 'Route above, system cards in a row below.' },
      panels: [['Start', 133.3, JN(() => J.core(300, 744, 90) + P.line('M400 744 L1100 640', { c: C.risk, w: 5, dash: '12 12', o: 0.4 }) + J.station(1500, 620, 'truck', C.risk) + [60, 110, 160].map((r) => `<circle cx="1500" cy="880" r="${r}" fill="none" stroke="${C.p}" stroke-width="3" opacity="${1 - r / 200}"/>`).join('') + J.station(1500, 880, 'truck') + T2(['head', ['Aether automatically finds', 'an *alternative*,']]))],
        ['Peak', 139.6, JN(() => J.core(300, 744, 90) + [130, 190].map((r) => `<circle cx="300" cy="744" r="${r}" fill="none" stroke="${C.pl}" stroke-width="3"/>`).join('') + P.line('M400 760 C800 900 1100 900 1440 880', { c: C.p, w: 8 }) + J.ship(960, 870, 0.55) + J.station(1500, 880, 'truck', C.ok) + P.pill(1580, 850, 'Booked', 'ok') + J.station(1500, 620, 'truck', C.idle) + [['database', 560, 560], ['warehouse', 700, 640], ['network', 820, 560], ['trending-up', 940, 640]].map(([ic, x, y]) => J.station(x, y, ic, C.ok)).join('') + T2(['head', ['Aether automatically finds', 'an *alternative*,']], ['sub', 'reroutes the shipment,', ink], ['sub', 'and synchronizes updates across connected systems.', ink]))]] },

    { id: 's28', title: 'Real-time dashboards',
      flags: ['Text trim: drops "Meanwhile," and splits the line into a headline plus widget titles.'],
      text: 'T2: "Real-time dashboards track" (keyword: dashboards). Then widget titles as spoken: "Costs" · "Deliveries" · "Operational risks". No axis numbers.',
      visual: { start: 'An empty dashboard frame, tilted slightly in 3D.', build: 'Three widgets build, one per word: a costs line drawing, deliveries arriving as ticks along a bar, a risk gauge sweeping from red to green.', peak: 'The live dashboard while the camera drifts across it.' },
      mover: 'One widget at a time, with a slow 3D drift.', move: ['Travel', 'The camera pulls back to the whole journey line.'], sfx: 'A soft tick per widget.',
      opts: { dyn: 'A stronger 3D move across the UI (you liked this in the property dashboard).', calm: 'A flat dashboard, no camera move.', more: 'A small live dot pulses by the headline ("real-time").', fewer: 'Two widgets only.', layout: 'Widgets stacked on the right, headline in T1 left.' },
      panels: [['Start', 140.4, JN(() => frame(120, 264, 1680, 720) + A.ghost(152, 296, 520, 656) + A.ghost(704, 296, 520, 656) + A.ghost(1256, 296, 512, 656) + T2(['head', 'Real-time *dashboards* track']) + A.note(960, 640, '3D drift across the dashboard', 'middle'))],
        ['Peak', 145.4, JN(() => frame(120, 264, 1680, 720) + [['Costs', 152], ['Deliveries', 704], ['Operational risks', 1256]].map(([l, x]) => `<rect x="${x}" y="296" width="520" height="656" rx="14" fill="${C.paperJ}"/>` + P.txt(x + 32, 356, l, { s: 30, w: 600 })).join('') + P.line('M190 820 L300 760 L400 790 L520 640 L640 600', { c: C.p, w: 8 }) + `<rect x="736" y="620" width="456" height="16" rx="8" fill="${C.line}"/><rect x="736" y="620" width="340" height="16" rx="8" fill="${C.ok}"/>` + [0, 1, 2, 3, 4].map((i) => P.icon('circle-check', 760 + i * 80, 720, 40, C.ok)).join('') + `<path d="M1352 820 A160 160 0 0 1 1672 820" fill="none" stroke="${C.line}" stroke-width="28"/><path d="M1352 820 A160 160 0 0 1 1620 707" fill="none" stroke="${C.ok}" stroke-width="28"/>` + T2(['head', 'Real-time *dashboards* track']))]] },

    { id: 's29', title: 'From disruption to resolution',
      text: 'T3: "From disruption…" (keyword in red) → "to resolution." (keyword in green). The only place state colours colour words.',
      visual: { start: 'The red delay point on the journey line.', build: 'The camera flies along the whole line from the red point to the green end, past every station from the story.', peak: 'The line fully lit, its end point green.' },
      mover: 'The camera.', move: ['Chapter', 'The end card.'], sfx: 'One long sweep along the line.',
      opts: { dyn: 'A faster fly-through, with the line glowing as it is passed.', calm: 'A wide shot of the whole line lighting left to right.', more: 'Each station shows its icon as it is passed.', layout: 'Text in the T2 band top-left while the camera travels.' },
      panels: [['Start', 146.1, JN(() => P.line('M-100 760 L1100 760', { c: C.p, w: 8 }) + P.dot(560, 760, 22, C.risk) + T3(['state', 'From *disruption*…', { k: C.risk }]))],
        ['Peak', 148.1, JN(() => P.line('M160 800 L1760 800', { c: C.p, w: 8 }) + P.dot(160, 800, 22, C.risk) + [['ship', 400], ['network', 640], ['split', 880], ['user-check', 1120], ['truck', 1360], ['trending-up', 1560]].map(([ic, x]) => J.station(x, 800, ic)).join('') + P.dot(1760, 800, 24, C.ok) + T3(['state', 'to *resolution*.', { k: C.ok }]) + A.cam(60, 620, 1800, 360))]] },

    { id: 's30', title: 'Aether. Turning complexity into intelligent action.',
      text: 'T3: "Aether" (display) → "Turning complexity into intelligent action." (sub). Holds 0.3 s after the voice.',
      visual: { start: 'The line\'s green end point.', build: 'The wordmark arrives on it, then the line.', peak: 'The Aether end card.' },
      mover: 'The wordmark.', move: ['Become (pull-out)', 'The whole Aether film shrinks back into MotionLab\'s frame.'], sfx: 'A low hit on the wordmark.',
      opts: { dyn: 'The wordmark builds letter by letter and the pull-out starts on the last word.', calm: 'A static card.', layout: 'Wordmark on the left, at the line\'s end.' },
      panels: [['Start', 148.5, JN(() => P.line('M-100 760 L960 760', { c: C.p, w: 8 }) + P.dot(960, 760, 24, C.ok) + A.note(960, 880, 'the wordmark arrives on the end point', 'middle'))],
        ['Peak', 152.0, JN(() => P.line('M-100 760 L960 760', { c: C.p, w: 8 }) + P.dot(960, 760, 24, C.ok) + T3(['disp', 'Aether'], ['sub', 'Turning complexity into intelligent action.']))]] },

    // ---------------- back in MotionLab ----------------
    { id: 's31', title: 'There you have it: story → showcase',
      text: 'T2: "And… there you have it." → swaps to "A simple story, transformed into a complete product showcase." (keyword: showcase).',
      visual: { start: 'On "And…" the camera pulls out: the Aether end card was playing inside MotionLab\'s frame, on the studio ground.', build: 'On "a simple story" the document from s18 slides back in on the left; on "transformed" a light runs from the document into the frame.', peak: 'Document → finished film, with a strip of the scenes we just watched along the frame\'s bottom.' },
      mover: 'The pull-out, then the document, then the strip.', move: ['Build', 'Three scenes lift out of the strip.'], sfx: 'A reverse whoosh on the pull-out; the music changes back.',
      opts: { dyn: 'A fast pull-out (an inverse zoom); the strip fills in a cascade.', calm: 'A cross-fade to the studio.', more: 'The document\'s lines highlight as the strip fills (line → scene).', fewer: 'No strip.', layout: 'Document above, film below.' },
      panels: [['Start', 152.7, S(() => frame(360, 240, 1200, 675) + `<rect x="372" y="252" width="1176" height="651" rx="14" fill="${C.paperJ}"/>` + P.line('M372 700 L960 700', { c: C.p, w: 6 }) + P.dot(960, 700, 14, C.ok) + P.txt(960, 600, 'Aether', { s: 120, w: 600, a: 'middle' }) + A.arr('M1820 120 L1620 220') + A.arr('M1820 1010 L1620 920') + A.arr('M100 1010 L300 920') + T2(['head', 'And… there you have it.']))],
        ['Peak', 158.2, S(() => doc(120, 480, 400, 470, AETHER_LINES.slice(0, 8)) + link(520, 715, 620, 715, C.p) + frame(620, 480, 1180, 470, { lit: true }) + `<rect x="632" y="492" width="1156" height="330" rx="12" fill="${C.paperJ}"/>` + P.txt(1210, 690, 'Aether', { s: 96, w: 600, a: 'middle' }) + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${640 + i * 143}" y="840" width="133" height="90" rx="8" fill="${[C.pl, '#E9D5FF', C.idle, C.pp][i % 4]}"/>`).join('') + T2(['head', ['A simple story, transformed', 'into a complete product', '*showcase*.']]))]] },

    { id: 's32', title: 'Workflows, interfaces, storytelling',
      text: 'Three labels, one per tile, as spoken: "Animated workflows" · "Enterprise interfaces" · "Intelligent visual storytelling".',
      visual: { start: 'The strip of scenes.', build: 'Three scenes lift out and grow into tiles, one per phrase, each replaying its moment from the Aether film: the routes resolving (workflows), the command center (interfaces), the port story (storytelling).', peak: 'Three tiles playing.' },
      mover: 'One tile at a time.', move: ['Swap', 'The tiles become part of a larger gallery.'], sfx: 'A soft tick per tile.',
      opts: { dyn: 'Tiles punch in on each word, with the camera nudging to each one.', calm: 'Tiles fade up together.', fewer: 'Stills instead of replays.', layout: 'Tiles fanned in 3D depth instead of a row.' },
      panels: [['Start', 158.9, S(() => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${120 + i * 212}" y="540" width="190" height="107" rx="10" fill="${[C.pl, '#E9D5FF', C.idle, C.pp][i % 4]}"${[1, 3, 6].includes(i) ? ` stroke="${C.p}" stroke-width="5"` : ''}/>`).join('') + A.arr('M330 520 L330 380') + A.arr('M754 520 L754 380') + A.arr('M1390 520 L1390 380'))],
        ['Peak', 163.8, S(() => [[120, 'routes', ['Animated workflows']], [700, 'dash', ['Enterprise interfaces']], [1280, 'port', ['Intelligent visual', 'storytelling']]].map(([x, m, l], i) => frame(x, 300, 520, 293, { lit: i === 2 }) + M[m](x + 8, 308, 504, 277) + TB({ x, y: 612 }, ['sub', l, ink])).join(''))]] },

    { id: 's33', title: 'Just one possibility',
      flags: ['Text trim: the last label drops "Or".'],
      text: 'T2: "And that\'s just one possibility." (keyword: one), then labels on tiles as spoken: "Product demos" · "Client communications" · "Explainers" · "Something entirely different".',
      visual: { start: 'The Aether frame alone.', build: 'The camera pulls back and the Aether frame becomes one tile in a growing gallery wall. As each format is named a tile lights and plays (callbacks to s09).', peak: 'A full gallery, the last tile holding the point of light.' },
      mover: 'The pull-back, then one tile at a time.', move: ['Gather', 'The gallery fades away, leaving the point of light (the idea).'], sfx: 'A soft tick per tile.',
      opts: { dyn: 'The gallery builds outward in rings from the Aether tile.', calm: 'The gallery appears whole; tiles light in turn.', fewer: 'Four tiles only.', layout: 'Tiles in a single row with camera travel (mirroring s09).' },
      panels: [['Start', 164.5, S(() => frame(560, 400, 800, 450, { lit: true }) + M.port(570, 410, 780, 430) + T2(['head', ["And that's just", '*one* possibility.']]))],
        ['Peak', 172.3, S(() => { let s = ''; const lab = { '0,0': ['ui', 'Product demos'], '3,0': ['comms', 'Client communications'], '1,2': ['workflow', 'Explainers'], '4,2': ['fresh', 'Something entirely different'] }; for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) { const x = 120 + c * 340, y = 384 + r * 200; const k = lab[c + ',' + r]; const mid = c === 2 && r === 1; s += frame(x, y, 300, 169, { lit: !!k || mid, o: k || mid ? 1 : 0.5 }); if (mid) s += M.port(x + 6, y + 6, 288, 157); if (k) s += M[k[0]](x + 6, y + 6, 288, 157); } s += P.pill(130, 500, 'Product demos', 'deep') + P.pill(1150, 500, 'Client communications', 'deep') + P.pill(470, 900, 'Explainers', 'deep') + P.pill(1250, 900, 'Something entirely different', 'deep', 540); return s + T2(['head', ["And that's just", '*one* possibility.']]); })]] },

    { id: 's34', title: 'You bring the idea; MotionLab brings it to life',
      text: 'T2: "You bring the idea." (keyword: idea) → "MotionLab brings it to life." (keyword: life).',
      visual: { start: 'The point of light (the idea from the opening) on the left, an empty frame on the right.', build: 'On "brings it to life" the point flies into the frame and blooms: lines, shapes and colour unfold into a small living scene.', peak: 'The bloom.' },
      mover: 'The point, then the bloom.', move: ['Travel', 'The camera pulls back into the network of reinventors from s01.'], sfx: 'A bright bloom shimmer.',
      opts: { dyn: 'The bloom bursts past the frame\'s edges for a moment, then settles inside.', calm: 'A gentle cross-fade bloom.', layout: 'Point and frame centred under the text.' },
      panels: [['Start', 173.0, S(() => P.spark(560, 660, 18) + frame(1000, 400, 800, 450) + T2(['head', 'You bring the *idea*.']))],
        ['Peak', 176.0, S(() => frame(1000, 400, 800, 450, { lit: true }) + M.mograph(1010, 410, 780, 430) + [[980, 420, 30, C.amber], [1820, 470, 22, C.pl], [1790, 860, 34, C.p], [1010, 830, 18, C.pl]].map(([x, y, r, c]) => P.dot(x, y, r, c, 0.9)).join('') + A.arr('M600 660 C760 600 900 600 1020 620') + T2(['head', 'You bring the *idea*.'], ['head', 'MotionLab brings it to *life*.']))]] },

    { id: 's35', title: 'Every innovation deserves to be seen',
      text: 'T2: "Because every innovation deserves to be seen." (keyword: seen).',
      visual: { start: 'The network from s01, our point in the middle.', build: 'The amber spotlight from s03 sweeps back, and this time it stops on our point. Then light spreads from it across the network until every point glows.', peak: 'The whole network lit: the answer to s03.' },
      mover: 'The spotlight, then the spreading light.', move: ['Chapter', 'The light gathers into the deep end card.'], sfx: 'A warm swell under the light.',
      opts: { dyn: 'The light spreads in rings with a slow camera push.', calm: 'The network simply brightens.', layout: 'Statement centred (T3) with the network around it.' },
      panels: [['Start', 176.5, S(() => net(11, 420, 1380, 660, 480, 330, { links: 3, o: 0.45 }) + `<ellipse cx="1700" cy="420" rx="260" ry="200" fill="url(#gSpot)"/>` + P.spark(1300, 660, 20) + A.arr('M1640 470 C1520 560 1420 600 1340 630') + T2(['head', ['Because every innovation', 'deserves to be *seen*.']]))],
        ['Peak', 179.4, S(() => `<ellipse cx="1300" cy="660" rx="260" ry="200" fill="url(#gSpot)"/>` + net(11, 420, 1380, 660, 480, 330, { links: 3, o: 1, glow: 5 }) + P.spark(1300, 660, 22) + T2(['head', ['Because every innovation', 'deserves to be *seen*.']]))]] },

    { id: 's36', title: 'MotionLab. Your imagination… in motion.',
      text: 'T3 on deep purple: "MotionLab" (display) → "Your imagination… in motion." (keyword: motion). Holds 3 s after the voice (your note on the Aether end card).',
      visual: { start: 'The light gathers into the deep card.', build: 'The wordmark, then the line. On "in motion" the point of light draws its trail under the line.', peak: 'The end card.' },
      mover: 'The trail.', move: ['End', ''], sfx: 'A low hit on the wordmark; the music resolves.',
      opts: { dyn: 'The trail draws the frame\'s outline around the wordmark.', calm: 'A static card.', layout: 'Wordmark left-aligned on the arc.', concept: 'Hold length: 2 s / 3 s (planned) / 5 s after the voice.' },
      panels: [['Start', 179.9, DP(() => T3(['disp', 'MotionLab']))],
        ['Peak', 184.0, DP(() => T3(['disp', 'MotionLab'], ['sub', 'Your imagination… in *motion*.']) + P.line('M640 720 C860 790 1080 790 1300 720', { c: C.pl, w: 8 }) + P.spark(1300, 720, 12, { c: '#fff' }))]] },
  ];

  const ACTS = [
    { n: 1, name: 'The problem', look: 'MotionLab look', why: 'Innovation exists, but it goes unseen, and video is slow to make.' },
    { n: 2, name: 'The turn', look: 'MotionLab look', why: 'What if AI could make any video?' },
    { n: 3, name: 'MotionLab', look: 'MotionLab look', why: 'What it is, what it does, what it needs. Then the test.' },
    { n: 4, name: 'The showcase: Aether', look: 'Aether journey look (the film MotionLab made)', why: 'The product story, played full screen as the proof.' },
    { n: 5, name: 'The reveal and close', look: 'MotionLab look', why: 'It was all made by MotionLab, and anything else can be too.' },
  ];

  const GLOBALS = [
    { id: 'look', q: 'Look of the MotionLab parts (acts 1–3 and 5)', opts: [
      ['A', 'Studio light', true, 'Warm paper ground lit from the upper right, one large arc from the lower left, Accenture Purple with an amber "attention" light, headlines in Plus Jakarta Sans. Signature: the point of light and the frame. Clearly different from Aether\'s cool lavender and journey line, so the film-within-a-film reads at once.'],
      ['B', 'Studio deep', false, 'A deep-purple glow ground (the chapter-card look you loved) with white frames on it. The light Aether film opens like a window into it. Most contrast, but darker than your main language.'],
      ['C', 'One look', false, 'Everything in the Aether journey look. Simplest, but the least contrast: only the frame tells you we are inside the showcase.']] },
    { id: 'aether', q: 'Look of the Aether showcase (act 4)', opts: [
      ['A', 'Keep the journey look', true, 'The look you approved in the Aether film: it is literally the showcase MotionLab made.'],
      ['B', 'Restyle to match MotionLab', false, 'One look across the whole film, but less contrast between "MotionLab" and "what it made".']] },
    { id: 'energy', q: 'Overall energy', opts: [
      ['M', 'Measured', false, 'The Aether film\'s pace: 0.6 s holds, fewer camera moves.'],
      ['B', 'Brisk', true, 'Your note: every scene opens sparse and builds, nothing holds unchanged, holds of 0.4 s, more camera travel. Still one primary mover at a time.'],
      ['V', 'Very brisk', false, 'The shortest holds and constant camera movement. Risks "too much in too little time".']] },
    { id: 'music', q: 'Music', opts: [
      ['M1', 'Two scores', true, '"bgm-tech-house" (Mixkit, 4:49) under MotionLab, crossfading to your "uplifting-inspiring" while the Aether showcase plays (82–152 s), then back. The music change marks the film-within-a-film.'],
      ['M2', 'One track', false, '"bgm-tech-house" throughout (the only track long enough on its own).'],
      ['M3', 'Your track throughout', false, '"uplifting-inspiring" is 2:20 and the film is 3:06, so it would need a loop edit.']], note: 'I can measure tracks but not hear them. Listen to them in library/audio/music and choose.' },
    { id: 'accent', q: 'Secondary colour (MotionLab parts)', opts: [
      ['amber', 'Amber', true, 'The "attention" light: the spotlight in s03 and s35, and highlights in the specimens.'],
      ['teal', 'Teal', false, 'A cooler, more technical accent.'],
      ['coral', 'Coral', false, 'A warmer, more human accent.']] },
    { id: 'type', q: 'Headline typeface (MotionLab parts)', opts: [
      ['pjs', 'Plus Jakarta Sans + Inter', true, 'Display headlines in Plus Jakarta Sans (OFL, already in the library), body in Inter. Differs from Aether.'],
      ['inter', 'Inter only', false, 'The same type as Aether.']] },
    { id: 'sfx', q: 'Sound effects', opts: [
      ['soft', 'Soft, on primary moves', true, 'As in Aether: one soft sound on each primary move, well under the music and voice.'],
      ['rich', 'Richer', false, 'Adds UI ticks on every build step.'],
      ['min', 'Minimal', false, 'Chapters and the two seams only.']] },
  ];

  window.SB = { SEGS, ACTS, GLOBALS };
})();
