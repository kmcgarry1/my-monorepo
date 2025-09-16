<script setup lang="ts">
import { inject, watch } from 'vue'
import type mapboxgl from 'mapbox-gl'
import { MapboxKey, MapUiStateKey } from '../di/keys'

type UiState = {
  styleId: string
}

const map = inject(MapboxKey, null) as unknown as { value: mapboxgl.Map | null } | null
const uiState = inject(MapUiStateKey, null) as unknown as UiState | null

// When user changes style, apply to map
function onChange(e: Event) {
  const next = (e.target as HTMLSelectElement).value
  if (!uiState) return
  uiState.styleId = next
  const m = (map as any)?.value as mapboxgl.Map | null
  if (m) m.setStyle(next)
}

// Keep select in sync if style changes externally
watch(
  () => (map as any)?.value?.getStyle()?.sprite,
  () => {
    // No-op placeholder for potential sync logic
  }
)
</script>

<template>
  <fieldset class="control">
    <label class="label" for="style">Base map style</label>
    <select id="style" class="select" :value="uiState?.styleId" @change="onChange">
      <option value="mapbox://styles/mapbox/streets-v12">Streets</option>
      <option value="mapbox://styles/mapbox/outdoors-v12">Outdoors</option>
      <option value="mapbox://styles/mapbox/light-v11">Light</option>
      <option value="mapbox://styles/mapbox/dark-v11">Dark</option>
      <option value="mapbox://styles/mapbox/satellite-streets-v12">Satellite</option>
      <option value="mapbox://styles/mapbox/standard">Standard</option>
    </select>
  </fieldset>
  
</template>

<style scoped>
.control { margin-bottom: 0.5rem; display: grid; gap: 0.25rem; }
.label { font-size: 0.8rem; color: #334155; }
.select { width: 100%; padding: 0.4rem 0.5rem; border: 1px solid #e2e8f0; border-radius: 8px; background: white; }
</style>
