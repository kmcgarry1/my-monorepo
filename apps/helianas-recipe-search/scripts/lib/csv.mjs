// Minimal CSV parse/unparse for Node scripts
export function parseCSV(text) {
  const rows = []
  let cur = []
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
  flush(); if (cur.length) pushRow()
  if (!rows.length) return []
  const header = rows[0]
  return rows.slice(1).map(r => Object.fromEntries(header.map((h, idx) => [h, r[idx] ?? ''])))
}

export function unparseCSV(rows) {
  if (!rows.length) return ''
  const header = Object.keys(rows[0])
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }
  const lines = [header.join(',')]
  for (const row of rows) lines.push(header.map(h => esc(row[h])).join(','))
  return lines.join('\n')
}

