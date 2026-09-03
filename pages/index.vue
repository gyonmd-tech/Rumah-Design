<script setup lang="ts">
import type { ProjectCategory, ProjectSummary } from '~/types/database.types'

const { data: dbProjects, status, error, refresh } = await useAsyncData(
  'published-projects',
  () => $fetch<ProjectSummary[]>('/api/projects'),
)

const allProjects = computed<ProjectSummary[]>(() => dbProjects.value ?? [])

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

// Motion system hooks for cards
const { setupCardsBatch } = useMotion()

const cardsContainerRef = ref<HTMLElement | null>(null)

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
  // Batch Stagger for Cards
  nextTick(refreshCards)
})

onUnmounted(() => {
  if (cardsCtx) {
    cardsCtx.revert()
    cardsCtx = null
  }
})

// Watch filter changes to refresh card triggers (with cleanup)
watch([category, searchQuery], () => {
  nextTick(refreshCards)
})

const faqData = {
  mainTitle: 'Tanya Jawab',
  mainSubtitle: 'Informasi ringkas mengenai alur kerja, teknologi, dan cara berkolaborasi.',
  rows: [
    {
      id: 'row1',
      speed: '48s',
      direction: 'left' as const,
      faqItems: [
        {
          id: 'q1',
          question: 'Bagaimana alur proses kerja?',
          answer: 'Eksplorasi konsep di Figma, perancangan prototipe interaktif, lalu implementasi kode frontend yang responsif, cepat, dan teruji.'
        },
        {
          id: 'q2',
          question: 'Teknologi apa yang digunakan?',
          answer: 'Fokus utama pada Nuxt 3, Vue 3, React, TypeScript, Tailwind CSS, GSAP Motion, serta Supabase untuk database.'
        },
        {
          id: 'q3',
          question: 'Apakah karya bisa dicoba langsung?',
          answer: 'Ya, seluruh karya memiliki tautan live demo eksternal yang aktif dan bisa langsung dieksplorasi.'
        },
        {
          id: 'q4',
          question: 'Apakah menyertakan dokumentasi kode?',
          answer: 'Setiap komponen dibangun secara modular dengan TypeScript, dokumentasi props, dan arsitektur kode yang bersih.'
        }
      ]
    },
    {
      id: 'row2',
      speed: '40s',
      direction: 'right' as const,
      faqItems: [
        {
          id: 'q5',
          question: 'Menerima proyek freelance & kolaborasi?',
          answer: 'Sangat terbuka! Melayani perancangan landing page interaktif, web application, dashboard, dan design system.'
        },
        {
          id: 'q6',
          question: 'Berapa lama estimasi pengerjaan?',
          answer: 'Landing page umumnya berkisar 1–2 minggu. Web app atau dashboard interaktif rata-rata membutuhkan 3–5 minggu.'
        },
        {
          id: 'q7',
          question: 'Bagaimana cara berdiskusi awal?',
          answer: 'Kirim pesan via halaman Kontak untuk menjadwalkan obrolan singkat seputar kebutuhan dan tujuan proyekmu.'
        },
        {
          id: 'q8',
          question: 'Apakah ada revisi dalam pengerjaan?',
          answer: 'Tentu, setiap tahapan mulai dari wireframe, visual design, hingga tahap implementasi frontend mencakup sesi iterasi.'
        }
      ]
    },
    {
      id: 'row3',
      speed: '52s',
      direction: 'left' as const,
      faqItems: [
        {
          id: 'q9',
          question: 'Apakah kode sumber bisa dipelajari?',
          answer: 'Sebagian besar project menyertakan link repositori GitHub publik untuk referensi arsitektur dan praktik terbaik.'
        },
        {
          id: 'q10',
          question: 'Bagaimana standar performa & aksesibilitas?',
          answer: 'Setiap project dioptimalkan dengan rendering SSR cepat, aset ringan, transisi ramah reduced-motion, dan SEO terstruktur.'
        },
        {
          id: 'q11',
          question: 'Apakah desain responsif di semua perangkat?',
          answer: 'Semua antarmuka dirancang mobile-first dan diuji menyeluruh di smartphone, tablet, laptop, hingga layar ultra-wide.'
        },
        {
          id: 'q12',
          question: 'Bagaimana dukungan pasca peluncuran?',
          answer: 'Dukungan teknis dan pemantauan performa disediakan untuk memastikan peluncuran berjalan mulus tanpa hambatan.'
        }
      ]
    }
  ]
}

const siteUrl = useRuntimeConfig().public.siteUrl as string || ''

useSeoMeta({
  title: 'Rumah Design — Digital Product & Frontend Craft',
  description: 'Kurasi karya product design & frontend engineering—dari eksplorasi visual tajam hingga aplikasi fungsional yang hidup di browser.',
  ogTitle: 'Rumah Design — Digital Product & Frontend Craft',
  ogDescription: 'Karya terpilih product design & frontend engineering dengan live demo dan proses desain mendalam.',
  ogType: 'website',
  ogImage: `${siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
  twitterImage: `${siteUrl}/og-image.png`,
  twitterTitle: 'Rumah Design — Digital Product & Frontend Craft',
  twitterDescription: 'Karya terpilih product design & frontend engineering dengan live demo dan proses desain mendalam.',
})
</script>

<template>
  <div class="relative min-h-screen bg-void">
    <!-- MAIN HERO (CLEAN INTERACTIVE FLOATING ICONS HERO) -->
    <FloatingIconsHero />

    <!-- THIN COLORED MARQUEE TICKER (GSAP Signature Electric Green) -->
    <div
      class="relative z-30 w-full overflow-hidden bg-signal text-ink py-2 sm:py-2.5 border-y border-black/15 select-none shadow-[0_4px_24px_rgba(10,228,72,0.25)] font-bold"
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
      class="relative z-20 bg-paper text-ink shadow-[0_25px_80px_rgba(0,0,0,0.5)] pt-12 sm:pt-20 pb-12 sm:pb-16"
    >
      <div class="page-shell-wide">
        <!-- Minimalist Filter Header (Bracket Title + Search Bar + Category Tabs) -->
        <ProjectFilter
          v-model:category="category"
          v-model:search-query="searchQuery"
        />

        <!-- Loading State Skeleton -->
        <div v-if="status === 'pending' && !allProjects.length" class="grid gap-5 sm:gap-6 md:gap-7 py-3 sm:py-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ProjectCardSkeleton v-for="item in 8" :key="item" />
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

        <!-- Service Error State -->
        <div v-else-if="error" class="my-8 sm:my-12 border border-signal/30 p-8 sm:p-12 text-center rounded-3xl bg-signal/5" role="alert">
          <p class="font-display text-lg sm:text-xl font-semibold text-ink">
            Katalog sedang sulit dimuat.
          </p>
          <p class="mt-1 sm:mt-2 font-mono text-xs text-mute uppercase">
            Silakan coba lagi. Karya yang sudah dipublikasikan tetap aman.
          </p>
          <button type="button" class="button-secondary mt-5 sm:mt-6 text-xs" @click="refresh()">
            Muat Ulang
          </button>
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

    <!-- FAQ SCROLLER SECTION (SEAMLESS LIGHT FLOW & WIDE EDGE-TO-EDGE) -->
    <section id="faq" class="relative z-20 bg-paper text-ink overflow-hidden pb-16 sm:pb-24">
      <HabitFaqScroller :data="faqData" theme="light" />
    </section>
  </div>
</template>
