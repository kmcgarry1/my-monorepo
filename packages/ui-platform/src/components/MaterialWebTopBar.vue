<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '@my-monorepo/ui'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string | null
    elevated?: boolean
    align?: 'start' | 'center'
    divider?: boolean
  }>(),
  {
    title: '',
    subtitle: null,
    elevated: true,
    align: 'start',
    divider: true,
  },
)

const containerClass = computed(() =>
  cx(
    'sticky top-0 z-40 flex w-full items-center gap-4 px-6 py-4 transition-[background-color,box-shadow] duration-[var(--motion-duration-md)]',
    props.elevated
      ? 'bg-[color:var(--md-sys-color-surface-container-high)] shadow-[var(--shadow-level2)]'
      : 'bg-[color:var(--md-sys-color-surface)]',
    props.divider ? 'border-b border-[color:var(--md-sys-color-outline-variant)]' : 'border-b border-transparent',
  ),
)

const headingAlignClass = computed(() =>
  props.align === 'center' ? 'items-center text-center' : 'items-start text-left',
)
</script>

<template>
  <header :class="containerClass">
    <div class="flex min-w-0 items-center gap-2">
      <slot name="navigation" />
    </div>
    <div :class="cx('flex min-w-0 flex-1 flex-col gap-0.5', headingAlignClass)">
      <slot name="title">
        <h1 class="truncate text-[1.125rem] font-semibold tracking-[0.02em] text-[color:var(--md-sys-color-on-surface)]">
          {{ props.title }}
        </h1>
      </slot>
      <slot name="subtitle">
        <p v-if="props.subtitle" class="truncate text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
          {{ props.subtitle }}
        </p>
      </slot>
    </div>
    <div class="flex min-w-0 items-center justify-end gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
