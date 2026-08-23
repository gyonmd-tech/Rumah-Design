<script setup lang="ts">
import type { PublicSiteSettings } from '~/utils/site-settings'

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
})

if (googleVerification.value) {
  useHead({
    meta: [
      { name: 'google-site-verification', content: googleVerification.value },
    ],
  })
}
</script>

<template>
  <NuxtLoadingIndicator color="#ff4d00" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

