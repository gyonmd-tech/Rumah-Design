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

// Prominent Social Media Logos
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
  <!-- Full 1-Screen Editorial Footer -->
  <footer
    ref="footerRef"
    class="relative z-20 w-full min-h-[100dvh] bg-[#0c0b0a] text-paper py-8 sm:py-12 border-t border-white/10 overflow-hidden flex flex-col justify-between shadow-[0_-20px_60px_rgba(0,0,0,0.6)]"
  >
    <!-- Background Ambient Glow Center Spotlight -->
    <div class="pointer-events-none absolute -bottom-36 left-1/2 -translate-x-1/2 w-[360px] sm:w-[680px] h-[220px] sm:h-[340px] bg-signal/14 rounded-full blur-[100px] sm:blur-[130px]" />

    <div ref="footerInnerRef" class="page-shell-wide relative z-10 flex flex-col justify-between grow w-full">
      <!-- Top / Center Hero Content -->
      <div class="my-auto text-center max-w-5xl mx-auto space-y-8 sm:space-y-10 py-6 sm:py-10">
        <!-- Big Balanced Headline -->
        <h2 class="font-display text-[clamp(2.25rem,4.5vw,4.5rem)] text-paper tracking-tight font-bold leading-[1.08] text-balance">
          <span class="block">Mari wujudkan karya digital</span>
          <span class="block text-signal">berikutnya bersama kami.</span>
        </h2>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <NuxtLink
            to="/contact"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-signal px-8 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-signal/30 transition-all duration-300 hover:scale-105 hover:bg-[#e63d10] active:scale-95"
          >
            <span>Mulai Diskusi Proyek</span>
            <span class="text-sm">↗</span>
          </NuxtLink>

          <button
            type="button"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/15 px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-paper hover:bg-white/18 hover:border-white/30 transition-all duration-200"
            @click="copyEmail"
          >
            <span>Salin Email</span>
          </button>
        </div>

        <!-- Prominent Social Media Logos -->
        <div class="flex items-center justify-center gap-4 sm:gap-6 pt-2 sm:pt-4">
          <a
            v-for="item in socialChannels"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="item.name"
            :title="item.name"
            class="group relative size-14 sm:size-18 md:size-20 rounded-2xl sm:rounded-3xl bg-white/[0.05] border border-white/12 p-3.5 sm:p-4.5 md:p-5 flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/15 hover:border-signal/70 hover:shadow-[0_0_30px_rgba(255,74,28,0.3)] active:scale-95 shadow-md"
          >
            <img
              :src="item.icon"
              :alt="`${item.name} logo`"
              class="size-full object-contain filter brightness-100 transition-transform duration-300 group-hover:scale-110"
            >
          </a>
        </div>
      </div>

      <!-- Massive Brand Signature Watermark -->
      <div class="py-2 text-center select-none pointer-events-none overflow-hidden">
        <span class="font-display font-bold text-[clamp(2.8rem,11.5vw,11rem)] text-white/[0.07] tracking-tighter leading-none block uppercase truncate">
          Rumah Design
        </span>
      </div>

      <!-- Bottom Sitemap & Back to Top Bar -->
      <div class="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row font-mono text-[0.72rem] sm:text-[0.75rem] text-paper/50 items-center text-center sm:text-left">
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

