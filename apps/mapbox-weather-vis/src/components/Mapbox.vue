<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container" />

    <WeatherParticlesCanvas v-if="uiState.effect === 'off'" />
    <ThreeParticlesOverlay v-else />
    <RadarOverlay :active="uiState.radarOn" :opacity="uiState.radarOpacity" />

    <div class="ui-overlay" role="region" aria-labelledby="map-controls-title">
      <section class="panel">
        <header class="panel-header">
          <p class="panel-eyebrow">Weather layers</p>
          <h2 id="map-controls-title" class="panel-title">Map Controls</h2>
        </header>
        <div class="panel-content">
          <div class="panel-section">
            <StyleSelector />
          </div>
          <div class="panel-section">
            <LayerToggle />
          </div>
          <div class="panel-section">
            <RadarControl />
          </div>
          <div class="panel-section">
            <EffectSelector />
          </div>
          <div class="panel-section">
            <TimeControl />
          </div>
        </div>
      </section>
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
  top: 1.25rem;
  left: 1.25rem;
  z-index: 10;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}
.panel {
  min-width: 260px;
  max-width: min(360px, calc(100vw - 2.5rem));
  background: rgba(15, 23, 42, 0.72);
  border-radius: 18px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.35);
  padding: 1.25rem;
  backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #e2e8f0;
}
.panel-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}
.panel-eyebrow {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.7);
}
.panel-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
}
.panel-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.panel-section {
  border-radius: 14px;
  padding: 0.85rem;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: inset 0 1px 0 rgba(226, 232, 240, 0.05);
}

@media (max-width: 768px) {
  .ui-overlay {
    top: 1rem;
    left: 1rem;
    right: 1rem;
  }

  .panel {
    width: 100%;
    max-width: none;
  }
}
</style>
