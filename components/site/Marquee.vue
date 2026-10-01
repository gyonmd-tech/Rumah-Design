<script setup lang="ts">
/**
 * Infinite text strip. Words alternate grotesk / serif; the strip reverses
 * direction with the scroll direction. Pure CSS loop, so it still runs (or
 * stops, with reduced motion) without the scroll hook.
 */
const props = withDefaults(defineProps<{ items: readonly string[], speed?: number }>(), { speed: 40 })

const track = ref<HTMLElement | null>(null)
let lastY = 0
let frame = 0

function onScroll() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    const y = window.scrollY
    if (track.value && Math.abs(y - lastY) > 4) {
      track.value.style.animationDirection = y > lastY ? 'normal' : 'reverse'
    }
    lastY = y
  })
}

onMounted(() => {
  lastY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <div class="marquee">
    <p class="sr-only">
      {{ props.items.join(', ') }}
    </p>
    <div ref="track" class="marquee__track" :style="{ '--speed': `${speed}s` }" aria-hidden="true">
      <span v-for="copy in 2" :key="copy" class="marquee__group">
        <span v-for="(item, index) in props.items" :key="item" :class="['marquee__item', { alt: index % 2 === 1 }]">
          {{ item }}<span class="marquee__dot" />
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  color: var(--c-signal);
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee-loop var(--speed) linear infinite;
}

.marquee__group {
  display: flex;
  flex: none;
}

.marquee__item {
  display: inline-flex;
  align-items: center;
  gap: calc(1.5 * var(--u));
  padding-right: calc(1.5 * var(--u));
  font-size: var(--fs-s);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
}

.marquee__item.alt {
  font-size: calc(var(--fs-s) * 1.1);
  line-height: 1;
}

.marquee__dot {
  width: calc(0.6 * var(--u));
  height: calc(0.6 * var(--u));
  background: var(--c-cyan);
  rotate: 45deg;
}

@keyframes marquee-loop {
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none;
  }
}
</style>
