<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{ cols?: 1|2|3|4; align?: 'start'|'center'|'end'; gap?: 'xs'|'sm'|'md'|'lg' }>(), { cols: 2, align: 'start', gap: 'md' })
const map: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
}
const alignMap: Record<string, string> = { start: 'items-start', center: 'items-center', end: 'items-end' }
const gapMap: Record<string, string> = { xs: 'gap-2', sm: 'gap-2.5', md: 'gap-3', lg: 'gap-4' }
const rowClass = computed(() => ['grid', gapMap[props.gap], map[props.cols], alignMap[props.align]].join(' '))
</script>

<template>
  <div :class="rowClass">
    <slot />
  </div>
  
</template>
