# Review — Lab performa & CSP (2026-10-31)

**Branch:** `chore/csp-motion-cleanup` · **Metode:** Chrome lokal via CDP (4× CPU, 1,6 Mbps / 150 ms, 412×823), median 3 run, build produksi lokal (tanpa kompresi) + production untuk pembanding.

## Hasil beranda
| Metrik | Production (main) | Build lokal sebelum | Build lokal sesudah |
|---|---|---|---|
| LCP | 8,7 dtk (`marquee__item`) | 11,0 dtk (`hero__line.alt`) | **2,85 dtk** (`hero__line.alt`) |
| FCP | 2,8 dtk | 3,5 dtk | 2,85 dtk |
| TBT | 5,4 dtk | 5,9 dtk | 1,4 dtk* |
| Pelanggaran CSP | – | – | 0 (/, /karya, /project, /about, /admin/login, /admin/projects) |

\* TBT berfluktuasi tinggi di mesin ini (beban CPU dari build paralel); jangan dibaca sebagai angka pasti. Akar TBT = layout/shaping teks awal (trace), bukan JS.

## Keamanan
- `script-src` tanpa `unsafe-inline`; hash per render (ADR-005). Satu pelanggaran ditemukan & diperbaiki: script `js-motion` disisipkan ulang oleh client di shell SPA admin → kini hanya dirender server.
- `npm audit`: 16 (13 moderate, 3 low), 0 high/critical — bertambah dari 9 karena advisory baru (glob, minimatch, Nuxt dev server) yang juga muncul di lockfile `main`; seluruhnya tooling build/dev, perbaikan butuh Nuxt 4 / major `@nuxtjs/seo`.

## Visual
Screenshot headless desktop 1440×900 & mobile 412×823 setelah load penuh identik dengan production. Pada load awal judul tampil dengan font fallback (metrik disesuaikan) lalu swap.

## Belum terverifikasi
- Lighthouse/PageSpeed resmi (API 429). Lab ini adalah pendekatan, bukan skor Lighthouse.
- Efek hover ketebalan huruf di hero (logika tidak berubah; markup kini SSR).
