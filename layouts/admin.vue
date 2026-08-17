<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()

async function logout() {
  await client.auth.signOut()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#e8e6df] text-ink">
    <header class="border-b border-ink/15 bg-paper">
      <div class="page-shell flex min-h-16 items-center justify-between gap-5">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="eyebrow">Rumah Design</NuxtLink>
          <NuxtLink to="/admin/projects" class="text-sm font-semibold">Projects</NuxtLink>
        </div>
        <div class="flex items-center gap-4">
          <span class="hidden text-xs text-muted sm:inline">{{ user?.email }}</span>
          <button type="button" class="eyebrow cursor-pointer" @click="logout">Keluar</button>
        </div>
      </div>
    </header>
    <main class="page-shell py-8 sm:py-12">
      <slot />
    </main>
  </div>
</template>
