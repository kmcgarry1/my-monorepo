export type ThemeId = 'material-light' | 'material-dark' | 'apple-light' | 'apple-dark'

export interface ThemeDefinition {
  id: ThemeId
  label: string
  description: string
  family: 'material' | 'apple'
  mode: 'light' | 'dark'
  accent: string
  tokens: Record<string, string>
}

const fontStack = "'Inter', 'SF Pro Text', 'SF Pro Display', 'Segoe UI', 'Roboto', sans-serif"

const sharedTokens = {
  'motion-duration-xs': '120ms',
  'motion-duration-sm': '160ms',
  'motion-duration-md': '220ms',
  'motion-duration-lg': '320ms',
  'motion-easing-emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
  'motion-easing-standard': 'cubic-bezier(0.2, 0, 0.38, 0.9)',
  'motion-easing-decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
  'motion-easing-accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
  'motion-easing-emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  'motion-easing-emphasized-accelerate': 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  'radius-md': '0.9rem',
  'radius-lg': '1.35rem',
  'radius-xl': '1.9rem',
  'radius-pill': '999px',
  'space-sm': '0.75rem',
  'space-md': '1.25rem',
  'space-lg': '2.2rem'
} as const

const materialLight: ThemeDefinition = {
  id: 'material-light',
  label: 'Material You (Light)',
  description: 'Soft surfaces, expressive primary color, and elevated depth inspired by Material Design 3.',
  family: 'material',
  mode: 'light',
  accent: '#6750A4',
  tokens: {
    'font-sans': fontStack,
    bg: '#f7f2fa',
    fg: '#1c1b1f',
    link: '#6750a4',
    surface: '#fffbfe',
    'surface-veil': 'rgba(103, 80, 164, 0.08)',
    'surface-translucent': 'rgba(255, 255, 255, 0.85)',
    border: 'rgba(103, 80, 164, 0.18)',
    muted: '#625b71',
    accent: '#6750a4',
    'accent-weak': '#eaddff',
    'enemy-accent': '#b3261e',
    'env-accent': '#2f6f3d',
    'md-sys-color-primary': '#6750a4',
    'md-sys-color-secondary': '#625b71',
    'md-sys-color-on-surface': '#1c1b1f',
    'md-sys-color-on-surface-variant': '#49454f',
    'shadow-level1': '0 16px 32px rgba(103, 80, 164, 0.12)',
    'shadow-level2': '0 28px 56px rgba(103, 80, 164, 0.18)',
    'shadow-elevated': '0 32px 60px rgba(103, 80, 164, 0.16)',
    ...sharedTokens
  }
}

const materialDark: ThemeDefinition = {
  id: 'material-dark',
  label: 'Material You (Dark)',
  description: 'Vibrant accents that float above rich tonal surfaces for Material Design 3 in the dark.',
  family: 'material',
  mode: 'dark',
  accent: '#d0bcff',
  tokens: {
    'font-sans': fontStack,
    bg: '#141218',
    fg: '#e6e1e5',
    link: '#d0bcff',
    surface: '#1d1b20',
    'surface-veil': 'rgba(208, 188, 255, 0.12)',
    'surface-translucent': 'rgba(29, 27, 32, 0.78)',
    border: 'rgba(208, 188, 255, 0.24)',
    muted: '#cac4d0',
    accent: '#d0bcff',
    'accent-weak': 'rgba(208, 188, 255, 0.24)',
    'enemy-accent': '#ffb4ab',
    'env-accent': '#8cdc90',
    'md-sys-color-primary': '#d0bcff',
    'md-sys-color-secondary': '#ccc2dc',
    'md-sys-color-on-surface': '#e6e1e5',
    'md-sys-color-on-surface-variant': '#cac4d0',
    'shadow-level1': '0 16px 32px rgba(3, 0, 24, 0.32)',
    'shadow-level2': '0 28px 56px rgba(3, 0, 24, 0.46)',
    'shadow-elevated': '0 32px 60px rgba(3, 0, 24, 0.36)',
    ...sharedTokens
  }
}

