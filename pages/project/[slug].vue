<script setup lang="ts">
import type { Project } from '~/types/database.types'
import { categoryLabel, excerpt } from '~/utils/project'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: project } = await useAsyncData(`project-${slug.value}`, async () => {
  return await $fetch<Project & { description_html: string }>(`/api/projects/${encodeURIComponent(slug.value)}`)
})

useSeoMeta({
  title: () => project.value ? `${project.value.title} — Rumah Design` : 'Project — Rumah Design',
  description: () => excerpt(project.value?.description ?? null),
  ogTitle: () => project.value?.title,
  ogDescription: () => excerpt(project.value?.description ?? null),
  ogImage: () => project.value?.thumbnail_url,
  ogType: 'article',
  twitterCard: 'summary_large_image',
})

useHead(() => ({
  link: project.value ? [{ rel: 'canonical', href: `/project/${project.value.slug}` }] : [],
  script: project.value ? [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.value.title,
      description: excerpt(project.value.description),
      image: project.value.thumbnail_url,
      url: project.value.live_url,
    }),
  }] : [],
}))
</script>

<template>
  <article v-if="project" class="page-shell pt-10 sm:pt-16">
    <div class="grid gap-8 pb-10 lg:grid-cols-[1fr_2fr] lg:items-end">
      <div>
        <p class="eyebrow text-muted">{{ categoryLabel(project.category) }}</p>
        <p class="mt-3 text-sm text-muted">{{ project.style_tags.join(' · ') }}</p>
      </div>
      <div>
        <h1 class="max-w-[14ch] text-balance text-[clamp(3.5rem,8vw,8.5rem)] font-medium leading-[0.86] tracking-[-0.07em]">{{ project.title }}</h1>
        <div class="mt-8 flex flex-wrap gap-3">
          <a :href="project.live_url" target="_blank" rel="noopener noreferrer" class="button-primary">Lihat live demo ↗</a>
          <a v-if="project.repo_url" :href="project.repo_url" target="_blank" rel="noopener noreferrer" class="button-secondary">Lihat repository ↗</a>
        </div>
      </div>
    </div>

    <figure class="overflow-hidden bg-[#d8d5cc]">
      <img :src="project.thumbnail_url" :alt="`Tampilan utama ${project.title}`" class="aspect-[16/10] h-auto w-full object-cover" width="1600" height="1000">
    </figure>

    <div class="grid gap-10 border-b border-ink/20 py-12 lg:grid-cols-[1fr_2fr] lg:py-20">
      <div>
        <p class="eyebrow text-muted">Dibangun dengan</p>
        <ul class="mt-5 flex flex-wrap gap-2" aria-label="Teknologi">
          <li v-for="tech in project.tech_stack" :key="tech" class="rounded-full border border-ink/25 px-3 py-2 text-xs font-semibold">{{ tech }}</li>
        </ul>
      </div>
      <section aria-labelledby="case-study-heading">
        <p id="case-study-heading" class="eyebrow text-muted">Case study</p>
        <CaseStudyBlock :html="project.description_html" class="mt-6 max-w-3xl" />
      </section>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-5 py-8">
      <NuxtLink to="/#work" class="button-secondary">← Semua project</NuxtLink>
      <a :href="project.live_url" target="_blank" rel="noopener noreferrer" class="eyebrow transition-colors hover:text-accent">Buka produk ↗</a>
    </div>
  </article>
</template>
