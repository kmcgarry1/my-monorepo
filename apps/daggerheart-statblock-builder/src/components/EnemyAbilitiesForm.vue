<script setup lang="ts">
import { computed } from 'vue'
import type { Enemy } from '../types'
import AttackEditorList from './AttackEditorList.vue'
import FeatureEditorList from './FeatureEditorList.vue'
import { getEnemyTierGuidance } from '../lib/tierGuides'
import { AppCard } from '@my-monorepo/ui'

const props = defineProps<{ enemy: Enemy; tier: number | null }>()
const guidance = computed(() => getEnemyTierGuidance(props.tier, props.enemy.rank))
</script>

<template>
  <AppCard
    variant="surface"
    overline="Abilities"
    title="Signature moves"
    :subtitle="guidance?.features"
    class="abilities-card"
  >
    <section class="form-section">
      <AttackEditorList v-model="props.enemy.attacks" />
    </section>
    <section class="form-section">
      <FeatureEditorList v-model="props.enemy.features" />
    </section>
  </AppCard>
</template>
<style scoped>
.abilities-card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.abilities-card::after {
  content: '';
  position: absolute;
  inset: auto;
  right: -18%;
  bottom: -70px;
  width: 46%;
  height: 140px;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%);
  opacity: 0.25;
  pointer-events: none;
  filter: blur(24px);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 1.05rem 1.15rem;
  border-radius: 1.1rem;
  background: var(--glass-surface-strong);
  border: none;
  box-shadow: var(--glass-shadow-md), var(--glass-highlight);
}
</style>
