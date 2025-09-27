<script setup lang="ts">
import { useStore, type PokemonInstance } from '../../store'
import AppButton from '../ui/AppButton.vue'

const store = useStore()
const emit = defineEmits(['close'])

function moveToPc(i: number) { store.moveTeamToPc(i) }
function moveToTeam(i: number) { store.movePcToTeam(i) }
function inspect(_p: PokemonInstance) {
  // Optional: could emit inspect later; for now, keep PC simple.
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="panel pc-card">
      <header class="pc-header">
        <div>
          <p class="eyebrow">Storage system</p>
          <h3>Pokémon PC</h3>
        </div>
        <AppButton variant="ghost" size="sm" @click="emit('close')">Close</AppButton>
      </header>
      <div class="pc-columns">
        <section class="pc-section">
          <h4>Team <span>({{ store.team.length }}/6)</span></h4>
          <div class="pc-list">
            <p v-if="!store.team.length" class="pc-empty">No Pokémon in team.</p>
            <article v-for="(p,i) in store.team" :key="p.id" class="pc-row">
              <img :src="p.sprites.front_default ?? ''" class="pc-sprite" />
              <div class="pc-info">
                <div class="pc-name">{{ p.name }}</div>
                <div class="pc-meta">Lv {{ p.level }} · {{ p.types.map(t=>t.type.name).join(', ') }}</div>
              </div>
              <AppButton
                variant="outline"
                size="sm"
                title="Move to PC"
                @click="moveToPc(i)"
                :disabled="store.team.length<=1 && i===store.battle.partyIndex"
              >
                To PC
              </AppButton>
            </article>
          </div>
        </section>

        <section class="pc-section">
          <h4>PC <span>({{ store.pc.length }})</span></h4>
          <div class="pc-list">
            <p v-if="!store.pc.length" class="pc-empty">No Pokémon in PC.</p>
            <article v-for="(p,i) in store.pc.slice(0,60)" :key="p.id + '-' + i" class="pc-row">
              <img :src="p.sprites.front_default ?? ''" loading="lazy" decoding="async" class="pc-sprite" />
              <div class="pc-info">
                <div class="pc-name">{{ p.name }}</div>
                <div class="pc-meta">Lv {{ p.level }} · {{ p.types.map(t=>t.type.name).join(', ') }}</div>
              </div>
              <AppButton
                variant="primary"
                size="sm"
                title="Add to Team"
                @click="moveToTeam(i)"
                :disabled="store.team.length >= 6"
              >
                To Team
              </AppButton>
            </article>
            <p v-if="store.pc.length > 60" class="pc-footnote">Showing first 60 of {{ store.pc.length }} entries.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pc-card {
  max-width: min(960px, 96vw);
  display: grid;
  gap: clamp(1.25rem, 3vw, 2rem);
  padding: clamp(1.25rem, 3vw, 2.5rem);
}

.pc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.pc-header h3 {
  margin: 0.2rem 0 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.eyebrow {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 60%, transparent);
}

.pc-columns {
  display: grid;
  gap: clamp(1rem, 3vw, 1.5rem);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.pc-section h4 {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  display: flex;
  gap: 0.35rem;
  align-items: baseline;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 92%, transparent);
}

.pc-section h4 span {
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 68%, transparent);
}

.pc-list {
  display: grid;
  gap: 0.75rem;
}

.pc-row {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 0.85rem;
  align-items: center;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 96%, transparent);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 60%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.pc-sprite {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent);
  display: block;
  padding: 0.4rem;
}

.pc-info {
  display: grid;
  gap: 0.25rem;
}

.pc-name {
  font-weight: 600;
  text-transform: capitalize;
}

.pc-meta {
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 68%, transparent);
}

.pc-empty {
  margin: 0;
  font-size: 0.9rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 70%, transparent);
}

.pc-footnote {
  margin: 0;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 62%, transparent);
}

@media (max-width: 640px) {
  .pc-row {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .pc-row > :last-child {
    justify-self: center;
  }
}
</style>
