# Audit branding, frontend/backend, dan SEO
Tanggal: 11 September 2026

## Status rilis terbaru

Branding, perluasan konten, dan perbaikan SEO sudah live pada domain utama. Migration branding 005 dan hardening 004 sudah diterapkan serta diverifikasi. Detail hasil, batasan, dan identitas deployment ada di [catatan rilis](CONTENT_RELEASE.md). Temuan di bawah merekam kondisi sebelum perubahan.

## Kondisi sebelum perubahan

Nuxt 3 SSR, Supabase Postgres/Auth/Storage, dan deployment Vercel sudah berjalan. API publik memfilter status published; middleware memverifikasi public.is_admin(); migration membatasi akses tulis ke public.admin_users, menerapkan validasi publish, dan membatasi folder Storage. Markdown sudah disanitasi. Pemeriksaan ini berbasis kode; pengujian akun admin/non-admin dan perubahan database production belum dilakukan.

Deployment yang diperiksa: https://rumah-design.vercel.app. Terdapat 9 project published. Homepage, robots.txt, dan sitemap.xml mengembalikan HTTP 200. Canonical beranda sudah menuju domain deployment tersebut. Jadi penyebab masalah SEO bukan robots atau sitemap yang sepenuhnya tidak bekerja.

Temuan terverifikasi:
- URL project yang tidak ada mengembalikan HTTP 200, judul generik, dan header indexable. Ini berpotensi menjadi soft 404. Error API tidak diteruskan menjadi status halaman.
- Metadata beranda di-hardcode dan mengabaikan default title/description di Settings.
- SEO Center menampilkan “Robots OK”, “Publik terindeks”, dan checklist pass statis tanpa mengecek Search Console maupun respons production.
- Branding tersebar di konfigurasi, UI publik/admin, metadata, logo, favicon, gambar share, dan nilai default database.
- Identitas masih berupa studio generik; belum ada graph Person/WebSite yang konsisten menghubungkan pemilik dan karya.
- JSON-LD project menggunakan JSON.stringify langsung untuk konten admin di elemen script; perlu escaping markup.
- Nomor WhatsApp contoh dan tautan homepage platform sosial belum mewakili kontak pemilik.
- Loader lokal menutup halaman SSR dan menunggu minimal tiga detik. Berkas React TSX dan Vue memakai nama auto-import yang sama dan memicu error TypeScript.
- Guard deployment hanya memperingatkan konfigurasi kosong/URL buruk; production masih dapat dibangun dengan konfigurasi yang salah.
- PLAN belum mencatat bahwa target minimal 3–5 project sudah tercapai.

Belum dapat dipastikan tanpa akses Search Console: URL mana yang benar-benar terindeks, canonical pilihan Google, impressions, clicks, query aktual, crawl history, dan penyebab exclusion. Audit kode/HTTP tidak membuktikan ranking tertentu.

## Perubahan yang diterapkan

- Identitas personal Hygione Darriyan; UI/UX designer, designer, frontend dan fullstack developer. Email: paroarro07@gmail.com.
- Hero, profil, kontak, footer, admin, logo HD, favicon, dan gambar Open Graph PNG/SVG konsisten.
- Homepage memakai metadata Settings; konten semantik memperjelas cakupan karya, kategori dan proses.
- Person + WebSite, CollectionPage berisi project published, ProfilePage, CreativeWork berpenulis, serta BreadcrumbList.
- JSON-LD di-escape; project tidak ditemukan menghasilkan 404, gangguan data menghasilkan 503; homepage mengirim 503 saat fetch katalog gagal pada SSR.
- Canonical dan OG URL konsisten; route project diremount saat slug berubah; navigasi berikutnya tidak menunjuk diri sendiri bila hanya ada satu karya.
- Sitemap tetap published-only dan menambahkan thumbnail sebagai image sitemap.
- Cuplikan deskripsi membersihkan markdown; preview SERP memakai judul kustom tanpa menggandakan suffix brand.
- Editor memberi panduan topik pendukung yang relevan. SEO Center tidak lagi mengklaim status indeks dari skor internal.
- Kontak WhatsApp disembunyikan sampai NUXT_PUBLIC_WHATSAPP_NUMBER diisi. Tautan sosial generik tidak ditampilkan sebagai profil pemilik.
- Referensi React disimpan dengan JSX source yang benar; hanya Vue di-auto-import oleh Nuxt. Loader tetap tersedia saat navigasi, tanpa menutup konten SSR awal atau menunggu satu siklus penuh.
- Guard production menolak konfigurasi wajib yang kosong, URL non-HTTPS/localhost, site URL berpath/query/kredensial, serta secret/service-role key.
- Migration baru 202609110005_hygione_darriyan_branding.sql memperbarui branding dan kontak. Preferensi indexing, custom URL, dan konten kustom dipertahankan; migration lama tidak diedit. Adapter settings menjaga kompatibilitas selama rollout.

## Strategi kata kunci dan konten

