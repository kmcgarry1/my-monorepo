<script setup lang="ts">
import { computed } from 'vue'
import type { ControlVariant, ControlSize } from '../types'
import {
  BASE_CONTROL_VARIANT_CLASS,
  INVALID_CONTROL_CLASS,
  controlSizeClass,
  normalizeControlVariant
} from '../utils/control'

type Option = { label: string; value: string }

const props = withDefaults(defineProps<{
  modelValue?: string
  options?: Option[]
  variant?: ControlVariant
  invalid?: boolean
  size?: ControlSize
}>(), { options: () => [], variant: 'filled', invalid: false, size: 'md' })

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const sizeClass = computed(() => controlSizeClass(props.size))

const normalizedVariant = computed(() => normalizeControlVariant(props.variant, 'filled'))

const variantClass = computed(() => BASE_CONTROL_VARIANT_CLASS[normalizedVariant.value])

const invalidClass = computed(() => (props.invalid ? INVALID_CONTROL_CLASS : ''))

const klass = computed(() => [
  'w-full rounded-[var(--radius-md)] transition-all duration-[var(--motion-duration-sm)] text-[color:var(--md-comp-field-on-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-comp-focus-ring)]',
  sizeClass.value,
  variantClass.value,
  invalidClass.value
].join(' '))
</script>

<template>
  <select
    :value="props.modelValue ?? ''"
    :data-variant="props.variant"
    :aria-invalid="props.invalid ? 'true' : 'false'"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    :class="klass"
  >
    <option v-if="!props.options.length" value=""></option>
    <option v-for="o in props.options" :key="o.value" :value="o.value">{{ o.label }}</option>
    <slot />
  </select>
</template>

