# QC: campaign-001 draft preview (2026-10-13)

**This is a watermarked draft, not the ad.** It has no audio. Scenes 2–6 now show real Instadeck PRO UI, cropped and zoomed from the app repo's own tutorial screenshots (`scripts/make_ui_crops.sh`); these are low-res and not verified against the live product. The logo is a raster preview and the caption timings are estimates.

Revision 2 (2026-10-13): placeholders replaced with real UI crops and camera moves; re-rendered and re-checked below.

Render: `npx hyperframes render CAMPAIGNS/campaign-001 --fps 30 --quality draft -o RENDERS/previews/campaign-001-draft.mp4`
(hyperframes 0.8.152, beginframe capture with software GPU, about 2 m on 4 vCPU). The full-size file is gitignored. The committed review copy is `campaign-001-draft-540p.mp4` (540×960, downscaled with ffmpeg).

## Automatic checks: `python3 scripts/qa_video.py RENDERS/previews/campaign-001-draft.mp4`
```
PASS resolution
PASS fps
PASS duration
PASS codec
PASS pixel format
PASS frames
metadata: {'duration': 60.0, 'fps': '30', 'frames': 1800, 'pix_fmt': 'yuv420p', 'colorspace': 'bt709', 'color_primaries': 'bt709'}
FAIL audio stream
RESULT: FAIL Missing audio stream
```

## ffprobe (observed)
- h264 Constrained Baseline, 1080×1920, 30/1 fps (r and avg), 1800 frames counted by decode, 60.000000 s
- yuv420p, color_space, color_transfer and color_primaries all bt709, color_range tv
- Video bitrate 0.61 Mbps (revision 2; 0.54 Mbps in revision 1). This **fails** the 10–16 Mbps delivery target, as expected for `--quality draft` on mostly flat frames. Render the final with `--quality delivery --video-bitrate 12M`.
- A full decode (`ffmpeg -i … -f null -`) completed with no errors.

## HyperFrames gates before render
`npx hyperframes check` (revision 2): lint 0/0, runtime 0/0, layout 0 errors / 0 warnings / 4 info, motion 0/0, contrast 27/27 WCAG AA.
`python3 scripts/campaign_tool.py verify`: 0 errors, 5 final-render blockers (listed below).

## Visual review (frames inspected: 0.5, 1.5, 2.6, 3.3, 5.8, 6.2, 7, 11, 16.7, 30, 31.5, 43.3, 50, 53.6, 55.2, 56.2, 57.5, 59.95 s)
- Hook: "Ide ada." is visible at 0.5 s and "Mulainya?" by 1.5 s.
- The headline, caption and UI slot sit inside title-safe in every scene, and nothing essential falls in Meta's top 14% or bottom 35% zones (`campaign-001-draft.placement.png`).
- Captions are Inter 600 44 px, at most 2 lines, with the bottom edge at y=1236.
- Logo: the whole horizontal logo appears on a white panel (recap) and on a white end card (CTA), animated with fade/translate only. Fixed during this pass: the raster's white box showed while the end card faded in, so the logo now starts after the card is opaque.
- Spelling of all on-screen copy was checked against `script.md`. The tool also enforces an exact match between `script.md`, `storyboard.json` and `captions.json`.
- No prices, trial terms, platform names, statistics or invented UI appear.

## Revision 2 visual review
Frames checked at 7.5, 8.5, 11, 12.5, 16.5, 19.5, 24, 28.5, 33, 37.5, 38, 42 and 46.5 s, plus the placement strip.
- s2: camera pans across the real Link Web / Salin Teks / Ide Prompt tabs.
- s3: real slide pager and three example slides, labelled "Contoh konten".
- s4: template grid, then accent colour and typography controls.
- s5: preview and text fields (labelled "Contoh konten"), then the export toolbar with PNG / ZIP / PDF.
- s6: publish date/time, then "Simpan ke Kalender".
- Cropped out on purpose: template counts, the "Viral Hook" tone label, scraping-source chips and every social-platform name.
- Fixed: phones overlapping the 2-line caption, the label covering UI, and the watermark note wrapping to 3 lines.
- Upscaled screenshots are visibly soft (up to 2.7×). A verified high-res recording should replace them.

## Open: blocks the final (see CAMPAIGNS/campaign-001/PREFLIGHT.md)
Audio (VO, music, SFX), high-res verified UI recordings for s2–s6 (the tutorial screenshots are a stand-in), the official vector logo, VO-aligned and ear-verified captions, owner copy approval, and removing the draft watermark.
