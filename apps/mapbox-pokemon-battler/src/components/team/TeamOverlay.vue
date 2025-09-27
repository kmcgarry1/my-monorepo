<script setup lang="ts">
import { useStore, type PokemonInstance } from '../../store'
import AppButton from '../ui/AppButton.vue'
const store = useStore()
const emit = defineEmits(['close', 'inspect'])

function setActive(i: number) {
  store.setPartyIndex(i)
  emit('close')
}

function inspect(p: PokemonInstance) {
  emit('inspect', p)
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="panel team-card">
      <header class="team-header">
        <div>
          <p class="eyebrow">Active squad</p>
          <h3>Your team</h3>
        </div>
        <AppButton variant="ghost" size="sm" @click="emit('close')">Close</AppButton>
      </header>
      <div class="team-grid">
        <div class="team-row" v-for="(p,i) in store.team" :key="p.id">
          <img :src="p.sprites.front_default ?? ''" loading="lazy" decoding="async" class="team-sprite" />
          <div class="team-info">
            <div class="team-name">{{ p.name }}</div>
            <div class="team-meta">Lv {{ p.level }} • {{ p.types.map(t=>t.type.name).join(', ') }}</div>
          </div>
          <div class="team-actions">
            <AppButton variant="outline" size="sm" @click="inspect(p)">Inspect</AppButton>
            <AppButton variant="primary" size="sm" @click="setActive(i)" :disabled="store.battle.partyIndex===i">Set active</AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-card {
  max-width: min(640px, 96vw);
  display: grid;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 2rem);
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.team-header h3 {
  margin: 0.2rem 0 0;
  font-size: clamp(1.4rem, 2.6vw, 1.8rem);
}

.eyebrow {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 60%, transparent);
}

.team-grid {
  display: grid;
  gap: 0.9rem;
}

.team-row {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 0.85rem;
  align-items: center;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 96%, transparent);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 65%, transparent);
  padding: 0.75rem 1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.team-sprite {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent);
  display: block;
  padding: 0.4rem;
}

.team-info {
  display: grid;
  gap: 0.25rem;
}

.team-name {
  font-weight: 600;
  text-transform: capitalize;
}

.team-meta {
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 68%, transparent);
}

.team-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

@media (max-width: 560px) {
  .team-row {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .team-actions {
    justify-content: center;
  }
}
</style>
