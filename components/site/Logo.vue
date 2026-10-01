<script setup lang="ts">
import { WORDMARK } from '~/utils/brand-mark'

/**
 * Wordmark only (no icon): HYGIONE in currentColor, Darriyan in the accent,
 * closed by a cyan pixel. Decorative by default — the wrapping link names it.
 */
withDefaults(defineProps<{ label?: string }>(), { label: undefined })
</script>

<template>
  <svg
    class="logo"
    :viewBox="WORDMARK.viewBox"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
  >
    <path class="logo__grotesk" :d="WORDMARK.grotesk" />
    <path class="logo__serif" :d="WORDMARK.serif" />
    <rect class="logo__pixel" :x="WORDMARK.pixel.x" :y="WORDMARK.pixel.y" :width="WORDMARK.pixel.w" :height="WORDMARK.pixel.w" />
  </svg>
</template>

<style scoped>
.logo {
  display: block;
  width: auto;
  height: calc(1.3 * var(--u));
  overflow: visible;
}

.logo__grotesk {
  fill: currentColor;
  transition: fill 0.3s ease;
}

.logo__serif {
  fill: var(--logo-accent, var(--c-signal));
  transition: fill 0.3s ease;
}

.logo__pixel {
  fill: var(--c-cyan);
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.5s var(--ease-bounce);
}

a:hover .logo__pixel,
a:focus-visible .logo__pixel {
  transform: rotate(45deg) scale(1.25);
}
</style>
