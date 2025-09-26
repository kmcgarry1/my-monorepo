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
    title="Abilities &amp; Features"
    :subtitle="guidance?.features"
    variant="surface"
  >
    <AttackEditorList v-model="props.enemy.attacks" />
    <FeatureEditorList v-model="props.enemy.features" />
  </AppCard>
</template>
