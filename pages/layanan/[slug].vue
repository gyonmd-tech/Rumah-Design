<script setup lang="ts">
import { SERVICES, SERVICE_SHORT_NAMES } from '~/utils/portfolio-content'

const route = useRoute()
const service = SERVICES.find(item => item.slug === route.params.slug)

if (!service) {
  throw createError({ statusCode: 404, statusMessage: 'Layanan tidak ditemukan', fatal: true })
}

const serviceIndex = SERVICES.indexOf(service)
const color = (['signal', 'pink', 'cyan'] as const)[serviceIndex % 3]
const otherServices = SERVICES.filter(item => item.slug !== service.slug)

usePortfolioPageSeo({
  title: service.name,
  description: service.description,
  path: `/layanan/${service.slug}`,
  service: service.name,
})

const { data: projects } = await usePublishedProjects()
const related = computed(() => projects.value.filter(project => (service.projectSlugs as readonly string[]).includes(project.slug)))

const root = ref<HTMLElement | null>(null)
useSiteMotion(root)
</script>

<template>
  <main v-if="service" id="main" ref="root">
    <header :class="['svc-hero', `panel--${color}`]" :data-nav-theme="color === 'signal' ? 'dark' : 'light'">
      <div class="svc-hero__inner wrap">
        <p class="kicker" data-reveal>
          Layanan {{ String(serviceIndex + 1).padStart(2, '0') }} / {{ String(SERVICES.length).padStart(2, '0') }}
        </p>
        <h1 class="title-xxl svc-hero__title" data-reveal="chars">
          {{ SERVICE_SHORT_NAMES[service.slug] ?? service.name }}
        </h1>
        <p class="p-xl svc-hero__short" data-reveal>
          {{ service.short }}
        </p>
      </div>
    </header>

    <section class="svc-body section wrap" aria-labelledby="svc-title">
      <div class="svc-body__main">
        <h2 id="svc-title" class="title-m" data-scroll-reveal>
          {{ service.name }} <span class="alt">bersama Hygione Darriyan</span>
        </h2>
        <p class="p-l" data-scroll-reveal>
          {{ service.intro }}
        </p>
        <p v-for="paragraph in service.paragraphs" :key="paragraph" class="p-m muted" data-scroll-reveal>
          {{ paragraph }}
        </p>
      </div>
      <aside :class="['svc-aside', 'frame', `frame--${color}`]" aria-labelledby="svc-deliverables">
        <h2 id="svc-deliverables" class="title-xs">
          Hasil kerja yang dapat dibahas
        </h2>
        <ul class="svc-aside__list">
          <li v-for="item in service.deliverables" :key="item">
            {{ item }}
          </li>
        </ul>
        <p class="p-s">
          Deliverable akhir mengikuti scope yang disepakati bersama.
        </p>
      </aside>
    </section>

    <section class="svc-cols section theme-dark" data-nav-theme="dark" aria-label="Detail layanan">
      <div class="wrap svc-cols__grid" data-scroll-group>
        <div class="svc-col" data-scroll-reveal="el">
          <span class="svc-col__num">01</span>
          <h2 class="title-xs">
            Kapan layanan ini relevan?
          </h2>
          <p class="p-m muted">
            {{ service.suitable }}
          </p>
        </div>
        <div class="svc-col" data-scroll-reveal="el">
          <span class="svc-col__num">02</span>
          <h2 class="title-xs">
            Apa yang perlu disiapkan?
          </h2>
          <p class="p-m muted">
            {{ service.prepare }}
          </p>
        </div>
        <div class="svc-col" data-scroll-reveal="el">
          <span class="svc-col__num">03</span>
          <h2 class="title-xs">
            Bagaimana batas pekerjaannya?
          </h2>
          <p class="p-m muted">
            {{ service.scope }}
          </p>
        </div>
      </div>
    </section>

    <section v-if="related.length" class="svc-work section wrap" aria-labelledby="svc-work-title">
      <div class="svc-work__head">
        <h2 id="svc-work-title" class="title-l" data-scroll-reveal>
          Karya untuk melihat <span class="alt">konteksnya</span>
        </h2>
        <p class="p-m muted" data-scroll-reveal>
          {{ service.projectContext }}
        </p>
      </div>
      <ul class="svc-work__grid">
        <li v-for="(project, index) in related" :key="project.id" data-scroll-reveal="el">
          <SiteWorkCard :project="project" :ratio="index === 1 ? '4 / 5' : '16 / 11'" />
        </li>
      </ul>
    </section>

    <nav class="svc-nav wrap" aria-label="Layanan lainnya">
      <SiteArrowLink label="Semua layanan" to="/layanan" />
      <div class="svc-nav__others">
        <NuxtLink v-for="item in otherServices" :key="item.slug" :to="`/layanan/${item.slug}`" class="svc-nav__link">
          <span class="label">Layanan lain</span>
          <span class="title-s">{{ SERVICE_SHORT_NAMES[item.slug] ?? item.name }}</span>
        </NuxtLink>
      </div>
      <SiteArrowLink label="Proses kerja" to="/proses" />
    </nav>
  </main>
