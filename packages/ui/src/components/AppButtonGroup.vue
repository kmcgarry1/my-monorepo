<script setup lang="ts">
import { computed, ref, type ComponentPublicInstance } from 'vue'
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
  : 'border border-[color:var(--border-soft)] bg-[color:var(--surface-translucent)] backdrop-blur-sm shadow-[var(--glass-shadow-sm)]')

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
        return 'bg-[color:color-mix(in_srgb,var(--accent) 12%, transparent)] text-[color:var(--md-comp-button-text-label)] border-[color:var(--accent)]'
      case 'ghost':
        return 'bg-[color:var(--md-comp-button-ghost-hover-layer)] text-[color:var(--md-comp-button-ghost-label)] border-transparent'
      case 'danger':
        return 'bg-[color:var(--md-comp-button-danger-container)] text-[color:var(--md-comp-button-danger-on-container)] border-[color:var(--md-comp-button-danger-container)]'
      case 'success':
        return 'bg-[color:var(--md-comp-button-success-container)] text-[color:var(--md-comp-button-success-on-container)] border-[color:var(--md-comp-button-success-container)]'
      case 'surface':
      default:
        return 'bg-[color:var(--surface-translucent)] text-[color:var(--md-sys-color-on-surface)] border-[color:var(--border)] backdrop-blur-sm'
    }
  }

  switch (normalized) {
    case 'filled':
      return 'bg-transparent border-[color:var(--md-comp-button-filled-container)] text-[color:var(--md-comp-button-filled-container)] hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]'
    case 'tonal':
      return 'bg-transparent border-[color:var(--md-comp-button-tonal-container)] text-[color:var(--md-comp-button-tonal-container)] hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]'
    case 'outlined':
      return 'bg-transparent border-[color:var(--border)] text-[color:var(--md-comp-button-text-label)] hover:bg-[color:color-mix(in_srgb,var(--accent) 12%, transparent)]'
    case 'ghost':
      return 'bg-transparent border-transparent text-[color:var(--md-comp-button-ghost-label)] hover:bg-[color:var(--md-comp-button-ghost-hover-layer)]'
    case 'danger':
      return 'bg-transparent border-[color:var(--md-comp-button-danger-container)] text-[color:var(--md-comp-button-danger-container)] hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]'
    case 'success':
      return 'bg-transparent border-[color:var(--md-comp-button-success-container)] text-[color:var(--md-comp-button-success-container)] hover:bg-[color:var(--md-comp-button-outlined-hover-layer)]'
    case 'surface':
    default:
      return 'bg-transparent border-[color:var(--border-muted)] text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--glass-surface-soft)]'
  }
}

function itemClass(active: boolean) {
  const base = 'px-3 transition-all duration-[var(--motion-duration-sm)] uppercase tracking-[0.12em] font-semibold border-r last:border-r-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--md-comp-focus-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--md-sys-color-surface)]'
  return cx(base, sizeClass.value, palette(active))
}

const buttonRefs = ref<Array<HTMLButtonElement | null>>([])

function registerButton(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLButtonElement) {
    buttonRefs.value[index] = el
  } else if (el == null) {
    buttonRefs.value[index] = null
  }
}

function focusButton(index: number) {
  const target = buttonRefs.value[index]
  target?.focus()
}

function selectIndex(index: number) {
  const option = props.options[index]
  if (!option) return
  emit('update:modelValue', option.value)
  focusButton(index)
}

function handleKeydown(event: KeyboardEvent, index: number) {
  if (!props.options.length) return

  const lastIndex = props.options.length - 1

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    const nextIndex = index >= lastIndex ? 0 : index + 1
    selectIndex(nextIndex)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    const prevIndex = index <= 0 ? lastIndex : index - 1
    selectIndex(prevIndex)
  } else if (event.key === 'Home') {
    event.preventDefault()
    selectIndex(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    selectIndex(lastIndex)
  }
}
</script>

<template>
  <div
    role="radiogroup"
    :class="cx('inline-flex overflow-hidden rounded-[var(--radius-md)] backdrop-blur-sm', containerClass)"
  >
    <button
      v-for="(opt, index) in props.options"
      :key="opt.value"
      type="button"
      :class="itemClass(props.modelValue===opt.value)"
      role="radio"
      :aria-checked="props.modelValue===opt.value"
      :tabindex="props.modelValue===opt.value ? 0 : -1"
      @keydown="handleKeydown($event, index)"
      :ref="el => registerButton(el, index)"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
