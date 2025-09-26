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
  <AppCard title="Abilities & Features">
    <p v-if="guidance" class="intro">{{ guidance.features }}</p>
    <AttackEditorList v-model="props.enemy.attacks" />
    <FeatureEditorList v-model="props.enemy.features" />
  </AppCard>
</template>

<style scoped>
.intro {
  margin: 0 0 0.75rem;
  color: var(--muted);
  font-size: 0.85rem;
}
</style>
