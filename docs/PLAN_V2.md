# Rumah Design — Upgrade Roadmap
### PLAN.md v2 — Editorial Dark/Light + Motion Upgrade

Status: Selesai diimplementasikan
Terkait: DESIGN.md, MOTION.md
Cakupan: seluruh halaman — Home, Karya (index + detail), Tentang, Footer, Login, Admin

Setiap fase dirancang bisa dieksekusi dan direview terpisah — jangan lompat fase sebelum fase sebelumnya stabil di preview.

---

## Fase 0 — Fondasi
**Tujuan:** siapkan infrastruktur teknis sebelum menyentuh tampilan halaman mana pun.

- [x] Tambahkan design token dari DESIGN.md §2–3 ke sistem styling (CSS custom properties / Tailwind config, sesuaikan dengan setup Nuxt 3 yang ada)
- [x] Import font: General Sans, IBM Plex Sans, IBM Plex Mono (self-host atau lewat font provider — hindari FOUT signifikan karena Display dipakai di hero)
- [x] Install GSAP core, ScrollTrigger, SplitText, Flip, Lenis
- [x] Buat plugin `plugins/gsap.client.ts` + composable `useMotion()` sesuai MOTION.md §2
- [x] Setup deteksi `prefers-reduced-motion` di level root
- [x] Integrasikan logo image kamu ke komponen nav (ganti logo teks saat ini)

**Selesai kalau:** token warna/tipografi bisa dipakai di komponen mana pun, GSAP siap pakai tanpa console error, cleanup ScrollTrigger sudah teruji saat pindah route.

---

## Fase 1 — Hero (Home) + Shell Dark Mode
**Tujuan:** hero baru dengan mode gelap, tipografi ekstrem, dan reveal motion — ini fase paling terlihat dampaknya, cocok jadi checkpoint pertama untuk review visual.

- [x] Restrukturisasi hero: logo, badge status eyebrow, headline Display XL, paragraf intro, strip stat mono, scroll cue (DESIGN.md §6)
- [x] Implementasi split-text reveal on load (MOTION.md §5.1)
- [x] Nav hide-on-scroll (MOTION.md §5.2) — untuk sementara nav switch warna masih hardcode (belum terikat transisi, itu Fase 2)

**Selesai kalau:** hero terasa "hidup" saat pertama kali dibuka, headline besar tapi tetap terbaca di semua breakpoint, tidak ada layout shift saat font/animasi load.

---

## Fase 2 — Signature Transition (Dark → Light)
**Tujuan:** bangun zona transisi scroll-linked antara hero dan project grid — ini bagian paling teknis, kerjakan terpisah dari konten grid supaya gampang di-debug.

- [x] Bangun `.transition-zone` sesuai MOTION.md §4 dengan dummy content dulu (belum project grid asli)
- [x] Uji scroll dua arah (naik-turun) untuk memastikan transisi mulus dan reversible
- [x] Uji breakpoint mobile — pertimbangkan transisi dipersingkat (zona lebih pendek) karena viewport scroll mobile berbeda rasanya
- [x] Implementasi fallback `prefers-reduced-motion` (hard switch, bukan scrub) — jangan skip ini di fase awal, lebih mudah dites sekarang daripada ditambal belakangan

**Selesai kalau:** scroll dari hero ke bawah terasa seperti satu gerakan kontinu, bukan dua section terpisah yang kebetulan ditumpuk.

---

## Fase 3 — Project Grid (Light Mode)
**Tujuan:** perbaiki masalah utama yang kamu sebut — gambar kepotong dan card kebesaran.

- [x] Standarkan rasio thumbnail 16:10 untuk semua project, tentukan focal-point crop per gambar (bukan default top-left)
- [x] Redesain card: nomor index raksasa, judul Display M, tag mono (DESIGN.md §6)
- [x] Implementasi stagger-on-enter (MOTION.md §5.3)
- [x] Implementasi filter FLIP transition (MOTION.md §5.4) — sticky filter bar saat scroll
- [x] Hover state card (MOTION.md §5.5)
- [x] Sambungkan grid asli ke zona transisi dari Fase 2 (ganti dummy content)

**Selesai kalau:** card project terasa proporsional (tidak dominan gambar mentah), filter terasa responsif tanpa "loncat" layout.

---

## Fase 4 — Halaman Karya Detail
**Tujuan:** bangun halaman yang belum ada — ini yang bikin tombol "BUKA PROJECT" punya tujuan jelas.

