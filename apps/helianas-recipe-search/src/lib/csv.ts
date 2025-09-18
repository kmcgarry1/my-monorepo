import type { Recipe, RecipeData, Component } from '../types/recipe'

// Minimal CSV utilities (RFC4180-ish)
function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let cur: string[] = []
  let field = ''
  let i = 0
  let inQuotes = false
  const flush = () => { cur.push(field); field = '' }
  const pushRow = () => { rows.push(cur); cur = [] }
  while (i < text.length) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false }
      } else { field += ch }
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === ',') flush()
      else if (ch === '\n') { flush(); pushRow() }
      else if (ch === '\r') { /* ignore */ }
      else field += ch
    }
    i++
  }
  // flush last
  flush()
  if (cur.length) pushRow()
  if (!rows.length) return []
  const header = rows[0]
  return rows.slice(1).map(r => Object.fromEntries(header.map((h, idx) => [h, r[idx] ?? ''])))
}

function unparseCSV(rows: Record<string, any>[]): string {
  if (!rows.length) return ''
  const header = Object.keys(rows[0])
  const esc = (v: any) => {
    const s = v == null ? '' : String(v)
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }
  const lines = [header.join(',')]
  for (const row of rows) lines.push(header.map(h => esc(row[h])).join(','))
  return lines.join('\n')
}

export type FlatRow = {
  id: string
  page?: string | number | null
  name: string
  meta_type?: string
  value_gp?: string | number | null
  rarity?: string
  attunement?: string | boolean | null
  attunement_note?: string
  comp_type?: string
  metatag?: string
  component?: string
  notes?: string
  tags?: string
}

export function toCsvRows(data: RecipeData): FlatRow[] {
  const rows: FlatRow[] = []
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
      tags: r.tags?.join(';') ?? '',
    }
    if (!r.components?.length) {
      rows.push({ ...base, comp_type: '', metatag: '', component: '' })
      continue
    }
    for (const c of r.components) {
      rows.push({
        ...base,
        comp_type: c.type ?? '',
        metatag: c.metatag ?? '',
        component: c.component ?? '',
      })
    }
  }
  return rows
}

export function fromCsvRows(rows: FlatRow[]): RecipeData {
  const map = new Map<string, Recipe>()
  for (const row of rows) {
    if (!row || !row.id) continue
    const id = String(row.id).trim()
    const existing = map.get(id)
    const comp: Component | null = (row.comp_type || row.metatag || row.component)
      ? {
          type: String(row.comp_type ?? ''),
          metatag: String(row.metatag ?? ''),
          component: String(row.component ?? ''),
        }
      : null
    if (existing) {
      if (comp) existing.components.push(comp)
      continue
    }
    const valueGpNum = row.value_gp === '' || row.value_gp == null ? null : Number(String(row.value_gp).replace(/[^0-9.]/g, ''))
    const attStr = (row.attunement ?? '').toString().toLowerCase().trim()
    const attVal = attStr === '' ? null : attStr === 'true' || attStr === 'yes' || attStr === 'y'
    const recipe: Recipe = {
      id,
      page: row.page == null || row.page === '' ? null : Number(row.page),
      name: String(row.name ?? ''),
      metadata: {
        type: String(row.meta_type ?? ''),
        valueGp: Number.isFinite(valueGpNum) ? (valueGpNum as number) : null,
        rarity: (String(row.rarity ?? '') as any) || '',
        attunement: attVal,
        attunementNote: String(row.attunement_note ?? ''),
      },
      components: comp ? [comp] : [],
      notes: String(row.notes ?? ''),
      tags: String(row.tags ?? '').split(';').map(s => s.trim()).filter(Boolean),
    }
    map.set(id, recipe)
  }
  return { version: 1, recipes: Array.from(map.values()) }
}

export function csvStringify(rows: FlatRow[]): string { return unparseCSV(rows) }
export function csvParse(text: string): FlatRow[] { return parseCSV(text) as FlatRow[] }
