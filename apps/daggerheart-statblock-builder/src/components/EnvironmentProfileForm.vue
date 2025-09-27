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
  <AppCard
    variant="surface"
    overline="Environment build"
    title="Encounter profile"
    :subtitle="guidance?.summary"
    class="profile-card"
  >
    <section class="form-section">
      <AppRow :cols="2" class="stat-grid">
        <AppCol>
          <AppFieldLabel label="Category">
            <AppIconButton name="info" variant="ghost" size="xs" title="Environment Category" @click="openGlossary('environment-category')" />
          </AppFieldLabel>
          <AppSelect
            :model-value="props.environment.category"
            @update:modelValue="v => props.environment.category = v as any"
            :options="[
              { label: '', value: '' },
              { label: 'Traversal', value: 'Traversal' },
              { label: 'Hazard', value: 'Hazard' },
              { label: 'Encounter', value: 'Encounter' }
            ]"
          />
        </AppCol>
        <AppCol>
          <AppFieldLabel label="Difficulty">
            <AppIconButton name="info" variant="ghost" size="xs" title="Difficulty" @click="openGlossary('difficulty')" />
          </AppFieldLabel>
          <AppInput
            type="number"
            :model-value="props.environment.difficulty"
            @update:modelValue="v => props.environment.difficulty = v"
            min="0"
            placeholder="e.g., 10"
          />
          <div v-if="guidance" class="hint">
            <span>Tier guidance: {{ guidance.difficulty.min }}-{{ guidance.difficulty.max }}</span>
            <AppButton variant="subtle" size="xs" @click="applyDifficulty">Use {{ guidance.difficulty.default }}</AppButton>
          </div>
        </AppCol>
      </AppRow>
    </section>

    <section class="form-section">
      <div class="field-cluster">
        <AppFieldLabel label="Impulses">
          <AppIconButton name="info" variant="ghost" size="xs" title="Impulses" @click="openGlossary('impulses')" />
        </AppFieldLabel>
        <AppInput
          :model-value="props.environment.impulses"
          @update:modelValue="v => props.environment.impulses = v"
          placeholder="e.g., Bar crossing, carry away the unready..."
        />
        <p v-if="guidance" class="hint">{{ guidance.impulses }}</p>
      </div>
    </section>

    <section class="form-section">
      <div class="field-cluster">
        <AppFieldLabel label="Potential Adversaries">
          <AppIconButton name="info" variant="ghost" size="xs" title="Potential Adversaries" @click="openGlossary('potential-adversaries')" />
        </AppFieldLabel>
        <AppTextarea
          :model-value="props.environment.potential"
          @update:modelValue="v => props.environment.potential = v"
          :rows="2"
          placeholder="e.g., Beasts (Bear, Glass Snake), Jagged Knife Bandits..."
        />
        <p v-if="guidance" class="hint">{{ guidance.potential }}</p>
      </div>
    </section>

    <section class="form-section">
      <div class="field-cluster">
        <AppFieldLabel label="Prompts">
          <AppIconButton name="info" variant="ghost" size="xs" title="Prompts" @click="openGlossary('gm-prompts')" />
        </AppFieldLabel>
        <AppTextarea
          :model-value="props.environment.prompts"
          @update:modelValue="v => props.environment.prompts = v"
          :rows="3"
          placeholder="Add guiding questions..."
        />
        <p v-if="guidance" class="hint">{{ guidance.prompts }}</p>
      </div>
    </section>
  </AppCard>
</template>
<style scoped>
.profile-card {
  position: relative;
  isolation: isolate;
}

.profile-card::after {
  content: '';
  position: absolute;
  inset: auto;
  left: -20%;
  top: -80px;
  width: 50%;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--env-accent) 18%, transparent), transparent 70%);
  opacity: 0.25;
  pointer-events: none;
  filter: blur(28px);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 1.1rem 1.2rem;
  border-radius: 1.1rem;
  background: var(--glass-surface-strong);
  border: none;
  box-shadow: var(--glass-shadow-md), var(--glass-highlight);
}

.form-section + .form-section {
  margin-top: var(--space-md);
}

.stat-grid {
  gap: var(--space-md);
}

.field-cluster {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hint {
  margin: 0;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant) 92%, transparent);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
</style>

