import { onMounted, onUnmounted, ref } from 'vue'

const DEFAULT_BREAKPOINT = 768

type MediaQueryListener = (event: MediaQueryListEvent) => void

export function useMobileLayout(breakpoint = DEFAULT_BREAKPOINT) {
  const isMobile = ref(false)
  let mediaQuery: MediaQueryList | null = null
  let listener: MediaQueryListener | null = null

  const update = () => {
    if (mediaQuery) {
      isMobile.value = mediaQuery.matches
    } else if (typeof window !== 'undefined') {
      isMobile.value = window.innerWidth <= breakpoint
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)
    update()

    listener = () => update()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener)
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(listener)
    }
  })

  onUnmounted(() => {
    if (!mediaQuery || !listener) return

    if (typeof mediaQuery.removeEventListener === 'function') {
      mediaQuery.removeEventListener('change', listener)
    } else if (typeof mediaQuery.removeListener === 'function') {
      mediaQuery.removeListener(listener)
    }
  })

  return { isMobile }
}

export type UseMobileLayoutReturn = ReturnType<typeof useMobileLayout>
