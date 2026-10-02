<script setup lang="ts">
import { ABOUT_CAPABILITIES, ABOUT_TENETS, ABOUT_TIMELINE } from '~/utils/about-content'

usePortfolioPageSeo({
  title: 'Profil Hygione Heparre Paro Arro Darriyan',
  description: 'Profil Hygione Heparre Paro Arro Darriyan, dikenal sebagai Hygione Darriyan: IT support, UI/UX designer, frontend dan fullstack developer asal Citayam, Kota Depok.',
  path: '/about',
})

const { data: projects } = await usePublishedProjects()
const trailImages = computed(() => projects.value.map(project => project.thumbnail_url).filter(Boolean))
const openCapability = ref(0)

const root = ref<HTMLElement | null>(null)
useSiteMotion(root, ({ gsap, ScrollTrigger, reduced }) => {
  if (reduced) return
  const photo = root.value!.querySelector('.about-photo')
  if (photo) {
    gsap.to(photo, {
      yPercent: -12,
      rotation: 4,
      ease: 'none',
      scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  }
  gsap.utils.toArray<HTMLElement>('.tenet', root.value!).forEach((card, index) => {
    gsap.from(card, {
      y: 120,
      rotation: index % 2 ? 6 : -6,
      ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 55%', scrub: 0.6 },
    })
  })
  ScrollTrigger.refresh()
})
</script>

<template>
  <main id="main" ref="root">
    <header class="about-hero">
      <SiteImageTrail :images="trailImages" />
      <div class="about-hero__inner wrap">
        <p class="kicker" data-reveal>
          IT Support · UI/UX Design · Frontend · Fullstack
        </p>
        <h1 class="title-xl about-hero__title" data-reveal="chars">
          Hygione Heparre Paro Arro <span class="alt">Darriyan.</span>
        </h1>
        <div class="about-hero__intro">
          <p class="p-l" data-reveal>
            Saya Hygione Heparre Paro Arro Darriyan, dan biasa memperkenalkan diri sebagai Hygione Darriyan. Saya bekerja di bidang IT support sekaligus mengembangkan keahlian sebagai UI/UX designer, frontend, dan fullstack developer.
          </p>
          <p class="p-m muted" data-reveal>
            Saya adalah lulusan SMK yang terus belajar secara mandiri setelah menyelesaikan pendidikan. Portofolio ini mencakup eksperimen desain dan pengembangan aplikasi, termasuk ArroBuild dan HyBloggyon, sekaligus mencatat cara saya menghubungkan kebutuhan pengguna, tampilan visual, dan sistem di belakangnya.
          </p>
        </div>
        <div class="about-hero__links" data-reveal="el">
          <SiteArrowLink label="Layanan desain & development" to="/layanan" />
          <SiteArrowLink label="Proses kerja & kolaborasi" to="/proses" />
        </div>
      </div>
    </header>

    <!-- Profil & perjalanan -->
    <section class="journey section wrap" aria-labelledby="journey-title">
      <div class="journey__media">
        <figure class="about-photo">
          <img src="/images/hero-profile-960.webp" srcset="/images/hero-profile-640.webp 640w, /images/hero-profile-960.webp 960w, /images/hero-profile.webp 1254w" sizes="(min-width: 992px) 36vw, 80vw" alt="Potret Hygione Heparre Paro Arro Darriyan" width="1254" height="1254" loading="lazy" decoding="async">
        </figure>
        <span class="sticker sticker--cyan journey__sticker" style="--sticker-rotate: -8deg" aria-hidden="true">Citayam, Depok</span>
      </div>
      <div class="journey__text">
        <p class="kicker" data-scroll-reveal>
          Profil & perjalanan
        </p>
        <h2 id="journey-title" class="title-l" data-scroll-reveal>
          Teknologi, desain, <span class="alt">dan rasa ingin tahu.</span>
        </h2>
        <p class="p-m muted" data-scroll-reveal>
          Berbasis di Citayam, Kota Depok, Jawa Barat, Indonesia. Terbuka untuk percakapan tentang dukungan teknologi, desain produk, pengembangan web, dan eksplorasi AI.
        </p>
        <ol class="timeline" data-scroll-group>
          <li v-for="(item, index) in ABOUT_TIMELINE" :key="item.label" class="timeline__item" data-scroll-reveal="el">
            <span class="timeline__num">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <h3 class="title-xs">
                {{ item.label }}
              </h3>
              <p class="p">
                {{ item.text }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Prinsip -->
    <section class="tenets section theme-dark" data-nav-theme="dark" aria-labelledby="tenets-title">
      <div class="wrap tenets__head">
        <p class="kicker" data-scroll-reveal>
          Tiga pilar dalam membangun setiap produk
        </p>
        <h2 id="tenets-title" class="title-xl" data-scroll-reveal>
          Prinsip <span class="alt">kerja</span>
        </h2>
      </div>
      <ul class="wrap tenets__list">
        <li
          v-for="(tenet, index) in ABOUT_TENETS"
          :key="tenet.title"
          :class="['tenet', 'frame', `frame--${(['signal', 'pink', 'cyan'] as const)[index]}`]"
        >
          <span class="label">Prinsip {{ index + 1 }}</span>
          <h3 class="title-s">
            {{ tenet.title }}
          </h3>
          <p class="p-m">
            {{ tenet.text }}
          </p>
        </li>
      </ul>
    </section>

    <!-- Kapabilitas -->
    <section class="caps section wrap" aria-labelledby="caps-title">
      <div class="caps__head">
        <p class="kicker" data-scroll-reveal>
          Spesialisasi rekayasa antarmuka web
        </p>
        <h2 id="caps-title" class="title-xl" data-scroll-reveal>
          Apa yang saya <span class="alt">rancang & bangun</span>
        </h2>
      </div>
      <ol class="caps__list">
        <li v-for="(cap, index) in ABOUT_CAPABILITIES" :key="cap.title" class="cap" :data-open="openCapability === index || undefined">
          <h3>
            <button
              type="button"
              class="cap__toggle"
              :aria-expanded="openCapability === index"
              :aria-controls="`cap-${index}`"
              @click="openCapability = openCapability === index ? -1 : index"
            >
              <span class="cap__num">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="cap__title">{{ cap.title }}</span>
              <span class="cap__icon" aria-hidden="true" />
            </button>
          </h3>
          <div :id="`cap-${index}`" class="cap__body" :hidden="openCapability !== index">
            <p class="p-m">
              {{ cap.text }}
            </p>
            <ul class="cap__skills">
              <li v-for="skill in cap.skills" :key="skill">
                {{ skill }}
              </li>
            </ul>
          </div>
        </li>
      </ol>
    </section>

    <!-- Catatan personal -->
    <section class="quote section" aria-label="Catatan personal">
      <figure class="wrap quote__inner">
        <blockquote class="p-xl" data-scroll-reveal>
          “Saya tertarik pada teknologi dari banyak sisi: membantu operasional sebagai IT support, merancang antarmuka, menulis kode, dan mengeksplorasi integrasi AI. Di luar pekerjaan, saya menikmati menulis, membaca, dan mendengarkan musik, termasuk karya-karya NMIXX.”
        </blockquote>
        <figcaption class="label">
          — Hygione Heparre Paro Arro Darriyan · Citayam, Kota Depok, Indonesia
        </figcaption>
      </figure>
    </section>
  </main>
</template>

<style scoped>
.about-hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
}

.about-hero__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(1.5 * var(--u));
  padding-block: calc(9 * var(--u)) calc(5 * var(--u));
  text-align: center;
  pointer-events: none;
}

.about-hero__inner > * {
  pointer-events: auto;
}

.about-hero__title {
  max-width: 13ch;
}

.about-hero__title .alt {
  color: var(--c-signal);
}

.about-hero__intro {
  display: grid;
  gap: var(--u);
  max-width: calc(44 * var(--u));
}

.about-hero__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: calc(1.5 * var(--u)) calc(2.5 * var(--u));
}

