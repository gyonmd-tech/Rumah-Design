-- Migration: 202608190002_admin_enhancements.sql
-- Description: Add SEO fields to projects and create site_settings table for admin configuration

begin;

-- 1. Add SEO fields to public.projects (if not exists)
alter table public.projects
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists focus_keyword text;

-- 2. Create site_settings table for global site configuration, SEO defaults & profile
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Apply set_updated_at trigger to site_settings
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- Enable RLS on site_settings
alter table public.site_settings enable row level security;

-- Drop existing policies if any to avoid collision
drop policy if exists "site settings are publicly readable" on public.site_settings;
drop policy if exists "admins can insert site settings" on public.site_settings;
drop policy if exists "admins can update site settings" on public.site_settings;
drop policy if exists "admins can delete site settings" on public.site_settings;

-- Public can read site_settings
create policy "site settings are publicly readable"
on public.site_settings
for select
to anon, authenticated
using (true);

-- Only admins can modify site_settings
create policy "admins can insert site settings"
on public.site_settings
for insert
to authenticated
with check (public.is_admin());

create policy "admins can update site settings"
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins can delete site settings"
on public.site_settings
for delete
to authenticated
using (public.is_admin());

-- Seed default settings if not exists
insert into public.site_settings (key, value)
values
  ('general', '{"site_name": "Rumah Design", "tagline": "Showcase karya frontend & narasi proses desain", "bio": "Product designer & frontend engineer yang fokus pada kerajinan visual, interaksi presisi, dan arsitektur web modern.", "contact_email": "hello@rumahdesign.dev"}'::jsonb),
  ('seo', '{"default_title": "Rumah Design — Portofolio & Case Study Frontend", "default_description": "Kumpulan karya frontend, landing page interaktif, dan case study proses desain produk oleh desainer & engineer.", "default_og_image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80", "indexing": true}'::jsonb),
  ('socials', '{"github": "https://github.com", "linkedin": "https://linkedin.com", "dribbble": "https://dribbble.com", "twitter": "https://x.com", "instagram": "https://instagram.com", "medium": ""}'::jsonb)
on conflict (key) do nothing;

commit;
