import tailwindcss from '@tailwindcss/vite'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
  ],
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  site: {
    url: siteUrl,
    name: 'Rumah Design',
    description: 'Kumpulan karya frontend dan cerita proses desain.',
    defaultLocale: 'id',
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },
  seo: {
    treeShakeUseSeoMeta: false,
  },
  supabase: {
    redirect: false,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      meta: [
        { name: 'theme-color', content: '#f1efe9' },
      ],
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
    '/admin/**': { robots: false },
    '/api/__sitemap__/**': { cache: { maxAge: 3600 } },
    '/api/projects/**': { cache: { maxAge: 60 } },
  },
})
