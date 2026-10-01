<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'

const siteSettings = usePublicSiteSettings()
const { data: projects } = await usePublishedProjects()
const { $motion } = useNuxtApp()
const route = useRoute()
const root = ref<HTMLElement | null>(null)
useSiteMotion(root)

const email = computed(() => siteSettings.value.general.contact_email || 'paroarro07@gmail.com')
const trailImages = computed(() => projects.value.map(project => project.thumbnail_url).filter(Boolean))
const year = new Date().getFullYear()
const copyStatus = ref('')

const socials = computed(() => [
  { label: 'GitHub', href: siteSettings.value.socials.github },
  { label: 'LinkedIn', href: siteSettings.value.socials.linkedin },
  { label: 'Instagram', href: siteSettings.value.socials.instagram },
  { label: 'Dribbble', href: siteSettings.value.socials.dribbble },
  { label: 'Medium', href: siteSettings.value.socials.medium },
].filter(item => item.href))

const nav = [
  { label: 'Karya', to: '/karya' },
  { label: 'Tentang', to: '/about' },
  { label: 'Layanan', to: '/layanan' },
  { label: 'Proses', to: '/proses' },
  { label: 'Hubungi', to: '/contact' },
]

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email.value)
    copyStatus.value = `Alamat email ${email.value} berhasil disalin!`
  }
  catch {
    copyStatus.value = `Gagal menyalin email: ${email.value}`
  }
  setTimeout(() => (copyStatus.value = ''), 3000)
}

