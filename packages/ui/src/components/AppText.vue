<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'body' | 'muted' | 'caption' | 'mono' | 'small' | 'lead'
type Tone = 'fg' | 'muted' | 'accent'
type Size = 'xs' | 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  as?: keyof HTMLElementTagNameMap
  variant?: Variant
  tone?: Tone
  size?: Size
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

const toneClass = computed(() => props.tone === 'accent' ? 'text-[color:var(--accent)]' : props.tone === 'muted' ? 'text-[color:var(--muted)]' : props.tone === 'fg' ? 'text-[color:var(--fg)]' : '')
const sizeClass = computed(() => props.size === 'xs' ? 'text-[0.75rem]' : props.size === 'sm' ? 'text-[0.875rem]' : props.size === 'lg' ? 'text-[1.125rem]' : props.size === 'md' ? 'text-[1rem]' : '')
</script>

<template>
  <component :is="props.as" :class="[map[props.variant], sizeClass, toneClass, props.class]">
    <slot />
  </component>
</template>

