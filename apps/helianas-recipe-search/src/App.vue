<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import DataManager from './components/DataManager.vue'
import RecipeEditor from './components/RecipeEditor.vue'
import RecipeList from './components/RecipeList.vue'
import type { RecipeData } from './types/recipe'

const data = ref<RecipeData>({ version: 1, recipes: [] })
const tab = ref<'browse'|'edit'|'data'>('browse')

function loadInitial() {
  const ls = localStorage.getItem('hrs:data')
  if (ls) {
    try { data.value = JSON.parse(ls) } catch {}
  }
  import('../data/heliana-recipes.json')
    .then(mod => { if (!ls) data.value = mod.default as any })
    .catch(() => {})
}

onMounted(loadInitial)

watch(data, (v) => localStorage.setItem('hrs:data', JSON.stringify(v)), { deep: true })
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Heliana's Recipe Search</h1>
      <p class="tagline">Import CSV, search recipes, and add new ones.</p>
    </header>

    <nav class="tabs">
      <button :class="{active: tab==='browse'}" @click="tab='browse'">Browse/Search</button>
      <button :class="{active: tab==='edit'}" @click="tab='edit'">Add/Edit Recipe</button>
      <button :class="{active: tab==='data'}" @click="tab='data'">Import/Export</button>
    </nav>

    <section v-if="tab==='browse'">
      <RecipeList v-model="data" />
    </section>
    <section v-else-if="tab==='edit'">
      <RecipeEditor v-model="data" />
    </section>
    <section v-else>
      <DataManager v-model="data" />
    </section>
  </div>
  
</template>

<style scoped>
.app { max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }
.header { margin-bottom: 1rem; }
.header h1 { margin: 0; font-size: 1.6rem; }
.tagline { margin: .25rem 0 0; color: #666; }
.tabs { display: flex; gap: .5rem; margin-bottom: 1rem; }
.tabs button { border: 1px solid #ccc; background: #f6f6f6; padding: .4rem .6rem; cursor: pointer; }
.tabs .active { background: #2563eb; color: #fff; border-color: #1d4ed8; }
@media (prefers-color-scheme: dark) {
  .tabs button { background: #1f1f1f; border-color: #333; color: #eee; }
  .tabs .active { background: #3b82f6; border-color: #2563eb; }
}
</style>

