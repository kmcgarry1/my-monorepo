import { themeDefinitions, themeOptions, type ThemeDefinition, type ThemeId } from '../theme/themes'

const THEME_STORAGE_KEY = 'dhsb:theme'

export type Theme = 'system' | ThemeId

let currentPreference: Theme = 'system'
let currentRoot: HTMLElement | null = null
let systemMedia: MediaQueryList | null = null
let systemListener: ((event: MediaQueryListEvent) => void) | null = null

function getDocumentElement(root?: HTMLElement | null): HTMLElement | null {
  if (root) return root
  if (typeof document !== 'undefined' && document?.documentElement) {
    return document.documentElement as HTMLElement
  }
  return null
}

function setTokens(root: HTMLElement, definition: ThemeDefinition) {
  for (const [token, value] of Object.entries(definition.tokens)) {
    root.style.setProperty(`--${token}`, value)
  }
  root.style.setProperty('color-scheme', definition.mode)
}

function cleanupSystemListener() {
  if (systemMedia && systemListener) {
    if (typeof systemMedia.removeEventListener === 'function') {
      systemMedia.removeEventListener('change', systemListener)
    } else if (typeof systemMedia.removeListener === 'function') {
      systemMedia.removeListener(systemListener)
    }
  }
  systemMedia = null
  systemListener = null
}

function getSystemTheme(): ThemeId {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    return media.matches ? 'material-dark' : 'material-light'
  }
  return 'material-light'
}

function watchSystemPreference() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  systemMedia = media
  systemListener = () => {
    if (currentPreference === 'system' && currentRoot) {
      applyTheme('system', { root: currentRoot })
    }
  }
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', systemListener)
  } else if (typeof media.addListener === 'function') {
    media.addListener(systemListener)
  }
}

export interface ApplyThemeOptions {
  root?: HTMLElement | null
}

export function applyTheme(theme: Theme, options: ApplyThemeOptions = {}) {
  const root = getDocumentElement(options.root)
  if (!root) return theme

  currentPreference = theme
  currentRoot = root

  let appliedId: ThemeId
  if (theme === 'system') {
    appliedId = getSystemTheme()
    cleanupSystemListener()
    watchSystemPreference()
    root.setAttribute('data-theme-preference', 'system')
  } else {
    appliedId = theme
    cleanupSystemListener()
    root.setAttribute('data-theme-preference', theme)
  }

  const definition = themeDefinitions[appliedId]
  root.setAttribute('data-theme', appliedId)
  root.setAttribute('data-theme-family', definition.family)
  root.setAttribute('data-theme-mode', definition.mode)
  setTokens(root, definition)

  return appliedId
}

function isThemeId(value: string | null | undefined): value is ThemeId {
  if (!value) return false
  return value in themeDefinitions
}

function isTheme(value: string | null | undefined): value is Theme {
  if (!value) return false
  if (value === 'system') return true
  return isThemeId(value)
}

export function saveTheme(theme: Theme) {
  try {
    if (typeof window === 'undefined' || !window?.localStorage) return
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {}
}

export function readStoredTheme(): Theme | null {
  try {
    if (typeof window === 'undefined' || !window?.localStorage) return null
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : null
  } catch {
    return null
  }
}

export function getSavedTheme(): Theme {
  return readStoredTheme() ?? 'system'
}

export { themeOptions }
export type { ThemeId }
