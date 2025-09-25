import {
  applyTheme as applyCoreTheme,
  readStoredTheme,
  storeThemePreference,
  type ThemeName
} from '@my-monorepo/theme'

const LEGACY_THEME_KEY = 'dhsb:theme'

export type Theme = 'system' | ThemeName

function readLegacyTheme(): Theme | null {
  try {
    const legacy = localStorage.getItem(LEGACY_THEME_KEY) as Theme | null
    return legacy ?? null
  } catch {
    return null
  }
}

export function getSavedTheme(): Theme {
  const stored = readStoredTheme()
  if (stored) return stored
  return readLegacyTheme() ?? 'system'
}

export function saveTheme(theme: Theme) {
  if (theme === 'system') {
    storeThemePreference('system')
  } else {
    storeThemePreference(theme)
  }
  try { localStorage.setItem(LEGACY_THEME_KEY, theme) } catch {}
}

export function applyTheme(theme: Theme) {
  applyCoreTheme(theme, { persist: false })
}

