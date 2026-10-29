# Handoff

**Dari:** SDE (public-perf)  **Ke:** QA (uji admin di preview) → DevOps (deploy & cek ISR)
**Tanggal:** 2026-10-29

- ADR-002: Supabase SDK hanya di admin (SPA), API publik pakai client anon tanpa sesi, payload ramping, ISR 60 dtk.
- Wajib diuji manual di preview Vercel oleh pemilik: login (sesi lama tidak terbawa — login ulang), buat/edit/hapus project, upload thumbnail, Media Library (sebelumnya rusak karena `user.id`), simpan settings/SEO.
- Setelah deploy: `curl -I` halaman publik → `x-vercel-cache`; perubahan konten muncul ≤60 dtk.
- Risiko: 404 project ter-cache ≤60 dtk; admin layar kosong singkat sebelum hydrate.
