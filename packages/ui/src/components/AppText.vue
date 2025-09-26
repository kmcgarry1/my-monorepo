<script setup lang="ts">
import { computed } from 'vue'
import type { Tone, TextSize } from '../types'

type Variant = 'body' | 'muted' | 'caption' | 'label' | 'title' | 'display' | 'mono'

const props = withDefaults(defineProps<{ 
  as?: keyof HTMLElementTagNameMap
  variant?: Variant
  tone?: Tone
  size?: TextSize
  class?: string
}>(), { as: 'p', variant: 'body', class: '' })

const variantMap: Record<Variant, string> = {
  body: 'text-[color:var(--md-sys-color-on-surface)] leading-relaxed',
  muted: 'text-[color:var(--md-sys-color-on-surface-variant)] leading-relaxed',
  caption: 'text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--md-sys-color-on-surface-variant)]',
  label: 'text-[0.82rem] uppercase tracking-[0.12em] font-medium text-[color:var(--md-sys-color-on-surface)]',
  title: 'text-[1.1rem] font-semibold text-[color:var(--md-sys-color-on-surface)]',
  display: '[font-family:var(--font-display)] text-[1.6rem] font-semibold leading-tight text-[color:var(--md-sys-color-on-surface)]',
  mono: 'font-mono text-sm text-[color:var(--md-sys-color-on-surface-variant)]'
}

const toneClass = computed(() => {
  switch (props.tone) {
    case 'accent':
    case 'primary':
      return 'text-[color:var(--md-sys-color-primary)]'
    case 'secondary':
      return 'text-[color:var(--md-sys-color-secondary)]'
    case 'muted':
      return 'text-[color:var(--md-sys-color-on-surface-variant)]'
    case 'fg':
      return 'text-[color:var(--md-sys-color-on-surface)]'
    case 'success':
      return 'text-[color:var(--md-sys-color-success)]'
    default:
      return ''
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-[0.78rem]'
    case 'sm':
      return 'text-[0.9rem]'
    case 'md':
      return 'text-[1rem]'
    case 'lg':
      return 'text-[1.2rem]'
    default:
      return ''
  }
})
</script>

<template>
  <component :is="props.as" :class="[variantMap[props.variant], sizeClass, toneClass, props.class]">
    <slot />
  </component>
</template>
