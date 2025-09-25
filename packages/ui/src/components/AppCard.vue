<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <section class="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface-panel)] p-5 shadow-[var(--shadow-card)] backdrop-blur-md">
    <h2 v-if="title" class="mb-3 text-base font-semibold">{{ title }}</h2>
    <slot />
  </section>
</template>

