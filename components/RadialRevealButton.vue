<script setup lang="ts">
import gsap from 'gsap'

export type IconConfig = {
  type?: 'symbol' | 'image'
  symbol?: string
  image?: string
  color?: string
  hoverColor?: string
  size?: number
  padding?: number
  rounded?: number
  side?: 'left' | 'right'
}

type Props = {
  label?: string
  to?: string
  link?: string
  href?: string
  target?: string
  newTab?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'glass' | 'dark' | 'white' | 'custom'
  rounded?: number // 0 (square) to 100 (pill)
  fill?: string
  textColor?: string
  hoverFill?: string
  hoverTextColor?: string
  borderWidth?: number | string
  borderColor?: string
  hoverBorderColor?: string
  addIcon?: boolean
  icon?: IconConfig
  gap?: number
  padding?: string
  disabled?: boolean
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  variant: 'primary',
  rounded: 100,
  addIcon: false,
  gap: 8,
  padding: '',
  disabled: false,
  newTab: false,
  customClass: '',
})

// Variant Palette Presets
const variantColors = computed(() => {
  switch (props.variant) {
    case 'primary':
      return {
        fill: props.fill ?? 'var(--color-signal, #ff4a1c)',
        textColor: props.textColor ?? '#ffffff',
        hoverFill: props.hoverFill ?? '#ffffff',
        hoverTextColor: props.hoverTextColor ?? '#ff4a1c',
        borderColor: props.borderColor ?? 'rgba(255, 255, 255, 0.2)',
        hoverBorderColor: props.hoverBorderColor ?? '#ffffff',
      }
    case 'glass':
    case 'secondary':
      return {
        fill: props.fill ?? 'rgba(255, 255, 255, 0.08)',
        textColor: props.textColor ?? 'var(--color-paper, #f3ede6)',
        hoverFill: props.hoverFill ?? 'var(--color-signal, #ff4a1c)',
        hoverTextColor: props.hoverTextColor ?? '#ffffff',
        borderColor: props.borderColor ?? 'rgba(255, 255, 255, 0.18)',
        hoverBorderColor: props.hoverBorderColor ?? 'var(--color-signal, #ff4a1c)',
      }
    case 'dark':
      return {
        fill: props.fill ?? '#161514',
        textColor: props.textColor ?? '#f3ede6',
        hoverFill: props.hoverFill ?? 'var(--color-signal, #ff4a1c)',
        hoverTextColor: props.hoverTextColor ?? '#ffffff',
        borderColor: props.borderColor ?? 'rgba(255, 255, 255, 0.12)',
        hoverBorderColor: props.hoverBorderColor ?? 'var(--color-signal, #ff4a1c)',
      }
    case 'white':
      return {
        fill: props.fill ?? '#ffffff',
        textColor: props.textColor ?? '#0c0b0a',
        hoverFill: props.hoverFill ?? 'var(--color-signal, #ff4a1c)',
        hoverTextColor: props.hoverTextColor ?? '#ffffff',
        borderColor: props.borderColor ?? '#ffffff',
        hoverBorderColor: props.hoverBorderColor ?? 'var(--color-signal, #ff4a1c)',
      }
    default:
      return {
        fill: props.fill ?? '#000000',
        textColor: props.textColor ?? '#ffffff',
        hoverFill: props.hoverFill ?? '#ff4a1c',
        hoverTextColor: props.hoverTextColor ?? '#ffffff',
        borderColor: props.borderColor ?? 'transparent',
        hoverBorderColor: props.hoverBorderColor ?? 'transparent',
      }
  }
})

const rootRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const radiusBox = ref({ w: 0, h: 0 })

const radiusFromPercent = (w: number, h: number, pct: number) =>
  (Math.min(w, h) / 2) * (Math.max(0, Math.min(100, pct)) / 100)

const radiusPx = computed(() =>
  radiusFromPercent(radiusBox.value.w, radiusBox.value.h, props.rounded)
)

const clip = reactive({ r: 0, x: 100, y: 100, max: 160 })
let currentTween: gsap.core.Tween | null = null

const applyClip = () => {
  if (!overlayRef.value) return
  const val = `circle(${clip.r}% at ${clip.x}% ${clip.y}%)`
  overlayRef.value.style.clipPath = val
  ;(overlayRef.value.style as any).webkitClipPath = val
}

const anchorTo = (e: PointerEvent) => {
  const el = overlayRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  if (!r.width || !r.height) return
  const px = e.clientX - r.left
  const py = e.clientY - r.top
  const unit = Math.hypot(r.width, r.height) / Math.SQRT2
  const far = Math.max(
    Math.hypot(px, py),
    Math.hypot(r.width - px, py),
    Math.hypot(px, r.height - py),
    Math.hypot(r.width - px, r.height - py)
  )
  clip.x = (px / r.width) * 100
  clip.y = (py / r.height) * 100
  clip.max = (far / unit) * 100 + 2
}

