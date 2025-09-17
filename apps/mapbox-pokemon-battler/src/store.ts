import { reactive } from 'vue'

export type OfficialArtwork = {
  front_default?: string | null
}

export type PokemonSprites = {
  front_default?: string | null
  back_default?: string | null
  other?: {
    ['official-artwork']?: OfficialArtwork | null
  } | null
}

export type PokemonBasic = {
  id: number
  name: string
  sprites: PokemonSprites
  types: { type: { name: string } }[]
  stats?: { base_stat: number; stat: { name: string } }[]
  species?: { name: string; url: string }
  minLevel?: number | null
}

type Account = { username: string | null }

export type Move = { name: string; type: string; power: number; accuracy: number }

export type PokemonInstance = PokemonBasic & {
  level: number
  moves: Move[]
}

export type BattleOutcome = 'ongoing' | 'victory' | 'defeat' | 'caught' | 'fled'

type BattleState = {
  inBattle: boolean
  wild: PokemonInstance | null
  partyIndex: number
  outcome: BattleOutcome
}

const state = reactive({
  account: { username: null } as Account,
  // Team is the active party (max 6). PC is storage.
  team: [] as PokemonInstance[],
  pc: [] as PokemonInstance[],
  battle: { inBattle: false, wild: null, partyIndex: 0, outcome: 'ongoing' } as BattleState,
  theme: 'light' as 'light' | 'dark',
  themeMode: 'auto' as 'auto' | 'light' | 'dark',
})

const defaultMovesByType: Record<string, Move[]> = {
  normal: [
    { name: 'Tackle', type: 'normal', power: 40, accuracy: 1 },
    { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 1 },
  ],
  fire: [
    { name: 'Ember', type: 'fire', power: 40, accuracy: 1 },
    { name: 'Flame Wheel', type: 'fire', power: 60, accuracy: 1 },
  ],
  water: [
    { name: 'Water Gun', type: 'water', power: 40, accuracy: 1 },
    { name: 'Bubble Beam', type: 'water', power: 65, accuracy: 1 },
  ],
  grass: [
    { name: 'Vine Whip', type: 'grass', power: 45, accuracy: 1 },
    { name: 'Razor Leaf', type: 'grass', power: 55, accuracy: 0.95 },
  ],
  electric: [
    { name: 'Thunder Shock', type: 'electric', power: 40, accuracy: 1 },
    { name: 'Spark', type: 'electric', power: 65, accuracy: 1 },
  ],
  ice: [
    { name: 'Ice Shard', type: 'ice', power: 40, accuracy: 1 },
    { name: 'Ice Fang', type: 'ice', power: 65, accuracy: 0.95 },
  ],
  fighting: [
    { name: 'Karate Chop', type: 'fighting', power: 50, accuracy: 1 },
  ],
  poison: [
    { name: 'Poison Sting', type: 'poison', power: 15, accuracy: 1 },
    { name: 'Sludge', type: 'poison', power: 65, accuracy: 1 },
  ],
  ground: [
    { name: 'Mud-Slap', type: 'ground', power: 20, accuracy: 1 },
    { name: 'Bulldoze', type: 'ground', power: 60, accuracy: 1 },
  ],
  flying: [
    { name: 'Gust', type: 'flying', power: 40, accuracy: 1 },
    { name: 'Wing Attack', type: 'flying', power: 60, accuracy: 1 },
  ],
  psychic: [
    { name: 'Confusion', type: 'psychic', power: 50, accuracy: 1 },
  ],
  bug: [
    { name: 'Bug Bite', type: 'bug', power: 60, accuracy: 1 },
  ],
  rock: [
    { name: 'Rock Throw', type: 'rock', power: 50, accuracy: 0.9 },
  ],
  ghost: [
    { name: 'Lick', type: 'ghost', power: 30, accuracy: 1 },
  ],
  dragon: [
    { name: 'Dragon Breath', type: 'dragon', power: 60, accuracy: 1 },
  ],
  dark: [
    { name: 'Bite', type: 'dark', power: 60, accuracy: 1 },
  ],
  steel: [
    { name: 'Metal Claw', type: 'steel', power: 50, accuracy: 0.95 },
  ],
  fairy: [
    { name: 'Fairy Wind', type: 'fairy', power: 40, accuracy: 1 },
  ],
}

function generateMoves(types: string[], count = 4): Move[] {
  const pool: Move[] = []
  for (const t of types) {
    pool.push(...(defaultMovesByType[t] || []))
  }
  if (pool.length === 0) pool.push(...defaultMovesByType['normal'])
  // Fill with normal moves if needed
  while (pool.length < count) pool.push(defaultMovesByType['normal'][0])
  // Pick up to 4 distinct-ish moves
  const chosen: Move[] = []
  const used = new Set<string>()
  for (const mv of pool) {
    if (chosen.length >= count) break
    if (used.has(mv.name)) continue
    chosen.push(mv)
    used.add(mv.name)
  }
  return chosen.slice(0, count)
}

