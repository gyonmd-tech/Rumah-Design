# ADR-005: CSP berbasis hash untuk script inline (tanpa `unsafe-inline`)

**Status:** Accepted
**Date:** 2026-10-31
**Feature:** csp-motion-cleanup
**Author:** 10x-Team (Architect + Security)

## Context
CSP saat ini `script-src 'self' 'unsafe-inline'` (audit SEC-2): XSS yang berhasil menyisipkan `<script>` inline tetap dieksekusi. Script inline yang sah hanya sedikit dan deterministik per build: script `js-motion` di `<head>` dan bootstrap Nuxt (`window.__NUXT__…`). JSON-LD dan `__NUXT_DATA__` adalah data block (bukan JS) sehingga tidak tunduk pada `script-src`.

Halaman publik di-cache ISR (ADR-002), jadi **nonce** per-request tidak bisa dipakai: HTML ter-cache akan menyajikan nonce yang sama ke semua pengunjung dan nonce yang terbaca publik tidak lagi rahasia.

## Decision
- Nitro plugin (`server/plugins/csp.ts`) pada hook `render:response` menghitung SHA-256 setiap `<script>` inline yang dapat dieksekusi di HTML akhir, lalu menulis header CSP `script-src 'self' 'sha256-…'` (tanpa `unsafe-inline`). Header dan HTML ikut ter-cache bersama oleh ISR sehingga selalu konsisten.
- Builder CSP dipindah ke `utils/csp.ts` (fungsi murni, diuji Vitest) dan dipakai oleh `nuxt.config.ts` (header dasar untuk respons non-HTML) maupun plugin.
- `style-src 'unsafe-inline'` dipertahankan (GSAP/Vue menulis inline style; risiko eksekusi jauh lebih rendah).

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Nonce (`nuxt-security`) | Standar umum | Tidak kompatibel dengan ISR/CDN cache | Nonce statis di cache = tidak bermakna |
| Pindahkan script inline ke file eksternal | CSP `'self'` saja | Bootstrap Nuxt tidak bisa dieksternalisasi; `js-motion` jadi request blocking tambahan | Tidak lengkap |
| Tetap `unsafe-inline` | Nol kerja | CSP tidak menahan XSS inline | Tujuan SEC-2 |

## Consequences
### Positive
- Script inline yang disisipkan penyerang diblokir browser; defense-in-depth di atas sanitasi markdown.
### Negative
- Hash dihitung per render SSR (murah: beberapa script kecil; ISR membuat sebagian besar request tidak merender ulang).
### Risks
- Script inline baru dari modul pihak ketiga yang ditambahkan di luar render SSR (mis. disuntik di edge) akan terblokir → terdeteksi lewat event `securitypolicyviolation` di uji lab.
