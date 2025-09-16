<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import { fetchPokemon, type PokeBasic, typeWeightedRandom } from '../services/pokeapi'
import { useStore } from '../store'
import BattleOverlay from '../components/battle/BattleOverlay.vue'
import TeamOverlay from '../components/team/TeamOverlay.vue'
import HudOverlay from '../components/hud/HudOverlay.vue'

const store = useStore()
const teamOpen = ref(false)

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<mapboxgl.Map | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)
const playerPos = ref<mapboxgl.LngLat | null>(null)
const locationInterval = ref<number | null>(null)
const themeInterval = ref<number | null>(null)

type Spawn = { id: number; coord: [number, number]; marker?: mapboxgl.Marker; data?: PokeBasic }
const spawns = reactive<Spawn[]>([])
const selected = ref<Spawn | null>(null)
const activeBattleSpawn = ref<Spawn | null>(null)

function getEnvAt(lngLat: mapboxgl.LngLat): 'water' | 'urban' | 'forest' | 'default' {
  try {
    if (!map.value) return 'default'
    const layers = ['water', 'waterway', 'landuse', 'park']
    const features = map.value.queryRenderedFeatures(undefined, { layers })
    if (features.some((f) => f.layer.id.includes('water'))) return 'water'
    if (features.some((f) => f.layer.id.includes('park'))) return 'forest'
    if (features.some((f) => f.layer.id.includes('landuse'))) return 'urban'
  } catch {}
  return 'default'
}

async function addSpawnAt(coord: [number, number]) {
  const env = getEnvAt(new mapboxgl.LngLat(coord[0], coord[1]))
  const pokeId = typeWeightedRandom(env)
  const s: Spawn = { id: pokeId, coord }
  spawns.push(s)
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
    el.addEventListener('click', () => (selected.value = s))
    s.marker = new mapboxgl.Marker({ element: el }).setLngLat(coord).addTo(map.value!)
  } catch (e) {
    // ignore
  }
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
  for (let i = 0; i < count; i++) addSpawnAt(randomCoordAround(center, 200))
}

function clearSpawns() {
  spawns.forEach((s) => s.marker?.remove())
  spawns.splice(0)
}

function releaseSpawn(spawn: Spawn | null) {
  if (!spawn) return
  spawn.marker?.remove()
  const idx = spawns.indexOf(spawn)
  if (idx >= 0) spawns.splice(idx, 1)
}

function ensureAccessToken() {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined
  if (!token) throw new Error('Missing VITE_MAPBOX_ACCESS_TOKEN')
  mapboxgl.accessToken = token
}

function styleForTheme(theme: 'light' | 'dark') {
  // Use dedicated dark/light styles for strong visual contrast
  return theme === 'dark'
    ? 'mapbox://styles/mapbox/navigation-night-v1'
    : 'mapbox://styles/mapbox/navigation-day-v1'
}

function locateAndInitMap() {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is required.'
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const center: [number, number] = [pos.coords.longitude, pos.coords.latitude]
      const m = new mapboxgl.Map({
        container: mapContainer.value!,
        style: styleForTheme(store.theme),
        center,
        zoom: 17.2,
        minZoom: 17,
        maxZoom: 19,
        pitch: 45,
        bearing: 0,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: true,
      })
      m.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
      m.addControl(new mapboxgl.FullscreenControl())

      // Helper to lock interaction to a short range around a center
      function setBoundsAround(lngLat: [number, number], rangeMeters = 200) {
        const degPerMeterLat = 1 / 111320
        const degPerMeterLng = 1 / (111320 * Math.cos((lngLat[1] * Math.PI) / 180))
        const dLng = rangeMeters * degPerMeterLng
        const dLat = rangeMeters * degPerMeterLat
        const b = new mapboxgl.LngLatBounds(
          [lngLat[0] - dLng, lngLat[1] - dLat],
          [lngLat[0] + dLng, lngLat[1] + dLat]
        )
        m.setMaxBounds(b)
      }
      setBoundsAround(center)
      map.value = m
      m.once('load', () => {
        // Add a geolocation indicator (blue dot) and track heading
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true,
        })
        m.addControl(geolocate)
        // Trigger an initial geolocate to show the indicator
        try { geolocate.trigger(); } catch {}
        playerPos.value = new mapboxgl.LngLat(center[0], center[1])
        spawnBatch(new mapboxgl.LngLat(center[0], center[1]))
        loading.value = false
      })
      // Refresh spawns when moving a long distance
      let last = new mapboxgl.LngLat(center[0], center[1])
      m.on('moveend', () => {
        const c = m.getCenter()
        if (c.distanceTo(last) > 200) {
          clearSpawns()
          spawnBatch(c)
          last = c
        }
      })

      // React to theme changes by swapping style fully.
      watch(
        () => store.theme,
        (t) => {
          if (!map.value) return
          try { map.value.setStyle(styleForTheme(t)) } catch {}
        }
      )

      // Periodically check device location and keep camera centered
      locationInterval.value = window.setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lng = pos.coords.longitude
            const lat = pos.coords.latitude
            const current = new mapboxgl.LngLat(lng, lat)
            playerPos.value = current
            // Update bounds around the new player position
            setBoundsAround([lng, lat], 200)
            const centerNow = m.getCenter()
            // Recenter if drifted beyond 50m
            if (centerNow.distanceTo(current) > 50) {
              m.easeTo({ center: current, duration: 600, essential: true })
            }
            // Refresh spawns if player moved sufficiently
            if (current.distanceTo(last) > 200) {
              clearSpawns()
              spawnBatch(current)
              last = current
            }
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 5000 }
        )
      }, 5000)

      // Periodically enforce theme in auto mode (check hourly boundary)
      themeInterval.value = window.setInterval(() => {
        if (store.themeMode !== 'auto') return
        const next = store.computeTimeTheme()
        if (next !== store.theme) {
          store.setTheme(next)
          try { map.value?.setStyle(styleForTheme(next)) } catch {}
        }
      }, 60_000)
    },
    () => (error.value = 'Location permission is required to play.')
  )
}

