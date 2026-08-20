<script setup lang="ts">
import type { Project } from '~/types/database.types'
import { categoryLabel } from '~/utils/project'

defineProps<{
  project: Project
  index: number
}>()
</script>

<template>
  <article class="project-card-item group relative flex flex-col will-change-transform">
    <NuxtLink
      :to="`/project/${project.slug}`"
      class="block focus-visible:ring-2 focus-visible:ring-signal rounded-2xl transition-transform duration-200 active:scale-[0.98]"
      :aria-label="`Lihat project ${project.title}`"
    >
      <!-- Media Frame with 16:10 aspect ratio and rounded-2xl -->
      <div class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#e2dfd7] border border-ink/10 shadow-xs transition-all duration-500 group-hover:shadow-2xl group-hover:border-ink/25">
        <!-- Project Thumbnail with Editorial Visual Filter -->
        <img
          :src="project.preview_media_url || project.thumbnail_url"
          :alt="`Tampilan ${project.title}`"
          class="h-full w-full object-cover object-top filter contrast-[104%] brightness-[96%] saturate-[94%] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:filter-none group-hover:saturate-[108%] group-hover:scale-106"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
          width="1200"
          height="750"
        >

        <!-- Subtle Editorial Color Filter Overlay -->
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-signal/5 mix-blend-multiply opacity-50 transition-opacity duration-500 group-hover:opacity-0" />

        <!-- Bottom Gradient for tag contrast -->
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-85" />

        <!-- Bottom Left Pill Tag -->
        <div class="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1.5 rounded-lg bg-black/75 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 text-white font-mono text-[0.65rem] sm:text-[0.68rem] font-medium border border-white/10 shadow-xs">
          <span class="size-1.5 rounded-full bg-signal" />
          <span>{{ categoryLabel(project.category) }}</span>
          <span v-if="project.tech_stack?.length" class="text-white/60 text-[0.62rem] sm:text-[0.65rem] font-normal">
            +{{ project.tech_stack.length }}
          </span>
        </div>
      </div>

      <!-- Card Typography & Meta -->
      <div class="mt-2.5 sm:mt-3.5 space-y-0.5 sm:space-y-1">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-sm sm:text-base font-display font-semibold text-ink transition-colors duration-200 group-hover:text-signal tracking-tight truncate">
            {{ project.title }}
          </h3>
          <span class="font-mono text-xs text-mute/60 group-hover:text-signal transition-colors shrink-0">
            ↗
          </span>
        </div>

        <p class="font-mono text-[0.72rem] sm:text-xs text-mute truncate">
          {{ project.tech_stack?.join(', ') || project.style_tags?.slice(0, 3).join(' · ') || 'Frontend Design' }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>
