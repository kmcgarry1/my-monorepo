<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { MapUiStateKey } from '../di/keys'

type UiState = {
  time: number
  playing: boolean
}

const uiState = inject(MapUiStateKey, null) as unknown as UiState | null
const rafId = ref<number | null>(null)

function tick() {
  if (!uiState || !uiState.playing) return
  uiState.time = (uiState.time + 0.5) % 100
  rafId.value = requestAnimationFrame(tick)
}

function togglePlay() {
  if (!uiState) return
  uiState.playing = !uiState.playing
  if (uiState.playing) {
    rafId.value = requestAnimationFrame(tick)
  } else if (rafId.value) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
}

function onInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  if (uiState) uiState.time = v
}

onMounted(() => {
  if (uiState?.playing) rafId.value = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (rafId.value) cancelAnimationFrame(rafId.value)
})

const timeLabel = () => (uiState ? Math.round(uiState.time) : 0)
</script>

<template>
  <fieldset class="control-card">
    <legend class="control-legend">
      <span class="legend-title">Simulation time</span>
      <button
        class="play-btn"
        type="button"
        :aria-pressed="uiState?.playing ? 'true' : 'false'"
        :class="{ 'is-active': uiState?.playing }"
        @click="togglePlay"
      >
        <span class="play-icon" aria-hidden="true"></span>
        {{ uiState?.playing ? 'Pause' : 'Play' }}
      </button>
    </legend>
    <div class="time-readout">t = {{ timeLabel() }}</div>
    <input
      class="time-slider"
      type="range"
      min="0"
      max="100"
      step="0.5"
      :value="uiState?.time"
      @input="onInput"
    />
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
.legend-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #f8fafc;
}
.play-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(15, 23, 42, 0.55);
  color: #f8fafc;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.play-btn:hover {
  background: rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.6);
}
.play-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
}
.play-btn.is-active {
  background: rgba(96, 165, 250, 0.35);
  border-color: rgba(59, 130, 246, 0.75);
}
.play-icon {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 2px;
  position: relative;
  display: inline-block;
}
.play-btn:not(.is-active) .play-icon {
  border-style: solid;
  border-width: 0.3rem 0 0.3rem 0.5rem;
  border-color: transparent transparent transparent currentColor;
}
.play-btn.is-active .play-icon {
  width: 0.7rem;
  height: 0.7rem;
}
.play-btn.is-active .play-icon::before,
.play-btn.is-active .play-icon::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0.2rem;
  background: currentColor;
  border-radius: 1px;
}
.play-btn.is-active .play-icon::before {
  left: 0;
}
.play-btn.is-active .play-icon::after {
  right: 0;
}
.time-readout {
  font-variant-numeric: tabular-nums;
  font-size: 0.9rem;
  color: rgba(226, 232, 240, 0.85);
}
.time-slider {
  width: 100%;
  accent-color: #38bdf8;
}
.time-slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.4);
}
.time-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #f8fafc;
  border: 2px solid #38bdf8;
  margin-top: -4px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.4);
}
.time-slider::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.4);
}
.time-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #f8fafc;
  border: 2px solid #38bdf8;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.4);
}
</style>
