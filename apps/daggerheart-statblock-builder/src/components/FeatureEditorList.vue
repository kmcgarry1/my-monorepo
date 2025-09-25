<script setup lang="ts">
import type { Feature, FeatureTag } from '../types'
import { openGlossary } from '../lib/glossaryState'
import {
  AppButton,
  AppCol,
  AppFieldLabel,
  AppIcon,
  AppIconButton,
  AppInput,
  AppRow,
  AppSelect,
  AppTextarea,
} from '@my-monorepo/ui'

const props = defineProps<{ modelValue: Feature[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: Feature[]): void }>()

let nextId = 1

function addFeature() {
  const list = props.modelValue.slice()
  list.push({ id: nextId++, name: '', tag: 'Passive', cost: '', text: '' })
  emit('update:modelValue', list)
}
function removeFeature(id: number) {
  emit('update:modelValue', props.modelValue.filter(f => f.id !== id))
}
function updateFeature(idx: number, patch: Partial<Feature>) {
  const list = props.modelValue.slice()
  list[idx] = { ...list[idx], ...patch }
  emit('update:modelValue', list)
}
</script>

<template>
  <div class="mt-3">
    <div class="mb-2 flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm font-semibold text-[color:var(--fg)]">
        <AppIcon name="palette" class="text-[color:var(--accent)]" />
        <span>Features</span>
      </div>
      <AppButton variant="primary" size="sm" @click="addFeature">
        <AppIcon name="plus" class="mr-1" />
        Add Feature
      </AppButton>
    </div>

    <TransitionGroup
      tag="div"
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
      move-class="transition-transform duration-150"
    >
      <div v-for="(f, i) in props.modelValue" :key="f.id" class="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-veil)] p-3">
        <AppRow :cols="4" align="start">
          <AppCol>
            <AppFieldLabel label="Name" />
            <AppInput :model-value="f.name" @update:modelValue="v => updateFeature(i, { name: v })" placeholder="Feature name" />
          </AppCol>
          <AppCol>
            <AppFieldLabel label="Tag">
              <AppIconButton name="info" variant="ghost" size="xs" title="Tag" @click="openGlossary(f.tag.toLowerCase())" />
            </AppFieldLabel>
            <AppSelect :model-value="f.tag" @update:modelValue="v => updateFeature(i, { tag: v as FeatureTag })" :options="[{label:'Passive', value:'Passive'}, {label:'Action', value:'Action'}, {label:'Reaction', value:'Reaction'}]" />
          </AppCol>
          <AppCol>
            <AppFieldLabel label="Cost/Trigger">
              <AppIconButton name="info" variant="ghost" size="xs" title="Glossary" @click="openGlossary('stress')" />
            </AppFieldLabel>
            <AppInput :model-value="f.cost" @update:modelValue="v => updateFeature(i, { cost: v })" placeholder="e.g., Spend a Fear, Mark Stress" />
          </AppCol>
          <AppCol>
            <div class="mt-6 flex items-start justify-end">
              <AppButton variant="danger" size="sm" @click="removeFeature(f.id)">
                <AppIcon name="trash" class="mr-1" />
                Remove
              </AppButton>
            </div>
          </AppCol>
        </AppRow>
        <div class="mt-3">
          <AppFieldLabel label="Text" />
          <AppTextarea :rows="3" :model-value="f.text" @update:modelValue="v => updateFeature(i, { text: v })" placeholder="Describe the feature..." />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
