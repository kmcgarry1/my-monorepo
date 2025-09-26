<script setup lang="ts">
import { AppCard, AppCol, AppFieldLabel, AppInput, AppRow, AppTagInput, AppTextarea } from '@my-monorepo/ui'

const props = defineProps<{
  name: string
  archetype: string
  description: string
  traits: string
}>()

const emit = defineEmits<{
  (e: 'update:name', v: string): void
  (e: 'update:archetype', v: string): void
  (e: 'update:description', v: string): void
  (e: 'update:traits', v: string): void
}>()
</script>

<template>
  <AppCard title="Identity">
    <AppRow :cols="2">
      <AppCol>
        <AppFieldLabel icon="sword" label="Name" />
        <AppInput :model-value="props.name" @update:modelValue="v => emit('update:name', v)" placeholder="e.g., Acid Burrower" />
      </AppCol>
      <AppCol>
        <AppFieldLabel icon="book" label="Archetype" />
        <AppInput :model-value="props.archetype" @update:modelValue="v => emit('update:archetype', v)" placeholder="e.g., Ancient Burrowing Horror" />
      </AppCol>
    </AppRow>

    <div class="mt-3">
      <AppFieldLabel icon="book" label="Description" />
      <AppTextarea :model-value="props.description" @update:modelValue="v => emit('update:description', v)" placeholder="Short descriptive blurb" :rows="2" variant="filled" />
    </div>

    <div class="mt-3">
      <AppFieldLabel icon="info" label="Traits" />
      <AppTagInput :model-value="props.traits" @update:modelValue="v => emit('update:traits', v)" placeholder="Type a trait and press Enter" />
    </div>
  </AppCard>
</template>
