# Security — Index

## Postur saat ini [DISCOVERED 2026-10-29]
**Kuat:**
- RLS di semua tabel; tulis hanya via `public.is_admin()` (SECURITY DEFINER, `search_path=''`). `admin_users` tanpa policy → tak terbaca dari client.
- Storage: tulis terbatas `<uid>/`, listing anonim dicabut, MIME + 10MB limit.
- Markdown disanitasi `rehype-sanitize` (whitelist tag/atribut/protokol), link dipaksa `noopener noreferrer`.
- Header: CSP, XFO DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP; admin `no-store` + noindex.
- `next` redirect login dibatasi prefix `/admin/`. Kontak via `mailto:` (tidak ada endpoint publik yang bisa di-spam).
- Hanya anon key yang dipakai; `.env*` tidak pernah ter-commit.

**Gap:**
- ~~`npm audit` critical/high~~ — ditutup 2026-10-29 (security-patch-ci). Sisa 3 moderate + 6 low menunggu Nuxt 4; CI menahan regresi ke level high, kini termasuk devDependencies (fonts-hero).
- Advisory moderate Nuxt: route rules (`ssr`, `headers`, `redirect`) dilewati untuk path beda huruf besar/kecil (mis. `/Admin/...`). Dampak di sini rendah (admin tetap dijaga RLS + middleware), tapi header `no-store` admin bisa terlewat — tertutup saat upgrade Nuxt 4.
- ~~CSP `script-src 'unsafe-inline'`~~ — diganti CSP berbasis hash per render (ADR-005, 2026-10-31); nonce ditolak karena tidak kompatibel dengan ISR.
- `img-src https:` & markdown `img` mengizinkan gambar eksternal (http juga) — risiko rendah karena hanya admin yang menulis.
- Tidak ada HSTS eksplisit (Vercel menambahkan default di domain vercel.app; cek ulang saat custom domain).
- Middleware admin melakukan `signOut()` saat RPC `is_admin` error sementara (UX, bukan security).
