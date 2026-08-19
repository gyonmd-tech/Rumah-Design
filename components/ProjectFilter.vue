<script setup lang="ts">
import type { ProjectCategory } from '~/types/database.types'
import { PROJECT_CATEGORIES } from '~/utils/project'

const props = defineProps<{
  category: ProjectCategory | 'all'
  searchQuery: string
}>()

const emit = defineEmits<{
  'update:category': [value: ProjectCategory | 'all']
  'update:searchQuery': [value: string]
}>()
</script>

<template>
  <div class="my-10 space-y-6">
    <!-- Top Row: Bracket Title & Search Input -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <!-- Title in editorial bracket style (e.g. { Project Gallery }) -->
      <div class="flex items-center gap-2 font-mono text-lg sm:text-xl font-bold text-ink tracking-tight">
        <span class="text-signal">{</span>
        <span>Selected Work</span>
        <span class="text-signal">}</span>
      </div>

      <!-- Clean Minimalist Search Input (Reference style) -->
      <div class="relative w-full sm:w-80 md:w-96">
        <input
          :value="searchQuery"
          type="text"
          placeholder="Cari project, stack, atau topik..."
          class="w-full rounded-full border border-ink/20 bg-white/70 backdrop-blur-sm pl-6 pr-12 py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:bg-white focus:outline-none transition-all shadow-xs"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        >
        <!-- Search Magnifier Icon -->
        <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/40">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Category Pills Row (Clean single row matching reference image 2) -->
    <div class="flex flex-wrap items-center gap-2 sm:gap-2.5" role="tablist" aria-label="Filter kategori karya">
      <button
        v-for="item in [{ value: 'all', label: 'All' }, ...PROJECT_CATEGORIES]"
        :key="item.value"
        type="button"
        role="tab"
        class="shrink-0 cursor-pointer rounded-full px-5 py-2 font-mono text-xs font-medium uppercase tracking-[0.06em] transition-all duration-200"
        :class="category === item.value
          ? 'bg-ink text-paper font-semibold shadow-xs'
          : 'border border-ink/20 bg-transparent text-ink/75 hover:border-ink hover:text-ink'"
        :aria-selected="category === item.value"
        @click="emit('update:category', item.value as ProjectCategory | 'all')"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
