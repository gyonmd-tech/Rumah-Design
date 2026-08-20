<script setup lang="ts">
const route = useRoute()
const { setupNavScroll } = useMotion()

const headerRef = ref<HTMLElement | null>(null)
const isScrolled = ref(false)

let scrollTicking = false
const handleScroll = () => {
  if (typeof window === 'undefined') return
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > 30
      scrollTicking = false
    })
    scrollTicking = true
  }
}

onMounted(() => {
  if (headerRef.value) {
    setupNavScroll(headerRef.value)
  }
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <header
    ref="headerRef"
    class="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-2 sm:px-4 pt-[env(safe-area-inset-top,0px)] will-change-transform"
  >
    <!-- Top Notch / Dynamic Island container hanging flush from the top edge -->
    <div
      class="pointer-events-auto flex items-center justify-between gap-2.5 sm:gap-6 md:gap-10 bg-[#0e0d0c]/95 text-white px-3.5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-b-2xl sm:rounded-b-3xl border-b border-x border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl w-full max-w-2xl md:max-w-3xl"
    >
      <!-- Left Logo Badge -->
      <NuxtLink to="/" class="group flex items-center gap-2 shrink-0" aria-label="Rumah Design, ke beranda">
        <SiteLogo :dark="true" />
      </NuxtLink>

      <!-- Center Navigation Links -->
      <nav aria-label="Navigasi utama" class="flex items-center gap-2.5 sm:gap-5 md:gap-8 font-mono text-[0.72rem] sm:text-xs md:text-sm uppercase tracking-[0.06em] sm:tracking-[0.1em]">
        <NuxtLink
          to="/#work"
          class="relative px-1 py-1 text-white/80 transition-colors hover:text-signal font-medium"
          :class="route.hash === '#work' || (route.path === '/' && !route.hash) ? 'text-signal !font-bold' : ''"
        >
          Karya
          <span v-if="route.hash === '#work' || (route.path === '/' && !route.hash)" class="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-signal rounded-full" />
        </NuxtLink>

        <NuxtLink
          to="/about"
          class="relative px-1 py-1 text-white/80 transition-colors hover:text-signal font-medium"
          :class="route.path === '/about' ? 'text-signal !font-bold' : ''"
        >
          Tentang
          <span v-if="route.path === '/about'" class="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-signal rounded-full" />
        </NuxtLink>
      </nav>

      <!-- Right Action Pill Button -->
      <div class="flex items-center shrink-0">
        <RadialRevealButton
          to="/contact"
          :variant="route.path === '/contact' ? 'primary' : 'white'"
          label="Hubungi"
          add-icon
          :icon="{ symbol: '↗', size: 12, side: 'right' }"
          padding="0.4rem 0.9rem"
          custom-class="!text-[0.68rem] sm:!text-xs tracking-wider shadow-sm"
        />
      </div>
    </div>
  </header>
</template>
