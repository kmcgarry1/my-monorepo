<script setup lang="ts">
import { ref } from 'vue'
import { csvParse, csvStringify, fromCsvRows, toCsvRows } from '../lib/csv'
import type { RecipeData } from '../types/recipe'

const props = defineProps<{ modelValue: RecipeData }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: RecipeData): void }>()

const fileName = ref('')
const importError = ref('')

async function onImportCsv(ev: Event) {
  importError.value = ''
  const input = ev.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  fileName.value = f.name
  const text = await f.text()
  try {
    const rows = csvParse(text)
    const data = fromCsvRows(rows)
    emit('update:modelValue', { version: 1, recipes: data.recipes })
  } catch (e: any) {
    importError.value = e?.message ?? String(e)
  } finally {
    input.value = ''
  }
}

function onExportCsv() {
  const rows = toCsvRows(props.modelValue)
  const csv = csvStringify(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'heliana-recipes.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function onExportJson() {
  const text = JSON.stringify(props.modelValue, null, 2)
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'heliana-recipes.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="data-manager">
    <div class="row">
      <label class="btn">
        Import CSV
        <input type="file" accept="text/csv,.csv" @change="onImportCsv" hidden />
      </label>
      <button class="btn" @click="onExportCsv">Export CSV</button>
      <button class="btn" @click="onExportJson">Export JSON</button>
      <span class="file">{{ fileName }}</span>
    </div>
    <div v-if="importError" class="error">{{ importError }}</div>
  </div>
  
</template>

<style scoped>
.data-manager { display: grid; gap: .5rem; }
.row { display: flex; gap: .5rem; align-items: center; }
.btn { border: 1px solid #ccc; background: #f6f6f6; padding: .4rem .6rem; cursor: pointer; }
.file { color: #777; font-size: .9rem; }
.error { color: #b00020; }
@media (prefers-color-scheme: dark) {
  .btn { background: #1f1f1f; border-color: #333; color: #eee; }
}
</style>

