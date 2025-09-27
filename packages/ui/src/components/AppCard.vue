<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { cx } from '../utils/variants'

type AppCardVariant = 'filled' | 'elevated' | 'outlined' | 'surface' | 'ghost' | 'tonal' | 'default'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  overline?: string
  variant?: AppCardVariant
  padding?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}>(), {
  variant: 'elevated',
  padding: 'md',
  interactive: false
})

const slots = useSlots()

const variantClass = computed(() => {
  const map: Record<AppCardVariant, string> = {
    elevated:
      'bg-[color:var(--md-sys-color-surface-container-low)] text-[color:var(--md-sys-color-on-surface)] border border-transparent shadow-[var(--shadow-level2)]',
    filled:
      'bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)] border border-transparent shadow-none',
    outlined:
      'bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] border border-[color:color-mix(in srgb,var(--md-sys-color-outline) 60%,transparent)] shadow-none',
    surface:
      'bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] border border-transparent shadow-[var(--shadow-level1)]',
    ghost:
      'bg-transparent text-[color:var(--md-sys-color-on-surface)] border border-transparent shadow-none',
    tonal:
      'bg-[color:var(--md-sys-color-surface-container-highest)] text-[color:var(--md-sys-color-on-surface)] border border-transparent shadow-none',
    default:
      'bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)] border border-transparent shadow-[var(--shadow-level2)]'
  }

  return map[props.variant ?? 'elevated'] ?? map.elevated
})

const paddingClass = computed(() => {
  const map = {
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-7',
    lg: 'p-8 sm:p-9'
  } as const

  return map[props.padding] ?? map.md
})

const interactiveClass = computed(() =>
  props.interactive
    ? 'cursor-pointer hover:-translate-y-[1px] hover:shadow-[var(--shadow-level3)] focus-within:shadow-[var(--shadow-level3)] active:translate-y-[0]'
    : ''
)

const hasStructuredHeader = computed(
  () => Boolean(props.title || props.subtitle || props.overline || slots.header)
)

const baseClass = 'app-card relative isolate flex flex-col gap-4 rounded-[var(--radius-xl)] transition-[box-shadow,transform,background-color,border-color] duration-[var(--motion-duration-md)] ease-[var(--motion-easing-emphasized)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[color:var(--md-sys-color-on-surface)] before:opacity-0 before:transition-opacity before:duration-[var(--motion-duration-sm)] hover:before:opacity-[var(--md-comp-state-layer-opacity-hover)] focus-within:before:opacity-[var(--md-comp-state-layer-opacity-focus)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[color:var(--md-comp-focus-ring)] focus-within:ring-offset-2 focus-within:ring-offset-[color:var(--md-sys-color-surface)]'

const cardClass = computed(() => cx(baseClass, variantClass.value, paddingClass.value, interactiveClass.value))
</script>

<template>
  <section :class="cardClass">
    <header v-if="hasStructuredHeader" class="flex items-start justify-between gap-3 mb-2">
      <template v-if="slots.header">
        <slot name="header" />
      </template>
      <template v-else>
        <div class="flex min-w-0 flex-col gap-1">
          <p v-if="props.overline" class="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--md-sys-color-secondary)]">
            {{ props.overline }}
          </p>
          <h2 v-if="props.title" class="text-[1.05rem] font-semibold leading-tight text-[color:var(--md-sys-color-on-surface)]">
            {{ props.title }}
          </h2>
          <p v-if="props.subtitle" class="text-[0.9rem] text-[color:var(--md-sys-color-on-surface-variant)]">
            {{ props.subtitle }}
          </p>
          <slot name="subtitle" />
        </div>
        <div v-if="slots['header-action']" class="flex items-center gap-2">
          <slot name="header-action" />
        </div>
      </template>
    </header>

    <slot />
  </section>
</template>

