<script setup lang="ts">
import type { ProjectSummary } from '~/types/database.types'
import { categoryLabel } from '~/utils/project'

/**
 * Featured work as a 3D card stack. Desktop: the section pins and each scroll
 * step drops the front card away while the rest move forward. Mobile, reduced
 * motion and no-JS: a plain vertical list of the same cards.
 */
const props = defineProps<{ projects: ProjectSummary[] }>()

const root = ref<HTMLElement | null>(null)
const pin = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const badge = ref<HTMLElement | null>(null)

useSiteMotion(root, ({ gsap, ScrollTrigger, reduced, finePointer }) => {
  if (reduced || !pin.value || !stage.value) return
  const mm = gsap.matchMedia()

  mm.add('(min-width: 992px)', () => {
    const slides = gsap.utils.toArray<HTMLElement>('.stack__slide', stage.value!)
    if (slides.length < 2) return
    stage.value!.classList.add('is-stacked')
    const depth = 120
    const offset = 30

    slides.forEach((slide, i) => {
      gsap.set(slide, { z: -i * depth, y: -i * offset, zIndex: slides.length - i })
    })

    const tl = gsap.timeline({ paused: true })
    slides.forEach((slide, i) => {
      if (i === slides.length - 1) return
      tl.to(slide, { y: `+=${window.innerHeight * 0.9}`, rotation: i % 2 ? 6 : -6, ease: 'power2.in', duration: 1 }, i)
      tl.to(slide, { autoAlpha: 0, ease: 'none', duration: 0.25 }, i + 0.7)
      slides.slice(i + 1).forEach((next, j) => {
        tl.to(next, { z: -j * depth, y: -j * offset, ease: 'none', duration: 1 }, i)
      })
    })
    if (badge.value) tl.fromTo(badge.value, { rotation: 0 }, { rotation: 300, ease: 'none', duration: slides.length - 1 }, 0)

    const trigger = ScrollTrigger.create({
      trigger: root.value,
      start: 'top top',
      end: () => `+=${window.innerHeight * 0.85 * (slides.length - 1)}`,
      pin: pin.value,
      scrub: 0.3,
      invalidateOnRefresh: true,
      onUpdate: self => tl.progress(self.progress),
    })

    let onMove: ((event: MouseEvent) => void) | null = null
    let onLeave: (() => void) | null = null
    if (finePointer) {
      const tiltX = gsap.quickTo(stage.value!, 'rotationX', { duration: 0.6, ease: 'power3' })
      const tiltY = gsap.quickTo(stage.value!, 'rotationY', { duration: 0.6, ease: 'power3' })
      onMove = (event) => {
        const rect = pin.value!.getBoundingClientRect()
        tiltX(-((event.clientY - rect.top) / rect.height - 0.5) * 6)
        tiltY(((event.clientX - rect.left) / rect.width - 0.5) * 10)
      }
      onLeave = () => {
        tiltX(0)
        tiltY(0)
      }
      pin.value!.addEventListener('mousemove', onMove)
      pin.value!.addEventListener('mouseleave', onLeave)
    }

    return () => {
      trigger.kill()
      tl.kill()
      if (onMove) pin.value?.removeEventListener('mousemove', onMove)
      if (onLeave) pin.value?.removeEventListener('mouseleave', onLeave)
      stage.value?.classList.remove('is-stacked')
    }
  })

  return () => mm.revert()
}, { declarative: false })
</script>

<template>
  <section id="work" ref="root" class="featured theme-dark" data-nav-theme="dark" aria-labelledby="featured-title">
    <div ref="pin" class="featured__pin wrap">
      <header class="featured__head">
        <p class="kicker" data-scroll-reveal>
          Karya yang bisa dilihat, dicoba, dan ditelusuri.
        </p>
        <h2 id="featured-title" class="title-xl" data-scroll-reveal>
          Karya <span class="alt">terpilih</span>
        </h2>
      </header>

      <div class="featured__stage">
        <ol ref="stage" class="stack">
          <li v-for="(project, index) in props.projects" :key="project.id" class="stack__slide">
            <NuxtLink
              :to="`/project/${project.slug}`"
              :class="['stack__card', 'frame', `frame--${frameColor(index)}`]"
              data-cursor="Lihat case →"
            >
              <img
                :src="project.thumbnail_url"
                :alt="`Tampilan ${project.title}`"
                :loading="index < 2 ? 'eager' : 'lazy'"
                decoding="async"
              >
              <div class="stack__meta">
                <span class="stack__index label">{{ String(index + 1).padStart(2, '0') }} / {{ String(props.projects.length).padStart(2, '0') }}</span>
                <h3 class="title-l stack__title">{{ project.title }}</h3>
                <span class="stack__cat kicker">{{ categoryLabel(project.category) }}</span>
              </div>
            </NuxtLink>
          </li>
        </ol>
      </div>

      <div class="featured__foot">
        <SiteButton label="Lihat semua karya" to="/karya" variant="pink" />
      </div>

      <div ref="badge" class="featured__badge">
        <SiteSpinBadge />
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured {
  overflow: hidden;
}

.featured__pin {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(2.5 * var(--u));
  padding-block: calc(7 * var(--u)) calc(4 * var(--u));
}

@media (min-width: 992px) {
  .featured__pin {
    min-height: 100svh;
    justify-content: center;
    padding-block: calc(6 * var(--u)) calc(3 * var(--u));
  }
}

.featured__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(0.75 * var(--u));
  text-align: center;
}

.featured__head .kicker {
  max-width: 24ch;
}

.featured__stage {
  width: 100%;
  perspective: 1400px;
}

.stack {
  display: grid;
  gap: calc(2 * var(--u));
  width: min(100%, calc(46 * var(--u)));
  margin: 0 auto;
  transform-style: preserve-3d;
}

.stack.is-stacked {
  display: block;
  position: relative;
  aspect-ratio: 16 / 10;
  margin-top: calc(3 * var(--u));
}

.stack.is-stacked .stack__slide {
  position: absolute;
  inset: 0;
}

.stack.is-stacked .stack__card img {
  height: 100%;
}

.stack__card {
  position: relative;
  display: block;
  height: 100%;
  overflow: hidden;
  color: var(--c-white);
}

.stack__card img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top center;
  background: var(--c-ink);
}

.stack__meta {
  position: absolute;
  inset: auto calc(0.9 * var(--u)) calc(0.9 * var(--u));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(0.4 * var(--u));
  padding: calc(5 * var(--u)) calc(1.25 * var(--u)) calc(1.25 * var(--u));
  background: linear-gradient(to top, rgba(11, 16, 32, 0.95) 35%, rgba(11, 16, 32, 0));
}

.stack__title {
  max-width: 14ch;
  font-size: var(--fs-m);
}

.stack__index {
  opacity: 0.8;
}

.stack__cat {
  color: var(--c-paper);
}

.featured__foot {
  position: relative;
  z-index: 2;
}

.featured__badge {
  position: absolute;
  right: var(--gutter);
  bottom: calc(3 * var(--u));
}

@media (max-width: 767px) {
  .featured__badge {
    display: none;
  }

  .stack__meta {
    position: static;
    padding: calc(0.75 * var(--u)) 0 0;
    background: none;
    color: var(--frame-fg);
  }

  .stack__cat {
    color: inherit;
  }
}
</style>
