<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import { useStore, type PokemonInstance } from '../store'
import BattleOverlay from '../components/battle/BattleOverlay.vue'
import TeamOverlay from '../components/team/TeamOverlay.vue'
import PcOverlay from '../components/team/PcOverlay.vue'
import PokeballMenu from '../components/hud/PokeballMenu.vue'
import StatsBars from '../components/pokemon/StatsBars.vue'
import AppButton from '../components/ui/AppButton.vue'
import PokemonInspect from '../components/pokemon/PokemonInspect.vue'
import { useMapboxStandard, type LightPreset } from '../composables/useMapboxStandard'
import { useSpawns, type Spawn } from '../composables/useSpawns'

const store = useStore()
const teamOpen = ref(false)
const pcOpen = ref(false)
const inspectMon = ref<PokemonInstance | null>(null)

const mapContainer = ref<HTMLDivElement | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)
const playerPos = ref<mapboxgl.LngLat | null>(null)
const locationInterval = ref<number | null>(null)
const presetSelected = ref<LightPreset | null>(null)

function ensureAccessToken() {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  if (!token) throw new Error('Missing VITE_MAPBOX_ACCESS_TOKEN')
  mapboxgl.accessToken = token
}

const { map, create, setBoundsAround, recenter, setPresetAuto, setPresetManual } = useMapboxStandard({
  container: () => mapContainer.value,
  initialCenter: () => (playerPos.value ? [playerPos.value.lng, playerPos.value.lat] : [-0.1276, 51.5072]),
  onLoad: (m) => {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    })
    m.addControl(geolocate)
    try { geolocate.trigger() } catch {}
  },
})

const selected = ref<Spawn | null>(null)
const { spawns, addSpawnAt, spawnBatch, clearSpawns, releaseSpawn } = useSpawns(() => map.value, {
  onSelect: (s) => (selected.value = s),
})
const activeBattleSpawn = ref<Spawn | null>(null)

function locateAndInitMap() {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is required.'
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const center: [number, number] = [pos.coords.longitude, pos.coords.latitude]
      playerPos.value = new mapboxgl.LngLat(center[0], center[1])
      create()
      setBoundsAround(center)
      map.value?.once('load', () => {
        spawnBatch(new mapboxgl.LngLat(center[0], center[1]))
        loading.value = false
      })

      // Refresh spawns when moving a long distance
      let last = new mapboxgl.LngLat(center[0], center[1])
      map.value?.on('moveend', () => {
        const c = map.value!.getCenter()
        if (c.distanceTo(last) > 200) { clearSpawns(); spawnBatch(c); last = c }
      })

      // Periodically check device location and keep camera centered (throttled)
      locationInterval.value = window.setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lng = pos.coords.longitude
            const lat = pos.coords.latitude
            const current = new mapboxgl.LngLat(lng, lat)
            playerPos.value = current
            // Only expand/reset bounds if moved significantly
            if (!last || current.distanceTo(last) > 200) setBoundsAround([lng, lat], 200)
            const centerNow = map.value!.getCenter()
            if (centerNow.distanceTo(current) > 50) recenter(current)
            if (current.distanceTo(last) > 200) { clearSpawns(); spawnBatch(current); last = current }
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 5000 }
        )
      }, 6000)
    },
    () => (error.value = 'Location permission is required to play.')
  )
}

function closeOverlay() { selected.value = null }

