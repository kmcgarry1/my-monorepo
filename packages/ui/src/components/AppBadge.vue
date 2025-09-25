<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  variant?: 'default' | 'accent' | 'neutral' | 'danger' | 'success'
  size?: 'xs'|'sm'|'md'
}>(), { variant: 'neutral', size: 'sm' })

const map: Record<string, string> = {
  default: 'bg-[color:var(--surface-veil)] text-[color:var(--fg)] border-[color:var(--border)]',
  accent: 'bg-[color:var(--accent-weak)] text-[color:var(--accent)] border-[color:var(--accent)]',
  neutral: 'bg-[color:var(--surface-translucent)] text-[color:var(--muted)] border-[color:var(--border-muted)]',
  danger: 'bg-[color:var(--danger-soft)] text-[color:var(--enemy-accent)] border-[color:var(--danger-border)]',
  success: 'bg-[color:var(--success-soft)] text-[color:var(--env-accent)] border-[color:var(--success-border)]',
}

const sizeMap: Record<string, string> = {
  xs: 'px-2 py-0.5 text-[0.56rem] tracking-[0.22em] gap-0.5',
  sm: 'px-3 py-1 text-[0.62rem] tracking-[0.24em] gap-1',
  md: 'px-3.5 py-1.5 text-[0.68rem] tracking-[0.26em] gap-1.5',
}

const klass = computed(() => ['inline-flex items-center rounded-[var(--radius-pill)] border font-semibold uppercase', sizeMap[props.size], map[props.variant]].join(' '))
</script>

<template>
  <span :class="klass">
    <slot />
  </span>
</template>

