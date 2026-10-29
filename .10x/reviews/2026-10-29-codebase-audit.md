# Audit Codebase — Hygione Darriyan (Rumah Design)

**Tanggal:** 2026-10-29 · **Branch:** `perf/images-layanan-refinements` · **Metode:** baca kode + migration, inspeksi build `.output` (2 Okt), `npm audit --omit=dev`, `npm outdated`, `nuxt typecheck`.

Prioritas: **P0** segera · **P1** dampak besar · **P2** hardening · **P3** kebersihan.

---

## 1. Performa

| # | Pri | Temuan | Bukti | Rekomendasi |
|---|-----|--------|-------|-------------|
| PERF-1 | P1 | Entry JS publik ±210 KB gzip (612 KB raw). Berisi Supabase Auth (GoTrue) + Realtime, GSAP + 5 plugin, Lenis, lucide. Pengunjung publik tidak butuh Supabase client sama sekali. | `.output/public/_nuxt/BVuEErHO.js` | Buat Supabase client tidak dimuat di rute publik (mis. plugin client admin-only / lazy import di layout admin), lalu ukur ulang. Ini kemungkinan kemenangan LCP/TBT terbesar. |
| PERF-2 | P1 | `/api/projects` mengirim `description` (markdown case study, s.d. 50 KB/project) padahal halaman list tidak memakainya → membengkakkan payload SSR (`__NUXT_DATA__`) di setiap halaman publik. | `server/api/projects/index.get.ts:12`, tidak ada pemakaian `.description` di halaman list | Hapus `description` dari select; jika butuh ringkasan, kirim `excerpt` terpotong dari server. |
| PERF-3 | P1 | Detail project mengirim `description` mentah **dan** `description_html` — konten digandakan; mentah hanya dipakai untuk excerpt. | `server/api/projects/[slug].get.ts:31`, `pages/project/[slug].vue:41,122` | Hitung `excerpt` di server, buang `description` mentah dari respons. |
| PERF-4 | P1 | Gambar memakai Supabase **Image Transformations** (`/render/image`) — fitur berbayar (Pro). Jika plan Free, semua thumbnail bisa gagal. | `utils/image.ts` | Verifikasi plan & respons 200 di production. Jika Free: fallback ke URL object, atau pre-generate ukuran saat upload. |
| PERF-5 | P2 | SSR tiap request memanggil Supabase (header `s-maxage` tak berlaku untuk `$fetch` internal). Halaman HTML sendiri tidak di-cache CDN. | `server/api/projects/*.ts` | `routeRules` `isr`/`swr` untuk halaman publik (`/`, `/karya`, `/project/**`, `/layanan/**`) di Vercel. |
| PERF-6 | P2 | Google Fonts CSS render-blocking; Inter Tight memuat seluruh axis 100–900 + italic. | `nuxt.config.ts:106` | Self-host via `@nuxt/fonts` atau subset axis yang benar-benar dipakai; preload woff2 utama. |
| PERF-7 | P2 | Handler `pointermove` di hero memanggil `getBoundingClientRect` untuk setiap karakter tiap event → layout thrash. | `pages/index.vue:32-40` | Cache rect saat `pointerenter`/resize, throttle via rAF. |
| PERF-8 | P3 | `public/fonts/ARQINO.otf` + `.html/.css` ikut dideploy; `hero-profile.webp` 478 KB (masih di srcset 1254w). | `public/fonts`, `public/images` | Hapus file non-woff2; kompres varian 1254w. |
| PERF-9 | P1 | Lighthouse production belum pernah berhasil (PLAN Fase 3/4). | `PLAN.md:34,59,103` | Jalankan PageSpeed Insights/Lighthouse CI sebagai baseline sebelum & sesudah PERF-1..3. |

## 2. Security

