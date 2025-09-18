<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  rows?: number
  variant?: 'outline' | 'filled' | 'ghost'
  invalid?: boolean
}>(), { placeholder: '', rows: 3, variant: 'outline', invalid: false })
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const klass = computed(() => {
  const base = 'w-full rounded-md border px-3 py-2 text-sm outline-none ring-0 transition-colors'
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
  <textarea
    :rows="props.rows"
    :placeholder="props.placeholder"
    :value="props.modelValue ?? ''"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :class="klass"
  />
</template>
