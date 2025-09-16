<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container" />

    <WeatherParticlesCanvas v-if="uiState.effect === 'off'" />
    <ThreeParticlesOverlay v-else />
    <RadarOverlay :active="uiState.radarOn" :opacity="uiState.radarOpacity" />

    <div class="ui-overlay" role="region" aria-label="Map controls">
      <div class="panel">
        <h2 class="panel-title">Map Controls</h2>
        <StyleSelector />
        <LayerToggle />
        <RadarControl />
        <EffectSelector />
        <TimeControl />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, provide, shallowRef, reactive } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import StyleSelector from './controls/StyleSelector.vue'
import LayerToggle from './controls/LayerToggle.vue'
import TimeControl from './controls/TimeControl.vue'
import EffectSelector from './controls/EffectSelector.vue'
import RadarControl from './controls/RadarControl.vue'
import WeatherParticlesCanvas from './overlays/WeatherParticlesCanvas.vue'
import ThreeParticlesOverlay from './overlays/ThreeParticlesOverlay.vue'
import RadarOverlay from './overlays/RadarOverlay.vue'
import { MapboxKey, MapUiStateKey } from './di/keys'

const mapContainer = ref<HTMLDivElement | null>(null)
const map = shallowRef<mapboxgl.Map | null>(null)

const uiState = reactive({
  styleId: 'mapbox://styles/mapbox/standard',
  showLabels: true,
  time: 0,
  playing: false,
  effect: 'off' as 'off' | 'wind' | 'rain' | 'snow',
  radarOn: false,
  radarOpacity: 0.6,
})

provide(MapboxKey, map)
provide(MapUiStateKey, uiState)

onMounted(() => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined
  if (!accessToken) {
    console.error('Missing VITE_MAPBOX_ACCESS_TOKEN in environment')
    return
  }

  mapboxgl.accessToken = accessToken

  const m = new mapboxgl.Map({
    container: mapContainer.value!,
    style: uiState.styleId,
    config: {
      basemap: {
        lightPreset: 'night',
        theme: 'monochrome',
      },
    } as any,
    center: [-6.2603, 53.3498],
    zoom: 10,
    attributionControl: true,
  })

  m.addControl(new mapboxgl.NavigationControl(), 'top-right')
  m.addControl(new mapboxgl.FullscreenControl())

  // Keep style in sync if changed by control
  m.on('styledata', () => {
    try {
      // Reapply Standard style config if available
      if (typeof (m as any).setConfig === 'function' && uiState.styleId.includes('mapbox/standard')) {
        ;(m as any).setConfig({ basemap: { lightPreset: 'night', theme: 'monochrome' } })
      }
    } catch {}
    // Best-effort to maintain label visibility toggle after style switch
    applyLabelVisibility(m, uiState.showLabels)
  })

  map.value = m
})

onBeforeUnmount(() => {
  map.value?.remove()
  map.value = null
})

function applyLabelVisibility(m: mapboxgl.Map, visible: boolean) {
  try {
    const style = m.getStyle()
    if (!style?.layers) return
    for (const layer of style.layers) {
      if ((layer as any).type === 'symbol') {
        const id = (layer as any).id
        m.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
      }
    }
  } catch (e) {
    // Ignore if layer properties not available yet
  }
}
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.map-container {
  position: absolute;
  inset: 0;
}
.ui-overlay {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10;
  display: flex;
  gap: 0.75rem;
}
.panel {
  min-width: 240px;
  max-width: 320px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(2, 6, 23, 0.2);
  padding: 0.75rem;
  backdrop-filter: blur(6px);
}
.panel-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
}
</style>
