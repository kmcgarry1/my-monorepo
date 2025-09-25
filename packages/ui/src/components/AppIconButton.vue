<script setup lang="ts">
import AppIcon from './AppIcon.vue'
const props = withDefaults(defineProps<{
  name: 'sword'|'arrows'|'dice'|'plus'|'trash'|'book'|'info'
  variant?: 'default'|'primary'|'secondary'|'danger'|'ghost'|'outline'
  size?: 'xs'|'sm'|'md'
  title?: string
}>(), { variant: 'outline', size: 'sm', title: '' })

const base = 'inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--btn-border)] bg-[color:var(--btn-bg)] text-[color:var(--btn-fg)] transition-all duration-200 select-none shadow-[var(--shadow-button)] hover:border-[color:var(--accent)] hover:shadow-[var(--shadow-button-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-[color:var(--surface)] active:translate-y-[1px]'
const sizes: Record<string, string> = { xs: 'h-7 w-7', sm: 'h-8 w-8', md: 'h-9 w-9' }
const variants: Record<string, string> = {
  default: '',
  primary: 'bg-[color:var(--accent)] text-[color:var(--bg)] border-[color:var(--accent)] shadow-[var(--shadow-button-hover)] hover:shadow-[var(--shadow-button-hover)] focus-visible:ring-[color:var(--accent-strong)]',
  secondary: 'bg-[color:var(--surface-veil)] text-[color:var(--fg)] border-[color:var(--border)]',
  danger: 'bg-[#fb7185] text-white border-[#fb7185] shadow-[var(--shadow-button-hover)] focus-visible:ring-[rgba(251,113,133,0.5)]',
  ghost: 'bg-transparent text-[color:var(--fg)] border-transparent shadow-none hover:border-[color:var(--border)] hover:bg-[color:var(--surface-translucent)] hover:shadow-none focus-visible:ring-[color:var(--accent-weak)]',
  outline: 'bg-transparent text-[color:var(--fg)] border-[color:var(--border)] shadow-none hover:border-[color:var(--accent)] hover:shadow-none',
}
</script>

<template>
  <button :title="props.title" :class="[base, sizes[props.size], variants[props.variant]]">
    <AppIcon :name="props.name" />
  </button>
</template>

