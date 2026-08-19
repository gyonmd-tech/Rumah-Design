# Rumah Design — Motion System
### MOTION.md

Status: Draft untuk review
Terkait: DESIGN.md, PLAN.md
Tujuan dokumen: jadi rujukan teknis untuk AI coding agent saat implementasi — semua durasi, easing, dan trigger didefinisikan eksplisit, tidak ada ruang tebak-tebak.

---

## 1. Prinsip Motion

1. **Story-driven, bukan dekoratif.** Setiap animasi harus punya alasan naratif atau fungsional (menandai hierarki, menandai state, menandai progres) — bukan sekadar "biar hidup".
2. **2-3 momen kunci per halaman.** Untuk Home: hero reveal, transisi dark→light, stagger project grid. Jangan tambah lagi di luar itu tanpa alasan kuat.
3. **Dua bahasa motion:** halaman public (Home, Karya, Tentang) pakai motion penuh (scroll-driven). Halaman utility (Login, Admin) hanya pakai fade/slide standar berdurasi pendek — prioritas kecepatan kerja, bukan storytelling.
4. **Semua motion harus reversible/scrubbable** kalau terikat scroll — user scroll naik-turun harus terasa natural, tidak ada animasi yang "kebablasan" sekali jalan lalu macet.

---

## 2. Stack & Setup

- **GSAP core** + **ScrollTrigger** + **SplitText** (gratis sejak GSAP di bawah Webflow — tidak ada blocker lisensi)
- **Lenis** untuk smooth scroll, disinkronkan ke `ScrollTrigger.update` via `lenis.on('scroll', ScrollTrigger.update)`
- Implementasi di Nuxt 3: buat plugin client-only `plugins/gsap.client.ts`, daftarkan GSAP + plugin di sana, expose lewat composable `useMotion()`
- **Wajib:** cleanup semua `ScrollTrigger` instance saat route berubah (`onBeforeRouteLeave` / `onUnmounted`) — Nuxt SPA navigation tidak reload halaman, jadi trigger lama harus di-`kill()` supaya tidak menumpuk dan bikin scroll listener bocor
- Root check di awal composable:
```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```
Semua fungsi motion di bawah harus punya cabang reduced-motion (lihat §7).

---

## 3. Token Global

| Token | Nilai | Pemakaian |
|---|---|---|
| `ease.reveal` | `power3.out` | Elemen masuk (teks, card) |
| `ease.exit` | `power2.in` | Elemen keluar (filter FLIP) |
| `ease.smooth` | `power1.inOut` | Transisi warna/scroll-linked |
| `duration.fast` | `0.3s` | Hover, micro-interaction |
| `duration.base` | `0.6s` | Reveal standar |
| `duration.slow` | `1s–1.2s` | Hero reveal, page transition |
| `stagger.tight` | `0.04s` | Split-text per huruf |
| `stagger.base` | `0.08s–0.12s` | Grid card, list item |

---

## 4. Signature Motion: Transisi Dark → Light

Ini elemen paling penting di dokumen ini — implementasinya harus presisi.

**Mekanisme:** Section hero (`--color-void`) dan section project grid (`--color-paper`) ditumpuk dalam satu "zona transisi" sepanjang ~150vh. Alih-alih hard cut warna, background dan warna teks di-interpolasi mengikuti scroll progress lewat GSAP `ScrollTrigger` dengan `scrub: true`.

**Setup teknis:**
```js
ScrollTrigger.create({
  trigger: '.transition-zone',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress // 0 -> 1
    gsap.set(document.documentElement, {
      '--bg-mix': progress, // dipakai oleh color-mix() di CSS
    })
  }
})
```
```css
body {
  background-color: color-mix(in srgb, var(--color-void) calc((1 - var(--bg-mix)) * 100%), var(--color-paper) calc(var(--bg-mix) * 100%));
  color: color-mix(in srgb, var(--color-paper) calc((1 - var(--bg-mix)) * 100%), var(--color-ink) calc(var(--bg-mix) * 100%));
  transition: none; /* dikontrol scroll, bukan CSS transition */
}
```
- Nav berubah state (lihat DESIGN.md §6) di titik `progress > 0.5`, pakai `onUpdate` yang sama, tapi dengan threshold instan (bukan interpolasi) supaya teks nav tetap selalu terbaca
- Elemen di dalam hero (headline, badge) fade-out (`opacity: 1 -> 0`, `y: 0 -> -40`) di rentang `progress 0 -> 0.4` supaya tidak "melayang" sampai section project muncul
- Elemen pertama project grid fade-in di rentang `progress 0.6 -> 1`

**Kenapa scrub, bukan trigger sekali jalan:** supaya user yang scroll naik-turun (misal balik ke hero untuk baca ulang) mengalami transisi mulus dua arah, bukan animasi yang cuma jalan sekali dan macet di akhir.

---

## 5. Spesifikasi per Komponen

### 5.1 Hero — Split-text reveal
- Trigger: on page load (bukan scroll, karena di atas fold)
- `SplitText` headline per baris (bukan per huruf — per huruf terlalu ramai untuk 3 baris teks besar)
- Timeline: `y: 60 -> 0`, `opacity: 0 -> 1`, `ease.reveal`, `stagger.base` antar baris, `duration.slow`
- Badge eyebrow dan paragraf intro masuk setelah headline selesai (`+=0.2` offset), fade+slide ringan
- Logo di nav fade-in duluan (`duration.fast`), sebelum headline mulai

