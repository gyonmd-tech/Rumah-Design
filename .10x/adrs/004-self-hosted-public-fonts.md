# ADR-004: Self-host font publik dengan @nuxt/fonts

**Status:** Accepted
**Date:** 2026-10-29
**Feature:** fonts-hero
**Author:** 10x-Team (Architect + Staff Engineer)

## Context
Situs publik memuat `fonts.googleapis.com/css2?...` sebagai stylesheet render-blocking (audit PERF-6): dua origin tambahan (googleapis + gstatic) sebelum teks tampil, Inter Tight diminta untuk seluruh axis 100–900 roman + italic. Kebutuhan nyata:
- Inter Tight variable roman (hero menganimasikan `wght` 250–850; teks 400–900) + italic (sticker 900 italic).
- Instrument Serif 400 regular + italic.
Font admin (IBM Plex, Clash Display, General Sans, ARQINO) dimuat terpisah oleh `useAdminFonts()` / `@font-face` lokal dan di luar scope.

## Decision
- Pasang `@nuxt/fonts@0.14.0` (versi matang, kompatibel Nuxt 3, tanpa peer dependency) dengan daftar `families` eksplisit untuk dua font publik (provider google, subset latin + latin-ext, `font-display: swap`). File woff2 diunduh saat build dan disajikan dari `/_fonts/` (origin sendiri, cache immutable); modul juga menambahkan fallback metrik untuk menekan CLS.
- Font admin di-set `provider: 'none'` agar modul tidak meng-host ulang font yang sudah dikelola sendiri.
- Hapus `<link rel="stylesheet">` + preconnect Google Fonts dari head publik. CSP tetap mengizinkan Google/Fontshare untuk admin.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Download woff2 manual ke `public/fonts` + `@font-face` tulisan tangan | Tanpa dependency | Kelola subset/unicode-range & versi font sendiri; tanpa fallback metrik otomatis | Biaya pemeliharaan lebih tinggi |
| Tetap Google Fonts + `preload`/`media=print` trick | Perubahan kecil | Tetap dua origin pihak ketiga; trick onload bertabrakan dengan CSP `script-src-attr 'none'` | Tidak menghilangkan akar masalah |
| `@nuxt/fonts` 1.x | Terbaru | Rilis < 3 minggu, butuh peer `subset-font`/`lightningcss` | Terlalu baru untuk produksi |

## Consequences
### Positive
- Tidak ada request font lintas-origin di halaman publik; font ikut di-cache CDN Vercel; CLS lebih rendah lewat fallback metrik.
### Negative
- Build butuh akses ke Google Fonts API untuk mengunduh file (cache build Vercel membantu).
### Risks
- Jika unduhan gagal saat build, font jatuh ke fallback sistem — terdeteksi saat verifikasi visual/smoke.
