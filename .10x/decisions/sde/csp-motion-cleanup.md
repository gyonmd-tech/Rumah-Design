# SDE — csp-motion-cleanup (2026-10-31, ADR-005, ADR-006)

## Alat ukur lab (scratchpad, tidak masuk repo)
Chrome lokal via CDP: 4× CPU, 1,6 Mbps / 150 ms RTT, 412×823 @2x, cache off; median 3 run; juga mencatat elemen LCP, long task, pelanggaran CSP (`securitypolicyviolation`), dan error JS. Dipakai karena PageSpeed API 429 dan pengguna tidak ingin `npx lighthouse`.

## Temuan pengukuran (baseline = main 26da909)
- LCP production 8,7 dtk / lokal 11,0 dtk; reduced-motion lokal 4,0 dtk → reveal JS menahan LCP ±7 dtk.
- TBT ±5,4–6,9 dtk dengan/ tanpa motion → bukan animasi. Trace: long task awal didominasi `Layout` 450–600 ms (DOM hanya 531 elemen; layout steady-state 7 ms) → biaya layout/shaping teks awal.

## Dibangun
1. **LCP (ADR-006):** judul hero di-split saat SSR, reveal per baris via CSS; GSAP tidak menyentuh judul. LCP lab 11,0 → 5,2 dtk (diukur via injeksi CSS pada build yang sama; diverifikasi ulang setelah build — lihat di bawah).
2. **Kode mati:** hapus `components/ui/FloatingDock.vue`, `components/BrandDockNav.vue`, `components/ui/Loader6.vue`, `components/ui/Skeleton.vue`, `lib/utils.ts`, dependency `clsx`, `tailwind-merge`.
3. **SEC-2 (ADR-005):** `utils/csp.ts` (builder + hash script inline), `server/plugins/csp.ts` (hook `render:response`), `nuxt.config.ts` memakai builder yang sama untuk header dasar. `script-src` tanpa `unsafe-inline`. 6 unit test baru (`tests/csp.test.ts`) → total 30.

## Tidak dikerjakan (dengan alasan)
- Lazy-load GSAP: data trace menunjukkan TBT didominasi layout, bukan JS; LCP sudah lepas dari GSAP.
- Upgrade Nuxt 4: bertentangan dengan AGENTS.md ("Pertahankan Nuxt 3") — butuh keputusan pemilik.
- Custom domain, Search Console, foto profil: butuh akun/aset pemilik.
