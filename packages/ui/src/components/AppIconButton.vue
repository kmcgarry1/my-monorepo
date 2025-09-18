<script setup lang="ts">
import AppIcon from './AppIcon.vue'
const props = withDefaults(defineProps<{
  name: 'sword'|'arrows'|'dice'|'plus'|'trash'|'book'|'info'
  variant?: 'default'|'primary'|'secondary'|'danger'|'ghost'|'outline'
  size?: 'xs'|'sm'|'md'
  title?: string
}>(), { variant: 'outline', size: 'sm', title: '' })

const base = 'inline-flex items-center justify-center rounded-md border transition-colors select-none'
const sizes: Record<string, string> = { xs: 'h-7 w-7', sm: 'h-8 w-8', md: 'h-9 w-9' }
const variants: Record<string, string> = {
  default: 'bg-[var(--btn-bg)] text-[var(--btn-fg)] border-[var(--btn-border)] hover:border-[var(--accent)]',
  primary: 'bg-[color:var(--accent)] text-white border-[color:var(--accent)] hover:opacity-90',
  secondary: 'bg-[var(--surface-2)] text-[var(--fg)] border-[var(--border)] hover:border-[var(--accent)]',
  danger: 'bg-red-600 text-white border-red-600 hover:opacity-90',
  ghost: 'bg-transparent text-[var(--fg)] border-transparent hover:border-[var(--border)]',
  outline: 'bg-transparent text-[var(--fg)] border-[var(--btn-border)] hover:border-[var(--accent)]',
}
</script>

<template>
  <button :title="props.title" :class="[base, sizes[props.size], variants[props.variant]]">
    <AppIcon :name="props.name" />
  </button>
</template>