function toInstance(p: PokemonBasic, level?: number): PokemonInstance {
  const types = p.types?.map((t) => t.type.name) || ['normal']
  const fallback = Math.max(3, Math.floor(3 + Math.random() * 15))
  const speciesMin = typeof p.minLevel === 'number' && Number.isFinite(p.minLevel) ? p.minLevel : null
  let lvl = level ?? fallback
  if (!level && speciesMin !== null) {
    const min = Math.max(3, speciesMin)
    const spread = Math.max(2, Math.round(min * 0.2))
    const max = Math.min(100, min + spread)
    lvl = min + Math.floor(Math.random() * (max - min + 1))
  }
  if (speciesMin !== null) lvl = Math.max(lvl, Math.max(3, speciesMin))
  return {
    ...p,
    level: lvl,
    moves: generateMoves(types),
  }
}

export function useStore() {
  return {
    theme: state.theme,
    themeMode: state.themeMode,
    account: state.account,
    team: state.team,
    pc: state.pc,
    battle: state.battle,
    initFromStorage() {
      try {
        const raw = localStorage.getItem('mpb_state')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed.account) state.account.username = parsed.account.username
          // Migrate legacy 'caught' array into team/pc
          if (Array.isArray(parsed.caught)) {
            const all: PokemonInstance[] = []
            for (const p of parsed.caught) all.push(p.level && p.moves ? p : toInstance(p))
            state.team.push(...all.slice(0, 6))
            state.pc.push(...all.slice(6))
          }
          if (Array.isArray(parsed.team)) {
            for (const p of parsed.team) state.team.push(p.level && p.moves ? p : toInstance(p))
          }
          if (Array.isArray(parsed.pc)) {
            for (const p of parsed.pc) state.pc.push(p.level && p.moves ? p : toInstance(p))
          }
          if (parsed.theme === 'dark' || parsed.theme === 'light') state.theme = parsed.theme
          if (parsed.themeMode === 'auto' || parsed.themeMode === 'light' || parsed.themeMode === 'dark') state.themeMode = parsed.themeMode
        }
      } catch {}
      // apply theme on init
      try {
        document.documentElement.classList.toggle('dark', state.theme === 'dark')
      } catch {}
    },
    persist() {
      try {
        localStorage.setItem(
          'mpb_state',
          JSON.stringify({ account: state.account, team: state.team, pc: state.pc, theme: state.theme, themeMode: state.themeMode })
        )
      } catch {}
    },
    login(username: string) {
      state.account.username = username
      this.persist()
    },
    logout() {
      state.account.username = null
      state.team.splice(0)
      state.pc.splice(0)
      this.persist()
    },
    addCaught(p: PokemonBasic) {
      // Prevent duplicates across team and pc by ID (simple rule)
      if (state.team.find((x) => x.id === p.id) || state.pc.find((x) => x.id === p.id)) return
      const inst = toInstance(p)
      if (state.team.length < 6) state.team.push(inst)
      else state.pc.push(inst)
      this.persist()
    },
    startBattle(wild: PokemonBasic, partyIndex = 0) {
      state.battle.inBattle = true
      const my = state.team[partyIndex]
      const lvl = my ? Math.max(3, Math.min(50, my.level + (Math.floor(Math.random() * 5) - 2))) : undefined
      state.battle.wild = toInstance(wild, lvl)
      state.battle.partyIndex = Math.min(partyIndex, Math.max(0, state.team.length - 1))
      state.battle.outcome = 'ongoing'
    },
    setPartyIndex(i: number) {
      if (state.team.length === 0) return
      const n = ((i % state.team.length) + state.team.length) % state.team.length
      state.battle.partyIndex = n
    },
    endBattle(outcome: BattleOutcome = 'fled') {
      state.battle.outcome = outcome
      state.battle.inBattle = false
      state.battle.wild = null
    },
    setTheme(theme: 'light' | 'dark') {
      state.theme = theme
      try { document.documentElement.classList.toggle('dark', theme === 'dark') } catch {}
      this.persist()
    },
    computeTimeTheme(): 'light' | 'dark' {
      const hour = new Date().getHours()
      // Gold/Silver rough day/night split: day 6:00-17:59, night 18:00-5:59
      return hour >= 6 && hour < 18 ? 'light' : 'dark'
    },
    setThemeMode(mode: 'auto' | 'light' | 'dark') {
      state.themeMode = mode
      const next = mode === 'auto' ? this.computeTimeTheme() : (mode as 'light' | 'dark')
      this.setTheme(next)
      this.persist()
    },
    toggleThemeMode() {
      const order: Array<'auto' | 'light' | 'dark'> = ['auto', 'light', 'dark']
      const idx = order.indexOf(state.themeMode)
      const next = order[(idx + 1) % order.length]
      this.setThemeMode(next)
    },
    moveTeamToPc(index: number) {
      if (index < 0 || index >= state.team.length) return
      const [p] = state.team.splice(index, 1)
      if (p) state.pc.push(p)
      // Adjust active index if needed
      if (state.battle.partyIndex >= state.team.length) state.battle.partyIndex = Math.max(0, state.team.length - 1)
      this.persist()
    },
    movePcToTeam(index: number) {
      if (index < 0 || index >= state.pc.length) return
      if (state.team.length >= 6) return
      const [p] = state.pc.splice(index, 1)
      if (p) state.team.push(p)
      this.persist()
    },
    swapTeam(i: number, j: number) {
      if (i < 0 || j < 0 || i >= state.team.length || j >= state.team.length) return
      const tmp = state.team[i]
      state.team[i] = state.team[j]
      state.team[j] = tmp
      this.persist()
    },
  }
}
