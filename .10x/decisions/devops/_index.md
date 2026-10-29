# DevOps — Index

## Setup [DISCOVERED 2026-10-29]
- Vercel (Git integration), domain `hygionedarriyan.vercel.app`; domain lama 301.
- `prebuild` → `scripts/check-deploy-env.mjs` memvalidasi env.
- Env: `NUXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_KEY` (anon), `NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. `.env*` di-gitignore, tidak pernah ter-commit.
- Node `>=22.18 <25`.

## CI (ADR-001, 2026-10-29)
- `.github/workflows/ci.yml`: npm ci → typecheck → test:seo → build → `npm audit --omit=dev --audit-level=high`. Placeholder env, tanpa secret.
- Audit setelah patch: 0 critical/high; 3 moderate + 5 low butuh Nuxt 4.

## Gap
- Lighthouse production belum pernah berhasil dijalankan (PLAN Fase 3/4).
