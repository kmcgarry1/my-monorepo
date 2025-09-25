<script setup lang="ts">
import { computed } from 'vue'
import type { Environment } from '../types'
import { openGlossary } from '../lib/glossaryState'
import { getEnvironmentTierGuidance } from '../lib/tierGuides'
import {
  AppButton,
  AppCard,
  AppCol,
  AppFieldLabel,
  AppIconButton,
  AppInput,
  AppRow,
  AppSelect,
  AppTextarea
} from '@my-monorepo/ui'

const props = defineProps<{ environment: Environment; tier: number | null }>()

const guidance = computed(() => getEnvironmentTierGuidance(props.tier, props.environment.category))

function applyDifficulty() {
  const tip = guidance.value
  if (!tip) return
  props.environment.difficulty = tip.difficulty.default
}
</script>

<template>
  <AppCard title="Encounter Profile">
    <p v-if="guidance" class="intro">{{ guidance.summary }}</p>
    <AppRow :cols="2">
      <AppCol>
        <AppFieldLabel label="Category">
          <AppIconButton name="info" variant="ghost" size="xs" title="Environment Category" @click="openGlossary('environment-category')" />
        </AppFieldLabel>
        <AppSelect :model-value="props.environment.category" @update:modelValue="v => props.environment.category = v as any" :options="[{label:'',value:''},{label:'Traversal', value:'Traversal'},{label:'Hazard',value:'Hazard'},{label:'Encounter',value:'Encounter'}]" />
      </AppCol>
      <AppCol>
        <AppFieldLabel label="Difficulty">
          <AppIconButton name="info" variant="ghost" size="xs" title="Difficulty" @click="openGlossary('difficulty')" />
        </AppFieldLabel>
        <AppInput type="number" :model-value="props.environment.difficulty" @update:modelValue="v => props.environment.difficulty = v" min="0" placeholder="e.g., 10" />
        <div v-if="guidance" class="hint">
          <span>Tier guidance: {{ guidance.difficulty.min }}–{{ guidance.difficulty.max }}</span>
          <AppButton variant="subtle" size="xs" @click="applyDifficulty">Use {{ guidance.difficulty.default }}</AppButton>
        </div>
      </AppCol>
    </AppRow>

    <div class="mt-3">
      <AppFieldLabel label="Impulses">
        <AppIconButton name="info" variant="ghost" size="xs" title="Impulses" @click="openGlossary('impulses')" />
      </AppFieldLabel>
      <AppInput :model-value="props.environment.impulses" @update:modelValue="v => props.environment.impulses = v" placeholder="e.g., Bar crossing, carry away the unready…" />
      <p v-if="guidance" class="hint">{{ guidance.impulses }}</p>
    </div>

    <div class="mt-3">
      <AppFieldLabel label="Potential Adversaries">
        <AppIconButton name="info" variant="ghost" size="xs" title="Potential Adversaries" @click="openGlossary('potential-adversaries')" />
      </AppFieldLabel>
      <AppTextarea :model-value="props.environment.potential" @update:modelValue="v => props.environment.potential = v" :rows="2" placeholder="e.g., Beasts (Bear, Glass Snake), Jagged Knife Bandits…" />
      <p v-if="guidance" class="hint">{{ guidance.potential }}</p>
    </div>
  </AppCard>
</template>

<style scoped>
.intro {
  margin: 0 0 0.75rem;
  color: var(--muted);
  font-size: 0.85rem;
}

.hint {
  margin-top: 0.35rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--muted);
}
</style>
