# Design Doc — Hygione Darriyan

## Pembaruan scope — 11 September 2026

Brand resmi: **Hygione Darriyan**. Platform desain dan portofolio pribadi untuk UI/UX designer, designer, frontend developer, dan fullstack developer. Email kontak: **paroarro07@gmail.com**. Domain utama: https://hygionedarriyan.vercel.app. Domain lama https://rumah-design.vercel.app diarahkan permanen ke path yang sama pada domain baru. Nuxt 3 SSR, Supabase, Vercel, project link-based, serta otorisasi admin tetap menjadi batas arsitektur.

SEO mencakup konten semantik yang relevan, identitas Person, CollectionPage/ProfilePage, CreativeWork dan breadcrumb, canonical, metadata dinamis, sitemap project published, serta respons HTTP yang benar. Kata kunci pendukung berasal dari proses, kategori, dan teknologi yang benar-benar digunakan.

## 1. Prinsip Desain
- Karena pemilik adalah product designer, tampilan Hygione Darriyan sendiri adalah bagian dari portofolio → visual craft harus kuat.
- Minimalis, fokus ke konten (screenshot & case study), bukan dekorasi berlebihan.
- Grid-based, konsisten dengan prinsip desain modern (whitespace, tipografi jelas).

## 2. Referensi Visual
Referensi utama: **Awwwards** dan **Onepagelove** — showcase site yang visual-first, di mana preview besar jadi elemen utama dan teks minim di permukaan. Bedanya, Hygione Darriyan adalah kurasi personal (hanya karya sendiri), bukan crowd-sourced, jadi beberapa elemen disesuaikan:

| Elemen | Di Awwwards/Onepagelove | Di Hygione Darriyan |
|---|---|---|
| Kurasi | Submission dari banyak desainer, di-review tim | Hanya project pribadi, tidak perlu proses review |
| Rating/voting | Ada skor & vote publik | Tidak perlu — bukan kompetisi |
| Card preview | Screenshot besar, hover reveal scroll/animasi | Sama: screenshot besar + hover preview (opsional GIF/video singkat) |
| Tag/filter | Kategori + style (Minimal, Dark, Bold, dll) | Sama: kategori (jenis) + style tag (gaya visual) |
| Detail page | Full-bleed hero + info "Built with", "Awards" | Full-bleed hero + info tech stack + case study (slot "Awards" diganti cerita proses) |

## 3. Peta Halaman (Sitemap)
- `/` — Homepage: hero/bio singkat + grid project visual-first (dengan filter kategori & style)
- `/project/[slug]` — Detail project: full-bleed hero, case study, link live demo, link repo, tech stack, tag terkait
- `/about` (opsional) — bio lebih lengkap, CV, kontak
- `/admin` — login
- `/admin/projects` — list + CRUD project
- `/admin/projects/new` — form tambah project
- `/admin/projects/[id]/edit` — form edit project

## 4. Komponen Utama
- `ProjectCard` — thumbnail dominan (rasio besar), hover state menampilkan preview scroll/GIF singkat (fallback: static screenshot kalau belum ada preview media), judul & tag muncul saat hover/di bawah card
- `ProjectFilter` — filter ganda: kategori (chip) & style tag (chip terpisah), mirip filter di Awwwards
- `ProjectDetailHero` — full-bleed screenshot besar + CTA "Lihat Live Demo"
- `CaseStudyBlock` — render markdown/rich text deskripsi proses (pengganti slot "Awards" di Awwwards)
- `TechStackBadge` — badge kecil menampilkan tools/framework yang dipakai di detail page (mirip info "Built with" di Awwwards)
- `AdminProjectForm` — form input semua field project + upload thumbnail & preview media
- `AdminProjectTable` — list project dengan aksi edit/hapus

## 5. Model Konten per Project
| Field | Tipe | Keterangan |
|---|---|---|
| title | text | Judul project |
| slug | text | URL-friendly, unik |
| description | markdown | Case study: problem → proses → solusi → hasil |
| live_url | text | Link ke deployment Vercel/Netlify |
| repo_url | text (opsional) | Link ke repo publik |
| category | enum | landing-page / web-app / dashboard / portfolio / e-commerce / blog-editorial / saas / ai-tool / mobile-app / game-interactive / productivity / experimental / lainnya |
| style_tags | array | mis. ["Minimal", "Dark", "Bold", "Experimental"] — gaya visual, mirip tag style di Awwwards/Onepagelove |
| tech_stack | array | mis. ["Nuxt", "Tailwind", "Supabase"] |
| thumbnail_url | text | Screenshot statis, wajib |
| preview_media_url | text (opsional) | GIF/video singkat untuk hover preview (opsional, v2) |
| status | enum | draft / published |
| created_at | timestamp | |

