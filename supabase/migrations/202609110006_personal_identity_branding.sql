begin;

insert into public.site_settings (key, value)
values ('general', '{}'::jsonb), ('seo', '{}'::jsonb), ('socials', '{}'::jsonb)
on conflict (key) do nothing;

update public.site_settings
set value = value || jsonb_build_object(
  'site_name', 'Hygione Darriyan',
  'tagline', 'IT Support · UI/UX Designer · Frontend & Fullstack Developer',
  'bio', 'Hygione Heparre Paro Arro Darriyan, dikenal sebagai Hygione Darriyan, adalah praktisi IT support, UI/UX designer, frontend dan fullstack developer asal Kota Tangerang, Indonesia. Ia merancang pengalaman digital dan membangun aplikasi web dari antarmuka hingga backend.',
  'contact_email', 'paroarro07@gmail.com'
)
where key = 'general';

update public.site_settings
set value = value || jsonb_build_object(
  'default_title', 'Hygione Darriyan — UI/UX & Fullstack Developer',
  'default_description', 'Portofolio Hygione Heparre Paro Arro Darriyan: UI/UX design, IT support, frontend, fullstack development, aplikasi web, dan eksplorasi teknologi.',
  'default_og_image', ''
)
where key = 'seo';

update public.site_settings
set value = value || jsonb_build_object(
  'github', 'https://github.com/gyonmd-tech',
  'linkedin', 'https://www.linkedin.com/in/hygione-heparre-paro-arro-darriyan-910724327',
  'instagram', 'https://www.instagram.com/gyon.md/'
)
where key = 'socials';

commit;
