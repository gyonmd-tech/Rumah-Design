<script setup lang="ts">
import type { PublicSiteSettings } from '~/utils/site-settings'
import { PERSONAL_IDENTITY, PERSONAL_PROFILE_URLS } from '~/utils/identity'
import { PORTFOLIO_TOPICS, serializeJsonLd } from '~/utils/structured-data'

const route = useRoute()
const config = useRuntimeConfig()
const googleVerification = computed(() => (config.public.googleSiteVerification as string) || '')
const siteSettings = usePublicSiteSettings()

const { data: loadedSettings } = await useAsyncData(
  'public-site-settings-data',
  () => $fetch<PublicSiteSettings>('/api/site-settings'),
)

if (loadedSettings.value) {
  siteSettings.value = loadedSettings.value
}

const fallbackOgImage = computed(() => `${config.public.siteUrl}/og-image.png`)
const defaultOgImage = computed(() => {
  const configured = siteSettings.value.seo.default_og_image
  return configured?.startsWith('https://') ? configured : fallbackOgImage.value
})

useSeoMeta({
  title: () => siteSettings.value.seo.default_title,
  description: () => siteSettings.value.seo.default_description,
  robots: () => siteSettings.value.seo.indexing
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, nofollow',
  ogTitle: () => siteSettings.value.seo.default_title,
  ogDescription: () => siteSettings.value.seo.default_description,
  ogImage: () => defaultOgImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => siteSettings.value.seo.default_title,
  twitterDescription: () => siteSettings.value.seo.default_description,
  twitterImage: () => defaultOgImage.value,
  ogSiteName: 'Hygione Darriyan',
  ogLocale: 'id_ID',
  author: PERSONAL_IDENTITY.fullName,
})

if (googleVerification.value) {
  useHead({
    meta: [
      { name: 'google-site-verification', content: googleVerification.value },
    ],
  })
}

// Hide reveal targets only when JS runs and motion is allowed (see site.css).
useHead({
  script: [{
    key: 'js-motion',
    tagPosition: 'head',
    innerHTML: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')",
  }],
})

const siteTransition = usePageTransition()
const pageTransition = computed(() => route.path.startsWith('/admin')
  ? { name: 'page', mode: 'out-in' as const }
  : siteTransition)

useHead(() => ({
  script: route.path.startsWith('/admin') ? [] : [{
    key: 'portfolio-identity', type: 'application/ld+json',
    innerHTML: serializeJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person', '@id': `${config.public.siteUrl}/#person`,
          name: PERSONAL_IDENTITY.fullName,
          alternateName: PERSONAL_IDENTITY.alternateNames,
          url: `${config.public.siteUrl}/about`,
          jobTitle: PERSONAL_IDENTITY.headline,
          description: siteSettings.value.general.bio,
          email: siteSettings.value.general.contact_email,
          homeLocation: {
            '@type': 'Place',
            name: `${PERSONAL_IDENTITY.location.city}, ${PERSONAL_IDENTITY.location.region}, ${PERSONAL_IDENTITY.location.country}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: PERSONAL_IDENTITY.location.city,
              addressRegion: PERSONAL_IDENTITY.location.region,
              addressCountry: PERSONAL_IDENTITY.location.countryCode,
            },
          },
          knowsAbout: PORTFOLIO_TOPICS,
          sameAs: [...new Set([
            ...PERSONAL_PROFILE_URLS,
            ...Object.values(siteSettings.value.socials).filter(Boolean),
          ])],
        },
        {
          '@type': 'WebSite', '@id': `${config.public.siteUrl}/#website`,
          name: 'Hygione Darriyan', url: `${config.public.siteUrl}/`,
          inLanguage: 'id', publisher: { '@id': `${config.public.siteUrl}/#person` },
        },
      ],
    }),
  }],
}))
</script>

<template>
  <NuxtLoadingIndicator color="#5146c8" />
  <NuxtLayout>
    <NuxtPage :transition="pageTransition" />
  </NuxtLayout>
</template>
