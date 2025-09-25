<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
  disabled?: boolean
}>(), { variant: 'default', size: 'md', block: false, loading: false, disabled: false })

const base = 'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[color:var(--btn-border)] bg-[color:var(--btn-bg)] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--btn-fg)] transition-all duration-200 select-none shadow-[var(--shadow-button)] hover:border-[color:var(--accent)] hover:shadow-[var(--shadow-button-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-[color:var(--surface)] active:translate-y-[1px]'
const sizes: Record<string, string> = {
  xs: 'px-2.5 py-1 text-[0.62rem]',
  sm: 'px-3 py-1.5 text-[0.68rem]',
  md: 'px-4 py-2 text-[0.75rem]',
  lg: 'px-5 py-2.5 text-[0.82rem]',
}
const variants: Record<string, string> = {
  default: '',
  primary: 'bg-[color:var(--accent)] text-[color:var(--bg)] border-[color:var(--accent)] shadow-[var(--shadow-button-hover)] hover:shadow-[var(--shadow-button-hover)] focus-visible:ring-[color:var(--accent-strong)]',
  secondary: 'bg-[color:var(--surface-veil)] text-[color:var(--fg)] border-[color:var(--border)]',
  danger: 'bg-[#fb7185] text-white border-[#fb7185] shadow-[var(--shadow-button-hover)] focus-visible:ring-[rgba(251,113,133,0.5)]',
  ghost: 'bg-transparent text-[color:var(--fg)] border-transparent shadow-none hover:border-[color:var(--border)] hover:bg-[color:var(--surface-translucent)] hover:shadow-none focus-visible:ring-[color:var(--accent-weak)]',
  outline: 'bg-transparent text-[color:var(--fg)] border-[color:var(--border)] shadow-none hover:border-[color:var(--accent)] hover:shadow-none',
  subtle: 'bg-transparent text-[color:var(--muted)] border-transparent shadow-none hover:text-[color:var(--fg)] hover:border-[color:var(--border)] hover:shadow-none',
}
</script>

<template>
  <button :disabled="props.disabled || props.loading" :class="[base, sizes[props.size], variants[props.variant], props.block ? 'w-full' : '', (props.disabled||props.loading) ? 'opacity-60 cursor-not-allowed' : '']">
    <svg v-if="props.loading" class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
      <path class="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke-width="4" />
    </svg>
    <slot />
  </button>
</template>
