<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '../utils/variants'

const sizeMap: Record<'xs'|'sm'|'md', string> = {
  xs: 'px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.16em]',
  sm: 'px-2.5 py-0.5 text-[0.72rem] uppercase tracking-[0.16em]',
  md: 'px-3 py-1 text-[0.78rem] uppercase tracking-[0.16em]'
}

const variantMap: Record<string, string> = {
  surface: 'bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)] border-[color:var(--md-sys-color-outline-variant)]',
  primary: 'bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] border-[color:var(--md-sys-color-primary)]',
  accent: 'bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)] border-[color:var(--md-sys-color-primary)]',
  neutral: 'bg-[color:var(--md-sys-color-surface-variant)] text-[color:var(--md-sys-color-on-surface-variant)] border-[color:var(--md-sys-color-outline)]',
  secondary: 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)] border-[color:var(--md-sys-color-secondary)]',
  danger: 'bg-[color:var(--md-sys-color-error-container)] text-[color:var(--md-sys-color-on-error-container)] border-[color:var(--md-sys-color-error)]',
  success: 'bg-[color:var(--md-sys-color-success-container)] text-[color:var(--md-sys-color-on-success-container)] border-[color:var(--md-sys-color-success)]',
  default: 'bg-[color:var(--md-sys-color-surface-variant)] text-[color:var(--md-sys-color-on-surface-variant)] border-[color:var(--md-sys-color-outline)]'
}

const props = withDefaults(defineProps<{
  variant?: 'surface'|'primary'|'secondary'|'danger'|'success'|'accent'|'neutral'|'default'
  size?: 'xs'|'sm'|'md'
}>(), { variant: 'surface', size: 'sm' })

const klass = computed(() => cx(
  'inline-flex items-center rounded-[var(--radius-pill)] border font-semibold',
  sizeMap[props.size],
  variantMap[props.variant] ?? variantMap.surface
))
</script>

<template>
  <span :class="klass">
    <slot />
  </span>
</template>
