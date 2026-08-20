# Rumah Design — Design System v2
### Upgrade: Editorial Dark→Light + Extreme Typography

Status: Draft untuk review
Terkait: MOTION.md, PLAN.md
Menggantikan/memperluas bagian warna & tipografi pada DESIGN.md sebelumnya.

---

## 1. Konsep

Rumah Design sudah punya identitas editorial yang kuat: tipografi besar, kontras tinggi, aksen oranye, grid rapi. Upgrade ini **tidak mengganti** identitas itu — upgrade ini menambah dua hal: (1) dimensi mode gelap→terang yang diikat ke narasi tagline, dan (2) tipografi yang lebih berani skalanya.

**Prinsip pengikat:** _"Ide yang dirancang untuk benar-benar hidup."_ Hero dibuka dalam mode gelap (`void`) — ruang ide yang belum berbentuk. Saat user scroll turun menuju "Project pilihan", halaman secara bertahap **berubah terang** (`paper`) — merepresentasikan ide yang sudah jadi karya nyata. Transisi ini bukan sekadar dua section warna beda, tapi satu mekanisme scroll-linked yang jadi signature visual situs (detail teknis di MOTION.md §4).

Halaman lain (Tentang, Karya detail) mengikuti mode sesuai konteks kontennya — dijelaskan di §7.

---

## 2. Sistem Warna

Palet dibatasi ketat: 1 warna gelap, 1 warna terang, 1 warna teks gelap, 1 aksen, 1 netral. Tidak menambah warna baru di luar ini kecuali untuk status semantik (error/success di form login/admin).

| Token | Hex | Peran |
|---|---|---|
| `--color-void` | `#121110` | Background mode gelap (hero). Hitam hangat, bukan `#000` murni — biar terasa "tinta", bukan "layar mati". |
| `--color-paper` | `#F5F3EF` | Background mode terang (project grid dst). Sama seperti sekarang, dipertahankan agar identitas tidak melompat. |
| `--color-ink` | `#14120F` | Teks utama di atas `--color-paper`. |
| `--color-signal` | `#FF4A1C` | Aksen tunggal — CTA, link aktif, highlight, garis progres transisi. Dipakai identik di kedua mode. **Catatan:** sengaja dipilih lebih vivid/merah dibanding oranye-terracotta yang umum dipakai di banyak produk AI — supaya tetap terasa milik brand kamu sendiri, bukan template. |
| `--color-mute` | `#8A8478` | Teks sekunder, border hairline, caption — abu hangat yang jalan di kedua mode. |
| `--color-line-dark` | `rgba(245,243,239,0.14)` | Hairline divider di atas `--color-void`. |
| `--color-line-light` | `rgba(20,18,15,0.12)` | Hairline divider di atas `--color-paper`. |

**Aturan pakai:**
- `--color-signal` dipakai secukupnya — 1 CTA utama per section, bukan tiap elemen. Kalau semuanya oranye, tidak ada yang terasa penting.
- Teks di atas `--color-void` selalu `--color-paper` (bukan abu-abu), untuk kontras maksimal khas editorial.
- Jangan pernah campur teks gelap di atas background yang belum sepenuhnya "paper" saat masa transisi — gunakan opacity crossfade, bukan warna teks abu-abu di tengah.

---

## 3. Tipografi

**Kombinasi peran (3 font, kontras disengaja):**

| Peran | Font | Alasan |
|---|---|---|
| Display | **General Sans** (variable, 500–700) | Melanjutkan karakter huruf yang sudah ada di headline kamu sekarang (grotesk dengan terminal membulat). Dipakai HANYA untuk headline besar. |
| Body | **IBM Plex Sans** (400–500) | Netral, sangat mudah dibaca di ukuran kecil, tidak bersaing dengan Display. |
| Mono/Utility | **IBM Plex Mono** (400–500) | Dipakai untuk eyebrow, tag, nomor index, label nav, button. Karena kamu frontend developer, huruf mono ini bukan gimmick — ini elemen yang menegaskan identitas "product design × frontend" secara visual, sekaligus jadi kontras ekstrem lawan Display yang raksasa. |

**Kontras ekstrem = signature tipografi:** headline sangat besar (Display) berdampingan dengan label sangat kecil huruf kapital dalam mono (Utility). Lompatan skala inilah yang dimaksud "ekstrem" — bukan menambah lebih banyak font, tapi memperlebar jarak antara elemen terbesar dan terkecil di halaman.

**Skala tipe (pakai `clamp()` agar responsif tanpa breakpoint manual):**

| Level | clamp() | Pemakaian |
|---|---|---|
| Display XL | `clamp(3.25rem, 3vw + 6.5rem, 11rem)` | Hero headline. Leading 0.88, tracking -0.03em. |
| Display L | `clamp(2.25rem, 2vw + 3.5rem, 5rem)` | Judul section ("Project pilihan", "Mari membuat..."). |
| Display M | `clamp(1.5rem, 1vw + 1.5rem, 2.25rem)` | Judul card project, judul sub-section. |
| Body L | `1.125rem–1.25rem` | Paragraf intro/deskripsi utama. |
| Body M | `1rem` | Paragraf umum. |
| Caption/Mono | `0.75rem`, uppercase, tracking 0.08em | Eyebrow, tag, label nav, nomor index. |

**Aturan restraint:** Display hanya dipakai maksimal 2-3 kali per halaman (hero + 1-2 judul section). Kalau semua judul pakai Display XL, efek "ekstrem"-nya hilang karena tidak ada pembanding.

---

## 4. Layout & Grid

