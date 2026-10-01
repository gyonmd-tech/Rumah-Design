# Identitas personal dan sistem visual

Tanggal: 12 September 2026

## Identitas publik

- Nama lengkap: Hygione Heparre Paro Arro Darriyan
- Nama profesional: Hygione Darriyan
- Peran: IT Support, UI/UX Designer, Frontend & Fullstack Developer
- Lokasi publik: Citayam, Kota Depok, Jawa Barat, Indonesia
- Email: paroarro07@gmail.com
- Profil resmi: GitHub gyonmd-tech, LinkedIn hygione-heparre-paro-arro-darriyan-910724327, dan Instagram gyon.md
- Project utama: ArroBuild dan HyBloggyon

Nama profesional digunakan pada wordmark agar ringkas. Nama lengkap tampil pada homepage, judul dan H1 halaman profil, Open Graph, author metadata, serta schema Person.

## Sistem visual

Arah Midnight Indigo mengganti aksen hijau sebelumnya:

- Midnight #0b1020: latar utama.
- Deep Indigo #151a2e: panel dan permukaan gelap.
- Electric Violet #7667f5: aksen utama pada mode gelap.
- Accessible Violet #5146c8: aksen teks pada halaman terang.
- Cyan #34d4c7: detail identitas dan penanda sekunder.
- Warm Paper #f5f2ea: latar terang dan warna teks utama pada permukaan gelap.

Monogram HD memakai bentuk H berwarna paper, D violet, dan titik cyan.

## Aset

- /favicon.svg: sumber vektor dan favicon browser modern.
- /favicon-48x48.png: ukuran eksplisit untuk crawler dan browser.
- /favicon.ico: fallback 16/32/48.
- /apple-touch-icon.png: ikon perangkat Apple 180px.
- /site.webmanifest: nama aplikasi, warna, dan daftar ikon.
- /og-image.png dan /og-image.svg: gambar berbagi 1200×630.
- utils/identity.ts: sumber identitas untuk schema Person.

## Sinyal identitas pencarian

Schema Person memakai nama lengkap, nama alternatif, peran, Citayam, Kota Depok, topik keahlian, email, dan tiga sameAs. Halaman About memuat nama lengkap sebagai H1, perjalanan pendidikan/kerja, project utama, serta tautan profil dengan rel=me.

Favicon dan schema membantu mesin pencari mengenali situs, tetapi tidak menjamin ranking. Konsistensi nama pada website dan profil eksternal, konten project yang faktual, backlink relevan, serta proses crawl/index Google tetap menentukan kemunculan pencarian. Foto profil belum dipasang karena file belum diberikan.

## Verifikasi

Jalankan npm run typecheck, npm run test:seo, npm run build, lalu smoke test HTTP pada origin tujuan. Script npm run test:brand:http memeriksa identitas, schema, link favicon, manifest, dan aset utama.

Migration 202609110006_personal_identity_branding.sql menyelaraskan general settings, SEO defaults, dan profil sosial.

## Status production

Dirilis ke https://hygionedarriyan.vercel.app pada 12 September 2026 melalui deployment `dpl_8fsmy99HSVWXRYvyPWC4JnVFSx1j`. Smoke test production memverifikasi identitas SSR, schema Person, delapan halaman konten, sembilan project published, sitemap, robots, canonical, Open Graph, seluruh aset favicon, serta redirect permanen dari domain lama. QA browser lulus pada lebar 1440, 390, dan 320 piksel tanpa error halaman.

## Identitas visual baru — 1 Oktober 2026

Menggantikan monogram HD bergaya Midnight Indigo untuk situs publik dan aset sosial.

- **Logo utama (wordmark, tanpa ikon):** `HYGIONE` dalam Inter Tight ExtraBold + `Darriyan` dalam Instrument Serif Italic, ditutup piksel persegi cyan. Warna terang: ink `#0b1020` + signal `#5146c8` + cyan `#34d4c7`; warna gelap: paper `#f5f2ea` + violet `#8b7cff` + cyan. Huruf sudah dikonversi ke outline, jadi tidak bergantung pada font.
  - `public/brand/logo-light.svg`, `public/brand/logo-dark.svg` (file brand)
  - `utils/brand-mark.ts` (path yang sama, dipakai `components/site/Logo.vue` di nav dan footer)
- **Monogram (favicon & ikon aplikasi):** `H` grotesk + `d` serif italic + piksel cyan di atas persegi signal. Di ukuran 16px dipakai versi `H.` agar tetap terbaca.
  - `/favicon.svg`, `/favicon.ico` (16/32/48), `/favicon-48x48.png`, `/apple-touch-icon.png` (180), `/icon-192.png`, `/icon-512.png`, `public/brand/monogram.svg`
- **Open Graph:** `/og-image.png` dan `/og-image.svg` (1200×630) memakai wordmark, nama lengkap, peran, dan pita warna pink/cyan/signal.
- Aset dibuat dari outline font berlisensi OFL (Inter Tight, Instrument Serif).
