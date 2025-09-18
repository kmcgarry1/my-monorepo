import { loadAdversariesFromCsv, loadEnvironmentsFromCsv } from './dataSources'
import type { Enemy } from '../types'
import { average, median, mode } from './stats'

export type TierRecommendations = {
  tier: number
  difficulty: { avg: number | null; median: number | null; mode: number | null }
  atkBonus: { avg: number | null; median: number | null; mode: number | null }
  damage: { top: { expression: string; count: number }[]; mode: string | null }
}

let cache: Record<number, TierRecommendations> | null = null

function normalizeDice(expr: string): string | null {
  if (!expr) return null
  const m = expr.match(/(\d+d\d+(?:[+\-]\d+)?)/i)
  return m ? m[1].toLowerCase() : null
}

export function getRecommendations(): Record<number, TierRecommendations> {
  if (cache) return cache
  const enemies = loadAdversariesFromCsv()
  const envs = loadEnvironmentsFromCsv()

  const tiers = new Set<number>()
  for (const e of enemies) if (e.tier != null) tiers.add(e.tier)
  for (const ev of envs) if (ev.tier != null) tiers.add(ev.tier)

  const recs: Record<number, TierRecommendations> = {}
  for (const tier of Array.from(tiers).sort((a, b) => a - b)) {
    const es = enemies.filter(e => e.tier === tier)
    const vs = envs.filter(v => v.tier === tier)

    const diffs: number[] = []
    diffs.push(...es.map(e => e.difficulty).filter((n): n is number => n != null))
    diffs.push(...vs.map(v => v.difficulty).filter((n): n is number => n != null))

    const atks: number[] = es.map(e => e.atkBonus).filter((n): n is number => n != null) as number[]

    const diceExprs: string[] = []
    for (const e of es) {
      for (const a of e.attacks) {
        const d = normalizeDice(a.details)
        if (d) diceExprs.push(d)
      }
    }

    const diceCounts = new Map<string, number>()
    for (const d of diceExprs) diceCounts.set(d, (diceCounts.get(d) || 0) + 1)
    const top = Array.from(diceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([expression, count]) => ({ expression, count }))

    const diceMode = top.length ? top[0].expression : null

    recs[tier] = {
      tier,
      difficulty: {
        avg: average(diffs),
        median: median(diffs),
        mode: mode(diffs)?.value ?? null,
      },
      atkBonus: {
        avg: average(atks),
        median: median(atks),
        mode: mode(atks)?.value ?? null,
      },
      damage: { top, mode: diceMode },
    }
  }

  cache = recs
  return recs
}

export function recommendForTier(tier: number): TierRecommendations | null {
  const recs = getRecommendations()
  return recs[tier] ?? null
}

