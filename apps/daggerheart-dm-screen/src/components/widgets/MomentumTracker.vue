<script setup lang="ts">
import { reactive } from 'vue';

type Track = {
  label: string;
  value: number;
  max: number;
};

const state = reactive({
  momentum: 3,
  banked: 1,
  tracks: [
    { label: 'Party Stress', value: 2, max: 6 },
    { label: 'Heat', value: 1, max: 6 },
    { label: 'Vengeance Clock', value: 0, max: 6 }
  ] as Track[],
  sceneClock: 2,
  notes: 'The Stormbrand cultists are building toward a catastrophic summoning.'
});

function adjustMomentum(delta: number) {
  const next = Math.min(Math.max(state.momentum + delta, 0), 6);
  state.momentum = next;
}

function adjustBanked(delta: number) {
  const next = Math.min(Math.max(state.banked + delta, 0), 6);
  state.banked = next;
}

function adjustTrack(track: Track, delta: number) {
  const next = Math.min(Math.max(track.value + delta, 0), track.max);
  track.value = next;
}

function setSceneClock(value: number) {
  state.sceneClock = value;
}
</script>

<template>
  <div class="tracker">
    <section class="meter">
      <header>
        <h3>Momentum Well</h3>
        <p>The table\'s shared leverage. Spend to bend fate.</p>
      </header>
      <div class="meter__control">
        <button type="button" @click="adjustMomentum(-1)">−</button>
        <div class="meter__pips" role="meter" :aria-valuenow="state.momentum" aria-valuemin="0" aria-valuemax="6">
          <span v-for="pip in 6" :key="pip" :class="{ filled: pip <= state.momentum }"></span>
        </div>
        <button type="button" @click="adjustMomentum(1)">+</button>
      </div>
      <footer>
        <span>{{ state.momentum }} held</span>
        <div class="banked">
          <span>Banked: {{ state.banked }}</span>
          <div class="banked__controls">
            <button type="button" @click="adjustBanked(-1)">−</button>
            <button type="button" @click="adjustBanked(1)">+</button>
          </div>
        </div>
      </footer>
    </section>

    <section class="tracks">
      <header>
        <h3>Pressure Dials</h3>
        <p>Reflect stress, heat, and narrative pressure on the crew.</p>
      </header>
      <div class="tracks__list">
        <article v-for="track in state.tracks" :key="track.label" class="track">
          <header>
            <h4>{{ track.label }}</h4>
            <span>{{ track.value }} / {{ track.max }}</span>
          </header>
          <div class="track__pips">
            <span v-for="pip in track.max" :key="pip" :class="{ filled: pip <= track.value }"></span>
          </div>
          <div class="track__controls">
            <button type="button" @click="adjustTrack(track, -1)">Release</button>
            <button type="button" @click="adjustTrack(track, 1)">Raise</button>
          </div>
        </article>
      </div>
    </section>

    <section class="scene">
      <header>
        <h3>Scene Clock</h3>
        <p>When filled, a major beat crashes into the story.</p>
      </header>
      <div class="scene__segments">
        <button
          v-for="pip in 6"
          :key="pip"
          type="button"
          :class="{ active: pip <= state.sceneClock }"
          @click="setSceneClock(pip === state.sceneClock ? pip - 1 : pip)"
        ></button>
      </div>
      <textarea
        v-model="state.notes"
        rows="3"
        placeholder="What consequence is waiting to trigger?"
      ></textarea>
    </section>
  </div>
</template>

<style scoped>
.tracker {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 18px;
  height: 100%;
}

section {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(8, 16, 30, 0.78);
  border: 1px solid rgba(118, 174, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

section header h3 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

section header p {
  margin: 2px 0 0;
  font-size: 0.78rem;
  color: rgba(204, 222, 255, 0.72);
}

.meter__control {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
}

.meter__control button {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(118, 174, 255, 0.35);
  background: rgba(5, 12, 24, 0.7);
  color: #f0f6ff;
  cursor: pointer;
  font-size: 1.2rem;
}

.meter__pips {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 10px 16px;
  border-radius: 14px;
  background: rgba(12, 22, 38, 0.9);
  border: 1px solid rgba(118, 174, 255, 0.2);
}

.meter__pips span,
.track__pips span {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  background: rgba(34, 58, 92, 0.75);
  box-shadow: inset 0 0 10px rgba(118, 174, 255, 0.16);
}

.meter__pips span.filled,
.track__pips span.filled {
  background: linear-gradient(135deg, rgba(118, 174, 255, 0.9), rgba(94, 219, 255, 0.65));
  box-shadow: 0 4px 14px rgba(92, 164, 255, 0.35);
}

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: rgba(204, 222, 255, 0.8);
}

.banked {
  display: flex;
  align-items: center;
  gap: 8px;
}

.banked__controls {
  display: flex;
  gap: 6px;
}

.banked__controls button {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid rgba(118, 174, 255, 0.3);
  background: rgba(5, 12, 24, 0.7);
  color: #f0f6ff;
  cursor: pointer;
}

.tracks__list {
  display: grid;
  gap: 12px;
}

.track {
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(5, 12, 24, 0.72);
  border: 1px solid rgba(118, 174, 255, 0.16);
}

.track header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: rgba(204, 222, 255, 0.8);
}

.track__pips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24px, 1fr));
  gap: 8px;
}

.track__controls {
  display: flex;
  gap: 8px;
}

.track__controls button {
  flex: 1;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(118, 174, 255, 0.28);
  background: rgba(18, 32, 52, 0.8);
  color: rgba(220, 236, 255, 0.92);
  cursor: pointer;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.scene__segments {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.scene__segments button {
  aspect-ratio: 1;
  border-radius: 14px;
  border: 1px solid rgba(118, 174, 255, 0.22);
  background: rgba(18, 32, 52, 0.7);
  cursor: pointer;
}

.scene__segments button.active {
  background: linear-gradient(135deg, rgba(255, 167, 94, 0.85), rgba(255, 108, 160, 0.6));
  border-color: rgba(255, 167, 94, 0.55);
  box-shadow: 0 8px 22px rgba(255, 136, 141, 0.35);
}

textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(118, 174, 255, 0.25);
  background: rgba(5, 12, 24, 0.78);
  padding: 12px;
  color: inherit;
  font: inherit;
  resize: none;
}
</style>
