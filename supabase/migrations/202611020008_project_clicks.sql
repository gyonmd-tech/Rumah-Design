-- Migration: 202611020008_project_clicks.sql
-- Description: Count live demo and repository clicks per project (ADR-009).
-- Only project, click target and time are stored: no IP, user agent or identity.

begin;

create table public.project_clicks (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  target text not null check (target in ('demo', 'repo')),
  clicked_at timestamptz not null default now()
);

create index project_clicks_project_target_time_idx
  on public.project_clicks (project_id, target, clicked_at desc);

alter table public.project_clicks enable row level security;

-- No insert/update/delete policies: visitors write only through
-- record_project_click(). Admins can read for the studio statistics.
create policy "admins can read project clicks"
on public.project_clicks
for select
to authenticated
using (public.is_admin());

create or replace function public.record_project_click(p_slug text, p_target text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_project_id uuid;
begin
  if p_target not in ('demo', 'repo') then
    return;
  end if;

  select id into v_project_id
  from public.projects
  where slug = p_slug
    and status = 'published'
    and (p_target = 'demo' or repo_url is not null);

  if v_project_id is null then
    return;
  end if;

  -- Simple flood guard: at most 30 clicks per project and target per minute.
  if (
    select count(*)
    from public.project_clicks
    where project_id = v_project_id
      and target = p_target
      and clicked_at > now() - interval '1 minute'
  ) >= 30 then
    return;
  end if;

  insert into public.project_clicks (project_id, target)
  values (v_project_id, p_target);
end;
$$;

revoke all on function public.record_project_click(text, text) from public;
grant execute on function public.record_project_click(text, text) to anon, authenticated;

-- Security invoker: RLS on project_clicks applies, so only admins get rows.
create or replace function public.project_click_stats()
returns table (
  project_id uuid,
  demo_total bigint,
  demo_30d bigint,
  repo_total bigint,
  repo_30d bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    project_id,
    count(*) filter (where target = 'demo'),
    count(*) filter (where target = 'demo' and clicked_at > now() - interval '30 days'),
    count(*) filter (where target = 'repo'),
    count(*) filter (where target = 'repo' and clicked_at > now() - interval '30 days')
  from public.project_clicks
  group by project_id;
$$;

revoke all on function public.project_click_stats() from public;
grant execute on function public.project_click_stats() to authenticated;

commit;
