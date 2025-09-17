<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore, type PokemonInstance } from '../store'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

type Battler = {
  name: string
  hp: number
  maxHp: number
  atk: number
  def: number
  type: string
  sprite?: string | null
}

function toBattler(p: PokemonInstance): Battler {
  const statEntries = (p.stats ?? []).map((s) => [s.stat.name, s.base_stat] as const)
  const stats = Object.fromEntries(statEntries) as Record<string, number>
  return {
    name: p.name,
    maxHp: Math.max(50, (stats.hp || 45) * 2),
    hp: Math.max(50, (stats.hp || 45) * 2),
    atk: Math.max(20, stats.attack || 49),
    def: Math.max(20, stats.defense || 49),
    type: p.types?.[0]?.type?.name || 'normal',
    sprite: p.sprites?.front_default,
  }
}

const myMon = computed(() => store.team[store.battle.partyIndex] ? toBattler(store.team[store.battle.partyIndex]) : null)
const wildMon = computed(() => store.battle.wild ? toBattler(store.battle.wild) : null)
const log = ref<string[]>(["A wild battle started!"])
const myTurn = ref(true)

// Simple type chart (subset)
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

function typeMultiplier(moveType: string, defenderType: string): number {
  const row = chart[moveType] || {}
  return row[defenderType] ?? 1
}

function dmgCalc(attacker: Battler, defender: Battler, power = 40) {
  const level = 30
  // Use attacker's primary type as move type; include STAB and type effectiveness
  const moveType = attacker.type || 'normal'
  const stab = attacker.type === moveType ? 1.5 : 1
  const eff = typeMultiplier(moveType, defender.type)
  const base = Math.floor((((2 * level) / 5 + 2) * power * (attacker.atk / defender.def)) / 50) + 2
  const damage = base * stab * eff
  const variance = 0.85 + Math.random() * 0.15
  return Math.max(1, Math.floor(damage * variance))
}

function attack() {
  if (!myMon.value || !wildMon.value) return
  const d = dmgCalc(myMon.value, wildMon.value, 50)
  wildMon.value.hp = Math.max(0, wildMon.value.hp - d)
  log.value.push(`${myMon.value.name} dealt ${d} damage!`)
  myTurn.value = false
  if (wildMon.value.hp <= 0) {
    log.value.push(`Wild ${wildMon.value.name} fainted!`)
    return
  }
  setTimeout(enemyAttack, 600)
}

function enemyAttack() {
  if (!myMon.value || !wildMon.value) return
  const d = dmgCalc(wildMon.value, myMon.value, 40)
  myMon.value.hp = Math.max(0, myMon.value.hp - d)
  log.value.push(`Wild ${wildMon.value.name} dealt ${d} damage!`)
  myTurn.value = true
}

function run() {
  store.endBattle()
  router.push('/')
}
</script>

<template>
  <div class="fullscreen grid [grid-template-rows:1fr_auto]">
    <div class="grid [grid-template-columns:1fr_1fr] gap-4 p-4 items-center">
      <div class="panel" v-if="myMon">
        <h3 class="m-0 capitalize">Your {{ myMon.name }}</h3>
        <div class="row"><img :src="myMon.sprite" class="w-24 [image-rendering:pixelated]" />
          <div class="stack">
            <div>HP: {{ myMon.hp }} / {{ myMon.maxHp }}</div>
            <div>ATK: {{ myMon.atk }} DEF: {{ myMon.def }}</div>
          </div>
        </div>
        <div class="row mt-2 gap-2" v-if="$router && $route">
          <button class="btn" @click="store.setPartyIndex(store.battle.partyIndex - 1)" :disabled="!store.team.length">Prev</button>
          <button class="btn" @click="store.setPartyIndex(store.battle.partyIndex + 1)" :disabled="!store.team.length">Next</button>
          <span>Party: {{ store.battle.partyIndex + 1 }} / {{ store.team.length }}</span>
        </div>
      </div>
      <div class="panel" v-if="wildMon">
        <h3 class="m-0 capitalize">Wild {{ wildMon.name }}</h3>
        <div class="row"><img :src="wildMon.sprite" class="w-24 [image-rendering:pixelated]" />
          <div class="stack">
            <div>HP: {{ wildMon.hp }} / {{ wildMon.maxHp }}</div>
            <div>ATK: {{ wildMon.atk }} DEF: {{ wildMon.def }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel rounded-t-xl">
      <div class="row justify-between items-center">
        <div class="row gap-3">
          <button class="btn" :disabled="!myTurn || !myMon || !wildMon" @click="attack">Attack</button>
          <button class="btn" @click="run">Run</button>
        </div>
        <router-link to="/" class="btn">Back to Map</router-link>
      </div>
      <div class="mt-3 max-h-[160px] overflow-auto">
        <div v-if="!myMon">No team Pokémon. Capture one to battle!</div>
        <div v-for="(line,i) in log" :key="i">{{ line }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

