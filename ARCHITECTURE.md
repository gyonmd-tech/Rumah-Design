# Architecture — Rumah Design

## 1. Tech Stack
- **Framework**: Nuxt 3 (SSR mode)
- **Backend/DB**: Supabase (Postgres + Auth + Storage) via modul `@nuxtjs/supabase`
- **Styling**: Tailwind CSS (opsional, sesuaikan preferensi)
- **SEO**: `@nuxtjs/seo` (sitemap, robots, OG image, meta)
- **Hosting**: Vercel atau Netlify (keduanya support Nuxt SSR native)

## 2. Alur Data (Ringkasan)
1. Admin login lewat `/admin` → Supabase Auth memverifikasi → session disimpan.
2. Admin submit form project baru → data ditulis ke tabel `projects` di Supabase Postgres, thumbnail diupload ke Supabase Storage.
3. Halaman publik (`/`, `/project/[slug]`) melakukan fetch data project via Supabase client (server-side, saat SSR) → di-render jadi HTML lengkap sebelum sampai ke browser (baik untuk SEO).
4. Vercel/Netlify men-serve hasil SSR, meng-cache halaman statis kalau memungkinkan (ISR/ISG kalau dipakai).

## 3. Struktur Folder (usulan)
```
rumah-design/
├── app.vue
├── nuxt.config.ts
├── components/
│   ├── ProjectCard.vue
│   ├── ProjectFilter.vue
│   ├── ProjectDetailHero.vue
│   ├── CaseStudyBlock.vue
│   └── admin/
│       ├── AdminProjectForm.vue
│       └── AdminProjectTable.vue
├── pages/
│   ├── index.vue
│   ├── project/
│   │   └── [slug].vue
│   ├── about.vue
│   └── admin/
│       ├── login.vue
│       └── projects/
│           ├── index.vue
│           ├── new.vue
│           └── [id]/edit.vue
├── composables/
│   └── useProjects.ts
├── server/
│   └── (opsional, kalau butuh API route custom)
├── supabase/
│   └── migrations/
├── public/
└── docs/
    ├── PRD.md
    ├── DESIGN.md
    ├── ARCHITECTURE.md
    ├── CONTEXT.md
    ├── AGENTS.md
    └── PLAN.md
```

## 4. Skema Database (Supabase/Postgres)

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text, -- markdown
  live_url text not null,
  repo_url text,
  category text not null check (category in (
    'landing-page','web-app','dashboard','portfolio','e-commerce','blog-editorial',
    'saas','ai-tool','mobile-app','game-interactive','productivity','experimental','lainnya'
  )),
  style_tags text[] default '{}', -- mis. Minimal, Dark, Bold — ala Awwwards/Onepagelove
  tech_stack text[] default '{}',
  thumbnail_url text,
  preview_media_url text, -- opsional, GIF/video singkat untuk hover preview (v2)
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: publik hanya bisa SELECT project dengan status = 'published'
alter table projects enable row level security;

create policy "public read published"
  on projects for select
  using (status = 'published');

-- Implementasi aktual memakai helper security-definer `public.is_admin()`.
-- Akses tulis tidak diberikan ke semua user authenticated; hanya UUID yang
-- tercatat di `public.admin_users` yang lolos policy INSERT/UPDATE/DELETE.

-- File Storage ditulis ke folder `<auth.uid()>/...`; policy insert/update/delete
-- memverifikasi admin sekaligus kepemilikan folder. Konfigurasi publik dibatasi
-- pada key `general`, `seo`, dan `socials`.
```

## 5. Auth
- Supabase Auth dengan email/password, hanya 1 akun (pemilik).
- Middleware Nuxt (`middleware/admin.ts`) melindungi semua route di bawah `/admin` dan memverifikasi `public.is_admin()`.

## 6. SEO Setup
- `@nuxtjs/seo` di-config di `nuxt.config.ts` dengan `site.url`, default OG image.
- Tiap halaman `/project/[slug]` set `useSeoMeta()` dinamis dari data project (title, description, og:image dari `thumbnail_url`).
- `sitemap.xml` auto-generate dari daftar slug project berstatus `published`.

## 7. Deployment
- Repo di-connect ke Vercel atau Netlify (pilih salah satu sebagai primary — disarankan konsisten, jangan dobel, supaya tidak bingung environment variable).
- Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (dan service role key kalau dipakai di server route, disimpan sebagai secret, jangan di client).
- Auto-deploy tiap push ke branch `main`.
