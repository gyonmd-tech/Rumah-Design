import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useMotion = () => {
  const isReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const isTouchScreen = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window) || window.innerWidth < 768
  }

  // Optimized Motion tokens (Fast & Silky)
  const tokens = {
    ease: {
      reveal: 'power3.out',
      exit: 'power2.in',
      smooth: 'power2.inOut',
    },
    duration: {
      fast: 0.25,
      base: 0.5,
      slow: 0.8,
    },
    stagger: {
      tight: 0.03,
      base: 0.06,
    },
  }

  const triggers: ScrollTrigger[] = []

  const registerTrigger = (trigger: ScrollTrigger) => {
    triggers.push(trigger)
    return trigger
  }

  const cleanup = () => {
    triggers.forEach((trigger) => {
      try {
        trigger.kill()
      } catch {
        // ignore
      }
    })
    triggers.length = 0
  }

  onUnmounted(() => {
    cleanup()
  })

  /**
   * Hero Reveal animation on page mount
   */
  const animateHeroReveal = (options: {
    headlineLines?: HTMLElement[] | NodeListOf<HTMLElement>
    eyebrow?: HTMLElement | null
    intro?: HTMLElement | null
    stats?: HTMLElement | null
    scrollCue?: HTMLElement | null
  }) => {
    if (isReducedMotion()) {
      if (options.headlineLines) gsap.set(options.headlineLines, { opacity: 1, y: 0 })
      if (options.eyebrow) gsap.set(options.eyebrow, { opacity: 1, y: 0 })
      if (options.intro) gsap.set(options.intro, { opacity: 1, y: 0 })
      if (options.stats) gsap.set(options.stats, { opacity: 1, y: 0 })
      if (options.scrollCue) gsap.set(options.scrollCue, { opacity: 1, y: 0 })
      return gsap.timeline()
    }

    const tl = gsap.timeline({ defaults: { ease: tokens.ease.reveal } })

    if (options.eyebrow) {
      tl.fromTo(
        options.eyebrow,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: tokens.duration.base }
      )
    }

    if (options.headlineLines && options.headlineLines.length) {
      tl.fromTo(
        options.headlineLines,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: tokens.duration.slow,
          stagger: tokens.stagger.base,
        },
        options.eyebrow ? '-=0.3' : '0'
      )
    }

    if (options.intro) {
      tl.fromTo(
        options.intro,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: tokens.duration.base },
        '-=0.5'
      )
    }

    if (options.stats) {
      tl.fromTo(
        options.stats,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: tokens.duration.base },
        '-=0.3'
      )
    }

    if (options.scrollCue) {
      tl.fromTo(
        options.scrollCue,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: tokens.duration.base },
        '-=0.2'
      )
    }

    return tl
  }

  /**
   * Smooth Hero Parallax on Scroll (Desktop only to guarantee 60-120fps on mobile)
   */
  const setupHeroParallax = (heroEl: HTMLElement, contentEl: HTMLElement) => {
    if (isReducedMotion() || isTouchScreen()) return null

    const trigger = ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.3,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(contentEl, {
          y: -p * 50,
          opacity: Math.max(0, 1 - p * 1.3),
        })
      },
    })

    registerTrigger(trigger)
    return trigger
  }

  /**
   * Lightweight Cards Stagger
   */
  const setupCardsBatch = (containerEl: HTMLElement, cardSelector = '.project-card-item') => {
    if (isReducedMotion() || isTouchScreen()) {
      const cards = containerEl.querySelectorAll(cardSelector)
      gsap.set(cards, { opacity: 1, y: 0 })
      return null
    }

    const cards = containerEl.querySelectorAll(cardSelector)
    if (!cards.length) return null

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: tokens.duration.base,
          stagger: tokens.stagger.tight,
          ease: tokens.ease.reveal,
          scrollTrigger: {
            trigger: containerEl,
            start: 'top 90%',
            once: true,
          },
        }
      )
    }, containerEl)

    return ctx
  }

  /**
   * Horizontal Gallery for Project Detail (Desktop only; mobile uses native snap-scroll)
   */
  const setupHorizontalGallery = (options: {
    sectionEl: HTMLElement
    trackEl: HTMLElement
    onIndexUpdate?: (current: number, total: number) => void
  }) => {
    if (isReducedMotion() || isTouchScreen() || window.innerWidth < 1024) return null

    const totalWidth = options.trackEl.scrollWidth - options.sectionEl.clientWidth
    if (totalWidth <= 0) return null

    const trigger = ScrollTrigger.create({
      trigger: options.sectionEl,
      start: 'top top',
      end: () => `+=${totalWidth + 300}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      animation: gsap.to(options.trackEl, {
        x: () => -totalWidth,
        ease: 'none',
      }),
      onUpdate: (self) => {
        if (options.onIndexUpdate) {
          const items = options.trackEl.children
          const total = items.length
          const current = Math.min(total, Math.max(1, Math.round(self.progress * (total - 1)) + 1))
          options.onIndexUpdate(current, total)
        }
      },
    })

    registerTrigger(trigger)
    return trigger
  }

  /**
   * Scroll Reveal Helper
   */
  const revealOnScroll = (element: HTMLElement, options?: { y?: number; delay?: number }) => {
    if (isReducedMotion() || isTouchScreen()) {
      gsap.set(element, { opacity: 1, y: 0 })
      return
    }

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          element,
          { opacity: 0, y: options?.y ?? 20 },
          {
            opacity: 1,
            y: 0,
            duration: tokens.duration.base,
            delay: options?.delay ?? 0,
            ease: tokens.ease.reveal,
          }
        )
      },
    })

    registerTrigger(trigger)
    return trigger
  }

  return {
    tokens,
    isReducedMotion,
    isTouchScreen,
    animateHeroReveal,
    setupHeroParallax,
    setupCardsBatch,
    setupHorizontalGallery,
    revealOnScroll,
    cleanup,
    registerTrigger,
  }
}
