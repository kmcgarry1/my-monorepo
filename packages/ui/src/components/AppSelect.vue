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
  const base = 'w-full rounded-[var(--radius-sm)] border px-2.5 py-2 text-sm transition-all duration-150 text-[color:var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--surface)]'
  const palette = props.variant === 'filled'
    ? 'bg-[color:var(--surface-veil)] border-[color:var(--border)]'
    : props.variant === 'ghost'
    ? 'bg-transparent border-transparent focus-visible:border-[color:var(--accent)] text-[color:var(--fg)]'
    : 'bg-[color:var(--surface-translucent)] border-[color:var(--btn-border)] text-[color:var(--fg)]'
  const invalid = props.invalid ? 'border-[rgba(251,113,133,0.6)] focus-visible:ring-[rgba(251,113,133,0.4)] focus-visible:border-[rgba(251,113,133,0.9)]' : ''
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
