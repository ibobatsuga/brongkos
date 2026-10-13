# Production SOP — one video at a time

1. **Preflight:** Open brand PDF pp. 3–6, 11–13. Read `CLAUDE.md`, brief, commercial terms. Mark each claim as approved, conditional or excluded.
2. **Asset checks:** Original PDF/SVG logo, real app demo footage, voice audio, licensed music and SFX. Redact private names, accounts, balances, internal URL and sensitive identifiers.
3. **Copy:** Choose audience, problem, concise hook and single CTA. No fake trial length, KPI or unsupported service integrations.
4. **VO first:** Produce Indonesian VO in consistent register; place real audio in `ASSETS/voiceover/`. Use transcription/alignment then verify exact phrase starts manually. Make subtitles SRT and clean 2-line mobile version.
5. **Scenes:** Follow eight sections of brand-kit storyboard. Film real UI at high resolution. Make a short kinetically active visual every few seconds while preserving sufficient reading time.
6. **Render:** Confirm `npx hyperframes doctor` succeeds; inspect local HyperFrames documentation / skill entrypoint, implement deterministic frame-based timeline and render first a preview, then final. PDF example: `npx hyperframes render . --fps 30`, but flags may vary by version. Do not promise exact render commands before verification.
7. **Mix:** Voice intelligible; lower licensed music underneath. SFX small and meaningful (click/tick/success), not loud whooshes. AAC 48 kHz output.
8. **QA:** Exact 1800 frames @ 30fps; 1080x1920; sound and subtitles; H.264/yuv420p/Rec709; 10–16 Mbps; no data leaks; no visible invented UI; no clipped text or logos; placement-safe preview of top/bottom overlays.
9. **Export:** Render final MP4, optionally SRT and cover; write QC result. Never report outputs that were not created.

## Required approvals
Original vector asset; commercial data (active pricing terms, trial duration, platform support); final voice actor/license; use of supplied music; actual app footage; Meta ad compliance.
