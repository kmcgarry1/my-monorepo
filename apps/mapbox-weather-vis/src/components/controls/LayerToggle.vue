<script setup lang="ts">
import { inject, watch } from 'vue'
import type { Map as MapboxMap } from 'mapbox-gl'
import { MapboxKey, MapUiStateKey } from '../di/keys'

const map = inject(MapboxKey, null)
const uiState = inject(MapUiStateKey, null)

function setSymbolVisibility(mapInstance: MapboxMap | null, visible: boolean) {
  if (!mapInstance) return
  try {
    const style = mapInstance.getStyle()
    if (!style?.layers) return
    for (const layer of style.layers) {
      if (layer.type === 'symbol') {
        mapInstance.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none')
      }
    }
  } catch {
    // Ignore errors from incomplete style data
  }
}

function onToggleLabels(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  if (uiState) uiState.showLabels = checked
  setSymbolVisibility(map?.value ?? null, checked)
}

watch(
  () => map?.value ?? null,
  (mapInstance, _prev, onCleanup) => {
    if (!mapInstance) return
    const apply = () => setSymbolVisibility(mapInstance, uiState?.showLabels ?? true)
    apply()
    mapInstance.on('styledata', apply)
    onCleanup(() => {
      mapInstance.off('styledata', apply)
    })
  },
  { immediate: true }
)
</script>

<template>
  <fieldset class="control-card">
    <legend class="sr-only">Toggle map labels</legend>
    <div class="switch">
      <div class="switch-copy">
        <span class="switch-title">Show labels</span>
        <span class="switch-subtitle">Reveal place names and road markers</span>
      </div>
      <label class="switch-control">
        <input class="switch-input" type="checkbox" :checked="uiState?.showLabels" @change="onToggleLabels" />
        <span class="switch-track" aria-hidden="true">
          <span class="switch-handle"></span>
        </span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.control-card {
  margin: 0;
  padding: 0;
  border: 0;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.switch-copy {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.switch-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #f8fafc;
}
.switch-subtitle {
  font-size: 0.75rem;
  color: rgba(226, 232, 240, 0.7);
}
.switch-control {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.switch-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.switch-track {
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
  border: 1px solid rgba(148, 163, 184, 0.5);
  display: inline-flex;
  align-items: center;
  padding: 2px;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.switch-handle {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #f8fafc;
  transform: translateX(0);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.45);
}
.switch-control:focus-within .switch-track {
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.35);
}
.switch-input:checked + .switch-track {
  background: rgba(96, 165, 250, 0.55);
  border-color: rgba(59, 130, 246, 0.7);
}
.switch-input:checked + .switch-track .switch-handle {
  transform: translateX(20px);
  background: #0f172a;
}
</style>
