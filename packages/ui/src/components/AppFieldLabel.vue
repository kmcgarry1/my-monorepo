<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

type Tone = 'muted' | 'fg' | 'accent'
type Size = 'xs' | 'sm' | 'md'

const props = withDefaults(defineProps<{
  icon?: 'sword'|'arrows'|'dice'|'book'|'info'
  label: string
  tone?: Tone
  size?: Size
}>(), { tone: 'muted', size: 'sm' })

const klass = computed(() => {
  const base = 'flex items-center gap-1 font-semibold uppercase'
  const size = props.size === 'xs'
    ? 'mb-0.5 text-[0.56rem] tracking-[0.26em]'
    : props.size === 'md'
    ? 'mb-1.5 text-[0.68rem] tracking-[0.3em]'
    : 'mb-1 text-[0.62rem] tracking-[0.28em]'
  const tone = props.tone === 'fg'
    ? 'text-[color:var(--fg)]'
    : props.tone === 'accent'
    ? 'text-[color:var(--accent)]'
    : 'text-[color:var(--muted)]'
  return [base, size, tone].join(' ')
})

// Keep the icon aligned with text by default
// so it scales with label size.
</script>

<template>
  <div :class="klass">
    <AppIcon v-if="props.icon" :name="props.icon" size="inline" :color="props.tone === 'accent' ? 'accent' : (props.tone === 'fg' ? 'fg' : 'muted')" />
    <span>{{ props.label }}</span>
    <slot />
  </div>
</template>

