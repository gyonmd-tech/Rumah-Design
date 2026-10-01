# Analisis Referensi Visual — extrafazant.nl

> Diambil 1 Oktober 2026 dari https://www.extrafazant.nl/ (desktop 1440×900 dan mobile 375×812).
> Dokumen ini untuk **referensi dan inspirasi** saja. Aset (foto, video, logo, sticker, font berlisensi) dan kode milik Extrafazant tidak boleh disalin ke Rumah Design. Yang bisa diadopsi adalah *pola*, *sistem*, dan *teknik*.

---

## 1. Ringkasan

Extrafazant adalah studio konten sosial, video, dan animasi dari Tilburg, NL. Situsnya bergaya **editorial-playful**: tipografi grotesk tebal huruf besar yang dipasangkan dengan serif terkompresi, latar off-white, satu warna aksen biru elektrik, dan elemen "sticker" warna-warni. Desainnya terasa mahal karena motion yang konsisten (satu kurva easing global, text reveal per baris, transisi halaman berupa garis SVG).

| Aspek | Temuan |
|---|---|
| Platform | Webflow (CMS + Interactions dimatikan, logic di custom JS) |
| Animasi | GSAP 3.15 + CustomEase, SplitText, DrawSVG, ScrollTrigger, Inertia, Observer |
| Smooth scroll | Lenis 1.3.17 (`lerp: 0.165`, `wheelMultiplier: 1.25`), disinkronkan ke `gsap.ticker` |
| Page transition | Barba.js 2.10 (`sync: true`) |
| Video | Bunny Stream (HLS via hls.js 1.6), lazy, autoplay muted, poster placeholder |
| Custom JS | Satu bundle (`cdn.odyn.dev/.../bundle.js`, ±60 KB) berisi ±25 modul yang diaktifkan lewat atribut `data-*` |
| Cookie/tooltip | Reform Digital `cookie-flow`, `tooltip-x`, `script-embed` |
| Form anti-spam | Cloudflare Turnstile |
| Tracking | GTM, GA4, Google Ads, Meta Pixel |
| Bahasa | `nl-NL` |

---

## 2. Sitemap & struktur halaman

```
/                    Home
/over                Tentang + tim
/werk                Grid portofolio (CMS, ±30 case)
/werk/{slug}         Detail case (contoh: /werk/odido)
/wat-we-doen         Layanan (Animatie / Video / Social)
/contact             Kontak (CTA telepon + email)
/faq, /privacyverklaring, /algemene-voorwaarden
```

Semua halaman memakai shell yang sama: `div.page-wrapper` → `main.main-wrapper[data-barba=container]` → `nav` fixed → section → `footer.theme-dark`. Ada overlay global: `.transition` (SVG path untuk transisi halaman), `.cursor-marquee` (label yang mengikuti kursor), dan banner cookie.

### 2.1 Home (tinggi dokumen ±9.450px @1440)

| # | Section | Tinggi | Isi & perilaku |
|---|---|---|---|
| 1 | `header.section_hero` | 100vh | Eyebrow serif 2 baris ("Social content, video's & animatie"), H1 `BRENGT JE MERK / IN BEWEGING`: kata grotesk Bold + kata serif terkompresi (Serrif) dalam satu baris. Link "Ontdek meer" (serif) + ikon panah dalam kotak biru, di bawahnya garis squiggle biru yang di-*draw*. Di bawah fold: strip logo klien (Fontys, Cordaid, Janzen, Jumbo, dll.) berwarna biru. **Cursor cards**: kartu media mengikuti kursor dengan inersia dan rotasi. |
| 2 | `section_intro` | ±765 | Dua kolom. Kiri: kolase 2 foto ala polaroid (border putih tebal, sedikit miring) + sticker "EF Run Club" pink. Kanan: eyebrow serif "Wie wij zijn", H2 `DE CREATIVES VAN / EXTRAFAZANT` (grotesk + serif), paragraf pendek, tombol biru "MEER OVER ONS". |
| 3 | `section_featured.theme-dark` | ±3.060 (pinned) | Latar #101010. Judul `RECENT WERK`. **Featured stack 3D**: kartu-kartu case (720×411) ditumpuk dengan kedalaman Z, tiap kartu punya bingkai warna berbeda (kuning, biru, merah, …). Saat scroll, kartu depan jatuh ke bawah dan fade, kartu berikutnya maju. Badge bulat "THIS IS HOW WE SCROLL" berputar 180° selama scroll. Kartu miring mengikuti mouse (tilt X 6°, Y 10°). Tombol pink "BEKIJK ONS WERK". Nav otomatis berubah ke mode terang. |
| 4 | `section_services` | ±918 | `WAT WE DOEN`. Tiga kartu poster berbingkai warna (biru/pink/oranye), sedikit miring bergantian, judul `ANIMATIE`/`VIDEO`/`SOCIAL` + sub-caption serif. CTA "Ontdek meer". |
| 5 | `section_team` | ±2.740 | `ABCDEF-TEAM` (mencampur serif + grotesk dalam satu kata). Foto tim disusun **asimetris/scatter** dengan parallax per item. Nama ditulis dengan lettering "bubbly" di atas foto, plus sticker ("GEEN PRAATJES. WEL PLAATJES.", "ABCDEF"). |
| 6 | `footer.theme-dark` | ±1.060 | CTA besar `OOK IETS IN / BEWEGING BRENGEN?`, sub-copy, tombol pink "VOORUIT MET JE VERHAAL". **Image trail** saat mouse bergerak. Lalu wordmark script besar, 3 kolom (Navigatie / Contact / Socials), tombol "scroll to top", baris legal + "© Design by Dylan". |

