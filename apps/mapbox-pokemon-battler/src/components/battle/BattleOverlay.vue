<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { useStore, type PokemonInstance, type Move, type BattleOutcome } from '../../store'
import AppButton from '../ui/AppButton.vue'

type BattlerState = {
  instance: PokemonInstance
  maxHp: number
  currentHp: number
  attack: number
  defense: number
  speed: number
  status: 'normal' | 'fainted'
}

const typeChart: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  grass: {
    water: 2,
    ground: 2,
    rock: 2,
    fire: 0.5,
    grass: 0.5,
    poison: 0.5,
    flying: 0.5,
    bug: 0.5,
    dragon: 0.5,
    steel: 0.5,
  },
  electric: { water: 2, flying: 2, grass: 0.5, electric: 0.5, dragon: 0.5, ground: 0 },
  ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  fighting: {
    normal: 2,
    ice: 2,
    rock: 2,
    dark: 2,
    steel: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    fairy: 0.5,
    ghost: 0,
  },
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

const MAX_LOG_LINES = 18

const store = useStore()

const menu = ref<'root' | 'moves' | 'bag' | 'switch'>('root')
const log = ref<string[]>([])
const turn = ref<'player' | 'foe'>('player')
const isBusy = ref(false)
const partyStates = ref<BattlerState[]>([])
const foeState = ref<BattlerState | null>(null)
const activeIndex = ref(0)
const bag = reactive({ potion: 3, pokeball: 3 })
const result = ref<BattleOutcome>('ongoing')
const anim = reactive({ playerEnter: false, foeEnter: false, playerHit: false, foeHit: false })

let finishingBattle = false

const playerState = computed(() => partyStates.value[activeIndex.value] ?? null)
const playerMoves = computed(() => playerState.value?.instance.moves ?? [])
const playerName = computed(() => (playerState.value ? formatName(playerState.value.instance.name) : ''))
const foeName = computed(() => (foeState.value ? formatName(foeState.value.instance.name) : ''))
const foeTypesLabel = computed(() => (foeState.value ? getTypes(foeState.value.instance).join(', ') : ''))
const myTypesLabel = computed(() => (playerState.value ? getTypes(playerState.value.instance).join(', ') : ''))
const canAct = computed(
  () =>
    turn.value === 'player' &&
    !isBusy.value &&
    result.value === 'ongoing' &&
    !!playerState.value &&
    playerState.value.currentHp > 0
)
const foeHpPercent = computed(() => {
  if (!foeState.value || foeState.value.maxHp === 0) return 0
  return Math.max(0, (foeState.value.currentHp / foeState.value.maxHp) * 100)
})
const myHpPercent = computed(() => {
  if (!playerState.value || playerState.value.maxHp === 0) return 0
  return Math.max(0, (playerState.value.currentHp / playerState.value.maxHp) * 100)
})

watch(playerState, async (v) => {
  if (v) {
    anim.playerEnter = false
    await nextTick()
    requestAnimationFrame(() => (anim.playerEnter = true))
  }
})

watch(foeState, async (v) => {
  if (v) {
    anim.foeEnter = false
    await nextTick()
    requestAnimationFrame(() => (anim.foeEnter = true))
  }
})

