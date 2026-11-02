# ADR-008: Gate reveal terbuka saat load pertama

**Status:** Accepted
**Date:** 2026-11-02
**Feature:** hero-reveal
**Author:** 10x-Team (Architect + Staff Engineer)
**Related:** ADR-007

## Context
Setelah reveal GSAP per huruf dikembalikan (ADR-007), LCP mobile kembali menunggu: JS (GSAP di entry) → hydration → gate `pageReady`. Pada load pertama gate menunggu `document.fonts.ready` (maks. 900 ms). Pemilik meminta LCP dipercepat **tanpa mengubah rasa animasi**.

## Decision
Di `plugins/motion.client.ts`, gate dibuat sudah terbuka pada load pertama (`Promise.resolve()`). Transisi antarhalaman tetap `armGate()` → `releaseGate()` seperti sebelumnya. Menunggu font tidak diperlukan karena semua reveal memakai `SplitText` dengan `autoSplit: true` dan mengembalikan tween dari `onSplit`, sehingga saat font swap GSAP memecah ulang teks dan melanjutkan animasi di progres yang sama.

Hasil lab (Chrome lokal via CDP, 4× CPU, 1,6 Mbps / 150 ms, build lokal tanpa kompresi, median 5): LCP 6,2 dtk (versi yang sama dengan gate: 11,0 dtk lokal; production 8,7–9,5 dtk). Elemen LCP tetap judul hero; 0 pelanggaran CSP; reveal di /, /about, /karya, /layanan selesai normal.

## Alternatives Considered
| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| Reveal CSS (ADR-006) | LCP terbaik | Rasa animasi ditolak pemilik | Superseded |
| Mutasi DOM hero sebelum hydration | Lebih awal lagi | Risiko hydration mismatch dengan SplitText | Terlalu berisiko |
| Biarkan gate font | Tidak ada perubahan | LCP mobile ±9 dtk | Tujuan pemilik |

## Consequences
### Positive
- LCP turun tanpa mengubah easing, durasi, atau stagger.
### Negative
- Huruf dapat mulai beranimasi dengan font fallback lalu di-split ulang saat font asli tiba (fallback metrik @nuxt/fonts meminimalkan perubahan bentuk).
### Risks
- Jika ada reveal baru yang tidak memakai `autoSplit` / tidak mengembalikan tween, font swap bisa menggeser baris — pertahankan pola di `useSiteMotion`.
