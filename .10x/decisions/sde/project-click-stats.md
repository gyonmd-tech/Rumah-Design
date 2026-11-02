# SDE — project-click-stats (2026-11-02, ADR-009)

## Dibangun
- `supabase/migrations/202611020008_project_clicks.sql` — tabel, RLS, `record_project_click`, `project_click_stats`.
- `utils/outbound.ts` — `isClickTarget`, `isLikelyBot`, `firstClickInSession`, `trackOutboundClick` (sendBeacon → fallback fetch keepalive).
- `server/api/projects/[slug]/click.post.ts` — validasi slug/target, filter bot, RPC, selalu 204.
- `pages/project/[slug].vue` — `click` + `auxclick` (hanya tombol tengah) pada tombol demo, sticker demo, tombol repo.
- `pages/admin/projects/index.vue` — kartu "Klik Demo · 30 Hari", kolom "Klik Demo · Repo" (total + 30 hari) di tabel, urut "Klik Demo (Terbanyak)". Jika RPC gagal → "–".
- `types/database.types.ts` — `ClickTarget`, `ProjectClickStats`, tabel & fungsi.
- `tests/outbound.test.ts` — 5 test (total 35).

## Deviasi dari spec
- Kolom klik hanya di tampilan **Tabel** (default); Grid/List belum.

## Butuh pemilik
- Terapkan migration ke Supabase production sebelum/bersamaan merge (tanpa migration: endpoint tetap 204, admin menampilkan "–").
