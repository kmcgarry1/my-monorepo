<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore, type PokemonInstance, type Move } from '../../store'

const store = useStore()

type Battler = { p: PokemonInstance; hp: number; atk: number; def: number }

function buildBattler(p: PokemonInstance): Battler {
  const stats = Object.fromEntries((p.stats || []).map((s: any) => [s.stat.name, s.base_stat])) as any
  const baseHp = Math.max(35, stats.hp || 45)
  const baseAtk = Math.max(15, stats.attack || 49)
  const baseDef = Math.max(15, stats.defense || 49)
  const level = p.level || 5
  const hp = Math.floor(((baseHp * 2 * level) / 100) * 10) + level + 10
  const atk = Math.floor((baseAtk * 2 * level) / 100) + 5
  const def = Math.floor((baseDef * 2 * level) / 100) + 5
  return { p, hp, atk, def }
}

const me = computed(() => (store.caught[store.battle.partyIndex] ? buildBattler(store.caught[store.battle.partyIndex]) : null))
const foe = computed(() => (store.battle.wild ? buildBattler(store.battle.wild) : null))

const log = ref<string[]>(["A wild battle started!"])
const myTurn = ref(true)
const menu = ref<'root' | 'moves'>('root')
const foeHp = ref<number | null>(null)
const myHp = ref<number | null>(null)

function resetHpBars() {
  myHp.value = me.value?.hp ?? 0
  foeHp.value = foe.value?.hp ?? 0
}

function typeMultiplier(moveType: string, defenderTypes: string[]): number {
  const chart: Record<string, Record<string, number>> = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
    water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
    grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
    electric: { water: 2, flying: 2, grass: 0.5, electric: 0.5, dragon: 0.5, ground: 0 },
    ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
    poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
    ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
    flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
    bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
    ghost: { psychic: 2, ghost: 2, normal: 0, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
    steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
    fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
  }
  const row = chart[moveType] || {}
  let mult = 1
  for (const t of defenderTypes) mult *= row[t] ?? 1
  return mult
}

function dmgCalc(attacker: Battler, defender: Battler, move: Move) {
  const level = attacker.p.level || 5
  const stab = attacker.p.types?.some((t: any) => t.type.name === move.type) ? 1.5 : 1
  const eff = typeMultiplier(move.type, defender.p.types?.map((t: any) => t.type.name) || ['normal'])
  const base = Math.floor((((2 * level) / 5 + 2) * move.power * (attacker.atk / Math.max(1, defender.def))) / 50) + 2
  const variance = 0.85 + Math.random() * 0.15
  return Math.max(1, Math.floor(base * stab * eff * variance))
}

function chooseMove(mv: Move) {
  if (!me.value || !foe.value) return
  // Accuracy check
  if (Math.random() > (mv.accuracy ?? 1)) {
    log.value.push(`${me.value.p.name} used ${mv.name}, but it missed!`)
  } else {
    const d = dmgCalc(me.value, foe.value, mv)
    foeHp.value = Math.max(0, (foeHp.value ?? foe.value.hp) - d)
    log.value.push(`${me.value.p.name} used ${mv.name}! It dealt ${d}.`)
  }
  myTurn.value = false
  if ((foeHp.value ?? 0) <= 0) {
    log.value.push(`Wild ${foe.value.p.name} fainted!`)
    return
  }
  setTimeout(enemyTurn, 700)
}

function enemyTurn() {
  if (!me.value || !foe.value) return
  const moves = foe.value.p.moves || []
  const mv = moves[Math.floor(Math.random() * moves.length)] || { name: 'Tackle', type: 'normal', power: 40, accuracy: 1 }
  if (Math.random() > (mv.accuracy ?? 1)) {
    log.value.push(`Wild ${foe.value.p.name} used ${mv.name}, but it missed!`)
  } else {
    const d = dmgCalc(foe.value, me.value, mv)
    myHp.value = Math.max(0, (myHp.value ?? me.value.hp) - d)
    log.value.push(`Wild ${foe.value.p.name} used ${mv.name}! It dealt ${d}.`)
  }
  myTurn.value = true
}

function openMoves() { menu.value = 'moves' }
function backMenu() { menu.value = 'root' }
function run() { store.endBattle() }

resetHpBars()
</script>

<template>
  <div class="overlay" @click.self="run">
    <div class="battle">
      <div class="field">
        <div class="side foe" v-if="foe">
          <div class="info">
            <div class="name">{{ foe.p.name }}</div>
            <div class="level">Lv {{ foe.p.level }}</div>
            <div class="hpbar"><div class="hp" :style="{ width: ((foeHp ?? foe.hp)/foe.hp*100)+'%' }"></div></div>
          </div>
          <img :src="foe.p.sprites.front_default" alt="foe" class="sprite foe-sprite" />
        </div>
        <div class="side me" v-if="me">
          <div class="info">
            <div class="name">{{ me.p.name }}</div>
            <div class="level">Lv {{ me.p.level }}</div>
            <div class="hpbar"><div class="hp" :style="{ width: ((myHp ?? me.hp)/me.hp*100)+'%' }"></div></div>
          </div>
          <img :src="me.p.sprites.front_default" alt="me" class="sprite me-sprite" />
        </div>
      </div>

      <div class="box">
        <div v-if="menu==='root'" class="menu">
          <button class="btn" :disabled="!myTurn || !me" @click="openMoves">FIGHT</button>
          <button class="btn" disabled>BAG</button>
          <button class="btn" @click="$emit('open-team')">POKéMON</button>
          <button class="btn" @click="run">RUN</button>
        </div>
        <div v-else class="moves">
          <div v-for="mv in (me?.p.moves||[])" :key="mv.name">
            <button class="btn" :disabled="!myTurn" @click="chooseMove(mv)">{{ mv.name }} ({{ mv.type }})</button>
          </div>
          <button class="btn" @click="backMenu">Back</button>
        </div>
      </div>

      <div class="log">
        <div v-for="(line,i) in log" :key="i">{{ line }}</div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.battle { position: absolute; inset: 0; display: grid; grid-template-rows: 1fr auto auto; }
.field { position: relative; padding: 1rem; display: grid; grid-template-columns: 1fr 1fr; align-items: end; }
.sprite { image-rendering: pixelated; width: 96px; }
.foe-sprite { justify-self: end; }
.info { background: var(--panel-weak); border-radius: 8px; padding: 0.5rem; margin-bottom: 0.5rem; display: inline-block; }
.name { text-transform: capitalize; font-weight: 600; }
.level { font-size: 0.85rem; opacity: 0.8; }
.hpbar { width: 160px; height: 10px; background: var(--panel-border); border-radius: 6px; overflow: hidden; }
.hp { height: 100%; background: var(--success); }
.box { background: var(--panel); border-radius: 12px; margin: 0 1rem 0.5rem; padding: 0.75rem; }
.menu { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.moves { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.log { background: var(--panel-weak); border-radius: 12px; margin: 0 1rem 1rem; padding: 0.5rem 0.75rem; max-height: 120px; overflow: auto; }
.btn { padding: 0.5rem 0.75rem; border: 1px solid var(--panel-border); border-radius: 8px; background: var(--button-bg); color: var(--button-text); }
.btn:disabled { opacity: 0.6; }
</style>
