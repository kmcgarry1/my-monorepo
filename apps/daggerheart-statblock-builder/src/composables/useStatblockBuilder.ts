import { reactive, computed, ref, watch, onMounted } from 'vue'
import type { Enemy, Environment } from '../types'
import { save as persistSave, load as persistLoad } from '../lib/persist'
import { AcidBurrower, RagingRiver } from '../lib/presets'
import { applyTheme, getSavedTheme, saveTheme, type Theme } from '../lib/theme'
import { getRecommendations } from '../lib/recommendations'

export function useStatblockBuilder() {
  const sbType = ref<'enemy' | 'environment'>('enemy')

  const enemy = reactive<Enemy>({
    kind: 'enemy',
    name: '', tier: null, description: '', traits: '', archetype: '',
    rank: '', difficulty: null, thresholds: '', hp: null, stress: null,
    atkBonus: null, attacks: [], experience: '', tactics: '', features: []
  })

  const environment = reactive<Environment>({
    kind: 'environment',
    name: '', tier: null, description: '', traits: '', archetype: '',
    category: '', difficulty: null, impulses: '', potential: '', prompts: '',
    features: []
  })

  const name = computed({
    get: () => (sbType.value === 'enemy' ? enemy.name : environment.name),
    set: (v: string) => { sbType.value === 'enemy' ? (enemy.name = v) : (environment.name = v) }
  })
  const tier = computed<number | null>({
    get: () => (sbType.value === 'enemy' ? enemy.tier : environment.tier),
    set: (v: number | null) => { sbType.value === 'enemy' ? (enemy.tier = v) : (environment.tier = v) }
  })
  const traits = computed({
    get: () => (sbType.value === 'enemy' ? enemy.traits : environment.traits),
    set: (v: string) => { sbType.value === 'enemy' ? (enemy.traits = v) : (environment.traits = v) }
  })
  const description = computed({
    get: () => (sbType.value === 'enemy' ? enemy.description : environment.description),
    set: (v: string) => { sbType.value === 'enemy' ? (enemy.description = v) : (environment.description = v) }
  })

  // Theme state
  const theme = ref<Theme>('system')
  function setTheme(t: Theme) {
    theme.value = t
    saveTheme(t)
    applyTheme(t)
  }

  function resetAll() {
    sbType.value = 'enemy'
    Object.assign(enemy, { kind:'enemy', name:'', tier:null, description:'', traits:'', archetype:'', rank:'', difficulty:null, thresholds:'', hp:null, stress:null, atkBonus:null, attacks:[], experience:'', tactics:'', features:[] })
    Object.assign(environment, { kind:'environment', name:'', tier:null, description:'', traits:'', archetype:'', category:'', difficulty:null, impulses:'', potential:'', prompts:'', features:[] })
  }

  function loadPreset(which: 'acid'|'river') {
    if (which === 'acid') {
      sbType.value = 'enemy'
      Object.assign(enemy, JSON.parse(JSON.stringify(AcidBurrower)))
    } else {
      sbType.value = 'environment'
      Object.assign(environment, JSON.parse(JSON.stringify(RagingRiver)))
    }
  }

  // Autosave
  watch([sbType, enemy, environment], () => {
    persistSave({ version: 1, sbType: sbType.value, enemy: enemy as Enemy, environment: environment as Environment })
  }, { deep: true })

  onMounted(() => {
    setTheme(getSavedTheme())
    const data = persistLoad()
    if (data) {
      sbType.value = data.sbType
      Object.assign(enemy, data.enemy)
      Object.assign(environment, data.environment)
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
    loadPreset,
    recommendations: getRecommendations(),
  }
}
