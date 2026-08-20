import tailwindcss from '@tailwindcss/vite'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const googleSiteVerification =
  process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  process.env.GOOGLE_SITE_VERIFICATION ||
  process.env['google-site-verification'] ||
  ''

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  runtimeConfig: {
    public: {
      siteUrl,
      googleSiteVerification,
    },
  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
  ],
  css: ['~/assets/css/tailwind.css'],
  build: {
    transpile: ['gsap'],
  },
  experimental: {
    appManifest: false,
  },
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
    fallbackTitle: false,
  },
  robots: {
    disallow: ['/admin', '/admin/*'],
  },
  supabase: {
    redirect: false,
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'id' },
      meta: [
        { name: 'theme-color', content: '#0c0b0a' },
        ...(googleSiteVerification ? [{ name: 'google-site-verification', content: googleSiteVerification }] : []),
      ],
      link: [
        { rel: 'preconnect', href: 'https://api.fontshare.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap' },
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
    '/hubungi': { redirect: '/contact' },
    '/api/__sitemap__/**': { cache: { maxAge: 3600 } },
    '/api/projects/**': { cache: { maxAge: 60 } },
  },
})
