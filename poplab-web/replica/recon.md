# Recon map — company profile PDF → web interaktif PopLab

Skill: `replica-recon` (Jakeschincariol/replica-skill). Target yang dipelajari:
company profile PDF 19 halaman milik sekolah DJ lain (dilampirkan user, 2020).
Yang direplika hanya **struktur, alur baca, dan pola desain**. Nama, logo, foto,
copy, daftar tim, kontak, harga, dan inventaris milik dokumen asli **tidak** dipakai.

## Scope
1. **Apa**: PDF portrait A4, 19 halaman, dibaca berurutan.
2. **Slice**: seluruh alur company profile, diterjemahkan jadi satu halaman web scroll + interaksi.
3. **Untuk siapa**: PopLab — sekolah DJ dan rental alat DJ. Calon murid dan penyewa alat.

## Sumber
| sumber | isi |
| --- | --- |
| PDF lampiran user (halaman 1–19) | satu-satunya sumber; dibaca halaman per halaman |

## Inventaris "screen" (halaman PDF → section web)
| ID | halaman asli | fungsi | komponen kunci | section PopLab |
| --- | --- | --- | --- | --- |
| S01 | 1 cover | identitas + tagline | logo, teks nama berulang di dalam lingkaran, teks vertikal raksasa, garis lingkaran | `#mulai` hero |
| S02 | 2 introductions | tentang, latar, kelas | judul display, 3 sub-judul + paragraf, elips outline, setengah lingkaran bergaris | `#kenalan` |
| S03 | 3 productions | daftar lini usaha | 5 item judul + 1 kalimat | `#lini` (2 lini inti) |
| S04–S10 | 4–6, 8–10 our services | satu layanan per halaman | judul, daftar a–e, foto dalam bentuk blob | `#layanan` (kartu interaktif) |
| S07 | 7, 11, 13 divider | jeda visual antar bab | nama brand besar + foto blob | marquee/kinetic divider |
| S12 | 12, 14 facilities | studio + daftar alat/software | daftar panjang per kategori, foto blob | `#studio` (tab kategori) |
| S15 | 15–17 class & course | kurikulum per program | tabel modul + meta (pertemuan, hari/minggu, jam) + harga | `#kelas` (program switcher) |
| S16 | 17 equipment rentals | tabel sewa + syarat | tabel item/durasi/harga, blok syarat | `#rental` (tabel + perakit paket) |
| S18 | 18 team | instruktur | daftar nama + foto oval | `#tim` |
| S19 | 19 contact | kontak + alamat | sosmed, telepon, email, alamat, logo | `#kontak` |

States: dokumen asli statis. Versi web menambah state: hover, fokus keyboard, tab aktif,
paket kosong/terisi, audio mati/hidup, `prefers-reduced-motion`, lebar 390px.

## Flows
```
F01 Calon murid memilih kelas
    S01 hero -> S15 kelas: pilih program -> lihat modul -> S19 kontak (pesan via WhatsApp)
F02 Penyewa merakit paket alat
    S16 rental: centang alat + durasi -> pesan otomatis tersusun -> salin / buka WhatsApp
F03 Pengunjung "mencoba" nge-DJ
    deck interaktif: play -> geser crossfader / BPM -> tipografi ikut beat
```
Klik happy path F02: 3 (pilih alat, pilih durasi, salin pesan). Di PDF: tidak ada — harus telepon.

## Komponen
- Judul display kinetic (huruf dipecah, stagger, sumbu lebar font beranimasi)
- Lingkaran bergaris (stripe disc), elips outline, bentuk blob untuk media
- Marquee / pita teks berjalan
- Daftar a–e layanan → kartu
- Tabel kurikulum → daftar modul + 3 meta chip
- Tabel rental → baris pilih + ringkasan paket
- Blok syarat & ketentuan
- Kartu tim, blok kontak

## Model data (inferensi)
```
Program  nama, level, ringkasan, modul[], pertemuan, hari_per_minggu, jam_per_sesi, harga
         bukti: halaman 15–17 (kolom tabel). confidence: high
RentalItem nama, kategori, durasi_dasar, harga
         bukti: halaman 17 tabel rental. confidence: high
Layanan  nama, poin[] ; Instruktur nama, foto ; Kontak kanal, nilai
```
Semua nilai PopLab disimpan di `content.js`; nilai yang belum diberikan pemilik ditandai `ISI`.

## Yang tidak direplika (skip)
- Lini multimedia, video mapping, event organizer, creative market, ambience musik, live streaming:
  bukan bisnis PopLab menurut brief user (sekolah DJ + rental alat DJ).
- Foto, nama tim, kontak, alamat, harga, daftar merek alat milik dokumen asli.
- Logo dan nama brand asli.

## Ukuran
1 halaman, 10 section, 3 flow, 4 entitas. Bagian tersulit: deck audio Web Audio,
animasi berbasis beat yang tetap ringan, dan data yang belum lengkap. Ukuran: **S**.
