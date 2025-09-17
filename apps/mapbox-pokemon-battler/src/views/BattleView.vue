<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, type PokemonInstance, type Move } from '../store'

const store = useStore()
const router = useRouter()

const LOG_LIMIT = 24

const FALLBACK_MOVE: Move = { name: 'Tackle', type: 'normal', power: 40, accuracy: 1 }

type Battler = {
  name: string
  level: number
  hp: number
  maxHp: number
  atk: number
  def: number
  types: string[]
  primaryType: string
  sprite?: string | null
  backSprite?: string | null
  moves: Move[]
}

function formatName(name: string): string {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function formatMoveName(name: string): string {
  return formatName(name.replace(/-/g, ' '))
}

function copyMoves(moves: Move[] | undefined): Move[] {
  if (!moves || !moves.length) return []
  return moves.map((mv) => ({ ...mv }))
}

function toBattler(p: PokemonInstance): Battler {
  const statEntries = (p.stats ?? []).map((s) => [s.stat.name, s.base_stat] as const)
  const stats = Object.fromEntries(statEntries) as Record<string, number>
  const types = p.types?.map((t) => t.type.name) ?? ['normal']
  const level = p.level ?? 5
  return {
    name: p.name,
    level,
    maxHp: Math.max(50, Math.floor(((2 * (stats.hp ?? 45) * level) / 100) + level + 10)),
    hp: Math.max(50, Math.floor(((2 * (stats.hp ?? 45) * level) / 100) + level + 10)),
    atk: Math.max(20, Math.floor(((2 * (stats.attack ?? 49) * level) / 100) + 5)),
    def: Math.max(20, Math.floor(((2 * (stats.defense ?? 49) * level) / 100) + 5)),
    types,
    primaryType: types[0] ?? 'normal',
    sprite: p.sprites?.front_default,
    backSprite: p.sprites?.back_default || p.sprites?.front_default,
    moves: copyMoves(p.moves),
  }
}

const myMon = computed(() => {
  const current = store.team[store.battle.partyIndex]
  return current ? toBattler(current) : null
})

const wildMon = computed(() => {
  const foe = store.battle.wild
  return foe ? toBattler(foe) : null
})

const myMoves = computed(() => myMon.value?.moves ?? [])
const log = ref<string[]>([])
const myTurn = ref(true)
const selectingMove = ref(false)

const canFight = computed(() => myTurn.value && !!myMon.value && !!wildMon.value)
const canRun = computed(() => !!myMon.value && !!wildMon.value && myTurn.value)
const canCycleParty = computed(() => store.team.length > 1)
const partyLabel = computed(() => {
  if (!store.team.length) return '0 / 0'
  return `${store.battle.partyIndex + 1} / ${store.team.length}`
})
const visibleLog = computed(() => (log.value.length ? log.value.slice(-3) : ['What will you do?']))

onMounted(() => {
  resetLogForBattle()
})

watch(
  () => store.battle.wild,
  () => {
    resetLogForBattle()
  },
  { immediate: true }
)

watch(
  () => store.team.length,
  (count) => {
    if (count === 0) {
      log.value = ['You have no Pokémon ready to battle!']
    }
  }
)

watch(
  () => store.battle.partyIndex,
  () => {
    selectingMove.value = false
  }
)

function resetLogForBattle() {
  if (!store.team.length) {
    log.value = ['You have no Pokémon ready to battle!']
    return
  }
  const foe = wildMon.value
  const ally = myMon.value
  const next: string[] = []
  if (foe) next.push(`Wild ${formatName(foe.name)} appeared!`)
  if (ally) next.push(`Go! ${formatName(ally.name)}!`)
  log.value = next.length ? next : ['Prepare for battle!']
}

const chart: Record<string, Record<string, number>> = {
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

function typeMultiplier(moveType: string, defenderTypes: string[]): number {
  const row = chart[moveType] || {}
  return defenderTypes.reduce((total, type) => total * (row[type] ?? 1), 1)
}

function dmgCalc(attacker: Battler, defender: Battler, move: Move) {
  const level = attacker.level || 30
  const power = move.power ?? 40
  const ratio = attacker.atk / Math.max(1, defender.def)
  const base = Math.floor((((2 * level) / 5 + 2) * power * ratio) / 50) + 2
  const stab = attacker.types.includes(move.type) ? 1.5 : 1
  const effectiveness = typeMultiplier(move.type, defender.types)
  if (effectiveness === 0) {
    return { damage: 0, effectiveness }
  }
  const variance = 0.85 + Math.random() * 0.15
  const total = Math.max(1, Math.floor(base * stab * effectiveness * variance))
  return { damage: total, effectiveness }
}

function hpPercent(b: Battler): number {
  if (!b.maxHp) return 0
  return Math.max(0, Math.min(100, Math.round((b.hp / b.maxHp) * 100)))
}

function hpColor(b: Battler): string {
  const ratio = !b.maxHp ? 0 : b.hp / b.maxHp
  if (ratio > 0.5) return '#3bd675'
  if (ratio > 0.2) return '#facc15'
  return '#f87171'
}

function hpStyle(b: Battler) {
  return { width: `${hpPercent(b)}%`, background: hpColor(b) }
}

function chooseMove(b: Battler): Move {
  if (!b.moves.length) return { ...FALLBACK_MOVE, type: b.primaryType || FALLBACK_MOVE.type }
  return b.moves[Math.floor(Math.random() * b.moves.length)]
}

function effectivenessMessage(multiplier: number): string | null {
  if (multiplier === 0) return 'It had no effect...'
  if (multiplier >= 2) return "It's super effective!"
  if (multiplier > 1) return "It's very effective!"
  if (multiplier < 1) return "It's not very effective..."
  return null
}

function logPush(message: string) {
  if (!message) return
  log.value.push(message)
  if (log.value.length > LOG_LIMIT) {
    log.value.splice(0, log.value.length - LOG_LIMIT)
  }
}

function handleFightCommand() {
  if (!canFight.value) return
  if (myMoves.value.length <= 1) {
    const move = myMoves.value[0] || { ...FALLBACK_MOVE }
    useMove(move)
    return
  }
  selectingMove.value = true
}

function cancelMoveSelection() {
  selectingMove.value = false
}

function useMove(move: Move) {
  if (!myMon.value || !wildMon.value || !myTurn.value) return
  selectingMove.value = false
  const attacker = myMon.value
  const defender = wildMon.value
  logPush(`${formatName(attacker.name)} used ${formatMoveName(move.name)}!`)
  myTurn.value = false
  const accuracy = move.accuracy ?? 1
  if (Math.random() > accuracy) {
    logPush('But it missed!')
    myTurn.value = true
    return
  }
  const result = dmgCalc(attacker, defender, move)
  if (result.damage > 0) {
    defender.hp = Math.max(0, defender.hp - result.damage)
    logPush(`Wild ${formatName(defender.name)} took ${result.damage} damage!`)
  }
  const effMessage = effectivenessMessage(result.effectiveness)
  if (effMessage) logPush(effMessage)
  if (defender.hp <= 0) {
    logPush(`Wild ${formatName(defender.name)} fainted!`)
    myTurn.value = true
    return
  }
  setTimeout(enemyAttack, 800)
}

function enemyAttack() {
  if (!myMon.value || !wildMon.value) return
  const attacker = wildMon.value
  const defender = myMon.value
  const move = chooseMove(attacker)
  logPush(`Wild ${formatName(attacker.name)} used ${formatMoveName(move.name)}!`)
  const accuracy = move.accuracy ?? 1
  if (Math.random() > accuracy) {
    logPush('It missed!')
    myTurn.value = true
    return
  }
  const result = dmgCalc(attacker, defender, move)
  if (result.damage > 0) {
    defender.hp = Math.max(0, defender.hp - result.damage)
    logPush(`${formatName(defender.name)} took ${result.damage} damage!`)
  }
  const effMessage = effectivenessMessage(result.effectiveness)
  if (effMessage) logPush(effMessage)
  if (defender.hp <= 0) {
    logPush(`${formatName(defender.name)} fainted!`)
  }
  myTurn.value = true
}

function cycleParty(direction: number) {
  if (!store.team.length) return
  store.setPartyIndex(store.battle.partyIndex + direction)
}

function run() {
  store.endBattle()
  router.push('/')
}
</script>

<template>
  <div class="battle-screen fullscreen">
    <div class="battle-stage" role="presentation">
      <div v-if="wildMon" class="field opponent">
        <div class="status-card opponent">
          <div class="status-header">
            <span class="label name">{{ formatName(wildMon.name) }}</span>
            <span class="label">Lv {{ wildMon.level }}</span>
          </div>
          <div class="status-body">
            <span class="hp-tag">HP</span>
            <div class="hp-bar" aria-hidden="true">
              <div class="hp-fill" :style="hpStyle(wildMon)"></div>
            </div>
            <span class="hp-count">{{ wildMon.hp }} / {{ wildMon.maxHp }}</span>
          </div>
          <div class="type-row" aria-label="Wild Pokémon type">
            <span
              v-for="type in wildMon.types"
              :key="type"
              class="type-pill"
              :class="`type-${type}`"
            >{{ type }}</span>
          </div>
        </div>
        <div class="sprite-slot opponent" aria-label="Wild Pokémon sprite">
          <div class="platform opponent"></div>
          <img
            v-if="wildMon.sprite"
            :src="wildMon.sprite"
            :alt="`${formatName(wildMon.name)} sprite`"
            class="monster-sprite"
          />
        </div>
      </div>
      <div v-if="myMon" class="field player">
        <div class="sprite-slot player" aria-label="Your Pokémon sprite">
          <div class="platform player"></div>
          <img
            v-if="myMon.backSprite"
            :src="myMon.backSprite"
            :alt="`${formatName(myMon.name)} sprite`"
            class="monster-sprite"
            :class="{ mirror: !store.team[store.battle.partyIndex]?.sprites?.back_default }"
          />
        </div>
        <div class="status-card player">
          <div class="status-header">
            <span class="label name">{{ formatName(myMon.name) }}</span>
            <span class="label">Lv {{ myMon.level }}</span>
          </div>
          <div class="status-body">
            <span class="hp-tag">HP</span>
            <div class="hp-bar" aria-hidden="true">
              <div class="hp-fill" :style="hpStyle(myMon)"></div>
            </div>
            <span class="hp-count">{{ myMon.hp }} / {{ myMon.maxHp }}</span>
          </div>
          <div class="type-row" aria-label="Your Pokémon type">
            <span
              v-for="type in myMon.types"
              :key="type"
              class="type-pill"
              :class="`type-${type}`"
            >{{ type }}</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-party">No team Pokémon. Capture one to battle!</div>
    </div>

    <div class="interface">
      <div class="text-panel" role="log" aria-live="polite">
        <p v-for="(line, index) in visibleLog" :key="index">{{ line }}</p>
      </div>
      <div v-if="myMon && wildMon" class="command-panel" :data-state="selectingMove ? 'moves' : 'root'">
        <div v-if="selectingMove" class="moves-grid">
          <button
            v-for="move in myMoves"
            :key="move.name"
            class="command move"
            type="button"
            @click="useMove(move)"
          >
            <span class="move-name">{{ formatMoveName(move.name) }}</span>
            <span class="move-meta">
              <span class="type-pill" :class="`type-${move.type}`">{{ move.type }}</span>
              <span class="power">PWR {{ move.power ?? 40 }}</span>
            </span>
          </button>
          <button class="command cancel" type="button" @click="cancelMoveSelection">Back</button>
        </div>
        <div v-else class="command-grid">
          <button class="command primary" type="button" :disabled="!canFight" @click="handleFightCommand">Fight</button>
          <button class="command" type="button" disabled>Bag</button>
          <button class="command" type="button" :disabled="!canFight || !canCycleParty" @click="cycleParty(1)">Pokémon</button>
          <button class="command danger" type="button" :disabled="!canRun" @click="run">Run</button>
        </div>
      </div>
      <div class="meta-row">
        <div class="party-controls" v-if="store.team.length">
          <button class="mini" type="button" @click="cycleParty(-1)" :disabled="store.team.length <= 1">Prev</button>
          <button class="mini" type="button" @click="cycleParty(1)" :disabled="store.team.length <= 1">Next</button>
          <span class="party-label">Party {{ partyLabel }}</span>
        </div>
        <router-link to="/" class="meta-link">Back to Map</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.battle-screen {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: clamp(1rem, 2vw, 1.5rem);
  padding: clamp(1rem, 2.5vw, 2rem);
  font-family: 'Press Start 2P', 'Courier New', monospace;
  letter-spacing: 0.02em;
  color: var(--text);
  background: radial-gradient(circle at top, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0) 55%);
}

.battle-stage {
  position: relative;
  border: 4px solid #0f172a;
  border-radius: 28px;
  background: linear-gradient(180deg, #8dd0ff 0%, #bce9ff 45%, #d2fdd1 65%, #8bdc88 100%);
  box-shadow: inset 0 8px 0 rgba(255, 255, 255, 0.3), inset 0 -8px 0 rgba(0, 0, 0, 0.12), 0 18px 32px rgba(15, 23, 42, 0.28);
  padding: clamp(1.2rem, 3vw, 2.5rem);
  display: grid;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
}

.battle-stage::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.7), transparent 55%),
    radial-gradient(circle at 50% 85%, rgba(255, 255, 255, 0.5), transparent 60%);
  mix-blend-mode: screen;
  opacity: 0.35;
}

