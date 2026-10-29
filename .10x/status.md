# Status

**Phase:** fonts-hero — Implementation + verifikasi lokal selesai (2026-10-29)
**Branch:** `perf/fonts-hero`

## Selesai
- Discovery + audit: `.10x/reviews/2026-10-29-codebase-audit.md`.
- PR #5 security-patch-ci, PR #6 public-perf (ADR-002), PR #7 deps-tests (ADR-003) — semua merged & terverifikasi di production.
- fonts-hero (ADR-004): PERF-6 font self-host, PERF-7 throttle hero, vitest 5 (tutup tinypool critical), audit CI termasuk devDependencies.

## Berikutnya
- PR untuk `perf/fonts-hero`; cek visual hover hero di preview (layar ≥992px).
- PERF-9: PageSpeed (kuota API anonim habis — pakai pagespeed.web.dev).
- Kandidat berikut: lazy GSAP, SEC-2 (CSP nonce), hapus komponen mati, rencana upgrade Nuxt 4 (menutup sisa moderate/low).

## Blocker
- Tidak ada.
