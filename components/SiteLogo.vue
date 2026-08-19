<script setup lang="ts">
defineProps<{
  dark?: boolean
  hideTextOnMobile?: boolean
}>()
</script>

<template>
  <div class="inline-flex items-center gap-1.5 sm:gap-2.5">
    <!-- Geometric Architectural Mark -->
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="size-6 sm:size-7 shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" :fill="dark ? '#121110' : 'currentColor'" fill-opacity="0.12" />
      <!-- Stylized structure line -->
      <path
        d="M6 26V6H17C20.866 6 24 9.13401 24 13C24 16.866 20.866 20 17 20H6"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15 20L25 26"
        stroke="var(--color-signal)"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <circle cx="16" cy="13" r="2.5" fill="var(--color-signal)" />
    </svg>
    <span
      class="font-mono text-xs sm:text-sm font-bold tracking-[0.08em] sm:tracking-[0.12em] uppercase truncate"
      :class="hideTextOnMobile ? 'hidden sm:inline' : ''"
    >
      Rumah Design
    </span>
  </div>
</template>
