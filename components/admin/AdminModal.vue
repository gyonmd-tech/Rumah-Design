<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
    busy?: boolean
  }>(),
  {
    confirmLabel: 'Konfirmasi',
    cancelLabel: 'Batal',
    danger: false,
    busy: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show && !props.busy) {
    emit('cancel')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-void/70 backdrop-blur-xs font-sans"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl bg-paper p-5 sm:p-7 text-ink shadow-2xl border border-ink/15 space-y-4 sm:space-y-5 transform transition-all"
        >
          <div class="flex items-start gap-3 sm:gap-4">
            <div
              v-if="danger"
              class="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-signal/15 text-signal text-xs font-bold font-mono"
            >
              DEL
            </div>
            <div
              v-else
              class="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-ink/5 text-ink text-xs font-bold font-mono"
            >
              ACT
            </div>
            <div class="space-y-1 min-w-0">
              <h3 class="font-display text-lg sm:text-xl font-bold text-ink leading-snug">
                {{ title }}
              </h3>
              <p class="text-xs sm:text-sm text-mute leading-relaxed font-sans">
                {{ message }}
              </p>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3.5 sm:pt-4 border-t border-ink/10">
            <button
              type="button"
              class="button-secondary text-xs cursor-pointer text-center"
              :disabled="busy"
              @click="emit('cancel')"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              class="text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded-full cursor-pointer transition-all disabled:opacity-50 text-center"
              :class="danger ? 'bg-signal text-white hover:bg-[#e63d10] shadow-md shadow-signal/20' : 'bg-ink text-paper hover:bg-black'"
              :disabled="busy"
              @click="emit('confirm')"
            >
              {{ busy ? 'Memproses…' : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
