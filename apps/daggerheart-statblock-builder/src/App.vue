<script setup lang="ts">
import { computed, ref } from 'vue'
import { AppButton, AppIcon, AppIconButton, fadeScale, fadeSlideUp } from '@my-monorepo/ui'
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

const topAppBarSubtitle = computed(() => {
  const details: string[] = [typeLabel.value]

  if (tier.value != null) details.push(`Tier ${tier.value}`)

  if (isEnemy.value) {
    if (enemy.rank) details.push(enemy.rank)
    if (enemy.difficulty != null) details.push(`Difficulty ${enemy.difficulty}`)
  } else {
    if (environment.category) details.push(environment.category)
    if (environment.difficulty != null) details.push(`Difficulty ${environment.difficulty}`)
  }

  return details.join(' • ')
})

const heroMotion = fadeSlideUp
const toolbarMotion = fadeSlideUp
const panelMotion = fadeSlideUp
const previewMotion = fadeScale

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

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="app-shell">
    <div class="shell-background" aria-hidden="true">
      <div class="shell-orb shell-orb--primary" />
      <div class="shell-orb shell-orb--accent" />
      <div class="shell-noise" />
    </div>

    <main class="layout-surface" role="main">
      <header class="top-app-bar" role="banner">
        <div class="top-app-bar__headline">
          <span class="top-app-bar__eyebrow">Daggerheart builder</span>
          <span class="top-app-bar__title">{{ displayName }}</span>
          <span class="top-app-bar__subtitle">{{ topAppBarSubtitle }}</span>
        </div>

        <div class="top-app-bar__actions">
          <AppButton variant="tonal" size="sm" class="top-app-bar__action" @click="openWizard">
            <AppIcon name="dice" size="sm" />
            <span>Guided build</span>
          </AppButton>
          <AppButton variant="text" size="sm" class="top-app-bar__action" @click="resetAll">
            <AppIcon name="trash" size="sm" />
            <span>Reset</span>
          </AppButton>
          <AppIconButton
            class="top-app-bar__icon"
            name="print"
            variant="surface"
            size="sm"
            aria-label="Print statblock"
            @click="handlePrint"
          />
        </div>
      </header>

      <section class="layout-stack">
        <Transition
          appear
          :enter-active-class="heroMotion.enterActiveClass"
          :enter-from-class="heroMotion.enterFromClass"
          :enter-to-class="heroMotion.enterToClass"
          :leave-active-class="heroMotion.leaveActiveClass"
          :leave-from-class="heroMotion.leaveFromClass"
          :leave-to-class="heroMotion.leaveToClass"
        >
          <BuilderHero
            :display-name="displayName"
            :type-label="typeLabel"
            :summary-message="summaryMessage"
            :tier-status="tierStatus"
            :highlighted-meta="highlightedMeta"
            @open-wizard="openWizard"
            @reset="resetAll"
          />
        </Transition>

        <Transition
          appear
          :enter-active-class="toolbarMotion.enterActiveClass"
          :enter-from-class="toolbarMotion.enterFromClass"
          :enter-to-class="toolbarMotion.enterToClass"
          :leave-active-class="toolbarMotion.leaveActiveClass"
          :leave-from-class="toolbarMotion.leaveFromClass"
          :leave-to-class="toolbarMotion.leaveToClass"
        >
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
        </Transition>

        <div class="layout-panels">
          <Transition
            appear
            :enter-active-class="panelMotion.enterActiveClass"
            :enter-from-class="panelMotion.enterFromClass"
            :enter-to-class="panelMotion.enterToClass"
            :leave-active-class="panelMotion.leaveActiveClass"
            :leave-from-class="panelMotion.leaveFromClass"
            :leave-to-class="panelMotion.leaveToClass"
          >
            <div class="layout-primary">
              <BuilderInsights :summary-meta="summaryMeta" :tier-callout="tierCallout" :type-label="typeLabel" />
            </div>
          </Transition>

          <Transition
            appear
            :enter-active-class="previewMotion.enterActiveClass"
            :enter-from-class="previewMotion.enterFromClass"
            :enter-to-class="previewMotion.enterToClass"
            :leave-active-class="previewMotion.leaveActiveClass"
            :leave-from-class="previewMotion.leaveFromClass"
            :leave-to-class="previewMotion.leaveToClass"
          >
            <div class="layout-preview">
              <StatblockPreview :key="sbType" :sbType="sbType" :enemy="enemy" :environment="environment" />
            </div>
          </Transition>
        </div>
      </section>
    </main>

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
  padding: clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 3rem) clamp(4rem, 7vw, 5.5rem);
  background: radial-gradient(circle at 20% -10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 62%),
    radial-gradient(circle at 90% 120%, color-mix(in srgb, var(--md-sys-color-primary) 18%, transparent), transparent 72%),
    var(--md-sys-color-surface-container-lowest, color-mix(in srgb, var(--surface) 96%, transparent));
  color: var(--md-sys-color-on-surface, var(--fg));
  overflow: hidden;
}

.shell-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.shell-orb {
  position: absolute;
  width: clamp(18rem, 42vw, 32rem);
  height: clamp(18rem, 42vw, 32rem);
  border-radius: 50%;
  opacity: 0.36;
  transform: translate3d(0, 0, 0);
  animation: floatAura 18s ease-in-out infinite;
}

