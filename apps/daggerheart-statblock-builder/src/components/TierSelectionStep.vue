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
    variant="surface"
    overline="Setup"
    title="Tier & Scope"
    subtitle="Choose the statblock type and tier to unlock tuned recommendations."
  >
    <section class="form-section">
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
    </section>

    <section class="form-section">
    <div class="field-cluster">
      <AppFieldLabel icon="book" label="Tier" />
      <AppButtonGroup
        :options="tierOptions"
        :model-value="String(props.tier ?? defaultTier)"
        @update:modelValue="v => emit('update:tier', Number(v))"
      />
        </div>
  </section>

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
.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 1.1rem 1.2rem;
  border-radius: 1.1rem;
  background: color-mix(in srgb, var(--surface-veil) 64%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 24%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.form-section + .form-section {
  margin-top: var(--space-md);
}

.field-cluster {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.guide-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.15rem 1.2rem;
  border-radius: 1.15rem;
  background: color-mix(in srgb, var(--surface-veil) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 26%, transparent);
  position: relative;
  isolation: isolate;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.guide-panel::after {
  content: '';
  position: absolute;
  inset: auto;
  bottom: -80px;
  right: -20%;
  width: 55%;
  height: 160px;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 14%, transparent), transparent 72%);
  opacity: 0.26;
  pointer-events: none;
  filter: blur(26px);
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
  color: color-mix(in srgb, var(--md-sys-color-primary) 80%, transparent);
}

.guide-summary {
  margin: 0;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant) 88%, transparent);
  font-size: 0.92rem;
  line-height: 1.4;
}

.guide-grid {
  gap: 1rem;
}

.focus {
  margin: 0;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 90%, transparent);
  font-size: 0.85rem;
  line-height: 1.45;
}

h4 {
  margin: 0 0 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 88%, transparent);
}
</style>