- [x] Layout: hero project ringkas (dark singkat → fade ke light, bukan full signature transition), section Problem → Approach → Result, galeri visual, CTA next project
- [x] Implementasi galeri horizontal scroll pinned (MOTION.md §5.7) — batasi ketat ke section galeri saja
- [x] Page transition Home ↔ Karya detail (MOTION.md §5.8)
- [x] Konten: tulis singkat problem/approach/result per project yang sudah ada (Pundi, ArroBuild, HyBloggyon, Smart Presence)

**Selesai kalau:** klik "BUKA PROJECT" terasa seperti masuk ke halaman utuh, bukan cuma modal atau link keluar mentah.

---

## Fase 5 — Halaman Tentang
**Tujuan:** isi halaman yang sekarang cuma nav link tanpa konten terlihat.

- [x] Konten: intro personal, filosofi kerja (tarik dari tagline), proses kerja 3-4 tahap, stack/tools
- [x] Mode: light penuh sesuai DESIGN.md §7 (tidak perlu dark hero — halaman ini personal, bukan showcase)
- [x] Motion: split-text reveal ringan di hero halaman ini saja, sisanya stagger sederhana

**Selesai kalau:** halaman ini terasa personal dan memberi konteks siapa di balik project-project itu — bukan sekadar halaman kosong berjudul "Tentang".

---

## Fase 6 — Footer
**Tujuan:** hilangkan "dead end" — footer sekarang cuma lokasi + copyright.

- [x] Redesain footer sesuai DESIGN.md §6: nuansa ink gelap tipis, sitemap mini, kontak, CTA ulang, back-to-top
- [x] Implementasi footer reveal + split-text echo dari hero (MOTION.md §5.6)
- [x] Integrasi form kontak ringan (Formspree, sesuai preferensi tanpa backend tambahan) — kalau memang mau ada form, bukan cuma mailto link

**Selesai kalau:** dari halaman mana pun, user selalu punya jalan lanjutan (ke halaman lain atau kontak) di footer.

---

## Fase 7 — Halaman Utility: Login & Admin
**Tujuan:** terapkan identitas visual (warna, tipografi, logo) TANPA motion naratif — dua bahasa desain, satu identitas.

- [x] Login: card center minimal, logo, form Supabase auth, fade-in standar saja (MOTION.md §5.9)
- [x] Admin: sidebar nav + dashboard CRUD project + doc manager markdown — layout data-dense, light mode saja, transisi cepat antar state
- [x] Pastikan warna dan font tetap dari token yang sama (DESIGN.md §2–3) — jangan re-invent palet baru untuk area admin

**Selesai kalau:** login dan admin terasa cepat dipakai sehari-hari, tetap terasa "Rumah Design" tapi tidak ada satu pun ScrollTrigger di sini.

---

## Fase 8 — QA & Polish
**Tujuan:** pastikan upgrade ini tidak mengorbankan performa dan aksesibilitas demi visual.

- [x] Audit `prefers-reduced-motion` di semua halaman public (bukan cuma signature transition)
- [x] Audit keyboard focus state di semua interactive element (nav, filter, card, form)
- [x] Ukur performa: CLS, INP, waktu load font — terutama halaman Home yang paling berat motion-nya
- [x] Cross-check responsif: Display XL di mobile kecil (skala terkecil clamp), galeri horizontal di touch device
- [x] Review akhir: bandingkan tiap halaman dengan DESIGN.md — cek ada bagian yang "keluar jalur" dari sistem token atau tidak

**Selesai kalau:** semua fase sebelumnya lolos, tidak ada regresi performa/aksesibilitas dari kondisi sebelum upgrade.

---

## Urutan Rekomendasi Eksekusi

```
Fase 0 → Fase 1 → Fase 2 → Fase 3   (Home selesai, checkpoint review besar di sini)
                                 ↓
Fase 4 → Fase 5 → Fase 6          (halaman public lain + footer)
                                 ↓
Fase 7                            (utility — bisa dikerjakan paralel oleh siapa pun karena tidak bergantung motion Home)
                                 ↓
Fase 8                            (QA menyeluruh)
```

Fase 7 (Login/Admin) sengaja tidak bergantung pada fase motion lain — bisa dikerjakan kapan saja setelah Fase 0 selesai, kalau kamu mau paralelkan pengerjaan.
