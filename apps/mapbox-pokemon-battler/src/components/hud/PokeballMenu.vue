<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '../../store'

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

function posStyle(angleDeg: number, r: number, i?: number) {
  const rad = (angleDeg * Math.PI) / 180
  const x = Math.cos(rad) * r
  const y = Math.sin(rad) * r
  const style: Record<string, string> = { '--x': `${x}px`, '--y': `${y}px` }
  if (typeof i === 'number') style['--i'] = String(i)
  return style
}

function teamAngle(i: number, n: number) {
  if (n <= 1) return -90
  const span = Math.min(160, Math.max(70, n * 26))
  const start = -90 - span / 2
  const step = span / (n - 1)
  return start + i * step
}
</script>

<template>
  <div class="pokeball-menu">
    <div class="radial" :class="{ open }" aria-hidden="true">
      <!-- Decorative rings -->
      <div v-if="open" class="ring ring-outer" />
      <div v-if="open" class="ring ring-inner" />
      <!-- Action ring -->
      <button v-if="open" class="radial-item action team"   :style="posStyle(-150, 100, 0)" @click="openTeam"  title="Team"   aria-label="Open Team">TEAM</button>
      <button v-if="open" class="radial-item action pc"     :style="posStyle( -30, 100, 1)" @click="openPc"    title="PC"     aria-label="Open PC">PC</button>
      <button v-if="open" class="radial-item action center" :style="posStyle( -90, 100, 2)" @click="recenter"  title="Recenter" aria-label="Recenter">GO</button>
      <button v-if="open" class="radial-item action theme"  :style="posStyle(-210, 100, 3)" @click="toggleTheme" title="Theme"  aria-label="Toggle Theme">DAY</button>

      <!-- Team ring (icons in an arc above) -->
      <button
        v-for="(p,i) in team"
        :key="p.id+'-'+i"
        v-show="open"
        class="radial-item slot"
        :class="i===activeIndex ? 'active' : ''"
        :style="posStyle(teamAngle(i, team.length), 170, i)"
        @click="setActive(i)"
        :title="p.name"
        :aria-label="'Set active ' + p.name"
      >
        <img :src="p.sprites.front_default" :alt="p.name" class="w-14 h-14 [image-rendering:pixelated]" />
      </button>
    </div>

    <button class="pokeball" aria-label="Open menu" @click="toggle" :aria-expanded="open">
      <span class="sr-only">Menu</span>
    </button>
  </div>
</template>

<style scoped>
.pokeball-menu { position: absolute; left: 50%; transform: translateX(-50%); bottom: clamp(0.75rem, 4vh, 1.25rem); z-index: 100; display: grid; gap: 0.5rem; justify-items: center; }
.radial { position: relative; width: 0; height: 0; pointer-events: none; }
.ring { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); border-radius: 50%; opacity: 0.6; pointer-events: none; }
.ring-outer { width: 300px; height: 300px; border: 3px dashed var(--panel-border); background: radial-gradient(circle at center, transparent 62%, rgba(0,0,0,0.06) 63% 100%); }
.ring-inner { width: 210px; height: 210px; border: 3px solid var(--panel-border); opacity: 0.5; }

.radial-item { position: absolute; left: 50%; top: 50%; width: 56px; height: 56px; border-radius: 999px; display: grid; place-items: center; pointer-events: auto; font-weight: 900; letter-spacing: 0.5px; user-select: none; opacity: 0;
  transform: translate(-50%, -50%) translate(var(--x, 0), var(--y, 0)) scale(0.85);
  transition: transform var(--dur-fast) var(--ease), opacity var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
  transition-delay: calc(var(--i, 0) * 30ms);
}
.radial.open .radial-item { opacity: 1; transform: translate(-50%, -50%) translate(var(--x, 0), var(--y, 0)) scale(1); }

.action { background: var(--panel); color: var(--text); border: 3px solid var(--panel-border); box-shadow: inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.2); }
.action:hover { box-shadow: inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.12), 0 12px 22px rgba(0,0,0,0.24); }
.action:active { box-shadow: inset 0 4px 10px rgba(0,0,0,0.25), inset 0 -2px 0 rgba(255,255,255,0.2), 0 6px 16px rgba(0,0,0,0.2); }
.action.team { background: var(--accent); border-color: var(--accent); color: #fff; }
.action.pc { background: #8b5cf6; border-color: #7c3aed; color: #fff; }
.action.center { background: #22c55e; border-color: #16a34a; color: #073b1a; }
.action.theme { background: #f59e0b; border-color: #d97706; color: #251a00; }

.slot { background: var(--button-bg); border: 3px solid var(--panel-border); box-shadow: inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.15); width: 72px; height: 72px; }
.slot:hover { box-shadow: inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.2); }
.slot.active { outline: 3px solid #2563eb; outline-offset: 2px; }

.pokeball { width: 64px; height: 64px; border-radius: 50%; border: 4px solid #111; position: relative; background: linear-gradient(180deg, #ef4444 0 49%, #111 49% 51%, #fff 51% 100%); box-shadow: 0 10px 22px rgba(0,0,0,0.35); transition: transform var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease); font-weight: 900; }
.pokeball:hover { transform: translateY(-2px) rotate(-6deg); box-shadow: 0 14px 28px rgba(0,0,0,0.38); }
.pokeball:active { transform: translateY(0) rotate(-2deg); }
.pokeball::after { content: ''; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 4px solid #111; box-shadow: inset 0 0 0 2px #ddd; }

.fade-enter-active, .fade-leave-active { transition: opacity 120ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
