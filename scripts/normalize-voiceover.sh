#!/bin/sh
# Brings every voiceover clip to about -16 LUFS (typical for social video). Needs ffmpeg. Safe to re-run.
set -e
cd "$(dirname "$0")/.."
for f in public/voiceover/*.wav; do
  ffmpeg -y -loglevel error -i "$f" -af "loudnorm=I=-16:TP=-2:LRA=7" -ar 24000 -ac 1 -c:a pcm_s16le "$f.tmp.wav"
  mv "$f.tmp.wav" "$f"
  echo "normalized $f"
done