function catchPokemon(s: Spawn) {
  if (!s.data) return
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

function recenterToPlayer() { if (playerPos.value) recenter(playerPos.value) }

function catchSelected() {
  const current = selected.value
  if (!current) return
  catchPokemon(current)
}

function battleSelected() {
  const current = selected.value
  if (!current) return
  battlePokemon(current)
}

watch(
  () => store.battle.inBattle,
  (inBattle) => {
    if (!inBattle) {
      const outcome = store.battle.outcome
      const spawn = activeBattleSpawn.value
      if ((outcome === 'victory' || outcome === 'caught') && spawn) releaseSpawn(spawn)
      activeBattleSpawn.value = null
    }
  }
)

onMounted(() => {
  try {
    ensureAccessToken()
    locateAndInitMap()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  }
})

function stopLocationTracking() {
  if (locationInterval.value !== null) {
    clearInterval(locationInterval.value)
    locationInterval.value = null
  }
}

onBeforeUnmount(() => {
  clearSpawns()
  stopLocationTracking()
})
</script>

<template>
  <div class="fullscreen">
    <div ref="mapContainer" class="fullscreen" aria-hidden="true"></div>
    <Transition name="scrim">
      <div v-if="loading" class="overlay" role="status">
        <div class="panel overlay-card">
          <h3 class="overlay-title">Preparing the map</h3>
          <p class="overlay-copy">Locating you and summoning nearby Pokémon habitats…</p>
        </div>
      </div>
    </Transition>
    <Transition name="scrim">
      <div v-if="error" class="overlay">
        <div class="panel overlay-card" role="alert">
          <h3 class="overlay-title">Location required</h3>
          <p class="overlay-copy">{{ error }}</p>
          <AppButton variant="primary" @click="locateAndInitMap">Try again</AppButton>
        </div>
      </div>
    </Transition>

    <PokeballMenu @open-team="teamOpen = true" @open-pc="pcOpen = true" @recenter="recenterToPlayer" />

    <Transition name="scrim">
      <div v-if="selected?.data" class="overlay" @click.self="closeOverlay">
        <div class="panel wild-card" role="dialog" aria-modal="true">
          <header class="wild-header">
            <div class="wild-title">
              <p class="eyebrow">Wild encounter</p>
              <h3 class="capitalize">{{ selected.data.name }}</h3>
            </div>
            <AppButton variant="ghost" size="sm" @click="closeOverlay">Close</AppButton>
          </header>
          <div class="wild-body">
            <img :src="selected.data.sprites.front_default ?? ''" :alt="selected.data.name" class="wild-sprite" />
            <div class="wild-details">
              <div class="chip-row">
                <span class="chip" v-for="t in selected.data.types" :key="t.type.name">{{ t.type.name }}</span>
              </div>
              <StatsBars v-if="selected.data.stats" :stats="selected.data.stats" />
              <div class="wild-actions">
                <AppButton variant="primary" @click="catchSelected">Throw Poké Ball</AppButton>
                <AppButton variant="outline" @click="battleSelected">Start battle</AppButton>
                <AppButton variant="ghost" @click="teamOpen = true">Manage team</AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <BattleOverlay v-if="store.battle.inBattle" @open-team="teamOpen=true" />
    <TeamOverlay v-if="teamOpen" @close="teamOpen=false" @inspect="(p)=>{ inspectMon = p }" />
    <PcOverlay v-if="pcOpen" @close="pcOpen=false" />
    <PokemonInspect
      v-if="inspectMon"
      :pokemon="inspectMon"
      @close="inspectMon=null"
      @set-active="() => { const current = inspectMon; if (!current) return; const idx = store.team.findIndex(c=>c.id===current.id); if (idx>=0) store.setPartyIndex(idx); inspectMon=null; teamOpen=false }"
    />
  </div>
</template>

<style scoped>
.overlay-card {
  text-align: center;
  display: grid;
  gap: 0.65rem;
  padding: clamp(1.5rem, 4vw, 2.25rem);
}

.overlay-title {
  margin: 0;
  font-size: 1.35rem;
}

.overlay-copy {
  margin: 0;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 74%, transparent);
}

.wild-card {
  max-width: min(720px, 96vw);
  display: grid;
  gap: clamp(1.25rem, 3vw, 2rem);
  padding: clamp(1.5rem, 3vw, 2.5rem);
}

.wild-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.wild-title { display: grid; gap: 0.2rem; }

.wild-title > h3 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.eyebrow {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 58%, transparent);
}

.wild-body {
  display: grid;
  gap: clamp(1rem, 3vw, 1.5rem);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: start;
}

.wild-sprite {
  width: clamp(160px, 24vw, 220px);
  aspect-ratio: 1;
  image-rendering: pixelated;
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 40%, transparent);
  padding: 1.5rem;
}

.wild-details {
  display: grid;
  gap: clamp(0.75rem, 2vw, 1.25rem);
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--md-sys-color-primary) 12%, var(--md-sys-color-surface-container-highest));
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 82%, transparent);
  text-transform: uppercase;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  font-weight: 600;
}

.wild-actions {
  display: grid;
  gap: 0.6rem;
  align-content: start;
}

.scrim-enter-active,
.scrim-leave-active {
  transition: opacity var(--motion-duration-medium) var(--motion-easing-standard);
}

.scrim-enter-from,
.scrim-leave-to {
  opacity: 0;
}
</style>

