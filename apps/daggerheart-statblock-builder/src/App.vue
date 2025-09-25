<script setup lang="ts">
import BaseDetailsForm from './components/BaseDetailsForm.vue'
import EnemyForm from './components/EnemyForm.vue'
import EnvironmentForm from './components/EnvironmentForm.vue'
import StatblockPreview from './components/StatblockPreview.vue'
import Toolbar from './components/Toolbar.vue'
import PrintableStatblock from './components/PrintableStatblock.vue'
import GlossaryDrawer from './components/GlossaryDrawer.vue'
import { useStatblockBuilder } from './composables/useStatblockBuilder'

const {
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
} = useStatblockBuilder()
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

