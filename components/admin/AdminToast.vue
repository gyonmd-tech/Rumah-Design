<script setup lang="ts">
const { toasts, dismiss } = useToast()
</script>

<template>
  <div
    class="pointer-events-none fixed bottom-6 right-6 z-50 flex max-w-sm flex-col gap-3 font-sans"
    aria-live="polite"
    aria-atomic="true"
  >
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex w-full items-start gap-3.5 rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all"
        :class="{
          'bg-[#121110]/95 text-paper border-white/15': toast.type === 'info',
          'bg-emerald-950/95 text-emerald-100 border-emerald-500/30': toast.type === 'success',
          'bg-rose-950/95 text-rose-100 border-rose-500/30': toast.type === 'error',
          'bg-amber-950/95 text-amber-100 border-amber-500/30': toast.type === 'warning',
        }"
      >
        <!-- Indicator Dot -->
        <div class="mt-1 shrink-0">
          <span
            class="block size-2 rounded-full"
            :class="{
              'bg-emerald-400': toast.type === 'success',
              'bg-rose-400': toast.type === 'error',
              'bg-amber-400': toast.type === 'warning',
              'bg-signal': toast.type === 'info',
            }"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p v-if="toast.title" class="font-display text-sm font-bold tracking-tight">
            {{ toast.title }}
          </p>
          <p class="mt-0.5 text-xs opacity-90 leading-relaxed font-sans">
            {{ toast.message }}
          </p>
        </div>

        <!-- Dismiss button -->
        <button
          type="button"
          class="shrink-0 font-mono text-[0.65rem] uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-1"
          aria-label="Tutup notifikasi"
          @click="dismiss(toast.id)"
        >
          Tutup
        </button>

      </div>
    </TransitionGroup>
  </div>
</template>
