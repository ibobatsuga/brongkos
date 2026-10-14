# Pop Lab · web company profile interaktif

Replika struktur company profile PDF (sekolah DJ lain, 2020) memakai
[replica-skill](https://github.com/Jakeschincariol/replica-skill), lalu di-rebrand total
ke Pop Lab (putih + `#0000FF`, brand dari Instagram @poplab97).

- `index.html`, `styles.css`, `app.js` — situs statis, tanpa build.
- `content.js` — **satu-satunya tempat mengisi data**. Nilai `{ isi: "..." }` tampil
  sebagai chip putus-putus sampai diganti nilai resmi.
- `assets/` — logo & foto dari Instagram Pop Lab (resolusi rendah; ganti dengan master).
- `replica/` — recon, feature matrix, token desain, brand, build log, parity.
- `build_artifact.py` — bikin `dist/artifact.html` untuk publikasi Artifact claude.ai.

Jalankan lokal: `python3 -m http.server` di folder ini, buka `http://localhost:8000`.
