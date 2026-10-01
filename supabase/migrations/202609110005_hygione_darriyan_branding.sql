-- Rebrand settings while retaining custom content, URLs, and indexing preference.
begin;

insert into public.site_settings (key, value)
values ('general', '{}'::jsonb), ('seo', '{}'::jsonb)
on conflict (key) do nothing;

update public.site_settings
set value = value || jsonb_build_object(
  'site_name', 'Hygione Darriyan',
  'contact_email', 'paroarro07@gmail.com',
  'tagline', case when coalesce(value->>'tagline', '') in ('', 'Showcase karya frontend & narasi proses desain')
    then 'UI/UX Designer · Designer · Frontend & Fullstack Developer' else value->>'tagline' end,
  'bio', case when coalesce(value->>'bio', '') = '' or value->>'bio' = 'Product designer & frontend engineer yang fokus pada kerajinan visual, interaksi presisi, dan arsitektur web modern.'
    then 'Saya Hygione Darriyan, UI/UX designer, designer, frontend dan fullstack developer. Saya merancang pengalaman pengguna, antarmuka visual, serta aplikasi web dari desain hingga backend.' else replace(value->>'bio', 'Rumah Design', 'Hygione Darriyan') end
)
where key = 'general';

update public.site_settings
set value = value || jsonb_build_object(
  'default_title', case when coalesce(value->>'default_title', '') in ('', 'Rumah Design — Portofolio & Case Study Frontend')
    then 'Hygione Darriyan — UI/UX Designer & Fullstack Developer' else replace(value->>'default_title', 'Rumah Design', 'Hygione Darriyan') end,
  'default_description', case when coalesce(value->>'default_description', '') in ('', 'Kumpulan karya frontend, landing page interaktif, dan case study proses desain produk oleh desainer & engineer.')
    then 'Portofolio Hygione Darriyan: UI/UX design, desain visual, frontend dan fullstack development. Jelajahi case study, design system, landing page, dashboard, dan aplikasi web.'
    else replace(value->>'default_description', 'Rumah Design', 'Hygione Darriyan') end,
  'default_og_image', case when value->>'default_og_image' = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80'
    then '' else coalesce(value->>'default_og_image', '') end
)
where key = 'seo';

-- Match the application defaults; generic platform homepages are not personal profiles.
update public.site_settings as settings
set value = (
  select jsonb_object_agg(entry.key, case when entry.value in (
    '"https://github.com"'::jsonb, '"https://linkedin.com"'::jsonb,
    '"https://dribbble.com"'::jsonb, '"https://x.com"'::jsonb, '"https://instagram.com"'::jsonb
  ) then '""'::jsonb else entry.value end)
  from jsonb_each(settings.value) as entry
)
where settings.key = 'socials' and settings.value <> '{}'::jsonb;

-- Only replace the legacy suffix when it fits the existing field limits.
update public.projects
set seo_title = replace(seo_title, 'Rumah Design', 'Hygione Darriyan')
where seo_title like '%Rumah Design%' and char_length(replace(seo_title, 'Rumah Design', 'Hygione Darriyan')) <= 100;

commit;
