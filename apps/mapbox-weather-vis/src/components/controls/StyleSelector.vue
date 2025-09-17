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
  <fieldset class="control-card">
    <label class="control-label" for="style">Base map style</label>
    <div class="control-field">
      <select id="style" class="control-select" :value="uiState?.styleId" @change="onChange">
        <option value="mapbox://styles/mapbox/streets-v12">Streets</option>
        <option value="mapbox://styles/mapbox/outdoors-v12">Outdoors</option>
        <option value="mapbox://styles/mapbox/light-v11">Light</option>
        <option value="mapbox://styles/mapbox/dark-v11">Dark</option>
        <option value="mapbox://styles/mapbox/satellite-streets-v12">Satellite</option>
        <option value="mapbox://styles/mapbox/standard">Standard</option>
      </select>
      <span class="select-caret" aria-hidden="true">⌄</span>
    </div>
  </fieldset>

</template>

<style scoped>
.control-card {
  margin: 0;
  padding: 0;
  border: 0;
  display: grid;
  gap: 0.5rem;
}
.control-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.8);
}
.control-field {
  position: relative;
}
.control-select {
  appearance: none;
  width: 100%;
  padding: 0.55rem 0.75rem;
  padding-right: 2.2rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.45);
  color: #f8fafc;
  font-size: 0.95rem;
  line-height: 1.4;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.4);
}
.control-select:focus-visible {
  outline: none;
  border-color: rgba(96, 165, 250, 0.8);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
  background: rgba(15, 23, 42, 0.65);
}
.control-select option {
  color: #0f172a;
}
.select-caret {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.75rem;
  color: rgba(226, 232, 240, 0.7);
}
</style>
