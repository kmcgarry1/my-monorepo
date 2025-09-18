#!/usr/bin/env node
// Extract only "recipe-like" tables from a PDF.
// Heuristics:
//  - Group text into lines (by Y) and columns (by X bins)
//  - Detect header lines with multiple known header keywords (e.g., DC, Cost, Rarity, Ingredients)
//  - Collect subsequent lines with consistent column usage as table rows

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const HEADER_KEYWORDS = [
  'recipe', 'ingredients', 'ingredient', 'result', 'yield', 'dc', 'check', 'time', 'cost', 'price', 'value', 'rarity', 'rank', 'gp', 'sp', 'cp', 'salvage', 'components'
]

function parseArgs(argv) {
  const args = { pdf: '', out: 'data/recipes.json', pages: '', bin: 10 }
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

const nonWord = /[^a-z0-9]+/gi
const isNumericish = (s) => /\d/.test(s)

function isHeaderCells(cells) {
  const lower = cells.map(c => c.toLowerCase())
  const nonEmpty = lower.filter(c => c.length > 0)
  if (nonEmpty.length < 3) return false
  const hits = nonEmpty.reduce((acc, c) => acc + (HEADER_KEYWORDS.some(k => c.includes(k)) ? 1 : 0), 0)
  // Require at least 2 header keyword hits across the line
  return hits >= 2
}

function looksLikeTableRow(cells) {
  const nonEmpty = cells.filter(c => c.length > 0)
  if (nonEmpty.length < 2) return false
  // Some numeric values often present (DC, gp)
  const hasNumbers = nonEmpty.some(isNumericish)
  // Avoid paragraph-y long single cell rows
  const longSingles = nonEmpty.length === 1 && nonEmpty[0].length > 80
  return hasNumbers && !longSingles
}

async function main() {
  const args = parseArgs(process.argv)
  const pdfPath = args.pdf ? path.resolve(args.pdf) : findDefaultPdf()
  if (!pdfPath || !fs.existsSync(pdfPath)) {
    console.error('PDF not found. Use --pdf <path>.')
    process.exit(1)
  }
  const data = new Uint8Array(fs.readFileSync(pdfPath))
  const doc = await getDocument({ data }).promise

  let pageNums = Array.from({ length: doc.numPages }, (_, i) => i + 1)
  if (args.pages) {
    const ranges = args.pages.split(',')
    const list = new Set()
    for (const r of ranges) {
      const [a, b] = r.split('-').map(s => parseInt(s.trim(), 10))
      if (!isNaN(a) && !isNaN(b)) for (let p = a; p <= b; p++) list.add(p)
      else if (!isNaN(a)) list.add(a)
    }
    pageNums = Array.from(list).sort((x, y) => x - y)
  }

  const out = { source: path.basename(pdfPath), generatedAt: new Date().toISOString(), tables: [] }

  for (const p of pageNums) {
    const page = await doc.getPage(p)
    const content = await page.getTextContent()
    const items = []
    for (const i of content.items) {
      const it = i
      const str = typeof it.str === 'string' ? it.str : ''
      if (!str.trim()) continue
      const [a, b, c, d, e, f] = it.transform
      items.push({ str, x: e, y: f, width: it.width, height: it.height })
    }
    const lines = clusterY(items)
    const columns = buildColumnBins(lines, args.bin)
    if (!columns.length) continue

    // Precompute cells per line
    const lineCells = lines.map(l => assignToColumns(l, columns))
    let i = 0
    while (i < lines.length) {
      const cells = lineCells[i]
      if (isHeaderCells(cells)) {
        const header = cells.map(c => c.replace(nonWord, ' ').trim()).filter(Boolean)
        const rows = []
        let j = i + 1
        let blankRun = 0
        while (j < lines.length) {
          const c = lineCells[j]
          const nonEmpty = c.filter(x => x.length > 0).length
          const gap = Math.abs(lines[j - 1].y - lines[j].y)
          if (nonEmpty === 0) { blankRun++; if (blankRun >= 1) break; j++; continue }
          blankRun = 0
          if (!looksLikeTableRow(c)) break
          // If huge vertical gap, consider end of table
          if (gap > 20 && rows.length >= 1) break
          rows.push(c)
          j++
        }
        if (rows.length >= 2) {
          out.tables.push({ page: p, header, rows })
          i = j
          continue
        }
      }
      i++
    }
  }

  const outPath = path.resolve(path.join(__dirname, '..', args.out))
  ensureDir(outPath)
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
  console.log('Wrote', outPath, `(${out.tables.length} tables)`) 
}

main().catch(err => { console.error(err); process.exit(1) })

