#!/usr/bin/env bash
# Render both gallery reels (no sound) under the heavy lock, one after the other.
cd "$(dirname "$0")/../.." || exit 1
for page in treatments grounds; do
  node tools/heavy-lock.mjs acquire "gal-$page" 15 && node engine/render/video.mjs "films/_gallery/$page.html" --out "films/_gallery/out/$page.mp4" 2>&1 | tr '\r' '\n' | grep -E "frames|PAGE|Error" | tail -2; node tools/heavy-lock.mjs release "gal-$page"
done
