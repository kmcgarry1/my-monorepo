<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Recipe, Component, RecipeData } from '../types/recipe'

const props = defineProps<{ modelValue: RecipeData }>()
const emit = defineEmits<{ (e:'update:modelValue', v: RecipeData): void }>()

const blankRecipe = (): Recipe => ({
  id: '',
  page: null,
  name: '',
  metadata: { type: '', valueGp: null, rarity: '', attunement: null, attunementNote: '' },
  components: [],
  notes: '',
  tags: [],
})

const form = reactive<Recipe>(blankRecipe())

function reset() { Object.assign(form, blankRecipe()) }

function addComponent() { form.components.push({ type: '', metatag: '', component: '' }) }
function removeComponent(i: number) { form.components.splice(i,1) }

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')
}

function save() {
  const id = form.id || toSlug(form.name)
  if (!id) return
  const exists = props.modelValue.recipes.find(r => r.id === id)
  const tags = Array.isArray(form.tags)
    ? form.tags.map(String)
    : String(form.tags || '')
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
  const recipe: Recipe = JSON.parse(JSON.stringify({ ...form, id, tags }))
  const data: RecipeData = { ...props.modelValue, recipes: [] }
  if (exists) {
    data.recipes = props.modelValue.recipes.map(r => r.id === id ? recipe : r)
  } else {
    data.recipes = [...props.modelValue.recipes, recipe]
  }
  emit('update:modelValue', data)
  reset()
}
</script>

<template>
  <div class="editor">
    <div class="row">
      <label>ID</label>
      <input v-model="form.id" placeholder="auto from name if empty" />
      <label>Page</label>
      <input v-model.number="form.page" type="number" min="1" placeholder="optional" />
    </div>
    <div class="row">
      <label>Name</label>
      <input v-model="form.name" />
    </div>
    <fieldset class="meta">
      <legend>Metadata</legend>
      <div class="row">
        <label>Type</label>
        <input v-model="form.metadata.type" />
        <label>Value (gp)</label>
        <input v-model.number="form.metadata.valueGp" type="number" min="0" step="1" />
      </div>
      <div class="row">
        <label>Rarity</label>
        <select v-model="form.metadata.rarity">
          <option value=""></option>
          <option>common</option>
          <option>uncommon</option>
          <option>rare</option>
          <option>very_rare</option>
          <option>legendary</option>
          <option>artifact</option>
          <option>other</option>
        </select>
        <label>Attunement</label>
        <select v-model="(form.metadata.attunement as any)">
          <option :value="null">unknown</option>
          <option :value="true">yes</option>
          <option :value="false">no</option>
        </select>
        <label>Note</label>
        <input v-model="form.metadata.attunementNote" placeholder="e.g., by a ranger" />
      </div>
    </fieldset>
    <fieldset class="comps">
      <legend>Components</legend>
      <div v-for="(c, i) in form.components" :key="i" class="row">
        <label>#{{ i+1 }}</label>
        <input v-model="c.type" placeholder="type" />
        <input v-model="c.metatag" placeholder="metatag" />
        <input v-model="c.component" placeholder="component" class="grow" />
        <button type="button" class="btn" @click="removeComponent(i)">Remove</button>
      </div>
      <button type="button" class="btn" @click="addComponent">Add Component</button>
    </fieldset>
    <div class="row">
      <label>Notes</label>
      <input v-model="form.notes" class="grow" />
    </div>
    <div class="row">
      <label>Tags</label>
      <input v-model="(form.tags as any)" placeholder="semicolon ; separated" class="grow" />
    </div>
    <div class="actions">
      <button class="btn primary" @click="save">Save Recipe</button>
      <button class="btn" @click="reset">Reset</button>
    </div>
  </div>
</template>

<style scoped>
.editor { display: grid; gap: .6rem; }
.row { display: grid; grid-template-columns: max-content 1fr max-content 1fr; gap: .5rem; align-items: center; }
.row .grow { grid-column: span 3; }
fieldset { border: 1px solid #ddd; padding: .5rem; }
legend { padding: 0 .3rem; color: #666; }
.btn { border: 1px solid #ccc; background: #f6f6f6; padding: .35rem .6rem; cursor: pointer; }
.primary { background: #2563eb; color: #fff; border-color: #1d4ed8; }
@media (prefers-color-scheme: dark) {
  fieldset { border-color: #333; }
  legend { color: #aaa; }
  .btn { background: #1f1f1f; border-color: #333; color: #eee; }
  .primary { background: #3b82f6; border-color: #2563eb; }
}
</style>
