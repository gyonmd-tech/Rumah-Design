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
    site_name: 'Rumah Design',
    tagline: 'Showcase karya frontend & narasi proses desain',
    bio: 'Product designer & frontend engineer yang fokus pada kerajinan visual, interaksi presisi, dan arsitektur web modern.',
    contact_email: 'hello@rumahdesign.dev',
  },
  seo: {
    default_title: 'Rumah Design — Portofolio & Case Study Frontend',
    default_description: 'Kumpulan karya frontend, landing page interaktif, dan case study proses desain produk oleh desainer & engineer.',
    default_og_image: '',
    indexing: true,
  },
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    dribbble: 'https://dribbble.com',
    twitter: 'https://x.com',
    instagram: 'https://instagram.com',
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

  return settings
}
