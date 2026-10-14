/* Satu sumber data untuk seluruh halaman.
   Nilai { isi: "..." } berarti belum ada data resmi dari PopLab:
   halaman menampilkannya sebagai chip garis putus-putus "isi ...".
   Ganti dengan nilai asli (string) saat sudah dikonfirmasi pemilik. */
window.POPLAB = {
  instagram: { handle: "@poplab97", url: "https://www.instagram.com/poplab97/", dm: "https://ig.me/m/poplab97" },
  whatsapp: { isi: "nomor WhatsApp" },
  email: { isi: "email" },

  lini: [
    { kode: "L1", nama: "Kelas DJ", teks: "Belajar DJ dari nol bareng mentor, langsung di alat. Bukan teori di papan tulis." },
    { kode: "L2", nama: "Slot Latihan", teks: "Pakai deck di studio buat latihan sendiri. Booking slot lewat DM Instagram." },
    { kode: "L3", nama: "Rekam Mix", teks: "Paket Mixtape: rekam hasil mixing-mu, lalu dengarkan ulang setiap transisinya.", harga: "Rp100rb", catatan: "Harga dari posting Instagram PopLab. Konfirmasi saat booking." },
    { kode: "L4", nama: "Rental Alat DJ", teks: "Sewa deck, mixer, dan monitor untuk acara atau latihan di rumah." },
    { kode: "L5", nama: "Event & Open Deck", teks: "Live session, open deck, dan kolaborasi kolektif. Panggung pertama untuk banyak DJ baru." }
  ],

  /* Kurikulum di bawah adalah DRAF dari tim desain. Modul, jumlah pertemuan,
     durasi, dan harga wajib dikonfirmasi PopLab sebelum dipublikasikan. */
  kelas: [
    {
      id: "pemula", nama: "Pemula", sub: "Dari belum pernah pegang deck sampai berani main 30 menit.",
      pertemuan: { isi: "jumlah pertemuan" }, durasi: { isi: "jam per sesi" }, harga: { isi: "harga" },
      modul: ["Kenalan dengan deck, mixer, dan jog wheel", "Struktur lagu: bar, frase, drop", "Beatmatching pakai telinga", "Gain, EQ, dan menjaga level tetap bersih", "Transisi dasar: blend dan cut", "Hot cue dan loop", "Menyusun set 30 menit", "Main di open deck"]
    },
    {
      id: "lanjutan", nama: "Lanjutan", sub: "Untuk yang sudah bisa nyambung lagu dan mau punya gaya sendiri.",
      pertemuan: { isi: "jumlah pertemuan" }, durasi: { isi: "jam per sesi" }, harga: { isi: "harga" },
      modul: ["Harmonic mixing dan kunci nada", "Transisi kreatif lintas genre", "FX berlapis tanpa berantakan", "Membaca crowd dan mengatur energi", "Set 60 menit dari awal sampai akhir", "Rekam mixtape pertamamu"]
    },
    {
      id: "scratch", nama: "Scratch", sub: "Tangan di platter, jari di fader. Teknik dasar turntablism.",
      pertemuan: { isi: "jumlah pertemuan" }, durasi: { isi: "jam per sesi" }, harga: { isi: "harga" },
      modul: ["Posisi tangan dan kurva fader", "Baby scratch dan forward", "Chop dan stab", "Transform", "Flare dasar", "Combo dan routine pendek"]
    },
    {
      id: "privat", nama: "Privat", sub: "Satu mentor, satu murid. Materi mengikuti tujuanmu.",
      pertemuan: { isi: "jumlah pertemuan" }, durasi: { isi: "jam per sesi" }, harga: { isi: "harga" },
      modul: ["Sesi pemetaan: kamu mau main di mana?", "Materi disusun dari kebutuhanmu", "Latihan set untuk acara tertentu", "Review rekaman mix bareng mentor"]
    }
  ],

  /* Daftar rental juga DRAF: sesuaikan dengan inventaris PopLab. */
  rental: [
    { id: "ctrl2", nama: "DJ controller 2 channel", kategori: "Deck", harga: { isi: "harga" } },
    { id: "ctrl4", nama: "DJ controller 4 channel", kategori: "Deck", harga: { isi: "harga" } },
    { id: "club", nama: "Media player + mixer (setup klub)", kategori: "Deck", harga: { isi: "harga" } },
    { id: "monitor", nama: "Speaker monitor aktif (sepasang)", kategori: "Audio", harga: { isi: "harga" } },
    { id: "headphone", nama: "Headphone DJ", kategori: "Audio", harga: { isi: "harga" } },
    { id: "laptop", nama: "Laptop + software DJ", kategori: "Deck", harga: { isi: "harga" } }
  ],
  durasiRental: ["24 jam", "2 hari", "3 hari", "Per acara"],
  syaratRental: [
    { label: "Area layanan", nilai: { isi: "area layanan" } },
    { label: "Kru & pengiriman", nilai: { isi: "termasuk / tidak" } },
    { label: "Jaminan", nilai: { isi: "deposit / identitas" } },
    { label: "Pemesanan", nilai: "Lewat DM Instagram @poplab97" }
  ],

  /* Arsip dari posting Instagram PopLab. Hanya fakta yang tertulis di poster. */
  event: [
    { tanggal: "1–2 Feb 2025", nama: "Too Good To Be Tunes Vol. 2", ket: "Live session: DJ memutar lagu andalan mereka di Pop Lab.", lineup: ["Hari 1: Open Deck", "Hari 2: KISA & Kevin Caesaro"] },
    { tanggal: "9 Feb 2025", nama: "Pretty Sure Vol. 6", ket: "“Back From The Dead”.", lineup: ["VOID", "MIDIJUNKIE", "DPLATFORM", "XXLCHICKEN"] },
    { tanggal: "21 Feb 2025", nama: "Open Deck", ket: "Open format. Gratis masuk. Siapa pun boleh naik dan main.", lineup: ["Kamu?"] },
    { tanggal: "Episode 4", nama: "Too Good To Be Tunes", ket: "Sesi scratch bareng tamu.", lineup: ["Jeejow"] }
  ]
};
