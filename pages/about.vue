<script setup lang="ts">
const { animateHeroReveal, setupCardsBatch } = useMotion()

const headlineLine1 = ref<HTMLElement | null>(null)
const headlineLine2 = ref<HTMLElement | null>(null)
const eyebrowRef = ref<HTMLElement | null>(null)
const introRef = ref<HTMLElement | null>(null)
const tenetsContainerRef = ref<HTMLElement | null>(null)
const capabilitiesContainerRef = ref<HTMLElement | null>(null)

let tenetsCtx: ReturnType<typeof setupCardsBatch> | null = null
let capabilitiesCtx: ReturnType<typeof setupCardsBatch> | null = null

onMounted(() => {
  document.documentElement.classList.add('light-mode')

  const lines = [headlineLine1.value, headlineLine2.value].filter(Boolean) as HTMLElement[]
  animateHeroReveal({
    headlineLines: lines,
    eyebrow: eyebrowRef.value,
    intro: introRef.value,
  })

  nextTick(() => {
    if (tenetsContainerRef.value) {
      tenetsCtx = setupCardsBatch(tenetsContainerRef.value, '.tenet-card')
    }
    if (capabilitiesContainerRef.value) {
      capabilitiesCtx = setupCardsBatch(capabilitiesContainerRef.value, '.capability-card')
    }
  })
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light-mode')
  }
  if (tenetsCtx) {
    tenetsCtx.revert()
    tenetsCtx = null
  }
  if (capabilitiesCtx) {
    capabilitiesCtx.revert()
    capabilitiesCtx = null
  }
})

const siteConfig = useSiteConfig()

