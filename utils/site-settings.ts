export interface PublicSiteSettings {
  general: {
    site_name: string
    tagline: string
    bio: string
    contact_email: string
  }
  seo: {
    default_title: string
    default_description: string
    default_og_image: string
    indexing: boolean
  }
  socials: {
    github: string
    linkedin: string
    dribbble: string
    twitter: string
    instagram: string
    medium: string
  }
}

export const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  general: {
    site_name: 'Hygione Darriyan',
    tagline: 'IT Support · UI/UX Designer · Frontend & Fullstack Developer',
    bio: 'Hygione Heparre Paro Arro Darriyan, dikenal sebagai Hygione Darriyan, adalah praktisi IT support, UI/UX designer, frontend dan fullstack developer asal Citayam, Kota Depok, Indonesia. Ia merancang pengalaman digital dan membangun aplikasi web dari antarmuka hingga backend.',
    contact_email: 'paroarro07@gmail.com',
  },
  seo: {
    default_title: 'Hygione Darriyan — UI/UX & Fullstack Developer',
    default_description: 'Portofolio Hygione Heparre Paro Arro Darriyan: IT support, UI/UX design, frontend, fullstack development, case study, dan aplikasi web.',
    default_og_image: '',
    indexing: true,
  },
  socials: {
    github: 'https://github.com/gyonmd-tech',
    linkedin: 'https://www.linkedin.com/in/hygione-heparre-paro-arro-darriyan-910724327',
    dribbble: '',
    twitter: '',
    instagram: 'https://www.instagram.com/gyon.md/',
    medium: '',
  },
}

export function mergeSiteSettings(
  rows: Array<{ key: string, value: Record<string, unknown> }>,
): PublicSiteSettings {
  const settings = structuredClone(DEFAULT_SITE_SETTINGS)

  const readString = (
    value: Record<string, unknown>,
    key: string,
    maxLength: number,
  ) => typeof value[key] === 'string' ? value[key].slice(0, maxLength) : undefined

  for (const row of rows) {
    if (row.key === 'general') {
      settings.general.site_name = readString(row.value, 'site_name', 80) ?? settings.general.site_name
      settings.general.tagline = readString(row.value, 'tagline', 160) ?? settings.general.tagline
      settings.general.bio = readString(row.value, 'bio', 1000) ?? settings.general.bio

      const email = readString(row.value, 'contact_email', 254)
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        settings.general.contact_email = email
      }
    }

    if (row.key === 'seo') {
      settings.seo.default_title = readString(row.value, 'default_title', 100) ?? settings.seo.default_title
      settings.seo.default_description = readString(row.value, 'default_description', 200) ?? settings.seo.default_description

      const ogImage = readString(row.value, 'default_og_image', 2048)
      if (ogImage === '' || ogImage?.startsWith('https://')) {
        settings.seo.default_og_image = ogImage
      }
      if (typeof row.value.indexing === 'boolean') settings.seo.indexing = row.value.indexing
    }

    if (row.key === 'socials') {
      for (const platform of Object.keys(settings.socials) as Array<keyof PublicSiteSettings['socials']>) {
        const url = readString(row.value, platform, 2048)
        if (url === '' || url?.startsWith('https://')) settings.socials[platform] = url
      }
    }
  }

  if (settings.general.tagline === 'Showcase karya frontend & narasi proses desain') settings.general.tagline = DEFAULT_SITE_SETTINGS.general.tagline
  if (settings.general.bio === 'Product designer & frontend engineer yang fokus pada kerajinan visual, interaksi presisi, dan arsitektur web modern.') settings.general.bio = DEFAULT_SITE_SETTINGS.general.bio
  if (settings.seo.default_description === 'Kumpulan karya frontend, landing page interaktif, dan case study proses desain produk oleh desainer & engineer.') settings.seo.default_description = DEFAULT_SITE_SETTINGS.seo.default_description
  if (settings.seo.default_og_image === 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80') settings.seo.default_og_image = ''
  // Compatibility while the additive branding migration is being rolled out.
  for (const key of ['site_name', 'tagline', 'bio'] as const) {
    if (/rumah design/i.test(settings.general[key])) settings.general[key] = DEFAULT_SITE_SETTINGS.general[key]
  }
  if (settings.general.contact_email === 'hello@rumahdesign.dev') settings.general.contact_email = DEFAULT_SITE_SETTINGS.general.contact_email
  for (const key of ['default_title', 'default_description'] as const) {
    if (/rumah design/i.test(settings.seo[key])) settings.seo[key] = DEFAULT_SITE_SETTINGS.seo[key]
  }
  for (const key of Object.keys(settings.socials) as Array<keyof PublicSiteSettings['socials']>) {
    const value = settings.socials[key]
    try {
      if (value && new URL(value).pathname === '/') settings.socials[key] = ''
    } catch { settings.socials[key] = '' }
  }
  return settings
}
