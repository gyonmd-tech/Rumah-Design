<script setup lang="ts">
import type { Component, ComponentPublicInstance } from 'vue'
import { cn } from '~/lib/utils'

export interface FloatingDockItem {
  title: string
  href: string
  icon?: Component | string
  external?: boolean
}

const props = withDefaults(
  defineProps<{
    items: FloatingDockItem[]
    orientation?: 'horizontal' | 'vertical'
    theme?: 'light' | 'dark'
    mobileFlyout?: 'up' | 'down'
    desktopClass?: string
    mobileClass?: string
  }>(),
  {
    orientation: 'horizontal',
    theme: 'light',
    mobileFlyout: 'up',
    desktopClass: '',
    mobileClass: '',
  },
)

const isVertical = computed(() => props.orientation === 'vertical')
const isDark = computed(() => props.theme === 'dark')

const mobileOpen = ref(false)
const hoveredTitle = ref<string | null>(null)
const mousePos = ref<number | null>(null)
const iconRefs = ref<Record<string, HTMLElement | null>>({})

function setIconRef(title: string, el: Element | ComponentPublicInstance | null) {
  iconRefs.value[title] = el as HTMLElement | null
}

function sizeFor(title: string, base: number, max: number) {
  if (mousePos.value === null) return { width: `${base}px`, height: `${base}px` }
  const el = iconRefs.value[title]
  if (!el) return { width: `${base}px`, height: `${base}px` }
  const bounds = el.getBoundingClientRect()
  const center = isVertical.value ? bounds.top + bounds.height / 2 : bounds.left + bounds.width / 2
  const distance = mousePos.value - center
  const clamped = Math.max(-150, Math.min(150, distance))
  const t = 1 - Math.abs(clamped) / 150
  const size = base + t * (max - base)
  return { width: `${size}px`, height: `${size}px` }
}

const scaleFor = (title: string) => sizeFor(title, 40, 80)
const iconScaleFor = (title: string) => sizeFor(title, 20, 40)

function onMouseMove(e: MouseEvent) {
  mousePos.value = isVertical.value ? e.pageY : e.pageX
}

function onMouseLeave() {
  mousePos.value = null
}
</script>

<template>
  <div
    :class="cn(
      'relative hidden md:flex rounded-2xl',
      isDark ? 'bg-neutral-900' : 'bg-gray-50',
      isVertical ? 'flex-col w-16 items-center gap-4 py-4 px-3' : 'h-16 items-end gap-4 px-4 pb-3 mx-auto',
      props.desktopClass,
    )"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <a
      v-for="item in props.items"
      :key="item.title"
      :href="item.href"
      class="relative"
      :target="item.external ? '_blank' : undefined"
      :rel="item.external ? 'noopener noreferrer' : undefined"
      @mouseenter="hoveredTitle = item.title"
      @mouseleave="hoveredTitle = null"
    >
      <div
        :ref="(el) => setIconRef(item.title, el)"
        :class="cn(
          'relative flex aspect-square items-center justify-center rounded-full transition-[width,height] duration-150 ease-out',
          isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-gray-200 text-neutral-600',
        )"
        :style="scaleFor(item.title)"
      >
        <Transition
          :enter-active-class="`transition duration-150 ease-out`"
          :enter-from-class="isVertical ? 'opacity-0 -translate-x-2 translate-y-1/2' : 'opacity-0 translate-y-2 -translate-x-1/2'"
          :enter-to-class="isVertical ? 'opacity-100 translate-x-0 translate-y-1/2' : 'opacity-100 translate-y-0 -translate-x-1/2'"
          leave-active-class="transition duration-100 ease-in"
          :leave-to-class="isVertical ? 'opacity-0 -translate-x-0.5 translate-y-1/2' : 'opacity-0 translate-y-0.5 -translate-x-1/2'"
        >
          <div
            v-if="hoveredTitle === item.title"
            :class="cn(
              'absolute w-fit whitespace-pre rounded-md border px-2 py-0.5 text-xs',
              isVertical ? 'left-full top-1/2 ml-3 -translate-y-1/2' : '-top-8 left-1/2 -translate-x-1/2',
              isDark ? 'border-neutral-900 bg-neutral-800 text-white' : 'border-gray-200 bg-gray-100 text-neutral-700',
            )"
          >
            {{ item.title }}
          </div>
        </Transition>

        <div
          class="flex items-center justify-center transition-[width,height] duration-150 ease-out"
          :style="iconScaleFor(item.title)"
        >
          <component :is="item.icon" v-if="typeof item.icon !== 'string'" class="h-full w-full" />
          <span v-else v-html="item.icon" />
        </div>
      </div>
    </a>
  </div>

  <div :class="cn('relative block md:hidden', props.mobileClass)">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen"
        :class="cn('absolute inset-x-0 flex flex-col gap-2', props.mobileFlyout === 'down' ? 'top-full mt-2' : 'bottom-full mb-2')"
      >
        <a
          v-for="item in props.items"
          :key="item.title"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          :class="cn('flex h-10 w-10 items-center justify-center rounded-full', isDark ? 'bg-neutral-900 text-neutral-300' : 'bg-gray-50 text-neutral-600')"
        >
          <div class="h-4 w-4">
            <component :is="item.icon" v-if="typeof item.icon !== 'string'" class="h-full w-full" />
            <span v-else v-html="item.icon" />
          </div>
        </a>
      </div>
    </Transition>
    <button
      :class="cn('flex h-10 w-10 items-center justify-center rounded-full', isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-gray-50 text-neutral-500')"
      aria-label="Toggle dock menu"
      @click="mobileOpen = !mobileOpen"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</template>
