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
  <!-- Sticky Bottom Curtain Footer (Overlapped/Covered by foreground Product Section) -->
  <footer
    ref="footerRef"
    class="sticky bottom-0 left-0 right-0 z-0 w-full min-h-[700px] bg-[#0c0b0a] text-paper pt-24 pb-10 border-t border-white/10 overflow-hidden flex flex-col justify-between"
  >
    <!-- Background Ambient Glow -->
    <div class="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-signal/12 rounded-full blur-[140px]" />

    <div ref="footerInnerRef" class="page-shell-wide relative z-10 flex flex-col justify-between grow space-y-16 will-change-transform">
      <!-- Top Live Availability & Clock Strip -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-8 font-mono text-xs">
        <div class="flex items-center gap-3">
          <span class="relative flex size-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span class="relative inline-flex size-2.5 rounded-full bg-signal" />
          </span>
          <span class="font-semibold text-paper uppercase tracking-[0.14em]">
            Terbuka Untuk Kolaborasi 2026
          </span>
        </div>

        <div class="flex items-center gap-6 text-paper/60 uppercase tracking-widest text-[0.72rem]">
          <span>Jakarta, ID <strong class="text-paper font-semibold">{{ currentTime }} WIB</strong></span>
          <span class="hidden sm:inline text-white/20">|</span>
          <span class="hidden sm:inline">Nuxt 3 SSR · GSAP Motion</span>
        </div>
      </div>

      <!-- Main Headline & Quick Action -->
      <div class="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
        <div>
          <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-signal uppercase tracking-widest mb-3">
            <span>{ Connect & Socials }</span>
          </div>
          <h2 class="font-display text-display-l text-paper tracking-tight font-bold max-w-2xl">
            Mari wujudkan ide digital berikutnya.
          </h2>
        </div>

        <div class="space-y-4 lg:text-right">
          <p class="font-body text-paper/75 text-sm sm:text-base max-w-md ml-auto">
            Terhubung melalui kanal sosial media atau kirim pesan singkat untuk memulai diskusi proyek.
          </p>
          <div class="flex flex-wrap gap-3 lg:justify-end">
            <a
              href="mailto:contact@rumahdesign.id"
              class="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-signal/25 transition-all hover:scale-105 hover:bg-[#e63d10]"
            >
              <span>Kirim Email Langsung</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Editorial Social Media Cards Grid (Sosmed Concept) -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
        <a
          v-for="item in socialChannels"
          :key="item.name"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-signal/50 hover:bg-white/[0.07] hover:translate-y-[-2px] shadow-xs"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-bold text-paper uppercase tracking-wider group-hover:text-signal transition-colors">
                {{ item.name }}
              </span>
              <span class="font-mono text-[0.7rem] text-signal font-semibold opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                {{ item.action }}
              </span>
            </div>
            <p class="font-mono text-xs text-paper/90 font-medium">
              {{ item.handle }}
            </p>
            <p class="font-sans text-xs text-paper/60 leading-relaxed">
              {{ item.desc }}
            </p>
          </div>
        </a>
      </div>

      <!-- Massive Brand Signature Watermark -->
      <div class="py-4 text-center select-none pointer-events-none">
        <span class="font-display font-bold text-[clamp(2.75rem,9vw,9.5rem)] text-white/[0.06] tracking-tighter leading-none block uppercase">
          Rumah Design
        </span>
      </div>

      <!-- Bottom Sitemap & Back to Top Bar -->
      <div class="flex flex-col justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row font-mono text-[0.75rem] text-paper/50 items-center">
        <p>© {{ new Date().getFullYear() }} Rumah Design Studio. All rights reserved.</p>

        <div class="flex items-center gap-6">
          <NuxtLink to="/#work" class="hover:text-paper transition-colors">Karya</NuxtLink>
          <NuxtLink to="/about" class="hover:text-paper transition-colors">Tentang</NuxtLink>
          <NuxtLink to="/admin/login" class="hover:text-paper transition-colors">Admin</NuxtLink>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-4 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-paper transition-all hover:border-signal hover:bg-signal/20 hover:text-signal"
            @click="scrollToTop"
          >
            ↑ Ke Atas
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>
