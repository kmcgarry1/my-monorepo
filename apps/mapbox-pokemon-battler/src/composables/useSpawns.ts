import { ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import { fetchPokemon, type PokeBasic, typeWeightedRandom } from '../services/pokeapi'

export type Spawn = { id: number; coord: [number, number]; marker?: any; data?: PokeBasic }

export function useSpawns(getMap: () => any | null, opts?: { onSelect?: (s: Spawn) => void }) {
  const spawns = ref<Spawn[]>([])

  function getEnv(): 'water' | 'urban' | 'forest' | 'default' {
    try {
      const map = getMap()
      if (!map) return 'default'
      const layers = ['water', 'waterway', 'landuse', 'park']
      const features: any[] = map.queryRenderedFeatures({ layers }) as any
      if (features.some((f: any) => f.layer && f.layer.id.includes('water'))) return 'water'
      if (features.some((f: any) => f.layer && f.layer.id.includes('park'))) return 'forest'
      if (features.some((f: any) => f.layer && f.layer.id.includes('landuse'))) return 'urban'
    } catch {}
    return 'default'
  }

  async function addSpawnAt(coord: [number, number]) {
    const env = getEnv()
    const pokeId = typeWeightedRandom(env)
    const s: Spawn = { id: pokeId, coord }
    spawns.value.push(s)
    try {
      const data = await fetchPokemon(pokeId)
      s.data = data
      const el = document.createElement('div')
      el.style.width = '40px'
      el.style.height = '40px'
      el.style.borderRadius = '20px'
      el.style.background = '#ffffffcc'
      el.style.backdropFilter = 'blur(4px)'
      el.style.display = 'grid'
      el.style.placeItems = 'center'
      const img = document.createElement('img')
      img.src = data.sprites.front_default || ''
      img.alt = data.name
      img.style.maxWidth = '36px'
      img.style.maxHeight = '36px'
      el.appendChild(img)
      if (opts?.onSelect) {
        el.addEventListener('click', () => opts.onSelect!(s))
      }
      s.marker = new mapboxgl.Marker({ element: el }).setLngLat(coord).addTo(getMap()!)
    } catch {}
  }

  function randomCoordAround(center: any, radiusMeters = 200): [number, number] {
    const r = radiusMeters * Math.sqrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const dx = r * Math.cos(theta)
    const dy = r * Math.sin(theta)
    const degPerMeterLat = 1 / 111320
    const degPerMeterLng = 1 / (111320 * Math.cos((center.lat * Math.PI) / 180))
    const lng = center.lng + dx * degPerMeterLng
    const lat = center.lat + dy * degPerMeterLat
    return [lng, lat]
  }

  async function spawnBatch(center: any) {
    const count = 8
    for (let i = 0; i < count; i++) addSpawnAt(randomCoordAround(center, 200))
  }

  function clearSpawns() {
    spawns.value.forEach((s) => s.marker?.remove())
    spawns.value.splice(0)
  }

  function releaseSpawn(spawn: Spawn | null) {
    if (!spawn) return
    spawn.marker?.remove()
    const idx = spawns.value.indexOf(spawn)
    if (idx >= 0) spawns.value.splice(idx, 1)
  }

  return { spawns, addSpawnAt, spawnBatch, clearSpawns, releaseSpawn }
}
