import type { ControlSize, ControlVariant } from '../types'

export type NormalizedControlVariant = 'filled' | 'outlined' | 'text'

const CONTROL_SIZE_CLASS: Record<ControlSize, string> = {
  sm: 'px-3 py-2 text-[0.75rem]',
  md: 'px-3.5 py-2.5 text-[0.82rem]',
  lg: 'px-4 py-3 text-[0.88rem]'
}

const CONTROL_VARIANT_ALIAS: Record<ControlVariant, NormalizedControlVariant> = {
  filled: 'filled',
  outlined: 'outlined',
  outline: 'outlined',
  text: 'text'
}

export const BASE_CONTROL_VARIANT_CLASS: Record<NormalizedControlVariant, string> = {
  filled:
    'bg-[color:var(--surface-translucent)] border border-[color:var(--border-muted)] backdrop-blur-sm focus-visible:ring-offset-[color:var(--surface-translucent)] hover:border-[color:var(--border)]',
  outlined:
    'bg-transparent border border-[color:var(--border)] hover:border-[color:color-mix(in_srgb,var(--accent) 55%, transparent)] focus-visible:ring-offset-[color:var(--surface-translucent)]',
  text:
    'rounded-b-none border-x-0 border-t-0 border-b border-[color:var(--border-muted)] px-0 bg-transparent focus-visible:ring-offset-0 hover:border-[color:color-mix(in_srgb,var(--accent) 55%, transparent)]'
}

export const INVALID_CONTROL_CLASS =
  'border-[color:var(--md-sys-color-error)] focus-visible:ring-[color:var(--md-sys-color-error)] focus-visible:ring-offset-[color:var(--md-sys-color-error-container)]'

export function controlSizeClass(size: ControlSize | undefined): string {
  return CONTROL_SIZE_CLASS[size ?? 'md']
}

export function normalizeControlVariant(
  variant: ControlVariant | undefined,
  fallback: NormalizedControlVariant = 'outlined'
): NormalizedControlVariant {
  return variant ? CONTROL_VARIANT_ALIAS[variant] ?? fallback : fallback
}
