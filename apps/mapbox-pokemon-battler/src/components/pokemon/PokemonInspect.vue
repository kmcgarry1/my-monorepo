<script setup lang="ts">
import StatsBars from './StatsBars.vue'
import type { PokemonInstance } from '../../store'
import AppButton from '../ui/AppButton.vue'

const props = defineProps<{ pokemon: PokemonInstance }>()
const emit = defineEmits(['close', 'set-active'])

function spriteUrl() {
  const sprites = props.pokemon.sprites
  return sprites.other?.['official-artwork']?.front_default || sprites.front_default || ''
}

function typeList() {
  return props.pokemon.types.map((t) => t.type.name).join(', ')
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="panel inspect-card">
      <header class="inspect-header">
        <div>
          <p class="eyebrow">Pokédex entry</p>
          <h3 class="capitalize">{{ pokemon.name }}</h3>
        </div>
        <AppButton variant="ghost" size="sm" @click="emit('close')">Close</AppButton>
      </header>
      <div class="inspect-grid">
        <div class="inspect-portrait">
          <img :src="spriteUrl()" :alt="pokemon.name" loading="lazy" decoding="async" class="inspect-sprite" />
          <div class="inspect-level">Lv {{ pokemon.level }}</div>
          <div class="inspect-types">Types: {{ typeList() }}</div>
        </div>
        <div class="inspect-details">
          <StatsBars :stats="pokemon.stats" />
          <div class="inspect-moves">
            <div class="moves-title">Moves</div>
            <div class="moves-grid">
              <article
                v-for="mv in pokemon.moves"
                :key="mv.name"
                class="move-card"
                :class="'type-' + (mv.type || 'normal')"
              >
                <div class="move-name">{{ mv.name }}</div>
                <div class="move-meta">{{ mv.type }} · {{ mv.power ?? '—' }}</div>
              </article>
            </div>
          </div>
          <div class="inspect-actions">
            <AppButton variant="primary" @click="emit('set-active')">Set active</AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inspect-card {
  max-width: min(920px, 96vw);
  display: grid;
  gap: clamp(1.25rem, 3vw, 2rem);
  padding: clamp(1.5rem, 3vw, 2.5rem);
}

.inspect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.inspect-header h3 {
  margin: 0.2rem 0 0;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.eyebrow {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 60%, transparent);
}

.inspect-grid {
  display: grid;
  gap: clamp(1rem, 3vw, 1.75rem);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  align-items: start;
}

.inspect-portrait {
  display: grid;
  gap: 0.75rem;
  justify-items: center;
  text-align: center;
}

.inspect-sprite {
  width: clamp(200px, 26vw, 260px);
  aspect-ratio: 1;
  image-rendering: pixelated;
  border-radius: var(--radius-xl);
  background: color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent);
  box-shadow: 0 16px 40px rgba(8, 8, 12, 0.32);
  padding: 1.75rem;
}

.inspect-level {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 60%, transparent);
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 92%, transparent);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.inspect-types {
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 76%, transparent);
}

.inspect-details {
  display: grid;
  gap: clamp(1rem, 3vw, 1.5rem);
}

.inspect-moves {
  display: grid;
  gap: 0.65rem;
}

.moves-title {
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 70%, transparent);
}

.moves-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.move-card {
  display: grid;
  gap: 0.2rem;
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 50%, transparent);
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 96%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.move-name {
  font-weight: 600;
  text-transform: capitalize;
}

.move-meta {
  font-size: 0.8rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 72%, transparent);
}

.inspect-actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .inspect-actions {
    justify-content: center;
  }
}
</style>

