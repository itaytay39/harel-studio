#!/bin/sh
# Extract a video into the site's frame-sequence format.
# Usage: extract-frames.sh <video.mp4> <chapter-id>
# Frames land in public/seq/<chapter-id>/f_%04d.jpg (1600px wide, q4)
set -e
VIDEO="$1"
CH="$2"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/public/seq/$CH"
mkdir -p "$OUT"
rm -f "$OUT"/f_*.jpg
ffmpeg -y -i "$VIDEO" -vf "scale=1600:-2" -q:v 4 "$OUT/f_%04d.jpg" 2>/dev/null
COUNT=$(ls "$OUT" | grep -c '^f_')
SIZE=$(du -sh "$OUT" | cut -f1)
echo "{\"chapter\":\"$CH\",\"frames\":$COUNT,\"size\":\"$SIZE\"}"
