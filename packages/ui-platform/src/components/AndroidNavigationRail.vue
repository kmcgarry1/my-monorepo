<script setup lang="ts">
import { computed } from 'vue'
import { AppIcon, buttonBaseForStyle, cx, useDesignStyle } from '@my-monorepo/ui'

type RailItem = {
  icon: 'sword' | 'arrows' | 'dice' | 'plus' | 'trash' | 'book' | 'info' | 'download' | 'copy' | 'print' | 'x' | 'palette' | 'sparkles'
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  items: RailItem[]
  modelValue?: string
  railPosition?: 'left' | 'right'
}>(), {
  modelValue: '',
  railPosition: 'left',
})

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void; (e: 'select', value: string): void }>()

const designStyle = useDesignStyle()
const buttonBaseClass = computed(() => buttonBaseForStyle(designStyle))

const railClass = computed(() =>
  cx(
    'flex h-full w-20 flex-col items-center gap-1 border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] py-6 shadow-[var(--shadow-level1)]',
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
        'w-16 flex-col gap-1 rounded-[var(--radius-lg)] px-2 py-3 text-xs font-medium !normal-case tracking-[0.02em] text-[color:var(--md-sys-color-on-surface-variant)] shadow-none border-transparent bg-transparent hover:bg-[color:var(--md-sys-color-surface-container-high)]',
        item.value === props.modelValue
          ? 'bg-[color:var(--md-sys-color-surface-container-highest)] text-[color:var(--md-sys-color-primary)] shadow-[var(--shadow-level2)]'
          : '',
      )"
      @click="handleSelect(item.value)"
    >
      <AppIcon :name="item.icon" />
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>
