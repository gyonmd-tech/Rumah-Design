<script setup lang="ts">
const { animateHeroReveal, setupCardsBatch } = useMotion()

const headlineLine1 = ref<HTMLElement | null>(null)
const headlineLine2 = ref<HTMLElement | null>(null)
const eyebrowRef = ref<HTMLElement | null>(null)
const introRef = ref<HTMLElement | null>(null)
const processContainerRef = ref<HTMLElement | null>(null)

let aboutCtx: ReturnType<typeof setupCardsBatch> | null = null

onMounted(() => {
  document.documentElement.classList.add('light-mode')

  const lines = [headlineLine1.value, headlineLine2.value].filter(Boolean) as HTMLElement[]
  animateHeroReveal({
    headlineLines: lines,
    eyebrow: eyebrowRef.value,
    intro: introRef.value,
  })

  nextTick(() => {
    if (processContainerRef.value) {
      aboutCtx = setupCardsBatch(processContainerRef.value, '.process-step-card')
    }
  })
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light-mode')
  }
  if (aboutCtx) {
    aboutCtx.revert()
    aboutCtx = null
  }
})

useSeoMeta({
  title: 'Tentang — Rumah Design',
  description: 'Tentang pendekatan product design dan frontend engineering di balik Rumah Design.',
  ogTitle: 'Tentang — Rumah Design',
  ogDescription: 'Kisah proses, filosofi kerja, dan stack teknologi dari seorang product designer yang membangun produknya sendiri.',
  ogType: 'profile',
})
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pt-28 sm:pt-32 pb-20 sm:pb-28 relative z-20 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
    <div class="page-shell space-y-12 sm:space-y-16">
      <!-- About Hero -->
      <section class="border-b border-ink/12 pb-10 sm:pb-16">
        <div ref="eyebrowRef" class="inline-flex items-center gap-2 rounded-full bg-ink/5 border border-ink/10 px-3.5 py-1.5">
          <span class="size-1.5 rounded-full bg-signal" />
          <span class="font-mono text-[0.7rem] sm:text-xs font-semibold text-mute uppercase tracking-[0.14em]">
            Tentang Rumah Design
          </span>
        </div>

        <h1 class="mt-4 sm:mt-6 font-display text-display-l text-ink max-w-[16ch] tracking-tight">
          <span class="block overflow-hidden">
            <span ref="headlineLine1" class="inline-block will-change-transform">Desain yang tidak berhenti</span>
          </span>
          <span class="block overflow-hidden">
            <span ref="headlineLine2" class="inline-block text-signal will-change-transform">di layar presentasi.</span>
          </span>
        </h1>

        <div ref="introRef" class="mt-6 sm:mt-10 max-w-3xl space-y-4 sm:space-y-6 text-body-l text-ink/90">
          <p>
            Rumah Design adalah studio independen dan arsip karya digital seorang product designer yang juga mendalami rekayasa frontend. Saya percaya bahwa pengalaman digital terbaik lahir saat batasan antara perancangan konsep dan implementasi kode ditiadakan.
          </p>
          <p class="text-mute">
            Setiap karya di sini bukan sekadar mockup visual statis, melainkan produk digital interaktif yang dirancang dengan presisi hierarki, tipografi kuat, animasi terukur, dan performa web modern.
          </p>
        </div>
      </section>

      <!-- 4-Step Work Process Cards -->
      <section class="border-b border-ink/12 pb-10 sm:pb-16">
        <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>Proses Kerja</span>
        </div>
        <h2 class="mt-2 sm:mt-3 font-display text-display-m text-ink">
          Bagaimana ide diubah menjadi produk nyata
        </h2>

        <div ref="processContainerRef" class="mt-8 sm:mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div class="process-step-card will-change-transform space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl bg-white/70 p-5 sm:p-6 border border-ink/10 shadow-xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xl sm:text-2xl font-bold text-signal">01</span>
              <span class="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-signal uppercase">Tahap 1</span>
            </div>
            <h3 class="font-display text-base sm:text-lg font-bold text-ink">Problem Framing</h3>
            <p class="text-xs sm:text-sm text-mute leading-relaxed">
              Memahami masalah inti pengguna dan mendefinisikan batasan produk sebelum mulai menggambar antarmuka.
            </p>
          </div>

          <div class="process-step-card will-change-transform space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl bg-white/70 p-5 sm:p-6 border border-ink/10 shadow-xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xl sm:text-2xl font-bold text-signal">02</span>
              <span class="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-signal uppercase">Tahap 2</span>
            </div>
            <h3 class="font-display text-base sm:text-lg font-bold text-ink">Interactive Prototyping</h3>
            <p class="text-xs sm:text-sm text-mute leading-relaxed">
              Merancang sistem desain editorial, hierarki tipografi kontras tinggi, dan tata letak mikro-interaksi.
            </p>
          </div>

          <div class="process-step-card will-change-transform space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl bg-white/70 p-5 sm:p-6 border border-ink/10 shadow-xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xl sm:text-2xl font-bold text-signal">03</span>
              <span class="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-signal uppercase">Tahap 3</span>
            </div>
            <h3 class="font-display text-base sm:text-lg font-bold text-ink">Frontend Engineering</h3>
            <p class="text-xs sm:text-sm text-mute leading-relaxed">
              Membangun komponen modular dengan Nuxt 3, Vue, TypeScript, Tailwind, dan GSAP scroll orchestration.
            </p>
          </div>

          <div class="process-step-card will-change-transform space-y-3 sm:space-y-4 rounded-2xl sm:rounded-3xl bg-white/70 p-5 sm:p-6 border border-ink/10 shadow-xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xl sm:text-2xl font-bold text-signal">04</span>
              <span class="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-signal uppercase">Tahap 4</span>
            </div>
            <h3 class="font-display text-base sm:text-lg font-bold text-ink">Production Polish</h3>
            <p class="text-xs sm:text-sm text-mute leading-relaxed">
              Audit performa, skor aksesibilitas, reduced motion fallback, SEO metadata, dan deployment SSR.
            </p>
          </div>
        </div>
      </section>

      <!-- Tech Stack & Tools -->
      <section class="pt-2 sm:pt-4">
        <div class="grid gap-6 sm:gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
              <span class="size-1.5 rounded-full bg-signal" />
              <span>Toolkit</span>
            </div>
            <h2 class="mt-2 sm:mt-3 font-display text-xl sm:text-2xl font-bold text-ink">
              Teknologi yang biasa digunakan
            </h2>
          </div>

          <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div class="space-y-3 rounded-2xl sm:rounded-3xl bg-white/70 p-5 sm:p-6 border border-ink/10 shadow-xs">
              <h3 class="font-mono text-xs font-bold text-signal uppercase tracking-widest">Frontend & Framework</h3>
              <ul class="space-y-2 font-mono text-xs sm:text-sm text-ink/90">
                <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-signal" />Nuxt 3 / Vue 3 (Composition API)</li>
                <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-signal" />TypeScript & Modern JS</li>
                <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-signal" />Tailwind CSS & Design Tokens</li>
                <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-signal" />GSAP, ScrollTrigger & Lenis</li>
              </ul>
            </div>

            <div class="space-y-3 rounded-2xl sm:rounded-3xl bg-white/70 p-5 sm:p-6 border border-ink/10 shadow-xs">
              <h3 class="font-mono text-xs font-bold text-signal uppercase tracking-widest">Backend & Infra</h3>
              <ul class="space-y-2 font-mono text-xs sm:text-sm text-ink/90">
                <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-signal" />Supabase (PostgreSQL, Auth, Storage)</li>
                <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-signal" />Nitro Server Routes & API</li>
                <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-signal" />Vercel Edge & Serverless</li>
                <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-signal" />SEO & Structured Data (JSON-LD)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
