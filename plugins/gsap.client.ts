import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  // Register only what we use — Flip removed (unused, saves ~34KB)
  gsap.registerPlugin(ScrollTrigger)

  // Initialize Lenis smooth scroll
  // duration 0.75 — snappier than 1.0, still silky (was 1.0 which felt unresponsive)
  const lenis = new Lenis({
    duration: 0.75,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  })

  // Synchronize Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  // lagSmoothing(0) prevents GSAP from compensating on tab re-focus (avoids jump)
  gsap.ticker.lagSmoothing(0)

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
    lenis.scrollTo(0, { immediate: true })
  })

  nuxtApp.hook('page:finish', () => {
    const route = useRoute()
    if (route.path.startsWith('/admin')) {
      lenis.stop()
    } else {
      lenis.start()
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
