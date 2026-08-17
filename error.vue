<script setup lang="ts">
defineProps<{ error: { statusCode?: number, statusMessage?: string } }>()
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-canvas px-5 text-ink">
    <div class="max-w-2xl text-center">
      <p class="eyebrow text-accent">Error {{ error.statusCode ?? 500 }}</p>
      <h1 class="mt-5 text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.06em]">{{ error.statusCode === 404 ? 'Halaman tidak ditemukan.' : 'Ada sesuatu yang belum beres.' }}</h1>
      <p class="mt-6 text-muted">{{ error.statusMessage }}</p>
      <NuxtLink to="/" class="button-primary mt-8">Kembali ke beranda</NuxtLink>
    </div>
  </main>
</template>
