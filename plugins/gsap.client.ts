import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger, Flip)

  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  })

  // Synchronize Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  // Keep stable frame pacing (prevents snapping/stuttering during CPU spikes)
  gsap.ticker.lagSmoothing(500, 33)

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
      Flip,
      lenis,
    },
  }
})

