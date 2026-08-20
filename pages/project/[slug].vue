<script setup lang="ts">
import type { Project } from '~/types/database.types'
import { categoryLabel, excerpt } from '~/utils/project'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: project, error } = await useAsyncData(`project-${slug.value}`, async () => {
  return await $fetch<Project & { description_html: string }>(`/api/projects/${encodeURIComponent(slug.value)}`)
})

// Fetch other projects for next project navigation
const { data: allProjects } = await useAsyncData('all-projects-nav', async () => {
  return await $fetch<Project[]>('/api/projects')
})

const nextProject = computed(() => {
  if (!allProjects.value || !project.value) return null
  const currentIndex = allProjects.value.findIndex(p => p.id === project.value?.id)
  if (currentIndex === -1) return null
  const nextIndex = (currentIndex + 1) % allProjects.value.length
  return allProjects.value[nextIndex]
})

const { setupHorizontalGallery, isReducedMotion } = useMotion()
const gallerySectionRef = ref<HTMLElement | null>(null)
const galleryTrackRef = ref<HTMLElement | null>(null)
const galleryCurrentIndex = ref(1)

// Project showcase gallery items
const galleryItems = computed(() => {
  if (!project.value) return []
  const items = [
    { title: 'Tampilan Utama', url: project.value.thumbnail_url },
  ]
  if (project.value.preview_media_url && project.value.preview_media_url !== project.value.thumbnail_url) {
    items.push({ title: 'Detail Interaksi', url: project.value.preview_media_url })
  }
  return items
})

const onGalleryScroll = () => {
  if (!galleryTrackRef.value) return
  const track = galleryTrackRef.value
  const itemWidth = (track.firstElementChild as HTMLElement)?.clientWidth || track.clientWidth
  if (itemWidth > 0) {
    const current = Math.min(galleryItems.value.length, Math.max(1, Math.round(track.scrollLeft / itemWidth) + 1))
    galleryCurrentIndex.value = current
  }
}

onMounted(() => {
  document.documentElement.classList.add('light-mode')

  nextTick(() => {
    if (gallerySectionRef.value && galleryTrackRef.value && galleryItems.value.length > 1 && !isReducedMotion()) {
      setupHorizontalGallery({
        sectionEl: gallerySectionRef.value,
        trackEl: galleryTrackRef.value,
        onIndexUpdate: (curr: number) => {
          galleryCurrentIndex.value = curr
        },
      })
    }
  })
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light-mode')
  }
})

useSeoMeta({
  title: () => {
    if (!project.value) return 'Project — Rumah Design'
    return project.value.seo_title || `${project.value.title} — Rumah Design`
  },
  description: () => {
    if (!project.value) return 'Project frontend pilihan dari Rumah Design.'
    return project.value.seo_description || excerpt(project.value.description ?? null)
  },
  ogTitle: () => project.value?.seo_title || project.value?.title,
  ogDescription: () => project.value?.seo_description || excerpt(project.value?.description ?? null),
  ogImage: () => project.value?.thumbnail_url,
  ogType: 'article',
  twitterCard: 'summary_large_image',
})

const siteConfig = useSiteConfig()

useHead(() => ({
  link: project.value ? [{ rel: 'canonical', href: `${siteConfig.url}/project/${project.value.slug}` }] : [],
  script: project.value ? [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.value.seo_title || project.value.title,
      description: project.value.seo_description || excerpt(project.value.description),
      image: project.value.thumbnail_url,
      url: `${siteConfig.url}/project/${project.value.slug}`,
    }),
  }] : [],
}))
</script>

