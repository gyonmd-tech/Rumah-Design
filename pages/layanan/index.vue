<script setup lang="ts">
import { responsiveImage } from '~/utils/image'
import { SERVICES, SERVICE_SHORT_NAMES } from '~/utils/portfolio-content'

usePortfolioPageSeo({
  title: 'Layanan UI/UX Design & Web Development',
  description: 'Jelajahi layanan Hygione Darriyan: UI/UX dan desain visual, frontend, serta fullstack development. Pilih dukungan sesuai tahap dan kebutuhan produk Anda.',
  path: '/layanan',
})

const { data: projects } = await usePublishedProjects()
const recent = computed(() => projects.value.slice(0, 3))
const PANEL_COLORS = ['signal', 'pink', 'cyan'] as const

const services = computed(() => SERVICES.map((service, index) => ({
  ...service,
  shortName: SERVICE_SHORT_NAMES[service.slug] ?? service.name,
  color: PANEL_COLORS[index % PANEL_COLORS.length],
  related: projects.value.filter(project => (service.projectSlugs as readonly string[]).includes(project.slug)).slice(0, 2),
})))

const stickers = [
  { text: 'Desain × Kode', cls: 'sticker--pink', x: '10%', y: '24%', r: '-12deg' },
  { text: 'Bisa dicoba!', cls: 'sticker--cyan', x: '76%', y: '20%', r: '8deg' },
  { text: 'Figma → Browser', cls: '', x: '7%', y: '70%', r: '6deg' },
  { text: 'Pixel & logic', cls: 'sticker--violet', x: '78%', y: '66%', r: '-6deg' },
  { text: 'SSR + SEO', cls: 'sticker--paper', x: '58%', y: '84%', r: '10deg' },
]

