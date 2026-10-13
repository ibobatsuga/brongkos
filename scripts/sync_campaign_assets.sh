#!/usr/bin/env bash
# Copy shared brand/font/runtime files into a campaign's HyperFrames project.
# HyperFrames serves only files inside the project folder, so ../../BRAND paths
# do not resolve at render time. BRAND/ and ASSETS/ stay the source of truth;
# rerun this after replacing any master file there.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CAMPAIGN="${1:?usage: sync_campaign_assets.sh CAMPAIGNS/<campaign-id>}"
DEST="$ROOT/$CAMPAIGN/assets"

mkdir -p "$DEST/brand" "$DEST/fonts" "$DEST/vendor" "$DEST/ui" "$DEST/audio"

# Logo: prefer an official vector master when one has been supplied.
if [ -f "$ROOT/BRAND/logo/instadeck-horizontal.svg" ]; then
  cp "$ROOT/BRAND/logo/instadeck-horizontal.svg" "$DEST/brand/"
  echo "logo: official SVG master"
else
  cp "$ROOT/BRAND/logo/instadeck-horizontal-extracted-from-brandkit.png" "$DEST/brand/"
  echo "logo: RASTER PREVIEW extracted from brand kit (not a vector master)"
fi

cp "$ROOT"/ASSETS/fonts/inter/*.woff2 "$ROOT/ASSETS/fonts/inter/OFL.txt" "$DEST/fonts/"

GSAP="$ROOT/node_modules/gsap/dist/gsap.min.js"
[ -f "$GSAP" ] || { echo "missing $GSAP: run npm ci first" >&2; exit 1; }
cp "$GSAP" "$DEST/vendor/gsap.min.js"

echo "synced into $CAMPAIGN/assets"
