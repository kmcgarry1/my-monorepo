<script setup lang="ts">
import { ref, watch } from 'vue'
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

const nextId = ref(1)

function syncNextId(list: Feature[]) {
  const highest = list.reduce((max, feature) => (typeof feature.id === 'number' && feature.id > max ? feature.id : max), 0)
  const candidate = highest + 1
  if (candidate > nextId.value) nextId.value = candidate
}

watch(
  () => props.modelValue,
  (list) => {
    syncNextId(list)
  },
  { immediate: true, deep: true }
)

function addFeature() {
  const list = props.modelValue.slice()
  const id = nextId.value++
  list.push({ id, name: '', tag: 'Passive', cost: '', text: '' })
  emit('update:modelValue', list)
}

function removeFeature(id: number) {
  emit('update:modelValue', props.modelValue.filter((f) => f.id !== id))
}

function updateFeature(idx: number, patch: Partial<Feature>) {
  const list = props.modelValue.slice()
  list[idx] = { ...list[idx], ...patch }
  emit('update:modelValue', list)
}
</script>

<template>
  <div class="editor-shell">
    <div class="editor-header">
      <div class="header-label">
        <AppIcon name="palette" size="sm" color="accent" />
        <span>Features</span>
      </div>
      <AppButton variant="primary" size="sm" @click="addFeature">
        <AppIcon name="plus" class="mr-1" />
        Add Feature
      </AppButton>
    </div>

    <TransitionGroup
      tag="div"
      class="editor-list"
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
      move-class="transition-transform duration-150"
    >
      <div v-for="(f, i) in props.modelValue" :key="f.id" class="editor-card">
        <AppRow :cols="4" align="start" class="stat-grid">
          <AppCol>
            <AppFieldLabel label="Name" />
            <AppInput :model-value="f.name" @update:modelValue="v => updateFeature(i, { name: v })" placeholder="Feature name" />
          </AppCol>
          <AppCol>
            <AppFieldLabel label="Tag">
              <AppIconButton name="info" variant="ghost" size="xs" title="Tag" @click="openGlossary(f.tag.toLowerCase())" />
            </AppFieldLabel>
            <AppSelect
              :model-value="f.tag"
              @update:modelValue="v => updateFeature(i, { tag: v as FeatureTag })"
              :options="[
                { label: 'Passive', value: 'Passive' },
                { label: 'Action', value: 'Action' },
                { label: 'Reaction', value: 'Reaction' }
              ]"
            />
          </AppCol>
          <AppCol>
            <AppFieldLabel label="Cost/Trigger">
              <AppIconButton name="info" variant="ghost" size="xs" title="Glossary" @click="openGlossary('stress')" />
            </AppFieldLabel>
            <AppInput :model-value="f.cost" @update:modelValue="v => updateFeature(i, { cost: v })" placeholder="e.g., Spend a Fear, Mark Stress" />
          </AppCol>
          <AppCol>
            <div class="card-actions">
              <AppButton variant="danger" size="sm" @click="removeFeature(f.id)">
                <AppIcon name="trash" class="mr-1" />
                Remove
              </AppButton>
            </div>
          </AppCol>
        </AppRow>
        <div class="text-stack">
          <AppFieldLabel label="Text" />
          <AppTextarea :rows="3" :model-value="f.text" @update:modelValue="v => updateFeature(i, { text: v })" placeholder="Describe the feature..." />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
<style scoped>
.editor-shell {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: color-mix(in srgb, var(--surface-veil) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 24%, transparent);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.header-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.editor-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.editor-card {
  padding: 1rem 1.1rem;
  border-radius: 1.1rem;
  background: color-mix(in srgb, var(--surface-veil) 68%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 26%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.stat-grid {
  gap: var(--space-sm);
}

.text-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.25rem;
}
</style>
