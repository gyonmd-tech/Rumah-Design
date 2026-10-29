# ADR-003: Vitest untuk unit test logic murni

**Status:** Accepted
**Date:** 2026-10-29
**Feature:** deps-tests
**Author:** 10x-Team (Architect + Staff Engineer)

## Context
Logic kritis tanpa test (audit QUAL-2): sanitasi markdown (`utils/markdown.ts`, batas XSS untuk `v-html`), validasi project admin (`composables/useProjectAdmin.ts`), helper ringkasan/URL (`utils/project.ts`), dan URL gambar (`utils/image.ts`). Satu-satunya regresi otomatis adalah `scripts/test-seo.mjs` (assert manual + transpile TS ad-hoc).

## Decision
- Vitest (environment `node`) dengan alias `~` ke root, file `tests/**/*.test.ts`, skrip `npm test`, dijalankan di CI sebelum build.
- Fokus pada fungsi murni; `validateProjectPayload` diekspor agar bisa diuji tanpa Supabase.
- `scripts/test-seo.mjs` dipertahankan (sudah terintegrasi, menguji env guard lewat proses terpisah).

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| `@nuxt/test-utils` (environment nuxt) | Auto-import & komponen bisa diuji | Lebih berat/lambat, setup lebih banyak | Belum perlu: target saat ini fungsi murni |
| `node:test` + transpile manual (pola test-seo) | Nol dependency | Tanpa alias/TS native, assertion & laporan minim | Tidak skala untuk suite yang tumbuh |

## Consequences
### Positive
- Regresi XSS & validasi tertangkap di CI; fondasi untuk test komponen nanti.
### Negative
- Satu devDependency baru (vitest).
### Risks
- Fungsi yang memakai auto-import Nuxt tidak bisa diuji langsung → pindahkan logic murni ke fungsi terpisah bila perlu.
