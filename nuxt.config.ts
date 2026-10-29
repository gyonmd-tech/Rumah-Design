import tailwindcss from '@tailwindcss/vite'

const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')
const googleSiteVerification =
  process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  process.env.GOOGLE_SITE_VERIFICATION ||
  process.env['google-site-verification'] ||
  ''

const supabaseOrigins = (() => {
  try {
    const origin = new URL(process.env.SUPABASE_URL || '').origin
    const realtimeOrigin = origin.replace(/^https:/, 'wss:')
    return [origin, realtimeOrigin]
  }
  catch {
    return []
  }
})()

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com",
  "font-src 'self' data: https://cdn.fontshare.com https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  `connect-src 'self' ${supabaseOrigins.join(' ')}`,
  ...(siteUrl.startsWith('https://') ? ['upgrade-insecure-requests'] : []),
].join('; ')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: true,
  runtimeConfig: {
    public: {
      siteUrl,
      googleSiteVerification,
      whatsappNumber: '',
      // Publishable/anon key only; RLS is the access boundary.
      supabase: {
        url: process.env.SUPABASE_URL || '',
        key: process.env.SUPABASE_KEY || '',
      },
    },
  },
  modules: [
    '@nuxtjs/seo',
    '@nuxt/fonts',
  ],
  // Public fonts are downloaded at build time and served from /_fonts (ADR-004).
  // Studio fonts stay managed by composables/useAdminFonts.ts and the local ARQINO face.
  fonts: {
    defaults: { subsets: ['latin', 'latin-ext'] },
    families: [
      // Hero letters animate the wght axis between 250 and 850.
      { name: 'Inter Tight', provider: 'google', weights: ['250 900'], styles: ['normal', 'italic'] },
      { name: 'Instrument Serif', provider: 'google', weights: [400], styles: ['normal', 'italic'] },
      ...['IBM Plex Sans', 'IBM Plex Mono', 'Clash Display', 'General Sans', 'ARQINO'].map(name => ({ name, provider: 'none' as const })),
    ],
  },
  css: ['~/assets/css/tailwind.css', '~/assets/css/site.css'],
  // React reference files are retained, but only Vue components enter this Nuxt app.
  components: [{ path: '~/components', extensions: ['vue'] }],
  build: {
    transpile: ['gsap'],
  },
  experimental: {
    appManifest: false,
  },
  hooks: {
    // Public pages would otherwise prefetch the admin layout/middleware and,
    // through them, the Supabase SDK. The manifest only drives SSR resource
    // hints; lazy loading still works when the studio is opened.
    'build:manifest'(manifest) {
      for (const chunk of Object.values(manifest)) {
        if (chunk.isEntry && chunk.dynamicImports) {
          chunk.dynamicImports = chunk.dynamicImports.filter(id => !id.includes('admin'))
        }
      }
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  site: {
    url: siteUrl,
    name: 'Hygione Darriyan',
    description: 'Portofolio UI/UX design, desain visual, frontend dan fullstack development oleh Hygione Darriyan.',
    defaultLocale: 'id',
  },
  ogImage: {
    enabled: false,
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin/**', '/admin', '/hubungi'],
  },
  seo: {
    treeShakeUseSeoMeta: false,
    fallbackTitle: false,
  },
  robots: {
    disallow: ['/admin', '/admin/*'],
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      titleTemplate: '%s',
      htmlAttrs: { lang: 'id' },
      meta: [
        { name: 'theme-color', content: '#f5f2ea' },
        ...(googleSiteVerification ? [{ name: 'google-site-verification', content: googleSiteVerification }] : []),
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48x48.png' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
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
        'Content-Security-Policy': contentSecurityPolicy,
        'Cross-Origin-Opener-Policy': 'same-origin',
        'X-DNS-Prefetch-Control': 'off',
      },
    },
    // Public HTML carries no per-user state, so it is served from Vercel's cache (ADR-002).
    '/': { isr: 60 },
    '/karya': { isr: { expiration: 60, allowQuery: ['kategori', 'gaya', 'q'] } },
    '/about': { isr: 60 },
    '/contact': { isr: 60 },
    '/proses': { isr: 60 },
    '/layanan': { isr: 60 },
    '/layanan/**': { isr: 60 },
    '/project/**': { isr: 60 },
    // The studio is a client-only SPA; its Supabase client never reaches public bundles.
    '/admin/**': {
      ssr: false,
      robots: false,
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
      },
    },
    '/admin': { ssr: false, robots: false, headers: { 'Cache-Control': 'private, no-store, max-age=0' } },
    '/hubungi': { redirect: '/contact' },
    '/api/__sitemap__/**': { cache: { maxAge: 3600 } },
    '/api/site-settings': { cache: { maxAge: 300 } },
  },
})
