import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)

  let lenis: Lenis | null = null

  if (typeof window !== 'undefined') {
    // Only enable Lenis smooth wheel on desktop (non-touch / fine pointer) devices.
    // Touch devices (phones & tablets) have native hardware-accelerated 60/120Hz inertia scrolling;
    // intercepting touch with JS causes lag, stutter ("patah-patah"), and rubberbanding fighting.
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0
    const isSmallScreen = window.innerWidth < 1024

    if (!isTouchDevice && !isSmallScreen) {
      lenis = new Lenis({
        duration: 0.85,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        syncTouch: false,
      })

      // Sync Lenis scroll with ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    }
  }

  // Route hooks for clean scroll management
  nuxtApp.hook('page:start', () => {
    ScrollTrigger.getAll().forEach((trigger) => {
      try {
        trigger.kill()
      } catch {
        // ignore
      }
    })
    window.scrollTo(0, 0)
    lenis?.scrollTo(0, { immediate: true })
  })

  nuxtApp.hook('page:finish', () => {
    const route = useRoute()
    if (route.path.startsWith('/admin')) {
      lenis?.stop()
    } else {
      lenis?.start()
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }
  })

  return {
    provide: {
      gsap,
      ScrollTrigger,
      lenis,
    },
  }
})
