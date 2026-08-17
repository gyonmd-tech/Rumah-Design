<script setup lang="ts">
import type { ProjectCategory } from '~/types/database.types'
import { PROJECT_CATEGORIES } from '~/utils/project'

defineProps<{
  category: ProjectCategory | 'all'
  style: string
  styles: string[]
}>()

const emit = defineEmits<{
  'update:category': [value: ProjectCategory | 'all']
  'update:style': [value: string]
}>()
</script>

<template>
  <div class="grid gap-5 border-y border-ink/20 py-5 lg:grid-cols-[8rem_1fr]">
    <p class="eyebrow pt-2 text-muted">Filter karya</p>
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2" aria-label="Filter kategori">
        <button
          v-for="item in [{ value: 'all', label: 'Semua' }, ...PROJECT_CATEGORIES]"
          :key="item.value"
          type="button"
          class="cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-colors"
          :class="category === item.value ? 'border-ink bg-ink text-white' : 'border-ink/25 hover:border-accent hover:text-accent'"
          :aria-pressed="category === item.value"
          @click="emit('update:category', item.value as ProjectCategory | 'all')"
        >
          {{ item.label }}
        </button>
      </div>
      <div v-if="styles.length" class="flex flex-wrap gap-2" aria-label="Filter gaya visual">
        <button
          v-for="item in ['Semua gaya', ...styles]"
          :key="item"
          type="button"
          class="cursor-pointer rounded-full border px-4 py-2 text-xs transition-colors"
          :class="style === item ? 'border-accent bg-accent text-white' : 'border-ink/20 hover:border-accent'"
          :aria-pressed="style === item"
          @click="emit('update:style', item)"
        >
          {{ item }}
        </button>
      </div>
    </div>
  </div>
</template>