function toTop() {
  if ($motion?.lenis) $motion.lenis.scrollTo(0, { duration: 1.2 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer ref="root" class="footer theme-dark" data-nav-theme="dark">
    <section class="footer__cta wrap" aria-labelledby="footer-cta-title">
      <SiteImageTrail :images="trailImages" />
      <h2 id="footer-cta-title" class="title-xl footer__title" data-scroll-reveal>
        Punya ide yang ingin <span class="alt">dibawa lebih jauh?</span>
      </h2>
      <p class="p-m footer__sub" data-scroll-reveal>
        Dari percakapan pertama, kita bisa menemukan bentuk, alur, dan teknologi yang tepat untuk kebutuhan Anda.
      </p>
      <div class="footer__actions">
        <SiteButton label="Mulai diskusi proyek" to="/contact" variant="pink" />
        <SiteButton label="Salin email" icon="copy" variant="light" @click="copyEmail" />
      </div>
      <p class="footer__status p-s" role="status" aria-live="polite">
        {{ copyStatus }}
      </p>
    </section>

    <div class="footer__base wrap">
      <NuxtLink to="/" class="footer__mark" aria-label="Hygione Darriyan — beranda">
        <SiteLogo />
      </NuxtLink>

      <div class="footer__cols">
        <nav aria-labelledby="footer-nav">
          <h3 id="footer-nav" class="label footer__head">
            Navigasi
          </h3>
          <ul>
            <li v-for="item in nav" :key="item.to">
              <NuxtLink :to="item.to" class="footer-link">
                <span>{{ item.label }}</span>
                <SiteDrawLine mode="persist" :active="route.path === item.to || route.path.startsWith(`${item.to}/`)" class="footer-link__line" />
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div>
          <h3 class="label footer__head">
            Kontak
          </h3>
          <ul>
            <li>
              <a :href="`mailto:${email}`" class="footer-link">
                <span>{{ email }}</span>
                <SiteDrawLine class="footer-link__line" />
              </a>
            </li>
            <li class="muted">
              Citayam, Kota Depok
            </li>
            <li class="muted">
              Jawa Barat, Indonesia
            </li>
          </ul>
        </div>
        <div v-if="socials.length">
          <h3 class="label footer__head">
            Sosial
          </h3>
          <ul>
            <li v-for="item in socials" :key="item.label">
              <a :href="item.href" target="_blank" rel="noopener noreferrer me" class="footer-link">
                <span>{{ item.label }}</span>
                <SiteDrawLine class="footer-link__line" />
              </a>
            </li>
          </ul>
        </div>
        <button type="button" class="footer__top" @click="toTop">
          <ArrowUp class="footer__top-icon" :stroke-width="2.75" aria-hidden="true" />
          <span class="footer__top-bg" />
          <span class="sr-only">Kembali ke atas</span>
        </button>
      </div>

      <div class="footer__legal p-s">
        <span>© {{ year }} Hygione Darriyan. All rights reserved.</span>
        <span class="footer-bottom-link">Hygione Heparre Paro Arro Darriyan</span>
        <NuxtLink to="/admin/login" class="footer-bottom-link" rel="nofollow">
          Admin
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
}

.footer__cta {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: calc(10 * var(--u)) calc(8 * var(--u));
  text-align: center;
}

.footer__title {
  position: relative;
  max-width: 14ch;
}

.footer__sub {
  position: relative;
  max-width: 34ch;
  margin-top: calc(1.5 * var(--u));
}

.footer__actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: calc(0.75 * var(--u));
  margin-top: calc(2 * var(--u));
}

.footer__status {
  min-height: 1.5em;
  margin-top: var(--u);
  color: var(--c-cyan);
}

.footer__base {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: calc(3 * var(--u)) var(--gutter);
  padding-block: calc(4 * var(--u)) calc(2 * var(--u));
  border-top: 1px solid var(--c-line);
}

.footer__mark {
  align-self: end;
  color: var(--c-paper);
  --logo-accent: #8b7cff;
}

.footer__mark :deep(.logo) {
  width: 100%;
  max-width: calc(36 * var(--u));
  height: auto;
}

.footer__cols {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1.7fr 1fr auto;
  gap: var(--gutter);
}

.footer__head {
  margin-bottom: var(--u);
}

.footer__cols ul {
  display: grid;
  gap: calc(0.35 * var(--u));
  font-family: var(--font-serif);
  font-size: var(--fs-p-l);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.01em;
  word-break: break-word;
}

.footer-link {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  opacity: 0.6;
  transition: opacity 30ms cubic-bezier(0.19, 1, 0.22, 1);
}

.footer-link:hover,
.footer-link:focus-visible,
.footer-link.router-link-exact-active {
  opacity: 1;
}

.footer-link .footer-link__line {
  position: relative;
  top: 0;
  height: 0.4em;
  --draw-color: var(--c-pink);
}

.footer-bottom-link {
  opacity: 0.6;
  transition: opacity 30ms cubic-bezier(0.19, 1, 0.22, 1);
}

a.footer-bottom-link:hover {
  opacity: 1;
}

.footer__top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: start;
  width: calc(2 * var(--u));
  height: calc(2 * var(--u));
  padding: 0;
  border: 0;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  color: var(--c-paper);
  cursor: pointer;
}

.footer__top-icon {
  position: relative;
  z-index: 1;
  width: calc(0.85 * var(--u));
  height: calc(0.85 * var(--u));
  transition: color 0.425s cubic-bezier(0.19, 1, 0.22, 1);
}

.footer__top-bg {
  position: absolute;
  inset: 0;
  background: var(--c-pink);
  transform: translateY(105%);
  transition: transform 0.425s cubic-bezier(0.19, 1, 0.22, 1);
}

.footer__top:is(:hover, :focus-visible) .footer__top-icon {
  color: var(--c-ink);
}

.footer__top:is(:hover, :focus-visible) .footer__top-bg {
  transform: translateY(0);
}

.footer__legal {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: calc(0.5 * var(--u)) var(--gutter);
  padding-top: calc(1.5 * var(--u));
  border-top: 1px solid var(--c-line);
}

@media (max-width: 991px) {
  .footer__base {
    grid-template-columns: 1fr;
  }

  .footer__cols {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer__top {
    position: absolute;
    top: 0;
    right: 0;
  }
}

@media (max-width: 479px) {
  .footer__cols {
    grid-template-columns: 1fr;
  }

}
</style>
