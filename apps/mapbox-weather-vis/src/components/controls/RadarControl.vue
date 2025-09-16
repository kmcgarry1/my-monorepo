<script setup lang="ts">
import { inject } from 'vue'
import { MapUiStateKey } from '../di/keys'

type UiState = { radarOn: boolean; radarOpacity: number }
const uiState = inject(MapUiStateKey, null) as unknown as UiState | null

function onToggle(e: Event) {
  if (!uiState) return
  uiState.radarOn = (e.target as HTMLInputElement).checked
}

function onOpacity(e: Event) {
  if (!uiState) return
  uiState.radarOpacity = Number((e.target as HTMLInputElement).value)
}
</script>

<template>
  <fieldset class="control">
    <label class="checkbox">
      <input type="checkbox" :checked="uiState?.radarOn" @change="onToggle" />
      <span>Radar (RainViewer)</span>
    </label>
    <div class="row" :aria-disabled="!uiState?.radarOn">
      <label class="label" for="radarOpacity">Opacity</label>
      <input id="radarOpacity" class="range" type="range" min="0" max="1" step="0.05" :value="uiState?.radarOpacity" @input="onOpacity" />
    </div>
  </fieldset>
</template>

<style scoped>
.control { margin-bottom: 0.5rem; display: grid; gap: 0.25rem; }
.checkbox { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #0f172a; }
.row { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 0.5rem; opacity: 1; }
[aria-disabled="true"] { opacity: 0.5; }
.label { font-size: 0.8rem; color: #334155; }
.range { width: 100%; }
</style>

