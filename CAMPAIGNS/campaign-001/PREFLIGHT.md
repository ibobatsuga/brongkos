# campaign-001 · Preflight ledger

Status on 2026-10-13: **composition ready for rendering; final assets missing.** The draft render is a watermarked pipeline proof, not an ad.

## Claims (SOP step 1)

| Scene | Copy (VO / on-screen) | Status | Basis and condition |
| --- | --- | --- | --- |
| 1 HOOK | "Ide konten sudah ada, tetapi memulai carousel masih terasa rumit?" / "Ide ada. Mulainya?" | Approved (no product claim) | Brand kit p.12 copy. Props are blank cards with no UI and no fake posts. |
| 2 INPUT | "…mulai dari topik atau teks yang ingin kamu olah." | Conditional | Link Web / Salin Teks / Ide Prompt were *observed* in screenshot S5. Ship only over a real recording of a working input. |
| 3 CAROUSEL | "Tentukan jumlah slide, lalu susun pesan…" | Conditional | Slide-count control observed in S5. Needs a real recording of generation and its actual result. |
| 4 BRAND | "Pilih template dan sesuaikan tampilan…" | Conditional | Template choice observed in S3/S5. The Brand Kit feature is plan- or add-on-dependent, so record it on the plan being advertised. Do not show a template count. |
| 5 EXPORT | "Periksa kembali… Siapkan hasil…" | Conditional | PDF/PNG export observed in S5. Needs a real export recording. The VO makes no format promise. |
| 6 SCHEDULE | "Rapikan rencana tayang lewat kalender…" | Conditional | Calendar observed in S3. Auto-post is user-confirmed, but **no platform is approved**, so the VO and screen copy mention only the calendar. Mask platform names in the recording, or get `supportedPlatforms` approved first. |
| 7 RECAP | "Ide → Carousel → Jadwal" | Approved | Summary of scenes 2–6. Inherits their conditions. |
| 8 CTA | "Lihat cara kerjanya" | Approved | `BRAND/commercial.json` → `approvedNonNumericCTA`. |
| — | Prices, plans, trial length, platforms, stats, testimonials | **Excluded** | `promotionCopyApproval` is all `false`. `campaign_tool.py verify` fails the build if any of these appear. |
| — | URL `https://pro.instadeck.id/` | Excluded from video | `brief.json`: test the destination before publication. Use it as the Meta link only. |

Address register: **kamu** throughout (casual social ad). The tool rejects any `Anda`.

Copy status: all lines are still "proposed from Brand Kit p.12" in `storyboard.json`. **Owner sign-off is required before the final render.**

## Blockers for the final render

1. **Official logo master**: SVG/PDF of the horizontal logo. The scenes use `assets/brand/instadeck-horizontal-extracted-from-brandkit.png`, a raster preview.
2. **UI recordings** (one per scene, real product, private data masked). Put them in `assets/ui/` with these names:
   - `s2-input.mp4` (8 s + 1 s handles): choosing Link Web, Salin Teks or Ide Prompt and entering material
   - `s3-carousel.mp4` (8 s): slide-count choice → the real generated carousel
   - `s4-brand.mp4` (9 s): template selection and active brand settings
   - `s5-export.mp4` (9 s): reviewing slides → PDF/PNG export
   - `s6-schedule.mp4` (9 s): content calendar and scheduling, with no unapproved platform names visible

   Recording spec: 16:9, at least 1920×1080 (2560×1440 preferred, so punch-ins stay sharp), 30 fps CFR.
3. **Indonesian VO** in the *kamu* register: recorded, or TTS you are authorized to use, with a licence. WAV, 48 kHz. Each line must fit its scene window, and VO drives the timing (CLAUDE.md). Local Kokoro TTS has no Indonesian voice, so it is not an option.
4. **Licensed music and subtle SFX** (click/tick/success), with licence records.
5. **Owner approvals**: final copy, voice talent, music use, real footage, and Meta ad-policy compliance.
6. **Optional**: licensed or confirmed brand font. Inter (OFL 1.1, bundled in `ASSETS/fonts/inter/`) is the brand kit's *proposed* font, not a verified official one.

## Runbook: from assets to final

```bash
# 0. toolchain (fresh machine/container)
bash scripts/setup.sh --with-whisper && bash scripts/env_check.sh

# 1. footage: in each scenes/s2..s6 file, follow its SWAP comment
#    (replace the *-ph placeholder div with the <video>, retarget the punch-in)
# 2. logo: drop the master at BRAND/logo/instadeck-horizontal.svg,
#    run `npm run c001:sync`, and point the <img> src in s7/s8 at it
# 3. audio: copy VO/music/SFX into assets/audio/ and add <audio> tags (template in index.html)

# 4. VO first: transcribe, align captions, then listen and fix by hand
npx hyperframes transcribe CAMPAIGNS/campaign-001/assets/audio/vo-id.wav -m small -l id -d CAMPAIGNS/campaign-001
python3 scripts/campaign_tool.py align CAMPAIGNS/campaign-001 CAMPAIGNS/campaign-001/transcript.json
#    → retime scene motion to the word cues if needed; set "manualVerification": true in captions.json
npm run c001:build          # regenerates burned-in cues + subtitles/campaign-001.id.srt

# 5. gates
#    add data-hidden to the draft-mark host in index.html
python3 scripts/campaign_tool.py verify CAMPAIGNS/campaign-001 --final
npm run c001:check

# 6. final render, then QC
npx hyperframes render CAMPAIGNS/campaign-001 --fps 30 --quality delivery --video-bitrate 12M \
  -o RENDERS/final/instadeck-c001-dari-ide-ke-carousel-60s-1080x1920.mp4
python3 scripts/qa_video.py RENDERS/final/instadeck-c001-dari-ide-ke-carousel-60s-1080x1920.mp4
python3 scripts/placement_preview.py RENDERS/final/instadeck-c001-dari-ide-ke-carousel-60s-1080x1920.mp4
```

The draft encode came out tagged BT.709 with a 0.54 Mbps draft bitrate. Re-check both on the final, since the target is 10–16 Mbps (see `RENDERS/previews/campaign-001-draft.QC.md`).
