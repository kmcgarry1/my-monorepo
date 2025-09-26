<script setup lang="ts">
import { computed } from 'vue'
import { btnBase, btnSizes, btnVariants, cx } from '../utils/variants'
import type { ButtonVariant } from '../types'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: 'xs' | 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
  disabled?: boolean
}>(), { variant: 'filled', size: 'md', block: false, loading: false, disabled: false })

const aliasMap: Record<ButtonVariant, keyof typeof btnVariants> = {
  filled: 'filled',
  tonal: 'tonal',
  'filled-tonal': 'tonal',
  outlined: 'outlined',
  outline: 'outlined',
  text: 'text',
  elevated: 'elevated',
  surface: 'surface',
  ghost: 'ghost',
  danger: 'danger',
  success: 'success',
  default: 'elevated',
  primary: 'filled',
  secondary: 'tonal',
  accent: 'filled',
  subtle: 'surface'
}

const normalizedVariant = computed(() => aliasMap[props.variant] ?? 'filled')

const klass = computed(() => cx(
  btnBase,
  btnSizes[props.size],
  btnVariants[normalizedVariant.value] ?? btnVariants.filled,
  props.block ? 'w-full' : '',
  props.disabled || props.loading ? 'pointer-events-none opacity-60' : ''
))
</script>

<template>
  <button
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading ? 'true' : 'false'"
    :data-variant="normalizedVariant"
    :class="klass"
  >
    <span v-if="props.loading" class="flex items-center gap-2">
      <svg class="h-4 w-4 animate-spin text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="3" />
        <path class="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke-width="3" stroke-linecap="round" />
      </svg>
      <slot name="loading">Loading…</slot>
    </span>
    <span v-else class="flex items-center gap-2">
      <slot />
    </span>
  </button>
</template>
