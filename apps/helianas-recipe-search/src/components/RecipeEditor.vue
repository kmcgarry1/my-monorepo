<script setup lang="ts">
import { reactive } from 'vue'
import type { Recipe, RecipeData } from '../types/recipe'

const props = defineProps<{ modelValue: RecipeData }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: RecipeData): void }>()

const blankRecipe = (): Recipe => ({
  id: '',
  page: null,
  name: '',
  metadata: { type: '', valueGp: null, rarity: '', attunement: null, attunementNote: '' },
  components: [],
  notes: '',
  tags: []
})

const form = reactive<Recipe>(blankRecipe())

function reset() {
  Object.assign(form, blankRecipe())
}

function addComponent() {
  form.components.push({ type: '', metatag: '', component: '' })
}

function removeComponent(i: number) {
  form.components.splice(i, 1)
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function save() {
  const id = form.id || toSlug(form.name)
  if (!id) return
  const exists = props.modelValue.recipes.find((r) => r.id === id)
  const tags = Array.isArray(form.tags)
    ? form.tags.map(String)
    : String(form.tags || '')
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
  const recipe: Recipe = JSON.parse(JSON.stringify({ ...form, id, tags }))
  const data: RecipeData = { ...props.modelValue, recipes: [] }
  if (exists) {
    data.recipes = props.modelValue.recipes.map((r) => (r.id === id ? recipe : r))
  } else {
    data.recipes = [...props.modelValue.recipes, recipe]
  }
  emit('update:modelValue', data)
  reset()
}
</script>

<template>
  <div class="editor">
    <header class="section-heading">
      <h2>Compose a new recipe</h2>
      <p>Fill in the core attributes, add components, and capture any notes or tags. Everything embraces Material 3 expressive surfaces.</p>
    </header>

    <div class="form-grid two-column">
      <label class="field">
        <span class="field-label">Stable ID</span>
        <input v-model="form.id" placeholder="Auto-generated if left blank" />
        <span class="field-support">Used for import/export consistency.</span>
      </label>
      <label class="field">
        <span class="field-label">Page</span>
        <input v-model.number="form.page" type="number" min="1" placeholder="Optional" />
        <span class="field-support">Where to find the recipe in print.</span>
      </label>
    </div>

    <label class="field">
      <span class="field-label">Recipe name</span>
      <input v-model="form.name" placeholder="e.g., Phoenix Fire Elixir" />
    </label>

    <section class="card">
      <header class="card-header">
        <h3>Metadata</h3>
        <p>Describe rarity, value, and attunement details.</p>
      </header>
      <div class="form-grid three-column">
        <label class="field">
          <span class="field-label">Type</span>
          <input v-model="form.metadata.type" placeholder="Consumable, wondrous item…" />
        </label>
        <label class="field">
          <span class="field-label">Value (gp)</span>
          <input v-model.number="form.metadata.valueGp" type="number" min="0" step="1" />
        </label>
        <label class="field">
          <span class="field-label">Rarity</span>
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
        </label>
        <label class="field">
          <span class="field-label">Attunement</span>
          <select v-model="(form.metadata.attunement as any)">
            <option :value="null">Unknown</option>
            <option :value="true">Required</option>
            <option :value="false">Not required</option>
          </select>
        </label>
        <label class="field span-two">
          <span class="field-label">Attunement note</span>
          <input v-model="form.metadata.attunementNote" placeholder="e.g., by a ranger" />
        </label>
      </div>
    </section>

    <section class="card">
      <header class="card-header">
        <h3>Components</h3>
        <p>Add each required component, including metatag information.</p>
      </header>
      <div class="component-list">
        <div v-if="!form.components.length" class="component-empty">
          <p>No components yet. Add one to get started.</p>
        </div>
        <div v-for="(c, i) in form.components" :key="i" class="component-card">
          <header>
            <span class="component-index">Component #{{ i + 1 }}</span>
            <button type="button" class="chip danger" @click="removeComponent(i)">
              <span class="chip-label">Remove</span>
            </button>
          </header>
          <div class="form-grid three-column">
            <label class="field">
              <span class="field-label">Type</span>
              <input v-model="c.type" placeholder="Gem, organ, essence…" />
            </label>
            <label class="field">
              <span class="field-label">Metatag</span>
              <input v-model="c.metatag" placeholder="e.g., rare" />
            </label>
            <label class="field span-two">
              <span class="field-label">Component description</span>
              <input v-model="c.component" placeholder="Describe the harvested item" />
            </label>
          </div>
        </div>
      </div>
      <button type="button" class="chip tonal" @click="addComponent">
        <span class="chip-label">Add component</span>
      </button>
    </section>

    <div class="form-grid two-column">
      <label class="field span-two">
        <span class="field-label">Notes</span>
        <textarea v-model="form.notes" rows="3" placeholder="Flavor, crafting instructions, reminders…" />
      </label>
      <label class="field span-two">
        <span class="field-label">Tags</span>
        <input v-model="(form.tags as any)" placeholder="Use semicolons to separate tags" />
        <span class="field-support">Example: crafting; fire; downtime</span>
      </label>
    </div>

    <div class="actions">
      <button class="cta filled" type="button" @click="save">Save recipe</button>
      <button class="cta outlined" type="button" @click="reset">Reset form</button>
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: grid;
  gap: clamp(1rem, 3vw, 1.9rem);
}

