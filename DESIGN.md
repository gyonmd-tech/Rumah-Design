# Design Doc — Rumah Design

## 1. Prinsip Desain
- Karena pemilik adalah product designer, tampilan Rumah Design sendiri adalah bagian dari portofolio → visual craft harus kuat.
- Minimalis, fokus ke konten (screenshot & case study), bukan dekorasi berlebihan.
- Grid-based, konsisten dengan prinsip desain modern (whitespace, tipografi jelas).

## 2. Referensi Visual
Referensi utama: **Awwwards** dan **Onepagelove** — showcase site yang visual-first, di mana preview besar jadi elemen utama dan teks minim di permukaan. Bedanya, Rumah Design adalah kurasi personal (hanya karya sendiri), bukan crowd-sourced, jadi beberapa elemen disesuaikan:

| Elemen | Di Awwwards/Onepagelove | Di Rumah Design |
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
