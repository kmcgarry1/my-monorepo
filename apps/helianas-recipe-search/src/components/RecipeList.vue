<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import MiniSearch from 'minisearch'
import type { RecipeData, Recipe } from '../types/recipe'

const props = defineProps<{ modelValue: RecipeData }>()
const emit = defineEmits<{ (e:'update:modelValue', v: RecipeData): void }>()

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
      tags: (r.tags || []).join(';'),
    }
    if (!r.components?.length) {
      docs.push({ ...base, comp_type: '', metatag: '', component: '' })
    } else {
      for (const c of r.components) docs.push({ ...base, comp_type: c.type ?? '', metatag: c.metatag ?? '', component: c.component ?? '' })
    }
  }
  mini = new MiniSearch({
    idField: 'id',
    fields: ['name','meta_type','rarity','notes','tags','comp_type','metatag','component'],
    storeFields: ['id','page','name','meta_type','value_gp','rarity','attunement','attunement_note','comp_type','metatag','component','notes','tags'],
    searchOptions: { fuzzy: 0.2, prefix: true, combineWith: 'AND' },
  })
  mini.addAll(docs.map((d, idx) => ({ ...d, id: `${d.id}-${idx}` })))
}

watch(() => props.modelValue, (v) => buildIndex(v), { deep: true, immediate: true })

function searchNow() {
  if (!mini) { hits.value = []; return }
  const s = q.value.trim()
  hits.value = s ? (mini.search(s).slice(0, 200) as any[]) : []
}

watch(q, searchNow)

function deleteRecipe(id: string) {
  const data: RecipeData = { ...props.modelValue, recipes: props.modelValue.recipes.filter(r => r.id !== id) }
  emit('update:modelValue', data)
}
</script>

<template>
  <div class="recipe-list">
    <div class="search">
      <input v-model="q" placeholder="Search by name, component, tags…" />
    </div>
    <div v-if="!hits.length" class="hint">Start typing to search.</div>
    <div v-else class="results">
      <div class="item" v-for="h in hits" :key="h.id">
        <div class="title">{{ h.name }} <span class="muted">(p{{ h.page }})</span></div>
        <div class="meta">Type: {{ h.meta_type }} · Rarity: {{ h.rarity }} · Value: {{ h.value_gp }} gp</div>
        <div class="comp">Component: {{ h.comp_type }} | {{ h.metatag }} | {{ h.component }}</div>
        <div class="actions">
          <button class="btn danger" @click="deleteRecipe(h.id.split('-')[0])">Delete Recipe</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-list { display: grid; gap: .6rem; }
.search input { width: 100%; padding: .6rem .7rem; font-size: 1rem; }
.hint { color: #777; }
.results { display: grid; gap: .5rem; }
.item { border: 1px solid #ddd; padding: .5rem; }
.title { font-weight: 600; }
.muted { color: #777; font-weight: 400; }
.meta, .comp { color: #444; font-size: .95rem; }
.btn { border: 1px solid #ccc; background: #f6f6f6; padding: .3rem .5rem; cursor: pointer; }
.danger { border-color: #7f1d1d; background: #fee2e2; }
@media (prefers-color-scheme: dark) {
  .item { border-color: #333; }
  .muted { color: #aaa; }
  .meta, .comp { color: #bbb; }
  .btn { background: #1f1f1f; border-color: #333; color: #eee; }
  .danger { background: #7f1d1d; color: #fff; border-color: #7f1d1d; }
}
</style>