### 2.2 Halaman lain

- **/werk**: satu `header.section_work` panjang berisi `[data-work-grid]` — grid 3 kolom (±409px tiap kolom @1440) dengan kolom tengah di-*offset* (efek masonry/stagger). Item: media (video muncul saat hover) → judul klien UPPERCASE grotesk → kategori serif ("Social Content & Animatie"). Ada cursor cards.
- **/werk/{slug}**: `section_case-steps` → layout **split 50/50 sticky**. Kiri off-white berisi teks (judul fit-to-width `HOE WE DAT DEDEN?`), kanan panel warna brand case (Odido = biru) berisi video portrait yang berganti per step. Lalu `section_case-end` (video player Bunny dengan kontrol), `section_more-work` (marquee "MEER WERK" + video on hover), footer.
- **/wat-we-doen**: hero dengan **orbit stickers** (sticker beterbangan mengorbit, bisa di-drag, pakai Observer). `section_text` berupa manifesto serif besar dengan scroll reveal. `section_services-steps` (±3.060px): sticky steps per layanan, split teks kiri dan panel warna penuh di kanan (biru animasi, pink video, …) berisi video Bunny.
- **/over**: hero dengan image trail + text reveal, lalu tim versi lengkap (`section_team.is-about`) dengan role "FOUNDER / CREATIVE DIRECTOR" + tagline, dan momentum hover (foto terlempar sesuai kecepatan kursor, pakai Inertia).
- **/contact**: satu layar dengan sticker "JIJ BENT AAN DE BIRD", headline footer yang sama, dua tombol (pink "BEL ONS", biru "MAIL ONS"), lalu footer versi pendek.

---

## 3. Design tokens

### 3.1 Warna

| Token | Hex | Pemakaian |
|---|---|---|
| `swatch--off-white` | `#F4F4F4` | Background default (`--_theme---background`) |
| `swatch--black` | `#101010` | Teks, heading, border, section dark |
| `swatch--blue` | `#0038FF` | Aksen utama: logo, tombol, menu mobile, selection, link |
| `swatch--pink` | `#FF77CD` | Tombol sekunder dan sticker |
| `swatch--orange` | `#FF5F04` | Kartu dan sticker |
| `swatch--white` | `#FFFFFF` | Teks tombol, bingkai kartu |
| Lainnya (dari konten) | `#FEE897` (kuning bingkai featured), `#DCE1F5` (latar cursor-marquee) | — |

Theme mapping: `button-bg = blue`, `button-text = white`, `cursor-select-bg = blue`. Section dark membalik warna lewat class `.theme-dark` + `data-nav-theme="dark"`.

### 3.2 Tipografi

| Peran | Font | Catatan |
|---|---|---|
| Heading + body | **Helvetica Now Variable** (wght 50–1000) | Grotesk; heading UPPERCASE, Bold/Medium |
| Alt heading/aksen | **Serrif Compressed VF** (wght 100–900) | Serif terkompresi, dipakai untuk kata kontras dalam headline, eyebrow, link, dan sub-caption |
| Fallback | Arial | Inter dimuat via WebFont, tapi tidak dominan |

