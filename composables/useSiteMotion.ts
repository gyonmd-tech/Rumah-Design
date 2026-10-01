import type { Ref } from 'vue'
import type gsapType from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'
import type { SplitText as SplitTextType } from 'gsap/SplitText'

export interface SiteMotionHelpers {
  gsap: typeof gsapType
  ScrollTrigger: typeof ScrollTriggerType
  SplitText: typeof SplitTextType
  root: HTMLElement
  reduced: boolean
  /** True on wide screens with a precise pointer — gate for cursor effects. */
  finePointer: boolean
}

type Setup = (helpers: SiteMotionHelpers) => void | (() => void)

const INTRO_GAP = 0.12
const GROUP_GAP = 0.1

/**
 * Wires the declarative motion attributes inside `root` and runs an optional
 * page-specific setup inside one gsap.context, reverted on unmount.
 *
 *   data-reveal            lines slide up when the page appears ("chars" | "el")
 *   data-scroll-reveal     same, when the element enters the viewport
 *   data-scroll-group      parent that staggers its scroll reveals
 *   data-reveal-delay      extra delay in seconds
 *   data-draw              SVG paths drawn on scroll ("intro" draws on load)
 *   data-collage           hovering a [data-collage-item] lifts it and pushes,
 *                          shrinks and tilts its neighbours ([data-collage-inner])
 *
 * Content is visible without JS and with reduced motion; the `.js-motion`
 * class on <html> only hides reveal targets when animation will run.
 * Components nested in a page pass `declarative: false` so only the page
 * root wires the attributes.
 */
export function useSiteMotion(
  root: Ref<HTMLElement | null>,
  setup?: Setup,
  options: { declarative?: boolean } = {},
) {
  const declarative = options.declarative ?? true
  const nuxtApp = useNuxtApp()
  let ctx: gsap.Context | null = null
  let disposed = false
  let cleanup: void | (() => void)
  let collageCleanups: Array<() => void> = []

  onMounted(async () => {
    const motion = nuxtApp.$motion
    await nextTick()
    const el = root.value
    if (!motion || !el) return

    const { gsap, ScrollTrigger, SplitText } = motion
    const reduced = motion.reducedMotion
    const finePointer = window.matchMedia('(min-width: 992px) and (hover: hover) and (pointer: fine)').matches

    if (!reduced) await motion.pageReady()
    if (disposed) return

    ctx = gsap.context(() => {
      if (!reduced && declarative) {
        revealIntro(el, gsap, SplitText)
        revealOnScroll(el, gsap, SplitText)
        drawOnScroll(el, gsap)
        if (finePointer) collageCleanups = gsap.utils.toArray<HTMLElement>('[data-collage]', el).map(box => interactiveCollage(box, gsap))
      }
      cleanup = setup?.({ gsap, ScrollTrigger, SplitText, root: el, reduced, finePointer })
    }, el)

    requestAnimationFrame(() => motion.refresh())
  })

  onBeforeUnmount(() => {
    disposed = true
    if (typeof cleanup === 'function') cleanup()
    collageCleanups.forEach(fn => fn())
    ctx?.revert()
  })
}

function splitAndAnimate(
  node: HTMLElement,
  gsap: typeof gsapType,
  SplitText: typeof SplitTextType,
  vars: gsap.TweenVars,
) {
  const mode = node.dataset.reveal || node.dataset.scrollReveal || 'lines'
  gsap.set(node, { visibility: 'visible' })

  if (mode === 'el') {
    return gsap.from(node, { y: 28, autoAlpha: 0, duration: 0.9, ease: 'expo.out', ...vars })
  }

  const chars = mode === 'chars'
  let tween: gsap.core.Tween | undefined
  SplitText.create(node, {
    type: chars ? 'lines,words,chars' : 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    charsClass: 'split-char',
    autoSplit: true,
    onSplit(self) {
      tween = gsap.from(chars ? self.chars : self.lines, {
        yPercent: 120,
        duration: 1,
        ease: 'expo.out',
        stagger: chars ? 0.018 : 0.08,
        ...vars,
      })
      return tween
    },
  })
  return tween
}

function revealIntro(root: HTMLElement, gsap: typeof gsapType, SplitText: typeof SplitTextType) {
  const nodes = gsap.utils.toArray<HTMLElement>('[data-reveal]', root)
  nodes.forEach((node, index) => {
    const delay = parseFloat(node.dataset.revealDelay || '') || index * INTRO_GAP
    splitAndAnimate(node, gsap, SplitText, { delay })
  })
}

