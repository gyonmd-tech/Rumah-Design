# Architect — public-perf (ADR-002)

- Publik: SSR + ISR 60 dtk, data via `server/api/*` → `useServerSupabase()` (anon, tanpa sesi). Tidak ada state per-user di HTML publik.
- Admin: SPA (`ssr:false`), `useSupabaseClient()` admin-only, sesi di localStorage, guard = middleware + RLS.
- Kontrak API: `/api/projects` → `ProjectSummary` tanpa `description`; `/api/projects/[slug]` → `Project` tanpa `description` + `summary` + `description_html`.
- Failure mode: Supabase down → ISR tetap melayani HTML terakhir; revalidasi gagal tidak menimpa cache.
