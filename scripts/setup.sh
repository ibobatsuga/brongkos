#!/usr/bin/env bash
# One-time (per machine/container) toolchain setup for Instadeck Motion Ads Studio.
#   bash scripts/setup.sh                 Node deps, Chrome for rendering, HyperFrames skills
#   bash scripts/setup.sh --with-whisper  also build whisper.cpp + multilingual model for id-ID alignment
# Idempotent. Restart Claude Code afterwards so newly installed skills load.
set -euo pipefail
cd "$(dirname "$0")/.."

need() { command -v "$1" >/dev/null 2>&1 || { echo "MISSING: $1 ($2)" >&2; exit 1; }; }
need node "Node.js >= 22: https://nodejs.org"
need ffmpeg "FFmpeg: brew install ffmpeg / apt-get install ffmpeg / winget install ffmpeg"
need ffprobe "ships with FFmpeg"
need python3 "Python 3 for scripts/*.py"
major=$(node -p 'process.versions.node.split(".")[0]')
[ "$major" -ge 22 ] || { echo "Node $major found; HyperFrames needs >= 22" >&2; exit 1; }

npm ci --no-audit --no-fund
npx hyperframes browser ensure            # Chrome headless shell used by render/snapshot
npx hyperframes skills check >/dev/null 2>&1 || npx hyperframes skills

for c in CAMPAIGNS/*/; do
  [ -f "$c/index.html" ] && bash scripts/sync_campaign_assets.sh "${c%/}"
done

if [ "${1:-}" = "--with-whisper" ]; then
  # HyperFrames builds whisper.cpp on first use (needs cmake + a C compiler).
  # `small` is multilingual; the default small.en cannot transcribe Indonesian.
  tmp=$(mktemp -d)
  ffmpeg -v error -f lavfi -i "sine=frequency=440:duration=1" -ar 16000 -ac 1 "$tmp/tone.wav"
  npx hyperframes transcribe "$tmp/tone.wav" -m small -l id -d "$tmp" --json >/dev/null
  rm -rf "$tmp"
  echo "whisper.cpp + 'small' multilingual model ready"
fi

npx hyperframes doctor
