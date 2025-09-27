import {
  applyTheme as applyGlobalTheme,
  initTheme as initGlobalTheme,
  readStoredTheme,
  storeThemePreference,
  themeOptions as baseThemeOptions,
  type ThemeName,
  type ThemePreference,
} from '@my-monorepo/theme'

const THEME_STORAGE_KEY = 'dhsb:theme'

export type Theme = ThemePreference

export const themeOptions = baseThemeOptions

export interface ApplyThemeOptions {
  root?: HTMLElement | null
  persist?: boolean
}

export function applyTheme(theme: Theme, options: ApplyThemeOptions = {}) {
  return applyGlobalTheme(theme, {
    root: options.root,
    storageKey: THEME_STORAGE_KEY,
    persist: options.persist ?? false,
  })
}

export function saveTheme(theme: Theme) {
  storeThemePreference(theme, THEME_STORAGE_KEY)
}

export function getSavedTheme(): Theme {
  return readStoredTheme(THEME_STORAGE_KEY) ?? 'system'
}

export function initTheme(options: { root?: HTMLElement | null; fallback?: Theme } = {}) {
  return initGlobalTheme({
    root: options.root,
    storageKey: THEME_STORAGE_KEY,
    fallback: options.fallback,
    persistComputed: true,
  })
}

export type { ThemeName }
