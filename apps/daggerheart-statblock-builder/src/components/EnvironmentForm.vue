<script setup lang="ts">
import type { Environment } from '../types'
import FeatureEditorList from './FeatureEditorList.vue'
import { openGlossary } from '../lib/glossaryState'
import {
  AppCard,
  AppCol,
  AppFieldLabel,
  AppIconButton,
  AppInput,
  AppRow,
  AppSelect,
  AppTextarea
} from '@my-monorepo/ui'

const props = defineProps<{ environment: Environment }>()
</script>

<template>
  <AppCard title="Environment">
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
      </AppCol>
    </AppRow>

    <div class="mt-3">
      <AppFieldLabel label="Impulses">
        <AppIconButton name="info" variant="ghost" size="xs" title="Impulses" @click="openGlossary('impulses')" />
      </AppFieldLabel>
      <AppInput :model-value="props.environment.impulses" @update:modelValue="v => props.environment.impulses = v" placeholder="e.g., Bar crossing, carry away the unready…" />
    </div>

    <div class="mt-3">
      <AppFieldLabel label="Potential Adversaries">
        <AppIconButton name="info" variant="ghost" size="xs" title="Potential Adversaries" @click="openGlossary('potential-adversaries')" />
      </AppFieldLabel>
        <AppTextarea :model-value="props.environment.potential" @update:modelValue="v => props.environment.potential = v" :rows="2" placeholder="e.g., Beasts (Bear, Glass Snake), Jagged Knife Bandits…" />
    </div>

    <FeatureEditorList v-model="props.environment.features" />

    <div class="mt-3">
      <AppFieldLabel label="GM Prompts">
        <AppIconButton name="info" variant="ghost" size="xs" title="GM Prompts" @click="openGlossary('gm-prompts')" />
      </AppFieldLabel>
        <AppTextarea :model-value="props.environment.prompts" @update:modelValue="v => props.environment.prompts = v" :rows="3" placeholder="Add guiding questions…" />
    </div>
  </AppCard>
</template>
