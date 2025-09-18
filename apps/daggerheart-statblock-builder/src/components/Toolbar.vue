<script setup lang="ts">
import { toJSONBlob, toMarkdown, downloadBlob } from '../lib/exporters'
import { hasSaved, clear } from '../lib/persist'
import { AcidBurrower, RagingRiver } from '../lib/presets'
import type { Enemy, Environment } from '../types'
import type { Theme } from '../lib/theme'
import { openGlossary } from '../lib/glossaryState'
import AppButton from './ui/AppButton.vue'
import AppIcon from './ui/AppIcon.vue'
import AppIconButton from './ui/AppIconButton.vue'
import AppDropdown from './ui/AppDropdown.vue'
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
</script>

<template>
  <div class="toolbar">
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
        @select="v => v==='srd' ? window.open(srdUrl, '_blank') : window.open(licenseUrl, '_blank')"
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
        :items="[
          {label:'System', value:'system', icon:'palette'},
          {label:'Slate', value:'slate', icon:'palette'},
          {label:'Parchment', value:'parchment', icon:'palette'},
          {label:'Emerald', value:'emerald', icon:'palette'},
          {label:'Midnight', value:'midnight', icon:'palette'}
        ]"
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
  </div>
</template>

<style scoped>
.toolbar { display:flex; gap:.5rem; justify-content:space-between; align-items:center; padding:.5rem; border:1px solid var(--border); border-radius:.5rem; margin-bottom:1rem; background: var(--surface); backdrop-filter: blur(6px); }
.left, .right { display:flex; align-items:center; gap:.5rem; flex-wrap: wrap; }
.group { display:flex; align-items:center; gap:.5rem; }
/* Light button-like links for docs */
.btn-like { display:inline-flex; align-items:center; gap:.25rem; border:1px solid var(--btn-border); background: var(--btn-bg); color: var(--btn-fg); padding:.35rem .55rem; border-radius:.375rem; text-decoration:none; }
.btn-like:hover { border-color: var(--accent); }
@media (prefers-color-scheme: dark) { :root:not([data-theme]) .toolbar { background: var(--surface); border-color: var(--border); } }
</style>
