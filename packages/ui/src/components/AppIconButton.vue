<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { btnBase, btnVariants, iconBtnSizes, cx } from '../utils/variants'
const props = withDefaults(defineProps<{
  name: 'sword'|'arrows'|'dice'|'plus'|'trash'|'book'|'info'|'download'|'copy'|'print'|'x'|'palette'
  variant?: 'default'|'primary'|'secondary'|'danger'|'ghost'|'outline'|'subtle'|'accent'
  size?: 'xs'|'sm'|'md'|'lg'
  title?: string
}>(), { variant: 'outline', size: 'sm', title: '' })

const iconSizeMap: Record<string, 'xs'|'sm'|'md'|'lg'|'xl'|'inline'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}
const variantKey = computed(() => props.variant === 'accent' ? 'primary' : props.variant)
</script>

<template>
  <button :title="props.title" :class="cx(btnBase, iconBtnSizes[props.size], btnVariants[variantKey])">
    <AppIcon :name="props.name" :size="iconSizeMap[props.size]" />
  </button>
</template>

