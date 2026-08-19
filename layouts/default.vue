<template>
  <div class="min-h-screen flex flex-col justify-between selection:bg-signal selection:text-void bg-void">
    <SiteHeader />
    <main class="relative z-20 grow bg-transparent">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
