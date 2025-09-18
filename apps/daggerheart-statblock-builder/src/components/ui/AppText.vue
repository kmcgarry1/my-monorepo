<script setup lang="ts">
const props = withDefaults(defineProps<{
  as?: keyof HTMLElementTagNameMap
  variant?: 'body' | 'muted' | 'caption' | 'mono' | 'small' | 'lead'
  class?: string
}>(), { as: 'p', variant: 'body', class: '' })

const map: Record<string, string> = {
  body: 'text-[var(--fg)]',
  muted: 'text-[var(--muted)]',
  caption: 'text-xs text-[var(--muted)] uppercase tracking-wide',
  mono: 'font-mono',
  small: 'text-sm',
  lead: 'text-base text-[var(--muted)]',
}
</script>

<template>
  <component :is="props.as" :class="[map[props.variant], props.class]">
    <slot />
  </component>
</template>

