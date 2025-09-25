import {
  defaultThemeName,
  fonts,
  radii,
  shadows,
  themeMeta,
  themeOrder,
  themeVariables,
  themeVariablesList,
  transitions,
  type ThemeName,
  type ThemeVariableName,
  type ThemeVariables
} from '@my-monorepo/design-tokens'

export type ThemePreference = ThemeName | 'system'

export const THEME_STORAGE_KEY = 'my-monorepo:theme'

const themeVariableNames: ThemeVariableName[] = [...themeVariablesList]

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

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  if (!value) return false
  if (value === 'system') return true
  return themeOrder.includes(value as ThemeName)
}

export function applyTheme(theme: ThemePreference, options: ApplyThemeOptions = {}) {
  const root = getDocumentElement(options.root)
  if (!root) return theme

  if (theme === 'system') {
    root.removeAttribute('data-theme')
    setInlineThemeVariables(root, null)
  } else {
    root.setAttribute('data-theme', theme)
    setInlineThemeVariables(root, theme)
  }

  if (options.persist) {
    storeThemePreference(theme, options.storageKey)
  }

  return theme
}

export interface StoreThemeOptions {
  storageKey?: string
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
  if (fallback !== 'system') {
    applyTheme(fallback, {
      root: options.root,
      storageKey: options.storageKey,
      persist: options.persistComputed ?? false
    })
  }
  return fallback
}

export const themeOptions = themeOrder.map((value) => ({
  value,
  label: themeMeta[value].label,
  description: themeMeta[value].description,
  accent: themeMeta[value].accent
})) as ReadonlyArray<{ value: ThemeName; label: string; description: string; accent: string }>

export {
  defaultThemeName,
  fonts,
  radii,
  shadows,
  themeMeta,
  themeOrder,
  themeVariables,
  themeVariablesList,
  transitions,
  type ThemeName,
  type ThemeVariableName,
  type ThemeVariables
}
