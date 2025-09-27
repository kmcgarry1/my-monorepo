<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppBadge from './AppBadge.vue'
import AppIcon from './AppIcon.vue'
import type { ControlVariant, ControlSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  variant?: ControlVariant
  size?: ControlSize
}>(), { modelValue: '', placeholder: 'Add and press Enter…', variant: 'outlined', size: 'md' })

const emit = defineEmits<{ (e:'update:modelValue', v:string): void }>()

const input = ref('')
const tags = ref<string[]>([])

function normalize(s: string) {
  return s.split(',').map(t => t.trim()).filter(Boolean)
}

watch(() => props.modelValue, (v) => { tags.value = normalize(v || '') }, { immediate: true })

const valueStr = computed(() => tags.value.join(', '))

function commit() {
  const next = normalize([ ...tags.value, input.value ].join(', '))
  tags.value = Array.from(new Set(next))
  input.value = ''
  emit('update:modelValue', valueStr.value)
}

function removeAt(i: number) {
  tags.value.splice(i, 1)
  emit('update:modelValue', valueStr.value)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    if (input.value.trim()) commit()
  } else if (e.key === 'Backspace' && !input.value && tags.value.length) {
    tags.value.pop()
    emit('update:modelValue', valueStr.value)
  }
}

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
      'bg-[color:var(--surface-translucent)] border border-[color:var(--border-muted)] backdrop-blur-sm focus-within:ring-2 focus-within:ring-[color:var(--md-comp-focus-ring)] focus-within:ring-offset-[color:var(--surface-translucent)] hover:border-[color:var(--border)]',
    outlined:
      'bg-transparent border border-[color:var(--border)] focus-within:ring-2 focus-within:ring-[color:var(--md-comp-focus-ring)] focus-within:ring-offset-[color:var(--surface-translucent)] hover:border-[color:color-mix(in_srgb,var(--accent) 55%, transparent)]',
    text:
      'rounded-b-none border-x-0 border-t-0 border-b border-[color:var(--border-muted)] px-0 bg-transparent focus-within:ring-2 focus-within:ring-[color:var(--md-comp-focus-ring)] focus-within:ring-offset-0 hover:border-[color:color-mix(in_srgb,var(--accent) 55%, transparent)]'
  }
  return map[key] ?? map.outlined
})

const wrapperClass = computed(() => [
  'flex flex-wrap items-center gap-1 rounded-[var(--radius-md)] shadow-[var(--shadow-level1)] transition-shadow duration-[var(--motion-duration-sm)] focus-within:shadow-[var(--shadow-level2)]',
  sizeClass.value,
  variantClass.value
].join(' '))
</script>

<template>
  <div :class="wrapperClass">
    <AppBadge v-for="(t, i) in tags" :key="t" variant="neutral" size="sm">
      <span>{{ t }}</span>
      <button
        type="button"
        class="ml-1 inline-flex items-center justify-center rounded-[var(--radius-xs)] p-0.5 text-[color:var(--md-sys-color-on-surface-variant)] transition-colors duration-[var(--motion-duration-sm)] hover:bg-[color:var(--md-comp-button-ghost-hover-layer)] hover:text-[color:var(--md-sys-color-on-surface)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--md-comp-focus-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--md-sys-color-surface)]"
        @click="removeAt(i)"
      >
        <AppIcon name="x" size="xs" />
      </button>
    </AppBadge>
    <input
      v-model="input"
      :placeholder="props.placeholder"
      @keydown="onKey"
      class="flex-1 bg-transparent px-2 py-1 text-[color:var(--md-comp-field-on-surface)] placeholder:text-[color:var(--md-comp-field-placeholder)] focus-visible:outline-none"
    />
  </div>
</template>
