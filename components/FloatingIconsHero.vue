<script setup lang="ts">
import gsap from 'gsap'

export interface FloatingIconItem {
  id: number | string
  name: string
  className: string // Position classes e.g. 'top-[12%] left-[8%]'
  iconKey: string
  size?: 'sm' | 'md' | 'lg'
  floatDuration?: string
  floatDelay?: string
}

interface Props {
  titlePrefix?: string
  titleHighlight?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  icons?: FloatingIconItem[]
}

const props = withDefaults(defineProps<Props>(), {
  titlePrefix: 'Desain Presisi,',
  titleHighlight: 'Eksekusi Nyata.',
  subtitle: 'Karya terpilih desain produk dan frontend interaktif.',
  ctaText: 'Jelajahi Karya',
  ctaHref: '#work',
})

const defaultIcons: FloatingIconItem[] = [
  // Left side
  { id: 1, name: 'Nuxt 3', iconKey: 'nuxt', className: 'top-[6%] left-[2%] sm:left-[5%]', floatDuration: '7s', floatDelay: '0s' },
  { id: 2, name: 'Supabase', iconKey: 'supabase', className: 'hidden md:block top-[12%] left-[18%] sm:left-[20%]', floatDuration: '7.8s', floatDelay: '-1.5s' },
  { id: 3, name: 'Vue.js', iconKey: 'vue', className: 'top-[44%] left-[1%] sm:left-[3.5%]', floatDuration: '8.5s', floatDelay: '-2s' },
  { id: 4, name: 'Tailwind CSS', iconKey: 'tailwind', className: 'hidden md:block bottom-[18%] left-[3%] sm:left-[5%]', floatDuration: '6.8s', floatDelay: '-1s' },
  { id: 5, name: 'GSAP', iconKey: 'gsap', className: 'bottom-[4%] left-[2%] sm:left-[22%]', floatDuration: '8.2s', floatDelay: '-4s' },
  { id: 6, name: 'TypeScript', iconKey: 'typescript', className: 'hidden md:block bottom-[6%] left-[8%] sm:left-[12%]', floatDuration: '9s', floatDelay: '-3.5s' },

  // Right side
  { id: 7, name: 'Figma', iconKey: 'figma', className: 'top-[6%] right-[2%] sm:right-[5%]', floatDuration: '7.2s', floatDelay: '-0.8s' },
  { id: 8, name: 'Linear', iconKey: 'linear', className: 'hidden md:block top-[12%] right-[18%] sm:right-[20%]', floatDuration: '8s', floatDelay: '-4.2s' },
  { id: 9, name: 'Vercel', iconKey: 'vercel', className: 'top-[44%] right-[1%] sm:right-[3.5%]', floatDuration: '8.8s', floatDelay: '-2.5s' },
  { id: 10, name: 'React', iconKey: 'react', className: 'hidden md:block bottom-[18%] right-[3%] sm:right-[5%]', floatDuration: '7.5s', floatDelay: '-3s' },
  { id: 11, name: 'Google', iconKey: 'google', className: 'hidden md:block bottom-[8%] right-[18%] sm:right-[22%]', floatDuration: '9.2s', floatDelay: '-2.2s' },
  { id: 12, name: 'GitHub', iconKey: 'github', className: 'bottom-[4%] right-[2%] sm:right-[12%]', floatDuration: '6.5s', floatDelay: '-1.2s' },
]

const iconsList = computed(() => props.icons?.length ? props.icons : defaultIcons)

// Container and elements refs
const containerRef = ref<HTMLElement | null>(null)
const headlineLine1 = ref<HTMLElement | null>(null)
const headlineLine2 = ref<HTMLElement | null>(null)
const introRef = ref<HTMLElement | null>(null)
const ctaContainerRef = ref<HTMLElement | null>(null)
const iconBadgesRefs = ref<HTMLElement[]>([])

// Physics state for each icon
interface PhysicsState {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
}

const physicsMap = new Map<number | string, PhysicsState>()

const mousePos = { x: -1000, y: -1000 }
let isHovering = false
let isLoopRunning = false
let animFrameId: number | null = null

