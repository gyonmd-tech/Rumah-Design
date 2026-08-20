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
  <div v-if="project" class="min-h-screen bg-paper text-ink pt-28 sm:pt-32 pb-20 sm:pb-28 relative z-20 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
    <!-- Project Hero Header -->
    <article class="page-shell">
      <div class="grid gap-6 sm:gap-8 border-b border-ink/12 pb-8 sm:pb-12 lg:grid-cols-[1fr_2.2fr] lg:items-end">
        <div class="space-y-3 sm:space-y-4">
          <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 border border-ink/10 px-3.5 py-1.5">
            <span class="size-1.5 rounded-full bg-signal" />
            <span class="font-mono text-[0.7rem] sm:text-xs font-semibold text-mute uppercase tracking-[0.14em]">
              {{ categoryLabel(project.category) }}
            </span>
          </div>
          <p class="font-mono text-xs text-mute uppercase tracking-wider">
            {{ project.style_tags.join(' · ') }}
          </p>
        </div>

        <div>
          <h1 class="font-display text-display-l text-ink tracking-tight font-bold">
            {{ project.title }}
          </h1>
          <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <RadialRevealButton
              :href="project.live_url"
              new-tab
              variant="primary"
              label="Buka Live Demo"
              add-icon
              :icon="{ symbol: '↗', size: 14, side: 'right' }"
            />
            <RadialRevealButton
              v-if="project.repo_url"
              :href="project.repo_url"
              new-tab
              variant="dark"
              label="Lihat Repository"
              add-icon
              :icon="{ symbol: '↗', size: 14, side: 'right' }"
            />
          </div>
        </div>
      </div>

      <!-- Main Showcase Frame with Rounded-3xl -->
      <div class="my-8 sm:my-12">
        <div class="relative aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#141210] shadow-md border border-ink/10 flex items-center justify-center p-2 sm:p-3">
          <img
            :src="project.thumbnail_url"
            :alt="`Tampilan utama ${project.title}`"
            class="h-full w-full object-contain object-center rounded-xl sm:rounded-2xl"
            width="1600"
            height="1000"
          >
        </div>
      </div>

      <!-- Horizontal Gallery -->
      <div
        v-if="galleryItems.length > 1"
        ref="gallerySectionRef"
        class="my-10 sm:my-16 overflow-hidden rounded-2xl sm:rounded-3xl bg-ink p-5 sm:p-10 text-paper shadow-xl"
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
            class="relative aspect-[16/10] w-[88vw] sm:w-[80vw] max-w-[1000px] shrink-0 snap-center overflow-hidden rounded-xl sm:rounded-2xl bg-[#141210] border border-white/10 flex items-center justify-center p-2 sm:p-3"
          >
            <img
              :src="item.url"
              :alt="item.title"
              class="h-full w-full object-contain object-center rounded-lg sm:rounded-xl"
              loading="lazy"
            >
            <span class="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 rounded-full bg-void/80 px-3 sm:px-4 py-1 sm:py-1.5 font-mono text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider text-paper backdrop-blur-md">
              {{ item.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tech Stack & Case Study Content -->
      <div class="grid gap-8 sm:gap-12 border-b border-ink/12 py-10 sm:py-16 lg:grid-cols-[1fr_2.2fr] lg:py-20">
        <!-- Sidebar Metadata -->
        <aside class="space-y-6 sm:space-y-8">
          <div class="rounded-2xl sm:rounded-3xl bg-white/70 p-5 sm:p-6 border border-ink/10 shadow-xs space-y-3">
            <p class="font-mono text-xs font-semibold text-mute uppercase tracking-[0.14em]">
              Teknologi
            </p>
            <ul class="flex flex-wrap gap-1.5 sm:gap-2" aria-label="Teknologi yang digunakan">
              <li
                v-for="tech in project.tech_stack"
                :key="tech"
                class="rounded-full bg-ink/5 border border-ink/10 px-3 py-1 font-mono text-[0.72rem] sm:text-xs font-semibold text-ink/90"
              >
                {{ tech }}
              </li>
            </ul>
          </div>

          <div class="rounded-2xl sm:rounded-3xl bg-white/70 p-5 sm:p-6 border border-ink/10 shadow-xs space-y-2">
            <p class="font-mono text-xs font-semibold text-mute uppercase tracking-[0.14em]">
              Kategori & Gaya
            </p>
            <p class="font-mono text-sm font-bold text-ink">
              {{ categoryLabel(project.category) }}
            </p>
          </div>
        </aside>

        <!-- Case Study Article -->
        <section aria-labelledby="case-study-heading" class="max-w-3xl min-w-0">
          <div class="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 font-mono text-[0.7rem] font-bold text-mute uppercase tracking-widest">
            <span class="size-1.5 rounded-full bg-signal" />
            <span>Case Study</span>
          </div>
          <div class="mt-4 sm:mt-6">
            <CaseStudyBlock :html="project.description_html" />
          </div>
        </section>
      </div>

      <!-- Next Project & Return Navigation Card -->
      <div class="my-8 sm:my-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center rounded-2xl sm:rounded-3xl bg-white/70 p-5 sm:p-8 border border-ink/10 shadow-xs">
        <RadialRevealButton
          to="/#work"
          variant="dark"
          label="Semua Project"
          add-icon
          :icon="{ symbol: '←', size: 14, side: 'left' }"
        />

        <NuxtLink
          v-if="nextProject"
          :to="`/project/${nextProject.slug}`"
          class="group flex items-center justify-between sm:justify-end gap-4 text-left sm:text-right"
        >
          <div>
            <p class="font-mono text-[0.68rem] sm:text-[0.7rem] text-mute uppercase tracking-widest">Project Selanjutnya</p>
            <p class="font-display text-base sm:text-xl font-bold text-ink group-hover:text-signal transition-colors">
              {{ nextProject.title }} →
            </p>
          </div>
        </NuxtLink>
      </div>
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
