<script setup lang="ts">
import { computed } from 'vue'
type Option = { label: string; value: string }
const props = withDefaults(defineProps<{
  modelValue?: string
  options?: Option[]
  variant?: 'outline' | 'filled' | 'ghost'
  invalid?: boolean
}>(), { options: () => [], variant: 'outline', invalid: false })
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const klass = computed(() => {
  const base = 'w-full rounded-md border px-2.5 py-2 text-sm outline-none ring-0 transition-colors'
  const palette = props.variant === 'filled'
    ? 'bg-[var(--surface-2)] text-[var(--fg)] border-[var(--border)] focus:border-[var(--accent)]'
    : props.variant === 'ghost'
    ? 'bg-transparent text-[var(--fg)] border-transparent focus:border-[var(--accent)]'
    : 'bg-[var(--surface)] text-[var(--fg)] border-[var(--btn-border)] focus:border-[var(--accent)]'
  const invalid = props.invalid ? 'border-red-500 focus:border-red-500' : ''
  return [base, palette, invalid].join(' ')
})
</script>

<template>
  <select
    :value="props.modelValue ?? ''"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    :class="klass"
  >
    <option v-if="!props.options.length" value=""></option>
    <option v-for="o in props.options" :key="o.value" :value="o.value">{{ o.label }}</option>
    <slot />
  </select>
  
</template>