function formatName(name: string): string {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function getTypes(p: PokemonInstance): string[] {
  return p.types?.map((t) => t.type.name) ?? ['normal']
}

function buildBattler(p: PokemonInstance): BattlerState {
  const stats = Object.fromEntries((p.stats || []).map((s: any) => [s.stat.name, s.base_stat])) as Record<string, number>
  const level = p.level ?? 5
  const baseHp = stats.hp ?? 45
  const baseAtk = stats.attack ?? 49
  const baseDef = stats.defense ?? 49
  const baseSpeed = stats.speed ?? 45
  const maxHp = Math.floor(((2 * baseHp * level) / 100) + level + 10)
  const attack = Math.floor(((2 * baseAtk * level) / 100) + 5)
  const defense = Math.floor(((2 * baseDef * level) / 100) + 5)
  const speed = Math.floor(((2 * baseSpeed * level) / 100) + 5)
  return {
    instance: p,
    maxHp,
    currentHp: maxHp,
    attack,
    defense,
    speed,
    status: 'normal',
  }
}

function typeMultiplier(moveType: string, defenderTypes: string[]): number {
  const row = typeChart[moveType] || {}
  return defenderTypes.reduce((total, type) => total * (row[type] ?? 1), 1)
}

function calculateDamage(attacker: BattlerState, defender: BattlerState, move: Move): number {
  const level = attacker.instance.level ?? 5
  const power = move.power ?? 40
  const ratio = attacker.attack / Math.max(1, defender.defense)
  const base = Math.floor((((2 * level) / 5 + 2) * power * ratio) / 50) + 2
  const stab = getTypes(attacker.instance).includes(move.type) ? 1.5 : 1
  const eff = typeMultiplier(move.type, getTypes(defender.instance))
  if (eff === 0) return 0
  const variance = 0.85 + Math.random() * 0.15
  return Math.max(1, Math.floor(base * stab * eff * variance))
}

function logPush(message: string) {
  log.value.push(message)
  if (log.value.length > MAX_LOG_LINES) log.value.shift()
}

function resetBattle() {
  finishingBattle = false
  bag.potion = 3
  bag.pokeball = 3
  menu.value = 'root'
  result.value = 'ongoing'
  isBusy.value = false
}

function initBattle() {
  if (!store.battle.inBattle || !store.battle.wild) return
  resetBattle()
  const wild = store.battle.wild
  foeState.value = buildBattler(wild)
  partyStates.value = store.team.map((p) => buildBattler(p))
  if (!partyStates.value.length) {
    log.value = ['You have no Pokémon able to battle!']
    finishBattle('defeat')
    return
  }
  const requested = Math.min(store.battle.partyIndex, partyStates.value.length - 1)
  const healthyIndex =
    requested >= 0 && partyStates.value[requested]?.currentHp > 0
      ? requested
      : partyStates.value.findIndex((p) => p.currentHp > 0)
  activeIndex.value = healthyIndex >= 0 ? healthyIndex : 0
  store.setPartyIndex(activeIndex.value)
  log.value = [
    `A wild ${formatName(wild.name)} appeared!`,
    `Go! ${formatName(partyStates.value[activeIndex.value].instance.name)}!`,
  ]
  turn.value =
    partyStates.value[activeIndex.value].speed >= (foeState.value?.speed ?? 0) ? 'player' : 'foe'
  if (turn.value === 'foe') {
    isBusy.value = true
    wait(900).then(() => enemyAction())
  }
}

async function finishBattle(outcome: BattleOutcome) {
  if (finishingBattle) return
  finishingBattle = true
  result.value = outcome
  await wait(1200)
  store.endBattle(outcome)
}

async function chooseMove(move: Move) {
  if (!canAct.value || !playerState.value || !foeState.value) return
  menu.value = 'root'
  isBusy.value = true
  await performMove(playerState.value, foeState.value, move, 'player')
  if (result.value !== 'ongoing') {
    isBusy.value = false
    return
  }
  await wait(650)
  await enemyAction()
}

async function enemyAction() {
  if (result.value !== 'ongoing' || !foeState.value || !playerState.value || playerState.value.currentHp <= 0) {
    isBusy.value = false
    turn.value = 'player'
    return
  }
  isBusy.value = true
  turn.value = 'foe'
  const moves = foeState.value.instance.moves || []
  const mv = moves[Math.floor(Math.random() * moves.length)] || { name: 'Tackle', type: 'normal', power: 40, accuracy: 1 }
  await performMove(foeState.value, playerState.value, mv, 'foe')
  if (result.value === 'ongoing' && playerState.value.currentHp > 0) {
    turn.value = 'player'
    isBusy.value = false
  } else if (result.value !== 'ongoing') {
    isBusy.value = false
  }
}

async function performMove(attacker: BattlerState, defender: BattlerState, move: Move, actor: 'player' | 'foe') {
  if (result.value !== 'ongoing') return
  const attackerLabel = actor === 'player' ? formatName(attacker.instance.name) : `Wild ${formatName(attacker.instance.name)}`
  const defenderLabel = actor === 'player' ? `Wild ${formatName(defender.instance.name)}` : formatName(defender.instance.name)
  logPush(`${attackerLabel} used ${move.name}!`)
  await wait(350)
  const accuracy = move.accuracy ?? 1
  if (Math.random() > accuracy) {
    logPush('But it missed!')
    return
  }
  const eff = typeMultiplier(move.type, getTypes(defender.instance))
  if (eff === 0) {
    logPush('It had no effect!')
    return
  }
  const dmg = calculateDamage(attacker, defender, move)
  defender.currentHp = Math.max(0, defender.currentHp - dmg)
  logPush(`${defenderLabel} took ${dmg} damage.`)
  if (actor === 'player') {
    anim.foeHit = true
    setTimeout(() => (anim.foeHit = false), 220)
  } else {
    anim.playerHit = true
    setTimeout(() => (anim.playerHit = false), 220)
  }
  if (eff > 1.5) logPush("It's super effective!")
  else if (eff < 1) logPush("It's not very effective...")
  await wait(220)
  if (defender.currentHp <= 0) {
    defender.status = 'fainted'
    if (actor === 'player') {
      logPush(`Wild ${formatName(defender.instance.name)} fainted!`)
      await wait(600)
      await finishBattle('victory')
    } else {
      logPush(`${formatName(defender.instance.name)} fainted!`)
      await wait(600)
      await handlePlayerFaint()
    }
  }
}

async function handlePlayerFaint() {
  const replacement = partyStates.value.findIndex((p) => p.currentHp > 0)
  if (replacement === -1) {
    logPush('You are out of usable Pokémon!')
    await wait(700)
    await finishBattle('defeat')
    return
  }
  activeIndex.value = replacement
  store.setPartyIndex(replacement)
  logPush(`Go! ${formatName(partyStates.value[replacement].instance.name)}!`)
  turn.value = 'player'
  isBusy.value = false
}

async function switchTo(index: number) {
  if (!canAct.value || index === activeIndex.value) return
  const target = partyStates.value[index]
  const current = playerState.value
  if (!target || target.currentHp <= 0 || !current) return
  menu.value = 'root'
  isBusy.value = true
  logPush(`Come back, ${formatName(current.instance.name)}!`)
  await wait(350)
  activeIndex.value = index
  store.setPartyIndex(index)
  logPush(`Go! ${formatName(target.instance.name)}!`)
  if (foeState.value && foeState.value.currentHp > 0) {
    await wait(600)
    await enemyAction()
  } else {
    isBusy.value = false
  }
}

function openMoves() {
  if (!canAct.value) return
  menu.value = 'moves'
}

function openBag() {
  if (!canAct.value) return
  menu.value = 'bag'
}

function openSwitch() {
  if (!canAct.value) return
  menu.value = 'switch'
}

function backMenu() {
  menu.value = 'root'
}

async function usePotion() {
  if (!canAct.value || !playerState.value) return
  if (bag.potion <= 0) {
    logPush('No Potions left!')
    return
  }
  if (playerState.value.currentHp >= playerState.value.maxHp) {
    logPush(`${playerName.value} is already at full health.`)
    return
  }
  bag.potion -= 1
  menu.value = 'root'
  isBusy.value = true
  logPush('You used a Potion!')
  await wait(300)
  const heal = Math.min(20, playerState.value.maxHp - playerState.value.currentHp)
  playerState.value.currentHp += heal
  logPush(`${playerName.value} recovered ${heal} HP.`)
  await wait(600)
  await enemyAction()
}

function computeCatchChance(target: BattlerState) {
  if (target.maxHp === 0) return 0
  const hpRatio = target.currentHp / target.maxHp
  let chance = 0.2 + (1 - hpRatio) * 0.6
  chance = Math.min(0.95, Math.max(0.1, chance))
  return chance
}

async function throwPokeball() {
  if (!canAct.value || !foeState.value || !store.battle.wild) return
  if (bag.pokeball <= 0) {
    logPush('No Poké Balls left!')
    return
  }
  bag.pokeball -= 1
  menu.value = 'root'
  isBusy.value = true
  logPush('You threw a Poké Ball!')
  await wait(700)
  const chance = computeCatchChance(foeState.value)
  if (Math.random() < chance) {
    logPush(`Gotcha! ${foeName.value} was caught!`)
    store.addCaught(store.battle.wild)
    await wait(700)
    await finishBattle('caught')
  } else {
    logPush(`Oh no! The wild ${foeName.value} broke free!`)
    await wait(600)
    await enemyAction()
  }
}

async function attemptRun() {
  if (!canAct.value || !playerState.value || !foeState.value) return
  menu.value = 'root'
  isBusy.value = true
  logPush('You tried to run away!')
  await wait(400)
  const speedAdvantage = playerState.value.speed >= foeState.value.speed
  const chance = speedAdvantage ? 0.95 : 0.6
  if (Math.random() < chance) {
    logPush('Got away safely!')
    await wait(600)
    await finishBattle('fled')
  } else {
    logPush("Can't escape!")
    await wait(600)
    await enemyAction()
  }
}

watch(
  () => store.battle.wild,
  (wild, prev) => {
    if (store.battle.inBattle && wild && wild !== prev) {
      initBattle()
    }
  }
)

initBattle()
</script>

<template>
  <div class="overlay">
    <div class="battle">
      <div class="field">
        <div class="side foe" v-if="foeState">
          <div class="info">
            <div class="name">{{ foeName }}</div>
            <div class="level">Lv {{ foeState.instance.level }}</div>
            <div class="types">Types: {{ foeTypesLabel }}</div>
            <div class="hpbar"><div class="hp" :style="{ width: foeHpPercent + '%' }"></div></div>
            <div class="hptext">{{ foeState.currentHp }} / {{ foeState.maxHp }}</div>
          </div>
          <div class="platform platform-foe"></div>
          <img :src="foeState.instance.sprites.front_default" alt="foe" class="sprite foe-sprite" :class="{ 'enter-foe': anim.foeEnter, 'hit': anim.foeHit }" />
        </div>
        <div class="side me" v-if="playerState">
          <div class="info">
            <div class="name">{{ playerName }}</div>
            <div class="level">Lv {{ playerState.instance.level }}</div>
            <div class="types">Types: {{ myTypesLabel }}</div>
            <div class="hpbar"><div class="hp" :style="{ width: myHpPercent + '%' }"></div></div>
            <div class="hptext">{{ playerState.currentHp }} / {{ playerState.maxHp }}</div>
          </div>
          <div class="platform platform-me"></div>
          <img :src="(playerState.instance.sprites as any)?.back_default || playerState.instance.sprites.front_default"
               :class="{ 'me-sprite': true, 'sprite': true, 'flipped': !(playerState.instance.sprites as any)?.back_default, 'enter-me': anim.playerEnter, 'hit': anim.playerHit }"
               alt="me" />
        </div>
      </div>

      <div class="box">
        <div v-if="menu === 'root'" class="menu">
          <AppButton variant="primary" :disabled="!canAct" @click="openMoves">FIGHT</AppButton>
          <AppButton variant="outline" :disabled="!canAct" @click="openBag">BAG</AppButton>
          <button class="btn" :disabled="!canAct" @click="openSwitch">POKéMON</button>
          <AppButton variant="outline" :disabled="!canAct" @click="attemptRun">RUN</AppButton>
        </div>
        <div v-else-if="menu === 'moves'" class="moves">
          <div v-for="mv in playerMoves" :key="mv.name">
            <button class="btn move" :disabled="!canAct" @click="chooseMove(mv)">
              <div class="move-name">{{ mv.name }}</div>
              <div class="move-meta">Type: {{ mv.type }} • Pow: {{ mv.power ?? '—' }}</div>
            </button>
          </div>
          <button class="btn" @click="backMenu">Back</button>
        </div>
        <div v-else-if="menu === 'bag'" class="bag">
          <button class="btn" :disabled="bag.potion <= 0 || !canAct" @click="usePotion">Potion ({{ bag.potion }})</button>
          <button class="btn" :disabled="bag.pokeball <= 0 || !canAct" @click="throwPokeball">
            Poké Ball ({{ bag.pokeball }})
          </button>
          <button class="btn" @click="backMenu">Back</button>
        </div>
        <div v-else class="switch">
          <div v-for="(state, idx) in partyStates" :key="state.instance.id + '-' + idx" class="switch-item">
            <button
              class="btn switch-btn"
              :class="{ active: idx === activeIndex }"
              :disabled="idx === activeIndex || state.currentHp <= 0 || !canAct"
              @click="switchTo(idx)"
            >
              <div class="switch-name">{{ formatName(state.instance.name) }}</div>
              <div class="switch-meta">Lv {{ state.instance.level }} • HP {{ state.currentHp }} / {{ state.maxHp }}</div>
            </button>
          </div>
          <button class="btn" @click="backMenu">Back</button>
        </div>
      </div>

      <div class="log">
        <div v-for="(line, i) in log" :key="i">{{ line }}</div>
      </div>
    </div>
  </div>
 </template>

<style scoped>
@reference "../../style.css";
.battle { @apply w-[min(92vw,900px)] aspect-[16/9] rounded-2xl shadow-[0_12px_28px_var(--shadow)] grid grid-rows-[1fr_auto_auto] overflow-hidden; background: linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0) 35%), var(--panel); }
.field { @apply relative p-3 h-full; }
/* Place foe top-right, player bottom-left, closer together */
.side.foe { position: absolute; top: 0.5rem; right: 0.8rem; display: grid; justify-items: end; gap: 0.25rem; }
.side.me { position: absolute; bottom: 0.8rem; left: 0.8rem; display: grid; justify-items: start; gap: 0.25rem; }
.sprite { image-rendering: pixelated; width: clamp(96px, 14vw, 140px); filter: drop-shadow(0 6px 10px rgba(0,0,0,0.35)); position: relative; z-index: 2; }
.foe-sprite {
  justify-self: end;
}
.me-sprite.flipped { transform: scaleX(-1); }
.info { @apply bg-[var(--panel-weak)] rounded-lg p-2 mb-2 grid gap-1 w-fit; }
.types { @apply text-[0.8rem] opacity-75; }
.name { @apply capitalize font-semibold; }
.level { @apply text-[0.85rem] opacity-80; }
.hpbar { @apply w-[180px] h-[10px] bg-[var(--panel-border)] rounded-md overflow-hidden; }
.hp { @apply h-full bg-[var(--success)] transition-[width] duration-[260ms] ease-out; }
.hptext { @apply text-[0.8rem] opacity-85; }
.box { @apply bg-[var(--panel)] border-t border-[var(--panel-border)] p-3; }
.menu { @apply grid grid-cols-4 gap-2; }\n.moves { @apply grid gap-2; }
.move { @apply w-full grid gap-[0.2rem] text-left; }
.move-name { @apply font-semibold; }
.move-meta { @apply text-[0.8rem] opacity-75; }
/* Move type colorways (work in light and dark) */
/* Move type colors now come from global Tailwind-applied classes in src/styles/move-types.css */
.bag { @apply grid gap-2; }
.switch { @apply grid gap-[0.4rem]; }
.switch-item { @apply contents; }
.switch-btn { @apply w-full grid gap-[0.2rem] text-left; }
.switch-btn.active { @apply outline outline-2 outline-blue-600; }
.switch-name { @apply font-semibold capitalize; }
.switch-meta { @apply text-[0.8rem] opacity-75; }
.log { @apply bg-[var(--panel-weak)] border-t border-[var(--panel-border)] px-3 py-2 max-h-[140px] overflow-auto text-[0.9rem]; }


