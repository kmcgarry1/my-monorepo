<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'accent' | 'neutral' | 'danger' | 'success'
}>(), { variant: 'neutral' })

const map: Record<string, string> = {
  default: 'bg-[var(--surface-2)] text-[var(--fg)] border-[var(--border)]',
  accent: 'bg-[var(--accent-weak)] text-[var(--fg)] border-[var(--accent)]',
  neutral: 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]',
  danger: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700',
}
</script>

<template>
  <span :class="['inline-flex items-center rounded border px-2 py-0.5 text-xs', map[props.variant]]">
    <slot />
  </span>
</template>

