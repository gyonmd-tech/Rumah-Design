<script setup lang="ts">
/**
 * Text CTA: serif label with a hand-drawn underline that is always present and
 * redrawn with a new stroke on every hover, plus a small arrow block whose
 * arrow drops out while a copy drops in.
 */
const props = withDefaults(defineProps<{
  label: string
  to: string
  direction?: 'right' | 'down'
}>(), {
  direction: 'right',
})

const rotation = computed(() => props.direction === 'down' ? 90 : 0)
</script>

<template>
  <NuxtLink :to="to" class="btn-link">
    <span class="btn-link__text">
      {{ label }}
      <SiteDrawLine mode="always" class="btn-link__line" />
    </span>
    <span class="btn-link__arrow" aria-hidden="true">
      <span v-for="n in 2" :key="n" class="btn-link__arrow-wrap">
        <svg viewBox="0 0 14 14" :style="{ rotate: `${rotation}deg` }">
          <path d="M7.4 1.2 13 7l-5.6 5.8H4.9l4.2-4.5H1V5.7h8.1L4.9 1.2z" fill="currentColor" />
        </svg>
      </span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.btn-link {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: flex-start;
  gap: 0.375em;
  font-family: var(--font-serif);
  font-size: calc(1.3 * var(--u));
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
}

.btn-link__text {
  position: relative;
  flex: none;
}

.btn-link .btn-link__line {
  top: 130%;
}

.btn-link__arrow {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex: none;
  width: 1em;
  height: 1em;
  overflow: hidden;
  background: var(--c-signal);
  color: var(--c-white);
}

.btn-link__arrow-wrap {
  display: flex;
  flex: none;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: transform 0.525s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-link__arrow-wrap svg {
  width: 0.5em;
  height: 0.5em;
}

@media (hover: hover) and (pointer: fine) {
  .btn-link:hover .btn-link__arrow-wrap {
    transform: translateY(100%);
  }
}

.btn-link:focus-visible .btn-link__arrow-wrap {
  transform: translateY(100%);
}

.theme-dark .btn-link__line {
  --draw-color: var(--c-cyan);
}
</style>