function closeOverlay() {
  selected.value = null
}

function catchPokemon(s: Spawn) {
  if (!s.data) return
  // Simple catch odds: higher when fewer HP simulated randomly
  const success = Math.random() < 0.6
  if (success) {
    store.addCaught(s.data)
    releaseSpawn(s)
    selected.value = null
    alert(`Caught ${s.data.name}!`)
  } else {
    alert(`${s.data.name} broke free!`)
  }
}

function battlePokemon(s: Spawn) {
  if (!s.data) return
  activeBattleSpawn.value = s
  selected.value = null
  store.startBattle(s.data, store.battle.partyIndex)
}

function recenterToPlayer() {
  if (map.value && playerPos.value) {
    map.value.easeTo({ center: playerPos.value, duration: 500, essential: true })
  }
}

watch(
  () => store.battle.inBattle,
  (inBattle) => {
    if (!inBattle) {
      if (store.battle.outcome === 'victory' || store.battle.outcome === 'caught') {
        releaseSpawn(activeBattleSpawn.value)
      }
      activeBattleSpawn.value = null
    }
  }
)

onMounted(() => {
  try {
    ensureAccessToken()
    locateAndInitMap()
  } catch (e: any) {
    error.value = e?.message || String(e)
  }
})

onBeforeUnmount(() => {
  clearSpawns()
  map.value?.remove()
  map.value = null
  if (locationInterval.value) {
    clearInterval(locationInterval.value)
    locationInterval.value = null
  }
  if (themeInterval.value) {
    clearInterval(themeInterval.value)
    themeInterval.value = null
  }
})
</script>

<template>
  <div class="fullscreen">
    <div ref="mapContainer" class="fullscreen" aria-hidden="true"></div>
    <div v-if="loading" class="overlay"><div class="panel">Loading map…</div></div>
    <div v-if="error" class="overlay"><div class="panel" role="alert">{{ error }}</div></div>

    <div v-if="selected?.data" class="overlay" @click.self="closeOverlay">
      <div class="panel" style="max-width: 420px;">
        <div class="row" style="justify-content: space-between; align-items: start;">
          <h3 style="margin:0">{{ selected.data.name }}</h3>
          <button class="btn" @click="closeOverlay">Close</button>
        </div>
        <div class="row" style="gap:1rem; align-items: start;">
          <img :src="selected.data.sprites.front_default" :alt="selected.data.name" style="width:120px;height:120px;image-rendering: pixelated;" />
          <div class="stack" style="min-width: 200px;">
            <div>Types: {{ selected.data.types.map(t=>t.type.name).join(', ') }}</div>
            <div v-if="selected.data.stats">Stats:
              <ul style="margin:0.25rem 0 0 1rem;">
                <li v-for="st in selected.data.stats" :key="st.stat.name">{{ st.stat.name }}: {{ st.base_stat }}</li>
              </ul>
            </div>
            <div class="row" style="margin-top:0.5rem; gap:0.5rem; flex-wrap: wrap;">
              <button class="btn primary" @click="catchPokemon(selected!)">Catch</button>
              <button class="btn" @click="battlePokemon(selected!)">Battle</button>
              <button class="btn" @click="teamOpen = true">Team</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <HudOverlay @open-team="teamOpen = true" @recenter="recenterToPlayer" />
    <BattleOverlay v-if="store.battle.inBattle" @open-team="teamOpen=true" />
    <TeamOverlay v-if="teamOpen" @close="teamOpen=false" />
  </div>
</template>

<style scoped>
h3 { text-transform: capitalize; }
</style>
