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
  <div class="my-6 sm:my-10 space-y-4 sm:space-y-6">
    <!-- Top Row: Bracket Title & Search Input -->
    <div class="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
      <!-- Title in editorial bracket style -->
      <div class="flex items-center gap-2 font-mono text-base sm:text-lg md:text-xl font-bold text-ink tracking-tight">
        <span class="text-signal">{</span>
        <span>Selected Work</span>
        <span class="text-signal">}</span>
      </div>

      <!-- Clean Minimalist Search Input -->
      <div class="relative w-full sm:w-80 md:w-96">
        <input
          :value="searchQuery"
          type="text"
          placeholder="Cari project, stack, atau topik..."
          class="w-full rounded-full border border-ink/20 bg-white/80 backdrop-blur-sm pl-4 sm:pl-6 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:bg-white focus:outline-none transition-all shadow-xs"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        >
        <!-- Search Clear or Magnifier Icon -->
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/50 hover:text-signal text-xs font-mono font-bold cursor-pointer"
          title="Reset Pencarian"
          @click="emit('update:searchQuery', '')"
        >
          ✕
        </button>
        <div v-else class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Category Pills Row (Horizontal swipeable on mobile, flex-wrap on tablet/desktop) -->
    <div class="relative -mx-2 px-2 sm:mx-0 sm:px-0">
      <div
        class="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 sm:flex-wrap"
        role="tablist"
        aria-label="Filter kategori karya"
      >
        <button
          v-for="item in [{ value: 'all', label: 'All' }, ...PROJECT_CATEGORIES]"
          :key="item.value"
          type="button"
          role="tab"
          class="snap-start shrink-0 cursor-pointer rounded-full px-4 sm:px-5 py-1.5 sm:py-2 font-mono text-[0.7rem] sm:text-xs font-medium uppercase tracking-[0.06em] transition-all duration-200 active:scale-95"
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
  </div>
</template>