const startPhysicsLoop = () => {
  if (!isLoopRunning) {
    isLoopRunning = true
    animFrameId = requestAnimationFrame(updatePhysics)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mousePos.x = e.clientX - rect.left
  mousePos.y = e.clientY - rect.top
  isHovering = true
  startPhysicsLoop()
}

const handleMouseLeave = () => {
  isHovering = false
  mousePos.x = -1000
  mousePos.y = -1000
  startPhysicsLoop()
}

// Spring physics simulation loop with smart idle sleeping for peak 60/120fps performance
const updatePhysics = () => {
  const repulsionRadius = 160
  const maxForce = 54
  const springStiffness = 0.08
  const damping = 0.84

  let hasMovement = false

  iconBadgesRefs.value.forEach((el, index) => {
    if (!el) return
    const item = iconsList.value[index]
    if (!item) return

    let state = physicsMap.get(item.id)
    if (!state) {
      state = { x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0 }
      physicsMap.set(item.id, state)
    }

    if (isHovering && containerRef.value) {
      const elRect = el.getBoundingClientRect()
      const containerRect = containerRef.value.getBoundingClientRect()
      
      const elCenterX = (elRect.left - containerRect.left) + elRect.width / 2 - state.x
      const elCenterY = (elRect.top - containerRect.top) + elRect.height / 2 - state.y

      const dx = mousePos.x - elCenterX
      const dy = mousePos.y - elCenterY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < repulsionRadius && distance > 0.001) {
        const force = (1 - distance / repulsionRadius) * maxForce
        const angle = Math.atan2(dy, dx)
        state.targetX = -Math.cos(angle) * force
        state.targetY = -Math.sin(angle) * force
      } else {
        state.targetX = 0
        state.targetY = 0
      }
    } else {
      state.targetX = 0
      state.targetY = 0
    }

    // Spring calculation
    const ax = (state.targetX - state.x) * springStiffness
    const ay = (state.targetY - state.y) * springStiffness

    state.vx = (state.vx + ax) * damping
    state.vy = (state.vy + ay) * damping

    state.x += state.vx
    state.y += state.vy

    // Check if moving
    if (
      Math.abs(state.vx) > 0.005 ||
      Math.abs(state.vy) > 0.005 ||
      Math.abs(state.x - state.targetX) > 0.01 ||
      Math.abs(state.y - state.targetY) > 0.01
    ) {
      hasMovement = true
    }

    // Apply transform via translate3d for GPU hardware acceleration
    el.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`
  })

  // If hovering or spring is still settling, continue loop; otherwise sleep to conserve CPU
  if (isHovering || hasMovement) {
    animFrameId = requestAnimationFrame(updatePhysics)
  } else {
    isLoopRunning = false
    animFrameId = null
  }
}

onMounted(() => {
  // GSAP Entry Reveal Animation
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1. Headline Lines Reveal
    const lines = [headlineLine1.value, headlineLine2.value].filter(Boolean)
    if (lines.length) {
      tl.fromTo(
        lines,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.08 }
      )
    }

    // 2. Intro and CTA
    if (introRef.value) {
      tl.fromTo(introRef.value, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, '-=0.5')
    }
    if (ctaContainerRef.value) {
      tl.fromTo(ctaContainerRef.value, { y: 16, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.5 }, '-=0.4')
    }

    // 3. Floating Icons Pop-in Stagger
    if (iconBadgesRefs.value.length) {
      tl.fromTo(
        iconBadgesRefs.value,
        { scale: 0.3, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: {
            each: 0.05,
            from: 'random',
          },
          ease: 'back.out(1.6)',
        },
        '-=0.7'
      )
    }
  }, containerRef.value ?? undefined)

  onUnmounted(() => {
    ctx.revert()
  })
})

onUnmounted(() => {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
  }
})
</script>

<template>
  <section
    id="hero-section"
    ref="containerRef"
    class="relative z-10 flex min-h-[92dvh] sm:min-h-screen flex-col justify-between pt-20 sm:pt-32 pb-12 sm:pb-24 bg-void text-paper overflow-hidden select-none"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Background Ambient Atmospheric Lighting (GSAP Green + Supporting Purple/Cyan Accents) -->
    <div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[340px] sm:w-[620px] h-[240px] sm:h-[340px] bg-signal/15 rounded-full blur-[90px] sm:blur-[130px]" />
    <div class="pointer-events-none absolute top-1/4 -left-20 w-[240px] sm:w-[380px] h-[240px] sm:h-[380px] bg-[#9d72ff]/10 rounded-full blur-[110px]" />
    <div class="pointer-events-none absolute bottom-10 -right-20 w-[260px] sm:w-[420px] h-[260px] sm:h-[420px] bg-[#00b4d8]/10 rounded-full blur-[120px]" />

    <!-- FLOATING ICONS LAYER (Background Physics & Floating Badges) -->
    <div class="pointer-events-none absolute inset-0 w-full h-full overflow-hidden z-0">
      <div
        v-for="(item, index) in iconsList"
        :key="item.id"
        :class="['absolute z-0', item.className]"
      >
        <!-- Outer Interactive Physics Wrapper -->
        <div
          :ref="(el) => { if (el) iconBadgesRefs[index] = el as HTMLElement }"
          class="will-change-transform"
        >
          <!-- Inner Ambient Floating Keyframe Wrapper -->
          <div
            class="ambient-floating flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 md:w-20 md:h-20 p-2 sm:p-2.5 md:p-3.5 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.55)] bg-[#181a19]/90 backdrop-blur-xl border border-white/10 hover:border-signal/60 hover:bg-[#222423]/95 transition-colors duration-300 pointer-events-auto cursor-default group"
            :style="{
              animationDuration: item.floatDuration || '8s',
              animationDelay: item.floatDelay || '0s',
            }"
            :title="item.name"
          >
            <!-- SVG Icon Selection -->
            <!-- 1. Nuxt 3 -->
            <svg
              v-if="item.iconKey === 'nuxt'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.5 17.5L9.5 9L2 21H22L17.5 13.5L14.5 17.5Z" fill="#00DC82" />
              <path d="M9.5 9L14.5 17.5L17.5 13.5L12 4.5L7.5 12L9.5 9Z" fill="#00C574" />
            </svg>

            <!-- 2. Vue.js -->
            <svg
              v-else-if="item.iconKey === 'vue'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 15.5L19.5 2.5H15.5L12 8.5L8.5 2.5H4.5L12 15.5Z" fill="#42B883" />
              <path d="M12 21.5L23.5 2.5H19.5L12 15.5L4.5 2.5H0.5L12 21.5Z" fill="#35495E" />
              <path d="M12 15.5L19.5 2.5H15.5L12 8.5L8.5 2.5H4.5L12 15.5Z" fill="#42B883" />
            </svg>

            <!-- 3. TypeScript -->
            <svg
              v-else-if="item.iconKey === 'typescript'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" rx="4" fill="#3178C6" />
              <path d="M11.5 10H7V11.8H8.3V18H10.2V11.8H11.5V10Z" fill="white" />
              <path d="M13.2 16.2C13.6 16.5 14.2 16.7 14.8 16.7C15.7 16.7 16.2 16.3 16.2 15.7C16.2 14.2 13.3 14.6 13.3 12.3C13.3 11 14.4 10 16 10C16.7 10 17.3 10.2 17.8 10.5L17.2 12C16.8 11.8 16.4 11.6 15.9 11.6C15.2 11.6 14.8 12 14.8 12.4C14.8 13.8 17.7 13.5 17.7 15.8C17.7 17.2 16.5 18.2 14.8 18.2C14 18.2 13.2 17.9 12.6 17.5L13.2 16.2Z" fill="white" />
            </svg>

            <!-- 4. Tailwind CSS -->
            <svg
              v-else-if="item.iconKey === 'tailwind'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" fill="#38BDF8" />
            </svg>

            <!-- 5. Supabase -->
            <svg
              v-else-if="item.iconKey === 'supabase'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.4 22.3C12.8 22.8 11.9 22.4 11.9 21.6V13.8H3.3C2.4 13.8 1.9 12.7 2.5 12L10.6 1.7C11.2 1.2 12.1 1.6 12.1 2.4V10.2H20.7C21.6 10.2 22.1 11.3 21.5 12L13.4 22.3Z" fill="#3ECF8E" />
            </svg>

            <!-- 6. GSAP / Motion -->
            <svg
              v-else-if="item.iconKey === 'gsap'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" rx="5" fill="#0AE448" />
              <path d="M12 4L4 12L12 20L20 12L12 4Z" fill="#121110" />
              <circle cx="12" cy="12" r="3.5" fill="#0AE448" />
            </svg>

            <!-- 7. Figma -->
            <svg
              v-else-if="item.iconKey === 'figma'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83" />
              <path d="M4 12C4 9.79086 5.79086 8 8 8H12V16H8C5.79086 16 4 14.2091 4 12Z" fill="#A259FF" />
              <path d="M4 4C4 1.79086 5.79086 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z" fill="#F24E1E" />
              <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262" />
              <path d="M20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8C18.2091 8 20 9.79086 20 12Z" fill="#1ABCFE" />
            </svg>

            <!-- 8. Vercel -->
            <svg
              v-else-if="item.iconKey === 'vercel'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 22H22L12 2Z" />
            </svg>

            <!-- 9. React -->
            <svg
              v-else-if="item.iconKey === 'react'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="#61DAFB" stroke-width="1.5" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="#61DAFB" stroke-width="1.5" />
              <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
            </svg>

            <!-- 10. GitHub -->
            <svg
              v-else-if="item.iconKey === 'github'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-paper/90 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>

            <!-- 11. Linear -->
            <svg
              v-else-if="item.iconKey === 'linear'"
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="linear-hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5E5CE6" />
                  <stop offset="100%" stopColor="#8A88FF" />
                </linearGradient>
              </defs>
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-4 9h8v2H8v-2z" fill="url(#linear-hero-grad)" />
            </svg>

            <!-- 12. Google -->
            <svg
              v-else
              class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.9999 12.24C21.9999 11.4933 21.9333 10.76 21.8066 10.0533H12.3333V14.16H17.9533C17.7333 15.3467 17.0133 16.3733 15.9666 17.08V19.68H19.5266C21.1933 18.16 21.9999 15.4533 21.9999 12.24Z" fill="#4285F4" />
              <path d="M12.3333 22C15.2333 22 17.6866 21.0533 19.5266 19.68L15.9666 17.08C15.0199 17.7333 13.7933 18.16 12.3333 18.16C9.52659 18.16 7.14659 16.28 6.27992 13.84H2.59326V16.5133C4.38659 20.0267 8.05992 22 12.3333 22Z" fill="#34A853" />
              <path d="M6.2799 13.84C6.07324 13.2267 5.9599 12.58 5.9599 11.92C5.9599 11.26 6.07324 10.6133 6.2799 10L2.59326 7.32667C1.86659 8.78667 1.45326 10.32 1.45326 11.92C1.45326 13.52 1.86659 15.0533 2.59326 16.5133L6.2799 13.84Z" fill="#FBBC05" />
              <path d="M12.3333 5.68C13.8933 5.68 15.3133 6.22667 16.3866 7.24L19.6 4.02667C17.68 2.29333 15.2266 1.33333 12.3333 1.33333C8.05992 1.33333 4.38659 3.97333 2.59326 7.32667L6.2799 10C7.14659 7.56 9.52659 5.68 12.3333 5.68Z" fill="#EA4335" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- FOREGROUND HERO CONTENT (Interactive z-10) -->
    <div class="page-shell-wide relative z-10 flex flex-col justify-center items-center my-auto grow py-8 sm:py-16 pointer-events-none">
      <div class="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto text-center pointer-events-auto px-2 sm:px-4">
        <!-- Main Wide Headline (ARQINO Typeface) -->
        <h1 class="font-arqino font-normal text-[clamp(2.3rem,9.2vw,3.6rem)] sm:text-[4.2rem] md:text-[5.4rem] lg:text-[6.6rem] xl:text-[7.5rem] tracking-tight text-paper select-none leading-[1.08] sm:leading-[1.04] md:leading-[1.0] flex flex-col items-center">
          <span class="overflow-hidden block py-0.5 sm:py-1">
            <span ref="headlineLine1" class="block will-change-transform">{{ titlePrefix }}</span>
          </span>
          <span class="overflow-hidden block py-0.5 sm:py-1">
            <span ref="headlineLine2" class="block text-signal will-change-transform">{{ titleHighlight }}</span>
          </span>
        </h1>

        <!-- Ultra Short, Concise & Punchy Subtitle -->
        <p
          v-if="subtitle"
          ref="introRef"
          class="mt-4 sm:mt-7 max-w-xl mx-auto text-sm sm:text-lg md:text-xl text-paper/75 font-sans tracking-normal leading-relaxed text-balance px-2"
        >
          {{ subtitle }}
        </p>

        <!-- Minimalist CTA Action Buttons -->
        <div
          ref="ctaContainerRef"
          class="mt-6 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-none mx-auto"
        >
          <RadialRevealButton
            :label="ctaText"
            :to="ctaHref"
            variant="primary"
            padding="12px 28px"
            :add-icon="true"
            :icon="{ symbol: '↓', side: 'right', size: 14 }"
            custom-class="w-full sm:w-auto text-xs sm:text-sm font-semibold tracking-wide shadow-[0_8px_30px_rgba(10,228,72,0.25)]"
          />
          <RadialRevealButton
            label="Tentang Studio"
            to="/about"
            variant="glass"
            padding="12px 26px"
            custom-class="w-full sm:w-auto text-xs sm:text-sm font-medium tracking-wide text-paper/80 hover:text-white"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes ambientFloat {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  25% {
    transform: translate(5px, -8px) rotate(2.5deg);
  }
  50% {
    transform: translate(0px, 6px) rotate(0deg);
  }
  75% {
    transform: translate(-5px, -6px) rotate(-2.5deg);
  }
  100% {
    transform: translate(0px, 0px) rotate(0deg);
  }
}

.ambient-floating {
  animation-name: ambientFloat;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .ambient-floating {
    animation: none !important;
  }
}
</style>
