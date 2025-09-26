<script setup lang="ts">
import { AppCard } from '@my-monorepo/ui'
import WizardBuilder from './components/WizardBuilder.vue'
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
  archetype,
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
  <div class="mx-auto max-w-6xl px-4 py-6">
    <header class="mb-3">
      <h1 class="m-0 text-xl font-semibold">Daggerheart Statblock Builder</h1>
      <p class="m-0 mt-1 text-[color:var(--muted)]">Create Enemy or Environment statblocks. Shared fields + type-specific details.</p>
    </header>

    <Toolbar :sbType="sbType" :enemy="enemy" :environment="environment" :theme="theme" @update:theme="setTheme" @reset="resetAll" @load-preset="loadPreset" class="toolbar topbar" />

    <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
      <div>
        <AppCard variant="elevated" padding="lg" class="h-full">
          <WizardBuilder
            v-model:sbType="sbType"
            v-model:name="name"
            v-model:archetype="archetype"
            v-model:tier="tier"
            v-model:description="description"
            v-model:traits="traits"
            :enemy="enemy"
            :environment="environment"
          />
        </AppCard>
      </div>
      <div>
        <StatblockPreview :sbType="sbType" :enemy="enemy" :environment="environment" />
      </div>
    </div>

    <div class="print-only">
      <PrintableStatblock :sbType="sbType" :enemy="enemy" :environment="environment" />
    </div>
    <GlossaryDrawer />
  </div>
</template>

