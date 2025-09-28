import type { DesignStyleContext } from '../types'

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

const easeStandard = 'ease-[var(--motion-easing-standard)]'
const durationSM = 'duration-[var(--motion-duration-sm)]'

const sharedButtonBase = [
  'relative inline-flex items-center justify-center gap-2 overflow-hidden select-none border',
  `transition-[box-shadow,transform,background-color,color] ${durationSM} ${easeStandard}`,
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[color:var(--_state-layer-color,transparent)] before:opacity-0 before:transition-opacity before:duration-[var(--motion-duration-sm)]',
  'hover:before:opacity-[var(--md-comp-state-layer-opacity-hover)] focus-visible:before:opacity-[var(--md-comp-state-layer-opacity-focus)] active:before:opacity-[var(--md-comp-state-layer-opacity-pressed)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-comp-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--md-sys-color-surface)]',
  'active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-60',
].join(' ')

const familyAdjustments: Record<DesignStyleContext['family'], string> = {
  material: 'rounded-[var(--radius-md)] font-medium',
  apple:
    'rounded-[calc(var(--radius-xl)*0.75)] font-semibold backdrop-blur-[28px] backdrop-saturate-[180%] bg-clip-padding shadow-[var(--shadow-level2)]',
}

const densityAdjustments: Record<DesignStyleContext['density'], string> = {
  comfortable: '',
  compact: 'text-[0.85rem]',
}

const presetAdjustments: Partial<Record<DesignStyleContext['preset'], string>> = {
  'material3-android': 'rounded-[var(--radius-lg)]',
  'apple-glass': 'rounded-[2.5rem] shadow-[var(--shadow-level3)]',
}

export function buttonBaseForStyle(style: Pick<DesignStyleContext, 'family' | 'density' | 'preset' | 'featureFlags'>) {
  const uppercase = style.featureFlags['buttons.uppercase'] ?? false
  return cx(
    sharedButtonBase,
    familyAdjustments[style.family],
    densityAdjustments[style.density],
    presetAdjustments[style.preset] ?? '',
    uppercase ? 'uppercase tracking-[0.08em]' : 'normal-case tracking-[0.01em]',
  )
}

const iconButtonAdjustments: Partial<Record<DesignStyleContext['preset'], string>> = {
  'material3-android': 'rounded-[var(--radius-lg)]',
  'apple-glass': 'rounded-full',
}

export function iconButtonBaseForStyle(style: Pick<DesignStyleContext, 'family' | 'preset' | 'featureFlags'>) {
  const uppercase = style.featureFlags['buttons.uppercase'] ?? false
  return cx(
    sharedButtonBase,
    familyAdjustments[style.family],
    iconButtonAdjustments[style.preset] ?? '',
    uppercase ? 'uppercase tracking-[0.08em]' : 'normal-case tracking-[0.01em]',
  )
}

// Button sizes follow Material 3 specs
export const btnSizes: Record<string, string> = {
  xs: 'h-8 px-3 text-[0.7rem]',
  sm: 'h-9 px-3.5 text-[0.75rem]',
  md: 'h-10 px-4 text-[0.82rem]',
  lg: 'h-11 px-5 text-[0.9rem]'
}

// Icon button sizes (square) retain Material rhythm
export const iconBtnSizes: Record<string, string> = {
  xs: 'h-8 w-8',
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-11 w-11'
}