.section-heading {
  display: grid;
  gap: 0.4rem;
}

.section-heading h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
}

.section-heading p {
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.6rem;
}

.form-grid {
  display: grid;
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.two-column {
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}

.three-column {
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
}

.span-two {
  grid-column: span 2;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
  color: color-mix(in srgb, var(--accent) 55%, var(--md-sys-color-on-surface-variant));
}

.field input,
.field select,
.field textarea {
  border-radius: 0.95rem;
  border: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
  background: color-mix(in srgb, var(--glass-surface-soft) 96%, transparent);
  padding: 0.75rem 1rem;
  font: inherit;
  color: var(--md-sys-color-on-surface);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.32);
  transition: border-color var(--motion-duration-sm) var(--motion-easing-emphasized),
    box-shadow var(--motion-duration-sm) var(--motion-easing-emphasized);
}

.field textarea {
  resize: vertical;
}

.field input:focus-visible,
.field select:focus-visible,
.field textarea:focus-visible {
  outline: none;
  border-color: color-mix(in srgb, var(--accent) 65%, transparent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent-weak) 55%, transparent);
}

.field-support {
  font-size: 0.8rem;
  color: var(--md-sys-color-on-surface-variant);
}

.card {
  display: grid;
  gap: 1.1rem;
  padding: clamp(1.1rem, 3vw, 1.6rem);
  background: color-mix(in srgb, var(--glass-surface-strong) 95%, transparent);
  border-radius: clamp(1.2rem, 2.5vw, 1.75rem);
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
  box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
}

.card-header {
  display: grid;
  gap: 0.35rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-header p {
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
}

.component-list {
  display: grid;
  gap: clamp(0.9rem, 2.5vw, 1.4rem);
}

.component-empty {
  border: 1px dashed color-mix(in srgb, var(--border-muted) 70%, transparent);
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
}

.component-card {
  display: grid;
  gap: 0.9rem;
  padding: clamp(0.9rem, 2.5vw, 1.3rem);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--surface-translucent) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-soft) 75%, transparent);
  box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
}

.component-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.component-index {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--md-sys-color-on-surface-variant);
}

.chip {
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font: inherit;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: background var(--motion-duration-sm) var(--motion-easing-emphasized),
    color var(--motion-duration-sm) var(--motion-easing-emphasized),
    box-shadow var(--motion-duration-sm) var(--motion-easing-emphasized);
}

.chip::before {
  content: '';
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.4;
}

.chip-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.chip.tonal {
  background: color-mix(in srgb, var(--accent-weak) 70%, transparent);
  color: var(--accent-strong);
  box-shadow: var(--shadow-level1);
}

.chip.tonal:hover {
  background: color-mix(in srgb, var(--accent-weak) 80%, transparent);
}

.chip.danger {
  background: color-mix(in srgb, var(--md-sys-color-error) 92%, transparent);
  color: var(--md-sys-color-on-error);
  box-shadow: var(--shadow-level2);
}

.chip.danger:hover {
  background: color-mix(in srgb, var(--md-sys-color-error) 96%, transparent);
}

.chip:focus-visible {
  outline: 2px solid color-mix(in srgb, currentColor 65%, transparent);
  outline-offset: 3px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.cta {
  border-radius: 999px;
  padding: 0.75rem 1.6rem;
  font: inherit;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform var(--motion-duration-sm) var(--motion-easing-emphasized),
    box-shadow var(--motion-duration-sm) var(--motion-easing-emphasized);
}

.cta.filled {
  border: none;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  box-shadow: var(--shadow-level2);
}

.cta.filled:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-level3);
}

.cta.outlined {
  border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  background: color-mix(in srgb, var(--surface-translucent) 92%, transparent);
  color: var(--md-sys-color-on-surface);
}

.cta.outlined:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-level2);
}

.cta:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent) 70%, transparent);
  outline-offset: 3px;
}

@media (max-width: 720px) {
  .span-two {
    grid-column: span 1;
  }

  .actions {
    justify-content: stretch;
  }

  .actions .cta {
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>
