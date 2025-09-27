<script setup lang="ts">
import { ref, watch } from 'vue'
import MiniSearch from 'minisearch'
import type { RecipeData } from '../types/recipe'

const props = defineProps<{ modelValue: RecipeData }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: RecipeData): void }>()

let mini: MiniSearch<any> | null = null
const q = ref('')
const hits = ref<any[]>([])

function buildIndex(data: RecipeData) {
  const docs: any[] = []
  for (const r of data.recipes) {
    const base = {
      id: r.id,
      page: r.page ?? '',
      name: r.name,
      meta_type: r.metadata?.type ?? '',
      value_gp: r.metadata?.valueGp ?? '',
      rarity: r.metadata?.rarity ?? '',
      attunement: r.metadata?.attunement ?? '',
      attunement_note: r.metadata?.attunementNote ?? '',
      notes: r.notes ?? '',
      tags: (r.tags || []).join(';')
    }
    if (!r.components?.length) {
      docs.push({ ...base, comp_type: '', metatag: '', component: '' })
    } else {
      for (const c of r.components)
        docs.push({ ...base, comp_type: c.type ?? '', metatag: c.metatag ?? '', component: c.component ?? '' })
    }
  }
  mini = new MiniSearch({
    idField: 'id',
    fields: ['name', 'meta_type', 'rarity', 'notes', 'tags', 'comp_type', 'metatag', 'component'],
    storeFields: [
      'id',
      'page',
      'name',
      'meta_type',
      'value_gp',
      'rarity',
      'attunement',
      'attunement_note',
      'comp_type',
      'metatag',
      'component',
      'notes',
      'tags'
    ],
    searchOptions: { fuzzy: 0.2, prefix: true, combineWith: 'AND' }
  })
  mini.addAll(docs.map((d, idx) => ({ ...d, id: `${d.id}-${idx}` })))
}

watch(
  () => props.modelValue,
  (v) => buildIndex(v),
  { deep: true, immediate: true }
)

function searchNow() {
  if (!mini) {
    hits.value = []
    return
  }
  const s = q.value.trim()
  hits.value = s ? (mini.search(s).slice(0, 200) as any[]) : []
}

watch(q, searchNow)

function deleteRecipe(id: string) {
  const data: RecipeData = { ...props.modelValue, recipes: props.modelValue.recipes.filter((r) => r.id !== id) }
  emit('update:modelValue', data)
}
</script>

<template>
  <div class="recipe-list">
    <div class="search-field">
      <label class="field-label" for="search-input">Search recipes</label>
      <div class="field-wrapper">
        <svg class="field-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l5 5L20.49 19zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9" />
        </svg>
        <input
          id="search-input"
          v-model="q"
          class="field-input"
          type="search"
          placeholder="Search by name, component, tags…"
        />
      </div>
      <p class="field-supporting">Type multiple terms to filter across components, tags, rarity, and more.</p>
    </div>

    <div v-if="!hits.length" class="empty-hint">
      <h2>Begin exploring Heliana's vault</h2>
      <p>Start typing to reveal matching recipes and components. Results update instantly using fuzzy search.</p>
    </div>
    <div v-else class="results" role="list">
      <article class="result-card" v-for="h in hits" :key="h.id" role="listitem">
        <header class="result-header">
          <div>
            <h3>{{ h.name }}</h3>
            <p class="result-meta">
              <span class="badge">Page {{ h.page || '—' }}</span>
              <span class="divider" aria-hidden="true">•</span>
              <span>{{ h.meta_type }}</span>
              <span class="divider" aria-hidden="true">•</span>
              <span>Rarity: {{ h.rarity || '—' }}</span>
              <span class="divider" aria-hidden="true">•</span>
              <span>Value: {{ h.value_gp || '—' }} gp</span>
            </p>
          </div>
          <button class="chip danger" type="button" @click="deleteRecipe(h.id.split('-')[0])">
            <span class="chip-label">Delete recipe</span>
          </button>
        </header>
        <dl class="result-details">
          <div>
            <dt>Component</dt>
            <dd>{{ h.comp_type }} <span class="muted">|</span> {{ h.metatag }} <span class="muted">|</span> {{ h.component }}</dd>
          </div>
          <div>
            <dt>Attunement</dt>
            <dd>
              {{ h.attunement === '' ? 'Unknown' : h.attunement }}
              <span v-if="h.attunement_note" class="muted">· {{ h.attunement_note }}</span>
            </dd>
          </div>
          <div v-if="h.notes">
            <dt>Notes</dt>
            <dd>{{ h.notes }}</dd>
          </div>
          <div v-if="h.tags">
            <dt>Tags</dt>
            <dd class="tag-list">
              <span v-for="tag in h.tags.split(';')" :key="tag" class="tag">{{ tag }}</span>
            </dd>
          </div>
        </dl>
      </article>
    </div>
  </div>
