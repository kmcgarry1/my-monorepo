<script setup lang="ts">
import { computed } from 'vue'
import type { Environment } from '../types'
import FeatureEditorList from './FeatureEditorList.vue'
import { openGlossary } from '../lib/glossaryState'
import { getEnvironmentTierGuidance } from '../lib/tierGuides'
import { AppCard, AppFieldLabel, AppIconButton, AppTextarea } from '@my-monorepo/ui'

const props = defineProps<{ environment: Environment; tier: number | null }>()
const guidance = computed(() => getEnvironmentTierGuidance(props.tier, props.environment.category))
</script>

<template>
  <AppCard
    variant="surface"
    overline="Features"
    title="Scene prompts"
    :subtitle="guidance?.features"
    class="features-card"
  >
    <section class="form-section">
      <FeatureEditorList v-model="props.environment.features" />
    </section>
    <section class="form-section">
      <div class="field-cluster">
        <AppFieldLabel label="GM Prompts">
          <AppIconButton name="info" variant="ghost" size="xs" title="GM Prompts" @click="openGlossary('gm-prompts')" />
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
.features-card {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.features-card::after {
  content: '';
  position: absolute;
  inset: auto;
  left: 15%;
  bottom: -70px;
  width: 50%;
  height: 140px;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--env-accent) 18%, transparent), transparent 70%);
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
  background: color-mix(in srgb, var(--surface-veil) 66%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 24%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
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
}
</style>
