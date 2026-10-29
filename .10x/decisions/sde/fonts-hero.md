# SDE — fonts-hero (2026-10-29, ADR-004)

## PERF-6 — font self-host
- `@nuxt/fonts@0.14.0` dengan `families` eksplisit: Inter Tight (wght 250–900, normal+italic), Instrument Serif (400, normal+italic), subset latin + latin-ext. Font admin di-set `provider: 'none'`.
- Link stylesheet + preconnect Google Fonts dihapus dari head publik.
- Build mengunduh 8 woff2 (328 KB total, browser hanya mengambil subset yang dibutuhkan) ke `/_fonts/`, `cache-control: public, max-age=31536000, immutable`; modul menambah fallback metrik (`"Inter Tight Fallback: sans-serif"`).
- Browser lokal: 0 request ke googleapis/gstatic; 3 file dari `/_fonts` termuat di beranda; tampilan identik.

## PERF-7 — hero pointermove
- `pages/index.vue`: posisi pointer terbaru diproses sekali per frame via rAF; semua rect dibaca dulu, baru setter GSAP dipanggil; frame dibatalkan saat pointerleave/unmount.
- Verifikasi (rAF dipalsukan ke timer karena pane browser tersembunyi): 100 pointermove dalam satu frame → 7 pembacaan rect (kode lama: 700).
- Belum terverifikasi visual: animasi `--wght` saat hover (butuh layar ≥992px dengan tab terlihat) — cek manual di preview.

## Tambahan keamanan
- `vitest` 3.2.7 → 5.0.5: menutup `tinypool` critical (GHSA-5gmw-xhrv-c9v3, GHSA-85c8-ppgw-ccpr) — devDependency dari PR #7 yang lolos karena gate CI hanya `--omit=dev`.
- CI kini `npm audit --audit-level=high` (termasuk devDependencies).
- Audit penuh: 9 (6 low, 3 moderate), 0 critical/high. `esbuild` low baru datang dari `fontless` (dipakai saat build, bukan dev server) — diterima.

## Verifikasi
- `npm test` 24/24 (Vitest 5), typecheck 0 error, test:seo, build ✅.
