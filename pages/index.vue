<script setup lang="ts">
import type { Project, ProjectCategory } from '~/types/database.types'

const { data: dbProjects, status, error, refresh } = await useAsyncData('published-projects', async () => {
  try {
    return await $fetch<Project[]>('/api/projects')
  } catch (err) {
    console.error('Gagal memuat projects dari server:', err)
    return [] as Project[]
  }
})

const allProjects = computed<Project[]>(() => dbProjects.value ?? [])

const category = ref<ProjectCategory | 'all'>('all')
const searchQuery = ref('')
const isScrolled = ref(false)

const filteredProjects = computed(() => allProjects.value.filter((project) => {
  const matchesCategory = category.value === 'all' || project.category === category.value
  
  if (!searchQuery.value.trim()) return matchesCategory

  const query = searchQuery.value.toLowerCase().trim()
  const matchesTitle = project.title.toLowerCase().includes(query)
  const matchesDesc = (project.description || '').toLowerCase().includes(query)
  const matchesTech = (project.tech_stack || []).some(t => t.toLowerCase().includes(query))
  const matchesTags = (project.style_tags || []).some(t => t.toLowerCase().includes(query))

  return matchesCategory && (matchesTitle || matchesDesc || matchesTech || matchesTags)
}))

// Motion system hooks
const { animateHeroReveal, setupHeroParallax, setupCardsBatch, isReducedMotion } = useMotion()

const heroSectionRef = ref<HTMLElement | null>(null)
const heroContentRef = ref<HTMLElement | null>(null)
const headlineLine1 = ref<HTMLElement | null>(null)
const headlineLine2 = ref<HTMLElement | null>(null)
const headlineLine3 = ref<HTMLElement | null>(null)
const introRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const scrollCueRef = ref<HTMLElement | null>(null)
const cardsContainerRef = ref<HTMLElement | null>(null)

let scrollTicking = false
const handleScroll = () => {
  if (typeof window === 'undefined') return
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > 40
      scrollTicking = false
    })
    scrollTicking = true
  }
}

// Keep a ref to the cards gsap.Context so we can revert (prevents ScrollTrigger accumulation)
let cardsCtx: ReturnType<typeof setupCardsBatch> | null = null

const refreshCards = () => {
  if (!cardsContainerRef.value) return
  // Revert previous context before creating a new one
  if (cardsCtx) {
    cardsCtx.revert()
    cardsCtx = null
  }
  cardsCtx = setupCardsBatch(cardsContainerRef.value, '.project-card-item')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 1. Hero Reveal on Load
  const lines = [headlineLine1.value, headlineLine2.value, headlineLine3.value].filter(Boolean) as HTMLElement[]
  animateHeroReveal({
    headlineLines: lines,
    intro: introRef.value,
    stats: statsRef.value,
    scrollCue: scrollCueRef.value,
  })

  // 2. Setup Smooth Hero Parallax
  if (heroSectionRef.value && heroContentRef.value) {
    setupHeroParallax(heroSectionRef.value, heroContentRef.value)
  }

  // 3. Batch Stagger for Cards
  nextTick(refreshCards)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
  if (cardsCtx) {
    cardsCtx.revert()
    cardsCtx = null
  }
})

// Watch filter changes to refresh card triggers (with cleanup)
watch([category, searchQuery], () => {
  nextTick(refreshCards)
})

const siteUrl = useRuntimeConfig().public.siteUrl as string || ''

