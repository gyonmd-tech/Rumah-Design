-- Migration: 202608220003_project_taxonomy_and_security.sql
-- Description: Expand project taxonomy and tighten validation/storage read boundaries.

begin;

-- Expand categories without editing the initial migration that may already be applied.
alter table public.projects
  drop constraint if exists projects_category_check;

alter table public.projects
  add constraint projects_category_check check (
    category in (
      'landing-page',
      'web-app',
      'dashboard',
      'portfolio',
      'e-commerce',
      'blog-editorial',
      'saas',
      'ai-tool',
      'mobile-app',
      'game-interactive',
      'productivity',
      'experimental',
      'lainnya'
    )
  );

-- Keep oversized or abusive payloads out even when writes bypass the admin form.
alter table public.projects
  add constraint projects_description_length_check
    check (description is null or char_length(description) <= 50000),
  add constraint projects_seo_title_length_check
    check (seo_title is null or char_length(seo_title) <= 100),
  add constraint projects_seo_description_length_check
    check (seo_description is null or char_length(seo_description) <= 200),
  add constraint projects_focus_keyword_length_check
    check (focus_keyword is null or char_length(focus_keyword) <= 120),
  add constraint projects_style_tags_count_check
    check (cardinality(style_tags) <= 16),
  add constraint projects_tech_stack_count_check
    check (cardinality(tech_stack) <= 16);

-- Public pages only need these known configuration records. Admins retain full read access.
drop policy if exists "site settings are publicly readable" on public.site_settings;

create policy "public site settings are readable"
on public.site_settings
for select
to anon, authenticated
using (key in ('general', 'seo', 'socials') or public.is_admin());

-- Admin uploads are scoped to their own first-level folder: <auth.uid()>/filename.
drop policy if exists "admins can upload project media" on storage.objects;
drop policy if exists "admins can update project media" on storage.objects;
drop policy if exists "admins can delete project media" on storage.objects;

create policy "admins can upload project media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-media'
  and public.is_admin()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "admins can update project media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'project-media'
  and public.is_admin()
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'project-media'
  and public.is_admin()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "admins can delete project media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-media'
  and public.is_admin()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

commit;
