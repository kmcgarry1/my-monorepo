<template>
  <div class="map-wrapper" :class="deviceClasses">
    <div ref="mapContainer" class="map-container" />

    <WeatherParticlesCanvas v-if="uiState.effect === 'off'" />
    <ThreeParticlesOverlay v-else />
    <RadarOverlay :active="uiState.radarOn" :opacity="uiState.radarOpacity" />

    <div class="ui-overlay" :class="{ 'is-phone': isPhone }" role="region" aria-labelledby="map-controls-title">
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
import { useMaterialDisplay } from '@my-monorepo/ui'
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
import { MapboxKey, MapUiStateKey, type MapUiState } from './di/keys'

const mapContainer = ref<HTMLDivElement | null>(null)
const map = shallowRef<mapboxgl.Map | null>(null)
const { deviceClasses, isPhone } = useMaterialDisplay()

const uiState = reactive<MapUiState>({
  styleId: 'mapbox://styles/mapbox/standard',
  showLabels: true,
  time: 0,
  playing: false,
  effect: 'off',
  radarOn: false,
  radarOpacity: 0.6,
})

provide(MapboxKey, map)
provide(MapUiStateKey, uiState)

type ConfigurableMap = mapboxgl.Map & {
  setConfig?: (config: unknown) => void
}

const standardBasemapConfig = {
  basemap: {
    lightPreset: 'night',
    theme: 'monochrome',
  },
} as const

let standardConfigErrorLogged = false

function applyStandardBasemap(m: ConfigurableMap) {
  if (!uiState.styleId.includes('mapbox/standard')) return
  try {
    m.setConfig?.(standardBasemapConfig)
  } catch (error) {
    if (!standardConfigErrorLogged) {
      console.warn('Failed to apply Mapbox standard basemap config', error)
      standardConfigErrorLogged = true
    }
  }
}

onMounted(() => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  if (!accessToken) {
    console.error('Missing VITE_MAPBOX_ACCESS_TOKEN in environment')
    return
  }

  if (!mapContainer.value) {
    console.error('Map container element not found')
    return
  }

  mapboxgl.accessToken = accessToken

  const mapOptions: mapboxgl.MapboxOptions = {
    container: mapContainer.value,
    style: uiState.styleId,
    center: [-6.2603, 53.3498],
    zoom: 10,
    attributionControl: true,
  }

  const mapInstance = new mapboxgl.Map(mapOptions)
  const configurableMap = mapInstance as ConfigurableMap

  applyStandardBasemap(configurableMap)

  mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right')
  mapInstance.addControl(new mapboxgl.FullscreenControl())

  // Keep style in sync if changed by control
  mapInstance.on('styledata', () => {
    applyStandardBasemap(configurableMap)
    // Best-effort to maintain label visibility toggle after style switch
    applyLabelVisibility(mapInstance, uiState.showLabels)
  })

  map.value = mapInstance
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
      if (layer.type === 'symbol') {
        m.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none')
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

.ui-overlay.is-phone {
  top: auto;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  padding: clamp(0.75rem, 4vw, 1.25rem);
  pointer-events: none;
}

.ui-overlay.is-phone .panel {
  pointer-events: auto;
  width: min(520px, calc(100% - clamp(1.5rem, 8vw, 2.5rem)));
  max-height: min(65vh, 540px);
  overflow-y: auto;
  border-radius: 1.35rem;
  padding: clamp(1rem, 4vw, 1.6rem);
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
