<script setup lang="ts">
import { reactive } from 'vue';
import {
  heroCallings,
  heroOrigins,
  loomingThreats,
  npcArchetypes,
  treasureDiscoveries
} from '../../data/database';

type ThreatState = {
  npcIndex: number;
  threatIndex: number;
  hook: string;
};

const state = reactive<ThreatState>({
  npcIndex: 0,
  threatIndex: 0,
  hook: buildHook()
});

function randomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

function rerollNPC() {
  state.npcIndex = randomIndex(npcArchetypes.length);
  state.hook = buildHook();
}

function rerollThreat() {
  state.threatIndex = randomIndex(loomingThreats.length);
  state.hook = buildHook();
}

function rerollHook() {
  state.hook = buildHook();
}

function buildHook() {
  const origin = heroOrigins[randomIndex(heroOrigins.length)];
  const calling = heroCallings[randomIndex(heroCallings.length)];
  const treasure = treasureDiscoveries[randomIndex(treasureDiscoveries.length)];
  return `A ${origin.toLowerCase()} ${calling.toLowerCase()} discovers ${treasure.toLowerCase()}.`;
}
</script>

<template>
  <div class="threats">
    <section class="card">
      <header>
        <h3>NPC Spotlight</h3>
        <p>Bring a face to life with a quick reroll.</p>
      </header>
      <article class="card__body">
        <h4>{{ npcArchetypes[state.npcIndex].name }}</h4>
        <dl>
          <div>
            <dt>Role</dt>
            <dd>{{ npcArchetypes[state.npcIndex].role }}</dd>
          </div>
          <div>
            <dt>Specialty</dt>
            <dd>{{ npcArchetypes[state.npcIndex].specialty }}</dd>
          </div>
        </dl>
        <button type="button" @click="rerollNPC">Different NPC</button>
      </article>
    </section>

    <section class="card">
      <header>
        <h3>Looming Threat</h3>
        <p>Foreshadow the danger breathing down the heroes\' necks.</p>
      </header>
      <article class="card__body">
        <h4>{{ loomingThreats[state.threatIndex].name }}</h4>
        <ul>
          <li v-for="omen in loomingThreats[state.threatIndex].omens" :key="omen">{{ omen }}</li>
        </ul>
        <button type="button" @click="rerollThreat">Different Threat</button>
      </article>
    </section>

    <section class="card">
      <header>
        <h3>Hook Seed</h3>
        <p>Blend origins, callings, and treasure for a quest spark.</p>
      </header>
      <article class="card__body">
        <p class="hook">{{ state.hook }}</p>
        <button type="button" @click="rerollHook">Remix Hook</button>
      </article>
    </section>
  </div>
</template>

<style scoped>
.threats {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 16px;
  height: 100%;
}

.card {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(8, 16, 30, 0.78);
  border: 1px solid rgba(118, 174, 255, 0.2);
  display: grid;
  gap: 12px;
}

header h3 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

header p {
  margin: 4px 0 0;
  font-size: 0.78rem;
  color: rgba(204, 222, 255, 0.68);
}

.card__body {
  display: grid;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(5, 12, 24, 0.7);
  border: 1px solid rgba(118, 174, 255, 0.16);
}

.card__body h4 {
  margin: 0;
  font-size: 1rem;
}

dl {
  margin: 0;
  display: grid;
  gap: 6px;
}

dl div {
  display: grid;
  gap: 2px;
}

dl dt {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(204, 222, 255, 0.7);
}

dl dd {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(215, 228, 247, 0.9);
}

button {
  justify-self: start;
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(118, 174, 255, 0.28);
  background: rgba(18, 32, 52, 0.8);
  color: rgba(220, 236, 255, 0.92);
  cursor: pointer;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
  font-size: 0.82rem;
  color: rgba(215, 228, 247, 0.86);
}

.hook {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(220, 236, 255, 0.92);
}
</style>
