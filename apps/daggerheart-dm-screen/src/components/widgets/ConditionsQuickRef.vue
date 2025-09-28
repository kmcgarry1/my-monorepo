<script setup lang="ts">
import { computed, ref } from 'vue';
import { conditions } from '../../data/srd';

const query = ref('');

const filteredConditions = computed(() => {
  const term = query.value.trim().toLowerCase();
  if (!term) {
    return conditions;
  }
  return conditions.filter((condition) =>
    condition.name.toLowerCase().includes(term) ||
    condition.effect.toLowerCase().includes(term)
  );
});
</script>

<template>
  <div class="conditions">
    <header>
      <h3>Conditions</h3>
      <p>Quick reference for the most common status effects in the Daggerheart SRD.</p>
    </header>
    <label class="search">
      <span>Filter</span>
      <input v-model="query" type="search" placeholder="Bleeding, Dazed..." />
    </label>
    <ul>
      <li v-for="condition in filteredConditions" :key="condition.name">
        <h4>{{ condition.name }}</h4>
        <p>{{ condition.effect }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.conditions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

header h3 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.95rem;
}

header p {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: rgba(204, 222, 255, 0.72);
}

.search {
  display: grid;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
  color: rgba(204, 222, 255, 0.7);
}

.search input {
  background: rgba(5, 12, 24, 0.78);
  border: 1px solid rgba(118, 174, 255, 0.28);
  border-radius: 12px;
  padding: 10px 12px;
  color: inherit;
  font: inherit;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
  overflow: auto;
}

li {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(8, 16, 30, 0.78);
  border: 1px solid rgba(118, 174, 255, 0.2);
}

li h4 {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
}

li p {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(215, 228, 247, 0.86);
}
</style>
