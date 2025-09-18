#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { unparseCSV } from './lib/csv.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

async function main() {
  const appRoot = path.resolve(__dirname, '..')
  const jsonPath = process.argv[2] || path.join(appRoot, 'data', 'heliana-recipes.json')
  const outPath = process.argv[3] || path.join(appRoot, 'data', 'heliana-recipes.csv')
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const rows = []
  for (const r of json.recipes || []) {
    const base = {
      id: r.id,
      page: r.page ?? '',
      name: r.name ?? '',
      meta_type: r.metadata?.type ?? '',
      value_gp: r.metadata?.valueGp ?? '',
      rarity: r.metadata?.rarity ?? '',
      attunement: r.metadata?.attunement ?? '',
      attunement_note: r.metadata?.attunementNote ?? '',
      notes: r.notes ?? '',
      tags: (r.tags || []).join(';'),
    }
    if (!r.components?.length) {
      rows.push({ ...base, comp_type: '', metatag: '', component: '' })
    } else {
      for (const c of r.components) rows.push({ ...base, comp_type: c.type ?? '', metatag: c.metatag ?? '', component: c.component ?? '' })
    }
  }
  const csv = unparseCSV(rows)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, csv, 'utf8')
  console.log('Wrote', outPath)
}

main().catch(err => { console.error(err); process.exit(1) })