</template>

<style scoped>
.panel--signal { background: var(--c-signal); color: var(--c-white); }
.panel--pink { background: var(--c-pink); color: var(--c-ink); }
.panel--cyan { background: var(--c-cyan); color: var(--c-ink); }

.svc-hero {
  display: flex;
  align-items: flex-end;
  min-height: 88svh;
}

.svc-hero__inner {
  display: flex;
  flex-direction: column;
  gap: calc(1.25 * var(--u));
  padding-block: calc(9 * var(--u)) calc(4 * var(--u));
}

.svc-hero__title {
  font-size: calc(var(--fs-xxl) * 1.25);
}

.svc-hero__short {
  max-width: 22ch;
}

.svc-body {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: calc(3 * var(--u)) calc(2 * var(--gutter));
  align-items: start;
}

.svc-body__main {
  display: grid;
  gap: calc(1.25 * var(--u));
  max-width: calc(46 * var(--u));
}

.svc-body__main .title-m .alt {
  display: block;
  margin-top: 0.1em;
  line-height: 0.95;
}

.svc-aside {
  position: sticky;
  top: calc(7 * var(--u));
  display: grid;
  gap: calc(1.25 * var(--u));
  padding: calc(1.75 * var(--u));
  color: var(--frame-fg);
  rotate: 2deg;
}

.svc-aside__list {
  display: grid;
  gap: calc(0.6 * var(--u));
}

.svc-aside__list li {
  padding-bottom: calc(0.6 * var(--u));
  border-bottom: 1px solid currentColor;
  font-family: var(--font-serif);
  font-size: var(--fs-p-l);
  line-height: 1.1;
}

.svc-cols__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gutter);
}

.svc-col {
  display: grid;
  align-content: start;
  gap: var(--u);
  padding-top: calc(1.25 * var(--u));
  border-top: 1px solid var(--c-line);
}

.svc-col__num {
  font-family: var(--font-serif);
  font-size: var(--fs-m);
  line-height: 0.8;
  color: var(--c-cyan);
}

.svc-work__head {
  display: grid;
  gap: var(--u);
  max-width: calc(40 * var(--u));
  margin-bottom: calc(3 * var(--u));
}

.svc-work__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gutter);
  align-items: start;
}

.svc-work__grid > li:nth-child(2) {
  margin-top: calc(6 * var(--u));
}

.svc-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: calc(2 * var(--u));
  padding-block: calc(3 * var(--u)) calc(6 * var(--u));
  border-top: 1px solid var(--c-line);
}

.svc-nav__others {
  display: flex;
  gap: calc(2 * var(--u));
}

.svc-nav__link {
  display: grid;
  gap: calc(0.3 * var(--u));
  text-align: center;
  transition: color 0.3s ease;
}

.svc-nav__link:hover {
  color: var(--c-signal);
}

@media (max-width: 991px) {
  .svc-body,
  .svc-cols__grid,
  .svc-work__grid {
    grid-template-columns: 1fr;
  }

  .svc-aside {
    position: relative;
    top: 0;
  }

  .svc-work__grid > li:nth-child(2) {
    margin-top: 0;
  }
}

@media (max-width: 767px) {
  .svc-nav {
    flex-direction: column;
  }
}
</style>
