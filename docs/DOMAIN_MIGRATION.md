# Migrasi domain — 11 September 2026

## Hasil production

Domain utama: https://hygionedarriyan.vercel.app
Domain lama: https://rumah-design.vercel.app
Deployment: dpl_5YNwxzJi2FLSpS4LdwaxpDmGKWVe (Vercel project rumah-design).

Sebelum perbaikan, domain baru merespons 200 tetapi canonical, robots, dan sitemap masih memakai domain lama. Redirect lama berstatus 307 sementara. Ini memberi sinyal perpindahan yang tidak konsisten.

- NUXT_PUBLIC_SITE_URL Vercel diperbarui untuk Production, Preview, Development; konfigurasi .env lokal dan .env.example diselaraskan.
- Build production baru selesai dan aktif pada domain baru.
- Redirect Vercel domain lama diubah menjadi 301 permanen dengan path dan query tetap sama. Tidak menambahkan redirect di Nuxt agar tidak membuat rantai atau loop.
- Canonical, Open Graph URL, identitas structured data, sitemap, dan robots kini memakai domain baru.
- Supabase Auth site_url sebelumnya http://localhost:3000, kini https://hygionedarriyan.vercel.app. additional_redirect_urls memuat https://hygionedarriyan.vercel.app/admin/login. Hanya dua properti URL yang diubah; 11 properti remote lain tetap dipertahankan. Pemeriksaan ulang menunjukkan nol perubahan yang masih tertunda.
- Login aplikasi tetap email/password. Cookie sesi domain lama tidak dipindahkan; admin perlu login kembali di domain baru. Login end-to-end dengan akun pemilik belum diuji.
- Settings publik tidak mengandung domain lama. Tidak diperlukan perubahan schema/data project atau URL Supabase Storage.

## Verifikasi

- Build Vercel production: lulus.
- node scripts/smoke-domain.mjs: lulus pada 17 halaman (8 halaman umum dan 9 project published), canonical/OG URL, JSON-LD valid, sitemap, robots, gambar OG, redirect permanen dan pelestarian path/query.
- SEO_TEST_ORIGIN=https://hygionedarriyan.vercel.app node scripts/smoke-seo.mjs: lulus, termasuk halaman hilang 404 dan admin noindex.
- File /google46f87d892cc68daf.html tetap merespons 200 dengan konten verifikasi yang benar. Ini belum membuktikan properti Search Console baru telah diverifikasi oleh Google.

## Status Google Search Console

Properti URL-prefix baru sudah diverifikasi dan Change of Address dari `rumah-design.vercel.app` ke `hygionedarriyan.vercel.app` berhasil dikirim pada 11 September 2026. Google menampilkan status bahwa situs sedang dipindahkan.

Tindak lanjut pemilik:

1. Pastikan https://hygionedarriyan.vercel.app/sitemap.xml berstatus Success pada properti baru.
2. Gunakan URL Inspection untuk homepage, halaman layanan dan project prioritas; minta indexing setelah Live Test berhasil.
3. Pantau laporan Pages dan Performance pada properti baru serta penurunan trafik pada properti lama.
4. Perbarui tautan website pada GitHub, LinkedIn, CV dan profil pribadi yang dikelola pemilik.
Pertahankan redirect minimal satu tahun, lebih lama bila memungkinkan. Google dapat memerlukan waktu untuk merayapi ulang dan memindahkan sinyal; ranking tidak dijamin atau langsung stabil.

Referensi: [panduan migrasi Google](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## Pemeliharaan

Jalankan node scripts/smoke-domain.mjs setelah perubahan domain/deployment. Untuk target lain, gunakan SEO_CANONICAL_ORIGIN, SEO_OLD_ORIGIN, dan SEO_TEST_ORIGIN. Jangan kembalikan environment ke domain lama ketika merilis berikutnya. Nama internal project Vercel rumah-design boleh tetap sama karena tidak menentukan canonical publik.

Untuk rollback aplikasi, pilih build yang memakai environment domain baru. Deployment sebelum migrasi mengandung canonical lama, sehingga perlu dibangun ulang dengan URL baru sebelum digunakan sebagai rollback production.
