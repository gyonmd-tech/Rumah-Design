begin;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  slug text unique not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  live_url text not null check (live_url ~ '^https://'),
  repo_url text check (repo_url is null or repo_url ~ '^https://'),
  category text not null check (category in ('landing-page', 'web-app', 'dashboard', 'lainnya')),
  style_tags text[] not null default '{}',
  tech_stack text[] not null default '{}',
  thumbnail_url text not null check (thumbnail_url ~ '^https://'),
  preview_media_url text check (preview_media_url is null or preview_media_url ~ '^https://'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_status_created_at_idx
  on public.projects (status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "published projects are public"
on public.projects
for select
to anon, authenticated
using (status = 'published' or public.is_admin());

create policy "admins can insert projects"
on public.projects
for insert
to authenticated
with check (public.is_admin());

create policy "admins can update projects"
on public.projects
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins can delete projects"
on public.projects
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
on conflict (id) do nothing;

create policy "project media is publicly readable"
on storage.objects
for select
to public
using (bucket_id = 'project-media');

create policy "admins can upload project media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-media' and public.is_admin());

create policy "admins can update project media"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-media' and public.is_admin())
with check (bucket_id = 'project-media' and public.is_admin());

create policy "admins can delete project media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-media' and public.is_admin());

commit;
