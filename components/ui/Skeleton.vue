<script setup lang="ts">
interface Props {
  className?: string
  rounded?: string
}

withDefaults(defineProps<Props>(), {
  className: '',
  rounded: 'rounded-xl',
})
</script>

<template>
  <div
    :class="[
      'animate-pulse relative overflow-hidden bg-ink/[0.08] dark:bg-white/[0.08]',
      rounded,
      className,
    ]"
  >
    <!-- Smooth linear shimmer effect overlay -->
    <div
      class="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
    />
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
