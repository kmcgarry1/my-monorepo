export const fonts = {
  sans: "'Space Grotesk', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Source Code Pro', monospace",
  wide: "'Space Grotesk', 'Orbitron', 'Inter', sans-serif"
} as const

export const radii = {
  xs: '0.35rem',
  sm: '0.65rem',
  md: '0.9rem',
  lg: '1.25rem',
  xl: '1.75rem',
  pill: '999px'
} as const

export const transitions = {
  fast: '140ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  base: '220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  spring: '260ms cubic-bezier(0.16, 0.84, 0.44, 1)'
} as const

export const shadows = {
  button: '0 12px 30px -22px rgba(34, 211, 238, 0.8), inset 0 0 0 1px rgba(255,255,255,0.04)',
  buttonHover: '0 18px 40px -22px rgba(244, 114, 208, 0.75), inset 0 0 0 1px rgba(255,255,255,0.06)',
  card: '0 30px 80px -50px rgba(16, 20, 60, 0.95), 0 0 0 1px rgba(34, 211, 238, 0.18)',
  elevated: '0 24px 70px -35px rgba(12, 13, 40, 0.95), 0 0 0 1px rgba(56, 189, 248, 0.25)',
  glow: '0 0 0 1px rgba(244, 114, 208, 0.4), 0 0 35px rgba(244, 114, 208, 0.22)'
} as const

const cyberpunkVars = {
  '--cp-color-bg': '#05060a',
  '--cp-color-surface': '#0f1325',
  '--cp-color-surface-2': '#171c38',
  '--cp-color-border-soft': 'rgba(56, 189, 248, 0.24)',
  '--cp-color-border-strong': 'rgba(244, 114, 208, 0.45)',
  '--cp-color-border-muted': 'rgba(148, 163, 184, 0.2)',
  '--cp-color-text': '#ecf2ff',
  '--cp-color-text-muted': '#94a3b8',
  '--cp-color-accent': '#f472d0',
  '--cp-color-accent-weak': 'rgba(244, 114, 208, 0.16)',
  '--cp-color-accent-strong': '#22d3ee',
  '--cp-color-positive': '#4ade80',
  '--cp-color-warning': '#facc15',
  '--cp-color-danger': '#fb7185',
  '--cp-color-link': '#38bdf8',
  '--cp-button-bg': 'rgba(15, 23, 42, 0.72)',
  '--cp-button-fg': '#f8fafc',
  '--cp-button-border': 'rgba(148, 163, 184, 0.32)',
  '--cp-button-border-strong': 'rgba(244, 114, 208, 0.45)',
  '--cp-surface-translucent': 'color-mix(in srgb, #0f1325 92%, transparent)',
  '--cp-surface-veil': 'color-mix(in srgb, #171c38 78%, transparent)',
  '--cp-surface-panel': 'color-mix(in srgb, #171c38 65%, transparent)',
  '--cp-overlay': 'rgba(5, 6, 10, 0.55)',
  '--cp-gradient-bg': 'radial-gradient(120% 120% at 0% 0%, rgba(244, 114, 208, 0.14) 0%, transparent 58%), radial-gradient(120% 120% at 100% 0%, rgba(34, 211, 238, 0.12) 0%, transparent 60%), radial-gradient(180% 150% at 50% 100%, rgba(15, 23, 42, 0.85) 0%, rgba(5, 6, 10, 0.95) 100%)'
} as const

const neonNoirVars = {
  '--cp-color-bg': '#04050f',
  '--cp-color-surface': '#0e1324',
  '--cp-color-surface-2': '#161b33',
  '--cp-color-border-soft': 'rgba(96, 165, 250, 0.28)',
  '--cp-color-border-strong': 'rgba(56, 189, 248, 0.48)',
  '--cp-color-border-muted': 'rgba(79, 70, 229, 0.2)',
  '--cp-color-text': '#dfe7ff',
  '--cp-color-text-muted': '#9ca3c7',
  '--cp-color-accent': '#818cf8',
  '--cp-color-accent-weak': 'rgba(129, 140, 248, 0.18)',
  '--cp-color-accent-strong': '#38bdf8',
  '--cp-color-positive': '#34d399',
  '--cp-color-warning': '#fbbf24',
  '--cp-color-danger': '#f87171',
  '--cp-color-link': '#60a5fa',
  '--cp-button-bg': 'rgba(12, 19, 44, 0.78)',
  '--cp-button-fg': '#f5f7ff',
  '--cp-button-border': 'rgba(129, 140, 248, 0.32)',
  '--cp-button-border-strong': 'rgba(56, 189, 248, 0.45)',
  '--cp-surface-translucent': 'color-mix(in srgb, #0e1324 90%, transparent)',
  '--cp-surface-veil': 'color-mix(in srgb, #161b33 74%, transparent)',
  '--cp-surface-panel': 'color-mix(in srgb, #161b33 62%, transparent)',
  '--cp-overlay': 'rgba(4, 7, 17, 0.6)',
  '--cp-gradient-bg': 'radial-gradient(140% 120% at 0% 0%, rgba(129, 140, 248, 0.16) 0%, transparent 55%), radial-gradient(120% 120% at 100% 0%, rgba(56, 189, 248, 0.12) 0%, transparent 60%), radial-gradient(160% 140% at 50% 100%, rgba(8, 11, 26, 0.9) 0%, rgba(4, 5, 15, 0.96) 100%)'
} as const

