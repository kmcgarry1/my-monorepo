<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { iconButtonBaseForStyle, btnVariants, iconBtnSizes, cx } from '../utils/variants'
import { useDesignStyle } from '../composables/useDesignStyle'
import type { ButtonVariant, IconButtonSize } from '../types'

const props = withDefaults(defineProps<{
  name: 'sword'|'arrows'|'dice'|'plus'|'trash'|'book'|'info'|'download'|'copy'|'print'|'x'|'palette'|'sparkles'
  variant?: ButtonVariant
  size?: IconButtonSize
  title?: string
}>(), { variant: 'outlined', size: 'sm', title: '' })

const iconSizeMap: Record<IconButtonSize, 'xs'|'sm'|'md'|'lg'|'xl'|'inline'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg'
}

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

const normalizedVariant = computed(() => aliasMap[props.variant] ?? 'outlined')

const designStyle = useDesignStyle()
const baseClass = computed(() => iconButtonBaseForStyle(designStyle))

const klass = computed(() => cx(
  baseClass.value,
  iconBtnSizes[props.size],
  btnVariants[normalizedVariant.value] ?? btnVariants.outlined
))
</script>

<template>
  <button :title="props.title" :aria-label="props.title || props.name" :class="klass">
    <AppIcon :name="props.name" :size="iconSizeMap[props.size]" />
  </button>
</template>

