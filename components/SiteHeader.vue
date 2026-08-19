<script setup lang="ts">
const route = useRoute()
const { setupNavScroll } = useMotion()

const headerRef = ref<HTMLElement | null>(null)
const isScrolled = ref(false)

const handleScroll = () => {
  if (typeof window === 'undefined') return
  isScrolled.value = window.scrollY > 30
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
    class="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 px-2.5 sm:px-4 pt-[env(safe-area-inset-top,0px)]"
  >
    <!-- Top Notch / Dynamic Island container hanging flush from the top edge -->
    <div
      class="pointer-events-auto flex items-center justify-between gap-2.5 sm:gap-6 md:gap-12 bg-[#0e0d0c]/95 text-white px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 rounded-b-2xl sm:rounded-b-3xl border-b border-x border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 w-full max-w-2xl md:max-w-3xl"
      :class="isScrolled ? 'scale-[0.98] py-2 sm:py-2.5' : 'py-2.5 sm:py-3.5'"
    >
      <!-- Left Logo Badge -->
      <NuxtLink to="/" class="group flex items-center gap-2 shrink-0" aria-label="Rumah Design, ke beranda">
        <SiteLogo :dark="true" />
      </NuxtLink>

      <!-- Center Navigation Links -->
      <nav aria-label="Navigasi utama" class="flex items-center gap-3 sm:gap-6 md:gap-8 font-mono text-[0.75rem] sm:text-xs md:text-sm uppercase tracking-[0.08em] sm:tracking-[0.1em]">
        <NuxtLink
          to="/#work"
          class="relative px-1 py-1 text-white/75 transition-colors hover:text-signal font-medium"
          :class="route.hash === '#work' ? 'text-signal font-bold' : ''"
        >
          Karya
          <span v-if="route.hash === '#work'" class="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-signal rounded-full" />
        </NuxtLink>

        <NuxtLink
          to="/about"
          class="relative px-1 py-1 text-white/75 transition-colors hover:text-signal font-medium"
          :class="route.path === '/about' ? 'text-signal font-bold' : ''"
        >
          Tentang
          <span v-if="route.path === '/about'" class="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-signal rounded-full" />
        </NuxtLink>
      </nav>

      <!-- Right Action Pill Button -->
      <div class="flex items-center shrink-0">
        <a
          href="mailto:contact@rumahdesign.id"
          class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 sm:px-5 py-1.5 sm:py-2 font-mono text-[0.68rem] sm:text-xs font-bold text-ink uppercase tracking-wider shadow-md transition-all hover:bg-signal hover:text-white hover:scale-105 active:scale-95"
        >
          <span>Hubungi</span>
          <span class="text-[0.65rem] sm:text-xs">↗</span>
        </a>
      </div>
    </div>
  </header>
</template>
