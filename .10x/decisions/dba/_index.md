# DBA — Index

## Schema [DISCOVERED 2026-10-29]
- `public.projects` — CHECK kuat (slug regex, URL https, panjang teks, kardinalitas array, publish-readiness), index `(status, created_at desc)`, trigger `updated_at`.
- `public.site_settings` — key/jsonb, publik hanya `general|seo|socials`, batas 20KB.
- `public.admin_users` — RLS on, tanpa policy (hanya diakses lewat `is_admin()` SECURITY DEFINER, `search_path=''`).
- Storage bucket `project-media` publik, 10MB, MIME whitelist; tulis hanya admin di folder `<uid>/`; listing anonim dicabut.
- 7 migration (`supabase/migrations/202608140001` … `202609120007`).

## Catatan
- `slug` unique sudah ter-index; query detail `slug + status` efisien.
- Tidak ada tipe hasil generate otomatis yang diverifikasi terhadap DB (`types/database.types.ts` ditulis manual?) — perlu dicek saat ubah schema.
