# CTO — Index

## Tech stack [DISCOVERED 2026-10-29]
- Nuxt 3.21 (SSR, Vue 3.5) di Vercel; Supabase (Postgres + Auth + Storage) via `@nuxtjs/supabase`.
- `@nuxtjs/seo` (sitemap, robots, schema), Tailwind CSS 4 (Vite plugin), GSAP + Lenis untuk motion publik.
- Markdown: `marked` + `rehype-sanitize` (server untuk publik, client untuk preview admin).
- Arah: portofolio pribadi link-based (metadata + live demo eksternal), satu admin.

## Catatan strategis
- Dependency sisa eksperimen yang tidak dipakai: `react`, `styled-components`, `@types/react`, `@types/styled-components`, `@takumi-rs/core`, `nuxt-og-image` (ogImage dimatikan).
- Nuxt 4 sudah rilis (4.4.x); Nuxt 3 masih dipertahankan sesuai AGENTS.md. Upgrade = keputusan terpisah.

## Fitur aktif
- `portfolio-site` — situs publik + admin studio (lihat `.10x/reviews/2026-10-29-codebase-audit.md`).
