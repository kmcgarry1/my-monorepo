import { computed, onMounted, onUnmounted, ref, type ComputedRef } from 'vue'

const MATERIAL_BREAKPOINTS = {
  phone: '(max-width: 599px)',
  tablet: '(min-width: 600px) and (max-width: 1239px)',
  desktop: '(min-width: 1240px)',
} as const

const ORIENTATION_QUERIES = {
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
} as const

const TOUCH_QUERY = '(pointer: coarse)'

export type MaterialDisplaySize = 'phone' | 'tablet' | 'desktop'
export type MaterialLayoutDensity = 'compact' | 'medium' | 'expanded'
export type Orientation = 'portrait' | 'landscape'

export interface MaterialDisplay {
  size: ComputedRef<MaterialDisplaySize>
  layout: ComputedRef<MaterialLayoutDensity>
  isPhone: ComputedRef<boolean>
  isTablet: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
  orientation: ComputedRef<Orientation>
  isPortrait: ComputedRef<boolean>
  isLandscape: ComputedRef<boolean>
  isTouch: ComputedRef<boolean>
  deviceClasses: ComputedRef<Record<string, boolean>>
}

type MediaQueryListener = (event: MediaQueryListEvent) => void

function createMediaQuery(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null
  }
  return window.matchMedia(query)
}

function attachListener(list: MediaQueryList | null, listener: MediaQueryListener) {
  if (!list) return
  if (typeof list.addEventListener === 'function') {
    list.addEventListener('change', listener)
  } else if (typeof list.addListener === 'function') {
    list.addListener(listener)
  }
}

function detachListener(list: MediaQueryList | null, listener: MediaQueryListener) {
  if (!list) return
  if (typeof list.removeEventListener === 'function') {
    list.removeEventListener('change', listener)
  } else if (typeof list.removeListener === 'function') {
    list.removeListener(listener)
  }
}

export function useMaterialDisplay(): MaterialDisplay {
  const currentSize = ref<MaterialDisplaySize>('desktop')
  const currentOrientation = ref<Orientation>('landscape')
  const currentTouch = ref(false)

  const sizeQueries = ref<Array<{ key: MaterialDisplaySize; list: MediaQueryList | null }>>([])
  const orientationQueries = ref<Array<{ key: Orientation; list: MediaQueryList | null }>>([])
  const touchQuery = ref<MediaQueryList | null>(null)

  const evaluateSize = () => {
    for (const entry of sizeQueries.value) {
      if (entry.list?.matches) {
        currentSize.value = entry.key
        return
      }
    }
    currentSize.value = 'desktop'
  }

  const evaluateOrientation = () => {
    for (const entry of orientationQueries.value) {
      if (entry.list?.matches) {
        currentOrientation.value = entry.key
        return
      }
    }
    currentOrientation.value = 'landscape'
  }

  const evaluateTouch = () => {
    currentTouch.value = !!touchQuery.value?.matches
  }

  onMounted(() => {
    sizeQueries.value = (Object.entries(MATERIAL_BREAKPOINTS) as Array<[
      MaterialDisplaySize,
      string
    ]>).map(([key, query]) => ({ key, list: createMediaQuery(query) }))

    orientationQueries.value = (Object.entries(ORIENTATION_QUERIES) as Array<[
      Orientation,
      string
    ]>).map(([key, query]) => ({ key, list: createMediaQuery(query) }))

    touchQuery.value = createMediaQuery(TOUCH_QUERY)

    evaluateSize()
    evaluateOrientation()
    evaluateTouch()

    const sizeListener: MediaQueryListener = () => evaluateSize()
    const orientationListener: MediaQueryListener = () => evaluateOrientation()
    const touchListener: MediaQueryListener = () => evaluateTouch()

    for (const entry of sizeQueries.value) {
      attachListener(entry.list, sizeListener)
    }
    for (const entry of orientationQueries.value) {
      attachListener(entry.list, orientationListener)
    }
    attachListener(touchQuery.value, touchListener)

    onUnmounted(() => {
      for (const entry of sizeQueries.value) {
        detachListener(entry.list, sizeListener)
      }
      for (const entry of orientationQueries.value) {
        detachListener(entry.list, orientationListener)
      }
      detachListener(touchQuery.value, touchListener)
    })
  })

  const size = computed(() => currentSize.value)
  const orientation = computed(() => currentOrientation.value)
  const isTouch = computed(() => currentTouch.value)

  const layout = computed<MaterialLayoutDensity>(() => {
    if (currentSize.value === 'phone') return 'compact'
    if (currentSize.value === 'tablet') return 'medium'
    return 'expanded'
  })

  const isPhone = computed(() => currentSize.value === 'phone')
  const isTablet = computed(() => currentSize.value === 'tablet')
  const isDesktop = computed(() => currentSize.value === 'desktop')

  const isPortrait = computed(() => currentOrientation.value === 'portrait')
  const isLandscape = computed(() => currentOrientation.value === 'landscape')

  const deviceClasses = computed(() => ({
    'is-phone': isPhone.value,
    'is-tablet': isTablet.value,
    'is-desktop': isDesktop.value,
    'is-compact': layout.value === 'compact',
    'is-medium': layout.value === 'medium',
    'is-expanded': layout.value === 'expanded',
    'is-portrait': isPortrait.value,
    'is-landscape': isLandscape.value,
    'is-touch': isTouch.value,
    'is-pointer': !isTouch.value,
  }))

  return {
    size,
    layout,
    isPhone,
    isTablet,
    isDesktop,
    orientation,
    isPortrait,
    isLandscape,
    isTouch,
    deviceClasses,
  }
}
