# Rilis konten Hygione Darriyan — 11 September 2026

## Scope yang sudah diimplementasikan

- Copywriting beranda, profil, kontak, dan footer menjadi lebih personal dan konkret.
- Section layanan, karakter kerja, ringkasan proses, serta FAQ HTML native di beranda.
- /layanan: menjelaskan cakupan bantuan dan cara memilih scope.
- /layanan/ui-ux-design: alur pengguna, wireframe, prototype, dan desain visual.
- /layanan/frontend-development: implementasi Figma, komponen, responsivitas, dan integrasi antarmuka.
- /layanan/fullstack-development: API, autentikasi, model data, aturan akses, dan deployment.
- /proses: tahapan brief sampai serah terima, checkpoint, perubahan scope, dan dukungan lanjutan.
- Metadata unik, canonical, schema WebPage/Service/BreadcrumbList, dan sitemap untuk semua rute baru.
- Detail layanan menampilkan project relevan hanya dari API published.
- Form kontak menjelaskan bahwa tombol membuka aplikasi email dan tidak langsung mengirim pesan.
- Klaim respons 24 jam, performa 60–120fps, dan waktu pengerjaan tetap diganti dengan penjelasan sesuai scope.
- Tautan sosial di halaman kontak mengambil profil dari Settings.

## Pengelolaan konten

Konten layanan, proses, dan FAQ: utils/portfolio-content.ts. Halaman dan komponen tetap Nuxt 3 SSR; belum menambah tabel atau CMS baru. Gunakan facts dari karya, hindari menambahkan metrik hasil atau pengalaman klien tanpa bukti.

## Rilis production — selesai

- Domain saat rilis konten: https://rumah-design.vercel.app; sekarang dialihkan ke https://hygionedarriyan.vercel.app. Lihat [migrasi domain](DOMAIN_MIGRATION.md).
- Vercel project: rumah-design; deployment: dpl_FhEVMbCNkf8ankJQZCVqEu2uD7xR.
- Build remote berhasil, staging diuji dengan bypass resmi Vercel, lalu deployment dipromosikan ke domain utama.
- Supabase project: qnmbrsnlcfioradnsavw. Migration 202609110005_hygione_darriyan_branding.sql dan 202608230004_launch_hardening.sql diterapkan terpisah setelah pemeriksaan data dan penyiapan rollback. Tidak ada data atau file yang dihapus.
- Riwayat supabase_migrations.schema_migrations belum tersedia pada preflight. SQL spesifik dijalankan lewat CLI db query/Management API dan diverifikasi langsung; ini bukan klaim bahwa seluruh riwayat migration sudah tersinkronisasi. Jangan replay migration lama atau reset database.
- Hasil database: nama Hygione Darriyan, email paroarro07@gmail.com, indexing aktif, lima constraint pengamanan aktif, sembilan project published, helper validasi tersedia.
- Gambar publik merespons HTTP 200; listing Storage anonim mengembalikan nol objek. Bucket tetap publik untuk penyajian gambar.

## Verifikasi

- Typecheck, build lokal/remote, dan regression test SEO lulus.
- HTTP smoke test lulus pada lokal, staging, dan domain production: delapan halaman publik, metadata unik, satu canonical, JSON-LD valid, sembilan project dalam sitemap, project/service tidak ditemukan 404, serta admin noindex.
- Browser QA delapan halaman pada lebar 1440, 390, dan 320 piksel lulus; navigasi client dan FAQ tanpa JavaScript bekerja, tanpa pageerror atau overflow horizontal setelah layout stabil.
- Screenshot viewport layanan mobile dan detail layanan desktop pada domain production ditinjau visual.
- Lighthouse SEO belum menghasilkan skor: CLI gagal meluncurkan Chrome (spawn UNKNOWN; runtime npx juga melaporkan ketidakcocokan versi Node). Tidak ada klaim skor Lighthouse/performance >90.

## Tindak lanjut Search Console

Pengiriman sitemap dan URL Inspection belum dilakukan karena akses browser Search Console tidak tersedia. Submit https://hygionedarriyan.vercel.app/sitemap.xml, lalu periksa homepage, halaman layanan, dan karya prioritas. Status indeks/ranking hanya dapat dipastikan melalui Google; deploy dan metadata yang valid tidak menjamin kemunculan seketika.

Referensi Google: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
