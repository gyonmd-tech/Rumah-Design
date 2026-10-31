# ADR-006: Reveal judul hero dengan CSS, bukan GSAP

**Status:** Accepted
**Date:** 2026-10-31
**Feature:** csp-motion-cleanup
**Author:** 10x-Team (Architect + Staff Engineer)

## Context
Pengukuran lab (Chrome lokal via CDP, 4× CPU, 1,6 Mbps / 150 ms RTT, viewport 412×823) pada beranda:
- LCP production 8,7 dtk; build lokal 11,0 dtk. Dengan `prefers-reduced-motion` (tanpa reveal) LCP lokal 4,0 dtk.
- Judul hero (`data-reveal="chars"`) disembunyikan `html.js-motion [data-reveal]{visibility:hidden}` sampai GSAP (di entry JS) dieksekusi, hydration selesai, dan gate `pageReady` (font/900 ms) lepas. Selama itu item marquee yang bergulir masuk viewport terus menjadi kandidat LCP baru.

## Decision
Judul hero dipecah per huruf saat SSR (`.split-char`, tetap `inline`) agar efek hover ketebalan tetap berjalan, dan **per baris** dianimasikan dengan `@keyframes` CSS (opacity 0 + translateY 0.3em → normal, 1 dtk, `cubic-bezier(0.16,1,0.3,1)` ≈ expo.out, baris kedua +120 ms) yang aktif hanya di bawah `html.js-motion`. GSAP tidak lagi menyentuh judul. Elemen intro lain (eyebrow, link) tetap memakai GSAP.

Varian yang diukur (injeksi CSS via CDP pada build yang sama, median 3 run):
| Varian | LCP | Elemen LCP |
|---|---|---|
| GSAP SplitText (lama) | 11,0 dtk | `SPAN.hero__line.alt` (setelah reveal) |
| CSS per huruf, mask `overflow: clip` | 9,8 dtk | `P.kicker` — judul tidak terhitung (paint pertama luas 0) |
| CSS per huruf, fade tanpa mask | 12,0 dtk | `P.kicker` — tiap huruf `inline-block` jadi kandidat kecil terpisah |
| **CSS per baris, fade + rise (dipilih)** | **5,2 dtk** | `SPAN.hero__line.alt` |
| Referensi: reduced motion (tanpa animasi) | 4,0 dtk | `SPAN.hero__line.alt` |

Lazy-load GSAP **tidak** dilakukan: trace menunjukkan TBT didominasi Layout/shaping teks (±450–600 ms per layout awal pada 4× CPU), bukan eksekusi JS; setelah LCP lepas dari GSAP, manfaatnya kecil dibanding risiko regresi reveal.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Lazy-load GSAP saja | Entry JS lebih kecil | Judul tetap menunggu GSAP → LCP justru bisa lebih lambat | Tidak menyentuh akar LCP |
| Hilangkan animasi intro di load pertama | Paling sederhana | Kehilangan karakter desain | Desain adalah bagian portofolio |
| Lepas gate `pageReady` untuk hero | Sedikit lebih cepat | Masih menunggu unduh + eksekusi JS | Hemat < 1 dtk saja |

## Consequences
### Positive
- Judul terlihat sejak paint pertama; LCP tidak bergantung JS.
### Negative
- Satu jalur animasi khusus di luar sistem `data-reveal` (didokumentasikan di komponen).
- Reveal judul berubah dari "huruf naik dari mask" menjadi "baris naik + fade" (kompromi desain demi LCP).
### Risks
- Huruf beranimasi sebelum font web selesai (swap) — fallback metrik @nuxt/fonts meminimalkan lompatan.
