export type PokeBasic = {
  id: number
  name: string
  sprites: { front_default?: string }
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
}

const API = 'https://pokeapi.co/api/v2'
const memCache = new Map<string, any>()
const pending = new Map<string, Promise<PokeBasic>>()
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

export async function fetchPokemon(idOrName: number | string): Promise<PokeBasic> {
  const cached = readCache(idOrName)
  if (cached) return cached as PokeBasic
  const key = getCacheKey(idOrName)
  if (pending.has(key)) return pending.get(key)!
  const req = (async () => {
    const res = await fetch(`${API}/pokemon/${idOrName}`, { cache: 'force-cache' as RequestCache })
    if (!res.ok) throw new Error('Failed to fetch pokemon')
    const data = (await res.json()) as PokeBasic
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