useSeoMeta({
  title: 'Tentang — Rumah Design',
  description: 'Filosofi kerja, standar kerajinan, dan pendekatan frontend engineering di balik studio Rumah Design.',
  ogTitle: 'Tentang Studio — Rumah Design',
  ogDescription: 'Menghubungkan visi desain produk dan arsitektur kode frontend yang hidup, presisi, dan terukur.',
  ogType: 'profile',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteConfig.url}/about` }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Tentang Rumah Design',
      description: 'Filosofi kerja dan kapabilitas product design serta frontend engineering Rumah Design.',
      url: `${siteConfig.url}/about`,
    }),
  }],
})

const coreTenets = [
  {
    number: '01',
    title: 'Design-Led Engineering',
    tag: 'Prinsip 1',
    summary: 'Kode tidak ditulis terpisah dari visi desain. Setiap ritme spasi, hierarki visual, dan mikro-interaksi diimplementasikan dengan standar estetika tertinggi tanpa kompromi.',
  },
  {
    number: '02',
    title: 'Living Product, Real Code',
    tag: 'Prinsip 2',
    summary: 'Karya tidak berhenti di artboard statis Figma. Pengalaman pengguna sejati dirasakan melalui prototype fungsional di browser dengan performa 60–120fps yang responsif.',
  },
  {
    number: '03',
    title: 'High-Performance Simplicity',
    tag: 'Prinsip 3',
    summary: 'Menghindari beban dependensi yang tidak perlu. Kami membangun antarmuka dengan fondasi SSR Nuxt 3, TypeScript terstruktur, standar aksesibilitas inklusif, dan optimasi SEO semantik.',
  },
]

const capabilities = [
  {
    category: 'Interactive Web & Landing Pages',
    desc: 'Halaman storytelling visual dengan orkestrasi scroll GSAP, tipografi editorial kontras tinggi, dan transisi fluid tanpa lag.',
    skills: ['Nuxt 3 SSR', 'GSAP Motion', 'Tailwind CSS', 'Lenis Smooth Scroll', 'Responsive Art Direction'],
  },
  {
    category: 'SaaS & Web App Antarmuka',
    desc: 'Aplikasi berbasis data yang mengedepankan kejelasan hierarki, dashboard analytics, dan navigasi modular yang intuitif.',
    skills: ['Vue 3 / React', 'TypeScript', 'State Management', 'Supabase PostgreSQL', 'Role-based Access'],
  },
  {
    category: 'Design Systems & Component Library',
    desc: 'Penyusunan token desain terpadu, variasi komponen konsisten, dark/light token architecture, dan reusable UI primitives.',
    skills: ['Design Tokens', 'Figma to Code', 'Tailwind Utilities', 'Accessibility (a11y)', 'Component Docs'],
  },
  {
    category: 'Performance, SEO & Delivery',
    desc: 'Audit Lighthouse skor tinggi, dynamic Open Graph images, structured data (JSON-LD), dan deployment edge berlatensi rendah.',
    skills: ['Lighthouse 95+', 'JSON-LD Schema', 'Vercel Edge', 'Nitro Server', 'Reduced Motion'],
  },
]
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pt-28 sm:pt-32 pb-20 sm:pb-28 relative z-20 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
    <div class="page-shell space-y-16 sm:space-y-24">
      <!-- 1. HERO SECTION: BOLD & EDITORIAL -->
      <section class="border-b border-ink/12 pb-12 sm:pb-18">
        <div ref="eyebrowRef" class="inline-flex items-center gap-2 rounded-full bg-ink/5 border border-ink/10 px-3.5 py-1.5">
          <span class="size-1.5 rounded-full bg-signal" />
          <span class="font-mono text-[0.7rem] sm:text-xs font-semibold text-mute uppercase tracking-[0.14em]">
            Studio Kerajinan Digital · Jakarta, ID
          </span>
        </div>

        <h1 class="mt-4 sm:mt-6 font-display text-display-l text-ink max-w-[18ch] tracking-tight font-bold">
          <span class="block overflow-hidden">
            <span ref="headlineLine1" class="inline-block will-change-transform">Menghubungkan visi desain</span>
          </span>
          <span class="block overflow-hidden">
            <span ref="headlineLine2" class="inline-block text-signal will-change-transform">dengan presisi kode.</span>
          </span>
        </h1>

        <div ref="introRef" class="mt-6 sm:mt-10 max-w-3xl space-y-4 sm:space-y-6 text-body-l text-ink/90">
          <p class="font-sans leading-relaxed text-base sm:text-lg text-ink font-medium">
            Rumah Design adalah studio independen dan arsip karya digital yang menggabungkan ketajaman estetika product design dengan ketepatan rekayasa frontend modern.
          </p>
          <p class="text-sm sm:text-base text-mute leading-relaxed font-sans">
            Saya percaya antarmuka digital terbaik lahir saat batasan antara eksplorasi visual dan implementasi teknis ditiadakan. Setiap karya di sini dibangun dari baris kode pertama hingga performa produksi yang siap dicoba langsung.
          </p>
        </div>
      </section>

      <!-- 2. CORE PHILOSOPHY / TENETS (3 PILLARS) -->
      <section class="space-y-8 sm:space-y-12">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/10 pb-4">
          <div>
            <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-signal uppercase tracking-widest">
              <span>{ 01 · Filosofi & Prinsip }</span>
            </div>
            <h2 class="mt-2 font-display text-display-m text-ink">
              Standar kerja tanpa kompromi
            </h2>
          </div>
          <p class="font-mono text-xs text-mute uppercase tracking-wider">
            Tiga pilar dalam membangun setiap produk
          </p>
        </div>

        <div ref="tenetsContainerRef" class="grid gap-6 grid-cols-1 md:grid-cols-3">
          <article
            v-for="tenet in coreTenets"
            :key="tenet.number"
            class="tenet-card will-change-transform rounded-2xl sm:rounded-3xl bg-white/80 p-6 sm:p-8 border border-ink/10 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-ink/8 pb-4">
                <span class="font-mono text-2xl sm:text-3xl font-bold text-signal">{{ tenet.number }}</span>
                <span class="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[0.65rem] font-bold text-mute uppercase tracking-wider">
                  {{ tenet.tag }}
                </span>
              </div>
              <h3 class="font-display text-lg sm:text-xl font-bold text-ink tracking-tight">
                {{ tenet.title }}
              </h3>
              <p class="text-xs sm:text-sm text-mute leading-relaxed font-sans">
                {{ tenet.summary }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- 3. CAPABILITIES / WHAT I BUILD (2x2 GRID) -->
      <section class="space-y-8 sm:space-y-12">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/10 pb-4">
          <div>
            <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-signal uppercase tracking-widest">
              <span>{ 02 · Kapabilitas & Layanan }</span>
            </div>
            <h2 class="mt-2 font-display text-display-m text-ink">
              Apa yang saya rancang & bangun
            </h2>
          </div>
          <p class="font-mono text-xs text-mute uppercase tracking-wider">
            Spesialisasi rekayasa antarmuka web
          </p>
        </div>

        <div ref="capabilitiesContainerRef" class="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div
            v-for="(cap, idx) in capabilities"
            :key="idx"
            class="capability-card will-change-transform rounded-2xl sm:rounded-3xl bg-white/80 p-6 sm:p-8 border border-ink/10 shadow-xs hover:shadow-md transition-all duration-300 space-y-5"
          >
            <div class="flex items-center gap-2 font-mono text-xs font-bold text-signal uppercase tracking-widest">
              <span class="size-1.5 rounded-full bg-signal" />
              <span>Area #0{{ idx + 1 }}</span>
            </div>

            <h3 class="font-display text-lg sm:text-xl font-bold text-ink">
              {{ cap.category }}
            </h3>

            <p class="text-xs sm:text-sm text-mute leading-relaxed">
              {{ cap.desc }}
            </p>

            <div class="pt-2 flex flex-wrap gap-1.5 sm:gap-2">
              <span
                v-for="skill in cap.skills"
                :key="skill"
                class="rounded-lg bg-ink/5 px-2.5 py-1 font-mono text-[0.68rem] font-medium text-ink/80 border border-ink/5"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. MANIFESTO / PERSPECTIVE STATEMENT -->
      <section class="rounded-3xl bg-[#14120f] text-paper p-8 sm:p-12 md:p-16 border border-white/10 relative overflow-hidden">
        <div class="pointer-events-none absolute -right-24 -bottom-24 w-80 h-80 bg-signal/15 rounded-full blur-[90px]" />
        
        <div class="relative z-10 max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-signal uppercase tracking-widest">
            <span>[ Catatan Studio ]</span>
          </div>
          <blockquote class="font-display text-xl sm:text-2xl md:text-3xl font-medium text-paper leading-tight tracking-tight">
            "Tren visual terus berganti, namun kebutuhan akan kejelasan hierarki informasi, performa instan, dan antarmuka yang bernyawa akan selalu menjadi pembeda utama produk hebat."
          </blockquote>
          <p class="font-mono text-xs sm:text-sm text-paper/60 uppercase tracking-widest pt-2">
            — Rumah Design · Product Design & Frontend Studio
          </p>
        </div>
      </section>

      <!-- 5. DIRECT CTA STRIP TO CONTACT PAGE -->
      <section class="border-t border-ink/12 pt-12 sm:pt-16 pb-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 rounded-3xl bg-gradient-to-br from-white/90 to-white/50 p-8 sm:p-12 border border-ink/10 shadow-sm">
          <div class="space-y-2 sm:space-y-3 max-w-xl">
            <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-signal uppercase tracking-widest">
              <span class="relative flex size-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                <span class="relative inline-flex size-2 rounded-full bg-signal" />
              </span>
              <span>Mulai Kolaborasi</span>
            </div>
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Punya ide atau proyek baru yang ingin diwujudkan?
            </h2>
            <p class="text-xs sm:text-sm text-mute leading-relaxed">
              Diskusikan kebutuhan landing page, web app, atau konsultasi arsitektur frontend Anda melalui halaman kontak resmi.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <RadialRevealButton
              to="/contact"
              variant="primary"
              label="Buka Halaman Hubungi"
              add-icon
              :icon="{ symbol: '↗', size: 14, side: 'right' }"
              padding="0.8rem 1.6rem"
              custom-class="shadow-md text-xs"
            />
            <RadialRevealButton
              to="/#work"
              variant="dark"
              label="Lihat Karya Terpilih"
              padding="0.8rem 1.4rem"
              custom-class="text-xs"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
