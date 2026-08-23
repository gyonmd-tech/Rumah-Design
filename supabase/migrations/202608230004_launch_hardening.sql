-- Migration: 202608230004_launch_hardening.sql
-- Description: Align Storage listing with UID folders and enforce publish-ready project data.

begin;

-- Public buckets already serve known object URLs without a SELECT policy.
-- Removing the broad policy prevents anonymous bucket enumeration.
drop policy if exists "project media is publicly readable" on storage.objects;
drop policy if exists "admins can list own project media" on storage.objects;

create policy "admins can list own project media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'project-media'
  and public.is_admin()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create or replace function public.text_array_items_within_limit(
  items text[],
  max_length integer
)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    bool_and(char_length(trim(item)) between 1 and max_length),
    true
  )
  from unnest(items) as item;
$$;

alter table public.projects
  add constraint projects_style_tag_length_check
    check (public.text_array_items_within_limit(style_tags, 50)),
  add constraint projects_tech_stack_item_length_check
    check (public.text_array_items_within_limit(tech_stack, 50)),
  add constraint projects_publish_readiness_check
    check (
      status = 'draft'
      or (
        description is not null
        and char_length(trim(description)) >= 80
        and cardinality(style_tags) > 0
        and cardinality(tech_stack) > 0
      )
    );

alter table public.site_settings
  add constraint site_settings_object_value_check
    check (jsonb_typeof(value) = 'object'),
  add constraint site_settings_payload_size_check
    check (octet_length(value::text) <= 20000);

commit;
