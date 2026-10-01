# Plan — Hygione Darriyan

Roadmap implementasi bertahap. Tiap fase idealnya bisa di-deploy & diuji sebelum lanjut ke fase berikutnya.

## Fase 0 — Setup Awal
- [x] Inisialisasi project Nuxt 3 (`npx nuxi init rumah-design`)
- [x] Setup Supabase project (buat project baru di dashboard Supabase)
- [x] Install & konfigurasi `@nuxtjs/supabase`, `@nuxtjs/seo`, Tailwind CSS
- [x] Buat tabel `projects` + RLS policy (lihat `ARCHITECTURE.md`)
- [x] Setup environment variables lokal (`.env`) & di Vercel
- [x] Deploy production ke Vercel untuk memastikan pipeline jalan

## Fase 1 — Halaman Publik (MVP)
- [x] Komponen `ProjectCard`
- [x] Halaman `/` — fetch & render grid project published
- [x] Halaman `/project/[slug]` — detail project
- [x] SEO meta dinamis per halaman project
- [x] Sitemap otomatis

## Fase 2 — Admin Panel
- [x] Halaman `/admin/login` dengan Supabase Auth
- [x] Middleware auth untuk semua route `/admin/*`
- [x] `/admin/projects` — tabel list project (draft & published)
- [x] `/admin/projects/new` — form tambah project + upload thumbnail ke Supabase Storage
- [x] `/admin/projects/[id]/edit` — form edit & hapus project

## Fase 3 — Filter & Polish
- [x] Komponen `ProjectFilter` (kategori + style)
- [x] Halaman `/about`
- [x] Responsive implementation (mobile-first)
- [x] Perluas taxonomy kategori, style tags, dan tech stack untuk variasi portofolio
- [x] Hardening admin: sanitasi preview Markdown, validasi URL/data, dan batas publish
- [x] Hardening Supabase: batas payload, public settings whitelist, dan Storage folder policy
- [ ] Lighthouse audit — performance & SEO > 90

## Fase 4 — Go Live
- [ ] Custom domain di-connect ke Vercel/Netlify
- [x] Isi minimal 3–5 project pertama lewat admin panel — 9 project published terverifikasi pada 11 September 2026
- [ ] Submit sitemap ke Google Search Console
- [ ] Final review desain (karena ini bagian dari portofolio kamu sendiri)

## Backlog (v2, belum prioritas)
- [ ] Hover preview media (GIF/video singkat) di `ProjectCard`, ala Awwwards
- [ ] Full-text search
- [ ] Statistik klik ke live demo
- [ ] Dark/light mode
- [ ] Multi-bahasa (ID/EN)
- [ ] Cek status link otomatis (broken link detection)

## Penyelesaian Fase 3 — Branding & SEO (11 September 2026)

- [x] Identitas Hygione Darriyan, email kontak, dan cakupan UI/UX hingga fullstack.
- [x] Metadata, canonical, structured data, status error, dan sitemap gambar.
- [x] Panduan topik pendukung di editor project; indikator SEO tidak mengklaim status indeks.
- [x] Migration baru untuk metadata branding tanpa mengubah migration lama.
- [x] Typecheck, build, test SEO, HTTP smoke test, dan browser desktop/mobile lulus.
- [x] Terapkan migration 202609110005 di Supabase production; migration 202608230004 juga diterapkan dan diverifikasi.
- [x] Deploy perubahan dan verifikasi ulang HTTP production.
- [ ] Lighthouse production: peluncuran Chrome gagal; skor belum tersedia.
- [ ] Verifikasi indeks aktual dan kirim ulang sitemap di Search Console.

## Rilis konten personal & layanan — disetujui 11 September 2026

- [x] Copywriting personal untuk beranda, profil, kontak, dan footer.
- [x] Halaman layanan, tiga detail layanan, dan proses kerja.
- [x] Tautan internal, metadata unik, dan sitemap halaman baru.
- [x] Verifikasi build, SEO HTTP lokal/staging/production, dan browser responsive untuk perluasan konten.
- [x] Migration Supabase dan deployment Vercel production setelah verifikasi; lihat docs/CONTENT_RELEASE.md.

## Migrasi domain — 11 September 2026

- [x] Environment lokal/Vercel dan dokumen memakai hygionedarriyan.vercel.app.
- [x] Redirect domain lama 301 permanen mempertahankan path/query.
- [x] Site URL dan allowlist redirect Supabase Auth diselaraskan.
- [x] Build dan deploy production baru berhasil; 17 halaman termasuk 9 project terverifikasi.
- [x] Sitemap, robots, canonical, OG, file verifikasi Google, dan admin noindex diperiksa.
- [x] Verifikasi properti baru dan kirim Change of Address di Search Console pada 11 September 2026.
- [ ] Pastikan sitemap domain baru berstatus Success dan minta indexing halaman prioritas.

Lihat docs/DOMAIN_MIGRATION.md.
## Personal branding — 12 September 2026

- [x] Tetapkan nama lengkap, nama profesional, peran, lokasi publik, dan profil resmi.
- [x] Buat sistem warna Midnight Indigo dan monogram HD.
- [x] Tambahkan SVG, PNG 48px, ICO, Apple Touch Icon, manifest, dan Open Graph 1200×630.
- [x] Perluas halaman profil dengan pendidikan, pekerjaan, minat, dan project utama.
- [x] Tambahkan schema Person dengan alternateName, homeLocation, knowsAbout, dan sameAs.
- [x] Terapkan migration settings personal ke Supabase production.
- [x] Typecheck, regression SEO, build, SSR identity, dan browser responsive lulus.
- [ ] Tambahkan foto profil setelah aset diberikan.
- [x] Deploy production dan verifikasi aset melalui domain utama (deployment dpl_8fsmy99HSVWXRYvyPWC4JnVFSx1j).

Lihat docs/PERSONAL_BRAND.md.

## Redesign publik editorial-playful — 1 Oktober 2026

- [x] Analisis referensi visual (docs/REFERENCE_EXTRAFAZANT.md).
- [x] Design token, tipografi, dan ukuran fluid situs publik (assets/css/site.css).
- [x] Runtime motion (GSAP + Lenis), reveal deklaratif, transisi halaman SVG.
- [x] Beranda, /karya (filter ganda + pencarian), /project/[slug], /about, /layanan, /layanan/[slug], /proses, /contact, halaman error.
- [x] Sitemap memuat /karya.
- [x] Typecheck, build produksi, smoke SEO HTTP (build produksi lokal), browser desktop 1440px dan mobile 375px.
- [ ] Lighthouse production setelah deploy (performance & SEO > 90).
- [ ] Tinjau ulang copy hero/section yang diringkas untuk judul besar.
