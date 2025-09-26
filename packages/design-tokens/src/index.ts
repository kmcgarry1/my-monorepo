export const fonts = {
  sans: "'Roboto Flex', 'Noto Sans', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  mono: "'Roboto Mono', 'JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Source Code Pro', monospace",
  display: "'Google Sans Display', 'Roboto Flex', 'Segoe UI', system-ui, sans-serif"
} as const

export const radii = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  pill: '999px'
} as const

export const transitions = {
  micro: '120ms cubic-bezier(0.2, 0, 0, 1)',
  short: '160ms cubic-bezier(0.2, 0, 0, 1)',
  medium: '220ms cubic-bezier(0.2, 0, 0, 1)',
  long: '320ms cubic-bezier(0.2, 0, 0, 1)',
  emphasized: '220ms cubic-bezier(0.05, 0.7, 0.1, 1)'
} as const

export const shadows = {
  level1: '0 1px 2px 0 rgba(15, 23, 42, 0.08), 0 1px 3px 1px rgba(15, 23, 42, 0.12)',
  level2: '0 2px 6px 2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.12)',
  level3: '0 6px 10px 4px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.12)',
  level4: '0 8px 12px 6px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.16)',
  level5: '0 12px 20px 8px rgba(15, 23, 42, 0.14), 0 6px 8px -4px rgba(15, 23, 42, 0.2)'
} as const

const materialIndigoVars = {
  '--md-sys-color-primary': '#6750A4',
  '--md-sys-color-on-primary': '#FFFFFF',
  '--md-sys-color-primary-container': '#EADDFF',
  '--md-sys-color-on-primary-container': '#21005D',
  '--md-sys-color-secondary': '#625B71',
  '--md-sys-color-on-secondary': '#FFFFFF',
  '--md-sys-color-secondary-container': '#E8DEF8',
  '--md-sys-color-on-secondary-container': '#1D192B',
  '--md-sys-color-tertiary': '#7D5260',
  '--md-sys-color-on-tertiary': '#FFFFFF',
  '--md-sys-color-tertiary-container': '#FFD8E4',
  '--md-sys-color-on-tertiary-container': '#31111D',
  '--md-sys-color-background': '#FFFBFE',
  '--md-sys-color-on-background': '#1C1B1F',
  '--md-sys-color-surface': '#FFFBFE',
  '--md-sys-color-on-surface': '#1C1B1F',
  '--md-sys-color-surface-variant': '#E7E0EC',
  '--md-sys-color-on-surface-variant': '#49454F',
  '--md-sys-color-outline': '#79747E',
  '--md-sys-color-outline-variant': '#CAC4D0',
  '--md-sys-color-shadow': '#000000',
  '--md-sys-color-scrim': '#000000',
  '--md-sys-color-surface-tint': '#6750A4',
  '--md-sys-color-inverse-surface': '#313033',
  '--md-sys-color-inverse-on-surface': '#F4EFF4',
  '--md-sys-color-inverse-primary': '#D0BCFF',
  '--md-sys-color-surface-container-lowest': '#FFFFFF',
  '--md-sys-color-surface-container-low': '#F7F2FA',
  '--md-sys-color-surface-container': '#F3EDF7',
  '--md-sys-color-surface-container-high': '#ECE6F0',
  '--md-sys-color-surface-container-highest': '#E6E0E9',
  '--md-sys-color-error': '#B3261E',
  '--md-sys-color-on-error': '#FFFFFF',
  '--md-sys-color-error-container': '#F9DEDC',
  '--md-sys-color-on-error-container': '#410E0B',
  '--md-sys-color-success': '#2E7D32',
  '--md-sys-color-on-success': '#FFFFFF',
  '--md-sys-color-success-container': '#C8E6C9',
  '--md-sys-color-on-success-container': '#0F3813',
  '--md-comp-button-filled-container': 'var(--md-sys-color-primary)',
  '--md-comp-button-filled-on-container': 'var(--md-sys-color-on-primary)',
  '--md-comp-button-tonal-container': 'var(--md-sys-color-secondary-container)',
  '--md-comp-button-tonal-on-container': 'var(--md-sys-color-on-secondary-container)',
  '--md-comp-button-elevated-container': 'var(--md-sys-color-surface-container-high)',
  '--md-comp-button-elevated-on-container': 'var(--md-sys-color-on-surface)',
  '--md-comp-button-outlined-outline': 'var(--md-sys-color-outline)',
  '--md-comp-button-text-label': 'var(--md-sys-color-primary)',
  '--md-comp-button-ghost-label': 'var(--md-sys-color-on-surface-variant)',
  '--md-comp-button-danger-container': 'var(--md-sys-color-error)',
  '--md-comp-button-danger-on-container': 'var(--md-sys-color-on-error)',
  '--md-comp-button-success-container': 'var(--md-sys-color-success)',
  '--md-comp-button-success-on-container': 'var(--md-sys-color-on-success)',
  '--md-comp-focus-ring': 'var(--md-sys-color-primary)',
  '--md-comp-state-layer-opacity-hover': '0.08',
  '--md-comp-state-layer-opacity-focus': '0.12',
  '--md-comp-state-layer-opacity-pressed': '0.12'
} as const

