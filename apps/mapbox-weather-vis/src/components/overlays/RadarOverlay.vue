<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type mapboxgl from 'mapbox-gl'
import { MapboxKey } from '../di/keys'

const props = defineProps<{ active: boolean; opacity: number }>()

const mapRef = inject(MapboxKey, null) as unknown as { value: mapboxgl.Map | null } | null
const LAYER_ID = 'radar-raster-layer'
const SOURCE_ID = 'radar-raster-source'
let intervalId: any = null
let frameUrls: string[] = []
let frameIndex = 0

const isOn = computed(() => !!props.active)

async function fetchTimeline(): Promise<string[]> {
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json')
    const data = await res.json()
    const host = 'https://tilecache.rainviewer.com/'
    const nowcast = (data?.radar?.nowcast ?? []) as Array<{ path: string }>
    return nowcast.map((f) => `${host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`)
  } catch (e) {
    console.warn('Failed to fetch RainViewer timeline', e)
    return []
  }
}

function addOrUpdateLayer(map: mapboxgl.Map) {
  // Add source if missing
  const src = map.getSource(SOURCE_ID) as any
  if (!src) {
    map.addSource(SOURCE_ID, {
      type: 'raster',
      tiles: frameUrls.length ? [frameUrls[frameIndex]] : [],
      tileSize: 256,
      attribution: 'RainViewer',
    } as any)
  } else {
    if (frameUrls.length) {
      try {
        src.setTiles([frameUrls[frameIndex]])
      } catch {
        // Some versions require re-adding on style change
        map.removeLayer(LAYER_ID)
        map.removeSource(SOURCE_ID)
        map.addSource(SOURCE_ID, {
          type: 'raster',
          tiles: [frameUrls[frameIndex]],
          tileSize: 256,
          attribution: 'RainViewer',
        } as any)
      }
    }
  }

  // Add layer if missing
  if (!map.getLayer(LAYER_ID)) {
    map.addLayer({
      id: LAYER_ID,
      type: 'raster',
      source: SOURCE_ID,
      paint: {
        'raster-opacity': props.opacity,
      },
    })
  } else {
    map.setPaintProperty(LAYER_ID, 'raster-opacity', props.opacity)
  }
}

function removeLayer(map: mapboxgl.Map) {
  if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID)
  if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID)
}

async function enable(map: mapboxgl.Map) {
  frameUrls = await fetchTimeline()
  frameIndex = Math.max(0, Math.min(frameUrls.length - 1, frameUrls.length - 1))
  addOrUpdateLayer(map)
  // Animate frames if available
  clearInterval(intervalId)
  if (frameUrls.length > 1) {
    intervalId = setInterval(() => {
      frameIndex = (frameIndex + 1) % frameUrls.length
      addOrUpdateLayer(map)
    }, 800)
  }
}

function disable(map: mapboxgl.Map) {
  clearInterval(intervalId)
  intervalId = null
  removeLayer(map)
}

onMounted(() => {
  const map = mapRef?.value
  if (!map) return
  const init = () => {
    if (props.active) enable(map)
    map.on('styledata', () => {
      if (props.active) addOrUpdateLayer(map)
    })
  }
  if (map.loaded()) init()
  else map.once('load', init)
})

onBeforeUnmount(() => {
  const map = mapRef?.value
  if (!map) return
  clearInterval(intervalId)
  if (map.getLayer(LAYER_ID)) removeLayer(map)
})

watch(
  () => props.active,
  (on) => {
    const map = mapRef?.value
    if (!map) return
    if (on) enable(map)
    else disable(map)
  }
)

watch(
  () => props.opacity,
  (v) => {
    const map = mapRef?.value
    if (!map || !map.getLayer(LAYER_ID)) return
    map.setPaintProperty(LAYER_ID, 'raster-opacity', v)
  }
)
</script>

<template></template>

<style scoped></style>

