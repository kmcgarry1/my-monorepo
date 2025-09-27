<script setup lang="ts">
import { computed } from 'vue'
import type { ControlVariant, ControlSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  placeholder?: string
  variant?: ControlVariant
  invalid?: boolean
  size?: ControlSize
  rows?: number
}>(), { placeholder: '', variant: 'filled', invalid: false, size: 'md', rows: 4 })

const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-2 text-[0.75rem]'
    case 'lg':
      return 'px-4 py-3 text-[0.88rem]'
    default:
      return 'px-3.5 py-2.5 text-[0.82rem]'
  }
})

const variantClass = computed(() => {
  const alias: Record<ControlVariant, ControlVariant> = {
    filled: 'filled',
    outlined: 'outlined',
    outline: 'outlined',
    text: 'text'
  }
  const key = alias[props.variant] ?? 'outlined'
  const map: Record<string, string> = {
    filled:
      'bg-[color:var(--surface-translucent)] border border-[color:var(--border-muted)] backdrop-blur-sm focus-visible:ring-offset-[color:var(--surface-translucent)] hover:border-[color:var(--border)]',
    outlined:
      'bg-transparent border border-[color:var(--border)] hover:border-[color:color-mix(in_srgb,var(--accent) 55%, transparent)] focus-visible:ring-offset-[color:var(--surface-translucent)]',
    text:
      'rounded-b-none border-x-0 border-t-0 border-b border-[color:var(--border-muted)] px-0 bg-transparent focus-visible:ring-offset-0 hover:border-[color:color-mix(in_srgb,var(--accent) 55%, transparent)]'
  }
  return map[key] ?? map.outlined
})

const invalidClass = computed(() => props.invalid
  ? 'border-[color:var(--md-sys-color-error)] focus-visible:ring-[color:var(--md-sys-color-error)] focus-visible:ring-offset-[color:var(--md-sys-color-error-container)]'
  : '')

const klass = computed(() => [
  'w-full rounded-[var(--radius-md)] transition-all duration-[var(--motion-duration-sm)] text-[color:var(--md-comp-field-on-surface)] placeholder:text-[color:var(--md-comp-field-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-comp-focus-ring)]',
  sizeClass.value,
  variantClass.value,
  invalidClass.value
].join(' '))
</script>

<template>
  <textarea
    :rows="props.rows"
    :placeholder="props.placeholder"
    :value="props.modelValue ?? ''"
    :data-variant="props.variant"
    :aria-invalid="props.invalid ? 'true' : 'false'"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :class="klass"
  />
</template>

