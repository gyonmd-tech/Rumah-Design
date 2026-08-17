<template>
  <header class="page-shell relative z-20 flex min-h-20 items-center justify-between border-b border-ink/20">
    <NuxtLink to="/" class="eyebrow" aria-label="Rumah Design, ke beranda">
      Rumah Design
    </NuxtLink>
    <nav aria-label="Navigasi utama" class="flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.12em] sm:gap-8">
      <NuxtLink to="/#work" class="transition-colors hover:text-accent">Karya</NuxtLink>
      <NuxtLink to="/about" class="transition-colors hover:text-accent">Tentang</NuxtLink>
    </nav>
  </header>
</template>