.field {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  align-items: center;
  position: relative;
  z-index: 1;
}

.field.opponent {
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
}

.field.player {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
}

.status-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(245, 234, 205, 0.9));
  border: 3px solid #111827;
  border-radius: 18px;
  padding: clamp(0.8rem, 2vw, 1.1rem);
  box-shadow: inset 0 4px 0 rgba(255, 255, 255, 0.7), inset 0 -4px 0 rgba(15, 23, 42, 0.1), 0 12px 18px rgba(15, 23, 42, 0.24);
  display: grid;
  gap: 0.6rem;
  min-width: 0;
}

.status-card .label {
  font-size: clamp(0.75rem, 1vw, 0.9rem);
  text-transform: uppercase;
}

.status-card .label.name {
  letter-spacing: 0.05em;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-body {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.75rem, 1vw, 0.85rem);
}

.hp-tag {
  font-weight: 700;
}

.hp-bar {
  position: relative;
  height: 12px;
  border: 2px solid #111827;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.1);
  overflow: hidden;
}

.hp-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 240ms var(--ease, cubic-bezier(0.2, 0.8, 0.2, 1));
}

.hp-count {
  font-weight: 700;
  font-size: clamp(0.7rem, 1vw, 0.85rem);
}

.type-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.type-pill {
  font-size: clamp(0.55rem, 0.9vw, 0.7rem);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 2px solid rgba(17, 24, 39, 0.6);
  box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.35), inset 0 -2px 0 rgba(0, 0, 0, 0.12);
}

