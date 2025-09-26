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
    title="Features &amp; Prompts"
    :subtitle="guidance?.features"
    variant="surface"
  >
    <FeatureEditorList v-model="props.environment.features" />
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
  </AppCard>
</template>

<style scoped>
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
