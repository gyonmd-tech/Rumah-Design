<script setup lang="ts">
/**
 * Cursor marquee: over elements with data-cursor="…" a pill blooms out of a
 * dot at the pointer and the label scrolls through it like a ticker.
 * Fine pointers only; decorative (the hovered element carries its own label).
 */
const root = ref<HTMLElement | null>(null)
const text = ref('')
const duration = ref(4)
const status = ref<'active' | 'not-active'>('not-active')
const playing = ref(false)
const { $motion } = useNuxtApp()
let cleanup: (() => void) | null = null

onMounted(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!$motion || !root.value || !fine) return
  const { gsap } = $motion
  const el = root.value
  const moveX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
  const moveY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
  let current: HTMLElement | null = null
  let pauseTimer = 0
  let started = false
  let px = 0
  let py = 0

  const activate = (target: HTMLElement) => {
    clearTimeout(pauseTimer)
    text.value = target.dataset.cursor || ''
    duration.value = Math.max(1, text.value.length / 5)
    playing.value = true
    status.value = 'active'
    current = target
  }
  const deactivate = () => {
    status.value = 'not-active'
    clearTimeout(pauseTimer)
    pauseTimer = window.setTimeout(() => (playing.value = false), 400)
    current = null
  }
  const check = () => {
    const hit = document.elementFromPoint(px, py)?.closest<HTMLElement>('[data-cursor]') ?? null
    if (hit === current) return
    if (current) deactivate()
    if (hit) activate(hit)
  }
  const onMove = (event: PointerEvent) => {
    px = event.clientX
    py = event.clientY
    if (!started) {
      started = true
      gsap.set(el, { x: px, y: py })
    }
    moveX(px)
    moveY(py)
    check()
  }
  const onScroll = () => {
    if (started) check()
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  cleanup = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('scroll', onScroll)
    clearTimeout(pauseTimer)
    gsap.killTweensOf(el)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="root" class="cursor-marquee" :data-status="status" aria-hidden="true">
    <div class="cursor-marquee__card">
      <span
        v-for="copy in 2"
        :key="copy"
        :class="['cursor-marquee__text', { 'is-duplicate': copy === 2 }]"
        :style="{ animationDuration: `${duration}s`, animationPlayState: playing ? 'running' : 'paused' }"
      >{{ text }}&nbsp;</span>
    </div>
  </div>
</template>

<style scoped>
.cursor-marquee {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  translate: -50% -50%;
}

.cursor-marquee__card {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e4e1fb;
  color: var(--c-signal);
  opacity: 0;
  clip-path: inset(calc(50% - 0.25em) round 50em);
  transform: translateY(0%) rotate(0.001deg);
  transition: all 0.4s cubic-bezier(0.75, 0, 0.25, 1);
  will-change: clip-path;
}

.cursor-marquee[data-status='active'] .cursor-marquee__card {
  opacity: 1;
  clip-path: inset(0 round 50em);
  transform: translateY(-25%) rotate(0.001deg);
}

.cursor-marquee__text {
  position: relative;
  display: block;
  padding: 0.375em 0.125em;
  font-family: var(--font-grotesk);
  font-size: calc(0.84 * var(--u));
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  animation: cursor-marquee 10s linear infinite paused;
  transition: opacity 0.15s ease-in-out 0.25s;
}

.cursor-marquee__text.is-duplicate {
  position: absolute;
  left: 100%;
}

.cursor-marquee[data-status='active'] .cursor-marquee__text {
  opacity: 1;
  transition: opacity 0.15s ease-in-out 0s;
}

@keyframes cursor-marquee {
  to {
    transform: translateX(-100%);
  }
}
</style>
