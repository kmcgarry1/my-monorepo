#!/usr/bin/env node
// Specialized extractor for Heliana's magic item recipes (pages 42–52).
// Attempts to build normalized rows with columns:
// Name | Meta: Type | Meta: Value (gp) | Meta: Rarity | Meta: Att | Comp: Type | Comp: Metatag | Comp: Component

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const args = { pdf: '', out: 'data/heliana-recipes.json', pages: '42-52', bin: 10 }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--pdf') args.pdf = argv[++i]
    else if (a === '--out') args.out = argv[++i]
    else if (a === '--pages') args.pages = argv[++i]
    else if (a === '--bin') args.bin = Number(argv[++i] || 10)
  }
  return args
}

function findDefaultPdf() {
  const appRoot = path.resolve(__dirname, '..')
  const files = fs.readdirSync(appRoot)
  const pdfs = files.filter(f => f.toLowerCase().endsWith('.pdf'))
  return pdfs[0] ? path.join(appRoot, pdfs[0]) : ''
}

function ensureDir(p) { fs.mkdirSync(path.dirname(p), { recursive: true }) }
const round = (n, p = 1) => Math.round(n / p) * p

function clusterY(items, tolerance = 2) {
  const lines = []
  for (const it of items) {
    const y = round(it.y, tolerance)
    let line = lines.find(l => Math.abs(l.y - y) <= tolerance)
    if (!line) { line = { y, items: [] }; lines.push(line) }
    line.items.push(it)
  }
  // Sort top-to-bottom
  lines.sort((a, b) => b.y - a.y)
  for (const l of lines) l.items.sort((a, b) => a.x - b.x)
  return lines
}

function buildColumnBins(lines, binWidth = 10) {
  const xs = []
  for (const l of lines) for (const it of l.items) xs.push(it.x)
  xs.sort((a, b) => a - b)
  if (!xs.length) return []
  const bins = []
  for (const x of xs) {
    const bin = bins.find(b => Math.abs(b.center - x) <= binWidth)
    if (bin) { bin.values.push(x); bin.center = bin.values.reduce((s, v) => s + v, 0) / bin.values.length }
    else bins.push({ center: x, values: [x] })
  }
  bins.sort((a, b) => a.center - b.center)
  const compressed = []
  for (const b of bins) {
    const last = compressed[compressed.length - 1]
    if (last && Math.abs(last.center - b.center) <= binWidth) {
      last.values.push(...b.values)
      last.center = last.values.reduce((s, v) => s + v, 0) / last.values.length
    } else compressed.push(b)
  }
  return compressed.map(b => b.center)
}

function assignToColumns(line, columns) {
  if (!columns.length) return []
  const cells = columns.map(() => [])
  for (const it of line.items) {
    let idx = 0, best = Infinity
    for (let i = 0; i < columns.length; i++) {
      const d = Math.abs(columns[i] - it.x)
      if (d < best) { best = d; idx = i }
    }
    cells[idx].push(it.str)
  }
  return cells.map(c => c.join(' ').replace(/\s+/g, ' ').trim())
}

function scoreHeaderCells(cells) {
  const s = cells.map(c => c.toLowerCase())
  const has = (kw) => s.some(x => x.includes(kw))
  let score = 0
  if (has('name')) score += 2
  if (has('metadata')) score += 2
  if (has('component')) score += 2
  if (has('component details')) score += 2
  ;['type','value','gp','rarity','att','attun'].forEach(k => { if (has(k)) score += 1 })
  ;['metatag','meta tag','component'].forEach(k => { if (has(k)) score += 1 })
  return score
}

function normalizeHeaders(h1, h2) {
  const len = Math.max(h1.length, h2.length)
  const out = []
  for (let i = 0; i < len; i++) {
    const a = (h1[i] || '').trim()
    const b = (h2[i] || '').trim()
    out.push([a,b].filter(Boolean).join(' ').replace(/\s+/g,' ').trim())
  }
  return out
}

function mapColumns(headers) {
  // Try to map by header keywords; fallback to positional mapping
  const lower = headers.map(h => h.toLowerCase())
  const col = { name:-1, mType:-1, mValue:-1, mRarity:-1, mAtt:-1, cType:-1, cMeta:-1, cComp:-1 }
  const find = (kw) => lower.findIndex(h => h.includes(kw))
  col.name = find('name')
  // Prefer exact matches for metadata fields
  col.mType = find('type')
  col.mValue = find('value') !== -1 ? find('value') : (find('gp') !== -1 ? find('gp') : -1)
  col.mRarity = find('rarity')
  col.mAtt = (find('attun') !== -1 ? find('attun') : find('att'))
  // Component details
  const compIndices = lower.map((h,i)=>({h,i})).filter(x=> x.h.includes('component') || x.h.includes('meta tag') || x.h.includes('metatag') || (x.h.includes('type') && x.h.includes('component'))).map(x=>x.i)
  if (compIndices.length) {
    // Use vicinity of any 'component' header as anchor
    const base = compIndices.sort((a,b)=>a-b)[0]
    // Assign last three columns around/after base
    const idxs = [base, base+1, base+2].map(i => i < headers.length ? i : -1)
    col.cType = lower[idxs[0]]?.includes('type') ? idxs[0] : (find('component type') !== -1 ? find('component type') : idxs[0])
    col.cMeta = (find('metatag') !== -1 ? find('metatag') : (find('meta tag') !== -1 ? find('meta tag') : idxs[1]))
    col.cComp = (find('component') !== -1 ? find('component') : idxs[2])
  }
  // Fallback positional mapping if not resolved
  const fallback = (v, def) => (v !== -1 ? v : def)
  col.name = fallback(col.name, 0)
  col.mType = fallback(col.mType, 1)
  col.mValue = fallback(col.mValue, 2)
  col.mRarity = fallback(col.mRarity, 3)
  col.mAtt = fallback(col.mAtt, 4)
  col.cType = fallback(col.cType, 5)
  col.cMeta = fallback(col.cMeta, 6)
  col.cComp = fallback(col.cComp, 7)
  return col
}

