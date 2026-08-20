<script setup lang="ts">
import githubIcon from '~/assets/github.svg'
import gmailIcon from '~/assets/gmail.svg'
import instagramIcon from '~/assets/instagram.svg'
import linkedinIcon from '~/assets/linkedin.svg'

const { setupFooterUncover } = useMotion()
const { success: showToast } = useToast()

const footerRef = ref<HTMLElement | null>(null)
const footerInnerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (footerRef.value && footerInnerRef.value) {
    setupFooterUncover(footerRef.value, footerInnerRef.value)
  }
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
    handle: 'github.com',
    url: 'https://github.com',
    icon: githubIcon,
    label: 'Explore ↗',
  },
  {
    name: 'LinkedIn',
    handle: 'linkedin.com',
    url: 'https://linkedin.com',
    icon: linkedinIcon,
    label: 'Connect ↗',
  },
  {
    name: 'Instagram',
    handle: '@rumahdesign',
    url: 'https://instagram.com',
    icon: instagramIcon,
    label: 'Follow ↗',
  },
  {
    name: 'Gmail',
    handle: 'hello@rumahdesign.dev',
    url: 'mailto:hello@rumahdesign.dev',
    icon: gmailIcon,
    label: 'Inquiry ↗',
  },
]
</script>

<template>
  <!-- Full 1-Screen Rich Editorial Footer -->
  <footer
    ref="footerRef"
    class="relative z-20 w-full min-h-[100dvh] bg-[#0c0b0a] text-paper py-6 sm:py-8 md:py-10 border-t border-white/10 overflow-hidden flex flex-col justify-between shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
  >
    <!-- Background Ambient Glow Center Spotlight -->
    <div class="pointer-events-none absolute -bottom-36 left-1/2 -translate-x-1/2 w-[360px] sm:w-[680px] h-[220px] sm:h-[340px] bg-signal/14 rounded-full blur-[100px] sm:blur-[130px]" />

    <div ref="footerInnerRef" class="page-shell-wide relative z-10 flex flex-col justify-between grow w-full gap-6 sm:gap-8">
      <!-- 1. Top Studio Bar (Clean, Crisp, Informative) -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 border-b border-white/10 pb-4 font-mono text-[0.68rem] sm:text-xs text-paper/60 uppercase tracking-widest text-center sm:text-left">
        <div class="flex items-center gap-2">
          <span class="size-1.5 rounded-full bg-signal" />
          <span class="font-semibold text-paper/90">Rumah Design · Studio Frontend & UI</span>
        </div>
        <div class="flex items-center gap-4 text-paper/50">
          <span>Jakarta, ID</span>
          <span>·</span>
          <span>Tersedia untuk Proyek 2026</span>
        </div>
      </div>

      <!-- 2. Middle Main Hero Section -->
      <div class="text-center max-w-5xl mx-auto space-y-5 sm:space-y-6 my-auto py-2">
        <!-- Big Balanced Headline -->
        <h2 class="font-display text-[clamp(2.2rem,4.4vw,4.5rem)] text-paper tracking-tight font-bold leading-[1.06] text-balance">
          <span class="block">Mari wujudkan karya digital</span>
          <span class="block text-signal">berikutnya bersama kami.</span>
        </h2>

        <!-- Short Studio Statement -->
        <p class="font-sans text-xs sm:text-sm md:text-base text-paper/70 max-w-xl mx-auto leading-relaxed">
          Membangun antarmuka interaktif, design system terstruktur, dan rekayasa frontend siap rilis.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1">
          <NuxtLink
            to="/contact"
            class="btn-wave btn-wave-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 sm:px-9 py-3 sm:py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-signal/30"
          >
            <span>Mulai Diskusi Proyek</span>
            <span class="text-sm">↗</span>
          </NuxtLink>

          <button
            type="button"
            class="btn-wave btn-wave-glass w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/15 px-6 py-3 sm:py-3.5 font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-paper"
            @click="copyEmail"
          >
            <span>Salin Email</span>
          </button>
        </div>

        <!-- 3. Interactive Social Media Dock with Prominent Logos -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-4 max-w-3xl mx-auto">
          <a
            v-for="item in socialChannels"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="item.name"
            :title="item.name"
            class="btn-wave btn-wave-glass group flex items-center justify-between rounded-2xl bg-white/[0.04] border border-white/10 px-3.5 sm:px-4 py-2.5 sm:py-3 backdrop-blur-md transition-all shadow-xs"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="size-7 sm:size-8 shrink-0 flex items-center justify-center">
                <img
                  :src="item.icon"
                  :alt="`${item.name} logo`"
                  class="size-full object-contain filter brightness-100 transition-transform duration-300 group-hover:scale-110"
                >
              </div>
              <div class="text-left min-w-0">
                <p class="font-display text-xs sm:text-sm font-bold text-paper truncate group-hover:text-white">
                  {{ item.name }}
                </p>
                <p class="font-mono text-[0.62rem] sm:text-[0.68rem] text-paper/50 truncate">
                  {{ item.handle }}
                </p>
              </div>
            </div>
            <span class="font-mono text-[0.62rem] sm:text-xs text-signal font-semibold opacity-70 group-hover:opacity-100 shrink-0 ml-1">
              ↗
            </span>
          </a>
        </div>
      </div>

      <!-- 4. Massive Brand Signature Watermark -->
      <div class="py-1 text-center select-none pointer-events-none overflow-hidden">
        <span class="font-display font-bold text-[clamp(2.6rem,11vw,10rem)] text-white/[0.06] tracking-tighter leading-none block uppercase truncate">
          Rumah Design
        </span>
      </div>

      <!-- 5. Bottom Sitemap & Back to Top Bar -->
      <div class="flex flex-col justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row font-mono text-[0.7rem] sm:text-[0.72rem] text-paper/50 items-center text-center sm:text-left">
        <p>© {{ new Date().getFullYear() }} Rumah Design Studio. All rights reserved.</p>

        <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <NuxtLink to="/#work" class="hover:text-paper transition-colors py-1">Karya</NuxtLink>
          <NuxtLink to="/about" class="hover:text-paper transition-colors py-1">Tentang</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-paper transition-colors py-1">Hubungi</NuxtLink>
          <NuxtLink to="/admin/login" class="hover:text-paper transition-colors py-1">Admin</NuxtLink>
          <button
            type="button"
            class="btn-wave btn-wave-glass inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-paper"
            @click="scrollToTop"
          >
            <span>↑ Ke Atas</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