### 5.2 Navigasi — Hide on scroll down
- `ScrollTrigger` dengan `onUpdate` membandingkan `self.direction`
- Scroll down: nav `y: 0 -> -100%`, `duration.fast`
- Scroll up: nav kembali `y: -100% -> 0`
- Tidak aktif dalam 200px pertama dari top (supaya tidak "kedip" saat awal scroll)

### 5.3 Project Grid — Stagger on enter
- Trigger: `ScrollTrigger` per card, `start: 'top 85%'`
- `opacity: 0 -> 1`, `y: 40 -> 0`, `ease.reveal`, `stagger.base` antar card dalam baris yang sama
- Nomor index raksasa (signature element) masuk dengan delay tambahan `+=0.1` dan efek scale ringan `0.9 -> 1`, opacity rendah dipertahankan sesuai DESIGN.md §5

### 5.4 Filter Tag — FLIP transition
- Saat filter berubah: pakai `Flip.getState()` sebelum filter, ubah DOM (card yang tidak match dikasih `display:none` atau di-filter di data), lalu `Flip.from(state, { duration: 0.5, ease: ease.smooth, stagger: 0.03 })`
- Card yang keluar dari filter: fade+scale down dulu (`0.2s`) sebelum FLIP grid lain reflow — supaya tidak terasa "meloncat"

### 5.5 Kartu Project — Hover
- Gambar: `scale: 1 -> 1.02`, `duration.fast`
- Overlay label "LIHAT PROJECT": slide dari bawah (`y: 100% -> 0`), `duration.fast`
- Nomor index: opacity naik sedikit saat hover (`0.12 -> 0.2`) sebagai micro-feedback

### 5.6 Footer — Reveal
- Trigger sekali saat masuk viewport (bukan scrub)
- CTA "Mari membuat sesuatu yang berguna." pakai split-text line reveal sama seperti hero (echo intensional — footer adalah "penutup buku" dari hero)
- Sitemap dan kontak fade-in sederhana setelahnya

### 5.7 Halaman Karya Detail — Galeri horizontal
- Hanya di section galeri visual (bukan seluruh halaman)
- `ScrollTrigger` dengan `pin: true`, `scrub: 1`, menggerakkan container galeri secara horizontal seiring scroll vertikal
- Nomor index (signature element) dipakai ulang di sini sebagai penanda posisi galeri, contoh "03 / 07"
- Section sebelum dan sesudah galeri tetap scroll vertikal normal — horizontal hijack dibatasi ketat ke section ini saja

### 5.8 Transisi antar-halaman (Home ↔ Karya detail)
- Nuxt `<NuxtPage>` dengan custom transition hook, bukan default CSS transition
- Keluar: konten fade+slight scale down (`0.3s`)
- Masuk: konten fade+slide up (`0.4s`), delay singkat setelah keluar selesai
- Tidak perlu full "shared element" morphing di tahap awal — cukup crossfade halus dulu, bisa ditingkatkan di iterasi berikutnya

### 5.9 Login & Admin (utility)
- Hanya `opacity` + `y: 10px` fade standar `duration.fast` saat mount
- Tidak ada ScrollTrigger sama sekali
- Transisi antar state form (misal error, loading) pakai GSAP timeline pendek, bukan CSS animation, supaya konsisten satu sistem — tapi tetap `duration.fast`

---

## 6. Matriks Motion per Halaman

| Halaman | Split-text | Scroll transition | Stagger grid | FLIP filter | Horizontal scroll | Page transition |
|---|---|---|---|---|---|---|
| Home | ✅ (hero) | ✅ (signature) | ✅ | ✅ | – | ✅ |
| Karya index | – | – | ✅ | ✅ | – | ✅ |
| Karya detail | ✅ (hero ringkas) | – | – | – | ✅ (galeri) | ✅ |
| Tentang | ✅ (hero ringkas) | – | – | – | – | ✅ |
| Login | – | – | – | – | – | fade saja |
| Admin | – | – | – | – | – | fade saja |

---

## 7. Aksesibilitas — `prefers-reduced-motion`

Wajib di root composable:
```js
if (prefersReducedMotion) {
  // Nonaktifkan semua scrub/scroll-linked transform
  // Ganti reveal jadi opacity fade tanpa transform, duration dipotong ~50%
  // Transisi dark->light: ganti dari scrub kontinu ke hard switch di satu breakpoint scroll,
  //   tanpa color-mix animasi
  // FLIP filter: tetap jalan tapi tanpa stagger, durasi minimal
}
```
Tidak ada elemen yang **hilang secara fungsional** saat reduced motion aktif — hanya cara munculnya yang berubah, bukan kontennya.

---

## 8. Budget Performa

- Init `ScrollTrigger` hanya untuk elemen yang benar-benar butuh (lazy — gunakan `ScrollTrigger.batch()` untuk grid card, bukan satu instance per card)
- Pastikan `will-change` dipasang selektif (hanya elemen yang sedang dianimasikan), dilepas setelah animasi selesai
- Ukur Cumulative Layout Shift (CLS) dan Interaction to Next Paint (INP) sebelum/sesudah — motion tidak boleh menaikkan CLS karena elemen yang belum ter-load
- `SplitText` re-run harus di-debounce saat resize (font reflow di breakpoint berbeda)
