<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '../../store'
import AppButton from '../ui/AppButton.vue'

const store = useStore()
const open = ref(false)
const team = computed(() => store.team)
const activeIndex = computed(() => store.battle.partyIndex)

const emit = defineEmits(['open-team', 'open-pc', 'recenter'])

function toggle() { open.value = !open.value }
function setActive(i: number) { store.setPartyIndex(i); open.value = false }
function openTeam() { emit('open-team'); open.value = false }
function openPc() { emit('open-pc'); open.value = false }
function recenter() { emit('recenter'); open.value = false }
function toggleTheme() { store.toggleThemeMode(); open.value = false }
</script>

<template>
  <div class="nav-dock">
    <Transition name="sheet">
      <section v-if="open" class="party-sheet" aria-label="Active party">
        <header class="party-header">
          <div>
            <p class="eyebrow">Active party</p>
            <h4>Tap a partner to lead</h4>
          </div>
          <AppButton variant="ghost" size="sm" @click="openTeam">Manage</AppButton>
        </header>
        <div class="party-grid" role="list">
          <button
            v-for="(p,i) in team"
            :key="p.id+'-'+i"
            role="listitem"
            class="party-chip"
            :class="{ active: i === activeIndex }"
            @click="setActive(i)"
          >
            <img :src="p.sprites.front_default ?? ''" :alt="p.name" class="party-chip__sprite" />
            <div class="party-chip__info">
              <span class="party-chip__name">{{ p.name }}</span>
              <span class="party-chip__meta">Lv {{ p.level }}</span>
            </div>
          </button>
        </div>
      </section>
    </Transition>

    <nav class="bottom-bar" aria-label="Map actions">
      <button class="nav-button" type="button" @click="toggle" :aria-pressed="open">Party</button>
      <button class="nav-button" type="button" @click="openTeam">Team</button>
      <div class="fab-container">
        <button class="fab" type="button" @click="recenter" aria-label="Recenter on player">
          <span class="fab-icon">●</span>
          <span class="fab-label">Focus</span>
        </button>
      </div>
      <button class="nav-button" type="button" @click="openPc">PC</button>
      <button class="nav-button" type="button" @click="toggleTheme">Theme</button>
    </nav>
  </div>
</template>

<style scoped>
.nav-dock {
  position: absolute;
  inset-inline: clamp(0.75rem, 6vw, 4rem);
  bottom: clamp(0.75rem, 3.5vw, 2.5rem);
  display: grid;
  gap: 0.75rem;
  z-index: 90;
}

.party-sheet {
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 96%, transparent);
  border-radius: var(--radius-xl);
  box-shadow: var(--md-sys-elevation-level3);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 70%, transparent);
  padding: clamp(1rem, 3vw, 1.5rem);
  backdrop-filter: blur(var(--blur));
  display: grid;
  gap: clamp(0.8rem, 2vw, 1.25rem);
}

.party-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.party-header h4 {
  margin: 0.2rem 0 0;
  font-size: 1.05rem;
}

.eyebrow {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 60%, transparent);
}

.party-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.party-chip {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--md-sys-color-primary) 10%, var(--md-sys-color-surface-container-high));
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 60%, transparent);
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  transition: transform var(--motion-duration-short) var(--motion-easing-standard),
    box-shadow var(--motion-duration-short) var(--motion-easing-standard),
    border-color var(--motion-duration-short) var(--motion-easing-standard);
}

.party-chip:hover {
  transform: translateY(-2px);
  box-shadow: var(--md-sys-elevation-level1);
}

.party-chip:active {
  transform: translateY(0);
}

.party-chip.active {
  border-color: color-mix(in srgb, var(--md-sys-color-primary) 60%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-sys-color-primary) 22%, transparent);
}

.party-chip__sprite {
  width: 56px;
  height: 56px;
  image-rendering: pixelated;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest) 88%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline-variant) 50%, transparent);
}

.party-chip__info {
  display: grid;
  gap: 0.15rem;
  text-align: left;
}

.party-chip__name {
  font-weight: 600;
  text-transform: capitalize;
}

.party-chip__meta {
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 70%, transparent);
}

.bottom-bar {
  display: grid;
  grid-template-columns: repeat(2, minmax(72px, 1fr)) auto repeat(2, minmax(72px, 1fr));
  align-items: center;
  background: color-mix(in srgb, var(--md-sys-color-surface-container) 96%, transparent);
  border-radius: 999px;
  padding: 0.5rem;
  box-shadow: var(--md-sys-elevation-level2);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 70%, transparent);
  backdrop-filter: blur(var(--blur));
  gap: 0.25rem;
}

.nav-button {
  border: none;
  background: transparent;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 85%, transparent);
  border-radius: var(--radius-lg);
  padding: 0.55rem 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background var(--motion-duration-short) var(--motion-easing-standard),
    color var(--motion-duration-short) var(--motion-easing-standard);
}

.nav-button:hover {
  background: color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent);
}

.nav-button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent);
  outline-offset: 2px;
}

.nav-button[aria-pressed='true'] {
  color: var(--md-sys-color-primary);
}

.fab-container {
  position: relative;
  display: grid;
  place-items: center;
  padding-inline: clamp(0.5rem, 2vw, 1.25rem);
}

.fab {
  position: relative;
  min-width: 72px;
  min-height: 72px;
  border-radius: 999px;
  border: none;
  background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--md-sys-color-primary) 88%, white 12%) 0%, var(--md-sys-color-primary) 100%);
  color: var(--md-sys-color-on-primary);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: grid;
  gap: 0.2rem;
  justify-items: center;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  box-shadow: var(--md-sys-elevation-level3);
  transition: transform var(--motion-duration-short) var(--motion-easing-emphasized),
    box-shadow var(--motion-duration-short) var(--motion-easing-standard);
}

.fab:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 32px rgba(8, 8, 12, 0.35);
}

.fab:active {
  transform: translateY(-1px);
}

.fab:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--md-sys-color-on-primary) 60%, transparent);
  outline-offset: 3px;
}

.fab-icon {
  font-size: 0.8rem;
}

.fab-label {
  font-size: 0.72rem;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(24px);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity var(--motion-duration-medium) var(--motion-easing-emphasized),
    transform var(--motion-duration-medium) var(--motion-easing-emphasized);
}
</style>
