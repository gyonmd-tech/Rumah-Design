<script setup lang="ts">
export interface FaqItem {
  id: string | number
  question: string
  answer: string
}

export interface FaqRow {
  id: string | number
  speed?: string
  direction?: 'left' | 'right'
  faqItems: FaqItem[]
}

export interface FaqData {
  mainTitle: string
  mainSubtitle: string
  rows: FaqRow[]
}

interface Props {
  data: FaqData
  theme?: 'light' | 'dark'
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  customClass: '',
})
</script>

<template>
  <div :class="['relative flex flex-col items-center gap-10 sm:gap-14 py-16 sm:py-24 w-full select-none overflow-hidden', theme === 'light' ? 'bg-paper text-ink' : 'bg-void text-paper', customClass]">
    <!-- Header Container (Clean without Badge) -->
    <div class="flex flex-col items-center gap-3 sm:gap-4 text-center z-10 max-w-3xl px-4 mx-auto">
      <h2 class="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight" :class="theme === 'light' ? 'text-ink' : 'text-paper'">
        {{ data.mainTitle }}
      </h2>
      <p class="text-base sm:text-lg md:text-xl font-sans leading-relaxed max-w-2xl text-balance" :class="theme === 'light' ? 'text-mute' : 'text-paper/70'">
        {{ data.mainSubtitle }}
      </p>
    </div>

    <!-- Wide Edge-to-Edge Horizontal Scroller Rows -->
    <div class="flex flex-col gap-5 sm:gap-7 z-10 w-full">
      <div
        v-for="row in data.rows"
        :key="row.id"
        class="w-full overflow-hidden group relative scroller-mask"
      >
        <div
          :class="[
            'flex w-max flex-nowrap',
            row.direction === 'right' ? 'animate-scroll-horizontal-reverse' : 'animate-scroll-horizontal'
          ]"
          :style="{ '--scroll-duration': row.speed || '45s' }"
        >
          <!-- First Loop Strip -->
          <div class="flex items-stretch justify-center flex-shrink-0 gap-3 sm:gap-6 px-2 sm:px-3">
            <div
              v-for="item in row.faqItems"
              :key="item.id"
              :class="[
                'flex flex-col items-start justify-between gap-3 p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl w-[280px] sm:w-[380px] md:w-[440px] flex-shrink-0 transition-all duration-300 group/card',
                theme === 'light'
                  ? 'bg-white/95 border border-ink/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(10,228,72,0.08)] hover:border-signal/40'
                  : 'bg-[#181a19]/90 backdrop-blur-xl border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:border-signal/40'
              ]"
            >
              <h3
                :class="[
                  'text-base sm:text-xl font-bold tracking-tight group-hover/card:text-signal transition-colors leading-snug',
                  theme === 'light' ? 'text-ink' : 'text-paper'
                ]"
              >
                {{ item.question }}
              </h3>
              <p
                :class="[
                  'text-xs sm:text-base font-sans leading-relaxed',
                  theme === 'light' ? 'text-ink/75' : 'text-paper/75'
                ]"
              >
                {{ item.answer }}
              </p>
            </div>
          </div>

          <!-- Duplicate Loop Strip (Seamless Infinite Loop) -->
          <div class="flex items-stretch justify-center flex-shrink-0 gap-3 sm:gap-6 px-2 sm:px-3" aria-hidden="true">
            <div
              v-for="item in row.faqItems"
              :key="`dup-${item.id}`"
              :class="[
                'flex flex-col items-start justify-between gap-3 p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl w-[280px] sm:w-[380px] md:w-[440px] flex-shrink-0 transition-all duration-300 group/card',
                theme === 'light'
                  ? 'bg-white/95 border border-ink/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(10,228,72,0.08)] hover:border-signal/40'
                  : 'bg-[#181a19]/90 backdrop-blur-xl border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:border-signal/40'
              ]"
            >
              <h3
                :class="[
                  'text-lg sm:text-xl font-bold tracking-tight group-hover/card:text-signal transition-colors leading-snug',
                  theme === 'light' ? 'text-ink' : 'text-paper'
                ]"
              >
                {{ item.question }}
              </h3>
              <p
                :class="[
                  'text-sm sm:text-base font-sans leading-relaxed',
                  theme === 'light' ? 'text-ink/75' : 'text-paper/75'
                ]"
              >
                {{ item.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