const synthwaveDawnVars = {
  '--cp-color-bg': '#14040f',
  '--cp-color-surface': '#1d0821',
  '--cp-color-surface-2': '#2a1033',
  '--cp-color-border-soft': 'rgba(249, 115, 22, 0.28)',
  '--cp-color-border-strong': 'rgba(236, 72, 153, 0.45)',
  '--cp-color-border-muted': 'rgba(253, 186, 116, 0.2)',
  '--cp-color-text': '#ffeefc',
  '--cp-color-text-muted': '#f9a8d4',
  '--cp-color-accent': '#ec4899',
  '--cp-color-accent-weak': 'rgba(236, 72, 153, 0.2)',
  '--cp-color-accent-strong': '#facc15',
  '--cp-color-positive': '#4ade80',
  '--cp-color-warning': '#fbbf24',
  '--cp-color-danger': '#fb7185',
  '--cp-color-link': '#f472b6',
  '--cp-button-bg': 'rgba(45, 14, 62, 0.78)',
  '--cp-button-fg': '#fff5fb',
  '--cp-button-border': 'rgba(236, 72, 153, 0.35)',
  '--cp-button-border-strong': 'rgba(250, 204, 21, 0.4)',
  '--cp-surface-translucent': 'color-mix(in srgb, #1d0821 92%, transparent)',
  '--cp-surface-veil': 'color-mix(in srgb, #2a1033 74%, transparent)',
  '--cp-surface-panel': 'color-mix(in srgb, #2a1033 64%, transparent)',
  '--cp-overlay': 'rgba(17, 6, 24, 0.62)',
  '--cp-gradient-bg': 'radial-gradient(130% 140% at 0% 0%, rgba(236, 72, 153, 0.18) 0%, transparent 60%), radial-gradient(140% 120% at 100% 0%, rgba(250, 204, 21, 0.12) 0%, transparent 60%), radial-gradient(160% 150% at 50% 100%, rgba(30, 8, 45, 0.92) 0%, rgba(14, 4, 19, 0.96) 100%)'
} as const

export const themeVariables = {
  'cyberpunk': cyberpunkVars,
  'neon-noir': neonNoirVars,
  'synthwave-dawn': synthwaveDawnVars
} as const

export type ThemeName = keyof typeof themeVariables
export type ThemeVariables = typeof themeVariables[ThemeName]
export type ThemeVariableName = keyof ThemeVariables

export const themeOrder: ThemeName[] = ['cyberpunk', 'neon-noir', 'synthwave-dawn']

export const defaultThemeName: ThemeName = 'cyberpunk'

export const themeMeta: Record<ThemeName, { label: string; description: string; accent: string }> = {
  'cyberpunk': {
    label: 'Cyberpunk Pulse',
    description: 'Electric magenta and cyan pulses with deep midnight surfaces.',
    accent: '#f472d0'
  },
  'neon-noir': {
    label: 'Neon Noir',
    description: 'Moody indigo base with luminous periwinkle and cyan edges.',
    accent: '#818cf8'
  },
  'synthwave-dawn': {
    label: 'Synthwave Dawn',
    description: 'Sunrise magentas and amber glows inspired by 80s album art.',
    accent: '#ec4899'
  }
}

export function isThemeName(value: string): value is ThemeName {
  return themeOrder.includes(value as ThemeName)
}

export const themeVariablesList: ThemeVariableName[] = Object.keys(cyberpunkVars) as ThemeVariableName[]
