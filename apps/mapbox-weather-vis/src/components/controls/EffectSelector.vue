<script setup lang="ts">
import { inject } from 'vue'
import { MapUiStateKey } from '../di/keys'

type UiState = { effect: 'off' | 'wind' | 'rain' | 'snow' }
const uiState = inject(MapUiStateKey, null) as unknown as UiState | null

function onChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value as UiState['effect']
  if (uiState) uiState.effect = v
}
</script>

<template>
  <fieldset class="control">
    <label class="label" for="effect">Particle effect</label>
    <select id="effect" class="select" :value="uiState?.effect" @change="onChange">
      <option value="off">Off (2D demo)</option>
      <option value="wind">Wind (3D)</option>
      <option value="rain">Rain (3D)</option>
      <option value="snow">Snow (3D)</option>
    </select>
  </fieldset>
</template>

<style scoped>
.control { margin-bottom: 0.5rem; display: grid; gap: 0.25rem; }
.label { font-size: 0.8rem; color: #334155; }
.select { width: 100%; padding: 0.4rem 0.5rem; border: 1px solid #e2e8f0; border-radius: 8px; background: white; }
</style>

