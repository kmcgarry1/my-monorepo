<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ControlVariant, ControlSize } from '../types'
import {
  BASE_CONTROL_VARIANT_CLASS,
  INVALID_CONTROL_CLASS,
  controlSizeClass,
  normalizeControlVariant
} from '../utils/control'

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  type?: string
  placeholder?: string
  variant?: ControlVariant
  invalid?: boolean
  size?: ControlSize
}>(), { type: 'text', placeholder: '', variant: 'outlined', invalid: false, size: 'md' })

const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const sizeClass = computed(() => controlSizeClass(props.size))

const normalizedVariant = computed(() => normalizeControlVariant(props.variant, 'outlined'))

const variantClass = computed(() => BASE_CONTROL_VARIANT_CLASS[normalizedVariant.value])

const invalidClass = computed(() => (props.invalid ? INVALID_CONTROL_CLASS : ''))

const klass = computed(() => [
  'w-full rounded-[var(--radius-md)] transition-all duration-[var(--motion-duration-sm)] text-[color:var(--md-comp-field-on-surface)] placeholder:text-[color:var(--md-comp-field-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-comp-focus-ring)]',
  sizeClass.value,
  variantClass.value,
  invalidClass.value
].join(' '))

const inputRef = ref<HTMLInputElement | null>(null)

function focus(): void {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <input
    ref="inputRef"
    :type="props.type"
    :placeholder="props.placeholder"
    :value="props.modelValue ?? ''"
    :data-variant="props.variant"
    :aria-invalid="props.invalid ? 'true' : 'false'"
    @input="emit('update:modelValue', (props.type==='number' ? Number(($event.target as HTMLInputElement).value) || null : ($event.target as HTMLInputElement).value))"
    :class="klass"
  />
</template>