**Pola kunci**: satu headline mencampur dua keluarga font, misalnya **BRENGT JE MERK IN** (grotesk bold) + *BEWEGING* (serif kompres, uppercase). Ini signature visualnya.

Skala heading (nilai em relatif terhadap `--size-font`; px dihitung @1920 ideal):

| Class | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| `heading-xxl` | 12em (192px) | 700 | 0.8 | −0.02em |
| `heading-xl` | 8em (128px) | 500/700 | 0.8 | −0.02em |
| `heading-l` | 6em (96px) | 500 | 0.8 | −0.02em |
| `heading-m` | 5em (80px) | 700 | 0.8 | −0.02em |
| `heading-s` | 4em (64px) | 700 | 0.9 | −0.02em |
| `heading-xs` | 2.5em (40px) | 700 | 0.9 | −0.02em |
| `heading-xxs` | 1.5em (24px) | 700 | 0.9 | −0.02em |

Paragraf: semuanya weight 500 dengan tracking negatif (−0.03 s/d −0.045em), line-height 1.3–1.4. Skala: xxs .625em, xs .75em, s .875em, regular 1em, m 1.25em, l 1.5em, xl 2.5em.

Line-height heading **0.8** (sangat rapat) + UPPERCASE + tracking −2% membuat blok judul terasa padat seperti poster.

### 3.3 Fluid scaling ("adaptive scaling")

Semua ukuran memakai `em`, lalu `font-size` body diskalakan dari lebar viewport:

```css
--size-unit: 16;
--size-container-ideal: 1920;            /* desktop: lebar artboard desain */
--size-container: clamp(992px, 100dvw, 3840px);
--size-font: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));
/* tablet ≤991: ideal 991 (768–991) | mobile L ≤767: ideal 767 (480–767) | mobile P ≤479: ideal 479 (320–479) */
/* ultrawide (aspect ≥ 11/5): container dibatasi 16:9 dari tinggi viewport */
```

Hasil terukur: body 12px @1440, H1 144px @1440; di mobile 375px body ≈12.5px dan H1 ≈50px. Dengan cara ini layout terlihat identik secara proporsional di semua lebar dalam satu breakpoint.

### 3.4 Layout & spacing

- Page padding global `2em`, grid gap `2em`.
- Section padding vertikal standar `section-padding-128px` (8em).
- Skala ukuran `--_sizes---size--{2..320}px` dalam em (kelipatan 8).
- Tinggi layar: `--vh` diset JS; token `near (80)`, `full (100)`, `over (120)`, `double (200)`, `xxl (250)`.
- Breakpoint: 991 / 767 / 479 (standar Webflow) + query `(hover: hover) and (pointer: fine)` untuk semua efek kursor.
- Sudut: **tajam (radius 0)** hampir di semua elemen, termasuk tombol dan kartu. Kesan graphic/print.
- Scrollbar disembunyikan secara global.

---

## 4. Komponen

### 4.1 Navigasi
- Desktop: logo script biru di kiri (120px). Di tengah ada **pill putih kecil** berisi `OVER · WERK · WAT WE DOEN` (UPPERCASE, ±10px, bold). Di kanan tombol `■ CONTACT` putih dengan titik biru. Fixed, tanpa background bar.
- `data-nav-theme`: ScrollTrigger mendeteksi section gelap di bawah nav, lalu mengganti warna logo/nav ke terang.
- Link aktif ditandai garis bawah squiggle (draw-line). Status aktif disinkronkan antar halaman Barba lewat `[data-barba-update]`.
- Mobile: logo + tombol hamburger kotak hitam 36px. Saat dibuka, overlay **biru penuh** (`#0038FF`) dengan link putih besar di tengah (OVER / WERK / WAT WE DOEN), ikon berubah jadi X (dua garis rotate ±45°, 0.4s).

### 4.2 Tombol
1. **button-052** (CTA utama, tinggi 3em): kotak ikon panah + label UPPERCASE, biru/pink. Saat hover, label bergeser sejauh 1 tinggi tombol ke kiri dengan rotate −3° dan squash-stretch (`scale .935/.905` → bounce `cubic-bezier(.34,2.27,.64,1)`), ikon default mengecil dan ikon hover membesar. Pakai easing `linear()` spring custom (overshoot ±1.14). Focus ring `box-shadow 0 0 0 .125em`.
2. **button-093** (nav "CONTACT"): putih, titik kecil 0.5em (pink/biru) di kiri label, padding `.75em 1em .75em .75em`.
3. **btn-link** ("Ontdek meer"): teks serif + kotak panah biru. Saat hover, panah bergulir ke bawah (`translateY(100%)`). Garis squiggle di bawahnya.

