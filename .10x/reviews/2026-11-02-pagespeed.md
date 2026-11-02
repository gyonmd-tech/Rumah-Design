# Review — PageSpeed Insights production (2026-11-02)

URL: https://hygionedarriyan.vercel.app/ · Lighthouse 13.6 · dijalankan pemilik di pagespeed.web.dev.

## Hasil akhir (setelah PR #12, laporan 10.37)
| | Mobile | Desktop |
|---|---|---|
| Performa | 96 | 97 |
| Aksesibilitas | 96 | 96 |
| Praktik Terbaik | 100 | 100 |
| SEO | 100 | 100 |
| Penjelajahan Agentic | 2/2 | 2/2 |
| FCP | 1,1 dtk | 0,4 dtk |
| LCP | 2,7 dtk | 0,9 dtk |

## Riwayat hari ini
| Laporan | Versi | Mobile Perf | Desktop Perf | Catatan |
|---|---|---|---|---|
| 09.12 | reveal hero CSS (PR #9, ADR-006) | – | 99 (LCP 0,3 dtk) | animasi ditolak pemilik |
| 10.14 | GSAP dipulihkan + gate font dibuka (PR #10, #11) | 87 (LCP 3,9 dtk) | 98 | audit agentic: `aria-label` pada `<p>` dari SplitText |
| 10.37 | + aria SplitText hanya di heading (PR #12) | 96 (LCP 2,7 dtk) | 97 | Aksesibilitas 92 → 96, Agentic 1/2 → 2/2 |

Selisih LCP mobile 3,9 → 2,7 dtk antar laporan sebagian besar variasi antar-run (PR #12 tidak mengubah timing).

## Sisa
- LCP mobile 2,7 dtk (ambang "baik" 2,5 dtk): judul menunggu GSAP — pilihan desain pemilik (ADR-007), dioptimalkan sejauh mungkin tanpa mengubah animasi (ADR-008).
- Aksesibilitas 96: daftar audit yang gagal belum dilihat.
