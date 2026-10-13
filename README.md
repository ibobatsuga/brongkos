# Instadeck Motion Ads Studio — starter kit

**Template project, not a finished 60-second video.** Built from uploaded Instadeck Brand Kit v1.0 and the Motion Graphics with Claude Code PDF.

## Quick start
1. Unzip, open terminal in this folder, run `claude .`.
2. In Claude Code: **"Read CLAUDE.md and docs/PRODUCTION_SOP.md. Audit my environment and assets, then implement campaign-001 using the real HyperFrames toolchain. First create an offline preview, then request any missing essentials before final render."**
3. If missing, install Claude Code and prerequisites using official instructions. Guide's example: Node 22+, FFmpeg, whisper-cpp, `npx hyperframes skills`, `npx hyperframes doctor`; restart Claude Code after skills installation.
4. Replace extracted **raster preview logos** with supplied actual SVG/PDF vector masters (not bundled separately). Add real product screenshots or screen recording, VO, fonts, licensed music/SFX.
5. Edit `BRAND/commercial.json` with owner-approved exact trial duration, active plan/price details, and supported platforms. User has confirmed the three categories themselves, **not their detailed terms in this thread**.
6. Edit campaign brief/storyboard, then have Claude implement/render and run `python3 scripts/qa_video.py RENDERS/final/<file>.mp4`.

## Includes
- `CLAUDE.md`: mandatory production rules.
- `BRAND/brand.json`: verified vs observed vs proposed brand colors.
- `BRAND/commercial.json`: user verification status + detailed offer approval ledger.
- `BRAND/logo/`: raster logo images extracted from the supplied brand PDF as reference, **not original masters**.
- `PRESETS/`: motion style brief and video export settings.
- `CAMPAIGNS/campaign-001/`: 60-second brief, storyboard, VO script, timing cues, plus the HyperFrames project (`index.html`, `scenes/`, `captions.json`, `subtitles/`, `PREFLIGHT.md`).
- `templates/scene-starter.html`: working browser-based *static storyboard preview* without external dependencies.
- `scripts/qa_video.py`: ffprobe-based export checks.
- `docs/`: SOP, source PDF, required asset list.

## Toolchain (set up 2026-10-13)
Pinned in `package.json`: `hyperframes@0.8.152`, `gsap@3.14.2`, `@fontsource/inter@5.3.0`. Inter woff2 files and the OFL licence are copied into `ASSETS/fonts/inter/`.

```bash
bash scripts/setup.sh [--with-whisper]   # npm ci, render Chrome, HyperFrames skills, whisper.cpp (optional)
bash scripts/env_check.sh                # CLAUDE.md protocol step 1: what is installed
npm run c001:verify                      # storyboard ↔ index.html ↔ script ↔ captions, claims guard
npm run c001:check                       # HyperFrames lint/runtime/layout/contrast gate
npm run c001:draft                       # watermarked draft → RENDERS/previews/
```

- `scripts/campaign_tool.py`: `verify` (timing/copy/claims gates; `--final` makes asset blockers fatal), `build` (burned-in caption cues and SRT from `captions.json`), and `align` (cue times from a `hyperframes transcribe` word transcript).
- `scripts/sync_campaign_assets.sh`: HyperFrames serves only files inside the campaign folder, so shared logo, fonts and GSAP are copied into `CAMPAIGNS/<id>/assets/`. Rerun it after replacing a master.
- `scripts/placement_preview.py`: overlays Meta's vertical UI zones on sampled frames.
- HyperFrames agent skills install into `~/.claude/skills` (per machine). Restart Claude Code after installing so they load.

Campaign status and the asset-to-final runbook are in `CAMPAIGNS/campaign-001/PREFLIGHT.md`.

## Critical truth labels
The brand kit explicitly marks much of its typography/layout guidance as proposed, and some UI colors as screenshot observations. Do not turn them into undocumented official facts. User subsequently confirmed prices/trial/auto-post verified, but **exact active numbers and platform list** need populating before numeric advertising claims.