| # | Pri | Temuan | Rekomendasi |
|---|-----|--------|-------------|
| SEC-1 | P0 | `npm audit --omit=dev`: 25 kerentanan (3 critical, 12 high). Runtime: `devalue`, `vue`, `@vue/server-renderer`, `seroval`, `sharp`. Tooling: `simple-git`, `shell-quote`, `vite`, `launch-editor`. Semua punya fix tanpa `--force`. | `npm audit fix`, update `vue`/`nuxt` patch, lalu typecheck + build + smoke test. |
| SEC-2 | P2 | CSP `script-src 'self' 'unsafe-inline'` — CSP tak menahan XSS inline. | Nonce-based CSP (`nuxt-security` atau hook Nitro). Uji hydration + inline script `js-motion` + JSON-LD. |
| SEC-3 | P3 | Markdown mengizinkan `img src` `http:`/host apa pun (tracking pixel, mixed content). Hanya admin yang menulis → risiko rendah. | Batasi `src` ke `https` (+ opsional host Supabase). |
| SEC-4 | P3 | Middleware admin `signOut()` saat RPC `is_admin` gagal karena jaringan. | Bedakan `error` (tampilkan retry) vs `data === false` (sign-out). |
| SEC-5 | P3 | HSTS tidak di-set eksplisit. | Tambahkan saat pindah ke custom domain. |

**Yang sudah baik:** RLS benar di semua tabel; `is_admin()` SECURITY DEFINER dengan `search_path=''`; `admin_users` tak terbaca client; Storage terbatas folder `<uid>`, listing anonim dicabut; sanitasi markdown whitelist; header keamanan lengkap; admin `no-store`/noindex; validasi slug di API; `next` redirect dibatasi; tidak ada secret di repo/riwayat git; kontak via `mailto:` (tak ada endpoint spam).

## 3. Kualitas kode & maintainability

| # | Pri | Temuan | Rekomendasi |
|---|-----|--------|-------------|
| QUAL-1 | P0 | Tidak ada CI. Typecheck/build/test SEO tidak jalan otomatis per PR. | GitHub Actions: `npm ci` → `typecheck` → `build` → `test:seo`. |
| QUAL-2 | P1 | Tidak ada unit/e2e test. Logic kritis (sanitasi markdown, `utils/project.ts`, `utils/seo.ts`, validasi `useProjectAdmin`) tanpa test. | Vitest untuk `utils/` + test XSS untuk `renderSafeMarkdown`; Playwright smoke opsional. |
| QUAL-3 | P2 | Tidak ada ESLint/Prettier. | `@nuxt/eslint` dengan config minimal. |
| QUAL-4 | P3 | Dependency tak terpakai: `react`, `styled-components`, `@types/react`, `@types/styled-components`, `@takumi-rs/core`, `nuxt-og-image` (dimatikan). | Hapus → install & build lebih cepat, permukaan audit lebih kecil. |
| QUAL-5 | P3 | Folder sampah di root: `3001/` (berisi `node_modules`), `.codex-staging/`. `ARCHITECTURE.md` §3 struktur folder sudah usang. | Bersihkan; perbarui dokumen. |
| QUAL-6 | P3 | `AdminProjectForm.vue` 907 baris. | Pecah per tab saat berikutnya disentuh. |

## 4. SEO / Produk (status)
- Fondasi SEO matang (canonical, JSON-LD, sitemap gambar, robots, admin noindex).
- Tertunda di PLAN: Lighthouse > 90, custom domain, status sitemap di Search Console, foto profil, review copy hero.

## 5. Ops / reliability
- Retry 2× + timeout 10 dtk ke Supabase dan fallback settings sudah ada.
- Tidak ada monitoring error/uptime (Vercel Analytics/Speed Insights, Sentry). Rekomendasi minimal: Vercel Speed Insights untuk Core Web Vitals nyata.

## Urutan kerja yang disarankan
1. **SEC-1 + QUAL-1** — patch dependency + CI dasar (fondasi aman sebelum develop lanjut).
2. **PERF-4** — verifikasi Image Transformations (potensi gambar rusak).
3. **PERF-9 baseline → PERF-2/3 → PERF-1 → PERF-5** — ukur, kurangi payload, keluarkan Supabase dari bundle publik, cache halaman.
4. **QUAL-2/QUAL-4** — test util kritis, hapus dependency mati.
5. **SEC-2** — CSP nonce.
