<script setup lang="ts">
const links = [
  { label: 'Karya', to: '/karya' },
  { label: 'Tentang', to: '/about' },
  { label: 'Layanan', to: '/layanan' },
  { label: 'Proses', to: '/proses' },
]

const route = useRoute()
const { $motion } = useNuxtApp()
const open = ref(false)
const theme = ref<'light' | 'dark'>('light')
const nav = ref<HTMLElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
    || (to === '/karya' && route.path.startsWith('/project/'))
}

// The logo flips to paper over sections marked data-nav-theme="dark".
let frame = 0
function detectTheme() {
  frame = 0
  const height = nav.value?.offsetHeight ?? 64
  const hits = document.elementsFromPoint(window.innerWidth / 2, height / 2)
  const section = hits.map(el => el.closest('[data-nav-theme]')).find(Boolean)
  theme.value = section?.getAttribute('data-nav-theme') === 'dark' ? 'dark' : 'light'
}
function queueDetect() {
  if (!frame) frame = requestAnimationFrame(detectTheme)
}

function setOpen(value: boolean) {
  open.value = value
  if (value) {
    $motion?.lenis?.stop()
    nextTick(() => nav.value?.querySelector<HTMLElement>('#mobile-menu a')?.focus())
  }
  else {
    $motion?.lenis?.start()
  }
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    setOpen(false)
    menuButton.value?.focus()
  }
}

watch(() => route.fullPath, () => {
  if (open.value) setOpen(false)
  setTimeout(queueDetect, 1300)
})

onMounted(() => {
  window.addEventListener('scroll', queueDetect, { passive: true })
  window.addEventListener('resize', queueDetect, { passive: true })
  window.addEventListener('keydown', onKey)
  queueDetect()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', queueDetect)
  window.removeEventListener('resize', queueDetect)
  window.removeEventListener('keydown', onKey)
  cancelAnimationFrame(frame)
})
</script>

<template>
  <header ref="nav" class="nav" :data-theme="open ? 'menu' : theme">
    <NuxtLink to="/" class="nav__logo" aria-label="Hygione Darriyan — beranda">
      <SiteLogo />
    </NuxtLink>

    <nav class="nav__pill" aria-label="Navigasi utama">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="nav__link"
        :aria-current="isActive(link.to) ? 'page' : undefined"
      >
        <span class="nav__link-text">{{ link.label }}</span>
        <SiteDrawLine mode="persist" :active="isActive(link.to)" class="nav__line" />
      </NuxtLink>
    </nav>

    <SiteContactButton class="nav__contact" :aria-current="isActive('/contact') ? 'page' : undefined" />

    <button
      ref="menuButton"
      type="button"
      class="nav__toggle"
      :aria-expanded="open"
      aria-controls="mobile-menu"
      @click="setOpen(!open)"
    >
      <span class="sr-only">{{ open ? 'Tutup menu' : 'Buka menu' }}</span>
      <span class="nav__bar is-top" aria-hidden="true" />
      <span class="nav__bar is-bottom" aria-hidden="true" />
    </button>

    <Transition name="menu">
      <div v-show="open" id="mobile-menu" class="menu">
        <nav class="menu__links" aria-label="Navigasi seluler">
          <NuxtLink
            v-for="(link, index) in links"
            :key="link.to"
            :to="link.to"
            class="menu__link"
            :style="{ '--i': index }"
          >
            <span class="nav__link-text">{{ link.label }}</span>
            <SiteDrawLine mode="persist" :active="isActive(link.to)" class="menu__line" />
          </NuxtLink>
        </nav>
        <div class="menu__contact">
          <SiteContactButton />
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: var(--u) var(--gutter);
  pointer-events: none;
}

.nav > * {
  pointer-events: auto;
}

.nav__logo {
  justify-self: start;
  color: var(--c-ink);
  transition: color 0.3s ease;
}

.nav[data-theme='dark'] .nav__logo,
.nav[data-theme='menu'] .nav__logo {
  color: var(--c-paper);
  --logo-accent: #8b7cff;
}

.nav[data-theme='menu'] .nav__logo {
  --logo-accent: var(--c-cyan);
}

/* White pill, 36px tall at 1440px, links with a hand-drawn underline. */
.nav__pill {
  display: flex;
  align-items: center;
  gap: calc(1.125 * var(--u));
  height: calc(2.25 * var(--u));
  padding: calc(0.46 * var(--u)) calc(0.94 * var(--u)) 0;
  background: var(--c-white);
}

.nav__link {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  font-size: calc(0.75 * var(--u));
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1;
  text-transform: uppercase;
}

.nav__link .nav__line {
  position: relative;
  top: 0;
  height: calc(0.56 * var(--u));
}

.nav__contact {
  justify-self: end;
}

.nav__toggle {
  display: none;
}

.menu {
  display: none;
}

@media (max-width: 767px) {
  .nav {
    grid-template-columns: 1fr auto;
  }

  .nav__pill,
  .nav__contact {
    display: none;
  }

  .nav__toggle {
    position: relative;
    z-index: 2;
    display: grid;
    place-items: center;
    width: calc(2.75 * var(--u));
    height: calc(2.75 * var(--u));
    border: 0;
    background: var(--c-ink);
    color: var(--c-paper);
    cursor: pointer;
  }

  .nav[data-theme='dark'] .nav__toggle {
    background: var(--c-paper);
    color: var(--c-ink);
  }

  .nav__bar {
    position: absolute;
    left: 50%;
    top: 50%;
    width: calc(1.25 * var(--u));
    height: 2px;
    margin-left: calc(-0.625 * var(--u));
    background: currentColor;
    transition: transform 0.4s var(--ease-site);
  }

  .nav__bar.is-top { transform: translateY(-3px); }
  .nav__bar.is-bottom { transform: translateY(3px); }
  .nav__toggle[aria-expanded='true'] .nav__bar.is-top { transform: rotate(45deg); }
  .nav__toggle[aria-expanded='true'] .nav__bar.is-bottom { transform: rotate(-45deg); }

  .nav__logo {
    position: relative;
    z-index: 2;
  }

  .menu {
    position: fixed;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: var(--gutter);
    background: var(--c-signal);
    color: var(--c-white);
  }

  .menu__links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(0.6 * var(--u));
  }

  .menu__link {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-size: calc(2.5 * var(--u));
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1;
    text-transform: uppercase;
  }

  .menu__link .menu__line {
    position: relative;
    top: 0;
    height: 0.3em;
    --draw-color: var(--c-white);
    --draw-weight: 3px;
  }

  .menu__contact {
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(2 * var(--u));
    display: flex;
    justify-content: center;
    transform: scale(1.5);
    transform-origin: 50% 100%;
  }

  .menu-enter-active,
  .menu-leave-active {
    transition: clip-path 0.6s var(--ease-site);
  }

  .menu-enter-from,
  .menu-leave-to {
    clip-path: inset(0 0 100% 0);
  }

  .menu-enter-active .menu__link {
    animation: menu-link 0.7s var(--ease-site) both;
    animation-delay: calc(0.15s + var(--i) * 0.05s);
  }
}

@keyframes menu-link {
  from {
    opacity: 0;
    transform: translateY(60%);
  }
}
</style>