const root = ref<HTMLElement | null>(null)
useSiteMotion(root, ({ gsap, reduced, finePointer }) => {
  if (reduced) return
  const items = gsap.utils.toArray<HTMLElement>('.orbit__item', root.value!)
  gsap.from(items, { scale: 0, rotation: -40, duration: 1, ease: 'back.out(1.7)', stagger: 0.08, delay: 0.5 })
  items.forEach((item, index) => {
    gsap.to(item, { y: (index % 2 ? 1 : -1) * 18, duration: 3 + index * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  })

  const hero = root.value!.querySelector<HTMLElement>('.services-hero')
  if (!finePointer || !hero) return
  const movers = items.map((item, index) => ({
    x: gsap.quickTo(item, 'xPercent', { duration: 1.2, ease: 'power3' }),
    y: gsap.quickTo(item, 'yPercent', { duration: 1.2, ease: 'power3' }),
    depth: 30 + (index % 3) * 25,
  }))
  const onMove = (event: PointerEvent) => {
    const nx = event.clientX / window.innerWidth - 0.5
    const ny = event.clientY / window.innerHeight - 0.5
    movers.forEach(({ x, y, depth }) => {
      x(-nx * depth)
      y(-ny * depth)
    })
  }
  hero.addEventListener('pointermove', onMove)
  return () => hero.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <main id="main" ref="root">
    <header class="services-hero">
      <div class="orbit" aria-hidden="true">
        <span
          v-for="sticker in stickers"
          :key="sticker.text"
          class="orbit__item"
          :style="{ left: sticker.x, top: sticker.y }"
        >
          <span :class="['sticker', sticker.cls]" :style="{ '--sticker-rotate': sticker.r }">{{ sticker.text }}</span>
        </span>
      </div>
      <div class="services-hero__inner wrap">
        <p class="kicker" data-reveal>
          Layanan / Desain & Development
        </p>
        <h1 class="title-xxl services-hero__title" data-reveal="chars">
          Desain yang terarah. <span class="alt">Produk yang bisa digunakan.</span>
        </h1>
      </div>
    </header>

    <section class="manifesto section wrap" aria-label="Pengantar layanan">
      <p class="p-xl manifesto__lead" data-scroll-fade>
        Saya membantu menghubungkan kebutuhan pengguna, karakter visual, dan implementasi web. Mulai dari satu halaman hingga aplikasi berbasis data, kita memilih pendekatan sesuai masalah yang ingin diselesaikan.
      </p>
      <p class="label manifesto__label" data-scroll-reveal>
        Tiga cara saya dapat membantu
      </p>
    </section>

    <section
      v-for="(service, index) in services"
      :key="service.slug"
      class="service-step"
      :aria-labelledby="`service-${service.slug}`"
    >
      <div class="service-step__text">
        <p class="kicker" data-scroll-reveal>
          {{ service.short }}
        </p>
        <h2 :id="`service-${service.slug}`" class="title-xl" data-scroll-reveal>
          {{ service.shortName }}
        </h2>
        <p class="p-m" data-scroll-reveal>
          {{ service.intro }}
        </p>
        <ul class="service-step__list" data-scroll-group>
          <li v-for="item in service.deliverables" :key="item" data-scroll-reveal="el">
            {{ item }}
          </li>
        </ul>
        <SiteButton label="Lihat pendekatan & hasil kerja" :to="`/layanan/${service.slug}`" :variant="index === 1 ? 'pink' : index === 2 ? 'cyan' : 'signal'" />
      </div>
      <div :class="['service-step__panel', `panel--${service.color}`]">
        <span class="service-step__num" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        <NuxtLink
          v-for="(project, pIndex) in service.related"
          :key="project.id"
          :to="`/project/${project.slug}`"
          :class="['service-step__shot', `service-step__shot--${pIndex}`]"
          data-cursor="Lihat case →"
        >
          <img v-bind="responsiveImage(project.thumbnail_url, '(min-width: 992px) 34vw, 85vw')" :alt="`Contoh karya: ${project.title}`" loading="lazy" decoding="async">
          <span class="label">{{ project.title }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="start section wrap" aria-labelledby="start-title">
      <div>
        <h2 id="start-title" class="title-l" data-scroll-reveal>
          Mulai dari tahap <span class="alt">Anda sekarang.</span>
        </h2>
      </div>
      <div class="start__copy">
        <p class="p-m" data-scroll-reveal>
          Jika ide masih berupa catatan, kita bisa mulai dari struktur informasi dan prototype. Jika desain sudah tersedia, fokus dapat langsung diarahkan ke implementasi frontend. Jika produk membutuhkan akun pengguna, penyimpanan data, atau integrasi, kebutuhan tersebut dibahas dalam scope fullstack.
        </p>
        <p class="p-m muted" data-scroll-reveal>
          Anda tidak perlu mengambil seluruh layanan sekaligus. Hasil kerja, batas revisi, kebutuhan konten, serta tanggung jawab deployment disepakati sebelum pengerjaan agar ekspektasinya jelas.
        </p>
        <SiteArrowLink label="Pelajari proses kerja dan serah terima" to="/proses" />
      </div>
    </section>

    <section class="think section" aria-labelledby="think-title">
      <div class="wrap think__head">
        <h2 id="think-title" class="title-xl" data-scroll-reveal>
          Lihat cara berpikirnya <span class="alt">lewat karya.</span>
        </h2>
        <div class="think__side">
          <p class="p-m muted" data-scroll-reveal>
            Portofolio ini memuat eksplorasi desain, implementasi antarmuka, dan aplikasi yang dapat dicoba melalui live demo. Gunakan case study untuk menilai kecocokan pendekatan saya dengan kebutuhan Anda.
          </p>
          <SiteArrowLink label="Jelajahi project terpilih" to="/karya" />
        </div>
      </div>
      <ul class="wrap think__grid">
        <li v-for="(project, index) in recent" :key="project.id" data-scroll-reveal="el">
          <SiteWorkCard :project="project" :ratio="index === 1 ? '4 / 5' : '16 / 11'" />
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.services-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  overflow: hidden;
}

.orbit {
  position: absolute;
  inset: 0;
}

.orbit__item {
  position: absolute;
  display: block;
}

.orbit__item .sticker {
  font-size: var(--fs-p-l);
}

.services-hero__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(1.25 * var(--u));
  text-align: center;
}

.services-hero__title {
  max-width: 11ch;
  font-size: var(--fs-xl);
}

.services-hero__title .alt {
  display: block;
  margin-top: 0.08em;
  line-height: 0.9;
}

.manifesto {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(2 * var(--u));
  text-align: center;
}

.manifesto__lead {
  max-width: 30ch;
}

.service-step {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100svh;
}

.service-step__text {
  position: sticky;
  top: 0;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: calc(1.25 * var(--u));
  min-height: 100svh;
  padding: calc(6 * var(--u)) var(--gutter) calc(4 * var(--u));
}

.service-step__text .p-m {
  max-width: 40ch;
}

.service-step__list {
  display: grid;
  gap: calc(0.4 * var(--u));
  margin-block: calc(0.5 * var(--u));
}

.service-step__list li {
  display: flex;
  align-items: baseline;
  gap: calc(0.6 * var(--u));
  font-family: var(--font-serif);
  font-size: var(--fs-p-l);
  line-height: 1.1;
}

.service-step__list li::before {
  content: '';
  flex: none;
  width: calc(0.5 * var(--u));
  height: calc(0.5 * var(--u));
  background: var(--c-signal);
  rotate: 45deg;
  translate: 0 -0.15em;
}

.service-step__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(3 * var(--u));
  min-height: 100svh;
  padding: calc(7 * var(--u)) calc(3 * var(--u));
  overflow: hidden;
  background: var(--panel);
}

.panel--signal { --panel: var(--c-signal); }
.panel--pink { --panel: var(--c-pink); }
.panel--cyan { --panel: var(--c-cyan); }

.service-step__num {
  position: absolute;
  top: calc(5 * var(--u));
  left: calc(2 * var(--u));
  font-family: var(--font-serif);
  font-size: calc(14 * var(--u));
  line-height: 0.75;
  color: var(--c-ink);
  opacity: 0.18;
}

.service-step__shot {
  position: relative;
  display: block;
  width: min(100%, calc(30 * var(--u)));
  padding: calc(0.6 * var(--u)) calc(0.6 * var(--u)) calc(0.5 * var(--u));
  background: var(--c-paper);
  rotate: -3deg;
  box-shadow: 0 calc(1 * var(--u)) calc(3 * var(--u)) rgba(11, 16, 32, 0.25);
  transition: rotate 0.6s var(--ease-site), scale 0.6s var(--ease-site);
}

.service-step__shot--1 {
  align-self: flex-end;
  width: min(85%, calc(24 * var(--u)));
  rotate: 4deg;
  margin-top: calc(-5 * var(--u));
}

.service-step__shot:hover {
  rotate: 0deg;
  scale: 1.03;
}

.service-step__shot img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top center;
}

.service-step__shot .label {
  display: block;
  padding-top: calc(0.4 * var(--u));
}

.start {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: calc(3 * var(--u)) var(--gutter);
}

.start__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(1.25 * var(--u));
  max-width: 48ch;
}

.think {
  border-top: 1px solid var(--c-line);
}

.think__head {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: end;
  gap: calc(2 * var(--u)) var(--gutter);
  margin-bottom: calc(4 * var(--u));
}

.think__head .title-xl {
  max-width: 12ch;
}

.think__side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(1.5 * var(--u));
  max-width: 44ch;
}

.think__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gutter);
  align-items: start;
}

.think__grid > li:nth-child(2) {
  margin-top: calc(6 * var(--u));
}

@media (max-width: 991px) {
  .service-step,
  .start,
  .think__head,
  .think__grid {
    grid-template-columns: 1fr;
  }

  .think__grid > li:nth-child(2) {
    margin-top: 0;
  }

  .service-step__text {
    position: relative;
    min-height: 0;
    padding-top: calc(5 * var(--u));
  }

  .service-step__panel {
    min-height: 70svh;
  }
}

@media (max-width: 767px) {
  .orbit__item .sticker {
    font-size: var(--fs-p-s);
  }

  .services-hero__title {
    font-size: var(--fs-xl);
  }
}
</style>
