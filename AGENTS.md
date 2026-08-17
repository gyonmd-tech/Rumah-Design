# Panduan Kerja — Rumah Design

## Sumber kebenaran

Baca `CONTEXT.md`, `PRD.md`, `DESIGN.md`, `ARCHITECTURE.md`, dan `PLAN.md` sebelum mengubah fitur atau arsitektur. Jika dokumen berbeda, prioritaskan PRD untuk scope produk, DESIGN untuk pengalaman pengguna, ARCHITECTURE untuk teknis, dan PLAN untuk urutan pengerjaan.

## Batasan utama

- Pertahankan Nuxt 3 dengan SSR.
- Gunakan Supabase untuk Postgres, Auth, dan Storage.
- Gunakan Vercel sebagai environment deployment utama.
- Rumah Design hanya menyimpan metadata dan mengarah ke live demo eksternal.
- Pengunjung hanya boleh membaca project `published`.
- Akses tulis hanya untuk user yang tercatat di `public.admin_users`.
- Jangan pernah memasukkan secret/service-role key ke client atau repository.

## Konvensi implementasi

- Gunakan TypeScript untuk konfigurasi dan logic aplikasi.
- Jaga halaman publik tetap visual-first, aksesibel, responsif, dan ringan.
- Semua halaman project harus memiliki metadata SEO dinamis.
- Validasi input di UI dan database; sanitasi markdown sebelum dirender.
- Tambahkan migration baru untuk perubahan schema—jangan mengedit migration yang sudah diterapkan.
- Selesaikan dan verifikasi satu fase di `PLAN.md` sebelum memperluas scope.
