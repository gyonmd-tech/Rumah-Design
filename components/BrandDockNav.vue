<script setup lang="ts">
import { Github, Home, Instagram, Linkedin, Mail } from 'lucide-vue-next'
import type { FloatingDockItem } from '~/components/ui/FloatingDock.vue'

const siteSettings = usePublicSiteSettings()

const navItems = computed<FloatingDockItem[]>(() => {
  const items: FloatingDockItem[] = [
    { title: 'Home', href: '/', icon: Home },
  ]

  if (siteSettings.value.socials.github) {
    items.push({ title: 'GitHub', href: siteSettings.value.socials.github, icon: Github, external: true })
  }
  if (siteSettings.value.socials.linkedin) {
    items.push({ title: 'LinkedIn', href: siteSettings.value.socials.linkedin, icon: Linkedin, external: true })
  }
  if (siteSettings.value.socials.instagram) {
    items.push({ title: 'Instagram', href: siteSettings.value.socials.instagram, icon: Instagram, external: true })
  }

  items.push({ title: 'Contact', href: `mailto:${siteSettings.value.general.contact_email}`, icon: Mail })

  return items
})
</script>

<template>
  <div class="brand-dock">
    <UiFloatingDock :items="navItems" orientation="vertical" theme="dark" mobile-flyout="down" />
  </div>
</template>

<style scoped>
.brand-dock {
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 40;
}
</style>
