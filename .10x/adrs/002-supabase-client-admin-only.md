# ADR-002: Supabase client hanya di admin, halaman publik di-cache ISR

**Status:** Accepted
**Date:** 2026-10-29
**Feature:** public-perf
**Author:** 10x-Team (Architect + Staff Engineer)

## Context
Audit 2026-10-29 (PERF-1/2/3/5). Baseline build lokal:
- Initial JS gzip: `/` 244 KB, `/karya` 238 KB, `/project/<slug>` 237 KB. Entry chunk memuat `@supabase/supabase-js` (Auth + Realtime + Postgrest + Storage) karena plugin client `@nuxtjs/supabase` didaftarkan global, padahal pengunjung publik tak pernah memakainya.
- Plugin server modul membaca cookie sesi di **setiap** SSR publik dan menaruh user ke state → halaman publik tidak aman di-cache bersama (shared cache).
- Payload SSR 29–33 KB/halaman: `/api/projects` membawa markdown `description` penuh yang tak dipakai; detail project mengirim `description` + `description_html`.
- Bug terkait: `useSupabaseUser()` modul mengembalikan JWT claims (`sub`), sedangkan `pages/admin/media.vue` membaca `user.id` → Media Library kosong/upload gagal.

## Decision
1. **Lepas `@nuxtjs/supabase`.** Ganti dengan dua titik masuk kecil:
   - `server/utils/supabase.ts` → `useServerSupabase()`: client anon singleton tanpa sesi/cookie untuk API publik (RLS tetap batas akses).
   - `composables/useSupabase.ts` → `useSupabaseClient()` / `useSupabaseUser()` (nama dipertahankan) untuk admin; diimpor hanya oleh halaman/layout/middleware admin sehingga Vite menaruhnya di chunk admin. `useSupabaseUser()` kini berisi objek `User` (`id`, `email`).
2. **Admin jadi SPA** (`routeRules['/admin/**'].ssr = false`). Sesi disimpan oleh supabase-js (localStorage); middleware membaca sesi lalu memverifikasi `is_admin` via RPC.
3. **Payload ramping:** list project tanpa `description`; detail project mengirim `summary` (ringkasan teks dari server) + `description_html`, tanpa markdown mentah.
4. **ISR Vercel 60 dtk** untuk halaman publik (`/`, `/karya` dengan `allowQuery` filter, `/about`, `/contact`, `/proses`, `/layanan/**`, `/project/**`).

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Tetap pakai modul, filter plugin client lewat hook `app:resolve` | Perubahan kecil | Bergantung internal modul; `useSupabaseClient` modul membaca `$supabase` yang tak lagi ada; plugin server tetap baca cookie tiap request | Rapuh terhadap upgrade modul, tidak membuka jalan ke cache |
| Lazy `import()` supabase-js di plugin custom tapi admin tetap SSR | Admin tetap SSR | Butuh sinkronisasi sesi cookie server↔client sendiri | Admin tidak butuh SEO/SSR; kompleksitas tanpa manfaat |
| Tidak mengubah apa pun, hanya ISR | Murah | ISR + plugin server yang menaruh user ke state = risiko bocor state antar pengunjung; bundle tetap berat | Tidak aman & tidak menyelesaikan PERF-1 |

## Consequences
### Positive
- Supabase SDK keluar dari JS awal publik; payload SSR lebih kecil; HTML publik dilayani dari CDN (TTFB rendah, tahan outage singkat Supabase).
- Bug Media Library (`user.id`) tertutup.
### Negative
- Admin wajib login ulang sekali (sesi pindah dari cookie ke localStorage).
- Perubahan project/settings butuh ≤60 dtk (+ revalidasi) untuk tampil di halaman publik.
- Admin tidak lagi SSR (layar kosong singkat sebelum hydrate) — diterima, area privat.
### Risks
- ISR menyajikan 404 project yang di-cache hingga kedaluwarsa → diterima (60 dtk).
- Typing `createClient<Database>` berbeda dari modul → diverifikasi lewat typecheck.

## Dependencies
- ADR-001 (CI) memverifikasi typecheck/build.
- Membatasi: fitur publik masa depan yang butuh sesi user harus memakai endpoint terpisah yang tidak di-cache.
