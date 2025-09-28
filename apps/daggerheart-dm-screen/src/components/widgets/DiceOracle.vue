<script setup lang="ts">
import { reactive } from 'vue';
import { boonExamples, consequenceExamples } from '../../data/srd';
import { complicationPrompts, treasureDiscoveries } from '../../data/database';

type RollLog = {
  label: string;
  result: string;
};

const state = reactive({
  history: [] as RollLog[],
  oracle: 'Tap the dice or prompts to spark inspiration.'
});

function rollDie(sides: number, quantity = 1) {
  const rolls = Array.from({ length: quantity }, () => Math.ceil(Math.random() * sides));
  const total = rolls.reduce((sum, value) => sum + value, 0);
  const label = quantity > 1 ? `${quantity}d${sides}` : `d${sides}`;
  const detail = quantity > 1 ? `${rolls.join(' + ')} = ${total}` : `${total}`;
  pushHistory({ label, result: detail });
}

function rollDaggerheartTest() {
  const hope = Math.ceil(Math.random() * 12);
  const fear = Math.ceil(Math.random() * 12);
  const outcome = hope >= fear ? 'Hope' : 'Fear';
  const label = 'Hope vs Fear (2d12)';
  const result = `${hope} vs ${fear} → ${outcome}`;
  pushHistory({ label, result });
}

function triggerOracle(type: 'complication' | 'treasure' | 'boon' | 'consequence') {
  let result = '';
  if (type === 'complication') {
    result = complicationPrompts[Math.floor(Math.random() * complicationPrompts.length)];
  } else if (type === 'treasure') {
    result = treasureDiscoveries[Math.floor(Math.random() * treasureDiscoveries.length)];
  } else if (type === 'boon') {
    const boon = boonExamples[Math.floor(Math.random() * boonExamples.length)];
    result = `${boon.title}: ${boon.detail}`;
  } else {
    const consequence = consequenceExamples[Math.floor(Math.random() * consequenceExamples.length)];
    result = `${consequence.title}: ${consequence.detail}`;
  }
  state.oracle = result;
}

function pushHistory(entry: RollLog) {
  state.history.unshift(entry);
  state.history.splice(8);
}
</script>

<template>
  <div class="oracle">
    <section class="dice">
      <header>
        <h3>Dice Palette</h3>
        <p>Tap to roll. Results stay in the log for quick reference.</p>
      </header>
      <div class="dice__grid">
        <button type="button" @click="rollDie(20)">d20</button>
        <button type="button" @click="rollDie(12)">d12</button>
        <button type="button" @click="rollDie(10)">d10</button>
        <button type="button" @click="rollDie(8)">d8</button>
        <button type="button" @click="rollDie(6, 2)">2d6</button>
        <button type="button" @click="rollDie(4, 2)">2d4</button>
        <button type="button" class="highlight" @click="rollDaggerheartTest">Hope vs Fear</button>
      </div>
    </section>

    <section class="oracle__panel">
      <header>
        <h3>Drama Oracle</h3>
        <p>Need a twist? Ask for a complication, treasure, or dramatic swing.</p>
      </header>
      <div class="oracle__actions">
        <button type="button" @click="triggerOracle('complication')">Complication</button>
        <button type="button" @click="triggerOracle('treasure')">Discovery</button>
        <button type="button" @click="triggerOracle('boon')">Boon</button>
        <button type="button" @click="triggerOracle('consequence')">Consequence</button>
      </div>
      <p class="oracle__result">{{ state.oracle }}</p>
    </section>

    <section class="history">
      <header>
        <h3>Roll Log</h3>
        <p>Latest eight results with totals and detail.</p>
      </header>
      <ul>
        <li v-for="entry in state.history" :key="entry.result + entry.label">
          <strong>{{ entry.label }}</strong>
          <span>{{ entry.result }}</span>
        </li>
        <li v-if="!state.history.length" class="empty">No rolls yet. Try the palette!</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.oracle {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 16px;
  height: 100%;
}

section {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(8, 16, 28, 0.78);
  border: 1px solid rgba(118, 174, 255, 0.18);
  display: grid;
  gap: 12px;
}

header h3 {
  margin: 0;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

header p {
  margin: 4px 0 0;
  font-size: 0.78rem;
  color: rgba(204, 222, 255, 0.7);
}

.dice__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.dice__grid button {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(118, 174, 255, 0.28);
  background: rgba(5, 12, 24, 0.78);
  color: rgba(220, 236, 255, 0.95);
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  cursor: pointer;
}

.dice__grid button.highlight {
  grid-column: span 3;
  background: linear-gradient(135deg, rgba(118, 174, 255, 0.9), rgba(94, 219, 255, 0.65));
  color: #041220;
  box-shadow: 0 10px 24px rgba(92, 164, 255, 0.35);
}

.oracle__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.oracle__actions button {
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(118, 174, 255, 0.28);
  background: rgba(5, 12, 24, 0.78);
  color: rgba(220, 236, 255, 0.92);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
  cursor: pointer;
}

.oracle__result {
  margin: 0;
  min-height: 60px;
  font-size: 0.85rem;
  color: rgba(215, 228, 247, 0.9);
}

.history ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  overflow: auto;
}

.history li {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(5, 12, 24, 0.7);
  border: 1px solid rgba(118, 174, 255, 0.18);
  display: grid;
  gap: 4px;
}

.history li strong {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.history li span {
  font-size: 0.85rem;
  color: rgba(215, 228, 247, 0.86);
}

.history li.empty {
  text-align: center;
  color: rgba(204, 222, 255, 0.6);
  font-style: italic;
}
</style>
