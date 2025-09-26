<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AppButton, AppCard, AppIconButton } from '@my-monorepo/ui'
import WizardBuilder from './components/WizardBuilder.vue'
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

watch(
  () => showWizard.value,
  (open) => {
    document.body.style.setProperty('overflow', open ? 'hidden' : '')
  }
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && showWizard.value) {
    event.preventDefault()
    closeWizard()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.removeProperty('overflow')
})
</script>

<template>
  <div class="app-wrapper">
    <div class="app-backdrop" aria-hidden="true" />

    <div class="app-container">
      <header class="hero-card glass-panel">
        <div class="hero-content">
          <p class="eyebrow">Currently editing</p>
          <h1>{{ displayName }}</h1>
          <p class="lead">{{ summaryMessage }}</p>
          <div v-if="summaryMeta.length" class="hero-meta">
            <div v-for="item in summaryMeta" :key="item.label" class="hero-chip">
              <span class="label">{{ item.label }}</span>
              <span class="value">{{ item.value }}</span>
            </div>
          </div>
          <div class="hero-actions">
            <AppButton size="lg" variant="primary" @click="openWizard">Launch guided builder</AppButton>
            <AppButton size="lg" variant="subtle" @click="resetAll">Start fresh</AppButton>
          </div>
          <p class="meta-note">Saved automatically — export whenever you're ready using the toolbar below.</p>
        </div>
      </header>

      <Toolbar
        class="topbar glass-panel"
        :sbType="sbType"
        :enemy="enemy"
        :environment="environment"
        :theme="theme"
        @update:theme="setTheme"
        @reset="resetAll"
        @load-preset="loadPreset"
      />

      <main class="content-grid">
        <section class="info-stack">
          <AppCard padding="lg" class="glass-panel">
            <h2 class="section-title">Quick summary</h2>
            <p class="section-subtitle">Use the guided modal to capture every detail. This panel updates as you go.</p>
            <div v-if="summaryMeta.length" class="summary-grid">
              <div v-for="item in summaryMeta" :key="item.label" class="summary-item">
                <span class="summary-label">{{ item.label }}</span>
                <span class="summary-value">{{ item.value }}</span>
              </div>
            </div>
            <p v-else class="empty-state">No details yet — open the builder to get started.</p>
          </AppCard>

          <AppCard padding="lg" class="glass-panel">
            <h2 class="section-title">Workflow tips</h2>
            <ul class="tips-list">
              <li>Step through the wizard to keep vital stats grouped by purpose.</li>
              <li>Switch between enemy and environment tiers without losing progress.</li>
              <li>Use the glossary from the toolbar whenever you need official wording.</li>
            </ul>
          </AppCard>
        </section>

        <section class="preview-column">
          <StatblockPreview :sbType="sbType" :enemy="enemy" :environment="environment" />
        </section>
      </main>
    </div>

    <Transition name="wizard-fade">
      <div
        v-if="showWizard"
        class="wizard-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Daggerheart statblock builder"
        @click.self="closeWizard"
      >
        <div class="wizard-dialog glass-panel">
          <header class="wizard-header">
            <div>
              <p class="eyebrow">Guided builder</p>
              <h2>{{ displayName }}</h2>
            </div>
            <AppIconButton name="x" variant="outline" title="Close builder" @click="closeWizard" />
          </header>
          <div class="wizard-body">
            <WizardBuilder
              :key="wizardKey"
              v-model:sbType="sbType"
              v-model:name="name"
              v-model:archetype="archetype"
              v-model:tier="tier"
              v-model:description="description"
              v-model:traits="traits"
              :enemy="enemy"
              :environment="environment"
              @finish="handleFinish"
            />
          </div>
        </div>
      </div>
    </Transition>

    <div class="print-only">
      <PrintableStatblock :sbType="sbType" :enemy="enemy" :environment="environment" />
    </div>
    <GlossaryDrawer />
  </div>
</template>

<style scoped>
.app-wrapper {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at top, color-mix(in srgb, var(--accent) 10%, transparent), transparent 55%),
    var(--bg);
  padding-bottom: 4rem;
}

.app-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%);
  opacity: 0.35;
  filter: saturate(120%);
  pointer-events: none;
}

.app-container {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  max-width: 1120px;
  padding: 3.5rem 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.glass-panel {
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
  background: color-mix(in srgb, var(--surface-translucent) 88%, transparent);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(18px);
}

.hero-card {
  padding: 2.5rem 2.25rem;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--muted) 82%, transparent);
}

h1 {
  margin: 0;
  font-size: clamp(1.75rem, 3vw + 1rem, 2.5rem);
  font-weight: 700;
}

.lead {
  margin: 0;
  color: color-mix(in srgb, var(--muted) 90%, transparent);
  font-size: 1rem;
  max-width: 36rem;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero-chip {
  display: inline-flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  border: 1px solid color-mix(in srgb, var(--btn-border) 70%, transparent);
  background: color-mix(in srgb, var(--surface-veil) 75%, transparent);
}

.hero-chip .label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: color-mix(in srgb, var(--muted) 86%, transparent);
}

.hero-chip .value {
  font-weight: 600;
  font-size: 0.95rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.meta-note {
  margin: 0;
  color: color-mix(in srgb, var(--muted) 82%, transparent);
  font-size: 0.85rem;
}

.content-grid {
  display: grid;
  gap: 1.5rem;
}

.info-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
}

.section-subtitle {
  margin: 0.35rem 0 1.25rem;
  color: color-mix(in srgb, var(--muted) 90%, transparent);
  font-size: 0.9rem;
}

.summary-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 75%, transparent);
  border: 1px solid color-mix(in srgb, var(--btn-border) 60%, transparent);
}

.summary-label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 80%, transparent);
}

.summary-value {
  font-weight: 600;
  font-size: 1rem;
}

.empty-state {
  margin: 0;
  color: color-mix(in srgb, var(--muted) 88%, transparent);
}

.tips-list {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  color: color-mix(in srgb, var(--muted) 85%, transparent);
}

.preview-column {
  position: sticky;
  top: 1.5rem;
  align-self: flex-start;
}

.wizard-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(1rem, 4vw, 2.5rem);
  background: color-mix(in srgb, var(--surface-translucent) 82%, rgba(10, 10, 18, 0.55));
  backdrop-filter: blur(22px);
  z-index: 50;
}

.wizard-dialog {
  width: min(1120px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.75rem;
}

.wizard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  padding-bottom: 1rem;
}

.wizard-body {
  flex: 1;
  min-height: 0;
}

.wizard-body :deep(.wizard-shell) {
  height: 100%;
}

.print-only {
  display: none;
}

.wizard-fade-enter-active,
.wizard-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.wizard-fade-enter-from,
.wizard-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

@media (min-width: 980px) {
  .content-grid {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  }
}

@media (max-width: 768px) {
  .app-container {
    padding-inline: 1rem;
    padding-top: 2.5rem;
  }

  .hero-card {
    padding: 2rem 1.5rem;
  }

  .preview-column {
    position: static;
  }

  .wizard-dialog {
    padding: 1.25rem;
  }
}

@media print {
  .app-container,
  .wizard-overlay,
  .glass-panel {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }
}
</style>
