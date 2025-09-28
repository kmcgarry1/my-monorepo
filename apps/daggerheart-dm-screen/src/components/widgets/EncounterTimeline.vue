<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

type Participant = {
  id: number;
  name: string;
  initiative: number;
  notes: string;
  focus: 'Acting' | 'Waiting' | 'Out';
};

const seedParticipants: Participant[] = [
  { id: 1, name: 'Seren the Dawnforged', initiative: 18, notes: 'Guard 3 • Keen +1', focus: 'Acting' },
  { id: 2, name: 'Mara of the Veil', initiative: 15, notes: 'Spirit +2 • Hex Sigils ready', focus: 'Waiting' },
  { id: 3, name: 'Coalition Sentry', initiative: 13, notes: 'Squad (3) • Armor 2', focus: 'Waiting' },
  { id: 4, name: 'Blazing Wight', initiative: 11, notes: 'Elemental aura • Resist Keen', focus: 'Waiting' }
];

const round = ref(1);
const spotlightIndex = ref(0);
const participants = ref<Participant[]>([...seedParticipants]);
const formState = reactive({
  name: '',
  initiative: 10,
  notes: ''
});

const orderedParticipants = computed(() =>
  [...participants.value].sort((a, b) => b.initiative - a.initiative)
);

function advanceSpotlight() {
  if (!participants.value.length) {
    return;
  }

  spotlightIndex.value = (spotlightIndex.value + 1) % participants.value.length;

  if (spotlightIndex.value === 0) {
    round.value += 1;
  }
}

function rewindSpotlight() {
  if (!participants.value.length) {
    return;
  }

  spotlightIndex.value = (spotlightIndex.value - 1 + participants.value.length) % participants.value.length;

  if (spotlightIndex.value === participants.value.length - 1) {
    round.value = Math.max(1, round.value - 1);
  }
}

function setFocus(id: number, focus: Participant['focus']) {
  participants.value = participants.value.map((entry) =>
    entry.id === id ? { ...entry, focus } : entry
  );
}

let uid = participants.value.length + 1;

function addParticipant() {
  if (!formState.name.trim()) {
    return;
  }

  participants.value = [
    ...participants.value,
    {
      id: uid++,
      name: formState.name.trim(),
      initiative: Number(formState.initiative) || 0,
      notes: formState.notes.trim(),
      focus: 'Waiting'
    }
  ];

  formState.name = '';
  formState.initiative = 10;
  formState.notes = '';
}

function removeParticipant(id: number) {
  participants.value = participants.value.filter((entry) => entry.id !== id);
  spotlightIndex.value = 0;
}
</script>

<template>
  <div class="timeline">
    <header class="timeline__status">
      <div>
        <span class="label">Round</span>
        <span class="value">{{ round }}</span>
      </div>
      <div>
        <span class="label">Spotlight</span>
        <span class="value">{{ orderedParticipants[spotlightIndex]?.name ?? '—' }}</span>
      </div>
      <div class="controls">
        <button type="button" @click="rewindSpotlight">◂</button>
        <button type="button" @click="advanceSpotlight">▸</button>
      </div>
    </header>

    <ol class="timeline__list">
      <li
        v-for="(participant, index) in orderedParticipants"
        :key="participant.id"
        :class="{
          active: index === spotlightIndex,
          waiting: participant.focus === 'Waiting',
          out: participant.focus === 'Out'
        }"
      >
        <div class="initiative">
          <span class="score">{{ participant.initiative }}</span>
          <span class="tag">Init</span>
        </div>
        <div class="details">
          <h3>{{ participant.name }}</h3>
          <p>{{ participant.notes || '—' }}</p>
          <div class="chips">
            <button type="button" @click="setFocus(participant.id, 'Acting')">Acting</button>
            <button type="button" @click="setFocus(participant.id, 'Waiting')">Waiting</button>
            <button type="button" @click="setFocus(participant.id, 'Out')">Out</button>
          </div>
        </div>
        <button type="button" class="remove" @click="removeParticipant(participant.id)">✕</button>
      </li>
    </ol>

    <form class="add" @submit.prevent="addParticipant">
      <h4>Add combatant</h4>
      <label>
        <span>Name</span>
        <input v-model="formState.name" type="text" placeholder="Sable Thorncaster" />
      </label>
      <label>
        <span>Initiative</span>
        <input v-model.number="formState.initiative" type="number" min="0" />
      </label>
      <label class="notes">
        <span>Notes</span>
        <textarea v-model="formState.notes" rows="2" placeholder="Traits, stress, momentum..." />
      </label>
      <button type="submit">Add to timeline</button>
    </form>
  </div>
</template>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
}

.timeline__status {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) auto;
  gap: 16px;
  align-items: center;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(8, 16, 30, 0.8);
  border: 1px solid rgba(118, 174, 255, 0.25);
}

.timeline__status .label {
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  color: rgba(204, 222, 255, 0.6);
}

.timeline__status .value {
  display: block;
  font-size: 1.4rem;
  font-variant-numeric: tabular-nums;
}

.controls {
  display: flex;
  gap: 8px;
}

.controls button {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(118, 174, 255, 0.35);
  background: rgba(5, 12, 24, 0.7);
  color: #f0f6ff;
  cursor: pointer;
}

.timeline__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
}

.timeline__list li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  background: rgba(8, 16, 28, 0.78);
  border: 1px solid rgba(118, 174, 255, 0.18);
  border-radius: 16px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.timeline__list li.active {
  border-color: rgba(118, 174, 255, 0.55);
  background: rgba(20, 34, 52, 0.9);
  box-shadow: inset 0 0 0 1px rgba(118, 174, 255, 0.35);
}

.timeline__list li.waiting {
  opacity: 0.85;
}

.timeline__list li.out {
  opacity: 0.4;
}

.initiative {
  display: grid;
  place-items: center;
  width: 56px;
  aspect-ratio: 1;
  border-radius: 18px;
  background: rgba(10, 18, 32, 0.82);
  border: 1px solid rgba(118, 174, 255, 0.22);
}

.initiative .score {
  font-size: 1.3rem;
}

.initiative .tag {
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  color: rgba(204, 222, 255, 0.6);
}

.details h3 {
  margin: 0 0 4px;
  font-size: 1.05rem;
}

.details p {
  margin: 0 0 10px;
  font-size: 0.85rem;
  color: rgba(215, 228, 247, 0.8);
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chips button {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(118, 174, 255, 0.3);
  background: rgba(8, 16, 30, 0.7);
  color: rgba(220, 236, 255, 0.9);
  cursor: pointer;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.remove {
  border: none;
  background: rgba(255, 96, 120, 0.12);
  color: rgba(255, 163, 187, 0.9);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}

.add {
  display: grid;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(8, 16, 28, 0.78);
  border: 1px solid rgba(118, 174, 255, 0.18);
}

.add h4 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
  color: rgba(204, 222, 255, 0.7);
}

.add label {
  display: grid;
  gap: 6px;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(204, 222, 255, 0.7);
}

.add input,
.add textarea {
  background: rgba(5, 12, 24, 0.8);
  border: 1px solid rgba(118, 174, 255, 0.28);
  border-radius: 12px;
  padding: 10px 12px;
  color: inherit;
  font: inherit;
}

.add button[type='submit'] {
  justify-self: start;
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid rgba(118, 174, 255, 0.4);
  background: rgba(24, 42, 68, 0.9);
  color: rgba(220, 236, 255, 0.95);
  cursor: pointer;
  letter-spacing: 0.1em;
}
</style>
