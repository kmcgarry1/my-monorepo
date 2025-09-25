<script setup lang="ts">
import { ref } from 'vue'
import type { Attack } from '../types'
import {
  AppButton,
  AppCol,
  AppFieldLabel,
  AppIconButton,
  AppInput,
  AppRow
} from '@my-monorepo/ui'
import { openGlossary } from '../lib/glossaryState'

const props = withDefaults(defineProps<{ modelValue: Attack[] }>(), { })
const emit = defineEmits<{ (e: 'update:modelValue', v: Attack[]): void }>()

let nextId = ref(1)

function addAttack() {
  const list = props.modelValue.slice()
  list.push({ id: nextId.value++, name: '', range: '', details: '' })
  emit('update:modelValue', list)
}
function removeAttack(id: number) {
  emit('update:modelValue', props.modelValue.filter(a => a.id !== id))
}
function updateAttack(idx: number, patch: Partial<Attack>) {
  const list = props.modelValue.slice()
  list[idx] = { ...list[idx], ...patch }
  emit('update:modelValue', list)
}
</script>

<template>
  <div class="mt-3">
    <div class="mb-2 flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm font-semibold text-[var(--fg)]">
        <AppIcon name="sword" class="text-[var(--accent)]" />
        <span>Attacks</span>
      </div>
      <AppButton variant="primary" size="sm" @click="addAttack">
        <AppIcon name="plus" class="mr-1" />
        Add Attack
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
    <div v-for="(a, i) in modelValue" :key="a.id" class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[color:var(--surface-veil)] p-3">
      <AppRow :cols="4" align="start">
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
          <p class="mt-1 text-xs text-[var(--muted)]">Use dice syntax like 1d6, 2d8+2, etc.</p>
        </AppCol>
        <AppCol>
          <div class="mt-5 md:mt-6 lg:mt-7 xl:mt-8 flex items-start justify-end">
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
