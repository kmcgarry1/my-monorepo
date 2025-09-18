<script setup lang="ts">
import type { Feature, FeatureTag } from '../types'
import { openGlossary } from '../lib/glossaryState'

const props = defineProps<{
  modelValue: Feature[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: Feature[]): void
}>()

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
  <div style="margin-top:1rem;">
    <div style="display:flex; align-items:center; justify-content:space-between;">
      <h3 style="margin:0; font-size:1rem;">Features</h3>
      <button type="button" @click="addFeature">Add Feature</button>
    </div>
    <div v-for="(f, i) in modelValue" :key="f.id" class="feature-row" style="border:1px solid #e5e7eb; border-radius:.5rem; padding:.5rem; margin-top:.5rem;">
      <div class="row">
        <div>
          <label>Name</label>
          <input :value="f.name" @input="updateFeature(i, { name: ($event.target as HTMLInputElement).value })" placeholder="Feature name" style="width:100%; padding:.5rem;" />
        </div>
        <div>
          <label>Tag <button type="button" class="ml-1" style="color: var(--link); text-decoration: underline; text-decoration-style: dotted;" @click="openGlossary(f.tag.toLowerCase())">what's this?</button></label>
          <select :value="f.tag" @change="updateFeature(i, { tag: (($event.target as HTMLSelectElement).value as FeatureTag) })" style="width:100%; padding:.45rem;">
            <option>Passive</option>
            <option>Action</option>
            <option>Reaction</option>
          </select>
        </div>
        <div>
          <label>Cost/Trigger <button type="button" class="ml-1" style="color: var(--link); text-decoration: underline; text-decoration-style: dotted;" @click="openGlossary('fear')">Fear</button> · <button type="button" class="ml-1" style="color: var(--link); text-decoration: underline; text-decoration-style: dotted;" @click="openGlossary('stress')">Stress</button></label>
          <input :value="f.cost" @input="updateFeature(i, { cost: ($event.target as HTMLInputElement).value })" placeholder="e.g., Spend a Fear, Mark Stress" style="width:100%; padding:.5rem;" />
        </div>
        <div style="display:flex; align-items:flex-end">
          <button type="button" @click="removeFeature(f.id)" style="height:2.4rem;">Remove</button>
        </div>
      </div>
      <div style="margin-top:.5rem;">
        <label>Text</label>
        <textarea :value="f.text" @input="updateFeature(i, { text: ($event.target as HTMLTextAreaElement).value })" rows="3" placeholder="Describe the feature…" style="width:100%; padding:.5rem;"></textarea>
      </div>
    </div>
  </div>
</template>
