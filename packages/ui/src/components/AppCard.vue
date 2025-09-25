<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  variant?: 'default'|'elevated'|'ghost'
  padding?: 'sm'|'md'|'lg'
}>(), { variant: 'default', padding: 'md' })
</script>

<template>
  <section :class="[
    'rounded-[var(--radius-lg)] backdrop-blur-md',
    props.variant==='ghost' ? 'border-transparent bg-transparent shadow-none' : '',
    props.variant==='elevated' ? 'border border-[color:var(--border)] bg-[color:var(--surface-panel)] shadow-[var(--shadow-elevated)]' : '',
    props.variant==='default' ? 'border border-[color:var(--border)] bg-[color:var(--surface-panel)] shadow-[var(--shadow-card)]' : '',
    props.padding==='sm' ? 'p-3' : (props.padding==='lg' ? 'p-6' : 'p-5')
  ]">
    <h2 v-if="props.title" class="mb-3 text-base font-semibold">{{ props.title }}</h2>
    <slot />
  </section>
</template>

