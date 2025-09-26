<script setup lang="ts">
import { computed } from 'vue'
import { toJSONBlob, toMarkdown, downloadBlob } from '../lib/exporters'
import { hasSaved, clear } from '../lib/persist'
import type { Enemy, Environment } from '../types'
import type { Theme } from '../lib/theme'
import { themeOptions } from '@my-monorepo/theme'
import { openGlossary } from '../lib/glossaryState'
import {
  AppButton,
  AppCard,
  AppDropdown,
  AppIcon,
  AppIconButton
} from '@my-monorepo/ui'
// Static asset URLs for docs
// Vite will emit these and return URLs at runtime
// If filenames change, update imports below
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import srdUrl from '../SRD/Daggerheart-SRD-9-09-25.pdf?url'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import licenseUrl from '../SRD/DPCGL-July-30th-2025.pdf?url'

const props = defineProps<{
  sbType: 'enemy' | 'environment'
  enemy: Enemy
  environment: Environment
  theme: Theme
}>()

const emit = defineEmits<{
  (e: 'reset'): void
  (e: 'load-preset', which: 'acid'|'river'): void
  (e: 'update:theme', v: Theme): void
}>()

function downloadJSON() {
  const blob = toJSONBlob(props.sbType, props.enemy, props.environment)
  const name = (props.sbType === 'enemy' ? props.enemy.name : props.environment.name) || 'statblock'
  downloadBlob(blob, `${name}.json`)
}

async function copyMarkdown() {
  const md = toMarkdown(props.sbType, props.enemy, props.environment)
  try { await navigator.clipboard.writeText(md) } catch {}
}

function downloadMarkdown() {
  const md = toMarkdown(props.sbType, props.enemy, props.environment)
  const name = (props.sbType === 'enemy' ? props.enemy.name : props.environment.name) || 'statblock'
  downloadBlob(new Blob([md], { type: 'text/markdown' }), `${name}.md`)
}

function printNow() { window.print() }

function clearSaved() { clear() }

function openDoc(which: 'srd' | 'license') {
  const url = which === 'srd' ? srdUrl : licenseUrl
  window.open(url, '_blank')
}

const themeItems = computed(() => [
  { label: 'System', value: 'system', icon: 'palette' as const },
  ...themeOptions.map((opt) => ({ label: opt.label, value: opt.value, icon: 'palette' as const }))
])
</script>

<template>
  <AppCard padding="sm" variant="elevated" class="toolbar">
    <div class="left items-center gap-1">
      <AppIconButton name="plus" variant="primary" title="New" @click="emit('reset')" />
      <AppDropdown
        :items="[{label:'Acid Burrower', value:'acid', icon:'sword'}, {label:'Raging River', value:'river', icon:'book'}]"
        button-title="Presets"
        @select="v => emit('load-preset', v as any)"
      >
        <template #button>
          <AppIcon name="sword" />
          <span class="hidden md:inline">Presets</span>
        </template>
      </AppDropdown>
      <AppDropdown
        :items="[{label:'Open SRD', value:'srd', icon:'book'}, {label:'License', value:'license', icon:'book'}]"
        button-title="Docs"
        @select="v => openDoc(v as 'srd' | 'license')"
      >
        <template #button>
          <AppIcon name="book" />
          <span class="hidden md:inline">Docs</span>
        </template>
      </AppDropdown>
      <AppIconButton name="info" variant="outline" title="Glossary" @click="openGlossary()" />
    </div>
    <div class="right items-center gap-1">
      <AppDropdown
        :items="[
          {label:'Download JSON', value:'json', icon:'download'},
          {label:'Download Markdown', value:'md', icon:'download'},
          {label:'Copy Markdown', value:'copy', icon:'copy'},
          {label:'Print', value:'print', icon:'print'}
        ]"
        button-title="Export"
        align="right"
        @select="v => v==='json' ? downloadJSON() : v==='md' ? downloadMarkdown() : v==='copy' ? copyMarkdown() : printNow()"
      >
        <template #button>
          <AppIcon name="download" />
          <span class="hidden md:inline">Export</span>
        </template>
      </AppDropdown>

      <AppDropdown
        :items="themeItems"
        button-title="Theme"
        align="right"
        @select="v => emit('update:theme', v as Theme)"
      >
        <template #button>
          <AppIcon name="palette" />
          <span class="hidden md:inline">Theme</span>
        </template>
      </AppDropdown>

      <AppButton v-if="hasSaved()" variant="subtle" size="sm" @click="clearSaved">Clear</AppButton>
    </div>
  </AppCard>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.left,
.right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
