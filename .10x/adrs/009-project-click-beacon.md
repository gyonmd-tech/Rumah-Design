# ADR-009: Statistik klik project via beacon + fungsi Supabase

**Status:** Accepted
**Date:** 2026-11-02
**Feature:** project-click-stats
**Author:** 10x-Team (Architect + Security + DBA)

## Context
Pemilik ingin tahu klik live demo dan repository per project (total + 30 hari) di admin. Batasan: halaman publik tidak memuat Supabase SDK (ADR-002) dan di-cache ISR; hanya anon key tersedia di server (AGENTS.md: tanpa service-role); akses tulis publik ke tabel tidak diizinkan.

## Decision
- Client mengirim `sendBeacon` ke `POST /api/projects/[slug]/click`; endpoint memanggil RPC `record_project_click` (SECURITY DEFINER, validasi + throttle) dengan client anon tanpa sesi.
- Tabel `project_clicks` tanpa policy tulis; baca hanya admin. Agregasi lewat `project_click_stats()` (SECURITY INVOKER).
- Dedupe per sesi di client; tanpa data pribadi.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Redirect `/go/[slug]` | Jalan tanpa JS | Hop tambahan, URL demo tersembunyi, bot ikut terhitung | Ditolak pemilik |
| Vercel Web Analytics custom events | Tanpa DB | Butuh plan Pro; data tidak di admin | Plan Hobby |
| Insert langsung dari client ke tabel (policy anon) | Tanpa endpoint | Butuh SDK di halaman publik (melanggar ADR-002); policy tulis publik | Bertentangan dengan arsitektur |
| Kolom counter di `projects` | Query admin sederhana | Tidak bisa hitung 30 hari; UPDATE publik pada tabel utama | Kebutuhan 30 hari |

## Consequences
### Positive
- Link & UX tidak berubah; tanpa PII; hanya fungsi tervalidasi yang bisa menulis.
### Negative
- Siapa pun yang tahu endpoint/RPC bisa menambah klik palsu (dibatasi throttle 30/menit per project per target). Angka adalah indikator, bukan audit.
- Migration harus diterapkan manual ke Supabase production.
### Risks
- Tabel tumbuh tanpa batas — volume portofolio kecil; retensi bisa ditambah nanti (hapus > 1 tahun).
