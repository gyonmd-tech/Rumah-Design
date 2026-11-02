# Spec — Statistik klik live demo & repository

**Tanggal:** 2026-11-02 · **Feature:** `project-click-stats` · **Status:** disetujui pemilik (2026-11-02)

## Tujuan
Pemilik tahu project mana yang paling sering dicoba (live demo) dan dilihat kodenya (repository), total dan 30 hari terakhir, langsung di admin.

## Keputusan dari brainstorm
- Hitung **live demo + repository**, terpisah per project.
- Tampilkan **total + 30 hari terakhir** di tabel project admin, plus kartu ringkasan "Klik demo · 30 hari".
- Pencatatan via **beacon** (link tetap langsung ke demo), bukan redirect atau Vercel Analytics.

## Komponen
1. **Database** — migration baru `202611020008_project_clicks.sql`:
   - Tabel `project_clicks (id bigint identity, project_id uuid → projects on delete cascade, target text check in ('demo','repo'), clicked_at timestamptz default now())` + index `(project_id, clicked_at desc)`.
   - RLS aktif. **Tidak ada policy insert/update/delete**; select hanya `is_admin()`.
   - `record_project_click(p_slug, p_target)` — SECURITY DEFINER, `search_path=''`, executable oleh anon: hanya menulis untuk project `published`, target valid, `repo` hanya jika `repo_url` ada; throttle: abaikan jika project sudah menerima ≥ 30 klik target yang sama dalam 60 detik terakhir.
   - `project_click_stats()` — SECURITY INVOKER (RLS berlaku → hanya admin melihat data): per project `demo_total, demo_30d, repo_total, repo_30d`.
2. **Endpoint** `POST /api/projects/[slug]/click` (Nitro): validasi slug (regex yang sama), body `{ target: 'demo' | 'repo' }`, abaikan user-agent bot umum, panggil RPC via `useServerSupabase()`; selalu balas `204` (tidak membocorkan apakah project ada). POST → tidak tersentuh ISR.
3. **Client** `utils/outbound.ts` + pemakaian di `pages/project/[slug].vue`: pada `click` dan `auxclick` (klik tengah) link demo (tombol + sticker) dan repo → kirim `navigator.sendBeacon` (fallback `fetch` `keepalive`). Dedupe per sesi via `sessionStorage` (`click:<slug>:<target>`); jika storage tidak tersedia, tetap kirim. Tidak mengubah `href`, `target`, `rel`.
4. **Admin** `pages/admin/projects/index.vue`: panggil `project_click_stats()`, gabungkan per project; kolom "Klik" (demo total/30h, repo total/30h) di tampilan tabel, opsi urut "Klik demo (terbanyak)", kartu ringkasan "Klik demo · 30 hari".
5. **Tipe** `types/database.types.ts`: tabel + dua fungsi.

## Privasi
Disimpan hanya project, jenis klik, waktu. Tanpa IP, user-agent, cookie, atau identitas.

## Error handling
- Beacon gagal / endpoint error → diabaikan diam-diam; navigasi ke demo tidak pernah terhambat.
- RPC gagal di admin → kolom menampilkan "–", halaman tetap berfungsi.

## Testing
- Vitest: helper dedupe & validasi target (`utils/outbound.ts`), validasi body endpoint.
- Manual/headless: klik demo di build lokal → baris tercatat di Supabase (via admin) — catatan: migration harus diterapkan pemilik ke Supabase production.

## Di luar scope
Grafik harian, sumber/referrer, statistik per negara.
