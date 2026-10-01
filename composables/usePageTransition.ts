import type { TransitionProps } from 'vue'

interface TransitionOverlay {
  cover: () => Promise<void>
  uncover: () => Promise<void>
}

let overlay: TransitionOverlay | null = null

/** Called by <SiteTransitionOverlay>; returns an unregister function. */
export function registerTransitionOverlay(api: TransitionOverlay) {
  overlay = api
  return () => {
    if (overlay === api) overlay = null
  }
}

/**
 * Page transition for public routes: an SVG stroke covers the screen, the page
 * swaps underneath at scroll top, then the stroke wipes away while the new
 * page's reveals start (via the motion page-ready gate).
 */
export function usePageTransition(): TransitionProps {
  const nuxtApp = useNuxtApp()

  return {
    css: false,
    mode: 'out-in',
    onLeave(_el, done) {
      const motion = nuxtApp.$motion
      motion?.armGate()
      if (!overlay || !motion || motion.reducedMotion) {
        done()
        return
      }
      overlay.cover().then(done)
    },
    onEnter(_el, done) {
      const motion = nuxtApp.$motion
      motion?.scrollTop()
      done()
      if (!overlay || !motion || motion.reducedMotion) {
        motion?.releaseGate()
        return
      }
      requestAnimationFrame(() => motion.refresh())
      overlay.uncover()
      setTimeout(() => motion.releaseGate(), 250)
    },
  }
}
