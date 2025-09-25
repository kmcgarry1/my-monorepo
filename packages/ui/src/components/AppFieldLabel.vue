<script setup lang="ts">
import AppIcon from './AppIcon.vue'
const props = defineProps<{ icon?: 'sword'|'arrows'|'dice'|'book'|'info'; label: string }>()
</script>

<template>
  <div class="mb-1 flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">
    <AppIcon v-if="props.icon" :name="props.icon" />
    <span>{{ props.label }}</span>
    <slot />
  </div>
</template>

