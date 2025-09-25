<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  rows?: number
  variant?: 'outline' | 'filled' | 'ghost'
  invalid?: boolean
  size?: 'sm'|'md'|'lg'
}>(), { placeholder: '', rows: 3, variant: 'outline', invalid: false, size: 'md' })
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const klass = computed(() => {
  const size = props.size === 'sm' ? 'px-2.5 py-1.5 text-[0.68rem]' : props.size === 'lg' ? 'px-3.5 py-2.5 text-[0.82rem]' : 'px-3 py-2 text-[0.75rem]'
  const base = `w-full rounded-[var(--radius-sm)] border ${size} transition-all duration-150 text-[color:var(--fg)] placeholder:text-[color:var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--surface)]`
  const palette = props.variant === 'filled'
    ? 'bg-[color:var(--surface-veil)] border-[color:var(--border)]'
    : props.variant === 'ghost'
    ? 'bg-transparent border-transparent focus-visible:border-[color:var(--accent)]'
    : 'bg-[color:var(--surface-translucent)] border-[color:var(--btn-border)]'
  const invalid = props.invalid ? 'border-[rgba(251,113,133,0.6)] focus-visible:ring-[rgba(251,113,133,0.4)] focus-visible:border-[rgba(251,113,133,0.9)]' : ''
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
