<script setup lang="ts">
import type { Project } from '~/types/database.types'
import { categoryLabel } from '~/utils/project'

defineProps<{
  project: Project
  index: number
}>()
</script>

<template>
  <article class="project-card-item group relative flex flex-col">
    <NuxtLink
      :to="`/project/${project.slug}`"
      class="block focus-visible:ring-2 focus-visible:ring-signal rounded-2xl"
      :aria-label="`Lihat project ${project.title}`"
    >
      <!-- Media Frame with 16:10 aspect ratio and rounded-2xl (Matching Reference) -->
      <div class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#e2dfd7] border border-ink/10 shadow-xs transition-all duration-500 group-hover:shadow-xl group-hover:border-ink/20">
        <img
          :src="project.preview_media_url || project.thumbnail_url"
          :alt="`Tampilan ${project.title}`"
          class="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          loading="lazy"
          width="1200"
          height="750"
        >

        <!-- Subtle Gradient for bottom tag contrast -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

        <!-- Bottom Left Pill Tag (Reference Style: e.g. Category / Tech) -->
        <div class="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/75 backdrop-blur-md px-2.5 py-1 text-white font-mono text-[0.68rem] font-medium border border-white/10 shadow-xs">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>{{ categoryLabel(project.category) }}</span>
          <span v-if="project.tech_stack?.length" class="text-white/60 text-[0.65rem] font-normal">
            +{{ project.tech_stack.length }}
          </span>
        </div>
      </div>

      <!-- Card Typography & Meta (Clean & Minimalist like Reference) -->
      <div class="mt-3.5 space-y-1">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-base font-display font-semibold text-ink transition-colors duration-200 group-hover:text-signal tracking-tight truncate">
            {{ project.title }}
          </h3>
          <span class="font-mono text-xs text-mute/60 group-hover:text-signal transition-colors shrink-0">
            ↗
          </span>
        </div>

        <p class="font-mono text-xs text-mute truncate">
          {{ project.tech_stack?.join(', ') || project.style_tags?.slice(0, 3).join(' · ') || 'Frontend Design' }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>
