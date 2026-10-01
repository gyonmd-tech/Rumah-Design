<script setup lang="ts">
import { HOME_FAQS, WORK_STEPS } from '~/utils/portfolio-content'

usePortfolioPageSeo({
  title: 'Portofolio UI/UX Design & Fullstack Development',
  description: 'Portofolio Hygione Heparre Paro Arro Darriyan (Hygione Darriyan): UI/UX dan desain visual, frontend, serta fullstack development dengan case study dan live demo.',
  path: '/',
})

const { data: projects, error, refresh } = await usePublishedProjects()
const featured = computed(() => projects.value.slice(0, 5))
const heroImages = computed(() => projects.value.map(project => project.thumbnail_url).filter(Boolean).slice(0, 8))
const collageProject = computed(() => projects.value[0] ?? null)

const stack = ['Nuxt 3', 'Vue', 'TypeScript', 'Figma', 'Supabase', 'GSAP', 'React', 'Tailwind CSS', 'PostgreSQL', 'Vercel']

const root = ref<HTMLElement | null>(null)

useSiteMotion(root, ({ gsap, finePointer }) => {
  // Variable-weight letters: grotesk characters thin out near the pointer.
  const title = root.value!.querySelector<HTMLElement>('.hero__title')
  const hero = root.value!.querySelector<HTMLElement>('.hero')
  if (!finePointer || !title || !hero) return

  let setters: Array<{ el: HTMLElement, set: (value: number) => void }> = []
  const collect = () => {
    setters = [...title.querySelectorAll<HTMLElement>('.split-char')]
      .filter(el => !el.closest('.alt'))
      .map(el => ({ el, set: gsap.quickTo(el, '--wght', { duration: 0.5, ease: 'power3' }) }))
  }
  const onMove = (event: PointerEvent) => {
    if (!setters.length) collect()
    const radius = window.innerWidth * 0.22
    for (const { el, set } of setters) {
      const rect = el.getBoundingClientRect()
      const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2))
      set(250 + Math.min(distance / radius, 1) * 600)
    }
  }
  const onLeave = () => setters.forEach(({ set }) => set(850))
  hero.addEventListener('pointerenter', collect)
  hero.addEventListener('pointermove', onMove)
  hero.addEventListener('pointerleave', onLeave)
  return () => {
    hero.removeEventListener('pointerenter', collect)
    hero.removeEventListener('pointermove', onMove)
    hero.removeEventListener('pointerleave', onLeave)
  }
})
</script>

