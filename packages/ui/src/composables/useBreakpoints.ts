import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type BreakpointName = 'mobile' | 'tablet' | 'desktop'

type BreakpointQueries = Record<BreakpointName, string>

const defaultQueries: BreakpointQueries = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
}

interface MatchEntry {
  media: MediaQueryList
  listener: ((event: MediaQueryListEvent) => void) | null
}

/**
 * Tracks responsive breakpoints using `matchMedia`. Returns refs that stay in
 * sync with viewport changes. Safe to use in SSR contexts—values simply remain
 * at their defaults until mounted on the client.
 */
export function useBreakpoints(queries: Partial<BreakpointQueries> = {}) {
  const mergedQueries: BreakpointQueries = {
    mobile: queries.mobile ?? defaultQueries.mobile,
    tablet: queries.tablet ?? defaultQueries.tablet,
    desktop: queries.desktop ?? defaultQueries.desktop,
  }

  const matches = {
    mobile: ref(false),
    tablet: ref(false),
    desktop: ref(true),
  }

  const registry: Partial<Record<BreakpointName, MatchEntry>> = {}

  function syncMatch(name: BreakpointName) {
    const entry = registry[name]
    if (!entry) return
    matches[name].value = entry.media.matches
  }

  function setup(name: BreakpointName) {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const media = window.matchMedia(mergedQueries[name])
    const entry: MatchEntry = {
      media,
      listener: null,
    }

    if (typeof media.addEventListener === 'function') {
      entry.listener = (event) => {
        matches[name].value = event.matches
      }
      media.addEventListener('change', entry.listener)
    } else if (typeof media.addListener === 'function') {
      entry.listener = (event) => {
        matches[name].value = (event as MediaQueryListEvent).matches
      }
      media.addListener(entry.listener)
    }

    registry[name] = entry
    syncMatch(name)
  }

  function cleanup() {
    (Object.keys(registry) as BreakpointName[]).forEach((name) => {
      const entry = registry[name]
      if (!entry?.listener) return
      if (typeof entry.media.removeEventListener === 'function') {
        entry.media.removeEventListener('change', entry.listener)
      } else if (typeof entry.media.removeListener === 'function') {
        entry.media.removeListener(entry.listener)
      }
      delete registry[name]
    })
  }

  onMounted(() => {
    ;(['mobile', 'tablet', 'desktop'] as BreakpointName[]).forEach((name) => setup(name))
  })

  onBeforeUnmount(() => cleanup())

  const current = computed<BreakpointName>(() => {
    if (matches.mobile.value) return 'mobile'
    if (matches.tablet.value) return 'tablet'
    return 'desktop'
  })

  return {
    ...matches,
    current,
  }
}
