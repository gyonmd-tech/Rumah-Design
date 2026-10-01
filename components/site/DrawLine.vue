<script setup lang="ts">
import { nextSquiggle } from '~/utils/squiggles'

/**
 * Hand-drawn underline that lives inside a link (place it in the link markup).
 * - mode "always": drawn once the page is ready; every hover redraws a new stroke.
 * - mode "persist": drawn on hover, erased on leave; stays while `active`.
 */
const props = withDefaults(defineProps<{
  mode?: 'always' | 'persist'
  active?: boolean
}>(), {
  mode: 'persist',
  active: false,
})

const box = ref<HTMLElement | null>(null)
const { $motion } = useNuxtApp()
let drawTween: gsap.core.Tween | null = null
let eraseTween: gsap.core.Tween | null = null
let host: HTMLElement | null = null

const holds = () => props.mode === 'always' || props.active

function draw(duration = 0.5) {
  if (!box.value || !$motion) return
  box.value.innerHTML = `<svg viewBox="0 0 310 40" preserveAspectRatio="none" fill="none"><path d="${nextSquiggle()}" stroke="currentColor" stroke-width="10" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`
  const path = box.value.querySelector('path')
  if (!path) return
  if ($motion.reducedMotion) return
  $motion.gsap.set(path, { drawSVG: '0%' })
  drawTween = $motion.gsap.to(path, {
    drawSVG: '100%',
    duration,
    ease: 'power2.inOut',
    onComplete: () => {
      drawTween = null
    },
  })
}

function erase() {
  const path = box.value?.querySelector('path')
  if (!path || !$motion) return
  if (eraseTween?.isActive()) return
  if ($motion.reducedMotion) {
    box.value!.innerHTML = ''
    return
  }
  eraseTween = $motion.gsap.to(path, {
    drawSVG: '100% 100%',
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => {
      eraseTween = null
      if (box.value && !holds()) box.value.innerHTML = ''
    },
  })
}

function onEnter() {
  if (drawTween?.isActive()) return
  eraseTween?.kill()
  eraseTween = null
  if (props.mode === 'persist' && props.active) return
  draw()
}

function onLeave() {
  if (holds()) return
  if (drawTween?.isActive()) drawTween.then(erase)
  else erase()
}

watch(() => props.active, (active) => {
  if (active && !box.value?.querySelector('path')) draw(0.6)
  else if (!active && props.mode === 'persist') erase()
})

onMounted(async () => {
  host = box.value?.closest('a, button') as HTMLElement | null
  host?.addEventListener('mouseenter', onEnter)
  host?.addEventListener('mouseleave', onLeave)
  if (!holds() || !$motion) return
  await $motion.pageReady()
  if (!box.value?.querySelector('path')) draw(0.6)
})

onBeforeUnmount(() => {
  host?.removeEventListener('mouseenter', onEnter)
  host?.removeEventListener('mouseleave', onLeave)
  drawTween?.kill()
  eraseTween?.kill()
})
</script>

<template>
  <span ref="box" class="draw-line" aria-hidden="true" />
</template>

<style scoped>
.draw-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: 0.625em;
  pointer-events: none;
  color: var(--draw-color, var(--c-signal));
}

/* Out of flow so the stroke never feeds back into the link's width. */
.draw-line :deep(svg) {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.draw-line :deep(path) {
  stroke-width: var(--draw-weight, 2.6px);
}
</style>
