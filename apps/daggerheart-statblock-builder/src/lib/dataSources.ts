import type { Enemy, Environment, Feature, Attack } from '../types'
import { parseCSV } from './csv'

// Import CSVs as raw strings (bundled at build time)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import adversariesCsv from '../components/databases/Daggerheart Database - Adversaries.csv?raw'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import environmentsCsv from '../components/databases/Daggerheart Database - Environments.csv?raw'

function toNumber(v: string | undefined | null): number | null {
  if (!v) return null
  const n = Number(String(v).replace(/[^0-9.+-]/g, ''))
  return Number.isFinite(n) ? n : null
}

function parseTier(raw: string | undefined): number | null {
  if (!raw) return null
  const m = String(raw).match(/(\d+)/)
  return m ? Number(m[1]) : null
}

function parseAtkBonus(raw: string | undefined): number | null {
  if (!raw) return null
  const m = String(raw).match(/([+-]?\d+)/)
  return m ? Number(m[1]) : null
}

function parseFeaturesBlock(raw: string | undefined): Feature[] {
  const text = (raw ?? '').trim()
  if (!text) return []
  // Heuristic: split on blank lines; first line before ' - ' is name, before ':' is tag/cost
  const blocks = text.replace(/\r/g, '').split(/\n\s*\n/)
  return blocks.map((b, idx) => {
    const line = b.split('\n')[0] || ''
    const m = line.match(/^([^\-:]+)\s*-\s*([^:]+)\s*:\s*(.*)$/)
    if (m) {
      const [, name, tag, rest] = m
      const body = b.substring(b.indexOf(':') + 1).trim()
      return { id: idx + 1, name: name.trim(), tag: (tag.trim() as any), cost: '', text: body }
    }
    return { id: idx + 1, name: line.trim() || `Feature ${idx + 1}`, tag: 'Passive', cost: '', text: b.trim() }
  })
}

export function loadAdversariesFromCsv(): Enemy[] {
  const rows = parseCSV(adversariesCsv)
  const out: Enemy[] = []
  for (const r of rows) {
    const attacks: Attack[] = []
    const atkBonus = parseAtkBonus(r['Attack'])
    const weapon = (r['Weapon'] || '').trim()
    const range = (r['Range'] || '').trim()
    const damage = (r['Damage'] || '').trim()
    if (weapon || range || damage) attacks.push({ id: 1, name: weapon || 'Attack', range: range || '', details: damage || '' })
    out.push({
      kind: 'enemy',
      name: r['Adversary'] || '',
      tier: parseTier(r['Tier']),
      description: r['Description'] || '',
      traits: '',
      archetype: (r['Type'] || '').trim(),
      rank: '',
      difficulty: toNumber(r['Difficulty']),
      thresholds: r['Thresholds'] || '',
      hp: toNumber(r['HP']),
      stress: toNumber(r['Stress']),
      atkBonus,
      attacks,
      experience: r['Experience'] || '',
      tactics: r['Motives & Tactics'] || '',
      features: parseFeaturesBlock(r['Features']),
    })
  }
  return out
}

export function loadEnvironmentsFromCsv(): Environment[] {
  const rows = parseCSV(environmentsCsv)
  const out: Environment[] = []
  for (const r of rows) {
    out.push({
      kind: 'environment',
      name: r['Environment'] || '',
      tier: parseTier(r['Tier']),
      description: r['Description'] || '',
      traits: '',
      archetype: '',
      category: (r['Type'] || '').trim() as any,
      difficulty: toNumber(r['Difficulty']),
      impulses: r['Impulses'] || '',
      potential: r['Potential Adversaries'] || '',
      prompts: '',
      features: parseFeaturesBlock(r['Features']),
    })
  }
  return out
}

