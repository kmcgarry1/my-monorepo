<script setup lang="ts">
const props = withDefaults(defineProps<{ cols?: 1|2|3|4; align?: 'start'|'center'|'end' }>(), { cols: 2, align: 'start' })
const map: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
}
const alignMap: Record<string, string> = { start: 'items-start', center: 'items-center', end: 'items-end' }
</script>

<template>
  <div :class="['grid gap-3', map[props.cols], alignMap[props.align]]">
    <slot />
  </div>
  
</template>
