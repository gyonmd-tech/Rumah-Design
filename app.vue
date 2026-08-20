<script setup lang="ts">
const config = useRuntimeConfig()
const googleVerification = computed(() => (config.public.googleSiteVerification as string) || '')

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