</template>

<style scoped>
.recipe-list {
  display: grid;
  gap: clamp(1rem, 3vw, 1.75rem);
}

.search-field {
  display: grid;
  gap: 0.6rem;
}

.field-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
  color: color-mix(in srgb, var(--accent) 65%, var(--md-sys-color-on-surface-variant));
}

.field-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--glass-surface-strong) 96%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-soft) 80%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.32);
  padding-inline: clamp(0.75rem, 2.5vw, 1.1rem);
}

.field-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--md-sys-color-on-surface-variant);
}

.field-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: clamp(0.75rem, 2.6vw, 1rem) 0;
  font-size: 1.05rem;
  color: var(--md-sys-color-on-surface);
}

.field-input:focus-visible {
  outline: none;
}

.field-supporting {
  margin: 0;
  font-size: 0.92rem;
  color: var(--md-sys-color-on-surface-variant);
}

.empty-hint {
  text-align: center;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: color-mix(in srgb, var(--surface-translucent) 92%, transparent);
  border-radius: clamp(1.2rem, 3vw, 1.8rem);
  border: 1px dashed color-mix(in srgb, var(--border-muted) 70%, transparent);
  color: var(--md-sys-color-on-surface-variant);
}

.empty-hint h2 {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  color: var(--md-sys-color-on-surface);
}

.results {
  display: grid;
  gap: clamp(0.9rem, 2.5vw, 1.4rem);
}

.result-card {
  display: grid;
  gap: 0.9rem;
  padding: clamp(1rem, 3vw, 1.4rem);
  background: color-mix(in srgb, var(--glass-surface-strong) 95%, transparent);
  border-radius: clamp(1rem, 3vw, 1.6rem);
  border: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
  box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
  transition: transform var(--motion-duration-sm) var(--motion-easing-emphasized),
    box-shadow var(--motion-duration-sm) var(--motion-easing-emphasized);
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-level3), var(--glass-highlight);
}

.result-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: space-between;
  align-items: flex-start;
}

.result-header h3 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.2rem 0 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.92rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-weak) 80%, transparent);
  color: color-mix(in srgb, var(--accent-strong) 70%, var(--md-sys-color-on-surface));
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.divider {
  opacity: 0.4;
}

.result-details {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

.result-details dt {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: color-mix(in srgb, var(--accent) 55%, var(--md-sys-color-on-surface-variant));
}

.result-details dd {
  margin: 0.25rem 0 0;
  color: var(--md-sys-color-on-surface);
  line-height: 1.5rem;
}

.muted {
  color: var(--md-sys-color-on-surface-variant);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent-weak) 65%, transparent);
  color: var(--accent-strong);
  font-size: 0.8rem;
  font-weight: 600;
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

@media (max-width: 640px) {
  .result-header {
    flex-direction: column;
    align-items: stretch;
  }

  .chip {
    justify-content: center;
  }
}
</style>