const variantStyles: Record<string, string> = {
  filled: [
    'border-transparent',
    'bg-[color:var(--md-comp-button-filled-container)]',
    'text-[color:var(--md-comp-button-filled-on-container)]',
    'shadow-[var(--shadow-level2)]',
    'hover:bg-[color:var(--md-comp-button-filled-container-hover)]',
    'active:shadow-[var(--shadow-level1)]',
    'focus-visible:ring-offset-[color:var(--md-comp-button-filled-container)]',
    "[--_state-layer-color:color-mix(in_srgb,var(--md-comp-button-filled-on-container) 18%,transparent)]"
  ].join(' '),
  tonal: [
    'border-transparent',
    'bg-[color:var(--md-comp-button-tonal-container)]',
    'text-[color:var(--md-comp-button-tonal-on-container)]',
    'shadow-[var(--shadow-level1)]',
    'hover:bg-[color:var(--md-comp-button-tonal-container-hover)]',
    'focus-visible:ring-offset-[color:var(--md-comp-button-tonal-container)]',
    "[--_state-layer-color:color-mix(in_srgb,var(--md-comp-button-tonal-on-container) 18%,transparent)]"
  ].join(' '),
  elevated: [
    'border-transparent',
    'bg-[color:var(--md-comp-button-elevated-container)]',
    'text-[color:var(--md-comp-button-elevated-on-container)]',
    'shadow-[var(--shadow-level2)]',
    'hover:bg-[color:var(--md-comp-button-elevated-container-hover)]',
    'hover:shadow-[var(--shadow-level3)]',
    'active:shadow-[var(--shadow-level1)]',
    "[--_state-layer-color:color-mix(in_srgb,var(--md-comp-button-elevated-on-container) 14%,transparent)]"
  ].join(' '),
  outlined: [
    'border-[color:var(--md-comp-button-outlined-outline)]',
    'bg-transparent',
    'text-[color:var(--md-comp-button-text-label)]',
    'hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]',
    "[--_state-layer-color:color-mix(in_srgb,var(--md-comp-button-text-label) 14%,transparent)]"
  ].join(' '),
  text: [
    'border-transparent',
    'bg-transparent',
    'text-[color:var(--md-comp-button-text-label)]',
    'hover:bg-[color:var(--md-comp-button-text-hover-layer)]',
    "[--_state-layer-color:color-mix(in_srgb,var(--md-comp-button-text-label) 14%,transparent)]"
  ].join(' '),
  ghost: [
    'border-transparent',
    'bg-transparent',
    'text-[color:var(--md-comp-button-ghost-label)]',
    'hover:bg-[color:var(--md-comp-button-ghost-hover-layer)]',
    "[--_state-layer-color:color-mix(in_srgb,var(--md-comp-button-ghost-label) 16%,transparent)]"
  ].join(' '),
  surface: [
    'border-[color:var(--md-sys-color-outline-variant)]',
    'bg-[color:var(--md-sys-color-surface-container-high)]',
    'text-[color:var(--md-sys-color-on-surface)]',
    'hover:bg-[color:var(--md-sys-color-surface-container-highest)]',
    "[--_state-layer-color:color-mix(in_srgb,var(--md-sys-color-on-surface) 12%,transparent)]"
  ].join(' '),
  danger: [
    'border-transparent',
    'bg-[color:var(--md-comp-button-danger-container)]',
    'text-[color:var(--md-comp-button-danger-on-container)]',
    'hover:bg-[color:var(--md-comp-button-danger-container-hover)]',
    'focus-visible:ring-offset-[color:var(--md-comp-button-danger-container)]',
    "[--_state-layer-color:color-mix(in_srgb,var(--md-comp-button-danger-on-container) 18%,transparent)]"
  ].join(' '),
  success: [
    'border-transparent',
    'bg-[color:var(--md-comp-button-success-container)]',
    'text-[color:var(--md-comp-button-success-on-container)]',
    'hover:bg-[color:var(--md-comp-button-success-container-hover)]',
    'focus-visible:ring-offset-[color:var(--md-comp-button-success-container)]',
    "[--_state-layer-color:color-mix(in_srgb,var(--md-comp-button-success-on-container) 18%,transparent)]"
  ].join(' ')
}

export const btnVariants: Record<string, string> = {
  ...variantStyles,
  default: variantStyles.elevated,
  primary: variantStyles.filled,
  accent: variantStyles.filled,
  filled: variantStyles.filled,
  tonal: variantStyles.tonal,
  secondary: variantStyles.tonal,
  'filled-tonal': variantStyles.tonal,
  elevated: variantStyles.elevated,
  outline: variantStyles.outlined,
  outlined: variantStyles.outlined,
  text: variantStyles.text,
  ghost: variantStyles.ghost,
  surface: variantStyles.surface,
  subtle: variantStyles.surface,
  danger: variantStyles.danger,
  success: variantStyles.success
}

export const btnBase = sharedButtonBase
