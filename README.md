# Hygione Darriyan

Portofolio personal visual-first untuk menampilkan karya UI/UX, desain visual, frontend dan fullstack, live demo, tech stack, dan case study. Aplikasi menggunakan Nuxt 3 SSR, Supabase, Tailwind CSS, Nuxt SEO, dan Vercel.

MVP mencakup halaman publik dengan filter kategori/style, detail project dengan markdown yang disanitasi di server, SEO dinamis, sitemap, serta admin CRUD yang dilindungi RLS dan mendukung upload thumbnail.

Gunakan Node.js 22.18 atau lebih baru.

## Menjalankan lokal

1. Salin `.env.example` menjadi `.env`.
2. Isi `SUPABASE_URL` dan `SUPABASE_KEY` dari Supabase Project Settings > API.
3. Jalankan `npm install`, `npm run typecheck`, lalu `npm run dev`.

## Menyiapkan Supabase

1. Buat project baru di Supabase.
2. Buka SQL Editor dan jalankan migration melalui Supabase CLI, atau jalankan seluruh file di `supabase/migrations` berurutan pada project kosong.
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

Audit dan panduan peluncuran branding: `docs/AUDIT_BRANDING_SEO.md`.

Pengujian regresi: `npm run test:seo`. Pengujian HTTP terhadap server lokal di port 3100: `npm run test:seo:http` (ubah `SEO_TEST_ORIGIN` bila perlu).

Domain production: https://hygionedarriyan.vercel.app. Lihat [catatan migrasi domain](docs/DOMAIN_MIGRATION.md) untuk redirect, Auth, pemeriksaan SEO, dan tindak lanjut Search Console.

Identitas personal, palet, favicon, Open Graph, dan schema Person didokumentasikan di [docs/PERSONAL_BRAND.md](docs/PERSONAL_BRAND.md). Gunakan `npm run test:brand:http` untuk memeriksa sinyal identitas pada origin yang ditentukan melalui `SEO_TEST_ORIGIN`.
