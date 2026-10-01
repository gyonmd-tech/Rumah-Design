<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { categoryLabel, PROJECT_CATEGORIES } from '~/utils/project'
import type { ProjectCategory } from '~/types/database.types'
import { serializeJsonLd } from '~/utils/structured-data'

usePortfolioPageSeo({
  title: 'Karya — Case Study UI/UX, Frontend & Fullstack',
  description: 'Semua karya Hygione Darriyan: landing page, dashboard, dan aplikasi web dengan case study, teknologi yang dipakai, serta live demo yang bisa dicoba.',
  path: '/karya',
})

const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()
const siteOrigin = String(useRuntimeConfig().public.siteUrl).replace(/\/+$/, '')
const { data: projects, error, refresh } = await usePublishedProjects()

const category = ref<string>(typeof route.query.kategori === 'string' ? route.query.kategori : '')
const style = ref<string>(typeof route.query.gaya === 'string' ? route.query.gaya : '')
const query = ref<string>(typeof route.query.q === 'string' ? route.query.q : '')

const categories = computed(() => PROJECT_CATEGORIES.filter(item => projects.value.some(project => project.category === item.value)))
// The most used style tags only, so the chip row stays scannable.
const styles = computed(() => {
  const counts = new Map<string, number>()
  projects.value.flatMap(project => project.style_tags ?? []).forEach(tag => counts.set(tag, (counts.get(tag) ?? 0) + 1))
  const top = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'id')).slice(0, 12).map(([tag]) => tag)
  if (style.value && !top.includes(style.value)) top.push(style.value)
  return top.sort((a, b) => a.localeCompare(b, 'id'))
})

const filtered = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase('id-ID')
  return projects.value.filter((project) => {
    if (category.value && project.category !== category.value) return false
    if (style.value && !project.style_tags?.includes(style.value)) return false
    if (!needle) return true
    const haystack = [project.title, categoryLabel(project.category), ...(project.tech_stack ?? []), ...(project.style_tags ?? [])]
      .join(' ').toLocaleLowerCase('id-ID')
    return haystack.includes(needle)
  })
})

// Three staggered columns on desktop; `order` keeps reading order when the
// columns collapse into one list on small screens.
const columns = computed(() => {
  const cols: Array<Array<{ project: typeof filtered.value[number], index: number }>> = [[], [], []]
  filtered.value.forEach((project, index) => cols[index % 3].push({ project, index }))
  return cols
})
const RATIOS = ['4 / 5', '16 / 11', '1 / 1', '16 / 11', '4 / 5']

const hasFilter = computed(() => Boolean(category.value || style.value || query.value))

function reset() {
  category.value = ''
  style.value = ''
  query.value = ''
}

watch([category, style, query], ([kategori, gaya, q]) => {
  router.replace({ query: { ...(kategori ? { kategori } : {}), ...(gaya ? { gaya } : {}), ...(q ? { q } : {}) } })
  nextTick(() => nuxtApp.$motion?.refresh())
})

const root = ref<HTMLElement | null>(null)
useSiteMotion(root, ({ gsap, ScrollTrigger, reduced }) => {
  if (reduced) return
  const items = gsap.utils.toArray<HTMLElement>('.work-grid__item', root.value!)
  const below = items.filter(item => item.getBoundingClientRect().top > window.innerHeight)
  gsap.set(below, { y: 80, autoAlpha: 0 })
  ScrollTrigger.batch(below, {
    start: 'top 92%',
    once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.1 }),
  })
})

const itemListJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: projects.value.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${siteOrigin}/project/${project.slug}`,
    name: project.title,
  })),
}))
useHead(() => ({
  script: [{ key: 'karya-list', type: 'application/ld+json', innerHTML: serializeJsonLd(itemListJsonLd.value) }],
}))
</script>

<template>
  <main id="main" ref="root">
    <header class="karya-hero wrap">
      <p class="kicker" data-reveal>
        Karya yang bisa dilihat, dicoba, dan ditelusuri.
      </p>
      <h1 class="title-xxl" data-reveal="chars">
        Semua <span class="alt">karya</span>
      </h1>
      <p class="p-m karya-hero__copy" data-reveal>
        Portofolio UI/UX, desain visual, frontend, dan fullstack saya mencakup landing page, dashboard, serta aplikasi web. Buka setiap project untuk memahami konteksnya, melihat teknologi yang dipakai, dan mencoba hasilnya melalui live demo.
      </p>
    </header>

    <section class="wrap" aria-labelledby="filter-title">
      <h2 id="filter-title" class="sr-only">
        Filter karya
      </h2>
      <div class="filters" data-reveal="el">
        <label class="filters__search">
          <Search :stroke-width="2.5" aria-hidden="true" />
          <span class="sr-only">Cari project</span>
          <input v-model="query" type="search" placeholder="Cari project, stack, atau topik..." autocomplete="off">
        </label>

        <div class="filters__row" role="group" aria-label="Kategori">
          <span class="label filters__label">Kategori</span>
          <button type="button" class="chip" :aria-pressed="!category" @click="category = ''">
            Semua
          </button>
          <button
            v-for="item in categories"
            :key="item.value"
            type="button"
            class="chip"
            :aria-pressed="category === item.value"
            @click="category = category === item.value ? '' : (item.value as ProjectCategory)"
          >
            {{ item.label }}
          </button>
        </div>

        <div v-if="styles.length" class="filters__row" role="group" aria-label="Gaya visual">
          <span class="label filters__label">Gaya</span>
          <button
            v-for="tag in styles"
            :key="tag"
            type="button"
            class="chip chip--alt"
            :aria-pressed="style === tag"
            @click="style = style === tag ? '' : tag"
          >
            {{ tag }}
          </button>
        </div>

        <p class="p-s muted" role="status" aria-live="polite">
          {{ filtered.length }} dari {{ projects.length }} project
        </p>
      </div>
    </section>

    <section class="work-grid-section wrap" aria-label="Daftar karya">
      <div v-if="error" class="empty">
        <h2 class="title-m">
          Katalog sedang sulit dimuat.
        </h2>
        <p class="p-m muted">
          Silakan coba lagi. Karya yang sudah dipublikasikan tetap aman.
        </p>
        <SiteButton label="Muat ulang" @click="refresh()" />
      </div>
      <div v-else-if="!projects.length" class="empty">
        <h2 class="title-m">
          Belum ada project yang dipublikasikan.
        </h2>
        <p class="p-m muted">
          Project baru akan muncul di sini segera setelah dirilis.
        </p>
      </div>
      <div v-else-if="!filtered.length" class="empty">
        <h2 class="title-m">
          Belum ada project yang cocok.
        </h2>
        <p class="p-m muted">
          Coba kata kunci pencarian atau kategori lain.
        </p>
        <SiteButton label="Reset filter" variant="pink" @click="reset" />
      </div>
      <div v-else class="work-grid">
        <ul v-for="(col, colIndex) in columns" :key="colIndex" class="work-grid__col">
          <li
            v-for="item in col"
            :key="item.project.id"
            class="work-grid__item"
            :style="{ order: item.index }"
          >
            <SiteWorkCard :project="item.project" :ratio="RATIOS[item.index % RATIOS.length]" :eager="item.index < 3" />
          </li>
        </ul>
      </div>
      <p v-if="hasFilter && filtered.length" class="reset-line">
        <SiteButton label="Tampilkan semua karya" variant="ink" @click="reset" />
      </p>
    </section>
  </main>
</template>

<style scoped>
.karya-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(1.25 * var(--u));
  padding-top: calc(11 * var(--u));
  padding-bottom: calc(4 * var(--u));
  text-align: center;
}

.karya-hero__copy {
  max-width: 52ch;
}

.filters {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(0.9 * var(--u));
  padding-bottom: calc(4 * var(--u));
}

.filters__search {
  display: flex;
  align-items: center;
  gap: calc(0.6 * var(--u));
  width: min(100%, calc(30 * var(--u)));
  padding: 0 calc(0.9 * var(--u));
  height: calc(3 * var(--u));
  background: var(--c-white);
  border: 2px solid var(--c-ink);
}

.filters__search svg {
  flex: none;
  width: calc(1.1 * var(--u));
  height: calc(1.1 * var(--u));
}

.filters__search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: none;
  font-size: var(--fs-p);
  outline: none;
}

.filters__search:focus-within {
  outline: 2px solid var(--c-signal);
  outline-offset: 3px;
}

.filters__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: calc(0.4 * var(--u));
}

.filters__label {
  margin-right: calc(0.4 * var(--u));
  color: var(--c-ink-soft);
}

.chip {
  padding: calc(0.5 * var(--u)) calc(0.8 * var(--u));
  border: 2px solid var(--c-ink);
  background: transparent;
  font-size: var(--fs-p-xs);
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease, rotate 0.4s var(--ease-bounce);
}

.chip:hover {
  rotate: -3deg;
}

.chip[aria-pressed='true'] {
  background: var(--c-ink);
  color: var(--c-paper);
}

.chip--alt {
  font-family: var(--font-serif);
  font-size: var(--fs-p-m);
  font-weight: 400;
  text-transform: none;
  border-color: var(--c-line);
}

.chip--alt[aria-pressed='true'] {
  background: var(--c-signal);
  border-color: var(--c-signal);
  color: var(--c-white);
}

.work-grid-section {
  padding-bottom: var(--section-y);
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gutter);
  align-items: start;
}

.work-grid__col {
  display: flex;
  flex-direction: column;
  gap: calc(4 * var(--u));
}

.work-grid__col:nth-child(2) {
  padding-top: calc(9 * var(--u));
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--u);
  padding-block: calc(4 * var(--u));
  text-align: center;
}

.reset-line {
  margin-top: calc(4 * var(--u));
  text-align: center;
}


@media (max-width: 767px) {
  .work-grid {
    display: flex;
    flex-direction: column;
    gap: calc(3 * var(--u));
  }

  .work-grid__col {
    display: contents;
  }

  .work-grid__col:nth-child(2) {
    padding-top: 0;
  }
}
</style>
