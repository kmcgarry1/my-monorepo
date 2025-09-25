export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

// Button sizes (text buttons)
export const btnSizes: Record<string, string> = {
  xs: 'px-2.5 py-1 text-[0.62rem]',
  sm: 'px-3 py-1.5 text-[0.68rem]',
  md: 'px-4 py-2 text-[0.75rem]',
  lg: 'px-5 py-2.5 text-[0.82rem]',
}

// Icon button sizes (square)
export const iconBtnSizes: Record<string, string> = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
}

// Button variants palette
export const btnVariants: Record<string, string> = {
  default: '',
  primary: 'bg-[color:var(--accent)] text-[color:var(--bg)] border-[color:var(--accent)] shadow-[var(--shadow-button-hover)] hover:shadow-[var(--shadow-button-hover)] focus-visible:ring-[color:var(--accent-strong)]',
  secondary: 'bg-[color:var(--surface-veil)] text-[color:var(--fg)] border-[color:var(--border)]',
  danger: 'bg-[#fb7185] text-white border-[#fb7185] shadow-[var(--shadow-button-hover)] focus-visible:ring-[rgba(251,113,133,0.5)]',
  ghost: 'bg-transparent text-[color:var(--fg)] border-transparent shadow-none hover:border-[color:var(--border)] hover:bg-[color:var(--surface-translucent)] hover:shadow-none focus-visible:ring-[color:var(--accent-weak)]',
  outline: 'bg-transparent text-[color:var(--fg)] border-[color:var(--border)] shadow-none hover:border-[color:var(--accent)] hover:shadow-none',
  subtle: 'bg-transparent text-[color:var(--muted)] border-transparent shadow-none hover:text-[color:var(--fg)] hover:border-[color:var(--border)] hover:shadow-none',
}

export const btnBase = 'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[color:var(--btn-border)] bg-[color:var(--btn-bg)] text-[color:var(--btn-fg)] font-semibold uppercase tracking-[0.16em] transition-all duration-200 select-none shadow-[var(--shadow-button)] hover:border-[color:var(--accent)] hover:shadow-[var(--shadow-button-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-[color:var(--surface)] active:translate-y-[1px]'
