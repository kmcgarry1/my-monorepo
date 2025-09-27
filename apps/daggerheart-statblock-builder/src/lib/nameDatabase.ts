const csvModules = import.meta.glob('../data/database/*.csv', {
  eager: true,
  import: 'default',
  query: '?raw'
}) as Record<string, string>

type NameType = 'enemy' | 'environment' | 'faction' | 'location' | 'relic' | 'npc'

export type NameRecord = {
  id: string
  name: string
  type: NameType
  category: string
  tags: string[]
  description: string
  source: string
}

type InternalRecord = NameRecord & { searchText: string }

export const NAME_TYPE_LABELS: Record<NameType, string> = {
  enemy: 'Enemy',
  environment: 'Environment',
  faction: 'Faction',
  location: 'Location',
  relic: 'Relic',
  npc: 'NPC'
}

const CSV_HEADER = ['id', 'name', 'type', 'category', 'tags', 'description', 'source'] as const

type CsvHeader = (typeof CSV_HEADER)[number]

type RawRow = Record<CsvHeader, string>

function parseCSV(raw: string): RawRow[] {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  if (!lines.length) return []

  const header = parseLine(lines[0]).map((h) => h.trim().toLowerCase())
  const dataLines = lines.slice(1)

  return dataLines
    .filter((line) => !line.startsWith('#'))
    .map((line) => parseLine(line))
    .map((values) => {
      const row: Partial<RawRow> = {}
      header.forEach((key, index) => {
        const normalizedKey = key as CsvHeader
        if (!CSV_HEADER.includes(normalizedKey)) return
        row[normalizedKey] = values[index]?.trim() ?? ''
      })
      return row as RawRow
    })
}

function parseLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
      continue
    }

    current += char
  }

  result.push(current)
  return result.map((value) => value.trim())
}

function sanitizeType(value: string): NameType | null {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return null
  if (['enemy', 'environment', 'faction', 'location', 'relic', 'npc'].includes(normalized)) {
    return normalized as NameType
  }
  return null
}

function fallbackId() {
  return `name-${Math.random().toString(36).slice(2, 10)}`
}

function createRecords(): InternalRecord[] {
  const records: InternalRecord[] = []

  Object.values(csvModules).forEach((raw) => {
    const rows = parseCSV(raw)
    rows.forEach((row) => {
      const type = sanitizeType(row.type)
      if (!type) return

      const tags = row.tags
        ? row.tags
            .split(/[;,]/)
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []

      const record: InternalRecord = {
        id: row.id || fallbackId(),
        name: row.name || 'Unnamed',
        type,
        category: row.category || '',
        tags,
        description: row.description || '',
        source: row.source || '',
        searchText: [row.name, row.category, row.description, tags.join(' '), row.source]
          .map((value) => value.toLowerCase())
          .join(' ')
      }

      records.push(record)
    })
  })

  records.sort((a, b) => a.name.localeCompare(b.name))
  return records
}

const internalRecords = createRecords()

export const NAME_RECORDS: NameRecord[] = internalRecords.map(({ searchText, ...record }) => record)

export const NAME_TYPE_COUNTS: Record<NameType, number> = internalRecords.reduce(
  (acc, record) => {
    acc[record.type] = (acc[record.type] ?? 0) + 1
    return acc
  },
  { enemy: 0, environment: 0, faction: 0, location: 0, relic: 0, npc: 0 }
)

export type NameFilter = NameType | 'all'

export function searchNames(query: string, filter: NameFilter = 'all', limit = 60): NameRecord[] {
  const normalizedQuery = query.trim().toLowerCase()

  const filtered = internalRecords.filter((record) => {
    if (filter !== 'all' && record.type !== filter) return false
    if (!normalizedQuery) return true
    return record.searchText.includes(normalizedQuery)
  })

  return filtered.slice(0, limit).map(({ searchText, ...record }) => record)
}

export function randomName(filter: NameFilter = 'all'): NameRecord | null {
  const pool = internalRecords.filter((record) => filter === 'all' || record.type === filter)
  if (!pool.length) return null
  const pick = pool[Math.floor(Math.random() * pool.length)]
  const { searchText, ...record } = pick
  return record
}

export function describeType(type: NameType): string {
  return NAME_TYPE_LABELS[type] ?? type
}