const appleLight: ThemeDefinition = {
  id: 'apple-light',
  label: 'Apple Fluent (Light)',
  description: 'Translucent layers, vibrant blues, and refined contrast inspired by the latest Apple design language.',
  family: 'apple',
  mode: 'light',
  accent: '#0a84ff',
  tokens: {
    'font-sans': "'SF Pro Text', 'SF Pro Display', 'Inter', 'Helvetica Neue', 'Arial', sans-serif",
    bg: '#f5f5f7',
    fg: '#1d1d1f',
    link: '#0a84ff',
    surface: '#ffffff',
    'surface-veil': 'rgba(10, 132, 255, 0.08)',
    'surface-translucent': 'rgba(255, 255, 255, 0.82)',
    border: 'rgba(60, 60, 67, 0.18)',
    muted: 'rgba(60, 60, 67, 0.72)',
    accent: '#0a84ff',
    'accent-weak': 'rgba(10, 132, 255, 0.22)',
    'enemy-accent': '#ff375f',
    'env-accent': '#30d158',
    'md-sys-color-primary': '#0a84ff',
    'md-sys-color-secondary': '#5e5ce6',
    'md-sys-color-on-surface': '#1d1d1f',
    'md-sys-color-on-surface-variant': 'rgba(60, 60, 67, 0.64)',
    'shadow-level1': '0 14px 28px rgba(15, 15, 20, 0.12)',
    'shadow-level2': '0 22px 44px rgba(15, 15, 20, 0.14)',
    'shadow-elevated': '0 28px 48px rgba(15, 15, 20, 0.12)',
    ...sharedTokens,
    'radius-md': '0.8rem',
    'radius-lg': '1.1rem',
    'radius-xl': '1.6rem'
  }
}

const appleDark: ThemeDefinition = {
  id: 'apple-dark',
  label: 'Apple Fluent (Dark)',
  description: 'High-contrast typography and luminous color pops for an Apple-style dark appearance.',
  family: 'apple',
  mode: 'dark',
  accent: '#409cff',
  tokens: {
    'font-sans': "'SF Pro Text', 'SF Pro Display', 'Inter', 'Helvetica Neue', 'Arial', sans-serif",
    bg: '#1c1c1e',
    fg: '#f2f2f7',
    link: '#409cff',
    surface: '#2c2c2e',
    'surface-veil': 'rgba(64, 156, 255, 0.12)',
    'surface-translucent': 'rgba(44, 44, 46, 0.78)',
    border: 'rgba(84, 84, 88, 0.42)',
    muted: 'rgba(235, 235, 245, 0.65)',
    accent: '#409cff',
    'accent-weak': 'rgba(64, 156, 255, 0.26)',
    'enemy-accent': '#ff375f',
    'env-accent': '#32d74b',
    'md-sys-color-primary': '#409cff',
    'md-sys-color-secondary': '#64d2ff',
    'md-sys-color-on-surface': '#f2f2f7',
    'md-sys-color-on-surface-variant': 'rgba(235, 235, 245, 0.72)',
    'shadow-level1': '0 18px 34px rgba(5, 5, 10, 0.42)',
    'shadow-level2': '0 24px 52px rgba(5, 5, 10, 0.46)',
    'shadow-elevated': '0 28px 60px rgba(5, 5, 10, 0.38)',
    ...sharedTokens,
    'radius-md': '0.8rem',
    'radius-lg': '1.1rem',
    'radius-xl': '1.6rem'
  }
}

export const themeDefinitions: Record<ThemeId, ThemeDefinition> = {
  'material-light': materialLight,
  'material-dark': materialDark,
  'apple-light': appleLight,
  'apple-dark': appleDark
}

export const themeOptions = Object.values(themeDefinitions).map((def) => ({
  value: def.id,
  label: def.label,
  description: def.description,
  family: def.family,
  mode: def.mode,
  accent: def.accent
}))
