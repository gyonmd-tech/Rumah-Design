export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  duration?: number
}

const toasts = ref<ToastMessage[]>([])

export function useToast() {
  function show(toast: Omit<ToastMessage, 'id'>) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const duration = toast.duration ?? 4000

    toasts.value.push({
      id,
      type: toast.type,
      title: toast.title,
      message: toast.message,
      duration,
    })

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  function success(message: string, title = 'Berhasil') {
    return show({ type: 'success', title, message })
  }

  function error(message: string, title = 'Terjadi Kesalahan') {
    return show({ type: 'error', title, message, duration: 6000 })
  }

  function info(message: string, title = 'Informasi') {
    return show({ type: 'info', title, message })
  }

  function warning(message: string, title = 'Peringatan') {
    return show({ type: 'warning', title, message, duration: 5000 })
  }

  function dismiss(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts: readonly(toasts),
    show,
    success,
    error,
    info,
    warning,
    dismiss,
  }
}
