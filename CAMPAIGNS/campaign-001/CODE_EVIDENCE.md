# campaign-001 · Bukti dari kode produk

Sumber: fork `ibobatsuga/scoopcraft` @ `ed3b49b` (commit terakhir 2026-09-21). Repo utama `zenithsky73/scoopcraft` tidak bisa diakses dari sesi ini, jadi fork ini bisa tertinggal dari produksi.

**Batas bukti:** kode membuktikan fitur *ada dan terhubung*, bukan bahwa fitur itu aktif di produksi atau di paket yang diiklankan. Klaim iklan tetap butuh rekaman produk live (PREFLIGHT.md). Tidak ada nilai di `BRAND/commercial.json` yang diubah.

## Klaim di naskah

| Scene | Klaim | Ada di kode? | Bukti |
| --- | --- | --- | --- |
| 2 INPUT | Mulai dari Link Web, Salin Teks, atau Ide Prompt | Ya | `src/components/generate/multi-input-form.tsx:170,183,196` (tiga tab dengan label persis ini) |
| 3 CAROUSEL | Tentukan jumlah slide | Ya | `src/components/generate/slide-selector.tsx` (preset, bukan input bebas) |
| 4 BRAND | Pilih template, sesuaikan identitas brand | Ya, **dengan syarat paket** | 25 gaya di `src/config/styles.ts` (3 berlabel GRATIS). Brand Kit hanya untuk Creator ke atas (atau OWNER): `src/app/api/brand/route.ts:54`. Rekam scene ini dengan akun Creator+, dan jangan menyiratkan Brand Kit ada di Basic. |
| 5 EXPORT | Periksa lalu ekspor | Ya | PNG per slide dan ZIP (`src/components/result/visual-panel.tsx:238,244`), PDF multi-slide (`src/app/api/content/[id]/pdf/route.ts`, pdf-lib). Tidak ada pembatasan paket di route PDF/ZIP. |
| 6 SCHEDULE | Kalender rencana tayang | Ya | `src/app/(app)/calendar`, `src/components/schedule/content-calendar.tsx` |

## Auto-post: hati-hati

`src/server/social/publisher.ts` (sekitar baris 191–227):

- Instagram, TikTok, Threads → lewat **Repliz**, layanan pihak ketiga (`api.repliz.com`).
- Facebook, LinkedIn → integrasi API langsung.
- Pinterest, Telegram → **hanya simulator**. Keduanya ada di enum `SocialPlatform`, tapi belum punya publisher sungguhan.
- **Simulator mengembalikan `success` dengan URL tiruan** (mis. `instagram.com/p/sim_…`). Ini terjadi kalau akun tidak punya access token, tokennya `mock_…`/`demo_token`, atau post ditandai `isSimulated`.

Akibatnya untuk iklan:
- Rekaman "berhasil dipublikasikan" bisa jadi hasil simulasi. Kalau scene 6 menampilkan auto-post, rekam dengan akun yang tokennya sungguhan, dan pastikan post-nya benar-benar muncul di platform.
- Kalau Pinterest/Telegram kelihatan di UI, jangan tampilkan atau sebut keduanya.
- Naskah saat ini hanya menyebut "kalender". Itu aman.

## Komersial: hanya catatan, tidak disetujui

- **Trial** diatur lewat env (`src/config/trial.ts`): `TRIAL_DURATION_DAYS` default 7, `TRIAL_QUOTA` default 10, mode `FIRST_EXHAUSTED`. Default kode bukan nilai produksi. Aturan "jangan asumsikan 7 hari" tetap berlaku.
- **Harga** di `src/config/plans.ts`: Basic 49.000, Creator 149.000, Agency 399.000, Enterprise 1.149.000. Sama dengan snapshot brand kit.
- Ada **inkonsistensi di kode sendiri:** Basic `quota: 300` (`quotaLabel '300 Kuota / bln'`) tapi daftar fiturnya menulis `'100 credit / bulan'`. Ini satu alasan lagi untuk tidak menampilkan angka sebelum pemilik menetapkan versi aktif.
- Harga add-on di kode berbeda dari brand kit, misalnya ada add-on Rp20.000 / paket, sedangkan brand kit menulis +50 Kuota Rp15.000.

## Aset logo di repo produk

- `public/instadeck-logo.png`, `logo-full.png`, `icon.png`, `logo-icon.png`, `app-icon-dark.png`: kelima file identik (md5 sama). Isinya logo **bertumpuk/persegi** 2000×2000, putih di bidang oranye.
  - Bidang oranye terukur `#FF4500` (cocok dengan SVG terverifikasi).
  - Simbol dan wordmark terukur `#EEEEEE`, **bukan** `#FFFFFF`, dan tepinya lunak. Jadi ini raster ulang, bukan master.
- `public/logo-icon.svg` dan `favicon.svg` berisi mark gradien cyan/ungu/pink yang **bukan logo Instadeck** (sisa branding lama). Tidak ada satu pun file di `src/` yang memakai keduanya. Jangan dipakai.
- **Tidak ada logo horizontal** di repo, dalam format apa pun.

Kesimpulan: blocker logo di PREFLIGHT tetap berlaku. Video tetap memakai preview horizontal dari brand kit sampai SVG/PDF horizontal asli tersedia.

## Bisakah rekaman UI dibuat dari repo ini?

Secara teknis app bisa dijalankan lokal: Next.js 14, Postgres dan Redis lewat `docker-compose.yml`, worker BullMQ, dan akun demo dari `prisma/seed.ts`. Tapi:

- Membuat carousel butuh API key AI sungguhan. Mode `--mock` menghasilkan konten tiruan, dan konten tiruan tidak boleh tampil sebagai hasil produk di iklan.
- Auto-post butuh token Repliz/Meta/LinkedIn sungguhan. Tanpa itu, yang jalan simulator.
- Fork ini bisa tertinggal dari produksi, jadi tampilan UI-nya bisa berbeda.

Rekomendasi: rekam dari `pro.instadeck.id` dengan akun asli (Creator+), data pribadi disamarkan. Instance lokal cukup untuk latihan framing dan crop.
