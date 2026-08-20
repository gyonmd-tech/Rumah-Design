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
      <div class="my-auto text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 py-6 sm:py-8">
        <!-- Big Balanced Headline -->
        <h2 class="font-display text-[clamp(2.25rem,4.5vw,4.5rem)] text-paper tracking-tight font-bold leading-[1.08] text-balance">
          <span class="block">Mari wujudkan karya digital</span>
          <span class="block text-signal">berikutnya bersama kami.</span>
        </h2>

        <!-- Short Studio Statement -->
        <p class="font-sans text-xs sm:text-sm md:text-base text-paper/70 max-w-lg mx-auto leading-relaxed">
          Membangun antarmuka interaktif, design system terstruktur, dan rekayasa frontend siap rilis.
        </p>

        <!-- Action Buttons with Radial Reveal Hover -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1">
          <RadialRevealButton
            to="/contact"
            variant="primary"
            label="Mulai Diskusi Proyek"
            add-icon
            :icon="{ symbol: '↗', size: 14, side: 'right' }"
            padding="0.85rem 2rem"
            custom-class="w-full sm:w-auto shadow-xl shadow-signal/30 text-xs sm:text-sm"
          />

          <RadialRevealButton
            variant="glass"
            label="Salin Email"
            padding="0.85rem 1.8rem"
            custom-class="w-full sm:w-auto text-xs sm:text-sm"
            @click="copyEmail"
          />
        </div>

        <!-- Pure Naked Social Media Logos (Prominent Size) -->
        <div class="flex items-center justify-center gap-7 sm:gap-10 md:gap-12 pt-5 sm:pt-7">
          <a
            v-for="item in socialChannels"
            :key="item.name"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="item.name"
            :title="item.name"
            class="group inline-flex items-center justify-center p-2.5 transition-transform duration-300 hover:scale-125 active:scale-95"
          >
            <img
              :src="item.icon"
              :alt="`${item.name} logo`"
              class="size-10 sm:size-12 md:size-14 object-contain opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_16px_rgba(255,74,28,0.65)]"
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
          <RadialRevealButton
            variant="glass"
            label="↑ Ke Atas"
            padding="0.25rem 0.85rem"
            custom-class="!text-[0.68rem] tracking-wider"
            @click="scrollToTop"
          />
        </div>
      </div>
    </div>
  </footer>
</template>

