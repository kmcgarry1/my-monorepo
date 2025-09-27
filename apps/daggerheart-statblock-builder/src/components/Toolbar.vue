<script setup lang="ts">
import { computed } from 'vue'
import { toJSONBlob, toMarkdown, downloadBlob } from '../lib/exporters'
import { hasSaved, clear } from '../lib/persist'
import type { Enemy, Environment } from '../types'
import type { Theme } from '../lib/theme'
import { themeOptions } from '../lib/theme'
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
  { label: 'System (match device)', value: 'system', icon: 'palette' as const },
  ...themeOptions.map((opt) => ({
    label: `${opt.family === 'material' ? 'Material You' : 'Apple Fluent'} · ${opt.mode === 'light' ? 'Light' : 'Dark'}`,
    value: opt.value,
    icon: 'palette' as const
  }))
])
</script>

<template>
  <AppCard variant="surface" class="toolbar-card">
    <div class="toolbar-cluster">
      <AppIconButton name="plus" variant="ghost" size="sm" class="icon-pill" title="New" @click="emit('reset')" />
      <AppDropdown
        class="toolbar-dropdown"
        :items="[{label:'Acid Burrower', value:'acid', icon:'sword'}, {label:'Raging River', value:'river', icon:'book'}]"
        button-title="Presets"
        variant="ghost"
        @select="v => emit('load-preset', v as any)"
      >
        <template #button>
          <span class="toolbar-button">
            <AppIcon name="sword" />
            <span class="label">Presets</span>
          </span>
        </template>
      </AppDropdown>
      <AppDropdown
        class="toolbar-dropdown"
        :items="[{label:'Open SRD', value:'srd', icon:'book'}, {label:'License', value:'license', icon:'book'}]"
        button-title="Docs"
        variant="ghost"
        @select="v => openDoc(v as 'srd' | 'license')"
      >
        <template #button>
          <span class="toolbar-button">
            <AppIcon name="book" />
            <span class="label">Docs</span>
          </span>
        </template>
      </AppDropdown>
      <AppIconButton name="info" variant="ghost" size="sm" class="icon-pill" title="Glossary" @click="openGlossary()" />
    </div>
    <div class="toolbar-cluster">
      <AppDropdown
        class="toolbar-dropdown"
        :items="[
          {label:'Download JSON', value:'json', icon:'download'},
          {label:'Download Markdown', value:'md', icon:'download'},
          {label:'Copy Markdown', value:'copy', icon:'copy'},
          {label:'Print', value:'print', icon:'print'}
        ]"
        button-title="Export"
        align="right"
        variant="ghost"
        @select="v => v==='json' ? downloadJSON() : v==='md' ? downloadMarkdown() : v==='copy' ? copyMarkdown() : printNow()"
      >
        <template #button>
          <span class="toolbar-button">
            <AppIcon name="download" />
            <span class="label">Export</span>
          </span>
        </template>
      </AppDropdown>
      <AppDropdown
        class="toolbar-dropdown"
        :items="themeItems"
        button-title="Theme"
        align="right"
        variant="ghost"
        @select="v => emit('update:theme', v as Theme)"
      >
        <template #button>
          <span class="toolbar-button">
            <AppIcon name="palette" />
            <span class="label">Theme</span>
          </span>
        </template>
      </AppDropdown>
      <AppButton v-if="hasSaved()" variant="subtle" size="sm" class="toolbar-clear" @click="clearSaved">Clear</AppButton>
    </div>
  </AppCard>
</template>
<style scoped>
.toolbar-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.9rem 1rem;
  padding: 0.95rem 1.2rem;
  border-radius: 1.2rem;
  background: linear-gradient(120deg, color-mix(in srgb, var(--surface) 98%, transparent), color-mix(in srgb, var(--surface-veil) 60%, transparent));
  border: none;
  box-shadow: var(--glass-shadow-md), var(--glass-highlight);
  backdrop-filter: blur(18px);
}

.toolbar-cluster {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.icon-pill {
  border-radius: 0.9rem;
  background: var(--glass-surface-strong);
  border: none;
  padding: 0.5rem;
  box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
  transition: transform var(--motion-duration-sm) var(--motion-easing-emphasized), box-shadow var(--motion-duration-sm) var(--motion-easing-standard);
}

.icon-pill:hover {
  transform: translateY(-1px);
  box-shadow: var(--glass-shadow-md), var(--glass-highlight);
}

.toolbar-button {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.toolbar-button .label {
  color: color-mix(in srgb, var(--fg) 92%, transparent);
}

.toolbar-clear {
  border-radius: 0.9rem;
  padding-inline: 1rem;
}

:deep(.toolbar-dropdown > button) {
  border-radius: 0.95rem;
  padding: 0.6rem 1rem;
  border: none;
  background: var(--glass-surface-strong);
  box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
  transition: transform var(--motion-duration-sm) var(--motion-easing-emphasized), box-shadow var(--motion-duration-sm) var(--motion-easing-standard);
}

:deep(.toolbar-dropdown > button:hover) {
  transform: translateY(-1px);
  box-shadow: var(--glass-shadow-md), var(--glass-highlight);
}

:deep(.toolbar-dropdown > button .toolbar-button .label) {
  color: color-mix(in srgb, var(--fg) 92%, transparent);
}

@media (max-width: 640px) {
  .toolbar-button .label,
  :deep(.toolbar-dropdown > button .toolbar-button .label) {
    display: none;
  }
}
</style>
