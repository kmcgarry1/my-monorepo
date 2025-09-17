<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import { useStore } from '../store'
import BattleOverlay from '../components/battle/BattleOverlay.vue'
import TeamOverlay from '../components/team/TeamOverlay.vue'
import HudOverlay from '../components/hud/HudOverlay.vue'
import StatsBars from '../components/pokemon/StatsBars.vue'
import AppButton from '../components/ui/AppButton.vue'
import ClockOverlay from '../components/hud/ClockOverlay.vue'
import PokemonInspect from '../components/pokemon/PokemonInspect.vue'
import { useMapboxStandard, type LightPreset } from '../composables/useMapboxStandard'
import { useSpawns, type Spawn } from '../composables/useSpawns'

const store = useStore()
const teamOpen = ref(false)
const inspectMon = ref<any | null>(null)

const mapContainer = ref<HTMLDivElement | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)
const playerPos = ref<mapboxgl.LngLat | null>(null)
const locationInterval = ref<number | null>(null)
const presetSelected = ref<LightPreset | null>(null)

function ensureAccessToken() {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined
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

      // Periodically check device location and keep camera centered
      locationInterval.value = window.setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lng = pos.coords.longitude
            const lat = pos.coords.latitude
            const current = new mapboxgl.LngLat(lng, lat)
            playerPos.value = current
            setBoundsAround([lng, lat], 200)
            const centerNow = map.value!.getCenter()
            if (centerNow.distanceTo(current) > 50) recenter(current)
            if (current.distanceTo(last) > 200) { clearSpawns(); spawnBatch(current); last = current }
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 5000 }
        )
      }, 5000)
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

watch(
  () => store.battle.inBattle,
  (inBattle) => {
    if (!inBattle) {
      const outcome = (store.battle as any).outcome
      if (outcome === 'victory' || outcome === 'caught') releaseSpawn(activeBattleSpawn.value)
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
  if (locationInterval.value) { clearInterval(locationInterval.value); locationInterval.value = null }
})
</script>

<template>
  <div class="fullscreen">
    <div ref="mapContainer" class="fullscreen" aria-hidden="true"></div>
    <div v-if="loading" class="overlay"><div class="panel">Loading map…</div></div>
    <div v-if="error" class="overlay"><div class="panel" role="alert">{{ error }}</div></div>

    <div v-if="selected?.data" class="overlay" @click.self="closeOverlay">
      <div class="panel max-w-[420px]">
        <div class="row justify-between items-start">
          <h3 class="m-0 capitalize">{{ selected.data.name }}</h3>
          <AppButton variant="outline" size="sm" @click="closeOverlay">Close</AppButton>
        </div>
        <div class="row gap-4 items-start">
          <img :src="selected.data.sprites.front_default" :alt="selected.data.name" class="w-[120px] h-[120px] [image-rendering:pixelated]" />
          <div class="stack min-w-[200px]">
            <div>Types: {{ selected.data.types.map(t=>t.type.name).join(', ') }}</div>
            <StatsBars v-if="selected.data.stats" :stats="selected.data.stats" />
            <div class="row mt-2 gap-2 flex-wrap">
              <AppButton variant="primary" @click="catchPokemon(selected!)">Catch</AppButton>
              <AppButton variant="outline" @click="battlePokemon(selected!)">Battle</AppButton>
              <AppButton variant="outline" @click="teamOpen = true">Team</AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <HudOverlay @open-team="teamOpen = true" @recenter="recenterToPlayer" />
    <ClockOverlay :selected="(presetSelected ?? 'auto')" @set-auto="() => { setPresetAuto(); presetSelected=null }" @set-preset="(p)=>{ setPresetManual(p); presetSelected=p }" />
    <BattleOverlay v-if="store.battle.inBattle" @open-team="teamOpen=true" />
    <TeamOverlay v-if="teamOpen" @close="teamOpen=false" @inspect="(p)=>{ inspectMon = p }" />
    <PokemonInspect
      v-if="inspectMon"
      :pokemon="inspectMon"
      @close="inspectMon=null"
      @set-active="() => { const idx = store.caught.findIndex(c=>c.id===inspectMon.id); if (idx>=0) store.setPartyIndex(idx); inspectMon=null; teamOpen=false }"
    />
  </div>
</template>

<style scoped>
</style>
