<script setup lang="ts">
import { computed, ref } from 'vue'
import { AppCol, AppRow } from '@my-monorepo/ui'
import BuilderHero from './components/BuilderHero.vue'
import BuilderInsights from './components/BuilderInsights.vue'
import BuilderWizardOverlay from './components/BuilderWizardOverlay.vue'
import StatblockPreview from './components/StatblockPreview.vue'
import Toolbar from './components/Toolbar.vue'
import PrintableStatblock from './components/PrintableStatblock.vue'
import GlossaryDrawer from './components/GlossaryDrawer.vue'
import { useStatblockBuilder } from './composables/useStatblockBuilder'
import { getTierGuide } from './lib/tierGuides'

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

const showWizard = ref(false)
const wizardKey = ref(0)

const isEnemy = computed(() => sbType.value === 'enemy')
const typeLabel = computed(() => (isEnemy.value ? 'Enemy' : 'Environment'))
const displayName = computed(() => {
  const label = (name.value || '').trim()
  if (label) return label
  return isEnemy.value ? 'Untitled Enemy' : 'Untitled Environment'
})

const tierGuide = computed(() => (tier.value != null ? getTierGuide(tier.value) : null))

const summaryMeta = computed(() => {
  const items: Array<{ label: string; value: string }> = [
    { label: 'Type', value: isEnemy.value ? 'Enemy' : 'Environment' },
    { label: 'Tier', value: tier.value != null ? `Tier ${tier.value}` : 'Unassigned' }
  ]

  if (isEnemy.value) {
    if (enemy.rank) items.push({ label: 'Rank', value: enemy.rank })
    if (enemy.difficulty != null) items.push({ label: 'Difficulty', value: String(enemy.difficulty) })
    if (enemy.hp != null) items.push({ label: 'HP', value: String(enemy.hp) })
    if (enemy.stress != null) items.push({ label: 'Stress', value: String(enemy.stress) })
  } else {
    if (environment.category) items.push({ label: 'Category', value: environment.category })
    if (environment.difficulty != null) items.push({ label: 'Difficulty', value: String(environment.difficulty) })
    if (environment.impulses) items.push({ label: 'Impulses', value: environment.impulses })
  }

  return items
})

const highlightedMeta = computed(() => summaryMeta.value.filter((item) => item.label !== 'Tier').slice(0, 4))
const tierStatus = computed(() => (tierGuide.value ? tierGuide.value.title : 'Tier pending'))

const tierCallout = computed(() => {
  if (!tierGuide.value) return null

  return {
    heading: tierGuide.value.title,
    summary: tierGuide.value.summary,
    focus: isEnemy.value ? tierGuide.value.enemyFocus : tierGuide.value.environmentFocus
  }
})

const summaryMessage = computed(() => {
  if (tierGuide.value) {
    return `You're building for ${tierGuide.value.title.toLowerCase()}. Dial in the stats with the guided steps for a balanced encounter.`
  }
  return 'Kick things off by selecting a tier — the guided steps will help you fill in everything that matters.'
})

function openWizard() {
  showWizard.value = true
}

function closeWizard() {
  showWizard.value = false
  wizardKey.value += 1
}

function handleFinish() {
  closeWizard()
}

function handleUpdateSbType(value: 'enemy' | 'environment') {
  sbType.value = value
}

function handleUpdateName(value: string) {
  name.value = value
}

function handleUpdateArchetype(value: string) {
  archetype.value = value
}

function handleUpdateTier(value: number | null) {
  tier.value = value
}

function handleUpdateDescription(value: string) {
  description.value = value
}

function handleUpdateTraits(value: string) {
  traits.value = value
}
</script>

<template>
  <div class="app-shell">
    <div class="shell-aura" aria-hidden="true" />

    <div class="page-container">
      <BuilderHero
        :display-name="displayName"
        :type-label="typeLabel"
        :summary-message="summaryMessage"
        :tier-status="tierStatus"
        :highlighted-meta="highlightedMeta"
        @open-wizard="openWizard"
        @reset="resetAll"
      />

      <Toolbar
        class="builder-toolbar"
        :sbType="sbType"
        :enemy="enemy"
        :environment="environment"
        :theme="theme"
        @update:theme="setTheme"
        @reset="resetAll"
        @load-preset="loadPreset"
      />

      <AppRow class="main-grid" :cols="3" gap="lg">
        <AppCol :span="2">
          <BuilderInsights :summary-meta="summaryMeta" :tier-callout="tierCallout" :type-label="typeLabel" />
        </AppCol>

        <AppCol :span="1" class="preview-column">
          <StatblockPreview :sbType="sbType" :enemy="enemy" :environment="environment" />
        </AppCol>
      </AppRow>
    </div>

    <BuilderWizardOverlay
      :open="showWizard"
      :display-name="displayName"
      :wizard-key="wizardKey"
      :sb-type="sbType"
      :enemy="enemy"
      :environment="environment"
      :name="name"
      :archetype="archetype"
      :tier="tier"
      :description="description"
      :traits="traits"
      @update:sbType="handleUpdateSbType"
      @update:name="handleUpdateName"
      @update:archetype="handleUpdateArchetype"
      @update:tier="handleUpdateTier"
      @update:description="handleUpdateDescription"
      @update:traits="handleUpdateTraits"
      @close="closeWizard"
      @finish="handleFinish"
    />

    <div class="print-only">
      <PrintableStatblock :sbType="sbType" :enemy="enemy" :environment="environment" />
    </div>
    <GlossaryDrawer />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  padding: clamp(3rem, 8vw, 5rem) 0 5rem;
  background: radial-gradient(circle at top, color-mix(in srgb, var(--accent) 14%, transparent), transparent 55%),
    radial-gradient(circle at bottom, color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent), transparent 70%),
    var(--bg);
}

.shell-aura {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%);
  opacity: 0.4;
  filter: saturate(115%);
  pointer-events: none;
}

.page-container {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  max-width: 1180px;
  padding: 0 clamp(1.25rem, 6vw, 2.75rem);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.main-grid {
  align-items: flex-start;
}

.preview-column {
  position: sticky;
  top: 2rem;
  align-self: flex-start;
}

.print-only {
  display: none;
}

@media (max-width: 768px) {
  .preview-column {
    position: static;
  }
}

@media print {
  .page-container,
  .builder-toolbar,
  :deep(.wizard-overlay) {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }
}
</style>
