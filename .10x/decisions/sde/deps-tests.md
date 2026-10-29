# SDE — deps-tests (2026-10-29, ADR-003)

## QUAL-4 — dependency dihapus
`react`, `@types/react`, `styled-components`, `@types/styled-components`, `@takumi-rs/core` (renderer OG opsional; OG image dimatikan), `nuxt-og-image` (sudah dibawa `@nuxtjs/seo`). Audit runtime tetap 0 critical/high.

Belum dihapus (kode mati, tidak masuk bundle, butuh keputusan pemilik): `components/ui/FloatingDock.vue`, `components/BrandDockNav.vue`, `components/ui/Loader6.vue`, `components/ui/Skeleton.vue`, `lib/utils.ts` (+ `clsx`, `tailwind-merge`).

## QUAL-2 — Vitest
- `vitest.config.ts` (env node, alias `~`), `npm test`, langkah CI "Unit test" sebelum test:seo.
- 24 test di `tests/`: `markdown` (8, batas XSS v-html), `project` (8), `project-admin` (5, `validateProjectPayload` kini diekspor), `image` (3).

## Bug ditemukan test
- Skema `rehype-sanitize` custom tidak punya `strip` → isi `<style>` lolos sebagai teks terlihat. Fix: `strip: ['script','style','noscript','template']` di `utils/markdown.ts`.

## Verifikasi
- `npm test` 24/24, typecheck, test:seo, build ✅; smoke build lokal: rute publik + case study 200.

## Catatan branch
- Ditumpuk di atas `perf/public-bundle-payload` (PR #6). Setelah PR #6 di-squash-merge, rebase `--onto main` sebelum merge.
