<script setup lang="ts">
import { inject, watch } from 'vue'
import type mapboxgl from 'mapbox-gl'
import { MapboxKey, MapUiStateKey } from '../di/keys'

type UiState = {
  showLabels: boolean
}

const map = inject(MapboxKey, null) as unknown as { value: mapboxgl.Map | null } | null
const uiState = inject(MapUiStateKey, null) as unknown as UiState | null

function setSymbolVisibility(visible: boolean) {
  const m = (map as any)?.value as mapboxgl.Map | null
  if (!m) return
  try {
    const style = m.getStyle()
    if (!style?.layers) return
    for (const layer of style.layers) {
      if ((layer as any).type === 'symbol') {
        m.setLayoutProperty((layer as any).id, 'visibility', visible ? 'visible' : 'none')
      }
    }
  } catch {
    // ignore
  }
}

function onToggleLabels(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  if (uiState) uiState.showLabels = checked
  setSymbolVisibility(checked)
}

// Re-apply after style changes
watch(
  () => (map as any)?.value?.getStyle()?.sprite,
  () => {
    if (uiState) setSymbolVisibility(uiState.showLabels)
  }
)
</script>

<template>
  <fieldset class="control">
    <label class="checkbox">
      <input type="checkbox" :checked="uiState?.showLabels" @change="onToggleLabels" />
      <span>Show labels</span>
    </label>
  </fieldset>
</template>

<style scoped>
.control { margin-bottom: 0.5rem; }
.checkbox { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #0f172a; }
input[type="checkbox"] { width: 16px; height: 16px; }
</style>