function revealOnScroll(root: HTMLElement, gsap: typeof gsapType, SplitText: typeof SplitTextType) {
  const nodes = gsap.utils.toArray<HTMLElement>('[data-scroll-reveal]', root)
  const groupIndex = new Map<Element, number>()

  nodes.forEach((node) => {
    const group = node.closest('[data-scroll-group]')
    let delay = parseFloat(node.dataset.revealDelay || '') || 0
    if (group) {
      const index = groupIndex.get(group) ?? 0
      groupIndex.set(group, index + 1)
      delay += index * GROUP_GAP
    }
    const trigger = group ?? node
    splitAndAnimate(node, gsap, SplitText, {
      delay,
      scrollTrigger: { trigger, start: 'top 88%', once: true },
    })
  })
}

function drawOnScroll(root: HTMLElement, gsap: typeof gsapType) {
  gsap.utils.toArray<SVGElement>('[data-draw]', root).forEach((svg) => {
    const paths = svg.querySelectorAll('path')
    const intro = svg.getAttribute('data-draw') === 'intro'
    gsap.fromTo(paths, { drawSVG: '0%' }, {
      drawSVG: '100%',
      duration: 1.2,
      ease: 'power2.inOut',
      delay: intro ? 0.6 : 0,
      ...(intro ? {} : { scrollTrigger: { trigger: svg, start: 'top 90%', once: true } }),
    })
  })
}

/**
 * Interactive collage: the hovered item grows while neighbours are pushed
 * aside, shrink with distance, drift vertically toward the row center and
 * take a random tilt.
 */
function interactiveCollage(box: HTMLElement, gsap: typeof gsapType) {
  const items = [...box.querySelectorAll<HTMLElement>('[data-collage-item]')]
  if (!items.length) return () => {}
  const FOCUS = 1.075
  const REST = 0.9
  const GAP = 1
  const PUSH = 0.5
  const tilt = new Map(items.map(item => [item, gsap.utils.random(-5, 5, 0.1)]))
  const inner = (item: HTMLElement) => item.querySelector<HTMLElement>('[data-collage-inner]') ?? item
  const falloff = (distance: number) => 1 / (1 + Math.pow(distance - 1, 1.2) * 0.45)
  const move = (item: HTMLElement, xPercent: number, yPercent: number, scale: number, rotation: number) => {
    gsap.to(inner(item), { xPercent, yPercent, scale, rotation, duration: 0.8, ease: 'move', overwrite: true })
  }
  const center = (el: Element) => {
    const rect = el.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height }
  }
  let focused: HTMLElement | null = null

  const reset = () => {
    focused = null
    items.forEach(item => move(item, 0, 0, 1, 0))
  }

  const focus = (target: HTMLElement) => {
    if (focused === target) return
    focused = target
    const area = center(box)
    const gap = (area.width * GAP) / 100
    const sorted = [...items].sort((a, b) => center(a).x - center(b).x)
    const index = sorted.indexOf(target)
    const t = center(target)
    const left = t.x - (t.width * FOCUS) / 2
    const right = t.x + (t.width * FOCUS) / 2
    let pushLeft = 0
    let pushRight = 0
    const prev = sorted[index - 1]
    const next = sorted[index + 1]
    if (prev) {
      const p = center(prev)
      pushLeft = Math.min(0, left - gap - (p.x + (p.width * REST) / 2)) * PUSH
    }
    if (next) {
      const n = center(next)
      pushRight = Math.max(0, right + gap - (n.x - (n.width * REST) / 2)) * PUSH
    }
    sorted.forEach((item, i) => {
      if (item === target) {
        move(item, 0, 0, FOCUS, 0)
        return
      }
      const c = center(item)
      const offset = i - index
      const weight = falloff(Math.abs(offset))
      const vertical = (area.y - c.y) / (area.height / 2)
      const shift = offset < 0 ? pushLeft * weight : pushRight * weight
      move(item, (shift / c.width) * 100, 15 * vertical * weight, REST - (1 - weight) * 0.12, (tilt.get(item) ?? 0) * weight)
    })
  }

  const onMove = (event: PointerEvent) => {
    if (focused) {
      const rect = inner(focused).getBoundingClientRect()
      if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) return
    }
    const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-collage-item]')
    if (hit && items.includes(hit)) focus(hit)
    else reset()
  }

  box.addEventListener('pointermove', onMove)
  box.addEventListener('pointerleave', reset)
  return () => {
    box.removeEventListener('pointermove', onMove)
    box.removeEventListener('pointerleave', reset)
    items.forEach(item => gsap.killTweensOf(inner(item)))
  }
}
