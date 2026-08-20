<script setup lang="ts">
import githubIcon from '~/assets/github.svg'
import gmailIcon from '~/assets/gmail.svg'
import instagramIcon from '~/assets/instagram.svg'
import linkedinIcon from '~/assets/linkedin.svg'

const { setupFooterUncover } = useMotion()
const { success: showToast } = useToast()

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

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('hello@rumahdesign.dev')
    showToast('Alamat email hello@rumahdesign.dev berhasil disalin!')
  } catch (err) {
    console.error('Gagal menyalin email:', err)
  }
}

// Social Media Channels with provided SVG logos
const socialChannels = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: githubIcon,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: linkedinIcon,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: instagramIcon,
  },
  {
    name: 'Gmail',
    url: 'mailto:hello@rumahdesign.dev',
    icon: gmailIcon,
  },
]
</script>

<template>
  <!-- Natural Flow Full Editorial Footer -->
  <footer
    ref="footerRef"
    class="relative z-20 w-full bg-[#0c0b0a] text-paper pt-16 sm:pt-24 pb-8 sm:pb-12 border-t border-white/10 overflow-hidden flex flex-col justify-between shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
  >
    <!-- Background Ambient Glow Center Spotlight -->
    <div class="pointer-events-none absolute -bottom-36 left-1/2 -translate-x-1/2 w-[360px] sm:w-[680px] h-[220px] sm:h-[340px] bg-signal/14 rounded-full blur-[100px] sm:blur-[130px]" />

    <div ref="footerInnerRef" class="page-shell-wide relative z-10 flex flex-col justify-between grow space-y-12 sm:space-y-16">
      <!-- 1. Top Live Availability & Clock Strip (Centered Balance) -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-b border-white/12 pb-6 sm:pb-8 font-mono text-xs text-center sm:text-left">
        <div class="flex items-center gap-2.5">
          <span class="relative flex size-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span class="relative inline-flex size-2.5 rounded-full bg-signal" />
          </span>
          <span class="font-semibold text-paper uppercase tracking-[0.1em] sm:tracking-[0.14em] text-[0.72rem] sm:text-xs">
            Terbuka Untuk Kolaborasi Proyek 2026
          </span>
        </div>

        <div class="flex items-center gap-3 sm:gap-6 text-paper/60 uppercase tracking-widest text-[0.68rem] sm:text-[0.72rem]">
          <span>Jakarta, ID <strong class="text-paper font-semibold">{{ currentTime }} WIB</strong></span>
          <span class="text-white/20">|</span>
          <span>Nuxt 3 SSR · GSAP Motion</span>
        </div>
      </div>

      <!-- 2. BIG CENTER EDITORIAL HERO SECTION -->
      <div class="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 py-2 sm:py-6">
        <!-- Eyebrow Tag -->
        <div class="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 backdrop-blur-md">
          <span class="size-1.5 rounded-full bg-signal" />
          <span class="font-mono text-[0.7rem] sm:text-xs font-semibold text-paper/80 uppercase tracking-[0.16em]">
            { Mulai Proyek Baru }
          </span>
        </div>

        <!-- Big Center Headline -->
        <h2 class="font-display text-display-l text-paper tracking-tight font-bold leading-[1.02]">
          <span>Mari wujudkan ide digital</span>
          <br class="hidden sm:inline">
          <span class="text-signal"> berikutnya bersama kami.</span>
        </h2>

        <!-- Subheading Pitch -->
        <p class="font-sans text-body-m text-paper/75 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
          Dari eksplorasi konsep antarmuka, pembuatan design system, hingga rekayasa kode frontend siap rilis. Diskusikan ide dan kebutuhan produk Anda hari ini.
        </p>

        <!-- Big Centered CTA Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <NuxtLink
            to="/contact"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-signal px-8 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-signal/30 transition-all duration-300 hover:scale-105 hover:bg-[#e63d10] active:scale-95"
          >
            <span>Mulai Diskusi Proyek</span>
            <span class="text-sm">↗</span>
          </NuxtLink>

          <button
            type="button"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/15 px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-paper hover:bg-white/18 hover:border-white/30 transition-all duration-200"
            @click="copyEmail"
          >
            <span>Salin Email 📋</span>
          </button>
        </div>

        <!-- 3. SLEEK SOCIAL MEDIA LOGO ICONS ROW -->
        <div class="flex items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
          <a
            v-for="item in socialChannels"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="item.name"
            :title="item.name"
            class="group relative size-11 sm:size-13 rounded-2xl bg-white/[0.05] border border-white/12 p-2.5 sm:p-3 flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/15 hover:border-signal/70 hover:shadow-[0_0_24px_rgba(255,74,28,0.25)] active:scale-95"
          >
            <img
              :src="item.icon"
              :alt="`${item.name} logo`"
              class="size-full object-contain filter brightness-100 transition-transform duration-300 group-hover:scale-105"
            >
          </a>
        </div>
      </div>

      <!-- 4. MASSIVE BRAND SIGNATURE WATERMARK (CENTERED EDITORIAL) -->
      <div class="py-4 sm:py-8 text-center select-none pointer-events-none overflow-hidden">
        <span class="font-display font-bold text-[clamp(2.4rem,11.5vw,12rem)] text-white/[0.07] tracking-tighter leading-none block uppercase truncate">
          Rumah Design
        </span>
      </div>

      <!-- 5. BOTTOM SITEMAP & BACK TO TOP BAR -->
      <div class="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:pt-8 sm:flex-row font-mono text-[0.72rem] sm:text-[0.75rem] text-paper/50 items-center text-center sm:text-left">
        <p>© {{ new Date().getFullYear() }} Rumah Design Studio. All rights reserved.</p>

        <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <NuxtLink to="/#work" class="hover:text-paper transition-colors py-1">Karya</NuxtLink>
          <NuxtLink to="/about" class="hover:text-paper transition-colors py-1">Tentang</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-paper transition-colors py-1">Hubungi</NuxtLink>
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

