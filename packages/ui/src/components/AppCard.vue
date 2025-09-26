<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '../utils/variants'

const props = withDefaults(defineProps<{
  title?: string
  variant?: 'filled'|'elevated'|'outlined'|'surface'|'ghost'|'default'
  padding?: 'sm'|'md'|'lg'
}>(), { variant: 'elevated', padding: 'md' })

const variantClass = computed(() => {
  const map: Record<string, string> = {
    filled: 'bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] border border-[color:var(--md-sys-color-outline-variant)] shadow-[var(--shadow-level1)]',
    surface: 'bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] border border-[color:var(--md-sys-color-outline-variant)] shadow-[var(--shadow-level1)]',
    elevated: 'bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)] border border-[color:var(--md-sys-color-outline-variant)] shadow-[var(--shadow-level2)]',
    outlined: 'bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] border border-[color:var(--md-sys-color-outline)] shadow-none',
    ghost: 'bg-transparent border border-transparent shadow-none',
    default: 'bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] border border-[color:var(--md-sys-color-outline-variant)] shadow-[var(--shadow-level1)]'
  }
  return map[props.variant] ?? map.elevated
})

const paddingClass = computed(() => props.padding === 'sm' ? 'p-4' : props.padding === 'lg' ? 'p-8' : 'p-6')
</script>

<template>
  <section :class="cx('rounded-[var(--radius-lg)] transition-shadow duration-[var(--transition-short)] backdrop-blur-sm', variantClass.value, paddingClass.value)">
    <header v-if="props.title" class="mb-4">
      <h2 class="font-semibold text-[1.05rem] tracking-[0.04em] text-[color:var(--md-sys-color-on-surface)]">{{ props.title }}</h2>
    </header>
    <slot />
  </section>
</template>
