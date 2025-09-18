#!/usr/bin/env node
// Extracts table-like rows from a PDF using pdf.js text items
// Heuristic: group items by Y, sort by X, and bin X positions into columns.

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const args = { pdf: '', out: 'data/tables.json', pages: '' }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--pdf') args.pdf = argv[++i]
    else if (a === '--out') args.out = argv[++i]
    else if (a === '--pages') args.pages = argv[++i]
  }
  return args
}

function findDefaultPdf() {
  // Look in app root for a single .pdf
  const appRoot = path.resolve(__dirname, '..')
  const files = fs.readdirSync(appRoot)
  const pdfs = files.filter(f => f.toLowerCase().endsWith('.pdf'))
  return pdfs[0] ? path.join(appRoot, pdfs[0]) : ''
}

function ensureDir(p) {
  const dir = path.dirname(p)
  fs.mkdirSync(dir, { recursive: true })
}

function round(n, p = 1) {
  return Math.round(n / p) * p
}

function clusterY(rows, tolerance = 2) {
  // rows: [{x,y,str,width,height,fontName}]
  const lines = []
  for (const it of rows) {
    const y = round(it.y, tolerance)
    let line = lines.find(l => Math.abs(l.y - y) <= tolerance)
    if (!line) {
      line = { y, items: [] }
      lines.push(line)
    }
    line.items.push(it)
  }
  // sort top to bottom (pdf y origin bottom-left; higher y is higher on page)
  lines.sort((a, b) => b.y - a.y)
  for (const l of lines) {
    l.items.sort((a, b) => a.x - b.x)
  }
  return lines
}

function buildColumnBins(lines, binWidth = 12) {
  // Aggregate x positions
  const xs = []
  for (const l of lines) for (const it of l.items) xs.push(it.x)
  xs.sort((a, b) => a - b)
  if (xs.length === 0) return []
  // Simple histogram binning
  const bins = []
  for (const x of xs) {
    const bin = bins.find(b => Math.abs(b.center - x) <= binWidth)
    if (bin) {
      bin.values.push(x)
      bin.center = bin.values.reduce((s, v) => s + v, 0) / bin.values.length
    } else bins.push({ center: x, values: [x] })
  }
  bins.sort((a, b) => a.center - b.center)
  // compress near-duplicates
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
  const cells = columns.map(() => [])
  for (const it of line.items) {
    let idx = 0
    let best = Infinity
    for (let i = 0; i < columns.length; i++) {
      const d = Math.abs(columns[i] - it.x)
      if (d < best) { best = d; idx = i }
    }
    cells[idx].push(it.str)
  }
  return cells.map(c => c.join(' ').replace(/\s+/g, ' ').trim())
}

function lineToText(line) {
  return line.items.map(it => it.str).join(' ').replace(/\s+/g, ' ').trim()
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

  const out = {
    source: path.basename(pdfPath),
    generatedAt: new Date().toISOString(),
    pages: [],
  }

  for (const p of pageNums) {
    const page = await doc.getPage(p)
    const viewport = page.getViewport({ scale: 1.0 })
    const content = await page.getTextContent()
    const items = []
    for (const i of content.items) {
      const it = i
      const str = typeof it.str === 'string' ? it.str : ''
      if (!str.trim()) continue
      // transform = [a,b,c,d,e,f]; e=tx(x), f=ty(y)
      const [a, b, c, d, e, f] = it.transform
      items.push({ str, x: e, y: f, width: it.width, height: it.height, dir: it.dir })
    }
    const lines = clusterY(items)
    const columns = buildColumnBins(lines)
    const rows = lines.map(l => ({
      y: l.y,
      text: lineToText(l),
      cells: columns.length ? assignToColumns(l, columns) : [],
    }))
    out.pages.push({ page: p, width: viewport.width, height: viewport.height, columns, rows })
  }

  const outPath = path.resolve(path.join(__dirname, '..', args.out))
  ensureDir(outPath)
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
  console.log('Wrote', outPath)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