## 6. Wireframe Level Konsep (deskripsi tekstual)
- **Homepage**: header minimal (nama + short bio + social links) → dua baris filter chip (kategori & style) di atas grid → grid 3 kolom (desktop) / 1 kolom (mobile), tiap card didominasi visual besar, hover menampilkan preview scroll/GIF.
- **Detail project**: full-bleed hero screenshot (mengisi lebar layar) → judul & tag (kategori + style) → tombol "Lihat Live Demo" (primary) & "Lihat Repo" (secondary, kalau ada) → tech stack badges → case study dalam format rich text/markdown di bagian bawah.
- **Admin**: dashboard responsif dengan navigasi Projects, SEO Center, Media Library, Settings, dan Logout. Form project dibagi menjadi tab Content, Media, dan SEO; status draft/published serta kualitas konten harus terlihat jelas sebelum submit.

## 7. Visual Direction
Karena kamu designer, arahan visual detail (warna, tipografi, spacing scale) sebaiknya ditentukan di Figma/desain kamu sendiri lebih dulu. Yang jadi acuan dari dokumen ini: **visual harus mendominasi, teks seminimal mungkin di permukaan** — sama seperti prinsip Awwwards/Onepagelove.

## Perluasan konten yang disetujui — 11 September 2026

Tambahkan /layanan, tiga halaman fokus /layanan/ui-ux-design, /layanan/frontend-development, /layanan/fullstack-development, dan /proses. Konten disimpan sebagai TypeScript terstruktur, dirender SSR, memiliki metadata unik dan sitemap. Referensi karya hanya berasal dari API published. Beranda mendapat section layanan, pendekatan kerja, dan FAQ yang dapat dibaca tanpa JavaScript. Hindari klaim ranking, metrik hasil, biaya, dan jadwal yang belum disepakati.

## Sistem identitas personal — 12 September 2026

Gunakan palet Midnight Indigo: `#0b1020` untuk latar utama, `#151a2e` untuk panel gelap, `#7667f5` untuk aksen utama, `#5146c8` untuk teks aksen di permukaan terang, `#34d4c7` untuk detail sekunder, dan `#f5f2ea` untuk warm paper. Logo memakai monogram HD dengan H berwarna paper, D violet, dan titik cyan. Wordmark memakai Hygione Darriyan; nama lengkap tetap tampil jelas pada homepage dan halaman profil.

Palet Midnight Indigo tetap dipakai untuk panel admin ("studio" theme, gelap). Tidak diubah oleh pembaruan di bawah.

## Sistem monokrom terang — homepage publik — 30 September 2026