.sprite-slot {
  position: relative;
  display: grid;
  place-items: center;
  min-height: clamp(120px, 24vw, 240px);
}

.platform {
  position: absolute;
  width: 70%;
  height: 32%;
  border-radius: 50%;
  filter: blur(1px);
  transform: translateY(45%);
}

.platform.opponent {
  background: radial-gradient(circle at 50% 50%, rgba(16, 74, 44, 0.7), rgba(16, 74, 44, 0) 70%);
}

.platform.player {
  background: radial-gradient(circle at 50% 50%, rgba(74, 54, 24, 0.6), rgba(74, 54, 24, 0) 70%);
}

.monster-sprite {
  max-width: clamp(120px, 24vw, 240px);
  width: 100%;
  image-rendering: pixelated;
  filter: drop-shadow(0 18px 12px rgba(15, 23, 42, 0.3));
  animation: float 3.2s ease-in-out infinite;
}

.monster-sprite.mirror {
  transform: scaleX(-1);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.empty-party {
  font-size: clamp(0.9rem, 1.3vw, 1.1rem);
  text-align: center;
  align-self: center;
  justify-self: center;
  background: rgba(255, 255, 255, 0.78);
  padding: 1rem 1.5rem;
  border-radius: 18px;
  border: 3px solid #111827;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.18);
}

.interface {
  display: grid;
  gap: clamp(0.75rem, 2vw, 1.2rem);
  position: relative;
  z-index: 2;
}

.text-panel {
  min-height: clamp(90px, 12vw, 130px);
  background: linear-gradient(180deg, #fffef8 0%, #f4ecd1 100%);
  border: 4px solid #111827;
  border-radius: 22px;
  padding: clamp(0.9rem, 2vw, 1.4rem);
  box-shadow: inset 0 6px 0 rgba(255, 255, 255, 0.7), inset 0 -6px 0 rgba(0, 0, 0, 0.12), 0 14px 24px rgba(15, 23, 42, 0.18);
  display: grid;
  align-content: center;
  gap: 0.45rem;
  font-size: clamp(0.8rem, 1.1vw, 0.95rem);
}

.text-panel p {
  margin: 0;
  line-height: 1.35;
}

.command-panel {
  display: grid;
  padding: clamp(0.75rem, 1.6vw, 1rem);
  border: 4px solid #111827;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(236, 222, 186, 0.92));
  box-shadow: inset 0 5px 0 rgba(255, 255, 255, 0.65), inset 0 -5px 0 rgba(0, 0, 0, 0.1), 0 12px 22px rgba(15, 23, 42, 0.18);
}

.command-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.6rem, 1.6vw, 1rem);
}

