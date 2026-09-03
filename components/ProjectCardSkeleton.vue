<script setup lang="ts">
import Skeleton from '~/components/ui/Skeleton.vue'
</script>

<template>
  <div class="flex flex-col space-y-3 sm:space-y-3.5">
    <!-- Thumbnail Frame 16:10 Skeleton with Tag Pill Placeholder -->
    <div class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#e8e4db] border border-ink/8 shadow-xs">
      <Skeleton class-name="w-full h-full rounded-2xl" />
      
      <!-- Pill Badge Skeleton -->
      <div class="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3">
        <div class="h-6 w-24 rounded-lg bg-black/20 backdrop-blur-md animate-pulse" />
      </div>
    </div>

    <!-- Title and Subtitle Skeleton -->
    <div class="space-y-1.5 pt-0.5">
      <div class="flex items-center justify-between gap-3">
        <Skeleton class-name="h-4 sm:h-5 w-3/4 rounded-md" />
        <Skeleton class-name="h-3 w-3 rounded-full shrink-0" />
      </div>
      <Skeleton class-name="h-3 sm:h-3.5 w-1/2 rounded-md opacity-70" />
    </div>
  </div>
</template>
