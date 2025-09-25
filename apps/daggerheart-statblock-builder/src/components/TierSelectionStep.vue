<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { listTierGuides, getTierGuide } from '../lib/tierGuides'
import { AppButtonGroup, AppCard, AppCol, AppFieldLabel, AppRow } from '@my-monorepo/ui'

const props = defineProps<{ sbType: 'enemy' | 'environment'; tier: number | null }>()
const emit = defineEmits<{
  (e: 'update:sbType', v: 'enemy' | 'environment'): void
  (e: 'update:tier', v: number | null): void
}>()

const tierGuides = listTierGuides()
const defaultTier = tierGuides[0]?.tier ?? 0

watchEffect(() => {
  if (props.tier == null && tierGuides.length) {
    emit('update:tier', defaultTier)
  }
})

const tierOptions = computed(() => tierGuides.map((guide) => ({ label: `Tier ${guide.tier}`, value: String(guide.tier) })))
const selectedGuide = computed(() => getTierGuide(props.tier ?? defaultTier))
</script>

<template>
  <AppCard title="Tier & Scope">
    <div class="mb-3">
      <AppFieldLabel icon="info" label="Statblock Type" />
      <AppButtonGroup :options="[{ label: 'Enemy', value: 'enemy' }, { label: 'Environment', value: 'environment' }]" :model-value="props.sbType" @update:modelValue="v => emit('update:sbType', v as 'enemy' | 'environment')" />
    </div>

    <div>
      <AppFieldLabel icon="book" label="Tier" />
      <AppButtonGroup :options="tierOptions" :model-value="String(props.tier ?? defaultTier)" @update:modelValue="v => emit('update:tier', Number(v))" />
    </div>

    <div v-if="selectedGuide" class="mt-4">
      <p class="summary">{{ selectedGuide.summary }}</p>
      <AppRow :cols="2" class="mt-3">
        <AppCol>
          <h4>Enemies</h4>
          <p class="focus">{{ selectedGuide.enemyFocus }}</p>
        </AppCol>
        <AppCol>
          <h4>Environments</h4>
          <p class="focus">{{ selectedGuide.environmentFocus }}</p>
        </AppCol>
      </AppRow>
    </div>
  </AppCard>
</template>

<style scoped>
.summary {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.focus {
  margin: 0;
  color: var(--fg);
  font-size: 0.85rem;
}

h4 {
  margin: 0 0 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
