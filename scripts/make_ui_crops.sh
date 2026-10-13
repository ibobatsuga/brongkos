#!/usr/bin/env bash
# Cut the UI crops used by campaign-001 scenes 2–6 from the product's own
# tutorial screenshots (ASSETS/screenshots/scoopcraft-tutorial, copied from
# ibobatsuga/scoopcraft public/images/tutorial @ ed3b49b).
#
# Crop and zoom only: pixels are never redrawn or recoloured (CLAUDE.md).
# Each box deliberately leaves out on-screen template counts, the "Viral Hook"
# tone label, scraping-source chips and social-platform names, none of which
# are approved ad claims (see CAMPAIGNS/campaign-001/CODE_EVIDENCE.md).
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)/ASSETS/screenshots/scoopcraft-tutorial"
OUT="$SRC/crops"
mkdir -p "$OUT"

crop() {  # source, w:h:x:y, name
  ffmpeg -v error -y -i "$SRC/$1" -vf "crop=$2" "$OUT/$3.png"
  echo "$3  $(ffprobe -v error -show_entries stream=width,height -of csv=p=0 "$OUT/$3.png")  <- $1 [$2]"
}

crop step1-dashboard-input.png       846:100:0:0     s2-input-tabs       # Link Web / Salin Teks / Ide Prompt
crop step8-slide1-hook-cover.png     190:42:140:538  s3-pager            # #1 COVER … #5 CTA
crop step8-slide1-hook-cover.png     300:398:85:80   s3-slide1           # example carousel: cover
crop step8-slide2-content.png        300:398:85:80   s3-slide2           # example carousel: content
crop step8-slide5-outro-cta.png      300:398:85:80   s3-slide5           # example carousel: CTA
crop step2-template-modal.png        575:383:10:142  s4-template-grid    # grid only, no count header
crop step2-studio-design.png         327:118:497:440 s4-brand-panel      # accent colour + typography only
crop step3-studio-edit-foto.png      832:552:0:60    s5-edit             # preview + text fields, no tab counts
crop step6-studio-export-toolbar.png 404:44:4:13     s5-export-toolbar   # Caption / PNG / ZIP / PDF / Jadwalkan
crop step5-modal-penjadwalan.png     334:74:6:324    s6-time             # publish date/time, no platform row
crop step5-modal-penjadwalan.png     138:31:202:502  s6-save             # "Simpan ke Kalender"