Tidak menambah tag meta keywords sebagai strategi ranking: Google mengabaikannya. Kata kunci menjadi topik dalam teks yang terlihat, judul, deskripsi, case study, tautan internal, kategori, serta teknologi yang benar-benar digunakan. Structured data membantu menjelaskan entitas, bukan jaminan posisi pencarian.

| Halaman | Topik utama | Topik pendukung yang relevan |
|---|---|---|
| Beranda | Hygione Darriyan, portofolio UI/UX designer, fullstack developer | desain visual, frontend development, case study, design system, aplikasi web |
| Tentang | profil UI/UX designer dan developer | user flow, wireframe, Figma, prototyping, aksesibilitas, responsive web design |
| Kontak | kolaborasi desain dan pengembangan web | landing page, design system, frontend, integrasi API, fullstack |
| Project | nama karya + fungsi/jenis produk | masalah pengguna, peran, keputusan desain, stack, tantangan implementasi, hasil |

Peluang konten per project berikut diturunkan dari judul, kategori, dan tech stack publik. Gunakan hanya bila didukung pekerjaan sebenarnya; jangan mengarang hasil, metrik, atau proses riset.

| Project | Perkiraan kata saat audit | Arah topik pendukung |
|---|---:|---|
| Zetta Street | 96 | desain fashion/streetwear, hierarki visual, interaksi React, responsive layout |
| Granger Sportainment Platform | 236 | UI platform olahraga, navigasi, React/TypeScript, motion |
| EcoShire — Modern Hobbit Retreat | 246 | desain hospitality, visual storytelling, landing page responsif |
| HyBloggyon | 272 | desain blog editorial, MDX, tipografi, navigasi konten |
| Pundi — Financial Dashboard | 352 | UI dashboard keuangan, visualisasi data, Next.js |
| ArroBuild | 352 | aplikasi AI, fullstack, Supabase/PostgreSQL, integrasi model AI |
| Smart Presence Platform | 355 | aplikasi presensi, autentikasi, dashboard, Prisma/PostgreSQL |
| pianAxis — Creative Disruptor | 514 | creative development, WebGL/GLSL, interaksi audio, React |
| Warrior Quest Log | 518 | gamifikasi produktivitas, dashboard, Express/Prisma, PWA |

Jumlah kata bukan target ranking. Prioritaskan kejelasan dan bukti: masalah → peran → proses → keputusan → hasil → keterbatasan. Jangan memaksakan semua topik ke setiap project.

## Tindak lanjut setelah rilis

1. Di Google Search Console, periksa URL Inspection, Page Indexing dan canonical; kirim sitemap.xml serta minta indeks ulang halaman utama dan karya prioritas. Akses ini belum tersedia pada sesi rilis.
2. Isi tautan profil pribadi yang benar pada Settings ketika tersedia.
3. Jika beralih domain, aktifkan HTTPS dan redirect permanen domain lama ke path yang sama. Selaraskan canonical, sitemap, properti Search Console dan tautan profil.
4. Lengkapi case study berdasarkan fakta: peran, proses, keputusan, hasil, dan keterbatasan. SEO deployment eksternal masing-masing karya memerlukan audit terpisah.

## Verifikasi dan batasan

Hasil akhir:
- npm run typecheck: lulus (Node 24.19.0).
- npm run build: lulus, preset Nitro node-server untuk pengujian lokal.
- npm run check:deploy: lulus terhadap konfigurasi lokal yang tersedia; environment Vercel Dashboard belum diaudit langsung.
- npm run test:seo: lulus (escaping JSON-LD, legacy settings, preferensi noindex, metadata kustom, markdown, guard production).
- npm run test:seo:http: lulus terhadap build production lokal. Beranda/profil/kontak 200, satu canonical per halaman, JSON-LD valid, project hilang 404/noindex, dua detail project teruji SSR, sembilan project ada dalam sitemap, admin login noindex.
- Browser Chromium: desktop 1440×1000 dan mobile 390×844, tidak ada overflow horizontal, konten awal tidak tertutup loader, navigasi profil dan pergantian judul/canonical antarproject berhasil, tidak ada pageerror.
- Gambar Open Graph ditinjau visual; git diff --check lulus.

Screenshot lokal: ../.codex-staging/hygione-desktop.png dan ../.codex-staging/hygione-mobile.png. Deployment dan perubahan database production kemudian diselesaikan; lihat catatan rilis terbaru.

Masih ada warning ukuran chunk JavaScript pada build (bundle utama di atas 500 kB sebelum gzip). Lighthouse production >90 belum terverifikasi; tidak ada klaim skor atau ranking. Audit login end-to-end admin/non-admin dan pengiriman sitemap ke Search Console belum dilakukan. Eksekusi SQL production serta pemeriksaan constraint dan akses Storage anonim sudah selesai.

## Referensi

- Google: meta keywords tidak digunakan untuk indexing/ranking — https://developers.google.com/search/docs/crawling-indexing/special-tags
- Google: JavaScript SEO, SSR, meta robots dan canonical — https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google: penanganan error dan soft 404 — https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript
- Google: konsolidasi canonical dan redirect — https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

