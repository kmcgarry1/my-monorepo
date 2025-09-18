// Minimal CSV parser supporting quotes and newlines (RFC4180-ish)
export function parseCSV(text: string): Record<string, string>[] {
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
  flush()
  if (cur.length) pushRow()
  if (!rows.length) return []
  const header = rows[0]
  return rows.slice(1).map(r => Object.fromEntries(header.map((h, idx) => [h.trim(), (r[idx] ?? '').trim()])))
}

