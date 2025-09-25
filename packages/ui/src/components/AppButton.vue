<script setup lang="ts">
import { computed } from 'vue'
import { btnBase, btnSizes, btnVariants, cx } from '../utils/variants'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'subtle' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
  disabled?: boolean
}>(), { variant: 'default', size: 'md', block: false, loading: false, disabled: false })

const variantKey = computed(() => props.variant === 'accent' ? 'primary' : props.variant)
</script>

<template>
  <button :disabled="props.disabled || props.loading" :class="cx(btnBase, btnSizes[props.size], btnVariants[variantKey], props.block ? 'w-full' : '', (props.disabled||props.loading) ? 'opacity-60 cursor-not-allowed' : '')">
    <svg v-if="props.loading" class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
      <path class="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke-width="4" />
    </svg>
    <slot />
  </button>
</template>
