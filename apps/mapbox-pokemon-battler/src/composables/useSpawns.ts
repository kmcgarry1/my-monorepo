import { ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import { fetchPokemon, type PokeBasic, typeWeightedRandom } from '../services/pokeapi'

export type Spawn = { id: number; coord: [number, number]; marker?: mapboxgl.Marker | null; data?: PokeBasic }

export function useSpawns(getMap: () => mapboxgl.Map | null, opts?: { onSelect?: (s: Spawn) => void }) {
  const spawns = ref<Spawn[]>([])
  // Memoize environment lookups by quantized coordinate for a brief period
  const envCache = new Map<string, { env: 'water' | 'urban' | 'forest' | 'default'; ts: number }>()
  const ENV_TTL = 60_000 // 60s

  function getEnv(coord?: [number, number]): 'water' | 'urban' | 'forest' | 'default' {
    try {
      const map = getMap()
      if (!map) return 'default'
      // Grid-quantize coordinate to ~100m to reuse env results nearby
      const centerLngLat = coord ? new mapboxgl.LngLat(coord[0], coord[1]) : map.getCenter()
      const q = (v: number) => Math.round(v * 1000) / 1000 // ~111m lat @ equator
      const key = `${q(centerLngLat.lng)},${q(centerLngLat.lat)}`
      const cached = envCache.get(key)
      if (cached && Date.now() - cached.ts < ENV_TTL) return cached.env
      // Only query layers that actually exist in the active style.
      const preferred = ['water', 'waterway', 'landuse', 'park']
      const existing = preferred.filter((id) => {
        try { return !!map.getLayer(id) } catch { return false }
      })
      // Query a very small bbox around the intended coordinate (or map center) to avoid scanning full viewport
      const pt = map.project(centerLngLat)
      const pad = 12
      const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
        { x: pt.x - pad, y: pt.y - pad },
        { x: pt.x + pad, y: pt.y + pad },
      ]
      const features: mapboxgl.MapboxGeoJSONFeature[] = existing.length
        ? map.queryRenderedFeatures(bbox, { layers: existing })
        : map.queryRenderedFeatures(bbox)
      let env: 'water' | 'urban' | 'forest' | 'default' = 'default'
      if (features.some((f) => f.layer && typeof f.layer.id === 'string' && f.layer.id.includes('water'))) env = 'water'
      else if (features.some((f) => f.layer && typeof f.layer.id === 'string' && f.layer.id.includes('park'))) env = 'forest'
      else if (features.some((f) => f.layer && typeof f.layer.id === 'string' && f.layer.id.includes('landuse'))) env = 'urban'
      envCache.set(key, { env, ts: Date.now() })
      return env
    } catch {}
    return 'default'
  }

  async function addSpawnAt(coord: [number, number], envHint?: 'water' | 'urban' | 'forest' | 'default') {
    const env = envHint ?? getEnv(coord)
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
      el.style.background = '#fff'
      el.style.border = '1px solid rgba(0,0,0,0.15)'
      el.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)'
      el.style.display = 'grid'
      el.style.placeItems = 'center'
      const img = document.createElement('img')
      img.src = data.sprites.front_default || ''
      img.alt = data.name
      img.loading = 'lazy'
      img.decoding = 'async'
      img.style.maxWidth = '36px'
      img.style.maxHeight = '36px'
      el.appendChild(img)
      if (opts?.onSelect) {
        el.addEventListener('click', () => opts.onSelect?.(s))
      }
      const mapInstance = getMap()
      if (!mapInstance) return
      s.marker = new mapboxgl.Marker({ element: el }).setLngLat(coord).addTo(mapInstance)
    } catch {}
  }

  function randomCoordAround(center: mapboxgl.LngLat, radiusMeters = 200): [number, number] {
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

  async function spawnBatch(center: mapboxgl.LngLat) {
    const count = 8
    const env = getEnv([center.lng, center.lat])
    for (let i = 0; i < count; i++) addSpawnAt(randomCoordAround(center, 200), env)
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
