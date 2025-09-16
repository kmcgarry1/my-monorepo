<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../../store'

const emit = defineEmits(['open-team', 'recenter'])
const store = useStore()

const caughtCount = computed(() => store.caught.length)
const active = computed(() => store.caught[store.battle.partyIndex])
const modeLabel = computed(() => (store.themeMode || 'auto').toUpperCase())

function setActive(i: number) {
  store.setPartyIndex(i)
}
</script>

<template>
  <div class="hud">
    <div class="panel header">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div class="row" style="gap:0.5rem; align-items:center;">
          <div class="brand">PokéBattler</div>
          <div class="dot"></div>
          <div class="meta">Caught: {{ caughtCount }}</div>
        </div>
        <div class="row" style="gap:0.5rem;">
          <button class="btn" @click="store.toggleThemeMode()">Theme: {{ modeLabel }}</button>
          <button class="btn" @click="$emit('recenter')">Recenter</button>
          <button class="btn" @click="$emit('open-team')">Team</button>
        </div>
      </div>
    </div>

    <div class="panel active" v-if="active">
      <div class="row" style="gap:0.75rem; align-items:center;">
        <img :src="active.sprites.front_default" alt="active" class="sprite" />
        <div class="stack">
          <div class="name">{{ active.name }}</div>
          <div class="sub">Lv {{ active.level }} • {{ active.types.map(t=>t.type.name).join(', ') }}</div>
        </div>
      </div>
    </div>

    <div class="panel party" v-if="store.caught.length">
      <div class="party-row">
        <button
          v-for="(p,i) in store.caught"
          :key="p.id+'-'+i"
          class="party-slot"
          :class="{ active: i === store.battle.partyIndex }"
          @click="setActive(i)"
          :title="p.name"
        >
          <img :src="p.sprites.front_default" alt="p.name" />
          <span class="lvl">{{ p.level }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hud { position: absolute; top: 0.75rem; left: 0.75rem; display: grid; gap: 0.5rem; z-index: 9; }
.brand { font-weight: 700; }
.dot { width: 6px; height: 6px; background:#22c55e; border-radius: 50%; }
.meta { font-size: 0.9rem; opacity: 0.8; }
.sprite { width: 40px; height: 40px; image-rendering: pixelated; }
.name { text-transform: capitalize; font-weight: 600; }
.sub { font-size: 0.85rem; opacity: 0.8; }
.party-row { display: flex; gap: 0.4rem; }
.party-slot { position: relative; width: 44px; height: 44px; border-radius: 8px; background: var(--button-bg); border: 1px solid var(--panel-border); display: grid; place-items: center; cursor: pointer; }
.party-slot.active { outline: 2px solid #2563eb; }
.party-slot img { width: 36px; height: 36px; image-rendering: pixelated; }
.party-slot .lvl { position: absolute; bottom: -0.55rem; font-size: 0.75rem; color: #0f172a; }
.panel { background: var(--panel); border-radius: 10px; box-shadow: 0 4px 16px var(--shadow); padding: 0.5rem 0.6rem; backdrop-filter: blur(6px); }
.row { display: flex; gap: 0.5rem; }
.stack { display: grid; gap: 0.2rem; }
.btn { padding: 0.35rem 0.6rem; border: 1px solid var(--panel-border); border-radius: 8px; background: var(--button-bg); color: var(--button-text); cursor: pointer; }
.header { padding: 0.45rem 0.6rem; }
.active { padding: 0.45rem 0.6rem; }
</style>
