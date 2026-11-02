# DBA — project-click-stats (2026-11-02)

- Tabel `project_clicks` (append-only), FK `on delete cascade` ke `projects`.
- Index `(project_id, target, clicked_at desc)` — melayani throttle per menit dan agregasi 30 hari.
- RLS: select hanya `is_admin()`; tanpa policy tulis. Tulis hanya via `record_project_click` (SECURITY DEFINER, `search_path=''`), grant ke anon/authenticated.
- `project_click_stats()` SECURITY INVOKER → RLS berlaku; grant hanya authenticated.
- Throttle: ≤ 30 baris per project+target per menit.
- Retensi: belum ada; volume kecil. Opsi nanti: hapus baris > 12 bulan via pg_cron atau saat agregasi.
- Penerapan: migration baru, tidak mengubah migration lama.
