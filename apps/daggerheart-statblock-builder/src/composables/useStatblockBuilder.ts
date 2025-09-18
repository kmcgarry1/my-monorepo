import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { Enemy, Environment } from '../types'
import { save as persistSave, load as persistLoad } from '../lib/persist'
import { AcidBurrower, RagingRiver } from '../lib/presets'
import { applyTheme, getSavedTheme, saveTheme, type Theme } from '../lib/theme'

type StatblockKind = 'enemy' | 'environment'

type PresetKey = 'acid' | 'river'

function createDefaultEnemy(): Enemy {
  return {
    kind: 'enemy',
    name: '',
    tier: null,
    description: '',
    traits: '',
    archetype: '',
    rank: '',
    difficulty: null,
    thresholds: '',
    hp: null,
    stress: null,
    atkBonus: null,
    attacks: [],
    experience: '',
    tactics: '',
    features: []
  }
}

function createDefaultEnvironment(): Environment {
  return {
    kind: 'environment',
    name: '',
    tier: null,
    description: '',
    traits: '',
    archetype: '',
    category: '',
    difficulty: null,
    impulses: '',
    potential: '',
    prompts: '',
    features: []
  }
}

function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

export function useStatblockBuilder() {
  const sbType = ref<StatblockKind>('enemy')
  const enemy = reactive<Enemy>(createDefaultEnemy())
  const environment = reactive<Environment>(createDefaultEnvironment())
  const theme = ref<Theme>('system')

  const name = computed({
    get: () => (sbType.value === 'enemy' ? enemy.name : environment.name),
    set: (value: string) => {
      if (sbType.value === 'enemy') {
        enemy.name = value
      } else {
        environment.name = value
      }
    }
  })

  const tier = computed({
    get: () => (sbType.value === 'enemy' ? enemy.tier : environment.tier),
    set: (value: number | null) => {
      if (sbType.value === 'enemy') {
        enemy.tier = value
      } else {
        environment.tier = value
      }
    }
  })

  const description = computed({
    get: () => (sbType.value === 'enemy' ? enemy.description : environment.description),
    set: (value: string) => {
      if (sbType.value === 'enemy') {
        enemy.description = value
      } else {
        environment.description = value
      }
    }
  })

  const traits = computed({
    get: () => (sbType.value === 'enemy' ? enemy.traits : environment.traits),
    set: (value: string) => {
      if (sbType.value === 'enemy') {
        enemy.traits = value
      } else {
        environment.traits = value
      }
    }
  })

  function resetEnemy() {
    Object.assign(enemy, createDefaultEnemy())
  }

  function resetEnvironment() {
    Object.assign(environment, createDefaultEnvironment())
  }

  function resetAll() {
    sbType.value = 'enemy'
    resetEnemy()
    resetEnvironment()
  }

  function setTheme(next: Theme) {
    theme.value = next
    saveTheme(next)
    applyTheme(next)
  }

  function loadPreset(which: PresetKey) {
    if (which === 'acid') {
      sbType.value = 'enemy'
      Object.assign(enemy, clone(AcidBurrower))
      return
    }

    sbType.value = 'environment'
    Object.assign(environment, clone(RagingRiver))
  }

  watch(
    [sbType, enemy, environment],
    () => {
      persistSave({
        version: 1,
        sbType: sbType.value,
        enemy: enemy as Enemy,
        environment: environment as Environment
      })
    },
    { deep: true }
  )

  onMounted(() => {
    setTheme(getSavedTheme())

    const saved = persistLoad()
    if (saved) {
      sbType.value = saved.sbType
      Object.assign(enemy, saved.enemy)
      Object.assign(environment, saved.environment)
    }
  })

  return {
    sbType,
    enemy,
    environment,
    name,
    tier,
    description,
    traits,
    theme,
    setTheme,
    resetAll,
    loadPreset
  }
}
