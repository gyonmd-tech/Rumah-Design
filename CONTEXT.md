# Context — Rumah Design

Dokumen ini berisi konteks proyek yang perlu dipahami sebelum mengerjakan bagian apa pun dari Rumah Design — baik oleh manusia maupun AI coding agent.

## Apa itu Rumah Design?
Rumah Design adalah platform portofolio pribadi milik pemilik untuk menampilkan project frontend (landing page & web app) yang sudah dibangun dan di-deploy secara terpisah di Vercel/Netlify. Rumah Design **tidak meng-hosting** project-project tersebut — ia hanya menyimpan metadata, deskripsi, dan link ke live demo masing-masing.

## Kenapa proyek ini dibuat?
Pemilik adalah product designer yang juga membangun frontend sendiri. Karya-karyanya tersebar di berbagai deployment tanpa satu tempat terpusat yang menunjukkan portofolio lengkap dengan narasi proses desain (case study), bukan sekadar screenshot statis seperti di Behance/Dribbble.

## Referensi Visual
Acuan gaya platform: **Awwwards** dan **Onepagelove** — showcase visual-first dengan preview besar dan teks minim. Perbedaan kunci: Rumah Design adalah kurasi 100% personal (hanya karya pemilik), bukan crowd-sourced, sehingga tidak ada sistem rating/voting/review seperti platform aslinya. Detail lengkap ada di `DESIGN.md` bagian "Referensi Visual".

## Siapa yang pakai?
- Single admin (pemilik) — satu-satunya yang bisa login dan CRUD project.
- Pengunjung publik — hanya bisa melihat project berstatus `published`.

## Istilah Penting
- **Project** — satu entri portofolio, merepresentasikan satu karya frontend yang sudah live di URL eksternal.
- **Case study** — deskripsi naratif proses desain per project (problem → proses → solusi → hasil), ditulis dalam markdown.
- **Rumah Design** — nama platform ini sendiri.

## Keputusan Teknis yang Sudah Diambil
- Framework: **Nuxt 3** (SSR) — dipilih untuk SEO dan kemudahan admin panel dalam satu codebase.
- Backend: **Supabase** — dipilih karena integrasi resmi dengan Nuxt, dan sudah menyediakan DB + Auth + Storage tanpa perlu server terpisah.
- Hosting: **Vercel atau Netlify** — keduanya kompatibel, pilih salah satu sebagai environment utama.
- Project bersifat **link-based**, bukan hosting internal — Rumah Design hanya jadi "etalase", bukan tempat build/deploy project itu sendiri.

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
3. Masukkan entrinya ke Rumah Design lewat admin panel, dengan link ke live demo dan case study singkat.
