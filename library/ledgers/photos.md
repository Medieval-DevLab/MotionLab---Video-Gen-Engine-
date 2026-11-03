# Imagery ledger

> Carried over from the first engine. Paths are relative to `library/`; placeholder rows refer to test images that were removed. (W3-b2b-people-footage)

Every frozen photo and footage clip, one row each, appended by `engine/assets/resolve.mjs --pick`.
Licence classes per `_builder-rules.md` rule 4. `Free` = CC0 / Public Domain Mark / Pexels / Pixabay licence
(no attribution required; the author is recorded anyway). `Rider` = CC BY / BY-SA: the `attribution`
column must appear in the film's end credits.

**Placeholders** (`provider: generated`, tag `placeholder`) are code-made test fixtures with no
third-party content and no people. They exist only so goldens and storyboards can build while no stock
provider answers; `libCandidates()` never offers them as swap options. Replace them before any film ships.

**Provider status, 2026-10-29 (updated 04:05):** Openverse answered again from 02:46 but still returns
intermittent HTTP 504s (its `size=large` and some multi-word queries). The 12 seed photos below are CC0 (class
Free, no in-frame credit needed; author recorded). Openverse serves StockSnap at a 960 px CDN rendition and
rawpixel at 1024 px, so these suit panels, cards and masks, not crisp full-bleed 1080p. Pexels and Pixabay are
not keyed. `welder-push` is a **derived test clip** (a Ken Burns push rendered from a CC0 photo), not real
footage. The earlier `placeholder-office-push-89e39676` clip was withdrawn: it was undecodable, because two
runners wrote to one temp path. Its row was removed and freezes now run a full decode check.

Rows are appended below this table by the tool; keep prose above it.

