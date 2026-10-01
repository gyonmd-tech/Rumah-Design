<script setup lang="ts">
/**
 * Small white pill CTA with a dot. Hover: the pill grows by a fixed number of
 * pixels, the label rolls out while its copy rolls in, and three colored dots
 * orbit into place one after another.
 */
withDefaults(defineProps<{ label?: string, to?: string }>(), { label: 'Hubungi', to: '/contact' })

const el = ref<HTMLElement | null>(null)
let observer: ResizeObserver | null = null

// Grow by an absolute amount (≈12×6px at 1440px) regardless of the label width.
function updateScale() {
  const node = (el.value as unknown as { $el?: HTMLElement })?.$el ?? el.value
  if (!node?.offsetWidth) return
  const unit = Math.min(1.4, Math.max(0.8, window.innerWidth / 1440))
  node.style.setProperty('--grow-x', String((node.offsetWidth + 12 * unit) / node.offsetWidth))
  node.style.setProperty('--grow-y', String((node.offsetHeight + 6 * unit) / node.offsetHeight))
}

onMounted(() => {
  updateScale()
  document.fonts?.ready.then(updateScale).catch(() => {})
  const node = (el.value as unknown as { $el?: HTMLElement })?.$el ?? el.value
  if (node && 'ResizeObserver' in window) {
    observer = new ResizeObserver(updateScale)
    observer.observe(node)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <NuxtLink ref="el" :to="to" class="btn-dots">
    <span class="btn-dots__bg" />
    <span class="btn-dots__inner">
      <span class="btn-dots__dot-wrap" aria-hidden="true">
        <span class="btn-dots__dot" />
        <span v-for="(variant, index) in ['first', 'second', 'third']" :key="variant" :class="['btn-dots__dot', `is-${variant}`]" :style="{ '--index': index }" />
      </span>
      <span class="btn-dots__text-wrap">
        <span class="btn-dots__text is-default">{{ label }}</span>
        <span class="btn-dots__text is-hover" aria-hidden="true">{{ label }}</span>
      </span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.btn-dots {
  --ease: cubic-bezier(0.32, 0.72, 0, 1);
  --dot: calc(0.375 * var(--u));
  position: relative;
  display: inline-grid;
  color: var(--c-ink);
  font-family: var(--font-grotesk);
  font-size: calc(0.75 * var(--u));
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: scale 0.45s var(--ease);
  will-change: transform;
}

.btn-dots::after {
  content: '';
  position: absolute;
  inset: -0.125em;
  pointer-events: none;
  transition: box-shadow 0.3s var(--ease);
}

.btn-dots:focus-visible {
  outline: none;
}

.btn-dots:focus-visible::after {
  box-shadow: 0 0 0 0.125em var(--c-ink);
}

.btn-dots__bg {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  background: var(--c-white);
}

.btn-dots__inner {
  grid-area: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(0.28 * var(--u));
  padding: calc(0.5625 * var(--u)) calc(0.75 * var(--u)) calc(0.5625 * var(--u)) calc(0.5625 * var(--u));
  overflow: clip;
}

.btn-dots__dot-wrap,
.btn-dots__text-wrap {
  display: grid;
}

.btn-dots__dot {
  grid-area: 1 / 1;
  width: var(--dot);
  height: var(--dot);
  border-radius: 50%;
  background: var(--c-signal);
  transform-origin: calc((100% + 0.25em) * -1) 50%;
  transition: rotate 0.45s var(--ease), scale 0.45s var(--ease);
  transition-delay: calc(var(--index, 0) * 0.032s);
}

.btn-dots__dot.is-first { z-index: 3; background: var(--c-pink); }
.btn-dots__dot.is-second { z-index: 2; background: var(--c-cyan); }
.btn-dots__dot.is-third { z-index: 1; background: var(--c-pink); }

.btn-dots__dot.is-first,
.btn-dots__dot.is-second,
.btn-dots__dot.is-third {
  rotate: 120deg;
  scale: 0;
}

.btn-dots__text {
  grid-area: 1 / 1;
  transform-origin: left center;
  transition: translate 0.45s var(--ease), rotate 0.45s var(--ease);
}

.btn-dots__text.is-hover {
  rotate: 75deg;
  translate: -0.75em 2em 0;
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .btn-dots:is(:hover, :focus-visible) {
    scale: var(--grow-x, 1.08) var(--grow-y, 1.15);
    transition: scale 0.45s 0.05s var(--ease);
  }

  .btn-dots:is(:hover, :focus-visible) .btn-dots__text {
    transition-delay: 0.05s;
  }

  .btn-dots:is(:hover, :focus-visible) .btn-dots__text.is-default {
    rotate: -75deg;
    translate: -0.75em -2em 0;
  }

  .btn-dots:is(:hover, :focus-visible) .btn-dots__text.is-hover {
    rotate: 0deg;
    translate: 0 0 0;
  }

  .btn-dots:is(:hover, :focus-visible) .btn-dots__dot {
    rotate: -120deg;
    scale: 0;
    transition-delay: calc(var(--index, 0) * 0.032s + 0.05s);
  }

  .btn-dots:is(:hover, :focus-visible) .btn-dots__dot:is(.is-first, .is-second, .is-third) {
    rotate: 0deg;
    scale: 1;
  }
}
</style>
