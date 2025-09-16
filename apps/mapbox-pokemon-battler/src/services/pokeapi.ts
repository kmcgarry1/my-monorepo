export type PokeBasic = {
  id: number
  name: string
  sprites: { front_default?: string }
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
}

const API = 'https://pokeapi.co/api/v2'

export async function fetchPokemon(idOrName: number | string): Promise<PokeBasic> {
  const res = await fetch(`${API}/pokemon/${idOrName}`)
  if (!res.ok) throw new Error('Failed to fetch pokemon')
  return res.json()
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

