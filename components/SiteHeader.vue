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
    class="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 px-4"
  >
    <!-- Top Notch / Dynamic Island container hanging flush from the top edge (Wider & More Prominent) -->
    <div
      class="pointer-events-auto flex items-center justify-between gap-6 sm:gap-12 bg-[#0e0d0c]/95 text-white px-6 sm:px-9 py-3.5 sm:py-4 rounded-b-3xl border-b border-x border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 w-full max-w-2xl md:max-w-3xl"
      :class="isScrolled ? 'scale-[0.98] py-3' : 'py-4'"
    >
      <!-- Left Logo Badge -->
      <NuxtLink to="/" class="group flex items-center gap-3" aria-label="Rumah Design, ke beranda">
        <SiteLogo :dark="true" />
      </NuxtLink>

      <!-- Center Navigation Links -->
      <nav aria-label="Navigasi utama" class="flex items-center gap-6 sm:gap-9 font-mono text-xs sm:text-sm uppercase tracking-[0.1em]">
        <NuxtLink
          to="/#work"
          class="relative py-1 text-white/75 transition-colors hover:text-signal font-medium"
          :class="route.hash === '#work' ? 'text-signal font-bold' : ''"
        >
          Karya
          <span v-if="route.hash === '#work'" class="absolute -bottom-1 left-0 right-0 h-[2px] bg-signal rounded-full" />
        </NuxtLink>

        <NuxtLink
          to="/about"
          class="relative py-1 text-white/75 transition-colors hover:text-signal font-medium"
          :class="route.path === '/about' ? 'text-signal font-bold' : ''"
        >
          Tentang
          <span v-if="route.path === '/about'" class="absolute -bottom-1 left-0 right-0 h-[2px] bg-signal rounded-full" />
        </NuxtLink>
      </nav>

      <!-- Right Action Pill Button -->
      <div class="flex items-center">
        <a
          href="mailto:contact@rumahdesign.id"
          class="inline-flex items-center gap-2 rounded-full bg-white px-5 sm:px-6 py-2 font-mono text-xs font-bold text-ink uppercase tracking-wider shadow-md transition-all hover:bg-signal hover:text-white hover:scale-105 active:scale-95"
        >
          <span>Hubungi</span>
          <span class="text-xs">↗</span>
        </a>
      </div>
    </div>
  </header>
</template>
