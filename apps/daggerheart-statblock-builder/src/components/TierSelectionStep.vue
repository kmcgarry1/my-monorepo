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
  <AppCard
    title="Tier & Scope"
    subtitle="Choose the statblock type and tier to unlock tuned recommendations."
    variant="surface"
  >
    <div class="field-cluster">
      <AppFieldLabel icon="info" label="Statblock Type" />
      <AppButtonGroup
        :options="[
          { label: 'Enemy', value: 'enemy' },
          { label: 'Environment', value: 'environment' }
        ]"
        :model-value="props.sbType"
        @update:modelValue="v => emit('update:sbType', v as 'enemy' | 'environment')"
      />
    </div>

    <div class="field-cluster">
      <AppFieldLabel icon="book" label="Tier" />
      <AppButtonGroup
        :options="tierOptions"
        :model-value="String(props.tier ?? defaultTier)"
        @update:modelValue="v => emit('update:tier', Number(v))"
      />
    </div>

    <section v-if="selectedGuide" class="guide-panel">
      <header class="guide-header">
        <span class="guide-tier">{{ selectedGuide.title }}</span>
        <p class="guide-summary">{{ selectedGuide.summary }}</p>
      </header>
      <AppRow :cols="2" class="guide-grid">
        <AppCol>
          <h4>Enemy focus</h4>
          <p class="focus">{{ selectedGuide.enemyFocus }}</p>
        </AppCol>
        <AppCol>
          <h4>Environment focus</h4>
          <p class="focus">{{ selectedGuide.environmentFocus }}</p>
        </AppCol>
      </AppRow>
    </section>
  </AppCard>
</template>

<style scoped>
.field-cluster {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.guide-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 70%, transparent);
}

.guide-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.guide-tier {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-primary) 85%, transparent);
}

.guide-summary {
  margin: 0;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant) 90%, transparent);
  font-size: 0.92rem;
  line-height: 1.4;
}

.guide-grid {
  gap: 1rem;
}

.focus {
  margin: 0;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 92%, transparent);
  font-size: 0.85rem;
  line-height: 1.45;
}

h4 {
  margin: 0 0 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 90%, transparent);
}
</style>