### 4.3 Kartu
- **Featured card**: bingkai warna solid ±16px, media full, judul klien besar putih UPPERCASE di bagian bawah di atas media.
- **Service card**: poster portrait berbingkai warna, rotasi ±3–5° bergantian, judul + caption serif di dalam bingkai.
- **Work grid item**: tanpa bingkai, media 4:5/16:9 bervariasi, judul + kategori di bawah, video play saat hover.
- **Foto polaroid/tim**: border putih tebal, sedikit miring, ditimpa sticker/lettering.

### 4.4 Elemen dekoratif
- **Stickers** (PNG/SVG): "ANTI MEUK!", "GEEN PRAATJES. WEL PLAATJES.", "VLIEGENSVLUG", "EF", maskot api, "ABCDEF". Memberi kepribadian dan dipakai berulang di banyak halaman.
- **Garis squiggle** di-draw dengan DrawSVG (`data-draw-line`, `-persist`, `-always`).
- **Badge berputar** "THIS IS HOW WE SCROLL".
- **Cursor marquee**: pill kecil (latar #DCE1F5, teks biru) yang mengikuti kursor dan menampilkan teks berjalan saat hover item tertentu.

---

## 5. Sistem motion (yang paling penting untuk ditiru)

### 5.1 Default global
```js
CustomEase.create("osmo", "0.625, 0.05, 0, 1");   // ease default semua tween
CustomEase.create("move", "0.3, 0.075, 0, 1");
gsap.defaults({ ease: "osmo", duration: 0.6 });
new Lenis({ lerp: 0.165, wheelMultiplier: 1.25 });  // + lenis.on('scroll', ScrollTrigger.update)
```
Semua modul menghormati `prefers-reduced-motion` (langsung tampil tanpa animasi), dan efek kursor hanya aktif di `(hover: hover) and (pointer: fine)` dengan lebar ≥992px.

### 5.2 Text reveal
- `data-text-reveal` (saat halaman masuk) dan `data-scroll-reveal` (saat masuk viewport, `start: "top 85%"`, `once`).
- SplitText dipecah per baris (atau per karakter) dengan `mask: "lines"`, lalu animasi `yPercent: 135 → 0`, `duration 1`, `ease expo.out`, stagger 0.07 per baris (karakter: 0.0175).
- Group stagger 0.12 antar elemen dalam `[data-*-group]`.
- Element mode (non-teks): `y: 24, autoAlpha: 0 → 1`, 0.8s expo.out.

### 5.3 Page transition (Barba + DrawSVG)
- Overlay `.transition` berisi path SVG tebal (stroke berwarna).
- **Leave**: path di-draw `0% 0% → 0% 85%` (1s, power1.inOut) sementara `strokeWidth 5% → 30%`, sehingga layar tertutup "coretan" tebal.
- **Enter**: `drawSVG 0% 100% → 100% 100%`, `strokeWidth → 5%` (1.25s), lalu text reveal halaman baru mulai +0.4s.
- Container lama di-*freeze* (`position: fixed; top: -scrollY`) supaya tidak melompat. Semua ScrollTrigger di-kill dan modul di-reinit per halaman.
- Theme halaman (`data-page-theme` light/dark) mengatur warna nav dan transisi.

### 5.4 Efek lain (ringkas)
| Modul | Atribut | Mekanik |
|---|---|---|
| Featured stack | `data-featured-stack` | Pin + scrub 0.3. Kartu `z: -i*120`, `y: -i*40`. Kartu depan `y += 0.9 × innerHeight` (power2.in) + fade. Tilt mouse via `quickTo` rotationX/Y |
| Cursor cards | `data-cursor-cards` | Kartu media mengikuti kursor (`quickTo` x/y/rotation, 1s power4), muncul setelah threshold 300px, diblokir di atas link/tombol |
| Image trail | `data-image-trail` | Gambar di-spawn sepanjang jejak mouse, scale 1.3→1 (`elastic.out(2,.6)`), terlempar sesuai velocity + rotasi acak ±10°, lalu mengecil (`back.in(1.5)`) |
| Momentum hover | `data-momentum-hover-init` | Elemen "terdorong" sesuai kecepatan kursor (InertiaPlugin), lalu kembali ke posisi |
| Team parallax | `data-team-parallax` | Scrub parallax berbeda per item, per breakpoint |
| Orbit media | `data-orbit-init` | Sticker mengorbit (speed 3, spread 2.4), interaktif lewat Observer |
| Font-weight hover | `data-font-weight-hover` | Variable font: `--wght` tiap huruf berubah sesuai jarak ke kursor (radius 400px) |
| Heading fit | `data-heading-fit` | Mengecilkan font-size agar kata terpanjang muat di box (min 40%, ruang 96%) |
| Sticky steps | `data-sticky-steps-init` | Split sticky: step teks aktif mengganti visual/video kanan |
| Marquee | `data-marquee-*` | Marquee infinite yang arahnya mengikuti arah scroll |
| Section dock | `data-section-dock-init` | Pill navigasi section mengambang (bounce `back.out(2.5)`) |
| Video | `data-bunny-*`, `data-video-on-hover` | HLS lazy, autoplay muted loop, placeholder fade 0.3s |

---

## 6. Responsif

- Breakpoint memakai fluid scaling (§3.3), jadi tiap rentang punya artboard sendiri.
- Mobile: nav jadi hamburger dengan overlay biru, hero tetap center dengan headline ±50px, strip logo klien jadi marquee horizontal, efek kursor (cards, trail, weight hover, tilt) dimatikan, featured stack tidak di-pin (hanya ≥992px).
- `maximum-scale=1, user-scalable=0` mematikan pinch-zoom. Ini **buruk untuk aksesibilitas** dan jangan ditiru.

---

## 7. Catatan kualitas

**Yang patut ditiru**
- Sistem token yang rapi (warna → theme, ukuran em → fluid).
- Satu easing global (`osmo`) membuat seluruh situs terasa konsisten.
- Arsitektur JS modular berbasis `data-*` dengan fungsi cleanup per modul, aman untuk SPA/transition.
- Reduced-motion dan pointer-fine dihormati di semua modul.
- Kontras tipografi grotesk + serif kompres sebagai identitas.

**Kelemahan / jangan ditiru**
- Zoom dinonaktifkan (`user-scalable=0`), melanggar WCAG 1.4.4.
- Konten disembunyikan sampai JS selesai (hero & contact sempat kosong saat diuji). Risiko untuk LCP dan untuk pengguna dengan JS lambat.
- Banyak skrip pihak ketiga (GTM, GA, Ads, Pixel, 3 lib Reform Digital, jQuery, Webflow) membebani TBT.
- Body text 12px @1440 cukup kecil.
- Barba `debug: true` tertinggal di produksi.

---

## 8. Cara menerjemahkannya ke Rumah Design (Nuxt 3)

Ini opsional dan harus mengikuti DESIGN.md serta fase di PLAN.md sebelum diimplementasikan.

| Pola Extrafazant | Padanan di Rumah Design |
|---|---|
| Token warna/tipe CSS vars | Tetap di `assets/css/tailwind.css` + `theme.extend` Tailwind |
| Fluid `--size-font` | `font-size: clamp()` di `html`, atau pola `--size-font` yang sama di `:root` |
| Lenis + GSAP ticker | Plugin client-only `plugins/lenis.client.ts` |
| Text reveal SplitText | Composable `useTextReveal()` + directive `v-reveal` (fallback CSS untuk SSR, jangan sembunyikan konten tanpa JS) |
| Barba transition | `<NuxtPage :transition>` / `definePageMeta({ pageTransition })` + overlay SVG DrawSVG |
| Featured stack | Komponen `FeaturedStack.vue` dengan ScrollTrigger pin (desktop only) |
| Modul `data-*` + cleanup | Composable per efek dengan `onMounted`/`onBeforeUnmount` |
| Sticker & bingkai warna | Hanya aset milik sendiri |

---

## Lampiran: bahan mentah

File hasil scrape disimpan di folder scratchpad sesi (bukan di repo, karena berisi kode/konten pihak ketiga):
`page_*.html` (6 halaman), `shared.css` (Webflow, 220 KB), `embeds.css` (custom CSS embed, 30 KB), `bundle.js` + `bundle.pretty.js` (custom JS, 3.078 baris).
