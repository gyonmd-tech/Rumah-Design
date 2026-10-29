# Architect — security-patch-ci

- CI = quality gate di GitHub Actions; deploy tetap Vercel Git integration (ADR-001).
- Tahapan: typecheck → test:seo → build → audit runtime (`--audit-level=high`).
- Tidak ada secret di CI; build memakai placeholder Supabase publik.
- Patch dependency hanya `npm audit fix` (tanpa `--force`) agar tidak ada lompatan major.
