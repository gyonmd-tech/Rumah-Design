# Rumah Design

Portofolio personal visual-first untuk menampilkan karya frontend, live demo, tech stack, dan case study. Aplikasi menggunakan Nuxt 3 SSR, Supabase, Tailwind CSS, Nuxt SEO, dan Vercel.

MVP mencakup halaman publik dengan filter kategori/style, detail project dengan markdown yang disanitasi di server, SEO dinamis, sitemap, serta admin CRUD yang dilindungi RLS dan mendukung upload thumbnail.

Gunakan Node.js 22.18 atau lebih baru.

## Menjalankan lokal

1. Salin `.env.example` menjadi `.env`.
2. Isi `SUPABASE_URL` dan `SUPABASE_KEY` dari Supabase Project Settings > API.
3. Jalankan `npm install`, `npm run typecheck`, lalu `npm run dev`.

## Menyiapkan Supabase

1. Buat project baru di Supabase.
2. Buka SQL Editor dan jalankan migration melalui Supabase CLI, atau jalankan `supabase/migrations/202608140001_initial_schema.sql` pada project kosong.
3. Buat satu user email/password lewat Authentication.
4. Salin UUID user tersebut, lalu jalankan:

```sql
insert into public.admin_users (user_id)
values ('UUID-USER-ADMIN');
```

Jangan menaruh secret key atau service-role key di source code maupun variabel publik.

## Deployment Vercel

Hubungkan repository ke Vercel. Tambahkan `NUXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, dan `SUPABASE_KEY` pada Project Settings > Environment Variables. Pilih Node.js 22.18+ atau 24.x. Nuxt SSR menggunakan build default Vercel tanpa konfigurasi tambahan.

Sebelum mengubah project menjadi `published`, pastikan `live_url` dan `thumbnail_url` memakai HTTPS, case study sudah diperiksa, dan live demo dapat dibuka tanpa akses internal.

Dokumen kebutuhan dan keputusan proyek tersedia di `CONTEXT.md`, `PRD.md`, `DESIGN.md`, `ARCHITECTURE.md`, dan `PLAN.md`.
