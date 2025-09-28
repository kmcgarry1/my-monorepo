<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  boonExamples,
  challengeRatings,
  consequenceExamples,
  damageTypes,
  domains,
  progressTracks
} from '../../data/srd';

const tabs = [
  { id: 'domains', label: 'Domains' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'damage', label: 'Damage' },
  { id: 'boons', label: 'Boons & Consequences' }
] as const;

const activeTab = ref<typeof tabs[number]['id']>('domains');

const tabContent = computed(() => {
  switch (activeTab.value) {
    case 'domains':
      return 'domains';
    case 'challenges':
      return 'challenges';
    case 'damage':
      return 'damage';
    default:
      return 'boons';
  }
});
</script>

<template>
  <div class="library">
    <header>
      <h3>SRD Library</h3>
      <p>Curated snapshots from the Daggerheart SRD to keep your scene moving.</p>
    </header>
    <nav class="tabs" aria-label="SRD sections">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="{ active: tab.id === activeTab }"
        :aria-pressed="tab.id === activeTab"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <section v-if="tabContent === 'domains'" class="panel">
      <article v-for="domain in domains" :key="domain.name">
        <h4>{{ domain.name }}</h4>
        <p>{{ domain.description }}</p>
      </article>
      <article>
        <h4>Progress Tracks</h4>
        <ul>
          <li v-for="track in progressTracks" :key="track.name">
            <strong>{{ track.name }}:</strong>
            <span>{{ track.description }}</span>
          </li>
        </ul>
      </article>
    </section>

    <section v-else-if="tabContent === 'challenges'" class="panel">
      <article>
        <h4>Challenge Ratings</h4>
        <table>
          <thead>
            <tr>
              <th scope="col">Rating</th>
              <th scope="col">Target</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rating in challengeRatings" :key="rating.label">
              <th scope="row">{{ rating.label }}</th>
              <td>{{ rating.targetNumber }}</td>
              <td>{{ rating.notes }}</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>

    <section v-else-if="tabContent === 'damage'" class="panel">
      <article>
        <h4>Damage Types</h4>
        <div class="chips">
          <span v-for="type in damageTypes" :key="type">{{ type }}</span>
        </div>
      </article>
    </section>

    <section v-else class="panel">
      <article>
        <h4>Boon Sparks</h4>
        <ul>
          <li v-for="boon in boonExamples" :key="boon.title">
            <strong>{{ boon.title }}:</strong>
            <span>{{ boon.detail }}</span>
          </li>
        </ul>
      </article>
      <article>
        <h4>Consequences</h4>
        <ul>
          <li v-for="consequence in consequenceExamples" :key="consequence.title">
            <strong>{{ consequence.title }}:</strong>
            <span>{{ consequence.detail }}</span>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<style scoped>
.library {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
}

header h3 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

header p {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: rgba(204, 222, 255, 0.7);
}

.tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.tabs button {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(118, 174, 255, 0.28);
  background: rgba(8, 16, 30, 0.75);
  color: rgba(220, 236, 255, 0.9);
  cursor: pointer;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.tabs button.active {
  background: linear-gradient(135deg, rgba(118, 174, 255, 0.9), rgba(94, 219, 255, 0.6));
  color: #041220;
  box-shadow: 0 10px 24px rgba(92, 164, 255, 0.35);
}

.panel {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(8, 16, 28, 0.78);
  border: 1px solid rgba(118, 174, 255, 0.18);
  overflow: auto;
}

.panel article {
  display: grid;
  gap: 8px;
}

.panel h4 {
  margin: 0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.panel p,
.panel span,
.panel td {
  font-size: 0.8rem;
  color: rgba(215, 228, 247, 0.86);
}

.panel table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.panel th,
.panel td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(118, 174, 255, 0.16);
  text-align: left;
}

.panel th {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: rgba(204, 222, 255, 0.7);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chips span {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(118, 174, 255, 0.28);
  background: rgba(5, 12, 24, 0.7);
  letter-spacing: 0.08em;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

li {
  display: grid;
  gap: 2px;
}

strong {
  color: rgba(220, 236, 255, 0.95);
}
</style>
