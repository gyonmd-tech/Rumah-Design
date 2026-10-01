# Context — Hygione Darriyan

## Pembaruan scope — 11 September 2026

Brand resmi: **Hygione Darriyan**. Platform desain dan portofolio pribadi untuk UI/UX designer, designer, frontend developer, dan fullstack developer. Email kontak: **paroarro07@gmail.com**. Domain utama: https://hygionedarriyan.vercel.app. Domain lama https://rumah-design.vercel.app diarahkan permanen ke path yang sama pada domain baru. Nuxt 3 SSR, Supabase, Vercel, project link-based, serta otorisasi admin tetap menjadi batas arsitektur.

SEO mencakup konten semantik yang relevan, identitas Person, CollectionPage/ProfilePage, CreativeWork dan breadcrumb, canonical, metadata dinamis, sitemap project published, serta respons HTTP yang benar. Kata kunci pendukung berasal dari proses, kategori, dan teknologi yang benar-benar digunakan.

Dokumen ini berisi konteks proyek yang perlu dipahami sebelum mengerjakan bagian apa pun dari Hygione Darriyan — baik oleh manusia maupun AI coding agent.

## Apa itu Hygione Darriyan?
Hygione Darriyan adalah platform portofolio pribadi milik pemilik untuk menampilkan project frontend (landing page & web app) yang sudah dibangun dan di-deploy secara terpisah di Vercel/Netlify. Hygione Darriyan **tidak meng-hosting** project-project tersebut — ia hanya menyimpan metadata, deskripsi, dan link ke live demo masing-masing.

## Kenapa proyek ini dibuat?
Pemilik adalah product designer yang juga membangun frontend sendiri. Karya-karyanya tersebar di berbagai deployment tanpa satu tempat terpusat yang menunjukkan portofolio lengkap dengan narasi proses desain (case study), bukan sekadar screenshot statis seperti di Behance/Dribbble.

## Referensi Visual
Acuan gaya platform: **Awwwards** dan **Onepagelove** — showcase visual-first dengan preview besar dan teks minim. Perbedaan kunci: Hygione Darriyan adalah kurasi 100% personal (hanya karya pemilik), bukan crowd-sourced, sehingga tidak ada sistem rating/voting/review seperti platform aslinya. Detail lengkap ada di `DESIGN.md` bagian "Referensi Visual".

## Siapa yang pakai?
- Single admin (pemilik) — satu-satunya yang bisa login dan CRUD project.
- Pengunjung publik — hanya bisa melihat project berstatus `published`.

## Istilah Penting
- **Project** — satu entri portofolio, merepresentasikan satu karya frontend yang sudah live di URL eksternal.
- **Case study** — deskripsi naratif proses desain per project (problem → proses → solusi → hasil), ditulis dalam markdown.
- **Hygione Darriyan** — nama platform ini sendiri.

## Keputusan Teknis yang Sudah Diambil
- Framework: **Nuxt 3** (SSR) — dipilih untuk SEO dan kemudahan admin panel dalam satu codebase.
- Backend: **Supabase** — dipilih karena integrasi resmi dengan Nuxt, dan sudah menyediakan DB + Auth + Storage tanpa perlu server terpisah.
- Hosting: **Vercel atau Netlify** — keduanya kompatibel, pilih salah satu sebagai environment utama.
- Project bersifat **link-based**, bukan hosting internal — Hygione Darriyan hanya jadi "etalase", bukan tempat build/deploy project itu sendiri.

## Dokumen Terkait
- `PRD.md` — requirement & fitur
- `DESIGN.md` — struktur halaman, komponen, model konten
- `ARCHITECTURE.md` — stack teknis, skema database, deployment
- `PLAN.md` — roadmap implementasi bertahap
- `AGENTS.md` — panduan kerja untuk AI coding agent di repo ini

## Konvensi Kerja ke Depan
Setiap kali pemilik punya ide project frontend baru, alur kerjanya:
1. Buat file markdown baru (PRD/design/plan ringkas) untuk project tersebut.
2. Bangun & deploy project itu secara terpisah (Vercel/Netlify).
3. Masukkan entrinya ke Hygione Darriyan lewat admin panel, dengan link ke live demo dan case study singkat.

## Perluasan konten yang disetujui — 11 September 2026

Tambahkan /layanan, tiga halaman fokus /layanan/ui-ux-design, /layanan/frontend-development, /layanan/fullstack-development, dan /proses. Konten disimpan sebagai TypeScript terstruktur, dirender SSR, memiliki metadata unik dan sitemap. Referensi karya hanya berasal dari API published. Beranda mendapat section layanan, pendekatan kerja, dan FAQ yang dapat dibaca tanpa JavaScript. Hindari klaim ranking, metrik hasil, biaya, dan jadwal yang belum disepakati.

## Identitas personal yang disetujui — 12 September 2026

Platform menggunakan nama profesional **Hygione Darriyan** dan menghubungkannya secara konsisten dengan nama lengkap **Hygione Heparre Paro Arro Darriyan**. Posisi utama yang ditampilkan adalah IT Support, UI/UX Designer, Frontend Developer, dan Fullstack Developer. Lokasi publik adalah Citayam, Kota Depok, Jawa Barat, Indonesia. Identitas pencarian memakai halaman profil SSR, schema Person, tautan profil resmi, favicon monogram HD, dan sistem warna Midnight Indigo.
