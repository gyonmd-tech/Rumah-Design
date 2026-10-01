import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

/**
 * Motion runtime for the public site.
 * - One global ease ("site") so every tween shares the same character.
 * - Lenis smooth scroll driven by the GSAP ticker (public routes only;
 *   admin keeps native scrolling for its nested scroll areas).
 * - A "page ready" gate: reveals wait until the page transition uncovers.
 */
export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(CustomEase, DrawSVGPlugin, InertiaPlugin, ScrollTrigger, SplitText)
  CustomEase.create('site', '0.625, 0.05, 0, 1')
  CustomEase.create('move', '0.3, 0.075, 0, 1')
  gsap.defaults({ ease: 'site', duration: 0.6 })

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let lenis: Lenis | null = null

  function startLenis() {
    if (lenis || reducedMotion.matches) return
    lenis = new Lenis({ lerp: 0.165, wheelMultiplier: 1.1, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
  }

  function stopLenis() {
    lenis?.destroy()
    lenis = null
  }

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  // Page-ready gate. Resolved on first load once fonts settle, then re-armed
  // by the page transition while the screen is covered.
  let releaseGate: () => void = () => {}
  let gate = new Promise<void>((resolve) => {
    releaseGate = resolve
  })

  Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise(resolve => setTimeout(resolve, 900)),
  ]).then(() => releaseGate())

  const motion = {
    gsap,
    ScrollTrigger,
    SplitText,
    get lenis() {
      return lenis
    },
    get reducedMotion() {
      return reducedMotion.matches
    },
    /** Resolves when page content is visible and may start revealing. */
    pageReady: () => gate,
    armGate() {
      gate = new Promise<void>((resolve) => {
        releaseGate = resolve
      })
    },
    releaseGate: () => releaseGate(),
    scrollTop() {
      lenis?.scrollTo(0, { immediate: true, force: true })
      window.scrollTo(0, 0)
    },
    refresh() {
      lenis?.resize()
      ScrollTrigger.refresh()
    },
  }

  const router = useRouter()
  const syncLenis = (path: string) => {
    if (path.startsWith('/admin')) stopLenis()
    else startLenis()
  }
  syncLenis(router.currentRoute.value.path)
  router.afterEach(to => syncLenis(to.path))

  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(() => motion.refresh())
  })

  return { provide: { motion } }
})