/* Platforms under sprites */
.platform { width: clamp(100px, 16vw, 180px); height: clamp(16px, 2vw, 28px); background: radial-gradient(ellipse at center, rgba(0,0,0,0.35), rgba(0,0,0,0) 70%); filter: blur(2px); opacity: 0.5; border-radius: 999px; position: relative; z-index: 1; }
.platform::after { content: ''; position: absolute; left: -10%; right: -10%; top: -35%; height: 70%; border-radius: 999px; border-top: 2px solid rgba(0,0,0,0.25); border-left: 2px solid transparent; border-right: 2px solid transparent; }
.platform-foe { justify-self: end; }
.platform-me { justify-self: start; }

/* Entry animations */
@keyframes enterFromRight { from { opacity: 0; transform: translateX(22px); } to { opacity: 1; transform: translateX(0); } }
@keyframes enterFromLeft { from { opacity: 0; transform: translateX(-22px); } to { opacity: 1; transform: translateX(0); } }
.enter-foe { animation: enterFromRight 300ms ease-out both; }
.enter-me { animation: enterFromLeft 300ms ease-out both; }

/* Hit animation */
@keyframes hitShake { 0%{ transform: translate(0,0);} 25%{ transform: translate(-3px,0);} 50%{ transform: translate(3px,0);} 75%{ transform: translate(-2px,0);} 100%{ transform: translate(0,0);} }
.hit { animation: hitShake 220ms ease-out; }
</style>



