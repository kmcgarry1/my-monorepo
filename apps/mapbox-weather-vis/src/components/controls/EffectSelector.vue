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
  <fieldset class="control-card">
    <label class="control-label" for="effect">Particle effect</label>
    <div class="control-field">
      <select id="effect" class="control-select" :value="uiState?.effect" @change="onChange">
        <option value="off">Off (2D demo)</option>
        <option value="wind">Wind (3D)</option>
        <option value="rain">Rain (3D)</option>
        <option value="snow">Snow (3D)</option>
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
  border-color: rgba(129, 140, 248, 0.85);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.35);
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