.journey {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: calc(3 * var(--u)) calc(2 * var(--gutter));
  align-items: start;
}

.journey__media {
  position: sticky;
  top: calc(7 * var(--u));
}

.about-photo {
  margin: 0;
  padding: calc(0.8 * var(--u)) calc(0.8 * var(--u)) calc(3 * var(--u));
  background: var(--c-white);
  rotate: -3deg;
  box-shadow: 0 calc(0.75 * var(--u)) calc(2.5 * var(--u)) rgba(11, 16, 32, 0.15);
}

.about-photo img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  filter: grayscale(1);
}

.journey__sticker {
  position: absolute;
  right: -4%;
  bottom: 12%;
}

.journey__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: calc(1.25 * var(--u));
}

.timeline {
  width: 100%;
  margin-top: var(--u);
  border-top: 1px solid var(--c-line);
}

.timeline__item {
  display: grid;
  grid-template-columns: calc(4 * var(--u)) 1fr;
  gap: var(--gutter);
  padding-block: calc(1.5 * var(--u));
  border-bottom: 1px solid var(--c-line);
}

.timeline__item h3 {
  margin-bottom: calc(0.5 * var(--u));
}

.timeline__num {
  font-family: var(--font-serif);
  font-size: var(--fs-s);
  line-height: 0.85;
  color: var(--c-signal);
}