.moves-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: clamp(0.6rem, 1.6vw, 1rem);
}

.command {
  border: 3px solid #111827;
  border-radius: 18px;
  padding: clamp(0.8rem, 1.8vw, 1.15rem);
  background: linear-gradient(180deg, #ffffff 0%, #f7f0da 100%);
  font-size: clamp(0.75rem, 1vw, 0.9rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  display: grid;
  justify-items: start;
  gap: 0.4rem;
  transition: transform 160ms var(--ease, cubic-bezier(0.2, 0.8, 0.2, 1)), box-shadow 160ms var(--ease, cubic-bezier(0.2, 0.8, 0.2, 1));
  box-shadow: inset 0 3px 0 rgba(255, 255, 255, 0.65), inset 0 -3px 0 rgba(0, 0, 0, 0.14), 0 8px 18px rgba(15, 23, 42, 0.18);
}

.command:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: inset 0 3px 0 rgba(255, 255, 255, 0.75), inset 0 -3px 0 rgba(0, 0, 0, 0.18), 0 10px 22px rgba(15, 23, 42, 0.24);
}

.command:active:not(:disabled) {
  transform: translateY(0);
}

.command:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.command.primary {
  background: linear-gradient(180deg, #ffdd57 0%, #fbbf24 100%);
}

.command.danger {
  background: linear-gradient(180deg, #fda4af 0%, #f87171 100%);
}

.command.move {
  grid-template-columns: 1fr;
}

.command.cancel {
  justify-items: center;
}

.move-name {
  font-weight: 700;
  letter-spacing: 0.1em;
}

.move-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
  font-size: clamp(0.6rem, 0.9vw, 0.75rem);
}

.move-meta .type-pill {
  border-radius: 12px;
  border-width: 0;
  box-shadow: none;
}

.move-meta .power {
  font-weight: 700;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: clamp(0.7rem, 0.9vw, 0.85rem);
}

.party-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 3px solid #111827;
  border-radius: 16px;
  padding: 0.4rem 0.6rem;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
}

.party-controls .mini {
  border: 2px solid #111827;
  background: #f7f0da;
  border-radius: 12px;
  padding: 0.3rem 0.6rem;
  font-family: inherit;
  font-size: clamp(0.6rem, 0.8vw, 0.75rem);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
}

.party-controls .mini:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.party-label {
  font-weight: 700;
}

.meta-link {
  color: inherit;
  text-decoration: none;
  border-bottom: 2px solid currentColor;
  padding-bottom: 0.1rem;
}

.meta-link:hover {
  opacity: 0.8;
}

@media (max-width: 960px) {
  .battle-stage {
    grid-template-rows: repeat(2, minmax(0, 1fr));
    padding: clamp(1rem, 4vw, 1.5rem);
  }

  .field {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    gap: 1rem;
  }

  .status-card {
    order: -1;
  }

  .sprite-slot {
    min-height: clamp(110px, 32vw, 200px);
  }
}

@media (max-width: 640px) {
  .battle-screen {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .battle-stage {
    border-radius: 22px;
  }

  .command-panel {
    border-radius: 18px;
  }

  .command-grid {
    grid-template-columns: 1fr;
  }

  .moves-grid {
    grid-template-columns: 1fr;
  }

  .meta-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.6rem;
  }

  .party-controls {
    justify-content: space-between;
  }

  .meta-link {
    align-self: flex-end;
  }
}
</style>
