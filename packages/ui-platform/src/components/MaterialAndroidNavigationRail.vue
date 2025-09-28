<script setup lang="ts">
import { computed } from 'vue'
import { AppIcon, buttonBaseForStyle, cx, useDesignStyle } from '@my-monorepo/ui'

type NavigationItem = {
  icon:
    | 'sword'
    | 'arrows'
    | 'dice'
    | 'plus'
    | 'trash'
    | 'book'
    | 'info'
    | 'download'
    | 'copy'
    | 'print'
    | 'x'
    | 'palette'
    | 'sparkles'
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    items: NavigationItem[]
    modelValue?: string
    railPosition?: 'left' | 'right'
  }>(),
  {
    modelValue: '',
    railPosition: 'left',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', value: string): void
}>()

const designStyle = useDesignStyle()
const buttonBaseClass = computed(() => buttonBaseForStyle(designStyle))

const railClass = computed(() =>
  cx(
    'flex h-full w-20 flex-col items-center gap-1 border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] py-6 shadow-[var(--shadow-level2)]',
    props.railPosition === 'right' ? 'order-last border-l' : 'border-r',
  ),
)

function handleSelect(value: string) {
  emit('update:modelValue', value)
  emit('select', value)
}
</script>

<template>
  <nav :class="railClass">
    <button
      v-for="item in props.items"
      :key="item.value"
      type="button"
      :class="cx(
        buttonBaseClass,
        'w-16 flex-col gap-1 rounded-[var(--radius-lg)] border-transparent bg-transparent px-2 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--md-sys-color-on-surface-variant)] shadow-none before:rounded-[var(--radius-lg)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]',
        item.value === props.modelValue
          ? 'bg-[color:var(--md-sys-color-secondary-container)] text-[color:var(--md-sys-color-on-secondary-container)] shadow-[var(--shadow-level3)]'
          : '',
      )"
      @click="handleSelect(item.value)"
    >
      <AppIcon :name="item.icon" />
      <span class="truncate">{{ item.label }}</span>
    </button>
  </nav>
</template>
