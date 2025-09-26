<script setup lang="ts">
import { computed } from 'vue'
import type { Enemy } from '../types'
import { openGlossary } from '../lib/glossaryState'
import { getEnemyTierGuidance } from '../lib/tierGuides'
import {
  AppButton,
  AppCard,
  AppCol,
  AppFieldLabel,
  AppIconButton,
  AppInput,
  AppRow,
  AppSelect
} from '@my-monorepo/ui'

const props = defineProps<{ enemy: Enemy; tier: number | null }>()

const thresholdsOk = computed(() => !props.enemy.thresholds || /^\s*\d+\s*\/\s*\d+\s*$/.test(props.enemy.thresholds))
const guidance = computed(() => getEnemyTierGuidance(props.tier, props.enemy.rank))

function apply(field: 'difficulty' | 'hp' | 'stress' | 'atkBonus') {
  const tip = guidance.value
  if (!tip) return
  const value = tip[field]?.default
  if (value == null) return
  if (field === 'difficulty') props.enemy.difficulty = value
  if (field === 'hp') props.enemy.hp = value
  if (field === 'stress') props.enemy.stress = value
  if (field === 'atkBonus') props.enemy.atkBonus = value
}
</script>

<template>
  <AppCard
    title="Threat Profile"
    :subtitle="guidance?.summary"
    variant="surface"
  >
    <AppRow :cols="3" class="gap-4">
      <AppCol>
        <AppFieldLabel label="Rank" />
        <AppSelect
          :model-value="props.enemy.rank"
          @update:modelValue="v => props.enemy.rank = v as any"
          :options="[
            { label: '', value: '' },
            { label: 'Minion', value: 'Minion' },
            { label: 'Standard', value: 'Standard' },
            { label: 'Elite', value: 'Elite' },
            { label: 'Boss', value: 'Boss' },
            { label: 'Solo', value: 'Solo' }
          ]"
        />
      </AppCol>
      <AppCol>
        <AppFieldLabel label="Difficulty" />
        <AppInput
          type="number"
          :model-value="props.enemy.difficulty"
          @update:modelValue="v => props.enemy.difficulty = v"
          min="0"
          placeholder="e.g., 14"
        />
        <div v-if="guidance" class="hint">
          <span>Tier guidance: {{ guidance.difficulty.min }}-{{ guidance.difficulty.max }}</span>
          <AppButton variant="subtle" size="xs" @click="apply('difficulty')">Use {{ guidance.difficulty.default }}</AppButton>
        </div>
      </AppCol>
      <AppCol>
        <AppFieldLabel label="Thresholds">
          <AppIconButton name="info" variant="ghost" size="xs" title="Thresholds" @click="openGlossary('thresholds')" />
        </AppFieldLabel>
        <AppInput
          :model-value="props.enemy.thresholds"
          @update:modelValue="v => props.enemy.thresholds = v"
          placeholder="e.g., 8/15"
          :invalid="!thresholdsOk"
        />
        <small v-if="!thresholdsOk" class="error">Use format like 8/15 (Stage/Severe)</small>
        <p v-else-if="guidance" class="hint">Suggested: {{ guidance.thresholds }}</p>
      </AppCol>
    </AppRow>

    <AppRow :cols="3" class="gap-4">
      <AppCol>
        <AppFieldLabel label="HP">
          <AppIconButton name="info" variant="ghost" size="xs" title="Health" @click="openGlossary('hp')" />
        </AppFieldLabel>
        <AppInput
          type="number"
          :model-value="props.enemy.hp"
          @update:modelValue="v => props.enemy.hp = v"
          min="0"
          placeholder="e.g., 8"
        />
        <div v-if="guidance" class="hint">
          <span>{{ guidance.hp.min }}-{{ guidance.hp.max }} HP</span>
          <AppButton variant="subtle" size="xs" @click="apply('hp')">Use {{ guidance.hp.default }}</AppButton>
        </div>
      </AppCol>
      <AppCol>
        <AppFieldLabel label="Stress">
          <AppIconButton name="info" variant="ghost" size="xs" title="Stress" @click="openGlossary('stress')" />
        </AppFieldLabel>
        <AppInput
          type="number"
          :model-value="props.enemy.stress"
          @update:modelValue="v => props.enemy.stress = v"
          min="0"
          placeholder="e.g., 3"
        />
        <div v-if="guidance" class="hint">
          <span>{{ guidance.stress.min }}-{{ guidance.stress.max }} Stress</span>
          <AppButton variant="subtle" size="xs" @click="apply('stress')">Use {{ guidance.stress.default }}</AppButton>
        </div>
      </AppCol>
      <AppCol>
        <AppFieldLabel label="ATK Bonus">
          <AppIconButton name="info" variant="ghost" size="xs" title="Attack" @click="openGlossary('attack')" />
        </AppFieldLabel>
        <AppInput
          type="number"
          :model-value="props.enemy.atkBonus"
          @update:modelValue="v => props.enemy.atkBonus = v"
          placeholder="e.g., 3"
        />
        <div v-if="guidance" class="hint">
          <span>Suggested +{{ guidance.atkBonus.min }} to +{{ guidance.atkBonus.max }}</span>
          <AppButton variant="subtle" size="xs" @click="apply('atkBonus')">Use +{{ guidance.atkBonus.default }}</AppButton>
        </div>
      </AppCol>
    </AppRow>

    <div class="field-cluster">
      <AppFieldLabel label="Experience" />
      <AppInput
        :model-value="props.enemy.experience"
        @update:modelValue="v => props.enemy.experience = v"
        placeholder="e.g., Tremor Sense +2"
      />
      <p v-if="guidance" class="hint">{{ guidance.experience }}</p>
    </div>

    <div class="field-cluster">
      <AppFieldLabel label="Motives &amp; Tactics">
        <AppIconButton name="info" variant="ghost" size="xs" title="Tactics" @click="openGlossary('tactics')" />
      </AppFieldLabel>
      <AppInput
        :model-value="props.enemy.tactics"
        @update:modelValue="v => props.enemy.tactics = v"
        placeholder="e.g., Burrow, drag away, feed, reposition"
      />
      <p v-if="guidance" class="hint">{{ guidance.tactics }}</p>
    </div>
  </AppCard>
</template>

<style scoped>
.field-cluster {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hint {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant) 92%, transparent);
}

.error {
  color: #e11d48;
  font-size: 0.74rem;
  margin-top: 0.15rem;
}
</style>

