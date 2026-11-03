# VideoGenEngine: instructions for agents

Read [README.md](README.md), then [ENGINE.md](ENGINE.md) (the craft rules and the variety dimensions) and
[DIRECTOR.md](DIRECTOR.md) (the production process). To make a film, follow DIRECTOR.md stage by stage. Never skip a
gate.

## Owner rules
- **Follow the script.** On-screen text is the script's own words. Any trim is flagged; nothing is reworded. Every visual
  shows what its line says.
- **Storyboard first.** After the clock and plan, render `films/<slug>/storyboard/index.html` with tuning options and
  wait for the owner's choices before building. The film-wide tuning scale ([styles/SCALE.md](styles/SCALE.md):
  eight dials vs Aether, a preset by theme) comes first. Every segment keeps its own board review.
- **Taste.** The owner wants these; ENGINE.md has the full rules.
  - Scenes open sparse and build, and nothing lingers.
  - Text placement and entrances vary.
  - Show real people for people and real footage for video.
  - The background moves with the story.
  - Subtext is never slim.
  - Calm, premium and readable; never "too much in too little time".
- **Variety.** Every film picks its own film system and must differ from the last on at least three dimensions
  (`films/HISTORY.md`).
- **Notes.** Feedback arrives per segment or timestamp. Change only those segments.

## Hard constraints
- **No speech models,** ever: no TTS and no ASR. The voiceover is always supplied, and the clock comes from
  `engine/audio/vo-clock.py`.
- **Pay for nothing.** Free assets only, each with a ledger row in `library/LEDGER.md` or `library/ledgers/`.
- **One heavy job at a time.** The machine has very little free RAM. Wrap renders and stills in
  `node tools/heavy-lock.mjs acquire <id> [minutes]` and `release <id>`. Long films render in parts (`--from` and
  `--to`).
- **Watch renders on a cadence; never just wait for "done".**
  - `video.mjs` prints `frame n/N · s · eta` every 150 frames. Never hide that line (no `| tail`).
  - Check the line at each expected step. Treat 60 s without a new line, or an output file that has stopped growing,
    as a stall: look at it at once.
  - Don't list processes with `tasklist`, `taskkill /T` or WMI here; they hang. Use PowerShell `Get-Process` and
    `Stop-Process -Id`.
- **Network and secrets.** Use `NODE_OPTIONS=--use-system-ca` for network calls and never disable TLS verification.
  API keys live in `library/.secrets.json` (git-ignored); never print or commit them.
- **Render outputs are regenerable.** `out/` folders are git-ignored; never hand-edit them.
- **Git.** Commit or push only when the owner asks.
