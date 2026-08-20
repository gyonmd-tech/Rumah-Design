<script setup lang="ts">
type IconConfig = {
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
  rounded?: number // 0 to 100
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

// Variant Palette Presets (Oval with Border Only + Smooth Radial Fill on Hover)
const variantColors = computed(() => {
  switch (props.variant) {
    case 'primary':
      return {
        fill: props.fill ?? 'transparent',
        textColor: props.textColor ?? 'var(--color-signal, #ff4a1c)',
        hoverFill: props.hoverFill ?? 'var(--color-signal, #ff4a1c)',
        hoverTextColor: props.hoverTextColor ?? '#ffffff',
        borderColor: props.borderColor ?? 'var(--color-signal, #ff4a1c)',
        hoverBorderColor: props.hoverBorderColor ?? 'var(--color-signal, #ff4a1c)',
      }
    case 'glass':
    case 'secondary':
      return {
        fill: props.fill ?? 'transparent',
        textColor: props.textColor ?? 'var(--color-paper, #f3ede6)',
        hoverFill: props.hoverFill ?? 'var(--color-signal, #ff4a1c)',
        hoverTextColor: props.hoverTextColor ?? '#ffffff',
        borderColor: props.borderColor ?? 'rgba(255, 255, 255, 0.28)',
        hoverBorderColor: props.hoverBorderColor ?? 'var(--color-signal, #ff4a1c)',
      }
    case 'dark':
      return {
        fill: props.fill ?? 'transparent',
        textColor: props.textColor ?? 'var(--color-ink, #14120f)',
        hoverFill: props.hoverFill ?? 'var(--color-ink, #14120f)',
        hoverTextColor: props.hoverTextColor ?? '#ffffff',
        borderColor: props.borderColor ?? 'rgba(20, 18, 15, 0.35)',
        hoverBorderColor: props.hoverBorderColor ?? 'var(--color-ink, #14120f)',
      }
    case 'white':
      return {
        fill: props.fill ?? 'transparent',
        textColor: props.textColor ?? '#ffffff',
        hoverFill: props.hoverFill ?? '#ffffff',
        hoverTextColor: props.hoverTextColor ?? '#0c0b0a',
        borderColor: props.borderColor ?? 'rgba(255, 255, 255, 0.35)',
        hoverBorderColor: props.hoverBorderColor ?? '#ffffff',
      }
    default:
      return {
        fill: props.fill ?? 'transparent',
        textColor: props.textColor ?? '#ffffff',
        hoverFill: props.hoverFill ?? '#ff4a1c',
        hoverTextColor: props.hoverTextColor ?? '#ffffff',
        borderColor: props.borderColor ?? 'rgba(255, 255, 255, 0.35)',
        hoverBorderColor: props.hoverBorderColor ?? '#ff4a1c',
      }
  }
})

const isHovered = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const clipX = ref(50)
const clipY = ref(50)
const clipRadius = ref(0)

const updatePointerPos = (e: PointerEvent) => {
  const el = (e.currentTarget as HTMLElement) || ((rootRef.value as any)?.$el as HTMLElement) || rootRef.value
  if (!el || typeof el.getBoundingClientRect !== 'function') return
  const r = el.getBoundingClientRect()
  if (!r.width || !r.height) return
  const px = e.clientX - r.left
  const py = e.clientY - r.top
  clipX.value = (px / r.width) * 100
  clipY.value = (py / r.height) * 100

  const unit = Math.hypot(r.width, r.height) / Math.SQRT2
  const far = Math.max(
    Math.hypot(px, py),
    Math.hypot(r.width - px, py),
    Math.hypot(px, r.height - py),
    Math.hypot(r.width - px, r.height - py)
  )
  clipRadius.value = (far / unit) * 100 + 4
}

const onPointerEnter = (e: PointerEvent) => {
  if (props.disabled) return
  updatePointerPos(e)
  isHovered.value = true
}

const onPointerLeave = () => {
  if (props.disabled) return
  isHovered.value = false
}

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

const commonStyle = computed(() => ({
  borderRadius: props.rounded >= 100 ? '9999px' : `${props.rounded}px`,
  backgroundColor: variantColors.value.fill,
  borderColor: isHovered.value ? variantColors.value.hoverBorderColor : variantColors.value.borderColor,
  borderWidth: props.borderWidth !== undefined ? (typeof props.borderWidth === 'number' ? `${props.borderWidth}px` : props.borderWidth) : '1px',
  borderStyle: 'solid',
  padding: props.padding || '0.75rem 1.6rem',
  fontSize: '0.75rem',
  lineHeight: '1.2',
}))
</script>

<template>
  <!-- 1. Internal Nuxt Link -->
  <NuxtLink
    v-if="isNuxtLink"
    ref="rootRef"
    :to="destination"
    class="radial-btn group relative inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider select-none cursor-pointer overflow-hidden transition-transform duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="customClass"
    :style="commonStyle"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <!-- Background Radial Reveal Backdrop -->
    <span
      aria-hidden="true"
      class="radial-backdrop absolute inset-0 z-0 pointer-events-none transition-[clip-path] duration-300 ease-out"
      :style="{
        backgroundColor: variantColors.hoverFill,
        clipPath: isHovered ? `circle(${clipRadius}% at ${clipX}% ${clipY}%)` : `circle(0% at ${clipX}% ${clipY}%)`,
        WebkitClipPath: isHovered ? `circle(${clipRadius}% at ${clipX}% ${clipY}%)` : `circle(0% at ${clipX}% ${clipY}%)`,
      }"
    />

    <!-- Single Unified Text Layer (Zero overlay clash) -->
    <span
      class="btn-text relative z-10 flex items-center justify-center pointer-events-none transition-colors duration-200"
      :style="{
        color: isHovered ? variantColors.hoverTextColor : variantColors.textColor,
        gap: `${gap}px`,
        flexDirection: mergedIcon.side === 'left' ? 'row-reverse' : 'row',
      }"
    >
      <slot>
        <span>{{ label }}</span>
      </slot>
      <span
        v-if="addIcon || $slots.icon"
        class="inline-flex items-center justify-center shrink-0 transition-transform duration-200"
        :class="{ 'translate-x-0.5 -translate-y-0.5': isHovered && mergedIcon.symbol === '↗' }"
        :style="{ fontSize: `${mergedIcon.size}px` }"
      >
        <slot name="icon">
          <span>{{ mergedIcon.symbol }}</span>
        </slot>
      </span>
    </span>
  </NuxtLink>

  <!-- 2. External Standard Anchor Link -->
  <a
    v-else-if="isExternalLink"
    ref="rootRef"
    :href="destination"
    :target="newTab ? '_blank' : undefined"
    :rel="newTab ? 'noopener noreferrer' : undefined"
    class="radial-btn group relative inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider select-none cursor-pointer overflow-hidden transition-transform duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="customClass"
    :style="commonStyle"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <!-- Background Radial Reveal Backdrop -->
    <span
      aria-hidden="true"
      class="radial-backdrop absolute inset-0 z-0 pointer-events-none transition-[clip-path] duration-300 ease-out"
      :style="{
        backgroundColor: variantColors.hoverFill,
        clipPath: isHovered ? `circle(${clipRadius}% at ${clipX}% ${clipY}%)` : `circle(0% at ${clipX}% ${clipY}%)`,
        WebkitClipPath: isHovered ? `circle(${clipRadius}% at ${clipX}% ${clipY}%)` : `circle(0% at ${clipX}% ${clipY}%)`,
      }"
    />

    <!-- Single Unified Text Layer (Zero overlay clash) -->
    <span
      class="btn-text relative z-10 flex items-center justify-center pointer-events-none transition-colors duration-200"
      :style="{
        color: isHovered ? variantColors.hoverTextColor : variantColors.textColor,
        gap: `${gap}px`,
        flexDirection: mergedIcon.side === 'left' ? 'row-reverse' : 'row',
      }"
    >
      <slot>
        <span>{{ label }}</span>
      </slot>
      <span
        v-if="addIcon || $slots.icon"
        class="inline-flex items-center justify-center shrink-0 transition-transform duration-200"
        :class="{ 'translate-x-0.5 -translate-y-0.5': isHovered && mergedIcon.symbol === '↗' }"
        :style="{ fontSize: `${mergedIcon.size}px` }"
      >
        <slot name="icon">
          <span>{{ mergedIcon.symbol }}</span>
        </slot>
      </span>
    </span>
  </a>

  <!-- 3. Standard Button Element -->
  <button
    v-else
    ref="rootRef"
    :type="type || 'button'"
    :disabled="disabled"
    class="radial-btn group relative inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider select-none cursor-pointer overflow-hidden transition-transform duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="customClass"
    :style="commonStyle"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <!-- Background Radial Reveal Backdrop -->
    <span
      aria-hidden="true"
      class="radial-backdrop absolute inset-0 z-0 pointer-events-none transition-[clip-path] duration-300 ease-out"
      :style="{
        backgroundColor: variantColors.hoverFill,
        clipPath: isHovered ? `circle(${clipRadius}% at ${clipX}% ${clipY}%)` : `circle(0% at ${clipX}% ${clipY}%)`,
        WebkitClipPath: isHovered ? `circle(${clipRadius}% at ${clipX}% ${clipY}%)` : `circle(0% at ${clipX}% ${clipY}%)`,
      }"
    />

    <!-- Single Unified Text Layer (Zero overlay clash) -->
    <span
      class="btn-text relative z-10 flex items-center justify-center pointer-events-none transition-colors duration-200"
      :style="{
        color: isHovered ? variantColors.hoverTextColor : variantColors.textColor,
        gap: `${gap}px`,
        flexDirection: mergedIcon.side === 'left' ? 'row-reverse' : 'row',
      }"
    >
      <slot>
        <span>{{ label }}</span>
      </slot>
      <span
        v-if="addIcon || $slots.icon"
        class="inline-flex items-center justify-center shrink-0 transition-transform duration-200"
        :class="{ 'translate-x-0.5 -translate-y-0.5': isHovered && mergedIcon.symbol === '↗' }"
        :style="{ fontSize: `${mergedIcon.size}px` }"
      >
        <slot name="icon">
          <span>{{ mergedIcon.symbol }}</span>
        </slot>
      </span>
    </span>
  </button>
</template>

<style scoped>
.radial-btn {
  box-sizing: border-box;
  text-decoration: none;
  isolation: isolate;
  will-change: transform;
}
</style>