| Ref | Kind | Source page | Provider (upstream) | Licence | Class | Author | Attribution | sha256 | Frozen |
|---|---|---|---|---|---|---|---|---|---|
| `lib:photos/placeholder-meeting-a4fc2fc5` | photo | engine/assets/resolve.mjs --placeholder | generated (code) | project-generated placeholder (no third-party content) | Free | VideoGenEngine (code) | not required | `a4fc2fc5e0d21a8175bc2422030217761d9dcfc450dde3a764613418a080e951` | 2026-10-28 |
| `lib:photos/placeholder-laptop-bc3297a0` | photo | engine/assets/resolve.mjs --placeholder | generated (code) | project-generated placeholder (no third-party content) | Free | VideoGenEngine (code) | not required | `bc3297a0429297c29663731888f8c59aac9b5d896b15f0298ccf2cd7de97acdd` | 2026-10-28 |
| `lib:photos/placeholder-portrait-ae88bf77` | photo | engine/assets/resolve.mjs --placeholder | generated (code) | project-generated placeholder (no third-party content) | Free | VideoGenEngine (code) | not required | `ae88bf77503af007fca88f6ca28cb59ee28de767296f88379d94cfc4fe9043f5` | 2026-10-28 |
| `lib:photos/laptop-work-ed1c4fde` | photo | https://stocksnap.io/photo/business-man-HQLFQ0FSK0 | openverse (stocksnap) | CC0 1.0 | Free | Direct Media | not required | `ed1c4fde5f3745a9673062afbd20191bb9ef61114e9e15bc3937c0e214bbf720` | 2026-10-28 |
| `lib:photos/presenting-1069c7e6` | photo | https://stocksnap.io/photo/business-team-W6PNBNYHM6 | openverse (stocksnap) | CC0 1.0 | Free | Direct Media | not required | `1069c7e6f05e8b1050a450e89742f8b375788a0114f9a3a021c52edddd0c8ce7` | 2026-10-28 |
| `lib:photos/team-discussion-84004c3d` | photo | https://stocksnap.io/photo/business-people-DUXISHKTT3 | openverse (stocksnap) | CC0 1.0 | Free | Direct Media | not required | `84004c3dead1990f1df4eb0a9cd393d36f73da07c0743c55ed17c8929df2748b` | 2026-10-28 |
| `lib:photos/desk-work-c99fd139` | photo | https://stocksnap.io/photo/man-working-UN5XQREKKP | openverse (stocksnap) | CC0 1.0 | Free | Burst | not required | `c99fd139b641f0de2d1221348011755d3c302124e39abc5e49dd75ef8e89132e` | 2026-10-28 |
| `lib:photos/lab-engineer-bd39a82e` | photo | https://www.rawpixel.com/image/8708735/photo-image-public-domain-covid-19-mask | openverse (rawpixel) | CC0 1.0 | Free | usdoe | not required | `bd39a82e9dd208a5067d4011de26c2ff6898495e4c77558eeada0421c9aeac41` | 2026-10-28 |
| `lib:photos/welder-cbe6832c` | photo | https://www.rawpixel.com/image/8735035/photo-image-public-domain-person-man | openverse (rawpixel) | CC0 1.0 | Free | - | not required | `cbe6832cc4d78dae770f69f3cdb616ba9e35b70ec6076a22bbb13ccfcd571280` | 2026-10-28 |
| `lib:photos/handshake-125521f4` | photo | https://stocksnap.io/photo/work-business-J5LXKNDREC | openverse (stocksnap) | CC0 1.0 | Free | Kristin Hardwick | not required | `125521f44a61208c8e635028a636e3934d36b27434dab867cb59d84a1a1a34f5` | 2026-10-28 |
| `lib:photos/portrait-man-bc14816f` | photo | https://stocksnap.io/photo/confident-business-4Q1S53WMQ6 | openverse (stocksnap) | CC0 1.0 | Free | Matt Moloney | not required | `bc14816fe33c9c7932c77e99cd3749fcbfb78d58761a7c8a351249d256233f57` | 2026-10-28 |
| `lib:photos/city-skyline-db28e157` | photo | https://stocksnap.io/photo/city-skyline-VXO9P3MDVP | openverse (stocksnap) | CC0 1.0 | Free | Matt Bango | not required | `db28e157428bc2f0a88cc0ffd842ce2b99e1c1f3de9227d86ee42f61a2105515` | 2026-10-28 |
| `lib:photos/team-meeting-053e5e97` | photo | https://stocksnap.io/photo/team-meeting-VQXYE2ZEHC | openverse (stocksnap) | CC0 1.0 | Free | Startup Stock Photos | not required | `053e5e97ce0967d0d434dff41f3e285bddc7e5a6a5f947dbe4f20bdbc37c50d8` | 2026-10-28 |
| `lib:photos/warehouse-967a52c8` | photo | https://www.rawpixel.com/image/5922025/photo-image-public-domain-free | openverse (rawpixel) | CC0 1.0 | Free | - | not required | `967a52c8bbbf502356f25bd7473376b7a9494465247ff55d94fe694afee9e6a5` | 2026-10-28 |
| `lib:photos/whiteboard-624bd043` | photo | https://stocksnap.io/photo/whiteboard-planning-NQQ2PJW1JM | openverse (stocksnap) | CC0 1.0 | Free | Startup Stock Photos | not required | `624bd0432c55c9a9e46cec7803b502053d49964c0595b15e015aa7ec7b69904e` | 2026-10-28 |
| `lib:footage/welder-push-070cb3a0` | footage (derived) | https://www.rawpixel.com/image/8735035/photo-image-public-domain-person-man | derived from `lib:photos/welder-cbe6832c` | CC0 1.0 | Free | - | not required | `070cb3a090ee8d602637263b8bc93f3292e75866971d5cb018eab365a4b568f6` | 2026-10-28 |
| `lib:photos/portrait-woman-1a857d9d` | photo | https://stocksnap.io/photo/business-woman-FPQIEQBMPA | openverse (stocksnap) | CC0 1.0 | Free | Direct Media | not required | `1a857d9dd83ec57d0767e0359d625bc995bfb9c1c43ecfa0a3cead913c80abdd` | 2026-10-29 |
