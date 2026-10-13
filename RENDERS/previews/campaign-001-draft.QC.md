# QC: campaign-001 draft preview (2026-10-13)

**This is a watermarked draft that proves the pipeline. It is not the ad.** It has no audio, the UI slots are placeholders, the logo is a raster preview, and the caption timings are estimates.

Render: `npx hyperframes render CAMPAIGNS/campaign-001 --fps 30 --quality draft -o RENDERS/previews/campaign-001-draft.mp4`
(hyperframes 0.8.152, beginframe capture with software GPU, 2 m 10 s on 4 vCPU). The full-size file is gitignored. The committed review copy is `campaign-001-draft-540p.mp4` (540×960, downscaled with ffmpeg).

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
- Video bitrate 0.54 Mbps. This **fails** the 10–16 Mbps delivery target, as expected for `--quality draft` on mostly flat frames. Render the final with `--quality delivery --video-bitrate 12M`.
- A full decode (`ffmpeg -i … -f null -`) completed with no errors.

## HyperFrames gates before render
`npx hyperframes check`: lint 0/0, runtime 0/0, layout 0 issues across 9 samples, motion 0/0, contrast 35/35 WCAG AA.
`python3 scripts/campaign_tool.py verify`: 0 errors, 5 final-render blockers (listed below).

## Visual review (frames inspected: 0.5, 1.5, 2.6, 3.3, 5.8, 6.2, 7, 11, 16.7, 30, 31.5, 43.3, 50, 53.6, 55.2, 56.2, 57.5, 59.95 s)
- Hook: "Ide ada." is visible at 0.5 s and "Mulainya?" by 1.5 s.
- The headline, caption and UI slot sit inside title-safe in every scene, and nothing essential falls in Meta's top 14% or bottom 35% zones (`campaign-001-draft.placement.png`).
- Captions are Inter 600 44 px, at most 2 lines, with the bottom edge at y=1236.
- Logo: the whole horizontal logo appears on a white panel (recap) and on a white end card (CTA), animated with fade/translate only. Fixed during this pass: the raster's white box showed while the end card faded in, so the logo now starts after the card is opaque.
- Spelling of all on-screen copy was checked against `script.md`. The tool also enforces an exact match between `script.md`, `storyboard.json` and `captions.json`.
- No prices, trial terms, platform names, statistics or invented UI appear.

## Open: blocks the final (see CAMPAIGNS/campaign-001/PREFLIGHT.md)
Audio (VO, music, SFX), real UI recordings for s2–s6, the official vector logo, VO-aligned and ear-verified captions, owner copy approval, and removing the draft watermark.
