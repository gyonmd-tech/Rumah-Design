# ADR-001: CI dasar dengan GitHub Actions

**Status:** Accepted
**Date:** 2026-10-29
**Feature:** security-patch-ci
**Author:** 10x-Team (Architect + Staff Engineer)

## Context
Tidak ada pemeriksaan otomatis per push/PR. Typecheck, build, dan regresi SEO hanya dijalankan manual, sementara `npm audit` menunjukkan 25 kerentanan yang perlu dipatch dan diverifikasi. Repo ada di GitHub (`gyonmd-tech/Rumah-Design`); deploy tetap via Vercel Git integration.

## Decision
Satu workflow `.github/workflows/ci.yml` di GitHub Actions, trigger `push` ke `main` dan semua `pull_request`:
`npm ci` → `npm run typecheck` → `npm run test:seo` → `npm run build` → `npm audit --omit=dev --audit-level=high`.
- Node 22 (sesuai `engines`), cache npm.
- Build memakai env placeholder non-rahasia (`SUPABASE_URL=https://example.supabase.co`, anon placeholder); tidak ada secret di CI.
- `concurrency` membatalkan run lama di branch yang sama.
- Vercel tetap bertanggung jawab atas deploy; CI hanya quality gate.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Andalkan build Vercel saja | Nol konfigurasi | Tidak ada typecheck/test/audit; gagal baru ketahuan saat deploy | Gate terlalu lemah |
| Husky pre-commit hook | Feedback lokal cepat | Bisa di-skip, lambat (typecheck ±menit) di setiap commit | Tidak menjamin di PR |
| CI + Lighthouse CI sekaligus | Ukur performa otomatis | Butuh URL preview + secret, lebih rumit | Ditunda ke pekerjaan performa (PERF-9) |

## Consequences
### Positive
- Setiap PR terverifikasi typecheck, regresi SEO, build, dan audit dependency runtime.
### Negative
- Waktu CI ±3–5 menit per run; audit gate bisa memblokir PR saat advisory baru muncul (disengaja).
### Risks
- Advisory baru tanpa fix → PR terblokir. Mitigasi: sementara turunkan ke `--audit-level=critical` dengan catatan di status.

## Dependencies
- Branch protection di GitHub (opsional, diatur manual oleh pemilik repo) agar CI wajib lulus sebelum merge.