useSeoMeta({
  title: 'Rumah Design — Selected Digital Work',
  description: 'Kumpulan karya frontend dan cerita proses desain dari seorang product designer yang membangun produknya sendiri.',
  ogTitle: 'Rumah Design — Selected Digital Work',
  ogDescription: 'Project frontend terpilih, lengkap dengan proses desain dan live demo.',
  ogType: 'website',
  ogImage: `${siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Rumah Design — Selected Digital Work',
  twitterDescription: 'Project frontend terpilih, lengkap dengan proses desain dan live demo.',
})
</script>

<template>
  <div class="relative min-h-screen bg-void">
    <!-- HERO SECTION (DARK VOID + UNCLIPPED CLEAN PARALLAX) -->
    <section
      id="hero-section"
      ref="heroSectionRef"
      class="relative z-10 flex min-h-[92vh] sm:min-h-screen flex-col justify-between pt-28 sm:pt-36 pb-20 sm:pb-32 bg-void text-paper overflow-hidden"
    >
      <!-- Background Ambient Glow (reduced size to ease GPU paint cost) -->
      <div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] h-[220px] sm:h-[280px] bg-signal/12 rounded-full blur-[80px] sm:blur-[100px]" />

      <div ref="heroContentRef" class="page-shell-wide relative z-10 flex flex-col justify-center my-auto grow py-4 sm:py-6">
        <!-- Headline Display XL with Safe Padding for Descenders -->
        <div class="py-4 sm:py-6 md:py-12">
          <h1 class="max-w-[15ch] font-display text-display-xl tracking-tight text-paper select-none">
            <span class="block overflow-hidden pt-0.5 sm:pt-1 pb-2 sm:pb-3 -mb-2 sm:-mb-3">
              <span ref="headlineLine1" class="inline-block will-change-transform">Ide yang</span>
            </span>
            <span class="block overflow-hidden pt-0.5 sm:pt-1 pb-2 sm:pb-3 -mb-2 sm:-mb-3">
              <span ref="headlineLine2" class="inline-block will-change-transform">dirancang untuk</span>
            </span>
            <span class="block overflow-hidden pt-0.5 sm:pt-1 pb-2 sm:pb-3 -mb-2 sm:-mb-3">
              <span ref="headlineLine3" class="inline-block text-signal will-change-transform">benar-benar hidup.</span>
            </span>
          </h1>
        </div>

        <!-- Bottom Intro & Stat Strip -->
        <div class="grid gap-4 sm:gap-8 border-t border-paper/15 pt-6 sm:pt-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <p ref="introRef" class="max-w-2xl text-body-l text-paper/90 font-sans leading-relaxed">
            Saya merancang pengalaman dan membangun frontend-nya—dari alur pertama sampai produk yang bisa dicoba langsung.
          </p>
          <div ref="statsRef" class="md:text-right">
            <p class="font-mono text-[0.7rem] sm:text-xs text-paper/60 uppercase tracking-[0.1em] sm:tracking-[0.14em]">
              {{ allProjects.length }} Project · Nuxt 3 SSR · GSAP · Jakarta
            </p>
          </div>
        </div>
      </div>

      <!-- Scroll Cue Indicator (fades on scroll) -->
      <div
        ref="scrollCueRef"
        class="pointer-events-none absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 text-center transition-opacity duration-300 z-10"
        :class="isScrolled ? 'opacity-0' : 'opacity-100'"
      >
        <span class="font-mono text-[0.62rem] sm:text-[0.65rem] tracking-[0.2em] text-paper/50 uppercase">Scroll</span>
        <div class="h-6 sm:h-8 w-[1.5px] overflow-hidden rounded-full bg-paper/20">
          <div class="h-full w-full bg-signal animate-bounce" />
        </div>
      </div>
    </section>

    <!-- THIN COLORED MARQUEE TICKER -->
    <div
      class="relative z-30 w-full overflow-hidden bg-signal text-white py-2 sm:py-2.5 border-y border-white/20 select-none shadow-[0_4px_24px_rgba(255,74,28,0.25)]"
      aria-label="Studio Highlights Marquee"
    >
      <div class="flex w-max animate-marquee gap-8 whitespace-nowrap font-mono text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.18em]">
        <div class="flex items-center gap-8">
          <span>✦ SELECTED DIGITAL WORKS</span>
          <span class="opacity-60">•</span>
          <span>PRODUCT DESIGN</span>
          <span class="opacity-60">•</span>
          <span>FRONTEND ENGINEERING</span>
          <span class="opacity-60">•</span>
          <span>INTERACTIVE EXPERIENCES</span>
          <span class="opacity-60">•</span>
          <span>NUXT 3 SSR</span>
          <span class="opacity-60">•</span>
          <span>GSAP MOTION</span>
          <span class="opacity-60">•</span>
          <span>CLEAN ARCHITECTURE</span>
          <span class="opacity-60">•</span>
          <span>JAKARTA, ID</span>
          <span class="opacity-60">•</span>
        </div>
        <!-- Duplicate loop for seamless continuous scrolling -->
        <div aria-hidden="true" class="flex items-center gap-8">
          <span>✦ SELECTED DIGITAL WORKS</span>
          <span class="opacity-60">•</span>
          <span>PRODUCT DESIGN</span>
          <span class="opacity-60">•</span>
          <span>FRONTEND ENGINEERING</span>
          <span class="opacity-60">•</span>
          <span>INTERACTIVE EXPERIENCES</span>
          <span class="opacity-60">•</span>
          <span>NUXT 3 SSR</span>
          <span class="opacity-60">•</span>
          <span>GSAP MOTION</span>
          <span class="opacity-60">•</span>
          <span>CLEAN ARCHITECTURE</span>
          <span class="opacity-60">•</span>
          <span>JAKARTA, ID</span>
          <span class="opacity-60">•</span>
        </div>
      </div>
    </div>

    <!-- WORK SECTION -->
    <section
      id="work"
      class="relative z-20 bg-paper text-ink shadow-[0_25px_80px_rgba(0,0,0,0.5)] pt-12 sm:pt-20 pb-16 sm:pb-28 border-b border-ink/10"
    >
      <div class="page-shell-wide">
        <!-- Minimalist Filter Header (Bracket Title + Search Bar + Category Tabs) -->
        <ProjectFilter
          v-model:category="category"
          v-model:search-query="searchQuery"
        />

        <!-- Loading State Skeleton -->
        <div v-if="status === 'pending' && !allProjects.length" class="grid gap-4 sm:gap-6 py-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="item in 8" :key="item" class="animate-pulse space-y-3">
            <div class="aspect-[16/10] bg-ink/10 rounded-2xl" />
            <div class="h-4 w-2/3 bg-ink/10 rounded-full" />
            <div class="h-3 w-1/3 bg-ink/10 rounded-full" />
          </div>
        </div>

        <!-- 4-Column Multi-Row Card Grid (Curated Cards) -->
        <div
          v-else-if="filteredProjects.length"
          ref="cardsContainerRef"
          class="grid gap-5 sm:gap-6 md:gap-7 py-3 sm:py-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <ProjectCard
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            :project="project"
            :index="index"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="my-8 sm:my-12 border border-ink/15 p-8 sm:p-12 text-center rounded-3xl bg-white/60">
          <p class="font-display text-lg sm:text-xl font-semibold text-ink">
            {{ allProjects.length === 0 ? 'Belum ada project yang dipublikasikan.' : 'Belum ada project yang cocok.' }}
          </p>
          <p class="mt-1 sm:mt-2 font-mono text-xs text-mute uppercase">
            {{ allProjects.length === 0 ? 'Project baru akan muncul di sini segera setelah dirilis.' : 'Coba kata kunci pencarian atau kategori lain.' }}
          </p>
          <button
            v-if="allProjects.length > 0"
            type="button"
            class="button-secondary mt-5 sm:mt-6 text-xs"
            @click="category = 'all'; searchQuery = ''"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
