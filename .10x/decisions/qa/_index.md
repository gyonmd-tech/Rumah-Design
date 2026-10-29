# QA — Index

## Kondisi [DISCOVERED 2026-10-29]
- Tidak ada test runner (unit/e2e). Verifikasi selama ini manual + skrip smoke: `test:seo`, `test:seo:http`, `test:brand:http`.
- Area tanpa test yang paling berisiko: `utils/markdown.ts` (XSS), `composables/useProjectAdmin.ts` (validasi publish), `utils/seo.ts`, `utils/project.ts`.
- Lihat `.10x/reviews/2026-10-29-codebase-audit.md` (QUAL-1, QUAL-2).
