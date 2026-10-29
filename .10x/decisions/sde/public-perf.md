# SDE — public-perf (2026-10-29, ADR-002)

## Dibangun
- `@nuxtjs/supabase` dilepas → `@supabase/supabase-js@^2.112.3` langsung.
  - `server/utils/supabase.ts` `useServerSupabase()` (anon, tanpa sesi) dipakai 4 API server.
  - `composables/useSupabase.ts` `useSupabaseClient()` / `useSupabaseUser()` (objek `User`) untuk admin.
  - `middleware/admin.ts` membaca sesi via `auth.getSession()` lalu RPC `is_admin`.
  - `runtimeConfig.public.supabase.{url,key}` dari `SUPABASE_URL`/`SUPABASE_KEY` (env Vercel tak berubah).
- `nuxt.config.ts`: `/admin/**` `ssr:false`; ISR 60 dtk untuk halaman publik (`/karya` `allowQuery: kategori,gaya,q`);
  hook `build:manifest` membuang dynamic import admin dari entry agar tidak di-prefetch di halaman publik.
- `/api/projects` tanpa `description`; `/api/projects/[slug]` → `summary` + `description_html` (tipe `ProjectDetail`).
- Bug fix: `useProjectAdmin` & `pages/admin/media.vue` kini sama-sama memakai `user.id` (sebelumnya media membaca `id` dari JWT claims → selalu kosong).

## Hasil (metode sama: HTML + chunk gzip)
| Halaman | Initial JS (prod → baru) | Payload SSR | HTML gz |
|---|---|---|---|
| `/` | 235.0 → 173.9 KB | 29.4 → 1.7 KB | 48.2 → 38.4 KB |
| `/karya` | 228.1 → 167.0 KB | 29.4 → 1.7 KB | 45.3 → 35.4 KB |
| `/project/<slug>` | 227.3 → 166.2 KB | 32.7 → 1.7 KB | 40.8 → 31.6 KB |
- Prefetch admin/SDK di halaman publik: 9.5 KB → 0. `/api/projects`: 27.3 → 4.7 KB.

## Verifikasi
- typecheck ✅, test:seo ✅, build ✅.
- Smoke build lokal (Supabase asli): semua rute publik 200, `/project/tidak-ada` 404, sitemap/robots 200.
- Browser: beranda hydrate tanpa error & 0 chunk SDK termuat; `/karya?kategori=web-app` filter SSR benar; navigasi ke detail project OK (summary + case study); `/admin/projects` tanpa sesi → `/admin/login?next=/admin/projects`.

## Belum terverifikasi
- Login admin + CRUD + upload media (butuh kredensial pemilik) — uji di preview Vercel.
- ISR (`x-vercel-cache`) hanya bisa dicek setelah deploy.

## Tech debt
- Admin wajib login ulang sekali (sesi pindah ke localStorage).
- GSAP + plugin (~bagian terbesar entry) masih global; kandidat lazy-load per halaman.