.tenets__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--u);
  margin-bottom: calc(4 * var(--u));
  text-align: center;
}

.tenets__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: calc(2 * var(--u));
  align-items: start;
}

.tenet {
  display: flex;
  flex-direction: column;
  gap: var(--u);
  min-height: calc(26 * var(--u));
  padding: calc(1.75 * var(--u));
  color: var(--frame-fg);
  rotate: -2deg;
}

.tenet:nth-child(2) {
  rotate: 2deg;
  margin-top: calc(4 * var(--u));
}

.tenet:nth-child(3) {
  rotate: -1deg;
  margin-top: calc(1.5 * var(--u));
}

.tenet p {
  margin-top: auto;
}

.caps {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: calc(3 * var(--u)) var(--gutter);
  align-items: start;
}

.caps__head {
  position: sticky;
  top: calc(7 * var(--u));
  display: flex;
  flex-direction: column;
  gap: var(--u);
}

.caps__list {
  border-top: 2px solid var(--c-ink);
}

.cap {
  border-bottom: 2px solid var(--c-ink);
}

.cap__toggle {
  display: grid;
  grid-template-columns: calc(3.5 * var(--u)) 1fr auto;
  align-items: center;
  gap: var(--u);
  width: 100%;
  padding-block: calc(1.25 * var(--u));
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: padding 0.5s var(--ease-site), color 0.3s ease;
}

.cap__toggle:hover {
  padding-left: calc(0.75 * var(--u));
  color: var(--c-signal);
}

.cap__num {
  font-family: var(--font-serif);
  font-size: var(--fs-xs);
  line-height: 1;
}

.cap__title {
  font-size: var(--fs-xs);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 0.95;
  text-transform: uppercase;
}

.cap__icon {
  position: relative;
  width: calc(1.75 * var(--u));
  height: calc(1.75 * var(--u));
  background: var(--c-ink);
  transition: rotate 0.5s var(--ease-site), background-color 0.3s ease;
}

.cap__icon::before,
.cap__icon::after {
  content: '';
  position: absolute;
  inset: 50% 25% auto;
  height: 2px;
  margin-top: -1px;
  background: var(--c-paper);
}

.cap__icon::after {
  rotate: 90deg;
}

.cap[data-open] .cap__icon {
  rotate: 135deg;
  background: var(--c-signal);
}

.cap__body {
  display: grid;
  gap: var(--u);
  padding: 0 0 calc(1.5 * var(--u)) calc(4.5 * var(--u));
}

.cap__skills {
  display: flex;
  flex-wrap: wrap;
  gap: calc(0.35 * var(--u));
}

.cap__skills li {
  padding: calc(0.3 * var(--u)) calc(0.6 * var(--u));
  border: 1.5px solid var(--c-ink);
  font-family: var(--font-serif);
  font-size: var(--fs-p-m);
  line-height: 1.1;
}

.quote {
  background: var(--c-amber);
}

.quote__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(2 * var(--u));
  margin: 0 auto;
  max-width: calc(64 * var(--u));
  text-align: center;
}

.quote blockquote {
  margin: 0;
}

@media (max-width: 991px) {
  .journey,
  .caps {
    grid-template-columns: 1fr;
  }

  .journey__media,
  .caps__head {
    position: relative;
    top: 0;
  }

  .journey__media {
    max-width: calc(26 * var(--u));
  }

  .tenets__list {
    grid-template-columns: 1fr;
    max-width: calc(30 * var(--u));
    margin-inline: auto;
  }

  .tenet,
  .tenet:nth-child(2),
  .tenet:nth-child(3) {
    min-height: 0;
    margin-top: 0;
  }
}

@media (max-width: 767px) {
  .cap__body {
    padding-left: 0;
  }

  .timeline__item {
    grid-template-columns: 1fr;
    gap: calc(0.5 * var(--u));
  }
}
</style>
