# SDE — security-patch-ci (2026-10-29)

## Dibangun
- `npm audit fix` (tanpa `--force`) + `npm update devalue` (5.9.0 → 5.9.4, masih dalam `^5.9.0` milik Nuxt).
  Hasil `npm audit --omit=dev`: 25 (3 critical, 12 high) → 8 (0 critical, 0 high, 3 moderate, 5 low).
  Perubahan hanya di `package-lock.json`; `package.json` tidak berubah. Contoh: vue/server-renderer 3.5.41→3.5.44, vite 8.2.1→8.3.5, seroval 1.6.2→1.7.3, shell-quote 1.10→1.12, simple-git dihapus dari tree.
- `.github/workflows/ci.yml` sesuai ADR-001: npm ci → typecheck → test:seo → build → audit `--audit-level=high`.

## Sisa / tech debt
- 3 moderate + 5 low hanya bisa ditutup dengan Nuxt 4 / major `@nuxtjs/seo`, `nuxt-og-image` → keputusan terpisah (lihat CTO index).
- `nuxt-og-image` tidak dipakai tapi ikut menarik devalue 6 — kandidat dihapus (QUAL-4).

## Verifikasi
- typecheck ✅, test:seo ✅, build ✅.
- Smoke SSR build produksi lokal dengan Supabase asli: `/`, `/karya`, `/about`, `/api/projects`, `/sitemap.xml`, `/admin/login`, `/project/<slug>` → semua 200.
- Workflow CI belum pernah dijalankan di GitHub (baru jalan setelah push).
