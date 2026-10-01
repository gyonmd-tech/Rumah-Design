<script setup lang="ts">
/**
 * A media card that trails the pointer across the hero and flips to the next
 * project image every stretch of travel. Desktop + fine pointer only; it hides
 * over links, buttons and [data-cursor-block] areas so it never covers a CTA.
 */
const props = defineProps<{ images: string[] }>()

const card = ref<HTMLElement | null>(null)
const active = ref(0)
const visible = ref(false)
const { $motion } = useNuxtApp()
let cleanup: (() => void) | null = null

onMounted(() => {
  const host = card.value?.parentElement
  const fine = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)').matches
  if (!$motion || !card.value || !host || !fine || $motion.reducedMotion || props.images.length < 2) return

  const { gsap } = $motion
  const x = gsap.quickTo(card.value, 'x', { duration: 1, ease: 'power4' })
  const y = gsap.quickTo(card.value, 'y', { duration: 1, ease: 'power4' })
  const rotate = gsap.quickTo(card.value, 'rotation', { duration: 1, ease: 'power4' })
  let last: { x: number, y: number } | null = null
  let travel = 0

  const onMove = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect()
    const px = event.clientX - rect.left
    const py = event.clientY - rect.top
    const blocked = Boolean((event.target as Element | null)?.closest('a, button, [data-cursor-block]'))
    visible.value = !blocked
    x(px)
    y(py)
    if (last) {
      const dx = px - last.x
      travel += Math.hypot(dx, py - last.y)
      rotate(gsap.utils.clamp(-14, 14, dx * 0.6))
      if (travel > 240) {
        travel = 0
        active.value = (active.value + 1) % props.images.length
      }
    }
    last = { x: px, y: py }
  }
  const onLeave = () => {
    visible.value = false
    last = null
    rotate(0)
  }

  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerleave', onLeave)
  cleanup = () => {
    host.removeEventListener('pointermove', onMove)
    host.removeEventListener('pointerleave', onLeave)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="card" class="cursor-card" :data-visible="visible || undefined" aria-hidden="true">
    <div class="cursor-card__inner frame frame--amber">
      <img
        v-for="(src, index) in images"
        :key="src"
        :src="src"
        alt=""
        loading="lazy"
        decoding="async"
        :class="{ on: index === active }"
      >
    </div>
  </div>
</template>

<style scoped>
.cursor-card {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.cursor-card__inner {
  position: relative;
  width: calc(15 * var(--u));
  aspect-ratio: 4 / 3;
  padding: calc(0.45 * var(--u));
  translate: -50% -50%;
  scale: 0;
  transition: scale 0.5s var(--ease-site);
}

.cursor-card[data-visible] .cursor-card__inner {
  scale: 1;
}

.cursor-card img {
  position: absolute;
  inset: calc(0.45 * var(--u));
  width: calc(100% - 0.9 * var(--u));
  height: calc(100% - 0.9 * var(--u));
  object-fit: cover;
  object-position: top center;
  opacity: 0;
}

.cursor-card img.on {
  opacity: 1;
}
</style>