const materialEmeraldVars = {
  '--md-sys-color-primary': '#256F3A',
  '--md-sys-color-on-primary': '#FFFFFF',
  '--md-sys-color-primary-container': '#A4F2B7',
  '--md-sys-color-on-primary-container': '#00210C',
  '--md-sys-color-secondary': '#4F6354',
  '--md-sys-color-on-secondary': '#FFFFFF',
  '--md-sys-color-secondary-container': '#D1E8D4',
  '--md-sys-color-on-secondary-container': '#0D1F13',
  '--md-sys-color-tertiary': '#3A6473',
  '--md-sys-color-on-tertiary': '#FFFFFF',
  '--md-sys-color-tertiary-container': '#BEEAF4',
  '--md-sys-color-on-tertiary-container': '#001F27',
  '--md-sys-color-background': '#F6FFF4',
  '--md-sys-color-on-background': '#191C19',
  '--md-sys-color-surface': '#F6FFF4',
  '--md-sys-color-on-surface': '#191C19',
  '--md-sys-color-surface-variant': '#DBE5D8',
  '--md-sys-color-on-surface-variant': '#3F4A40',
  '--md-sys-color-outline': '#70796E',
  '--md-sys-color-outline-variant': '#C0C9BC',
  '--md-sys-color-shadow': '#000000',
  '--md-sys-color-scrim': '#000000',
  '--md-sys-color-surface-tint': '#256F3A',
  '--md-sys-color-inverse-surface': '#2D312D',
  '--md-sys-color-inverse-on-surface': '#F0F2EE',
  '--md-sys-color-inverse-primary': '#8DD69D',
  '--md-sys-color-surface-container-lowest': '#FFFFFF',
  '--md-sys-color-surface-container-low': '#EBF6EA',
  '--md-sys-color-surface-container': '#E1ECE0',
  '--md-sys-color-surface-container-high': '#D6E1D5',
  '--md-sys-color-surface-container-highest': '#CBD6CB',
  '--md-sys-color-error': '#BA1A1A',
  '--md-sys-color-on-error': '#FFFFFF',
  '--md-sys-color-error-container': '#FFDAD6',
  '--md-sys-color-on-error-container': '#410002',
  '--md-sys-color-success': '#2E7D32',
  '--md-sys-color-on-success': '#FFFFFF',
  '--md-sys-color-success-container': '#C8E6C9',
  '--md-sys-color-on-success-container': '#0F3813',
  '--md-comp-button-filled-container': 'var(--md-sys-color-primary)',
  '--md-comp-button-filled-on-container': 'var(--md-sys-color-on-primary)',
  '--md-comp-button-tonal-container': 'var(--md-sys-color-secondary-container)',
  '--md-comp-button-tonal-on-container': 'var(--md-sys-color-on-secondary-container)',
  '--md-comp-button-elevated-container': 'var(--md-sys-color-surface-container-high)',
  '--md-comp-button-elevated-on-container': 'var(--md-sys-color-on-surface)',
  '--md-comp-button-outlined-outline': 'var(--md-sys-color-outline)',
  '--md-comp-button-text-label': 'var(--md-sys-color-primary)',
  '--md-comp-button-ghost-label': 'var(--md-sys-color-on-surface-variant)',
  '--md-comp-button-danger-container': 'var(--md-sys-color-error)',
  '--md-comp-button-danger-on-container': 'var(--md-sys-color-on-error)',
  '--md-comp-button-success-container': 'var(--md-sys-color-success)',
  '--md-comp-button-success-on-container': 'var(--md-sys-color-on-success)',
  '--md-comp-focus-ring': 'var(--md-sys-color-primary)',
  '--md-comp-state-layer-opacity-hover': '0.08',
  '--md-comp-state-layer-opacity-focus': '0.12',
  '--md-comp-state-layer-opacity-pressed': '0.12'
} as const

