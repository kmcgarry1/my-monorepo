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
  <AppCard title="Features & Prompts">
    <p v-if="guidance" class="intro">{{ guidance.features }}</p>
    <FeatureEditorList v-model="props.environment.features" />
    <div class="mt-3">
      <AppFieldLabel label="GM Prompts">
        <AppIconButton name="info" variant="ghost" size="xs" title="GM Prompts" @click="openGlossary('gm-prompts')" />
      </AppFieldLabel>
      <AppTextarea :model-value="props.environment.prompts" @update:modelValue="v => props.environment.prompts = v" :rows="3" placeholder="Add guiding questions…" />
      <p v-if="guidance" class="hint">{{ guidance.prompts }}</p>
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
  color: var(--muted);
  font-size: 0.75rem;
}
</style>
