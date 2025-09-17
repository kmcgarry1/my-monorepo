import type { PokemonSprites } from '../store'

export type PokeBasic = {
  id: number
  name: string
  sprites: PokemonSprites
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  species: { name: string; url: string }
  minLevel?: number | null
}

const API = 'https://pokeapi.co/api/v2'
const memCache = new Map<string, any>()
const pending = new Map<string, Promise<PokeBasic>>()
const minLevelCache = new Map<string, number | null>()
const minLevelPending = new Map<string, Promise<number | null>>()
const evolutionChainCache = new Map<string, EvolutionChainResponse>()
const evolutionChainPending = new Map<string, Promise<EvolutionChainResponse>>()
const LS_NS = 'mpb_poke_v1_'
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function getCacheKey(idOrName: number | string) { return `${LS_NS}${String(idOrName).toLowerCase()}` }
function readCache(idOrName: number | string) {
  const k = getCacheKey(idOrName)
  if (memCache.has(k)) return memCache.get(k)
  try {
    const raw = localStorage.getItem(k)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Back-compat: accept either raw data or { ts, data }
      const entry = parsed && typeof parsed === 'object' && 'data' in parsed ? parsed : { ts: Date.now(), data: parsed }
      if (Date.now() - (entry.ts || 0) < TTL_MS) {
        memCache.set(k, entry.data)
        return entry.data
      }
    }
  } catch {}
  return null
}
function writeCache(idOrName: number | string, value: any) {
  const k = getCacheKey(idOrName)
  memCache.set(k, value)
  try { localStorage.setItem(k, JSON.stringify({ ts: Date.now(), data: value })) } catch {}
}

type EvolutionDetail = { min_level: number | null | undefined }
type EvolutionChainLink = {
  species: { name: string }
  evolves_to: EvolutionChainLink[]
  evolution_details: EvolutionDetail[]
}
type EvolutionChainResponse = { chain: EvolutionChainLink }

async function fetchEvolutionChain(url: string): Promise<EvolutionChainResponse> {
  if (evolutionChainCache.has(url)) return evolutionChainCache.get(url)!
  if (evolutionChainPending.has(url)) return evolutionChainPending.get(url)!
  const req = (async () => {
    const res = await fetch(url, { cache: 'force-cache' as RequestCache })
    if (!res.ok) throw new Error('Failed to fetch evolution chain')
    const data = (await res.json()) as EvolutionChainResponse
    evolutionChainCache.set(url, data)
    return data
  })()
  evolutionChainPending.set(url, req)
  try {
    return await req
  } finally {
    evolutionChainPending.delete(url)
  }
}

function extractMinLevelForSpecies(
  node: EvolutionChainLink,
  target: string,
  incoming?: EvolutionDetail[]
): number | null | undefined {
  if (node.species?.name === target) {
    const details = incoming ?? []
    const levels = details
      .map((d) => (typeof d?.min_level === 'number' ? d.min_level : null))
      .filter((lvl): lvl is number => typeof lvl === 'number' && Number.isFinite(lvl))
    if (!levels.length) return null
    return Math.max(...levels)
  }
  for (const child of node.evolves_to ?? []) {
    const result = extractMinLevelForSpecies(child, target, child.evolution_details)
    if (result !== undefined) return result
  }
  return undefined
}

async function fetchSpeciesMinLevel(speciesName: string): Promise<number | null> {
  if (!speciesName) return null
  if (minLevelCache.has(speciesName)) return minLevelCache.get(speciesName) ?? null
  if (minLevelPending.has(speciesName)) return minLevelPending.get(speciesName)!
  const req = (async () => {
    try {
      const speciesRes = await fetch(`${API}/pokemon-species/${speciesName}`, {
        cache: 'force-cache' as RequestCache,
      })
      if (!speciesRes.ok) throw new Error('Failed to fetch species')
      const speciesData = (await speciesRes.json()) as {
        evolution_chain?: { url?: string | null } | null
      }
      const chainUrl = speciesData.evolution_chain?.url
      if (!chainUrl) return null
      const chain = await fetchEvolutionChain(chainUrl)
      const minLevel = extractMinLevelForSpecies(chain.chain, speciesName)
      return typeof minLevel === 'number' ? minLevel : null
    } catch {
      return null
    }
  })()
  minLevelPending.set(speciesName, req)
  try {
    const level = await req
    minLevelCache.set(speciesName, level)
    return level
  } finally {
    minLevelPending.delete(speciesName)
  }
}

export async function fetchPokemon(idOrName: number | string): Promise<PokeBasic> {
  const cached = readCache(idOrName)
  if (cached) {
    const result = cached as PokeBasic
    if ((result.minLevel === undefined || result.minLevel === null) && result.species?.name) {
      try {
        result.minLevel = await fetchSpeciesMinLevel(result.species.name)
        writeCache(idOrName, result)
      } catch {}
    }
    return result
  }
  const key = getCacheKey(idOrName)
  if (pending.has(key)) return pending.get(key)!
  const req = (async () => {
    const res = await fetch(`${API}/pokemon/${idOrName}`, { cache: 'force-cache' as RequestCache })
    if (!res.ok) throw new Error('Failed to fetch pokemon')
    const data = (await res.json()) as PokeBasic
    try {
      data.minLevel = await fetchSpeciesMinLevel(data.species?.name ?? '')
    } catch {
      data.minLevel = data.minLevel ?? null
    }
    writeCache(idOrName, data)
    return data
  })()
  pending.set(key, req)
  try { return await req } finally { pending.delete(key) }
}

export function randomPokemonId(): number {
  // Kanto 1..151; can expand later
  return 1 + Math.floor(Math.random() * 151)
}

export function typeWeightedRandom(environment: 'water' | 'urban' | 'forest' | 'default'): number {
  // Simple weighting via predefined ID buckets (roughly matching common types)
  const waterIds = [7, 8, 9, 54, 55, 60, 61, 62, 72, 73, 79, 80, 86, 87, 90, 91, 98, 99, 116, 117, 118, 119, 120, 121, 129, 130]
  const urbanIds = [19, 20, 39, 40, 52, 53, 81, 82, 100, 101, 109, 110]
  const forestIds = [10, 11, 12, 13, 14, 15, 23, 24, 43, 44, 45, 46, 47]
  const pick = (arr: number[], fallback: number[]) => (Math.random() < 0.7 ? arr[Math.floor(Math.random() * arr.length)] : fallback[Math.floor(Math.random() * fallback.length)])
  const fallback = Array.from({ length: 151 }, (_, i) => i + 1)
  if (environment === 'water') return pick(waterIds, fallback)
  if (environment === 'urban') return pick(urbanIds, fallback)
  if (environment === 'forest') return pick(forestIds, fallback)
  return randomPokemonId()
}
