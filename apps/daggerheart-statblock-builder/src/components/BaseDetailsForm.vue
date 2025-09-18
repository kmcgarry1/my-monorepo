<script setup lang="ts">
import {
  AppButtonGroup,
  AppCard,
  AppCol,
  AppFieldLabel,
  AppInput,
  AppRow,
  AppTagInput,
  AppTextarea
} from '@my-monorepo/ui'

const props = defineProps<{
  sbType: 'enemy' | 'environment'
  name: string
  tier: number | null
  description: string
  traits: string
}>()

const emit = defineEmits<{
  (e: 'update:sbType', v: 'enemy' | 'environment'): void
  (e: 'update:name', v: string): void
  (e: 'update:tier', v: number | null): void
  (e: 'update:description', v: string): void
  (e: 'update:traits', v: string): void
}>()
</script>

<template>
  <AppCard title="Details">
    <div class="mb-3">
      <AppFieldLabel icon="info" label="Statblock Type" />
      <AppButtonGroup :options="[{label:'Enemy', value:'enemy'}, {label:'Environment', value:'environment'}]" :model-value="props.sbType" @update:modelValue="v => emit('update:sbType', v as any)" />
    </div>

    <AppRow :cols="2">
      <AppCol>
        <AppFieldLabel icon="sword" label="Name" />
        <AppInput :model-value="props.name" @update:modelValue="v => emit('update:name', v)" placeholder="e.g., Acid Burrower" />
      </AppCol>
      <AppCol>
        <AppFieldLabel icon="info" label="Tier" />
        <AppInput type="number" :model-value="props.tier ?? ''" @update:modelValue="v => emit('update:tier', Number(v) || null)" min="0" max="5" placeholder="e.g., 1" />
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
