import {
  defaultThemeName,
  fonts,
  motion,
  radii,
  shadows,
  spacing,
  stateLayers,
  themeMeta,
  themeOrder,
  themeVariables,
  themeVariablesList,
  transitions,
  typography,
  type ThemeName,
  type ThemeVariableName,
  type ThemeVariables
} from '@my-monorepo/design-tokens'

export type ThemePreference = ThemeName | 'system'

export const THEME_STORAGE_KEY = 'my-monorepo:theme'

const themeVariableNames: ThemeVariableName[] = [...themeVariablesList]
const firstLightTheme = themeOrder.find((name) => themeMeta[name].mode === 'light') ?? defaultThemeName
const firstDarkTheme = themeOrder.find((name) => themeMeta[name].mode === 'dark') ?? defaultThemeName

let currentPreference: ThemePreference = defaultThemeName
let currentRoot: HTMLElement | null = null
let systemMedia: MediaQueryList | null = null
let systemListener: ((event: MediaQueryListEvent) => void) | null = null

export interface ApplyThemeOptions {
  root?: HTMLElement | null
  persist?: boolean
  storageKey?: string
}

function getDocumentElement(root?: HTMLElement | null): HTMLElement | null {
  if (root) return root
  if (typeof document !== 'undefined' && document?.documentElement) {
    return document.documentElement as HTMLElement
  }
  return null
}

function setInlineThemeVariables(root: HTMLElement, theme: ThemeName | null) {
  for (const name of themeVariableNames) {
    if (theme) {
      root.style.setProperty(name as string, themeVariables[theme][name])
    } else {
      root.style.removeProperty(name as string)
    }
  }
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

function getSystemTheme(): ThemeName {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    return media.matches ? firstDarkTheme : firstLightTheme
  }
  return firstLightTheme
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

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  if (!value) return false
  if (value === 'system') return true
  return themeOrder.includes(value as ThemeName)
}

export function applyTheme(theme: ThemePreference, options: ApplyThemeOptions = {}) {
  const root = getDocumentElement(options.root)
  if (!root) return theme

  currentPreference = theme
  currentRoot = root

  let appliedTheme: ThemeName
  if (theme === 'system') {
    appliedTheme = getSystemTheme()
    cleanupSystemListener()
    watchSystemPreference()
    root.setAttribute('data-theme-preference', 'system')
  } else {
    appliedTheme = theme
    cleanupSystemListener()
    root.setAttribute('data-theme-preference', theme)
  }

  const meta = themeMeta[appliedTheme]
  root.setAttribute('data-theme', appliedTheme)
  root.setAttribute('data-theme-family', meta.family)
  root.setAttribute('data-theme-mode', meta.mode)
  root.style.setProperty('color-scheme', meta.mode)
  setInlineThemeVariables(root, appliedTheme)

  if (options.persist) {
    storeThemePreference(theme, options.storageKey)
  }

  return appliedTheme
}

export function storeThemePreference(theme: ThemePreference, storageKey?: string) {
  try {
    if (typeof window === 'undefined' || !window?.localStorage) return
    window.localStorage.setItem(storageKey ?? THEME_STORAGE_KEY, theme)
  } catch {}
}

export function clearThemePreference(storageKey?: string) {
  try {
    if (typeof window === 'undefined' || !window?.localStorage) return
    window.localStorage.removeItem(storageKey ?? THEME_STORAGE_KEY)
  } catch {}
}

export function readStoredTheme(storageKey?: string): ThemePreference | null {
  try {
    if (typeof window === 'undefined' || !window?.localStorage) return null
    const raw = window.localStorage.getItem(storageKey ?? THEME_STORAGE_KEY)
    return isThemePreference(raw) ? raw : null
  } catch {
    return null
  }
}

export interface InitThemeOptions {
  root?: HTMLElement | null
  storageKey?: string
  fallback?: ThemePreference
  persistComputed?: boolean
}

export function initTheme(options: InitThemeOptions = {}) {
  const stored = readStoredTheme(options.storageKey)
  if (stored) {
    applyTheme(stored, { root: options.root, storageKey: options.storageKey })
    return stored
  }

  const fallback = options.fallback ?? defaultThemeName
  applyTheme(fallback, {
    root: options.root,
    storageKey: options.storageKey,
    persist: options.persistComputed ?? false,
  })
  return fallback
}

export const themeOptions = themeOrder.map((value) => ({
  value,
  label: themeMeta[value].label,
  description: themeMeta[value].description,
  accent: themeMeta[value].accent,
  family: themeMeta[value].family,
  mode: themeMeta[value].mode,
})) as ReadonlyArray<{
  value: ThemeName
  label: string
  description: string
  accent: string
  family: 'material' | 'apple'
  mode: 'light' | 'dark'
}>

export {
  defaultThemeName,
  fonts,
  motion,
  radii,
  shadows,
  spacing,
  stateLayers,
  themeMeta,
  themeOrder,
  themeVariables,
  themeVariablesList,
  transitions,
  typography,
  type ThemeName,
  type ThemeVariableName,
  type ThemeVariables,
}
