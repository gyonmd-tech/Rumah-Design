<script setup lang="ts">
import { Check, Copy, Mail } from 'lucide-vue-next'

/**
 * Primary CTA. Icon block + label block in the same color with a hairline gap.
 * Hover: the label slides over the icon, tilts and squashes, then springs back
 * while a fresh icon pops in on the right (see `.btn` in site.css).
 */
const props = withDefaults(defineProps<{
  label: string
  to?: string
  href?: string
  variant?: 'signal' | 'pink' | 'cyan' | 'amber' | 'light' | 'ink'
  icon?: 'right' | 'down' | 'external' | 'mail' | 'copy' | 'check'
  type?: 'button' | 'submit'
}>(), {
  to: undefined,
  href: undefined,
  variant: 'signal',
  icon: 'right',
  type: 'button',
})

defineEmits<{ click: [event: MouseEvent] }>()

const lucide = { mail: Mail, copy: Copy, check: Check } as const
const lucideIcon = computed(() => (props.icon in lucide ? lucide[props.icon as keyof typeof lucide] : null))
const rotation = computed(() => ({ right: 0, down: 90, external: -45 } as Record<string, number>)[props.icon] ?? 0)

const isExternal = computed(() => Boolean(props.href && /^https?:/.test(props.href)))
const tag = computed(() => props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button')
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) {
    return isExternal.value
      ? { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
      : { href: props.href }
  }
  return { type: props.type }
})
</script>

<template>
  <component :is="tag" v-bind="attrs" :class="['btn', `btn--${variant}`]" @click="$emit('click', $event)">
    <span v-for="slot in ['is-default', 'is-hover'] as const" :key="slot" :class="['btn__icon', slot]" aria-hidden="true">
      <span class="btn__icon-bg" />
      <component :is="lucideIcon" v-if="lucideIcon" class="btn__glyph" :stroke-width="2.75" />
      <svg v-else class="btn__glyph" viewBox="0 0 14 14" :style="{ rotate: `${rotation}deg` }">
        <path d="M7.4 1.2 13 7l-5.6 5.8H4.9l4.2-4.5H1V5.7h8.1L4.9 1.2z" fill="currentColor" />
      </svg>
    </span>
    <span class="btn__text-wrap">
      <span class="btn__text">{{ label }}</span><span v-if="isExternal" class="sr-only"> (tab baru)</span>
    </span>
  </component>
</template>
