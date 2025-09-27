<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Attack } from '../types'
import {
  AppButton,
  AppCol,
  AppFieldLabel,
  AppIcon,
  AppIconButton,
  AppInput,
  AppRow
} from '@my-monorepo/ui'
import { openGlossary } from '../lib/glossaryState'

const props = withDefaults(defineProps<{ modelValue: Attack[] }>(), {})
const emit = defineEmits<{ (e: 'update:modelValue', v: Attack[]): void }>()

const nextId = ref(1)

function syncNextId(list: Attack[]) {
  const highest = list.reduce((max, attack) => (typeof attack.id === 'number' && attack.id > max ? attack.id : max), 0)
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

function addAttack() {
  const list = props.modelValue.slice()
  const id = nextId.value++
  list.push({ id, name: '', range: '', details: '' })
  emit('update:modelValue', list)
}

function removeAttack(id: number) {
  emit('update:modelValue', props.modelValue.filter((a) => a.id !== id))
}

function updateAttack(idx: number, patch: Partial<Attack>) {
  const list = props.modelValue.slice()
  list[idx] = { ...list[idx], ...patch }
  emit('update:modelValue', list)
}
</script>

<template>
  <div class="editor-shell">
    <div class="editor-header">
      <div class="header-label">
        <AppIcon name="sword" size="sm" color="accent" />
        <span>Attacks</span>
      </div>
      <AppButton variant="primary" size="sm" @click="addAttack">
        <AppIcon name="plus" class="mr-1" />
        Add Attack
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
      <div
        v-for="(a, i) in modelValue"
        :key="a.id"
        class="editor-card"
      >
        <AppRow :cols="4" align="start" class="stat-grid">
          <AppCol>
            <AppFieldLabel icon="sword" label="Name" />
            <AppInput :model-value="a.name" @update:modelValue="v => updateAttack(i, { name: v })" placeholder="e.g., Claws" />
          </AppCol>
          <AppCol>
            <AppFieldLabel icon="arrows" label="Range">
              <AppIconButton name="info" variant="ghost" size="xs" title="Range Bands" @click="openGlossary('range')" />
            </AppFieldLabel>
            <AppInput :model-value="a.range" @update:modelValue="v => updateAttack(i, { range: v })" placeholder="e.g., Very Close" />
          </AppCol>
          <AppCol>
            <AppFieldLabel icon="dice" label="Details">
              <AppIconButton name="info" variant="ghost" size="xs" title="Dice/Notation" @click="openGlossary('dice')" />
            </AppFieldLabel>
            <AppInput class="font-mono" :model-value="a.details" @update:modelValue="v => updateAttack(i, { details: v })" placeholder="e.g., 1d12+2 phy" />
            <p class="helper">Use dice syntax like 1d6, 2d8+2, etc.</p>
          </AppCol>
          <AppCol>
            <div class="card-actions">
              <AppButton variant="danger" size="sm" @click="removeAttack(a.id)">
                <AppIcon name="trash" class="mr-1" />
                Remove
              </AppButton>
            </div>
          </AppCol>
        </AppRow>
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
}

.stat-grid {
  gap: var(--space-sm);
}

.helper {
  margin: 0.4rem 0 0;
  font-size: 0.7rem;
  color: color-mix(in srgb, var(--muted) 78%, transparent);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.25rem;
}
</style>
