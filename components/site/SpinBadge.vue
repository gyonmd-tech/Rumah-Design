<script setup lang="ts">
withDefaults(defineProps<{ text?: string }>(), {
  text: 'Scroll untuk melihat • Karya terpilih • ',
})
const id = useId()
</script>

<template>
  <span class="badge" aria-hidden="true">
    <svg viewBox="0 0 120 120">
      <defs>
        <path :id="`badge-${id}`" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" />
      <text>
        <textPath :href="`#badge-${id}`" textLength="276">{{ text }}</textPath>
      </text>
      <path class="badge__star" d="M60 44 L64 56 L76 60 L64 64 L60 76 L56 64 L44 60 L56 56 Z" />
    </svg>
  </span>
</template>

<style scoped>
.badge {
  display: block;
  width: calc(7 * var(--u));
  height: calc(7 * var(--u));
}

svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

circle {
  fill: var(--c-cyan);
}

text {
  fill: var(--c-ink);
  font-family: var(--font-grotesk);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.badge__star {
  fill: var(--c-ink);
}
</style>
