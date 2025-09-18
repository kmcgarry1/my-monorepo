<script setup lang="ts">
import { reactive, computed, ref, watch, onMounted } from 'vue'
import type { Enemy, Environment } from './types'
import BaseDetailsForm from './components/BaseDetailsForm.vue'
import EnemyForm from './components/EnemyForm.vue'
import EnvironmentForm from './components/EnvironmentForm.vue'
import StatblockPreview from './components/StatblockPreview.vue'
import Toolbar from './components/Toolbar.vue'
import PrintableStatblock from './components/PrintableStatblock.vue'
import GlossaryDrawer from './components/GlossaryDrawer.vue'
import { save as persistSave, load as persistLoad, hasSaved } from './lib/persist'
import { AcidBurrower, RagingRiver } from './lib/presets'
import { applyTheme, getSavedTheme, saveTheme, type Theme } from './lib/theme'

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

// Proxies for shared fields
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
  // apply saved/theme preference
  setTheme(getSavedTheme())
  const data = persistLoad()
  if (data) {
    sbType.value = data.sbType
    Object.assign(enemy, data.enemy)
    Object.assign(environment, data.environment)
  }
})
</script>

<template>
  <div class="app" style="max-width: 1100px; margin: 2rem auto; padding: 0 1rem;">
    <header class="header">
      <h1 style="margin: 0; font-size: 1.6rem;">Daggerheart Statblock Builder</h1>
      <p style="margin:.25rem 0 0; color: var(--muted,#666);">Create Enemy or Environment statblocks. Shared fields + type-specific details.</p>
    </header>
    <Toolbar :sbType="sbType" :enemy="enemy" :environment="environment" :theme="theme" @update:theme="setTheme" @reset="resetAll" @load-preset="loadPreset" class="toolbar topbar" />

    <div class="layout">
      <div class="editor-col">
        <BaseDetailsForm
          v-model:sbType="sbType"
          v-model:name="name"
          v-model:tier="tier"
          v-model:description="description"
          v-model:traits="traits"
        />

        <EnemyForm v-if="sbType==='enemy'" :enemy="enemy" />
        <EnvironmentForm v-else :environment="environment" />
      </div>
      <div class="preview-col">
        <StatblockPreview :sbType="sbType" :enemy="enemy" :environment="environment" />
      </div>
    </div>

    <div class="print-only">
      <PrintableStatblock :sbType="sbType" :enemy="enemy" :environment="environment" />
    </div>
    <GlossaryDrawer />
  </div>
</template>

<style scoped>
:root { --muted: #666; }
@media (prefers-color-scheme: dark) {
  :root { --muted: #aaa; }
}
</style>
