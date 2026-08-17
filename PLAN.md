# Plan — Rumah Design

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
- [ ] Lighthouse audit — performance & SEO > 90

## Fase 4 — Go Live
- [ ] Custom domain di-connect ke Vercel/Netlify
- [ ] Isi minimal 3–5 project pertama lewat admin panel
- [ ] Submit sitemap ke Google Search Console
- [ ] Final review desain (karena ini bagian dari portofolio kamu sendiri)

## Backlog (v2, belum prioritas)
- [ ] Hover preview media (GIF/video singkat) di `ProjectCard`, ala Awwwards
- [ ] Full-text search
- [ ] Statistik klik ke live demo
- [ ] Dark/light mode
- [ ] Multi-bahasa (ID/EN)
- [ ] Cek status link otomatis (broken link detection)