<template>
  <div v-if="project" class="min-h-screen bg-paper text-ink pt-24 sm:pt-32 pb-20 sm:pb-28 relative z-20">
    <article class="page-shell space-y-8 sm:space-y-12">
      <!-- 1. Top Navigation Bar -->
      <nav aria-label="Navigasi" class="flex items-center justify-between gap-4 border-b border-ink/10 pb-4 sm:pb-5">
        <NuxtLink
          to="/#work"
          class="inline-flex items-center gap-2 font-mono text-[0.72rem] sm:text-xs font-semibold text-mute uppercase tracking-[0.14em] hover:text-signal transition-colors group"
        >
          <span class="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          <span>Kembali ke Karya</span>
        </NuxtLink>

        <span class="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/70 px-3.5 py-1 font-mono text-[0.7rem] sm:text-xs font-medium text-ink/80">
          <span class="size-1.5 rounded-full bg-signal" />
          {{ categoryLabel(project.category) }}
        </span>
      </nav>

      <!-- 2. Project Title & Primary Action Header -->
      <header class="space-y-6 sm:space-y-8 max-w-4xl">
        <h1 class="font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold tracking-tight text-ink leading-[1.04]">
          {{ project.title }}
        </h1>

        <!-- Oval Border-Only Action Buttons -->
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <RadialRevealButton
            :href="project.live_url"
            new-tab
            variant="primary"
            label="Buka Live Demo"
            add-icon
            :icon="{ symbol: '↗', size: 13, side: 'right' }"
            padding="0.75rem 1.8rem"
            custom-class="text-xs tracking-wider shadow-xs"
          />
          <RadialRevealButton
            v-if="project.repo_url"
            :href="project.repo_url"
            new-tab
            variant="dark"
            label="Lihat Repository"
            add-icon
            :icon="{ symbol: '↗', size: 13, side: 'right' }"
            padding="0.75rem 1.8rem"
            custom-class="text-xs tracking-wider"
          />
        </div>
      </header>

      <!-- 3. Clean Browser Mockup Frame Showcase -->
      <section aria-label="Tampilan Utama Aplikasi">
        <div class="overflow-hidden rounded-2xl sm:rounded-3xl bg-[#141210] border border-ink/15 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <!-- Top Window Simulation Bar -->
          <div class="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-[#1c1a17] text-white/60 font-mono text-[0.65rem] sm:text-xs">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <span class="size-2.5 rounded-full bg-[#ff5f56]/80" />
              <span class="size-2.5 rounded-full bg-[#ffbd2e]/80" />
              <span class="size-2.5 rounded-full bg-[#27c93f]/80" />
            </div>
            <div class="hidden sm:flex items-center gap-2 rounded-full bg-black/40 px-4 py-1 border border-white/5 text-[0.7rem] text-white/70">
              <span class="text-signal">https://</span>
              <span>rumahdesign.dev/preview/{{ project.slug }}</span>
            </div>
            <a
              :href="project.live_url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-signal transition-colors inline-flex items-center gap-1 uppercase tracking-wider text-[0.68rem]"
            >
              <span>Live Preview</span>
              <span>↗</span>
            </a>
          </div>

          <!-- Main Image Canvas (Flush fit without letterboxing bars) -->
          <div class="relative w-full overflow-hidden bg-[#141210]">
            <img
              :src="project.thumbnail_url"
              :alt="`Tampilan utama ${project.title}`"
              class="w-full h-auto block object-cover"
              width="1600"
              height="1000"
              fetchpriority="high"
            >
          </div>
        </div>
      </section>

      <!-- 4. Horizontal Gallery Showcase (if multiple media) -->
      <section
        v-if="galleryItems.length > 1"
        ref="gallerySectionRef"
        aria-label="Galeri Visual Tambahan"
        class="overflow-hidden rounded-2xl sm:rounded-3xl bg-ink p-5 sm:p-10 text-paper shadow-xl"
      >
        <div class="flex items-center justify-between border-b border-paper/15 pb-4">
          <p class="font-mono text-xs text-paper/70 uppercase tracking-widest">
            Visual Showcase
          </p>
          <p class="font-mono text-xs text-signal font-bold tracking-widest rounded-full bg-signal/15 px-3 py-1">
            {{ String(galleryCurrentIndex).padStart(2, '0') }} / {{ String(galleryItems.length).padStart(2, '0') }}
          </p>
        </div>
        <div
          ref="galleryTrackRef"
          class="mt-6 sm:mt-8 flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
          @scroll.passive="onGalleryScroll"
        >
          <div
            v-for="(item, i) in galleryItems"
            :key="i"
            class="relative w-[88vw] sm:w-[80vw] max-w-[1000px] shrink-0 snap-center overflow-hidden rounded-xl sm:rounded-2xl bg-[#141210] border border-white/10"
          >
            <img
              :src="item.url"
              :alt="item.title"
              class="w-full h-auto block object-cover"
              loading="lazy"
            >
            <span class="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 rounded-full bg-void/80 px-3 sm:px-4 py-1 sm:py-1.5 font-mono text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider text-paper backdrop-blur-md">
              {{ item.title }}
            </span>
          </div>
        </div>
      </section>

      <!-- 5. Structured Content Grid (Redesigned Editorial Stack & Kategori + Case Study) -->
      <section class="grid gap-10 sm:gap-14 border-t border-ink/10 pt-10 sm:pt-14 lg:grid-cols-[1fr_2.4fr] lg:items-start">
        <!-- Clean Editorial Metadata Sidebar -->
        <aside class="space-y-6 lg:sticky lg:top-28">
          <div class="border-t border-ink/15 space-y-1">
            <!-- Row 1: Kategori -->
            <div class="flex items-center justify-between py-3.5 border-b border-ink/10 font-mono">
              <span class="text-[0.68rem] text-mute uppercase tracking-[0.14em]">Kategori</span>
              <span class="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <span class="size-1.5 rounded-full bg-signal" />
                {{ categoryLabel(project.category) }}
              </span>
            </div>

            <!-- Row 2: Tech Stack -->
            <div class="py-3.5 border-b border-ink/10 space-y-2.5">
              <span class="font-mono text-[0.68rem] text-mute uppercase tracking-[0.14em] block">Tech Stack</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tech in project.tech_stack"
                  :key="tech"
                  class="rounded-full border border-ink/18 bg-transparent px-2.5 py-0.5 font-mono text-[0.7rem] font-medium text-ink/90 hover:border-signal hover:text-signal transition-colors duration-200"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Row 3: Topik & Pendekatan -->
            <div v-if="project.style_tags?.length" class="py-3.5 border-b border-ink/10 space-y-1.5">
              <span class="font-mono text-[0.68rem] text-mute uppercase tracking-[0.14em] block">Pendekatan</span>
              <p class="font-mono text-xs text-ink/80 leading-relaxed">
                {{ project.style_tags.join(' · ') }}
              </p>
            </div>

            <!-- Direct Action CTA Button -->
            <div class="pt-4">
              <RadialRevealButton
                :href="project.live_url"
                new-tab
                variant="primary"
                label="Buka Live Demo"
                add-icon
                :icon="{ symbol: '↗', size: 13, side: 'right' }"
                padding="0.75rem 1.6rem"
                custom-class="w-full text-xs"
              />
            </div>
          </div>
        </aside>

        <!-- Case Study Article -->
        <main aria-labelledby="case-study-title" class="max-w-3xl min-w-0">
          <CaseStudyBlock :html="project.description_html" />
        </main>
      </section>

      <!-- 6. Next Project Navigation Footer -->
      <footer class="pt-8 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <RadialRevealButton
          to="/#work"
          variant="dark"
          label="Semua Karya"
          add-icon
          :icon="{ symbol: '←', size: 14, side: 'left' }"
          padding="0.75rem 1.6rem"
          custom-class="text-xs"
        />

        <NuxtLink
          v-if="nextProject"
          :to="`/project/${nextProject.slug}`"
          class="group inline-flex items-center gap-3 font-mono text-right rounded-full border border-ink/15 bg-white/60 hover:border-signal px-5 py-2.5 transition-all duration-200"
        >
          <div class="text-right">
            <p class="text-[0.65rem] text-mute uppercase tracking-widest">Berikutnya</p>
            <p class="font-display text-sm sm:text-base font-bold text-ink group-hover:text-signal transition-colors">
              {{ nextProject.title }}
            </p>
          </div>
          <span class="text-sm font-bold text-signal transition-transform duration-200 group-hover:translate-x-1">→</span>
        </NuxtLink>
      </footer>
    </article>
  </div>

  <!-- Fallback Not Found -->
  <div v-else-if="error" class="page-shell py-36 text-center">
    <div class="max-w-md mx-auto rounded-3xl bg-white/80 p-10 border border-ink/10 shadow-md space-y-4">
      <p class="font-display text-3xl font-bold text-ink">Project tidak ditemukan</p>
      <p class="font-mono text-xs text-mute">Karya yang Anda cari tidak tersedia atau belum dipublikasikan.</p>
      <NuxtLink to="/" class="button-primary inline-flex mt-4">Kembali ke Beranda</NuxtLink>
    </div>
  </div>
</template>
