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

      <!-- Clean Minimalist Search Input (Underline & Icon Only) -->
      <div class="relative w-full sm:w-72 md:w-80 group">
        <input
          :value="searchQuery"
          type="text"
          placeholder="Cari project, stack, atau topik..."
          class="w-full bg-transparent border-b border-ink/25 pb-2 pt-1 pl-1 pr-8 font-mono text-xs sm:text-sm text-ink placeholder:text-ink/40 focus:border-signal focus:outline-none transition-colors duration-300 rounded-none"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        >
        <!-- Search Clear or Magnifier Icon -->
        <button
          v-if="searchQuery"
          type="button"
          class="absolute right-1 top-1/2 -translate-y-1/2 text-ink/50 hover:text-signal text-xs font-mono font-bold cursor-pointer p-1"
          title="Reset Pencarian"
          @click="emit('update:searchQuery', '')"
        >
          ✕
        </button>
        <div v-else class="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-ink/40 group-focus-within:text-signal transition-colors">
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
