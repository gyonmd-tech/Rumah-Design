# ADR-007: Kembalikan reveal hero GSAP per huruf

**Status:** Accepted
**Date:** 2026-11-02
**Feature:** hero-reveal
**Author:** 10x-Team (atas keputusan pemilik)
**Supersedes:** ADR-006

## Context
ADR-006 mengganti reveal judul hero (GSAP SplitText, huruf naik dari mask, stagger 18 ms) dengan animasi CSS per baris demi LCP. Pemilik menilai animasi CSS itu kaku dan tidak smooth, dan meminta versi sebelumnya dikembalikan. PageSpeed resmi (2 Nov 2026, desktop) dengan versi CSS: Performa 99, FCP/LCP 0,3 dtk, TBT 70 ms.

## Decision
`pages/index.vue` dikembalikan ke versi sebelum PR #9 (`data-reveal="chars"`, SplitText). Bagian lain PR #9 tetap: CSP berbasis hash (ADR-005), `js-motion` hanya dirender server, penghapusan kode mati.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Pertahankan CSS per baris (ADR-006) | LCP lab mobile lebih cepat | Rasa animasi tidak sesuai desain pemilik | Ditolak pemilik |
| CSS per huruf dengan mask | Mirip versi GSAP | Judul tidak terhitung sebagai LCP (diukur di ADR-006) | Tidak memberi manfaat LCP |

## Consequences
### Positive
- Karakter motion hero kembali seperti desain asli.
### Negative
- LCP mobile kembali bergantung pada GSAP + gate `pageReady` (lab sebelumnya ±8,7 dtk pada 4× CPU / 4G lambat). Desktop tidak terdampak berarti.
### Risks
- Jika skor mobile PageSpeed turun signifikan, opsi yang menjaga rasa animasi: lepaskan gate font untuk hero saja, atau inline GSAP lebih awal — dibahas dulu dengan pemilik.
