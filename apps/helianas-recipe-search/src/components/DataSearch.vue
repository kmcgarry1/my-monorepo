<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MiniSearch from 'minisearch'

type RecipesJson = {
  source: string
  generatedAt: string
  tables: Array<{ page: number; header: string[]; rows: string[][] }>
}

type RowDoc = {
  id: string
  page: number
  header: string[]
  cells: string[]
  joined: string
}

const query = ref('')
const selected = ref<RowDoc | null>(null)
const stats = ref({ source: '', tables: 0, rows: 0 })
const showFullRows = ref(true)

let mini: MiniSearch<RowDoc> | null = null
const resultDocs = ref<RowDoc[]>([])

async function loadData() {
  // Prefer heliana-recipes.json; then recipes.json; then tables.json
  let heliana: any | null = null
  let recipes: RecipesJson | null = null
  const docs: RowDoc[] = []
  try {
    const mod = await import('../../data/heliana-recipes.json')
    heliana = mod.default as any
  } catch {}

  if (heliana && Array.isArray(heliana.recipes)) {
    heliana.recipes.forEach((r: any, idx: number) => {
      const cells = [
        r.name || '',
        r.metadata?.type || '',
        r.metadata?.valueGp || '',
        r.metadata?.rarity || '',
        r.metadata?.att || '',
        r.components?.type || '',
        r.components?.metatag || '',
        r.components?.component || '',
      ]
      const header = ['Name','Type','Value (gp)','Rarity','Att','Comp Type','Metatag','Component']
      docs.push({ id: `${idx}-${r.page}`, page: r.page, header, cells, joined: cells.join(' | ') })
    })
    resultDocs.value = docs
    stats.value = { source: heliana.source || 'heliana-recipes.json', tables: 1, rows: docs.length }
  } else {
    try {
      const mod = await import('../../data/recipes.json')
      recipes = mod.default as RecipesJson
    } catch {}
    if (!recipes) {
      try {
        const mod = await import('../../data/tables.json')
        const tablesLike = mod.default as any
        const rows: string[][] = []
        for (const p of tablesLike.pages || []) for (const r of p.rows || []) rows.push(r.cells || [])
        recipes = { source: tablesLike.source || 'tables.json', generatedAt: tablesLike.generatedAt || '', tables: [{ page: 0, header: [], rows }] }
      } catch (e2) {
        console.error('No data JSON found. Run pnpm extract:heliana')
        return
      }
    }
    let totalRows = 0
    recipes.tables.forEach((t, ti) => {
      t.rows.forEach((r, ri) => {
        const joined = r.join(' | ')
        docs.push({ id: `${ti}-${t.page}:${ri}`, page: t.page, header: t.header, cells: r, joined })
      })
      totalRows += t.rows.length
    })
    resultDocs.value = docs
    stats.value = { source: recipes.source, tables: recipes.tables.length, rows: totalRows }
  }
  mini = new MiniSearch<RowDoc>({
    fields: ['joined'],
    storeFields: ['page', 'header', 'cells', 'joined'],
    searchOptions: { fuzzy: 0.2, prefix: true, combineWith: 'AND' },
  })
  mini.addAll(docs)
}

onMounted(loadData)

const results = computed(() => {
  const q = query.value.trim()
  if (!q) return [] as RowDoc[]
  if (!mini) return [] as RowDoc[]
  return mini.search(q).slice(0, 200) as unknown as RowDoc[]
})

function makeSnippet(text: string, q: string): string {
  const t = text || ''
  const pos = t.toLowerCase().indexOf(q.toLowerCase())
  if (pos < 0) return t.slice(0, 160) + (t.length > 160 ? '…' : '')
  const start = Math.max(0, pos - 60)
  const end = Math.min(t.length, pos + q.length + 60)
  return (start > 0 ? '…' : '') + t.slice(start, end) + (end < t.length ? '…' : '')
}

function selectRow(r: any) { selected.value = r as RowDoc }