- Container max-width: `1440px`, padding horizontal `clamp(1.5rem, 4vw, 5rem)`
- Grid dasar: 12 kolom desktop, gap `1.5rem`
- Project grid: 2 kolom desktop (bukan 2 kolom penuh seperti sekarang yang membuat gambar terlalu besar dan terpotong) — kartu diberi rasio gambar tetap `16:10`, `object-fit: cover` dengan focal-point per project (bukan crop otomatis dari kiri-atas)
- Mobile: 1 kolom, Display XL turun skala otomatis lewat clamp, spacing vertikal antar-section diperbesar untuk memberi ruang napas

```
Hero (void)
┌─────────────────────────────┐
│ [logo]           [nav mono] │
│                              │
│   DISPLAY XL HEADLINE        │
│   (split-reveal saat load)   │
│                              │
│   body intro    [stat strip] │
│                              │
│              ↓ scroll cue    │
└─────────────────────────────┘
        ↓ transisi scroll-linked (lihat MOTION.md §4)
Project grid (paper)
┌───────────────┬───────────────┐
│ 01 [thumbnail] │ 02 [thumbnail] │
│ Judul · tag    │ Judul · tag    │
├───────────────┼───────────────┤
│ 03 [thumbnail] │ 04 [thumbnail] │
└───────────────┴───────────────┘
Footer (paper → void tipis di dasar, lihat §6)
```

---

## 5. Signature Element

**Nomor index raksasa yang jadi struktur, bukan dekorasi.** Nomor "01/02/03/04" yang sudah ada di card sekarang dipertahankan (karena memang urutan project sungguhan — sesuai prinsip "structure is information"), tapi diperbesar jadi elemen mono raksasa (`clamp(4rem, 8vw, 9rem)`) yang overlap tipis ke tepi thumbnail dengan opacity rendah (`~12%` di atas gambar). Nomor ini juga berfungsi sebagai penanda posisi scroll di galeri horizontal halaman detail project.

---

## 6. Komponen

**Navigasi**
- Dark mode (di atas hero): teks `--color-paper`, background transparan
- Saat scroll melewati titik transisi: background nav berubah jadi `--color-paper` dengan blur tipis, teks jadi `--color-ink` — transisi ini instan mengikuti threshold, bukan scroll-linked (biar nav tetap terbaca kapan saja)
- Tambahkan CTA kecil di nav: "Hubungi" atau link ke halaman Tentang/kontak, plus indikator halaman aktif (underline mono tipis di bawah link aktif)

**Hero**
- Logo image kamu di kiri atas, ukuran kecil-medium, monokrom putih di atas void
- Badge status eyebrow (mono, kecil): contoh `● TERBUKA UNTUK PROJECT BARU`
- Headline Display XL, split per baris
- Strip stat tipis di bawah paragraf: mono, separator `·`, contoh `4 PROJECT · NUXT · ASTRO · GSAP · JAKARTA`
- Scroll cue: garis vertikal tipis + label mono "SCROLL", posisi bawah tengah, fade out begitu user mulai scroll

**Kartu Project**
- Rasio gambar tetap 16:10, crop disengaja (bukan screenshot mentah penuh)
- Nomor index raksasa (lihat §5) di belakang/tepi gambar
- Judul: Display M
- Tag kategori: mono kecil, dipisah titik tengah
- Hover: scale gambar halus (`1.02`) + overlay label "LIHAT PROJECT" muncul dari bawah

**Footer**
- Background mulai transisi kembali ke nuansa gelap tipis (`--color-ink` sebagai bg, bukan full void) — semacam "penutup buku" yang menggemakan hero, tapi tidak segelap hero supaya tidak terasa seperti mode terpisah
- Isi: sitemap mini, kontak (email + 1-2 link), CTA ulang, back-to-top
- Tipografi CTA penutup ("Mari membuat sesuatu yang berguna.") tetap Display L — ini section kedua yang berhak pakai Display besar setelah hero

**Tombol**
- Primary: bg `--color-signal`, teks `--color-void`, radius kecil (`4px`, editorial — bukan pill kecuali memang untuk badge/tag)
- Secondary: border `--color-mute`, transparan, teks sesuai mode

---

## 7. Mode per Halaman

| Halaman | Mode | Catatan |
|---|---|---|
| Home — Hero | Dark (void) | Full signature transition di sini |
| Home — Project grid, Karya index | Light (paper) | |
| Karya detail | Dark hero singkat → Light untuk konten case-study | Hero project pakai treatment mirip home tapi lebih ringkas (bukan full split-reveal, cukup fade) |
| Tentang | Light penuh | Halaman ini tentang orang/proses — lebih cocok terang dan personal, tidak perlu dark open |
| Footer (semua halaman public) | Ink gelap tipis | Lihat §6 |
| Login | Light, minimal | Tidak ikut skema dark/light naratif — halaman fungsional |
| Admin panel | Light, data-dense | Tidak pakai `--color-void` sama sekali, prioritas keterbacaan kerja |

---

## 8. Aksesibilitas & Restraint

- Kontras teks minimum WCAG AA di kedua mode (sudah aman dengan `--color-ink` di atas `--color-paper` dan `--color-paper` di atas `--color-void`)
- Focus state keyboard: outline `--color-signal` 2px, terlihat jelas di kedua mode
- Transisi warna scroll-linked WAJIB punya fallback: kalau `prefers-reduced-motion: reduce`, section langsung ganti warna per breakpoint scroll tanpa animasi kontinu (detail di MOTION.md §7)
- Batasi Display XL ke hero saja per halaman — one moment of maximum boldness, sisanya disiplin
