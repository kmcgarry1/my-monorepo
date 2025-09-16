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
  <fieldset class="control">
    <div class="row">
      <button class="btn" type="button" @click="togglePlay">{{ uiState?.playing ? 'Pause' : 'Play' }}</button>
      <div class="time">t = {{ timeLabel() }}</div>
    </div>
    <input class="range" type="range" min="0" max="100" step="0.5" :value="uiState?.time" @input="onInput" />
  </fieldset>
</template>

<style scoped>
.control { margin-top: 0.5rem; display: grid; gap: 0.5rem; }
.row { display: flex; align-items: center; gap: 0.5rem; }
.btn { padding: 0.35rem 0.6rem; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }
.btn:hover { background: #f8fafc; }
.time { font-size: 0.9rem; color: #334155; }
.range { width: 100%; }
</style>
