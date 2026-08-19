<script setup lang="ts">
const route = useRoute()

const isHidden = ref(false)
const isScrolled = ref(false)
let lastScrollY = 0
let ticking = false

const handleScroll = () => {
  if (typeof window === 'undefined') return
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      isScrolled.value = currentScrollY > 20

      // Smart hide on scroll down, show on scroll up
      if (currentScrollY > 100 && currentScrollY > lastScrollY + 6) {
        isHidden.value = true
      } else if (currentScrollY < lastScrollY - 6 || currentScrollY <= 40) {
        isHidden.value = false
      }

      lastScrollY = Math.max(0, currentScrollY)
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
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
    class="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-3 sm:px-4 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] transition-transform duration-300 ease-out will-change-transform"
    :class="isHidden ? '-translate-y-28' : 'translate-y-0'"
  >
    <!-- Floating Dynamic Island Pill -->
    <div
      class="pointer-events-auto flex items-center justify-between gap-2 sm:gap-6 bg-[#121110]/92 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-200 w-full max-w-lg sm:max-w-xl md:max-w-2xl"
      :class="isScrolled ? 'border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.55)]' : ''"
    >
      <!-- Left: Logo & Studio Mark -->
      <NuxtLink
        to="/"
        class="group flex items-center gap-1.5 shrink-0 focus-visible:ring-1 focus-visible:ring-signal rounded-full"
        aria-label="Rumah Design, ke beranda"
      >
        <SiteLogo :dark="true" :hide-text-on-mobile="true" />
        <span class="sm:hidden font-mono text-[0.68rem] font-bold tracking-wider text-white/90">RD</span>
      </NuxtLink>

      <!-- Center: Navigation Links -->
      <nav aria-label="Navigasi utama" class="flex items-center gap-1 sm:gap-3 md:gap-5 font-mono text-[0.72rem] sm:text-xs uppercase tracking-wider">
        <NuxtLink
          to="/#work"
          class="relative px-2.5 sm:px-3 py-1 rounded-full text-white/75 transition-all hover:text-white hover:bg-white/10 font-medium"
          :class="route.hash === '#work' || (route.path === '/' && !route.hash) ? 'text-white !font-bold bg-white/10' : ''"
        >
          Karya
        </NuxtLink>

        <NuxtLink
          to="/about"
          class="relative px-2.5 sm:px-3 py-1 rounded-full text-white/75 transition-all hover:text-white hover:bg-white/10 font-medium"
          :class="route.path === '/about' ? 'text-white !font-bold bg-white/10' : ''"
        >
          Tentang
        </NuxtLink>
      </nav>

      <!-- Right: Direct CTA Pill Button -->
      <div class="flex items-center shrink-0">
        <a
          href="mailto:contact@rumahdesign.id"
          class="inline-flex items-center gap-1 rounded-full bg-signal text-white px-3 sm:px-4 py-1.5 font-mono text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:bg-[#e63d10] active:scale-95"
        >
          <span>Kontak</span>
          <span class="text-[0.6rem] sm:text-[0.65rem]">↗</span>
        </a>
      </div>
    </div>
  </header>
</template>
