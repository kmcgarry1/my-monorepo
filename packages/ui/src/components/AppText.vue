<script setup lang="ts">
const props = withDefaults(defineProps<{
  as?: keyof HTMLElementTagNameMap
  variant?: 'body' | 'muted' | 'caption' | 'mono' | 'small' | 'lead'
  class?: string
}>(), { as: 'p', variant: 'body', class: '' })

const map: Record<string, string> = {
  body: 'text-[color:var(--fg)] leading-relaxed',
  muted: 'text-[color:var(--muted)] leading-relaxed',
  caption: 'text-[0.62rem] uppercase tracking-[0.32em] text-[color:var(--muted)]',
  mono: 'font-mono text-sm text-[color:var(--accent-strong)]',
  small: 'text-sm text-[color:var(--fg)]',
  lead: 'text-base text-[color:var(--accent-weak)]',
}
</script>

<template>
  <component :is="props.as" :class="[map[props.variant], props.class]">
    <slot />
  </component>
</template>

