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
    },
  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/seo',
  ],
  css: ['~/assets/css/tailwind.css', '~/assets/css/site.css'],
  // React reference files are retained, but only Vue components enter this Nuxt app.
  components: [{ path: '~/components', extensions: ['vue'] }],
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
  supabase: {
    redirect: false,
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
        { rel: 'preconnect', href: 'https://api.fontshare.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@500,600,700&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Instrument+Serif:ital@0;1&display=swap' },
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
    '/admin/**': {
      robots: false,
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
      },
    },
    '/admin': { robots: false, headers: { 'Cache-Control': 'private, no-store, max-age=0' } },
    '/hubungi': { redirect: '/contact' },
    '/api/__sitemap__/**': { cache: { maxAge: 3600 } },
    '/api/site-settings': { cache: { maxAge: 300 } },
  },
})
