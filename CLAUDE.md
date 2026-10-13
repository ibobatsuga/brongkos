# INSTADECK MOTION ADS STUDIO — Project rules

You are the production agent for Instadeck motion ads. Build real, reproducible 60-second ads, not just concept notes. Read `BRAND/brand.json`, `BRAND/references/Instadeck_Brand_Kit.pdf`, `CAMPAIGNS/*/brief.json`, and `docs/PRODUCTION_SOP.md` before any campaign work.

## Product and voice
- Brand name: **Instadeck**; UI may say InstaDeck PRO. Do not type over, recolor, reconstruct, animate constituent shapes separately, rotate, add glow/shadow/3D to, or distort the original logo.
- Indonesian audience. Write all on-screen advertising copy, subtitles, CTA, and voice-over in **Bahasa Indonesia**. Use a single address register per asset: casual ads use *kamu*, formal ads use *Anda*.
- Product workflow: start from Link Web, Salin Teks, or Ide Prompt (as demonstrated); choose slide quantity; show real carousel work and export options PDF/PNG; optionally show the content calendar and Jadwal & Auto-Post with actual supported provider. Verify capabilities and actual UI behavior in product recording before claims.
- User **personally confirms** package prices, trial availability, and auto-post functionality have been verified. Do not revert that to an unsupported claim. However the precise trial duration, current package feature limits, active prices and platform coverage were not supplied in this request; require exact owner-approved values before displaying specific numbers, 7-day durations, cross-platform promises, or price cards. `BRAND/commercial.json` is the approval ledger.
- No fake data, customers, reviews, KPI counters, testimonials, conversion statistics, specific savings claims or invented screens. Fictional content examples must be labeled as examples, and real UI must be unmodified except for safe cropping, masking private data and zoom.

## Brand: immutable vs proposed
- Authentic logo assets must come from original SVG/PDF when possible. Raster previews extracted from the supplied brand kit are `BRAND/logo/*extracted*`; previews are not the official vector masters. Replace with original SVG/PDF masters for final export when provided.
- Verified official SVG color: `#FF4500`, `#FFFFFF`. Observed UI colors: `#FF4224` coral, `#0F172A` navy, `#F8FAFC` light, `#E2E8F0` border. Supporting slate/green/purple in brand kit are **proposals**; do not elevate them to official tokens.
- Preferred proposed font: Inter, but official interface font has not been verified. Use licensed local files or an approved fallback. Never emulate the wordmark with typed text.
- Aim for clean, premium white/light UI with navy type and orange emphasis. Keep at least 70/20/10 light/neutral/accent as a starting point, not an inflexible ratio. Avoid unrelated lime/purple trends.
- Keep symbol/logo proportions, margins, clean space, and master artboard. Main tagline/brand direction: “Dari ide ke carousel.”

## Mandatory deliverable specifications
- MAIN MASTER: vertical `1080x1920`, aspect `9:16`, **exactly 60.000 seconds**, CFR **30 fps** = 1800 frames; optional variant 60 fps on request only.
- Final video: MP4/H.264, Rec.709, target 10–16 Mbps, `yuv420p`; audio AAC 48 kHz. Verify using ffprobe.
- Hybrid Indonesian voice-over (recorded or authorized TTS), kinetic typography, genuine SaaS UI footage/screenshots, subtitled narrative, music legally cleared, subtle SFX. If VO, music, or UI footage missing, prepare placeholders/preview but NEVER claim final audio or demo is present.
- Typography starting ranges: headline 64–88px, captions 40–48px no more than two lines. Adapt to actual readability at 1080px and mobile scale. Keep captions above placement UI and away from demo control targets; provide placement-safe previews.
- Default transition 250–400ms, smooth easing; no strobing, no unscripted loud whooshes. Move the WHOLE real logo with fade/translate only.

## Story and voice-over timing
- 0–6s hook, 6–14s input, 14–22s make carousel, 22–31s brand styling, 31–40s review/export, 40–49s plan calendar, 49–56s recap, 56–60s CTA. Match `CAMPAIGNS/campaign-001/storyboard.json`.
- Audio FIRST: draft Indonesian script, record/generate compliant voice, measure exact audio duration, align words using speech-to-text and manually verify timings, then animate precise word cues. If sample timeline script doesn't fit 60s, adjust pauses/layout before altering approved copy.
- Include an effective hook in first 2 seconds. Every 2–5s there should be purposeful visual movement or new information, not random distractions.
- Preserve same audio mix, type system, pacing, and color system across scenes. Support sound-off comprehension with readable burned-in subtitles or an SRT deliverable.

## Production protocol
1. Run environment check: Node >=22, FFmpeg/ffprobe, HyperFrames and its installed skills; for audio alignment check whisper-cpp or alternative. Do not assume tools/commands exist.
2. Inventory all assets; inspect files individually. If essential original SVG or product recordings are missing, list blockers. Ask only for missing essentials, and keep working on editable templates.
3. Generate an approved brief and scene storyboard, exact text and timestamps, truthful feature claims, a VO script with cue sheet, and preflight approval.
4. Implement motion as HTML/CSS/JS and deterministic frame-based timeline using HyperFrames's **actual installed documentation**, not imagined API calls. Use modular scenes and one source of truth for total frames.
5. Create low-res/watermarked draft, check actual output with ffprobe and sample frames. Readability, masks, spelling, UI accuracy, brand colors and end card must pass.
6. Produce final at required format and generate SRT, poster frame, source/project, QC report. Run `python3 scripts/qa_video.py path/to/output.mp4` and write observed findings, not invented PASS results.
7. Never report a video as rendered until the file exists, can be decoded, and has been checked.

## Constraints / source provenance
- `BRAND/references/Instadeck_Brand_Kit.pdf` v1.0 is brand guidance; distinguishes **verified assets**, **observed screenshots**, and **proposed practices**. Preserve those distinctions.
- `docs/Motion-Graphics-with-Claude-Code-reference.pdf` provides an example HyperFrames workflow and setup commands, not an SDK guarantee for current versions. Verify live tool functionality.
- User confirmation overrides stale caveat that pricing/trial/auto-post are wholly unverified, but does NOT invent exact commercial terms.
