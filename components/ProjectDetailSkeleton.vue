<script setup lang="ts">
import Skeleton from '~/components/ui/Skeleton.vue'
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pt-28 pb-20">
    <div class="page-shell-wide space-y-12 sm:space-y-16">
      <!-- 1. Back Navigation & Category Chip Skeleton -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
        <Skeleton class-name="h-4 w-32 rounded-md" />
        <Skeleton class-name="h-6 w-24 rounded-full" />
      </div>

      <!-- 2. Project Title & Action Buttons Skeleton -->
      <div class="space-y-6 max-w-4xl">
        <Skeleton class-name="h-12 sm:h-16 w-4/5 rounded-2xl" />
        <div class="flex items-center gap-3 pt-2">
          <Skeleton class-name="h-10 w-36 rounded-full" />
          <Skeleton class-name="h-10 w-36 rounded-full" />
        </div>
      </div>

      <!-- 3. Mockup Frame Skeleton -->
      <div class="overflow-hidden rounded-2xl sm:rounded-3xl border border-ink/15 shadow-xl bg-[#141210]">
        <div class="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#1c1a17]">
          <div class="flex items-center gap-2">
            <div class="size-2.5 rounded-full bg-white/20" />
            <div class="size-2.5 rounded-full bg-white/20" />
            <div class="size-2.5 rounded-full bg-white/20" />
          </div>
          <Skeleton class-name="h-4 w-48 rounded-full bg-white/10" />
          <div class="size-4 rounded-full bg-white/10" />
        </div>
        <div class="aspect-[16/10] w-full bg-[#1e1c19] flex items-center justify-center">
          <Skeleton class-name="w-full h-full rounded-none" />
        </div>
      </div>

      <!-- 4. Metadata Grid Skeleton (Tech Stack, Timeline, Role) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 sm:p-8 rounded-2xl border border-ink/10 bg-white/60">
        <div v-for="i in 4" :key="i" class="space-y-2">
          <Skeleton class-name="h-3 w-16 rounded-md" />
          <Skeleton class-name="h-5 w-24 rounded-md" />
        </div>
      </div>

      <!-- 5. Case Study Article Skeleton -->
      <div class="max-w-3xl space-y-4 pt-4">
        <Skeleton class-name="h-6 w-48 rounded-md mb-4" />
        <Skeleton class-name="h-4 w-full rounded-md" />
        <Skeleton class-name="h-4 w-5/6 rounded-md" />
        <Skeleton class-name="h-4 w-4/5 rounded-md" />
      </div>
    </div>
  </div>
</template>
