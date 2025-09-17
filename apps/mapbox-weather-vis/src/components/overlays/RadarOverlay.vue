<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, watch } from 'vue'
import type mapboxgl from 'mapbox-gl'
import { MapboxKey } from '../di/keys'

const props = defineProps<{ active: boolean; opacity: number }>()

const mapRef = inject(MapboxKey, null)
const LAYER_ID = 'radar-raster-layer'
const SOURCE_ID = 'radar-raster-source'
let intervalId: number | null = null
let frameUrls: string[] = []
let frameIndex = 0
let styleDataHandler: (() => void) | null = null

type RasterSource = mapboxgl.RasterSource & {
  setTiles?: (tiles: string[]) => void
}

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
  const source = map.getSource(SOURCE_ID) as RasterSource | undefined
  if (!source) {
    const sourceSpec: mapboxgl.RasterSourceSpecification = {
      type: 'raster',
      tiles: frameUrls.length ? [frameUrls[frameIndex]] : [],
      tileSize: 256,
      attribution: 'RainViewer',
    }
    map.addSource(SOURCE_ID, sourceSpec)
  } else {
    if (frameUrls.length) {
      try {
        source.setTiles?.([frameUrls[frameIndex]])
      } catch {
        // Some versions require re-adding on style change
        map.removeLayer(LAYER_ID)
        map.removeSource(SOURCE_ID)
        const freshSource: mapboxgl.RasterSourceSpecification = {
          type: 'raster',
          tiles: [frameUrls[frameIndex]],
          tileSize: 256,
          attribution: 'RainViewer',
        }
        map.addSource(SOURCE_ID, freshSource)
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
  frameIndex = Math.max(0, frameUrls.length - 1)
  addOrUpdateLayer(map)
  // Animate frames if available
  stopAnimation()
  if (frameUrls.length > 1) {
    intervalId = window.setInterval(() => {
      frameIndex = (frameIndex + 1) % frameUrls.length
      addOrUpdateLayer(map)
    }, 800)
  }
}

function disable(map: mapboxgl.Map) {
  stopAnimation()
  removeLayer(map)
}

function stopAnimation() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  const map = mapRef?.value
  if (!map) return
  styleDataHandler = () => {
    if (props.active) addOrUpdateLayer(map)
  }
  const init = () => {
    if (props.active) enable(map)
    if (styleDataHandler) map.on('styledata', styleDataHandler)
  }
  if (map.loaded()) init()
  else map.once('load', init)
})

onBeforeUnmount(() => {
  const map = mapRef?.value
  if (!map) return
  stopAnimation()
  if (styleDataHandler) {
    map.off('styledata', styleDataHandler)
    styleDataHandler = null
  }
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

