<script setup lang="ts">
/**
 * Spawns project thumbnails along the pointer path inside the parent element.
 * Desktop + fine pointer only; decorative (aria-hidden, empty alt).
 */
const props = defineProps<{ images: string[] }>()

const layer = ref<HTMLElement | null>(null)
const { $motion } = useNuxtApp()

let host: HTMLElement | null = null
let cleanup: (() => void) | null = null

onMounted(() => {
  host = layer.value?.parentElement ?? null
  const fine = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)').matches
  if (!$motion || !host || !layer.value || !fine || $motion.reducedMotion) return

  const { gsap } = $motion
  const box = layer.value
  const live = new Set<gsap.core.Timeline>()
  let last: { x: number, y: number } | null = null
  let index = 0

  function spawn(x: number, y: number, dx: number, dy: number) {
    if (!props.images.length) return
    const img = document.createElement('img')
    img.src = props.images[index % props.images.length]
    img.alt = ''
    img.decoding = 'async'
    img.className = 'trail-img'
    box.appendChild(img)
    index++

    const tl = gsap.timeline({
      onComplete: () => {
        live.delete(tl)
        img.remove()
      },
    })
    live.add(tl)
    tl.fromTo(img, { xPercent: -50, yPercent: -50, scale: 1.3 }, { scale: 1, ease: 'elastic.out(1.6, 0.6)', duration: 0.6 })
      .fromTo(img, { x, y, rotation: gsap.utils.random(-10, 10) }, {
        x: x + dx * 3,
        y: y + dy * 3,
        rotation: gsap.utils.random(-12, 12),
        ease: 'power4.out',
        duration: 1.4,
      }, '<')
      .to(img, { scale: 0.4, autoAlpha: 0, duration: 0.3, ease: 'back.in(1.5)' }, 0.75)
  }

  const onMove = (event: PointerEvent) => {
    const rect = host!.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (!last) {
      last = { x, y }
      return
    }
    const dx = x - last.x
    const dy = y - last.y
    const threshold = Math.max(80, window.innerWidth * 0.07)
    if (Math.hypot(dx, dy) < threshold) return
    spawn(x, y, dx * 0.4, dy * 0.4)
    last = { x, y }
  }
  const onLeave = () => {
    last = null
  }

  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerleave', onLeave)
  cleanup = () => {
    host?.removeEventListener('pointermove', onMove)
    host?.removeEventListener('pointerleave', onLeave)
    live.forEach(tl => tl.kill())
    box.replaceChildren()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="layer" class="trail" aria-hidden="true" />
</template>

<style scoped>
.trail {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.trail :deep(.trail-img) {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(14 * var(--u));
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: calc(0.5 * var(--u)) solid var(--c-paper);
  box-shadow: 0 calc(0.75 * var(--u)) calc(2 * var(--u)) rgba(0, 0, 0, 0.35);
}
</style>
