<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
  disabled?: boolean
}>(), { variant: 'default', size: 'md', block: false, loading: false, disabled: false })

const base = 'inline-flex items-center justify-center rounded-md border transition-colors select-none'
const sizes: Record<string, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
}
const variants: Record<string, string> = {
  default: 'bg-[var(--btn-bg)] text-[var(--btn-fg)] border-[var(--btn-border)] hover:border-[var(--accent)]',
  primary: 'bg-[color:var(--accent)] text-white border-[color:var(--accent)] hover:opacity-90',
  secondary: 'bg-[var(--surface-2)] text-[var(--fg)] border-[var(--border)] hover:border-[var(--accent)]',
  danger: 'bg-red-600 text-white border-red-600 hover:opacity-90',
  ghost: 'bg-transparent text-[var(--fg)] border-transparent hover:border-[var(--border)]',
  outline: 'bg-transparent text-[var(--fg)] border-[var(--btn-border)] hover:border-[var(--accent)]',
  subtle: 'bg-transparent text-[var(--muted)] border-transparent hover:text-[var(--fg)]',
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