const growTo = (to: number) => {
  if (currentTween) currentTween.kill()
  currentTween = gsap.to(clip, {
    r: to,
    duration: 0.45,
    ease: 'power2.inOut',
    onUpdate: applyClip,
  })
}

const onPointerEnter = (e: PointerEvent) => {
  if (props.disabled) return
  anchorTo(e)
  applyClip()
  growTo(clip.max)
}

const onPointerLeave = (e: PointerEvent) => {
  if (props.disabled) return
  if (clip.r >= clip.max - 0.5) {
    anchorTo(e)
    clip.r = clip.max
    applyClip()
  }
  growTo(0)
}

onMounted(() => {
  const el = rootRef.value
  if (el) {
    const updateSize = () => {
      radiusBox.value = { w: el.offsetWidth, h: el.offsetHeight }
    }
    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(el)
    onUnmounted(() => ro.disconnect())
  }
  applyClip()
})

// Destination Tag Resolution
const destination = computed(() => props.to || props.link || props.href || '')
const isNuxtLink = computed(() => Boolean(props.to))
const isExternalLink = computed(() => Boolean(!props.to && (props.href || props.link)))

const defaultIcon: IconConfig = {
  type: 'symbol',
  symbol: '↗',
  color: 'currentColor',
  hoverColor: 'currentColor',
  size: 14,
  padding: 0,
  rounded: 0,
  side: 'right',
}

const mergedIcon = computed(() => ({
  ...defaultIcon,
  ...(props.icon ?? {}),
}))
</script>

<template>
  <component
    :is="isNuxtLink ? 'NuxtLink' : isExternalLink ? 'a' : 'button'"
    ref="rootRef"
    :to="isNuxtLink ? destination : undefined"
    :href="isExternalLink ? destination : undefined"
    :target="isExternalLink && newTab ? '_blank' : undefined"
    :rel="isExternalLink && newTab ? 'noopener noreferrer' : undefined"
    :type="!isNuxtLink && !isExternalLink ? (type || 'button') : undefined"
    :disabled="disabled"
    class="radial-reveal-btn group relative inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider select-none cursor-pointer overflow-hidden transition-transform duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="customClass"
    :style="{
      borderRadius: `${radiusPx}px`,
      backgroundColor: variantColors.fill,
      borderColor: variantColors.borderColor,
      borderWidth: borderWidth !== undefined ? (typeof borderWidth === 'number' ? `${borderWidth}px` : borderWidth) : '1px',
      borderStyle: 'solid',
      padding: padding || '0.75rem 1.6rem',
      fontSize: '0.75rem',
      lineHeight: '1.2',
    }"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <!-- Resting Face (Sizes the container) -->
    <span
      class="resting-face relative z-0 flex items-center justify-center pointer-events-none transition-colors duration-200"
      :style="{
        color: variantColors.textColor,
        gap: `${gap}px`,
        flexDirection: mergedIcon.side === 'left' ? 'row-reverse' : 'row',
      }"
    >
      <slot>
        <span>{{ label }}</span>
      </slot>

      <!-- Optional Icon -->
      <span
        v-if="addIcon || $slots.icon"
        class="inline-flex items-center justify-center shrink-0"
        :style="{ fontSize: `${mergedIcon.size}px`, color: mergedIcon.color }"
      >
        <slot name="icon">
          <span>{{ mergedIcon.symbol }}</span>
        </slot>
      </span>
    </span>

    <!-- Hover Face (Clipped Radial Reveal Overlay) -->
    <span
      ref="overlayRef"
      aria-hidden="true"
      class="hover-face absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-colors duration-200"
      :style="{
        borderRadius: `${radiusPx}px`,
        backgroundColor: variantColors.hoverFill,
        color: variantColors.hoverTextColor,
        gap: `${gap}px`,
        flexDirection: mergedIcon.side === 'left' ? 'row-reverse' : 'row',
        clipPath: 'circle(0% at 100% 100%)',
        WebkitClipPath: 'circle(0% at 100% 100%)',
      }"
    >
      <slot>
        <span>{{ label }}</span>
      </slot>

      <!-- Optional Icon Hover Face -->
      <span
        v-if="addIcon || $slots.icon"
        class="inline-flex items-center justify-center shrink-0"
        :style="{ fontSize: `${mergedIcon.size}px`, color: variantColors.hoverTextColor || mergedIcon.hoverColor }"
      >
        <slot name="icon">
          <span>{{ mergedIcon.symbol }}</span>
        </slot>
      </span>
    </span>
  </component>
</template>

<style scoped>
.radial-reveal-btn {
  box-sizing: border-box;
  text-decoration: none;
  isolation: isolate;
}
</style>
