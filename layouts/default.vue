<script setup lang="ts">
useHead({ htmlAttrs: { class: 'site-root' } })
</script>

<template>
  <div class="site">
    <a href="#main" class="skip-link">Langsung ke konten</a>
    <SiteNav />
    <slot />
    <SiteFooter />
    <SiteCursorLabel />
    <SiteTransitionOverlay />
  </div>
</template>
