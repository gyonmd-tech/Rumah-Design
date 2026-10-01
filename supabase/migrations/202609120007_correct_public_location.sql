-- Correct the public location to the owner-provided domicile.
update public.site_settings
set value = jsonb_set(
  value,
  '{bio}',
  to_jsonb('Hygione Heparre Paro Arro Darriyan, dikenal sebagai Hygione Darriyan, adalah praktisi IT support, UI/UX designer, frontend dan fullstack developer asal Citayam, Kota Depok, Indonesia. Ia merancang pengalaman digital dan membangun aplikasi web dari antarmuka hingga backend.'::text),
  true
),
updated_at = timezone('utc'::text, now())
where key = 'general';
