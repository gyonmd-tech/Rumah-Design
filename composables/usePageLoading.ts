export interface PageLoadingState {
  isLoading: boolean
  message: string
  progress: number
}

// 1 putaran penuh animasi loader-6 sesuai CSS keyframe adalah tepat 3000ms (3 detik)
export const LOADER_CYCLE_DURATION = 3000

export const usePageLoading = () => {
  const loadingState = useState<PageLoadingState>('global-page-loading-state', () => ({
    isLoading: false,
    message: 'MEMUAT PENGALAMAN DIGITAL...',
    progress: 10,
  }))

  let timer: ReturnType<typeof setTimeout> | null = null
  let progressAnimationId: ReturnType<typeof setInterval> | null = null
  let cycleWaitTimeout: ReturnType<typeof setTimeout> | null = null
  let showStartTime = 0
  let completionTimeout: ReturnType<typeof setTimeout> | null = null

  const startLoading = (msg = 'MEMUAT KONTEN...') => {
    if (completionTimeout) clearTimeout(completionTimeout)
    showStartTime = Date.now()
    loadingState.value.isLoading = true
    loadingState.value.message = msg
    loadingState.value.progress = 10

    if (cycleWaitTimeout) {
      clearTimeout(cycleWaitTimeout)
      cycleWaitTimeout = null
    }

    if (progressAnimationId) {
      clearInterval(progressAnimationId)
      progressAnimationId = null
    }

    // Menggerakkan progress bar secara halus dan tersinkronisasi sepanjang 1 putaran (3000ms)
    const updateFrequencyMs = 50
    progressAnimationId = setInterval(() => {
      const elapsed = Date.now() - showStartTime
      // Menuju ke 94% selama 3 detik pertama
      const targetProgress = Math.min(94, Math.round((elapsed / LOADER_CYCLE_DURATION) * 94))
      if (loadingState.value.progress < targetProgress) {
        loadingState.value.progress = targetProgress
      }
    }, updateFrequencyMs)

    // Failsafe cadangan: otomatis dismiss setelah 10 detik bila ada kendala jaringan luar biasa
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      finishLoading(true)
    }, 10000)
  }

  const finishLoading = (force = false, minDuration = 0) => {
    if (cycleWaitTimeout) clearTimeout(cycleWaitTimeout)
    const elapsed = Date.now() - showStartTime
    // Konten siap harus segera terlihat; animasi tidak menunda navigasi.
    const requiredCycleTime = Math.max(0, minDuration)
    const remainingTimeInCycle = Math.max(0, requiredCycleTime - elapsed)

    const executeComplete = () => {
      if (progressAnimationId) {
        clearInterval(progressAnimationId)
        progressAnimationId = null
      }
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      // Capai 100% tepat di akhir putaran, lalu fade-out lembut
      loadingState.value.progress = 100
      if (completionTimeout) clearTimeout(completionTimeout)
      completionTimeout = setTimeout(() => {
        loadingState.value.isLoading = false
      }, 100)
    }

    if (force || remainingTimeInCycle === 0) {
      executeComplete()
    } else {
      if (cycleWaitTimeout) clearTimeout(cycleWaitTimeout)
      cycleWaitTimeout = setTimeout(executeComplete, remainingTimeInCycle)
    }
  }

  return {
    state: readonly(loadingState),
    isLoading: computed(() => loadingState.value.isLoading),
    message: computed(() => loadingState.value.message),
    progress: computed(() => loadingState.value.progress),
    startLoading,
    finishLoading,
    LOADER_CYCLE_DURATION,
  }
}