async function main() {
  const args = parseArgs(process.argv)
  const pdfPath = args.pdf ? path.resolve(args.pdf) : findDefaultPdf()
  if (!pdfPath || !fs.existsSync(pdfPath)) {
    console.error('PDF not found. Use --pdf <path>.')
    process.exit(1)
  }
  const rangeList = (() => {
    const ranges = args.pages.split(',')
    const set = new Set()
    for (const r of ranges) {
      const [a, b] = r.split('-').map(s => parseInt(s.trim(), 10))
      if (!isNaN(a) && !isNaN(b)) for (let p = a; p <= b; p++) set.add(p)
      else if (!isNaN(a)) set.add(a)
    }
    return Array.from(set).sort((x,y)=>x-y)
  })()

  const data = new Uint8Array(fs.readFileSync(pdfPath))
  const doc = await getDocument({ data }).promise
  const maxPage = doc.numPages
  const pageNums = rangeList.filter(p => p >= 1 && p <= maxPage)

  const out = {
    source: path.basename(pdfPath),
    generatedAt: new Date().toISOString(),
    pages: pageNums,
    recipes: [],
  }

  for (const p of pageNums) {
    const page = await doc.getPage(p)
    const content = await page.getTextContent()
    const items = []
    for (const i of content.items) {
      const it = i
      const str = typeof it.str === 'string' ? it.str : ''
      if (!str.trim()) continue
      const [a,b,c,d,e,f] = it.transform
      items.push({ str, x: e, y: f, width: it.width, height: it.height })
    }
    const lines = clusterY(items)
    const columns = buildColumnBins(lines, args.bin)
    if (!columns.length) continue
    const lineCells = lines.map(l => assignToColumns(l, columns))

    // Look for a two-line header with relevant keywords
    for (let i = 0; i < lineCells.length - 1; i++) {
      const h1 = lineCells[i]
      const h2 = lineCells[i+1]
      const score = scoreHeaderCells(h1) + scoreHeaderCells(h2)
      if (score < 5) continue
      const headers = normalizeHeaders(h1, h2)
      const map = mapColumns(headers)
      // Collect rows until a blank-ish or layout break
      const rows = []
      let j = i + 2
      let blankRun = 0
      while (j < lineCells.length) {
        const c = lineCells[j]
        const nonEmpty = c.filter(x => x && x.trim().length > 0).length
        const gap = Math.abs(lines[j - 1].y - lines[j].y)
        if (nonEmpty === 0) { blankRun++; if (blankRun >= 1) break; j++; continue }
        blankRun = 0
        // Extract fields by mapped column indexes; guard for bounds
        const cell = (idx) => (idx >= 0 && idx < c.length) ? (c[idx] || '').trim() : ''
        const rec = {
          page: p,
          name: cell(map.name),
          metadata: {
            type: cell(map.mType),
            valueGp: cell(map.mValue),
            rarity: cell(map.mRarity),
            att: cell(map.mAtt),
          },
          components: {
            type: cell(map.cType),
            metatag: cell(map.cMeta),
            component: cell(map.cComp),
          },
          _raw: c,
        }
        const any = rec.name || rec.metadata.type || rec.metadata.valueGp || rec.metadata.rarity || rec.metadata.att || rec.components.type || rec.components.metatag || rec.components.component
        if (!any) break
        // Basic validity: prefer rows that have a name or a component or numbers in value/dc
        const looksValid = rec.name.length > 0 || /\d/.test(rec.metadata.valueGp)
        if (!looksValid) { j++; continue }
        rows.push(rec)
        // Heuristic stop if large vertical gap after accumulating some rows
        if (gap > 22 && rows.length >= 2) break
        j++
      }
      if (rows.length) {
        out.recipes.push(...rows)
        i = j // skip past this table area
      }
    }
  }

  const outPath = path.resolve(path.join(__dirname, '..', args.out))
  ensureDir(outPath)
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
  console.log('Wrote', outPath, `(${out.recipes.length} rows)`) 
}

main().catch(err => { console.error(err); process.exit(1) })

