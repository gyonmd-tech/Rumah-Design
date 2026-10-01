<script setup lang="ts">
const wrap = ref<HTMLElement | null>(null)
const path = ref<SVGPathElement | null>(null)
const { $motion } = useNuxtApp()

let unregister: (() => void) | null = null

onMounted(() => {
  if (!$motion || !wrap.value || !path.value) return
  const { gsap } = $motion
  const el = path.value
  const box = wrap.value
  gsap.set(el, { drawSVG: '0% 0%' })

  unregister = registerTransitionOverlay({
    cover: () => new Promise((resolve) => {
      box.dataset.active = 'true'
      gsap.timeline({ onComplete: () => resolve() })
        .set(el, { drawSVG: '0% 0%', strokeWidth: 6 })
        .to(el, { drawSVG: '0% 100%', duration: 0.95, ease: 'power1.inOut' }, 0)
        .to(el, { strokeWidth: 44, duration: 0.7, ease: 'power1.inOut' }, 0.2)
    }),
    uncover: () => new Promise((resolve) => {
      gsap.timeline({
        onComplete: () => {
          delete box.dataset.active
          resolve()
        },
      })
        .to(el, { drawSVG: '100% 100%', duration: 1.15, ease: 'power1.inOut' }, 0)
        .to(el, { strokeWidth: 6, duration: 1, ease: 'power1.inOut' }, 0.1)
    }),
  })
})

onBeforeUnmount(() => unregister?.())
</script>

<template>
  <div ref="wrap" class="page-transition" aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <path
        ref="path"
        d="M -15 -4 C 20 8, 80 -8, 115 4 C 80 20, 20 12, -15 22 C 20 32, 80 26, 115 40 C 80 52, 20 46, -15 58 C 20 68, 80 62, 115 76 C 80 88, 20 82, -15 94 C 20 104, 80 100, 115 110"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<style scoped>
.page-transition {
  position: fixed;
  inset: 0;
  z-index: 150;
  pointer-events: none;
  visibility: hidden;
}

.page-transition[data-active] {
  visibility: visible;
  pointer-events: auto;
}

svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

path {
  stroke: var(--c-signal);
}
</style>