.shell-orb--primary {
  top: clamp(-12rem, -18vw, -6rem);
  right: clamp(-6rem, -10vw, -1rem);
  background: radial-gradient(circle, color-mix(in srgb, var(--md-sys-color-secondary) 34%, transparent), transparent 70%);
  mix-blend-mode: screen;
}

.shell-orb--accent {
  bottom: clamp(-10rem, -16vw, -4rem);
  left: clamp(-12rem, -14vw, -6rem);
  animation-delay: -6s;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 42%, transparent), transparent 68%);
  mix-blend-mode: screen;
}

.shell-noise {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      120deg,
      color-mix(in srgb, var(--md-sys-color-surface-container-high, var(--surface)) 12%, transparent),
      transparent 65%
    ),
    radial-gradient(circle at 16% 28%, rgba(255, 255, 255, 0.12), transparent 54%);
  opacity: 0.28;
  mix-blend-mode: lighten;
}

.layout-surface {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  max-width: 1180px;
  width: min(100%, 1180px);
  padding: clamp(1.5rem, 4vw, 2.75rem);
  border-radius: 2rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest, var(--surface)) 90%, transparent);
  box-shadow: 0 24px 60px rgba(20, 12, 58, 0.2),
    0 0 0 1px color-mix(in srgb, var(--surface-outline, rgba(40, 35, 70, 0.26)) 28%, transparent);
  backdrop-filter: blur(26px);
  display: flex;
  flex-direction: column;
  gap: clamp(1.8rem, 3vw, 2.6rem);
}

.top-app-bar {
  position: sticky;
  top: clamp(1.5rem, 5vw, 2.75rem);
  z-index: 4;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: clamp(1.2rem, 3vw, 2rem);
  padding: clamp(0.75rem, 2vw, 1.25rem) clamp(0.9rem, 2vw, 1.4rem);
  border-radius: 1.6rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high, var(--surface-translucent)) 92%, transparent);
  box-shadow: 0 18px 40px rgba(16, 10, 50, 0.18),
    0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline-variant, transparent) 40%, transparent);
  backdrop-filter: blur(18px);
}

.top-app-bar__headline {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.top-app-bar__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant, var(--muted)) 85%, transparent);
}

.top-app-bar__title {
  font-size: clamp(1.4rem, 1.4vw + 1rem, 2rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--md-sys-color-on-surface, var(--fg));
}

.top-app-bar__subtitle {
  font-size: 0.95rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant, var(--muted)) 92%, transparent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-app-bar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
  justify-content: flex-end;
}

.top-app-bar__action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
}

.top-app-bar__action :deep(.app-icon) {
  margin-left: -0.1rem;
}

.top-app-bar__icon {
  border-radius: 0.9rem;
  box-shadow: 0 10px 24px rgba(24, 16, 60, 0.18);
}

.layout-stack {
  display: flex;
  flex-direction: column;
  gap: clamp(1.6rem, 3vw, 2.3rem);
}

.builder-toolbar {
  position: sticky;
  top: clamp(6.5rem, 11vw, 7.5rem);
  z-index: 3;
}

.builder-toolbar :deep(.toolbar-card) {
  border-radius: 1.35rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high, var(--surface-translucent)) 94%, transparent);
  box-shadow: 0 16px 38px rgba(18, 12, 54, 0.18), var(--glass-highlight);
}

.layout-panels {
  display: grid;
  gap: clamp(1.75rem, 3vw, 2.5rem);
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  align-items: start;
}

.layout-primary {
  display: flex;
  flex-direction: column;
  gap: clamp(1.2rem, 2vw, 1.8rem);
}

.layout-preview {
  position: sticky;
  top: clamp(7rem, 12vw, 8.5rem);
  align-self: flex-start;
}

.print-only {
  display: none;
}

@media (max-width: 1200px) {
  .layout-surface {
    width: min(100%, 1020px);
  }
}

@media (max-width: 1024px) {
  .top-app-bar {
    flex-direction: column;
    align-items: stretch;
    position: static;
  }

  .top-app-bar__subtitle {
    white-space: normal;
  }

  .top-app-bar__actions {
    justify-content: flex-start;
  }

  .builder-toolbar {
    position: relative;
    top: 0;
  }

  .layout-panels {
    grid-template-columns: 1fr;
  }

  .layout-preview {
    position: relative;
    top: 0;
  }
}

@media (max-width: 960px) {
  .app-shell {
    padding: clamp(2rem, 10vw, 3rem) clamp(1rem, 4vw, 1.5rem);
  }

  .layout-surface {
    padding: clamp(1.1rem, 6vw, 1.75rem);
    border-radius: 1.35rem;
    box-shadow: 0 18px 48px rgba(14, 10, 44, 0.18);
  }
}

@media print {
  .layout-surface,
  .top-app-bar,
  .builder-toolbar,
  .shell-background,
  :deep(.wizard-overlay) {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }
}

@keyframes floatAura {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, -1.5rem, 0) scale(1.05);
  }
}

@media (prefers-reduced-motion: reduce) {
  .shell-orb {
    animation: none;
  }

  .top-app-bar,
  .builder-toolbar,
  .layout-surface {
    backdrop-filter: none;
  }
}
</style>