function escReg(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
function hilite(text: string, q: string): string {
  if (!q) return text
  const parts = q.split(/\s+/).filter(Boolean).map(escReg)
  if (!parts.length) return text
  const re = new RegExp(`(${parts.join('|')})`, 'ig')
  return text.replace(re, '<mark>$1</mark>')
}

function headerFor(r: RowDoc): string[] {
  if (r.header && r.header.some(h => h && h.trim().length)) return r.header
  return r.cells.map((_, i) => `Col ${i + 1}`)
}
</script>

<template>
  <div class="data-search">
    <div class="summary">
      <div>Source: <strong>{{ stats.source }}</strong></div>
      <div>Tables: {{ stats.tables }}</div>
      <div>Total rows: {{ stats.rows }}</div>
    </div>

    <div class="searchbar">
      <input v-model="query" type="text" placeholder="Search items, materials, DC, cost…" />
      <label class="toggle">
        <input type="checkbox" v-model="showFullRows" /> Show full row
      </label>
    </div>

    <div class="layout">
      <div class="left">
        <div class="results" v-if="results.length">
          <div class="result" v-for="r in results" :key="r.id" @click="selectRow(r)">
            <div class="title">P{{ (r as any).page }} · <span v-html="hilite(makeSnippet((r as any).joined, query), query)"></span></div>
            <div v-if="showFullRows" class="row-preview">
              <table class="row-table compact">
                <tbody>
                  <tr v-for="(c, i) in (r as any).cells" :key="i">
                    <th>{{ headerFor(r as any)[i] }}</th>
                    <td><span v-html="hilite(String(c || ''), query)"></span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="cells">
              <span v-for="(c, i) in (r as any).cells" :key="i" class="chip" v-html="hilite(String(c || ''), query)"></span>
            </div>
          </div>
        </div>
        <div v-else class="hint">Start typing to search parsed rows.</div>
      </div>

      <div class="right" v-if="selected">
        <h3>Row Details</h3>
        <div class="meta">Page {{ selected.page }}</div>
        <table v-if="selected.cells && selected.cells.length" class="row-table">
          <thead>
            <tr>
              <th v-for="(h, i) in (selected.header && selected.header.length ? selected.header : selected.cells.map((_,i)=>`Col ${i+1}`))" :key="i">{{ h || `Col ${i+1}` }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(c, i) in selected.cells" :key="i">{{ c }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-search { display: grid; gap: 1rem; }
.summary { display: flex; gap: 1rem; font-size: .9rem; color: #666; }
.searchbar input { width: 100%; padding: .6rem .7rem; font-size: 1rem; }
.layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: start; }
.results { display: flex; flex-direction: column; gap: .5rem; max-height: 70vh; overflow: auto; }
.result { border: 1px solid #ddd; padding: .5rem; cursor: pointer; }
.result:hover { background: rgba(0,0,0,.04); }
.title { font-weight: 600; margin-bottom: .25rem; }
.row-preview { margin-top: .25rem; }
.cells { display: flex; flex-wrap: wrap; gap: .25rem; }
.chip { border: 1px solid #ddd; padding: .1rem .3rem; border-radius: 4px; font-size: .8rem; }
.right { border: 1px solid #ddd; padding: .75rem; }
.row-text { margin: .5rem 0; color: #333; }
.row-table { width: 100%; border-collapse: collapse; }
.row-table.compact th, .row-table.compact td { padding: .2rem .35rem; font-size: .9rem; }
.row-table th, .row-table td { border: 1px solid #ddd; padding: .35rem .5rem; text-align: left; }
.toggle { margin-left: .5rem; font-size: .9rem; color: #666; display: inline-flex; align-items: center; gap: .35rem; }
mark { background: #ffe08a; color: inherit; padding: 0 .05em; }
@media (prefers-color-scheme: dark) {
  .summary { color: #aaa; }
  .result, .chip, .right, .row-table th, .row-table td { border-color: #333; }
  .result:hover { background: rgba(255,255,255,.05); }
  .row-text { color: #ddd; }
  mark { background: #665500; }
}
</style>
