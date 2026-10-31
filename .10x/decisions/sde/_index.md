# SDE — Index

## Yang sudah dibangun [DISCOVERED 2026-10-29]
- Situs publik editorial (redesign 1 Okt 2026): beranda, /karya (filter + search), detail project, about, layanan (+3 detail), proses, contact (brief → mailto), error page.
- Admin studio: login, list/new/edit project, media, SEO checker, settings, command palette, toast.
- SEO: canonical, JSON-LD Person/WebSite/CollectionPage/CreativeWork, sitemap dinamis, robots, verifikasi Google.
- Perf terbaru (commit 5f45005): srcset gambar via Supabase render, font admin dipisah, refinements /layanan.

## Fitur
- `security-patch-ci` — patch dependency + CI GitHub Actions (2026-10-29).
- `public-perf` — Supabase SDK admin-only, payload ramping, ISR (2026-10-29, ADR-002).
- `deps-tests` — hapus dependency mati + Vitest 24 test (2026-10-29, ADR-003).
- `fonts-hero` — font publik self-host, throttle pointermove hero, Vitest 5 (2026-10-29, ADR-004).
- `csp-motion-cleanup` — CSP hash tanpa unsafe-inline, reveal hero CSS (LCP), hapus kode mati (2026-10-31, ADR-005/006).

## Branch aktif
- `perf/images-layanan-refinements` (1 commit di atas main).
