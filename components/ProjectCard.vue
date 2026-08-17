<script setup lang="ts">
import type { Project } from '~/types/database.types'
import { categoryLabel } from '~/utils/project'

defineProps<{
  project: Project
  index: number
}>()
</script>

<template>
  <article class="group min-w-0">
    <NuxtLink :to="`/project/${project.slug}`" class="block" :aria-label="`Lihat project ${project.title}`">
      <div class="relative aspect-[4/3] overflow-hidden bg-[#d8d5cc]">
        <img
          :src="project.preview_media_url || project.thumbnail_url"
          :alt="`Tampilan ${project.title}`"
          class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
          loading="lazy"
          width="1200"
          height="900"
        >
        <div class="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
        <span class="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-paper text-xs font-bold tabular-nums">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        <span class="absolute bottom-4 right-4 translate-y-2 bg-accent px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Buka project ↗
        </span>
      </div>
      <div class="flex items-start justify-between gap-5 border-t border-ink/20 py-4">
        <div>
          <h2 class="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">{{ project.title }}</h2>
          <p class="mt-1 text-sm text-muted">{{ project.style_tags.slice(0, 3).join(' · ') }}</p>
        </div>
        <p class="eyebrow mt-1 shrink-0 text-muted">{{ categoryLabel(project.category) }}</p>
      </div>
    </NuxtLink>
  </article>
</template>
