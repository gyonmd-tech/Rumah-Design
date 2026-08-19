import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

export const useMotion = () => {
  const isReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  // Optimized Motion tokens (Fast & Silky)
  const tokens = {
    ease: {
      reveal: 'power3.out',
      exit: 'power2.in',
      smooth: 'power2.inOut',
    },
    duration: {
      fast: 0.3,
      base: 0.6,
      slow: 1.0,
    },
    stagger: {
      tight: 0.04,
      base: 0.08,
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
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: tokens.duration.base }
      )
    }

    if (options.headlineLines && options.headlineLines.length) {
      tl.fromTo(
        options.headlineLines,
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: tokens.duration.slow,
          stagger: tokens.stagger.base,
        },
        options.eyebrow ? '-=0.4' : '0'
      )
    }

    if (options.intro) {
      tl.fromTo(
        options.intro,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: tokens.duration.base },
        '-=0.6'
      )
    }

    if (options.stats) {
      tl.fromTo(
        options.stats,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: tokens.duration.base },
        '-=0.4'
      )
    }

    if (options.scrollCue) {
      tl.fromTo(
        options.scrollCue,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: tokens.duration.base },
        '-=0.3'
      )
    }

    return tl
  }

  /**
   * Smooth & Lightweight Hero Parallax on Scroll (Zero lag)
   */
  const setupHeroParallax = (heroEl: HTMLElement, contentEl: HTMLElement) => {
    if (isReducedMotion()) return null

    const trigger = ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.3,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(contentEl, {
          y: -p * 60, // subtle upward float, never collides with work sheet
          opacity: Math.max(0, 1 - p * 1.4),
          scale: Math.max(0.96, 1 - p * 0.04),
        })
      },
    })

    registerTrigger(trigger)
    return trigger
  }

  /**
   * Hide nav on scroll down, show on scroll up
   */
  const setupNavScroll = (navEl: HTMLElement) => {
    if (isReducedMotion()) return null

    let lastScroll = 0
    const trigger = ScrollTrigger.create({
      start: 180,
      onUpdate: (self) => {
        const currentScroll = self.scroll()
        if (currentScroll > 180 && self.direction === 1 && currentScroll > lastScroll) {
          gsap.to(navEl, { y: -120, duration: tokens.duration.fast, ease: 'power2.out' })
        } else if (self.direction === -1 || currentScroll <= 180) {
          gsap.to(navEl, { y: 0, duration: tokens.duration.fast, ease: 'power2.out' })
        }
        lastScroll = currentScroll
      },
    })

    registerTrigger(trigger)
    return trigger
  }

  /**
   * Lightweight Cards Stagger (Lag-free 60fps)
   */
  const setupCardsBatch = (containerEl: HTMLElement, cardSelector = '.project-card-item') => {
    if (isReducedMotion()) {
      const cards = containerEl.querySelectorAll(cardSelector)
      gsap.set(cards, { opacity: 1, y: 0 })
      return
    }

    const cards = containerEl.querySelectorAll(cardSelector)
    if (!cards.length) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: tokens.duration.base,
        stagger: tokens.stagger.tight,
        ease: tokens.ease.reveal,
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 88%',
          once: true,
        },
      }
    )
  }

  /**
   * Horizontal Gallery for Project Detail
   */
  const setupHorizontalGallery = (options: {
    sectionEl: HTMLElement
    trackEl: HTMLElement
    onIndexUpdate?: (current: number, total: number) => void
  }) => {
    if (isReducedMotion()) return null

    const totalWidth = options.trackEl.scrollWidth - options.sectionEl.clientWidth

    if (totalWidth <= 0) return null

    const trigger = ScrollTrigger.create({
      trigger: options.sectionEl,
      start: 'top top',
      end: () => `+=${totalWidth + 400}`,
      pin: true,
      scrub: 0.8,
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
    if (isReducedMotion()) {
      gsap.set(element, { opacity: 1, y: 0 })
      return
    }

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          element,
          { opacity: 0, y: options?.y ?? 30 },
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

  /**
   * Footer Curtain Uncover Parallax (Behind Foreground Products)
   */
  const setupFooterUncover = (footerEl: HTMLElement, innerContentEl: HTMLElement) => {
    if (isReducedMotion()) return null

    const trigger = ScrollTrigger.create({
      trigger: footerEl,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(innerContentEl, {
          y: (1 - p) * 60,
          scale: 0.95 + p * 0.05,
          opacity: 0.5 + p * 0.5,
        })
      },
    })

    registerTrigger(trigger)
    return trigger
  }

  return {
    tokens,
    isReducedMotion,
    animateHeroReveal,
    setupHeroParallax,
    setupNavScroll,
    setupCardsBatch,
    setupHorizontalGallery,
    setupFooterUncover,
    revealOnScroll,
    cleanup,
    registerTrigger,
  }
}