const materialMidnightVars = {
  '--md-sys-color-primary': '#D0BCFF',
  '--md-sys-color-on-primary': '#381E72',
  '--md-sys-color-primary-container': '#4F378B',
  '--md-sys-color-on-primary-container': '#EADDFF',
  '--md-sys-color-secondary': '#CCC2DC',
  '--md-sys-color-on-secondary': '#332D41',
  '--md-sys-color-secondary-container': '#4A4458',
  '--md-sys-color-on-secondary-container': '#E8DEF8',
  '--md-sys-color-tertiary': '#EFB8C8',
  '--md-sys-color-on-tertiary': '#492532',
  '--md-sys-color-tertiary-container': '#633B48',
  '--md-sys-color-on-tertiary-container': '#FFD8E4',
  '--md-sys-color-background': '#1C1B1F',
  '--md-sys-color-on-background': '#E6E1E5',
  '--md-sys-color-surface': '#1C1B1F',
  '--md-sys-color-on-surface': '#E6E1E5',
  '--md-sys-color-surface-variant': '#49454F',
  '--md-sys-color-on-surface-variant': '#CAC4D0',
  '--md-sys-color-outline': '#938F99',
  '--md-sys-color-outline-variant': '#49454F',
  '--md-sys-color-shadow': '#000000',
  '--md-sys-color-scrim': '#000000',
  '--md-sys-color-surface-tint': '#D0BCFF',
  '--md-sys-color-inverse-surface': '#E6E1E5',
  '--md-sys-color-inverse-on-surface': '#313033',
  '--md-sys-color-inverse-primary': '#6750A4',
  '--md-sys-color-surface-container-lowest': '#0F0D13',
  '--md-sys-color-surface-container-low': '#1D1B20',
  '--md-sys-color-surface-container': '#211F26',
  '--md-sys-color-surface-container-high': '#2B2930',
  '--md-sys-color-surface-container-highest': '#36343B',
  '--md-sys-color-error': '#F2B8B5',
  '--md-sys-color-on-error': '#601410',
  '--md-sys-color-error-container': '#8C1D18',
  '--md-sys-color-on-error-container': '#F9DEDC',
  '--md-sys-color-success': '#8EDFA5',
  '--md-sys-color-on-success': '#003915',
  '--md-sys-color-success-container': '#135727',
  '--md-sys-color-on-success-container': '#BEECC6',
  '--md-comp-button-filled-container': 'var(--md-sys-color-primary)',
  '--md-comp-button-filled-on-container': 'var(--md-sys-color-on-primary)',
  '--md-comp-button-tonal-container': 'var(--md-sys-color-secondary-container)',
  '--md-comp-button-tonal-on-container': 'var(--md-sys-color-on-secondary-container)',
  '--md-comp-button-elevated-container': 'var(--md-sys-color-surface-container-high)',
  '--md-comp-button-elevated-on-container': 'var(--md-sys-color-on-surface)',
  '--md-comp-button-outlined-outline': 'var(--md-sys-color-outline)',
  '--md-comp-button-text-label': 'var(--md-sys-color-primary)',
  '--md-comp-button-ghost-label': 'var(--md-sys-color-on-surface-variant)',
  '--md-comp-button-danger-container': 'var(--md-sys-color-error)',
  '--md-comp-button-danger-on-container': 'var(--md-sys-color-on-error)',
  '--md-comp-button-success-container': 'var(--md-sys-color-success)',
  '--md-comp-button-success-on-container': 'var(--md-sys-color-on-success)',
  '--md-comp-focus-ring': 'var(--md-sys-color-primary)',
  '--md-comp-state-layer-opacity-hover': '0.08',
  '--md-comp-state-layer-opacity-focus': '0.12',
  '--md-comp-state-layer-opacity-pressed': '0.16'
} as const

export const themeVariables = {
  'material-indigo': materialIndigoVars,
  'material-emerald': materialEmeraldVars,
  'material-midnight': materialMidnightVars
} as const

export type ThemeName = keyof typeof themeVariables
export type ThemeVariables = typeof themeVariables[ThemeName]
export type ThemeVariableName = keyof ThemeVariables

export const themeOrder: ThemeName[] = ['material-indigo', 'material-emerald', 'material-midnight']

export const defaultThemeName: ThemeName = 'material-indigo'

export const themeMeta: Record<ThemeName, { label: string; description: string; accent: string }> = {
  'material-indigo': {
    label: 'Material Indigo',
    description: 'Warm purple primaries and soft neutrals inspired by Material 3 defaults.',
    accent: '#6750A4'
  },
  'material-emerald': {
    label: 'Material Emerald',
    description: 'Fresh botanical greens with airy surfaces and calming contrasts.',
    accent: '#256F3A'
  },
  'material-midnight': {
    label: 'Material Midnight',
    description: 'Moody dark surfaces with luminous lilac and blush highlights.',
    accent: '#D0BCFF'
  }
}

export function isThemeName(value: string): value is ThemeName {
  return themeOrder.includes(value as ThemeName)
}

export const themeVariablesList: ThemeVariableName[] = Object.keys(materialIndigoVars) as ThemeVariableName[]
