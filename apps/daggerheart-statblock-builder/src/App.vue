<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AppBadge, AppButton, AppCard, AppCol, AppIconButton, AppRow, AppText } from '@my-monorepo/ui'
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
  <div class="app-shell">
    <div class="shell-aura" aria-hidden="true" />

    <div class="page-container">
      <AppCard padding="lg" variant="surface" class="hero-card">
        <div class="hero-grid">
          <div class="hero-main">
            <AppBadge size="xs" variant="neutral" class="hero-eyebrow">Currently editing</AppBadge>
            <div class="hero-title-row">
              <AppText as="h1" size="lg" class="hero-title">{{ displayName }}</AppText>
              <AppBadge variant="accent" size="sm">{{ typeLabel }}</AppBadge>
            </div>
            <AppText variant="body" size="lg" class="hero-lead">{{ summaryMessage }}</AppText>
            <AppText variant="muted" size="sm" class="meta-note">
              Saved automatically — export whenever you're ready using the toolbar.
            </AppText>
          </div>
          <div class="hero-actions">
            <AppButton size="lg" variant="primary" @click="openWizard">Launch guided builder</AppButton>
            <AppButton size="lg" variant="surface" @click="resetAll">Start fresh</AppButton>
          </div>
        </div>

        <div class="hero-highlights">
          <div class="highlight-card">
            <span class="highlight-label">Tier status</span>
            <span class="highlight-value">{{ tierStatus }}</span>
          </div>
          <div v-for="item in highlightedMeta" :key="item.label" class="highlight-card">
            <span class="highlight-label">{{ item.label }}</span>
            <span class="highlight-value">{{ item.value }}</span>
          </div>
        </div>
      </AppCard>

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
          <AppRow class="insight-grid" :cols="2" gap="lg">
            <AppCol :span="2">
              <AppCard padding="lg" variant="surface" class="summary-card">
                <AppText as="h2" variant="title" class="section-title">Quick summary</AppText>
                <AppText variant="muted" size="sm" class="section-subtitle">
                  Use the guided modal to capture every detail. This panel updates as you go.
                </AppText>
                <div v-if="summaryMeta.length" class="summary-grid">
                  <div v-for="item in summaryMeta" :key="item.label" class="summary-item">
                    <span class="summary-label">{{ item.label }}</span>
                    <span class="summary-value">{{ item.value }}</span>
                  </div>
                </div>
                <AppText v-else variant="muted" class="empty-state">
                  No details yet — open the builder to get started.
                </AppText>
              </AppCard>
            </AppCol>

            <AppCol :span="tierCallout ? 1 : 2">
              <AppCard padding="lg" variant="surface" class="tips-card">
                <AppText as="h2" variant="title" class="section-title">Workflow tips</AppText>
                <ul class="tips-list">
                  <li>
                    <AppText variant="muted" size="sm">
                      Step through the wizard to keep vital stats grouped by purpose.
                    </AppText>
                  </li>
                  <li>
                    <AppText variant="muted" size="sm">
                      Switch between enemy and environment tiers without losing progress.
                    </AppText>
                  </li>
                  <li>
                    <AppText variant="muted" size="sm">
                      Use the glossary from the toolbar whenever you need official wording.
                    </AppText>
                  </li>
                </ul>
              </AppCard>
            </AppCol>

            <AppCol v-if="tierCallout" :span="1">
              <AppCard padding="lg" variant="surface" class="tier-card">
                <AppBadge size="xs" variant="accent" class="tier-badge">Tier insights</AppBadge>
                <AppText as="h3" variant="title" class="tier-heading">{{ tierCallout.heading }}</AppText>
                <AppText variant="muted" size="sm" class="tier-summary">{{ tierCallout.summary }}</AppText>
                <div class="tier-focus">
                  <AppBadge size="xs" variant="neutral">{{ typeLabel }} focus</AppBadge>
                  <AppText variant="body" size="sm">{{ tierCallout.focus }}</AppText>
                </div>
              </AppCard>
            </AppCol>
          </AppRow>
        </AppCol>

        <AppCol :span="1" class="preview-column">
          <StatblockPreview :sbType="sbType" :enemy="enemy" :environment="environment" />
        </AppCol>
      </AppRow>
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
        <div class="wizard-dialog">
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

.hero-card {
  position: relative;
  overflow: hidden;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high) 95%, transparent);
}

.hero-card::after {
  content: '';
  position: absolute;
  inset: -40% -10% auto;
  height: 60%;
  background: radial-gradient(circle at top, color-mix(in srgb, var(--accent) 28%, transparent), transparent 70%);
  opacity: 0.45;
  pointer-events: none;
}

.hero-grid {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.eyebrow {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 82%, transparent);
}

.hero-eyebrow {
  align-self: flex-start;
}

.hero-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.hero-title {
  margin: 0;
  font-size: clamp(2.1rem, 3vw + 1.25rem, 3.25rem);
  font-weight: 700;
}

.hero-lead {
  margin: 0;
  max-width: 46rem;
}

.meta-note {
  margin: 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.hero-highlights {
  position: relative;
  margin-top: 1.5rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.highlight-card {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--surface-veil) 85%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.highlight-label {
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 85%, transparent);
}

.highlight-value {
  font-weight: 600;
  font-size: 1rem;
}

.main-grid {
  align-items: flex-start;
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-title {
  margin: 0;
}

.section-subtitle {
  margin: 0;
}

.summary-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.summary-item {
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 83%, transparent);
}

.summary-value {
  font-size: 1rem;
  font-weight: 600;
}

.empty-state {
  margin: 0;
}

.tips-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tips-list {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.tier-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tier-heading {
  margin: 0;
}

.tier-summary {
  margin: 0;
}

.tier-focus {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
}

.tier-focus :deep(p) {
  margin: 0;
}

.preview-column {
  position: sticky;
  top: 2rem;
  align-self: flex-start;
}

.wizard-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(1rem, 4vw, 2.5rem);
  background: color-mix(in srgb, var(--surface-translucent) 85%, rgba(10, 10, 18, 0.6));
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
  border-radius: var(--radius-xl);
  border: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
  background: color-mix(in srgb, var(--surface-translucent) 92%, transparent);
  box-shadow: var(--shadow-elevated);
  backdrop-filter: blur(20px);
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
  .hero-grid {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .hero-actions {
    align-items: flex-end;
  }
}

@media (max-width: 768px) {
  .preview-column {
    position: static;
  }

  .wizard-dialog {
    padding: 1.25rem;
  }
}

@media print {
  .page-container,
  .wizard-overlay {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }
}
</style>
