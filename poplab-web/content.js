/* Satu sumber data untuk seluruh halaman.
   Nilai bertanda SEMENTARA adalah isian sementara dari tim desain (disetujui user
   sebagai versi awal). Ganti dengan data resmi PopLab saat revisi.
   Nilai { isi: "..." } masih didukung: tampil sebagai chip garis putus-putus. */
window.POPLAB = {
  instagram: { handle: "@poplab97", url: "https://www.instagram.com/poplab97/", dm: "https://ig.me/m/poplab97" },
  kontak: [
    { label: "Instagram", nilai: "@poplab97", link: "https://www.instagram.com/poplab97/", salin: true },
    { label: "Booking slot & kelas", nilai: "DM Instagram", link: "https://ig.me/m/poplab97" },
    { label: "Rental & kolaborasi", nilai: "DM Instagram", link: "https://ig.me/m/poplab97" }
  ],

  /* SEMENTARA: disusun dari alat yang terlihat di foto Instagram PopLab. */
  studio: [
    { ikon: "deck", nama: "Deck & controller", teks: "Controller DJ all-in-one, siap dipakai buat kelas dan latihan." },
    { ikon: "monitor", nama: "Speaker monitor", teks: "Monitor studio di samping deck, supaya detail mix-mu kedengaran." },
    { ikon: "laptop", nama: "Laptop & software", teks: "Laptop dengan software DJ terpasang. Bawa USB atau pakai koleksi lagumu." },
    { ikon: "rec", nama: "Rekam mix", teks: "Set-mu direkam langsung dari mixer, lalu bisa didengar ulang." },
    { ikon: "ruang", nama: "Ruang latihan", teks: "Booking slot lewat DM, datang, langsung main." }
  ],

  lini: [
    { kode: "L1", nama: "Kelas DJ", teks: "Belajar DJ dari nol bareng mentor, langsung di alat. Bukan teori di papan tulis." },
    { kode: "L2", nama: "Slot Latihan", teks: "Pakai deck di studio buat latihan sendiri. Booking slot lewat DM Instagram." },
    { kode: "L3", nama: "Rekam Mix", teks: "Paket Mixtape: rekam hasil mixing-mu, lalu dengarkan ulang setiap transisinya.", harga: "Rp100rb", catatan: "Harga dari posting Instagram PopLab. Konfirmasi saat booking." },
    { kode: "L4", nama: "Rental Alat DJ", teks: "Sewa deck, mixer, dan monitor untuk acara atau latihan di rumah." },
    { kode: "L5", nama: "Event & Open Deck", teks: "Live session, open deck, dan kolaborasi kolektif. Panggung pertama untuk banyak DJ baru." }
  ],

  /* SEMENTARA: modul, jumlah pertemuan, dan durasi disusun tim desain. */
  kelas: [
    {
      id: "pemula", nama: "Pemula", sub: "Dari belum pernah pegang deck sampai berani main 30 menit.",
      pertemuan: "8 pertemuan", durasi: "2 jam", harga: "Tanya via DM",
      modul: ["Kenalan dengan deck, mixer, dan jog wheel", "Struktur lagu: bar, frase, drop", "Beatmatching pakai telinga", "Gain, EQ, dan menjaga level tetap bersih", "Transisi dasar: blend dan cut", "Hot cue dan loop", "Menyusun set 30 menit", "Main di open deck"]
    },
    {
      id: "lanjutan", nama: "Lanjutan", sub: "Untuk yang sudah bisa nyambung lagu dan mau punya gaya sendiri.",
      pertemuan: "8 pertemuan", durasi: "2 jam", harga: "Tanya via DM",
      modul: ["Harmonic mixing dan kunci nada", "Transisi kreatif lintas genre", "FX berlapis tanpa berantakan", "Membaca crowd dan mengatur energi", "Set 60 menit dari awal sampai akhir", "Rekam mixtape pertamamu"]
    },
    {
      id: "scratch", nama: "Scratch", sub: "Tangan di platter, jari di fader. Teknik dasar turntablism.",
      pertemuan: "6 pertemuan", durasi: "2 jam", harga: "Tanya via DM",
      modul: ["Posisi tangan dan kurva fader", "Baby scratch dan forward", "Chop dan stab", "Transform", "Flare dasar", "Combo dan routine pendek"]
    },
    {
      id: "privat", nama: "Privat", sub: "Satu mentor, satu murid. Materi mengikuti tujuanmu.",
      pertemuan: "Fleksibel", durasi: "1–2 jam", harga: "Tanya via DM",
      modul: ["Sesi pemetaan: kamu mau main di mana?", "Materi disusun dari kebutuhanmu", "Latihan set untuk acara tertentu", "Review rekaman mix bareng mentor"]
    }
  ],

  /* SEMENTARA: sesuaikan dengan inventaris PopLab. */
  rental: [
    { id: "ctrl2", nama: "DJ controller 2 channel", kategori: "Deck", harga: "Tanya via DM" },
    { id: "ctrl4", nama: "DJ controller 4 channel", kategori: "Deck", harga: "Tanya via DM" },
    { id: "club", nama: "Media player + mixer (setup klub)", kategori: "Deck", harga: "Tanya via DM" },
    { id: "monitor", nama: "Speaker monitor aktif (sepasang)", kategori: "Audio", harga: "Tanya via DM" },
    { id: "headphone", nama: "Headphone DJ", kategori: "Audio", harga: "Tanya via DM" },
    { id: "laptop", nama: "Laptop + software DJ", kategori: "Deck", harga: "Tanya via DM" }
  ],
  durasiRental: ["24 jam", "2 hari", "3 hari", "Per acara"],
  syaratRental: [
    { label: "Durasi minimum", nilai: "24 jam" },
    { label: "Kru & pengiriman", nilai: "Bisa diatur sesuai kebutuhan acara" },
    { label: "Jaminan", nilai: "Kartu identitas + deposit" },
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
