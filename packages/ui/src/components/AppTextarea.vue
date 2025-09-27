<script setup lang="ts">
import { computed } from 'vue'
import type { ControlVariant, ControlSize } from '../types'
import {
  BASE_CONTROL_VARIANT_CLASS,
  INVALID_CONTROL_CLASS,
  controlSizeClass,
  normalizeControlVariant
} from '../utils/control'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  placeholder?: string
  variant?: ControlVariant
  invalid?: boolean
  size?: ControlSize
  rows?: number
}>(), { placeholder: '', variant: 'filled', invalid: false, size: 'md', rows: 4 })

const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const sizeClass = computed(() => controlSizeClass(props.size))

const normalizedVariant = computed(() => normalizeControlVariant(props.variant, 'filled'))

const variantClass = computed(() => BASE_CONTROL_VARIANT_CLASS[normalizedVariant.value])

const invalidClass = computed(() => (props.invalid ? INVALID_CONTROL_CLASS : ''))

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

