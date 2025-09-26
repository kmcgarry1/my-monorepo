<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import type { Tone, TextSize } from '../types'

type Size = Extract<TextSize, 'xs' | 'sm' | 'md'>

const props = withDefaults(defineProps<{
  icon?: 'sword'|'arrows'|'dice'|'book'|'info'
  label: string
  tone?: Tone
  size?: Size
}>(), { tone: 'muted', size: 'sm' })

const klass = computed(() => {
  const base = 'flex items-center gap-1 font-semibold uppercase tracking-[0.28em] text-[0.7rem]'
  const size = props.size === 'xs'
    ? 'mb-0.5 text-[0.6rem]'
    : props.size === 'md'
    ? 'mb-1.5 text-[0.74rem]'
    : 'mb-1 text-[0.68rem]'
  const tone = props.tone === 'accent' || props.tone === 'primary'
    ? 'text-[color:var(--md-sys-color-primary)]'
    : props.tone === 'fg'
    ? 'text-[color:var(--md-sys-color-on-surface)]'
    : props.tone === 'secondary'
    ? 'text-[color:var(--md-sys-color-secondary)]'
    : props.tone === 'success'
    ? 'text-[color:var(--md-sys-color-success)]'
    : 'text-[color:var(--md-sys-color-on-surface-variant)]'
  return [base, size, tone].join(' ')
})
</script>

<template>
  <div :class="klass">
    <AppIcon
      v-if="props.icon"
      :name="props.icon"
      size="inline"
      :color="props.tone === 'accent' || props.tone === 'primary' ? 'primary' : props.tone === 'fg' ? 'fg' : props.tone === 'success' ? 'success' : 'muted'"
    />
    <span>{{ props.label }}</span>
    <slot />
  </div>
</template>
