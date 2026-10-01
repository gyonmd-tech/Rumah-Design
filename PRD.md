# PRD — Hygione Darriyan

## Pembaruan scope — 11 September 2026

Brand resmi: **Hygione Darriyan**. Platform desain dan portofolio pribadi untuk UI/UX designer, designer, frontend developer, dan fullstack developer. Email kontak: **paroarro07@gmail.com**. Domain utama: https://hygionedarriyan.vercel.app. Domain lama https://rumah-design.vercel.app diarahkan permanen ke path yang sama pada domain baru. Nuxt 3 SSR, Supabase, Vercel, project link-based, serta otorisasi admin tetap menjadi batas arsitektur.

SEO mencakup konten semantik yang relevan, identitas Person, CollectionPage/ProfilePage, CreativeWork dan breadcrumb, canonical, metadata dinamis, sitemap project published, serta respons HTTP yang benar. Kata kunci pendukung berasal dari proses, kategori, dan teknologi yang benar-benar digunakan.

## 1. Ringkasan & Visi
Hygione Darriyan adalah platform portofolio pribadi untuk menampilkan project-project frontend (landing page, web app) yang telah dibangun dan di-deploy ke Vercel/Netlify. Alih-alih meng-hosting ulang tiap project, Hygione Darriyan berfungsi sebagai "etalase" terpusat: tiap entri berisi link ke live demo, penjelasan proses desain, dan konteks teknis dari project tersebut.

Referensi visual utama adalah platform showcase seperti **Awwwards** dan **Onepagelove** — visual-first, preview besar, teks minim di permukaan. Bedanya, kurasi di Hygione Darriyan sepenuhnya personal: seluruh karya yang ditampilkan adalah project milik sendiri, bukan submission dari orang lain, sehingga tidak perlu sistem rating/voting/review seperti platform aslinya.

## 2. Latar Belakang & Masalah
- Sebagai product designer yang juga membangun frontend sendiri, project-project yang dikerjakan tersebar di berbagai deployment (Vercel, Netlify) tanpa satu tempat terpusat untuk menunjukkan portofolio dengan konteks & narasi proses.
- Platform desain umum (Behance, Dribbble) hanya menerima gambar statis, tidak bisa menautkan live demo yang interaktif.
- Dibutuhkan satu "rumah" yang menyimpan seluruh riwayat karya sekaligus dokumentasi proses berpikir (case study).

## 3. Target Pengguna
- **Primary**: pemilik platform sendiri (single admin), sebagai showcase ke recruiter, klien, kolaborator.
- **Secondary**: pengunjung publik (recruiter, klien potensial) yang browsing portofolio.

## 4. Tujuan & Metrik Keberhasilan
- Semua project frontend yang sudah/dalam proses dibangun terdokumentasi dengan rapi.
- Halaman project terindeks baik di Google (SEO).
- Proses menambah project baru < 5 menit lewat admin panel.

## 5. Fitur

### Must-have (v1)
- Landing page / homepage berisi profil singkat + grid daftar project
- Halaman detail per project (slug-based) menampilkan: judul, deskripsi/case study, link live demo, link repo (opsional), tech stack, kategori, thumbnail
- Filter ganda: kategori (jenis: landing page / web app / dashboard) & style tag (gaya visual: minimal, dark, bold, dll — ala Awwwards/Onepagelove)
- Admin panel (protected) untuk CRUD project
- Upload thumbnail ke storage
- SEO otomatis per halaman (meta title/description/OG image, sitemap)

### Nice-to-have (v2+)
- Hover preview (GIF/video singkat) di tiap project card, mirip preview di Awwwards — v1 cukup screenshot statis
- Tag pencarian/full-text search
- Statistik sederhana (jumlah klik ke live demo)
- Dark/light mode
- RSS feed / halaman "changelog" project
- Multi-bahasa (ID/EN)

### Out of scope (v1)
- Multi-user/kolaborasi (hanya single admin)
- Komentar/reaksi publik
- Hosting langsung project frontend di dalam Hygione Darriyan (tetap eksternal via Vercel/Netlify)

## 6. User Stories
- Sebagai admin, saya ingin menambah project baru lewat form sederhana, supaya saya tidak perlu sentuh kode tiap kali ada karya baru.
- Sebagai pengunjung, saya ingin memfilter project berdasarkan kategori, supaya saya cepat menemukan contoh yang relevan.
- Sebagai recruiter, saya ingin klik langsung ke live demo dari halaman project, supaya saya bisa mencoba produknya secara nyata.
- Sebagai admin, saya ingin tiap halaman project punya meta SEO otomatis, supaya karya saya mudah ditemukan di Google/dibagikan di LinkedIn.

## 7. Non-functional Requirements
- **SEO**: SSR wajib, meta tags dinamis per halaman.
- **Performance**: skor Lighthouse >90 untuk performance & SEO.
- **Security**: admin panel harus terproteksi auth, hanya pemilik yang bisa akses.
- **Maintainability**: skema data sederhana, mudah di-extend untuk fitur v2.

## 8. Risiko & Asumsi
- Asumsi: link live demo project akan tetap aktif (tanggung jawab pemilik untuk maintain deployment masing-masing project).
- Risiko: broken link kalau project lama di-take down dari Vercel/Netlify → perlu mekanisme "cek status link" di masa depan (v2).

## Perluasan konten yang disetujui — 11 September 2026

Tambahkan /layanan, tiga halaman fokus /layanan/ui-ux-design, /layanan/frontend-development, /layanan/fullstack-development, dan /proses. Konten disimpan sebagai TypeScript terstruktur, dirender SSR, memiliki metadata unik dan sitemap. Referensi karya hanya berasal dari API published. Beranda mendapat section layanan, pendekatan kerja, dan FAQ yang dapat dibaca tanpa JavaScript. Hindari klaim ranking, metrik hasil, biaya, dan jadwal yang belum disepakati.

## Identitas personal yang disetujui — 12 September 2026

Nama profesional produk adalah **Hygione Darriyan**, dengan nama lengkap **Hygione Heparre Paro Arro Darriyan** sebagai identitas pemilik dan author. Homepage dan halaman profil harus menyebut nama lengkap secara terlihat; seluruh halaman publik memakai metadata yang konsisten, sedangkan schema Person memuat nama alternatif, lokasi, keahlian, dan profil resmi. Favicon memakai monogram HD dan aset sosial memakai identitas visual Midnight Indigo.
