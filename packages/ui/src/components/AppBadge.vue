<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'accent' | 'neutral' | 'danger' | 'success'
}>(), { variant: 'neutral' })

const map: Record<string, string> = {
  default: 'bg-[color:var(--surface-veil)] text-[color:var(--fg)] border-[color:var(--border)]',
  accent: 'bg-[color:var(--accent-weak)] text-[color:var(--accent)] border-[color:var(--accent)]',
  neutral: 'bg-[color:var(--surface-translucent)] text-[color:var(--muted)] border-[color:var(--border-muted)]',
  danger: 'bg-[color:var(--danger-soft)] text-[color:var(--enemy-accent)] border-[color:var(--danger-border)]',
  success: 'bg-[color:var(--success-soft)] text-[color:var(--env-accent)] border-[color:var(--success-border)]',
}
</script>

<template>
  <span :class="['inline-flex items-center gap-1 rounded-[var(--radius-pill)] border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em]', map[props.variant]]">
    <slot />
  </span>
</template>

