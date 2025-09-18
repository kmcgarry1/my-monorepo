<script setup lang="ts">
const props = withDefaults(defineProps<{ span?: 1|2|3|4 }>(), { span: 1 })
const map: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-1 md:col-span-2',
  3: 'col-span-1 md:col-span-3',
  4: 'col-span-1 md:col-span-4',
}
</script>

<template>
  <div :class="map[props.span]">
    <slot />
  </div>
</template>

