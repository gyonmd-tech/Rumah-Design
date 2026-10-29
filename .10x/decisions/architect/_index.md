# Architect — Index

## Struktur [DISCOVERED 2026-10-29]
- **Publik (SSR):** `pages/{index,karya,about,contact,proses}.vue`, `pages/layanan/*`, `pages/project/[slug].vue`.
  Data lewat Nitro API `server/api/projects`, `server/api/projects/[slug]`, `server/api/site-settings`,
  `server/api/__sitemap__/urls` → `serverSupabaseClient` (anon key + RLS).
- **Admin (`/admin/**`):** client langsung ke Supabase via `useSupabaseClient` (`composables/useProjectAdmin.ts`);
  guard `middleware/admin.ts` (session + RPC `is_admin`). Batas keamanan sesungguhnya = RLS.
- **Konten statis terstruktur:** `utils/portfolio-content.ts`, `utils/about-content.ts`, `utils/identity.ts`.
- **Motion:** `plugins/motion.client.ts` (GSAP ticker + Lenis, page-ready gate), `composables/useSiteMotion.ts`.
- **Gambar:** `utils/image.ts` menulis ulang URL Storage ke `/storage/v1/render/image` (Supabase Image Transformations).

## Batas & aliran data
- Publik hanya membaca `status='published'` (filter di query + RLS).
- Kontak = `mailto:` (tidak ada endpoint tulis publik).
- Cache: header `s-maxage=60, swr=300` pada API project; `routeRules` cache untuk sitemap (1j) & site-settings (5m).

## Catatan
- SSR halaman memanggil API internal → tiap render publik tetap query Supabase (header CDN tidak berlaku untuk `$fetch` internal).