Homepage publik (`pages/index.vue`) memakai design system baru yang terpisah dari admin: latar terang monokrom, bukan Midnight Indigo. Token warna baru (prefix `mono`, didefinisikan di `assets/css/tailwind.css`): `--color-mono-bg` (#fbfaf8, latar utama), `--color-mono-surface` (#ffffff), `--color-mono-ink` (#161513, teks utama), `--color-mono-mute` (#726f6a, teks sekunder), `--color-mono-line` / `--color-mono-line-strong` (garis tipis semi-transparan). Tidak ada warna aksen berwarna — seluruh permukaan grayscale/hitam-putih, foto profil juga hitam-putih agar konsisten.

Tipografi (revisi 30 September 2026): nama besar di hero memakai `--font-display` (Clash Display, bold 700) untuk kesan tegas; teks lain (salam, CTA, tooltip nav) memakai `--font-sans` (IBM Plex Sans, lebih ringan). Plus Jakarta Sans tidak lagi dipakai.

Copywriting hero memakai Bahasa Inggris: salam "Hi, I'm" + nama lengkap. CTA pojok kanan atas tetap "Contact" (mailto, dari `site_settings.general.contact_email`).

Navigasi (revisi 30 September 2026): dock vertikal fixed di pojok kiri atas (`components/BrandDockNav.vue`, membungkus `components/ui/FloatingDock.vue` dengan `orientation="vertical"` dan `theme="dark"`), meniru interaksi magnify-on-hover + tooltip dari komponen referensi Aceternity FloatingDock. Ikon memakai `lucide-vue-next` (Home, GitHub, LinkedIn, Instagram, Mail/Contact) — bukan teks. Di mobile, dock kolaps jadi tombol hamburger yang membuka flyout ke bawah.

Prinsip: clean, minimalis, elegan klasik — tanpa dekorasi berlebihan, kontras tinggi hitam-di-atas-putih (dock nav sengaja gelap sebagai aksen monokrom), whitespace generous.

## Sistem visual editorial-playful — situs publik — 1 Oktober 2026

Menggantikan sistem monokrom 30 September untuk seluruh halaman publik (admin tetap memakai tema studio Midnight Indigo). Referensi pola: extrafazant.nl (lihat `docs/REFERENCE_EXTRAFAZANT.md`); yang diadopsi hanya pola dan teknik, bukan aset atau kode.

- **Token** di `assets/css/site.css`: paper `#f5f2ea` (latar), ink `#0b1020`, signal `#5146c8` (tombol, overlay transisi, menu mobile), violet `#7667f5`, cyan `#34d4c7`, pink `#ff6f91`, amber `#ffc24b` untuk bingkai kartu dan sticker. Sudut tajam (radius 0).
- **Tipografi**: Inter Tight (grotesk variabel, heading UPPERCASE, line-height 0.84) dipasangkan dengan Instrument Serif (`.alt`) di dalam satu judul; serif juga untuk kicker, link panah, dan kategori.
- **Ukuran fluid**: satu unit `--u` (≈16px @1440) dengan batas bawah rem agar zoom browser tetap memperbesar teks. Semua ukuran `calc(N * var(--u))`; nama class situs (`wrap`, `kicker`, `title-*`, `form-field`) sengaja tidak bentrok dengan utilitas Tailwind/legacy.
- **Komponen** (`components/site/`): Nav (pill tengah + tombol Hubungi, logo berganti warna di atas section `data-nav-theme="dark"`, menu mobile layar penuh), Footer (CTA besar + image trail), Button (label bergeser dengan easing spring), ArrowLink (serif + squiggle yang tergambar), FeaturedStack (tumpukan kartu 3D ter-pin), ServiceCards, WorkCard, Marquee, FaqList (`<details>`), CursorLabel, HeroCursorCard, ImageTrail, SpinBadge, TransitionOverlay.
- **Motion**: `plugins/motion.client.ts` (GSAP + SplitText/DrawSVG/ScrollTrigger/Inertia, ease global `0.625, 0.05, 0, 1`, Lenis hanya di rute publik) dan `composables/useSiteMotion.ts` (atribut `data-reveal`, `data-scroll-reveal`, `data-draw`). Transisi halaman: coretan SVG menutup layar lalu terhapus (`usePageTransition`). Konten tetap terlihat tanpa JS dan dengan `prefers-reduced-motion`; efek kursor hanya aktif di desktop dengan pointer presisi.
- **Halaman**: `/`, `/karya` (grid 3 kolom bertingkat + filter kategori/gaya/pencarian yang tersinkron ke URL), `/project/[slug]` (split sticky + case study), `/about`, `/layanan`, `/layanan/[slug]`, `/proses`, `/contact` (brief builder via mailto, tanpa penyimpanan data). Copy mengikuti `COPYWRITING.md`.

### Revisi logo & CTA — 1 Oktober 2026

- **Logo**: wordmark tanpa ikon (`components/site/Logo.vue`, aset di `public/brand/`); detail di `docs/PERSONAL_BRAND.md`.
- **CTA & hover — disamakan dengan referensi (revisi 1 Oktober 2026, sore)**. Perilaku, durasi, dan easing mengikuti analisis kode extrafazant.nl; bentuk garis coretan dan ikon panah dibuat sendiri.
  - `SiteButton` (`.btn` di `assets/css/site.css`): blok ikon + blok label berwarna sama dengan celah tipis. Hover: label meluncur ke kiri menutupi ikon (`translate -tinggi tombol`), miring −3°, squash 0.935×0.905 lalu memantul (`cubic-bezier(.34,2.27,.64,1)`), ikon kedua muncul di kanan atas (easing spring `linear()`, 0.75–0.8s).
  - `SiteContactButton` (nav "Hubungi"): pil putih dengan titik; hover membesar +12×6px, label berputar keluar/masuk (±75°), tiga titik warna mengorbit masuk berurutan (0.45s, `cubic-bezier(.32,.72,0,1)`).
  - `SiteArrowLink`: label serif + kotak panah 1em; panah turun keluar dan salinannya masuk dari atas (0.525s back-out). Garis coretan (`SiteDrawLine mode="always"`) selalu ada dan digambar ulang dengan bentuk baru tiap hover.
  - Link nav, menu mobile, dan footer: `SiteDrawLine mode="persist"` — coretan acak digambar saat hover (0.5s power2.inOut), dihapus saat keluar, menetap pada halaman aktif. Link footer opacity 0.6 → 1; tombol kembali-ke-atas terisi pink dari bawah.
  - Kursor marquee (`SiteCursorLabel`, `data-cursor="…"`): pil mekar dari titik (clip-path) dengan teks berjalan.
  - Kolase interaktif (`data-collage` di `useSiteMotion`): item yang di-hover membesar 1.075, tetangga terdorong, mengecil, dan miring acak. Dipakai pada kartu layanan dan kolase foto beranda.
