<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '../utils/variants'
import type { ButtonVariant, ButtonSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue: string
  options: { label: string; value: string }[]
  size?: ButtonSize
  variant?: ButtonVariant
}>(), { size: 'md', variant: 'surface' })
const emit = defineEmits<{ (e:'update:modelValue', v:string): void }>()

const sizeClass = computed(() => props.size==='sm' ? 'py-1.5 text-[0.7rem]' : props.size==='lg' ? 'py-2.5 text-[0.86rem]' : 'py-2 text-[0.78rem]')

const containerClass = computed(() => normalizeVariant(props.variant) === 'ghost'
  ? 'border-transparent bg-transparent shadow-none'
  : 'border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] shadow-[var(--shadow-level1)]')

function normalizeVariant(variant: ButtonVariant): 'filled' | 'tonal' | 'surface' | 'outlined' | 'text' | 'ghost' | 'danger' | 'success' {
  switch (variant) {
    case 'primary':
    case 'accent':
    case 'filled':
      return 'filled'
    case 'secondary':
    case 'tonal':
    case 'filled-tonal':
      return 'tonal'
    case 'outline':
    case 'outlined':
      return 'outlined'
    case 'ghost':
    case 'text':
      return 'ghost'
    case 'danger':
      return 'danger'
    case 'success':
      return 'success'
    case 'default':
    case 'elevated':
      return 'surface'
    case 'subtle':
    case 'surface':
    default:
      return 'surface'
  }
}

function palette(active: boolean) {
  const normalized = normalizeVariant(props.variant)
  if (active) {
    switch (normalized) {
      case 'filled':
        return 'bg-[color:var(--md-comp-button-filled-container)] text-[color:var(--md-comp-button-filled-on-container)] border-[color:var(--md-comp-button-filled-container)]'
      case 'tonal':
        return 'bg-[color:var(--md-comp-button-tonal-container)] text-[color:var(--md-comp-button-tonal-on-container)] border-[color:var(--md-comp-button-tonal-container)]'
      case 'outlined':
        return 'bg-[color:var(--md-comp-button-outlined-hover-layer)] text-[color:var(--md-comp-button-text-label)] border-[color:var(--md-comp-button-text-label)]'
      case 'ghost':
        return 'bg-[color:var(--md-comp-button-ghost-hover-layer)] text-[color:var(--md-comp-button-ghost-label)] border-transparent'
      case 'danger':
        return 'bg-[color:var(--md-comp-button-danger-container)] text-[color:var(--md-comp-button-danger-on-container)] border-[color:var(--md-comp-button-danger-container)]'
      case 'success':
        return 'bg-[color:var(--md-comp-button-success-container)] text-[color:var(--md-comp-button-success-on-container)] border-[color:var(--md-comp-button-success-container)]'
      case 'surface':
      default:
        return 'bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)] border-[color:var(--md-sys-color-outline-variant)]'
    }
  }

  switch (normalized) {
    case 'filled':
      return 'bg-transparent border-[color:var(--md-comp-button-filled-container)] text-[color:var(--md-comp-button-filled-container)] hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]'
    case 'tonal':
      return 'bg-transparent border-[color:var(--md-comp-button-tonal-container)] text-[color:var(--md-comp-button-tonal-container)] hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]'
    case 'outlined':
      return 'bg-transparent border-[color:var(--md-comp-button-outlined-outline)] text-[color:var(--md-comp-button-text-label)] hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]'
    case 'ghost':
      return 'bg-transparent border-transparent text-[color:var(--md-comp-button-ghost-label)] hover:bg-[color:var(--md-comp-button-ghost-hover-layer)]'
    case 'danger':
      return 'bg-transparent border-[color:var(--md-comp-button-danger-container)] text-[color:var(--md-comp-button-danger-container)] hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]'
    case 'success':
      return 'bg-transparent border-[color:var(--md-comp-button-success-container)] text-[color:var(--md-comp-button-success-container)] hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]'
    case 'surface':
    default:
      return 'bg-transparent border-[color:var(--md-sys-color-outline-variant)] text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-comp-button-ghost-hover-layer)]'
  }
}

function itemClass(active: boolean) {
  const base = 'px-3 transition-all duration-[var(--motion-duration-sm)] uppercase tracking-[0.12em] font-semibold border-r last:border-r-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--md-comp-focus-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--md-sys-color-surface)]'
  return cx(base, sizeClass.value, palette(active))
}
</script>

<template>
  <div :class="cx('inline-flex overflow-hidden rounded-[var(--radius-md)] backdrop-blur-sm', containerClass)">
    <button
      v-for="opt in props.options"
      :key="opt.value"
      type="button"
      :class="itemClass(props.modelValue===opt.value)"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
