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
  <fieldset class="control-card">
    <legend class="control-legend">
      <div class="legend-copy">
        <span class="legend-title">Radar overlay</span>
        <span class="legend-subtitle">RainViewer reflectivity</span>
      </div>
      <label class="toggle">
        <input class="toggle-input" type="checkbox" :checked="uiState?.radarOn" @change="onToggle" />
        <span class="toggle-track" aria-hidden="true">
          <span class="toggle-handle"></span>
        </span>
      </label>
    </legend>
    <div class="slider" :data-disabled="!uiState?.radarOn">
      <label class="slider-label" for="radarOpacity">Opacity</label>
      <input
        id="radarOpacity"
        class="slider-input"
        type="range"
        min="0"
        max="1"
        step="0.05"
        :value="uiState?.radarOpacity"
        :disabled="!uiState?.radarOn"
        @input="onOpacity"
      />
      <span class="slider-value">{{ Math.round(((uiState?.radarOpacity ?? 0) * 100)) }}%</span>
    </div>
  </fieldset>
</template>

<style scoped>
.control-card {
  margin: 0;
  padding: 0;
  border: 0;
  display: grid;
  gap: 0.75rem;
}
.control-legend {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.legend-copy {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.legend-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #f8fafc;
}
.legend-subtitle {
  font-size: 0.75rem;
  color: rgba(226, 232, 240, 0.68);
}
.toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.toggle-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.toggle-track {
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
.toggle-handle {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #f8fafc;
  transform: translateX(0);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.45);
}
.toggle:focus-within .toggle-track {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
}
.toggle-input:checked + .toggle-track {
  background: rgba(96, 165, 250, 0.55);
  border-color: rgba(59, 130, 246, 0.7);
}
.toggle-input:checked + .toggle-track .toggle-handle {
  transform: translateX(20px);
  background: #0f172a;
}
.slider {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.2s ease;
}
.slider[data-disabled="true"] {
  opacity: 0.5;
}
.slider-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(226, 232, 240, 0.7);
}
.slider-input {
  width: 100%;
  accent-color: #60a5fa;
}
.slider-input:disabled {
  accent-color: rgba(148, 163, 184, 0.5);
}
.slider-input::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.4);
}
.slider-input::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #f8fafc;
  border: 2px solid #60a5fa;
  margin-top: -4px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.4);
}
.slider-input:disabled::-webkit-slider-thumb {
  border-color: rgba(148, 163, 184, 0.6);
  background: rgba(226, 232, 240, 0.8);
}
.slider-input::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.4);
}
.slider-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #f8fafc;
  border: 2px solid #60a5fa;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.4);
}
.slider-input:disabled::-moz-range-thumb {
  border-color: rgba(148, 163, 184, 0.6);
  background: rgba(226, 232, 240, 0.8);
}
.slider-value {
  font-variant-numeric: tabular-nums;
  font-size: 0.85rem;
  color: #f1f5f9;
}
</style>