<template>
  <main id="main" ref="root">
    <!-- Hero -->
    <header class="hero" data-nav-theme="light">
      <SiteHeroCursorCard :images="heroImages" />

      <div class="hero__content wrap">
        <p class="kicker hero__eyebrow" data-reveal>
          IT Support · UI/UX Design · Frontend · Fullstack
        </p>
        <h1 class="title-xxl hero__title" data-reveal="chars" data-reveal-delay="0.1">
          <span class="hero__line">Hygione</span>
          <span class="hero__line alt">Darriyan.</span>
        </h1>
        <div class="hero__links" data-reveal="el" data-reveal-delay="0.6" data-cursor-block>
          <SiteArrowLink label="Jelajahi karya" to="#work" direction="down" />
          <SiteArrowLink label="Tentang saya" to="/about" />
        </div>
      </div>


      <SiteMarquee class="hero__marquee" :items="stack" />
    </header>

    <!-- Intro -->
    <section class="intro section wrap" aria-labelledby="intro-title">
      <div class="intro__collage" aria-hidden="true" data-collage>
        <figure class="polaroid polaroid--a" data-collage-item>
          <img src="/images/hero-profile.webp" alt="" width="1254" height="1254" loading="lazy" decoding="async">
        </figure>
        <figure v-if="collageProject" class="polaroid polaroid--b" data-collage-item>
          <img :src="collageProject.thumbnail_url" alt="" loading="lazy" decoding="async">
        </figure>
        <span class="sticker sticker--violet intro__sticker" style="--sticker-rotate: 9deg">Pixel & logic</span>
      </div>

      <div class="intro__text">
        <p class="kicker" data-scroll-reveal>
          Cara saya bekerja
        </p>
        <h2 id="intro-title" class="title-l" data-scroll-reveal>
          Penasaran pada masalahnya. <span class="alt">Teliti pada detailnya.</span>
        </h2>
        <p class="p-m intro__copy" data-scroll-reveal>
          Saya melihat desain dan kode sebagai bagian dari percakapan yang sama. Antarmuka perlu punya karakter, tetapi juga perlu membantu orang memahami apa yang bisa dilakukan.
        </p>
        <SiteButton label="Kenali Hygione Darriyan" to="/about" />
      </div>
    </section>

    <!-- Featured work -->
    <SiteFeaturedStack v-if="featured.length" :projects="featured" />
    <section v-else id="work" class="section theme-dark state" data-nav-theme="dark">
      <div class="wrap state__inner">
        <template v-if="error">
          <h2 class="title-m">
            Katalog sedang sulit dimuat.
          </h2>
          <p class="p-m muted">
            Silakan coba lagi. Karya yang sudah dipublikasikan tetap aman.
          </p>
          <SiteButton label="Muat ulang" variant="pink" @click="refresh()" />
        </template>
        <template v-else>
          <h2 class="title-m">
            Belum ada project yang dipublikasikan.
          </h2>
          <p class="p-m muted">
            Project baru akan muncul di sini segera setelah dirilis.
          </p>
        </template>
      </div>
    </section>

    <!-- Services -->
    <section class="services-section section" aria-labelledby="services-title">
      <div class="wrap section-head">
        <p class="kicker" data-scroll-reveal>
          Desain bertemu implementasi
        </p>
        <h2 id="services-title" class="title-xl" data-scroll-reveal>
          Satu tujuan, <span class="alt">beberapa cara</span>
        </h2>
        <p class="p-m section-head__copy" data-scroll-reveal>
          Saya membantu membentuk pengalaman digital dari sisi visual dan teknis. Anda bisa datang dengan ide, desain yang siap dibangun, atau produk yang ingin dikembangkan lebih jauh.
        </p>
      </div>
      <div class="wrap">
        <SiteServiceCards :projects="projects" />
      </div>
      <div class="section-foot">
        <SiteArrowLink label="Lihat semua layanan" to="/layanan" />
      </div>
    </section>

    <!-- Process -->
    <section class="process section theme-dark" data-nav-theme="dark" aria-labelledby="process-title">
      <div class="wrap process__grid">
        <div class="process__head">
          <p class="kicker" data-scroll-reveal>
            Proses
          </p>
          <h2 id="process-title" class="title-l" data-scroll-reveal>
            Bagaimana kolaborasinya <span class="alt">berjalan</span>
          </h2>
          <SiteArrowLink label="Lihat alur lengkap hingga serah terima" to="/proses" />
        </div>
        <ol class="process__list" data-scroll-group>
          <li v-for="(step, index) in WORK_STEPS.slice(0, 3)" :key="step.title" class="process__step" data-scroll-reveal="el">
            <span class="process__num">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <h3 class="title-s">
                {{ step.title }}
              </h3>
              <p class="p-m muted">
                {{ step.detail }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section section wrap" aria-labelledby="faq-title">
      <div class="faq-section__head">
        <h2 id="faq-title" class="title-xl" data-scroll-reveal>
          Sebelum <span class="alt">kita mulai.</span>
        </h2>
        <p class="p-m muted" data-scroll-reveal>
          Beberapa hal yang sering ingin diketahui sebelum membicarakan sebuah project.
        </p>
        <SiteArrowLink label="Ceritakan kebutuhan Anda" to="/contact" />
      </div>
      <SiteFaqList :items="HOME_FAQS" />
    </section>
  </main>
</template>

<style scoped>
/* Hero */
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  overflow: hidden;
}

