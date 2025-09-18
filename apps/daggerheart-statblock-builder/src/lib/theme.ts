const THEME_KEY = 'dhsb:theme'
export type Theme = 'system' | 'slate' | 'parchment' | 'emerald' | 'midnight'

export function getSavedTheme(): Theme {
  try {
    const t = localStorage.getItem(THEME_KEY) as Theme | null
    return t ?? 'system'
  } catch { return 'system' }
}

export function saveTheme(theme: Theme) {
  try { localStorage.setItem(THEME_KEY, theme) } catch {}
}

export function applyTheme(theme: Theme) {
  const el = document.documentElement
  if (theme === 'system') {
    el.removeAttribute('data-theme')
  } else {
    el.setAttribute('data-theme', theme)
  }
}

