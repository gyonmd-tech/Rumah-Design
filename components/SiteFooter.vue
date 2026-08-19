<script setup lang="ts">
const { setupFooterUncover } = useMotion()

const footerRef = ref<HTMLElement | null>(null)
const footerInnerRef = ref<HTMLElement | null>(null)

// Current time in Jakarta
const currentTime = ref('')

const updateTime = () => {
  try {
    const now = new Date()
    currentTime.value = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now)
  } catch {
    currentTime.value = '11:00:00'
  }
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)

  if (footerRef.value && footerInnerRef.value) {
    setupFooterUncover(footerRef.value, footerInnerRef.value)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Social Media Channels
const socialChannels = [
  {
    name: 'GitHub',
    handle: '@rumahdesign',
    url: 'https://github.com',
    desc: 'Kode sumber, template, dan prototype interaktif.',
    action: 'Follow ↗',
  },
  {
    name: 'X (Twitter)',
    handle: '@rumahdesign',
    url: 'https://twitter.com',
    desc: 'Catatan rekayasa antarmuka dan eksperimen desain.',
    action: 'Follow ↗',
  },
  {
    name: 'LinkedIn',
    handle: 'in/rumah-design',
    url: 'https://linkedin.com',
    desc: 'Jaringan profesional dan ringkasan studi kasus produk.',
    action: 'Connect ↗',
  },
  {
    name: 'Instagram',
    handle: '@rumahdesign.id',
    url: 'https://instagram.com',
    desc: 'Arsip visual, micro-interactions, dan render UI.',
    action: 'Follow ↗',
  },
  {
    name: 'Figma Community',
    handle: '@rumahdesign',
    url: 'https://figma.com',
    desc: 'Design system, UI components, dan wireframe publik.',
    action: 'Duplicate ↗',
  },
  {
    name: 'Direct Message',
    handle: 'contact@rumahdesign.id',
    url: 'mailto:contact@rumahdesign.id',
    desc: 'Konsultasi proyek baru, kolaborasi studio, atau demo.',
    action: 'Kirim Email ↗',
  },
]
</script>

<template>
  <!-- Adaptive Footer: Relative natural flow on mobile, Sticky Curtain Uncover on desktop -->
  <footer
    ref="footerRef"
    class="relative md:sticky md:bottom-0 left-0 right-0 z-0 w-full min-h-auto md:min-h-[650px] bg-[#0c0b0a] text-paper pt-16 sm:pt-24 pb-8 sm:pb-10 border-t border-white/10 overflow-hidden flex flex-col justify-between"
  >
    <!-- Background Ambient Glow -->
    <div class="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] h-[180px] sm:h-[250px] bg-signal/12 rounded-full blur-[80px] sm:blur-[100px]" />

    <div ref="footerInnerRef" class="page-shell-wide relative z-10 flex flex-col justify-between grow space-y-10 sm:space-y-16 will-change-transform">
      <!-- Top Live Availability & Clock Strip -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/12 pb-6 sm:pb-8 font-mono text-xs">
        <div class="flex items-center gap-2.5">
          <span class="relative flex size-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span class="relative inline-flex size-2.5 rounded-full bg-signal" />
          </span>
          <span class="font-semibold text-paper uppercase tracking-[0.1em] sm:tracking-[0.14em] text-[0.72rem] sm:text-xs">
            Terbuka Untuk Kolaborasi 2026
          </span>
        </div>

        <div class="flex items-center gap-4 sm:gap-6 text-paper/60 uppercase tracking-widest text-[0.68rem] sm:text-[0.72rem]">
          <span>Jakarta, ID <strong class="text-paper font-semibold">{{ currentTime }} WIB</strong></span>
          <span class="hidden sm:inline text-white/20">|</span>
          <span class="hidden sm:inline">Nuxt 3 SSR · GSAP Motion</span>
        </div>
      </div>

      <!-- Main Headline & Quick Action -->
      <div class="grid gap-6 sm:gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
        <div>
          <div class="inline-flex items-center gap-2 font-mono text-[0.7rem] sm:text-xs font-bold text-signal uppercase tracking-widest mb-2 sm:mb-3">
            <span>{ Connect & Socials }</span>
          </div>
          <h2 class="font-display text-display-l text-paper tracking-tight font-bold max-w-2xl">
            Mari wujudkan ide digital berikutnya.
          </h2>
        </div>

        <div class="space-y-3 sm:space-y-4 lg:text-right">
          <p class="font-body text-paper/75 text-xs sm:text-sm md:text-base max-w-md ml-auto">
            Terhubung melalui kanal sosial media atau kirim pesan singkat untuk memulai diskusi proyek.
          </p>
          <div class="flex flex-wrap gap-3 lg:justify-end">
            <a
              href="mailto:contact@rumahdesign.id"
              class="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-2.5 sm:py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-signal/25 transition-all hover:scale-105 hover:bg-[#e63d10] active:scale-95"
            >
              <span>Kirim Email Langsung</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Editorial Social Media Cards Grid -->
      <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-2">
        <a
          v-for="item in socialChannels"
          :key="item.name"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-signal/50 hover:bg-white/[0.07] hover:translate-y-[-2px] active:scale-[0.99] shadow-xs"
        >
          <div class="space-y-1.5 sm:space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-paper uppercase tracking-wider group-hover:text-signal transition-colors">
                {{ item.name }}
              </span>
              <span class="font-mono text-[0.68rem] text-signal font-semibold opacity-80 sm:opacity-0 -translate-x-1 sm:-translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                {{ item.action }}
              </span>
            </div>
            <p class="font-mono text-[0.72rem] sm:text-xs text-paper/90 font-medium">
              {{ item.handle }}
            </p>
            <p class="font-sans text-[0.72rem] sm:text-xs text-paper/60 leading-relaxed">
              {{ item.desc }}
            </p>
          </div>
        </a>
      </div>

      <!-- Massive Brand Signature Watermark -->
      <div class="py-2 sm:py-4 text-center select-none pointer-events-none overflow-hidden">
        <span class="font-display font-bold text-[clamp(2.1rem,9vw,9.5rem)] text-white/[0.06] tracking-tighter leading-none block uppercase truncate">
          Rumah Design
        </span>
      </div>

      <!-- Bottom Sitemap & Back to Top Bar -->
      <div class="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:pt-8 sm:flex-row font-mono text-[0.72rem] sm:text-[0.75rem] text-paper/50 items-center text-center sm:text-left">
        <p>© {{ new Date().getFullYear() }} Rumah Design Studio. All rights reserved.</p>

        <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <NuxtLink to="/#work" class="hover:text-paper transition-colors py-1">Karya</NuxtLink>
          <NuxtLink to="/about" class="hover:text-paper transition-colors py-1">Tentang</NuxtLink>
          <NuxtLink to="/admin/login" class="hover:text-paper transition-colors py-1">Admin</NuxtLink>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-paper transition-all hover:border-signal hover:bg-signal/20 hover:text-signal"
            @click="scrollToTop"
          >
            ↑ Ke Atas
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>
