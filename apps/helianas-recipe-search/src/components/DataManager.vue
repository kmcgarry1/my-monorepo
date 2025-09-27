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
    <header class="section-heading">
      <h2>Data portability</h2>
      <p>Bring in CSV exports from Heliana's Guide or back up your current dataset in CSV or JSON.</p>
    </header>

    <div class="button-row">
      <label class="chip tonal" tabindex="0">
        <input type="file" accept="text/csv,.csv" @change="onImportCsv" hidden />
        <span class="chip-label">Import CSV</span>
      </label>
      <button class="chip filled" type="button" @click="onExportCsv">
        <span class="chip-label">Export CSV</span>
      </button>
      <button class="chip outlined" type="button" @click="onExportJson">
        <span class="chip-label">Export JSON</span>
      </button>
      <span class="file-name" v-if="fileName">{{ fileName }}</span>
    </div>

    <p v-if="importError" class="error-banner" role="alert">{{ importError }}</p>
    <p class="helper-text">CSV imports replace the current dataset. JSON exports include computed fields and metadata.</p>
  </div>
</template>

<style scoped>
.data-manager {
  display: grid;
  gap: clamp(1rem, 3vw, 1.8rem);
}

.section-heading {
  display: grid;
  gap: 0.35rem;
}

.section-heading h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
}

.section-heading p {
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.chip {
  appearance: none;
  border-radius: 999px;
  padding: 0.65rem 1.35rem;
  font: inherit;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: transform var(--motion-duration-sm) var(--motion-easing-emphasized),
    box-shadow var(--motion-duration-sm) var(--motion-easing-emphasized),
    background var(--motion-duration-sm) var(--motion-easing-emphasized);
  border: none;
}

.chip::before {
  content: '';
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.4;
}

.chip-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.chip input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.chip.tonal {
  background: color-mix(in srgb, var(--accent-weak) 75%, transparent);
  color: var(--accent-strong);
  box-shadow: var(--shadow-level1);
}

.chip.filled {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  box-shadow: var(--shadow-level2);
}

.chip.outlined {
  border: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
  background: color-mix(in srgb, var(--surface-translucent) 92%, transparent);
  color: var(--md-sys-color-on-surface);
}

.chip:hover {
  transform: translateY(-1px);
}

.chip:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent) 70%, transparent);
  outline-offset: 3px;
}

.file-name {
  font-size: 0.9rem;
  color: var(--md-sys-color-on-surface-variant);
}

.error-banner {
  margin: 0;
  padding: 0.85rem 1.1rem;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--md-sys-color-error) 92%, transparent);
  color: var(--md-sys-color-on-error);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-error) 70%, transparent);
  box-shadow: var(--shadow-level2);
}

.helper-text {
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.92rem;
}

@media (max-width: 640px) {
  .chip {
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>
