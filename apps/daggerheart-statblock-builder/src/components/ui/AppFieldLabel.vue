<script setup lang="ts">
import AppIcon from './AppIcon.vue'
const props = defineProps<{ icon?: 'sword'|'arrows'|'dice'|'book'|'info'; label: string }>()
</script>

<template>
  <div class="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-[var(--muted)]">
    <AppIcon v-if="props.icon" :name="props.icon" />
    <span>{{ props.label }}</span>
    <slot />
  </div>
</template>

