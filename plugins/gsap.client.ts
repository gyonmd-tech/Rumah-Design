import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)

  let lenis: Lenis | null = null

  if (typeof window !== 'undefined') {
    // Silky Smooth Lenis instance synced with GSAP ScrollTrigger
    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      syncTouch: false, // Use native touch momentum on touch screens to ensure 120fps hardware response
    })

    // Synchronize Lenis scroll events with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000)
    })

    // GSAP default lag smoothing allows fluid recovery on minor frame drops without sudden jumps
    gsap.ticker.lagSmoothing(500, 33)
  }

  // Route hooks for clean scroll and trigger cleanup
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