.hero__content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(1.5 * var(--u));
  padding-top: calc(7 * var(--u));
  text-align: center;
  pointer-events: none;
}

.hero__content > * {
  pointer-events: auto;
}

.hero__eyebrow {
  font-size: var(--fs-p-l);
}

.hero__title {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(var(--fs-xxl) * 1.12);
}

.hero__title :deep(.split-char) {
  --wght: 850;
}

.hero__title > .hero__line:first-child,
.hero__title > .hero__line:first-child :deep(.split-char) {
  font-variation-settings: 'wght' var(--wght, 850);
}

.hero__line.alt {
  font-size: 1.12em;
  line-height: 0.84;
}


.hero__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: calc(1.5 * var(--u)) calc(2.5 * var(--u));
  margin-top: calc(0.5 * var(--u));
}

.hero__marquee {
  padding-block: calc(2.5 * var(--u)) calc(2 * var(--u));
}

/* Intro */
.intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: calc(3 * var(--u)) var(--gutter);
}

.intro__collage {
  position: relative;
  height: calc(34 * var(--u));
}

.polaroid {
  position: absolute;
  margin: 0;
  padding: calc(0.75 * var(--u)) calc(0.75 * var(--u)) calc(2.5 * var(--u));
  background: var(--c-white);
  box-shadow: 0 calc(0.5 * var(--u)) calc(2 * var(--u)) rgba(11, 16, 32, 0.14);
}

.polaroid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.polaroid--a {
  top: 0;
  left: 6%;
  width: 52%;
  aspect-ratio: 4 / 5;
  rotate: -5deg;
}

.polaroid--a img {
  filter: grayscale(1) contrast(1.05);
}

.polaroid--b {
  right: 4%;
  bottom: 0;
  width: 54%;
  aspect-ratio: 5 / 4;
  rotate: 4deg;
}

.polaroid--b img {
  object-position: top center;
}

.intro__sticker {
  position: absolute;
  top: 38%;
  left: 44%;
  z-index: 2;
}

.intro__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(1.25 * var(--u));
  text-align: center;
}

.intro__copy {
  max-width: 36ch;
}

/* Section heads */
.section-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(1 * var(--u));
  margin-bottom: calc(4 * var(--u));
  text-align: center;
}

.section-head__copy {
  max-width: 46ch;
}

.section-foot {
  display: flex;
  justify-content: center;
  margin-top: calc(4 * var(--u));
}

/* Process */
.process__grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: calc(3 * var(--u)) var(--gutter);
}

.process__head {
  position: sticky;
  top: calc(7 * var(--u));
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(1.25 * var(--u));
}

.process__head :deep(.arrow-link) {
  color: var(--c-paper);
}

.process__list {
  border-top: 1px solid var(--c-line);
}

.process__step {
  display: grid;
  grid-template-columns: calc(5 * var(--u)) 1fr;
  gap: var(--gutter);
  padding-block: calc(2 * var(--u));
  border-bottom: 1px solid var(--c-line);
}

.process__step h3 {
  margin-bottom: calc(0.75 * var(--u));
}

.process__num {
  font-family: var(--font-serif);
  font-size: var(--fs-m);
  line-height: 0.8;
  color: var(--c-cyan);
}

/* FAQ */
.faq-section {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: calc(3 * var(--u)) var(--gutter);
}

.faq-section__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(1.25 * var(--u));
}

/* Empty / error */
.state__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--u);
  text-align: center;
}

@media (max-width: 991px) {
  .intro,
  .process__grid,
  .faq-section {
    grid-template-columns: 1fr;
  }

  .process__head {
    position: static;
  }

}

@media (max-width: 767px) {
  .intro__collage {
    height: calc(24 * var(--u));
  }


  .process__step {
    grid-template-columns: 1fr;
    gap: calc(0.75 * var(--u));
  }
}

</style>
