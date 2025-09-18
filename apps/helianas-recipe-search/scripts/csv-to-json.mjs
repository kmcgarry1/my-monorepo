#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { parseCSV } from './lib/csv.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

async function main() {
  const appRoot = path.resolve(__dirname, '..')
  const csvPath = process.argv[2] || path.join(appRoot, 'data', 'heliana-recipes.csv')
  const outPath = process.argv[3] || path.join(appRoot, 'data', 'heliana-recipes.json')
  const text = fs.readFileSync(csvPath, 'utf8')
  const rows = parseCSV(text)
  const map = new Map()
  for (const row of rows) {
    if (!row || !row.id) continue
    const id = String(row.id).trim()
    const existing = map.get(id)
    const comp = (row.comp_type || row.metatag || row.component) ? {
      type: String(row.comp_type ?? ''),
      metatag: String(row.metatag ?? ''),
      component: String(row.component ?? ''),
    } : null
    if (existing) { if (comp) existing.components.push(comp); continue }
    const valueGpNum = row.value_gp === '' || row.value_gp == null ? null : Number(String(row.value_gp).replace(/[^0-9.]/g, ''))
    const attStr = (row.attunement ?? '').toString().toLowerCase().trim()
    const attVal = attStr === '' ? null : (attStr === 'true' || attStr === 'yes' || attStr === 'y')
    map.set(id, {
      id,
      page: row.page == null || row.page === '' ? null : Number(row.page),
      name: String(row.name ?? ''),
      metadata: {
        type: String(row.meta_type ?? ''),
        valueGp: Number.isFinite(valueGpNum) ? valueGpNum : null,
        rarity: String(row.rarity ?? ''),
        attunement: attVal,
        attunementNote: String(row.attunement_note ?? ''),
      },
      components: comp ? [comp] : [],
      notes: String(row.notes ?? ''),
      tags: String(row.tags ?? '').split(';').map(s => s.trim()).filter(Boolean),
    })
  }
  const json = { version: 1, recipes: Array.from(map.values()) }
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2), 'utf8')
  console.log('Wrote', outPath)
}

main().catch(err => { console.error(err); process.exit(1) })
