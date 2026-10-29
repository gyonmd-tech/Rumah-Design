# Staff Engineer — Index

## Konvensi [DISCOVERED 2026-10-29]
- TypeScript, `<script setup lang="ts">`, auto-import Nuxt untuk `composables/` dan `utils/`.
- Komponen publik di `components/site/` (prefix `Site*`), admin di `components/admin/`, UI umum di `components/ui/`.
- Dokumen produk berbahasa Indonesia; prioritas sumber kebenaran: PRD > DESIGN > ARCHITECTURE > PLAN.
- Migration baru untuk setiap perubahan schema (jangan edit migration lama).
- Motion deklaratif via atribut `data-reveal`, `data-scroll-reveal`; reduced-motion dihormati.

## Gap
- Tidak ada linter/formatter terkonfigurasi (ESLint/Prettier).
- Tidak ada unit/e2e test; hanya skrip smoke (`scripts/test-seo.mjs`, `smoke-*.mjs`).
- `lib/utils.ts` (clsx + tailwind-merge) peninggalan pola shadcn/React.
