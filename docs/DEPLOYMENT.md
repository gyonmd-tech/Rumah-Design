# Deployment Rumah Design

## Akses yang dibutuhkan

- Supabase project URL dan publishable/anon key.
- Satu user Supabase Auth sebagai pemilik.
- Akses repository dan project Vercel.
- Domain final untuk `NUXT_PUBLIC_SITE_URL`.

Service-role key tidak diperlukan oleh aplikasi dan tidak boleh dimasukkan ke Vercel atau client.

## Urutan setup

1. Buat project Supabase dan terapkan migration di `supabase/migrations`.
2. Buat user pemilik melalui Supabase Auth.
3. Tambahkan UUID user ke `public.admin_users`.
4. Isi `.env` lokal dari `.env.example` dan uji login serta CRUD.
5. Hubungkan repository ke Vercel dan isi environment untuk Preview serta Production.
6. Set `NUXT_PUBLIC_SITE_URL` ke domain HTTPS final, lalu deploy ulang.
7. Uji `/`, `/project/<slug>`, `/sitemap.xml`, dan seluruh route admin.

## Release gate

- `npm run typecheck` lulus.
- `npm run check:deploy` lulus dengan environment production.
- `npm run build` lulus pada Node 22.18+ atau 24.x.
- Pengunjung anonim hanya melihat project `published`.
- Akun authenticated yang tidak ada di `admin_users` ditolak.
- Upload JPG/PNG/WebP dan URL public Storage berhasil.
- Markdown berbahaya tidak dirender sebagai HTML/script.
- Metadata OG memakai thumbnail project.
- Lighthouse Performance dan SEO mencapai target >90 pada deployment production.
