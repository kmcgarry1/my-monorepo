<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  AppButton,
  AppIcon,
  AppIconButton,
  fadeScale,
  fadeSlideUp,
  provideDesignStyle,
  useMaterialDisplay,
} from '@my-monorepo/ui'
import { AndroidNavigationRail, CupertinoNavigationBar } from '@my-monorepo/ui-platform'
import BuilderHero from './components/BuilderHero.vue'
import BuilderInsights from './components/BuilderInsights.vue'
import BuilderWizardOverlay from './components/BuilderWizardOverlay.vue'
import StatblockPreview from './components/StatblockPreview.vue'
import Toolbar from './components/Toolbar.vue'
import PrintableStatblock from './components/PrintableStatblock.vue'
import GlossaryDrawer from './components/GlossaryDrawer.vue'
import NameReferenceDrawer from './components/NameReferenceDrawer.vue'
import { useStatblockBuilder } from './composables/useStatblockBuilder'
import { getTierGuide } from './lib/tierGuides'
import { glossaryOpen, openGlossary } from './lib/glossaryState'

provideDesignStyle({ preset: 'material-desktop', responsive: true })

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

type NavValue = 'builder' | 'guided' | 'names' | 'glossary'

const navItems: Array<{ icon: 'sword' | 'dice' | 'sparkles' | 'book'; label: string; value: NavValue }> = [
  { icon: 'sword', label: 'Builder', value: 'builder' },
  { icon: 'dice', label: 'Guided', value: 'guided' },
  { icon: 'sparkles', label: 'Name DB', value: 'names' },
  { icon: 'book', label: 'Glossary', value: 'glossary' },
]

const navSelection = ref<NavValue>('builder')
const showWizard = ref(false)
const wizardKey = ref(0)
const showNameReference = ref(false)
const { deviceClasses, isPhone } = useMaterialDisplay()

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
  navSelection.value = 'guided'
  showWizard.value = true
}

function closeWizard() {
  showWizard.value = false
  wizardKey.value += 1
  if (navSelection.value === 'guided') {
    navSelection.value = 'builder'
  }
}

function handleFinish() {
  closeWizard()
}

function openNameReference() {
  navSelection.value = 'names'
  showNameReference.value = true
}

function closeNameReference() {
  showNameReference.value = false
  if (navSelection.value === 'names') {
    navSelection.value = 'builder'
  }
}

function handleNavSelect(value: NavValue | string) {
  const next = navItems.find((item) => item.value === value)?.value ?? 'builder'

  switch (next) {
    case 'builder':
      navSelection.value = 'builder'
      break
    case 'guided':
      openWizard()
      break
    case 'names':
      openNameReference()
      break
    case 'glossary':
      navSelection.value = 'glossary'
      openGlossary()
      break
  }
}

function handleUpdateSbType(value: 'enemy' | 'environment') {
  sbType.value = value
}

function handleUpdateName(value: string) {
  name.value = value
}

function handleApplySuggestedName(value: string) {
  handleUpdateName(value)
  closeNameReference()
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

watch(glossaryOpen, (isOpen) => {
  if (isOpen) {
    navSelection.value = 'glossary'
  } else if (navSelection.value === 'glossary') {
    navSelection.value = 'builder'
  }
})
</script>

<template>
  <div class="app-shell" :class="deviceClasses">
    <div class="shell-background" aria-hidden="true">
      <div class="shell-layer shell-layer--primary" />
      <div class="shell-layer shell-layer--accent" />
      <div class="shell-grid" />
    </div>

    <aside v-if="!isPhone" class="nav-rail" aria-label="Builder navigation">
      <div class="nav-rail__logo" aria-hidden="true">
        <span class="nav-rail__brand">DH</span>
      </div>
      <AndroidNavigationRail
        v-model="navSelection"
        class="nav-rail__menu"
        :items="navItems"
        @select="handleNavSelect"
      />
      <div class="nav-rail__footer">
        <AppButton class="nav-rail__print" variant="surface" size="sm" @click="handlePrint">
          <AppIcon name="print" size="sm" />
          <span>Print</span>
        </AppButton>
      </div>
    </aside>

    <main class="layout-surface" role="main">
      <header v-if="!isPhone" class="top-app-bar" role="banner">
        <div class="top-app-bar__headline">
          <span class="top-app-bar__eyebrow">Daggerheart builder</span>
          <span class="top-app-bar__title">{{ displayName }}</span>
          <span class="top-app-bar__subtitle">{{ topAppBarSubtitle }}</span>
        </div>

        <div class="top-app-bar__actions">
          <AppButton variant="elevated" size="sm" class="top-app-bar__action" @click="openWizard">
            <AppIcon name="dice" size="sm" />
            <span>Guided build</span>
          </AppButton>
          <AppButton variant="outlined" size="sm" class="top-app-bar__action" @click="resetAll">
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

      <CupertinoNavigationBar v-else class="mobile-app-bar" :title="displayName" back-behavior="none">
        <template #leading>
          <div class="mobile-app-bar__brand">
            <span class="mobile-app-bar__logo" aria-hidden="true">DH</span>
          </div>
        </template>
        <template #title>
          <div class="mobile-app-bar__headline">
            <span class="mobile-app-bar__eyebrow">Daggerheart builder</span>
            <span class="mobile-app-bar__title">{{ displayName }}</span>
            <span class="mobile-app-bar__subtitle">{{ topAppBarSubtitle }}</span>
          </div>
        </template>
        <template #trailing>
          <div class="mobile-app-bar__actions">
            <AppIconButton
              class="mobile-app-bar__icon"
              name="dice"
              variant="surface"
              size="sm"
              aria-label="Open guided build"
              @click="openWizard"
            />
            <AppIconButton
              class="mobile-app-bar__icon"
              name="trash"
              variant="surface"
              size="sm"
              aria-label="Reset statblock"
              @click="resetAll"
            />
            <AppIconButton
              class="mobile-app-bar__icon"
              name="print"
              variant="surface"
              size="sm"
              aria-label="Print statblock"
              @click="handlePrint"
            />
          </div>
        </template>
      </CupertinoNavigationBar>

      <nav v-if="isPhone" class="mobile-action-bar" aria-label="Builder navigation">
        <button class="mobile-action" type="button" :class="{ 'is-active': navSelection === 'builder' }">
          <AppIcon name="sword" size="sm" />
          <span>Builder</span>
        </button>
        <button class="mobile-action" type="button" :class="{ 'is-active': navSelection === 'guided' }" @click="openWizard">
          <AppIcon name="dice" size="sm" />
          <span>Guided</span>
        </button>
        <button
          class="mobile-action"
          type="button"
          :class="{ 'is-active': navSelection === 'names' }"
          @click="openNameReference"
        >
          <AppIcon name="sparkles" size="sm" />
          <span>Name DB</span>
        </button>
        <button
          class="mobile-action"
          type="button"
          :class="{ 'is-active': navSelection === 'glossary' }"
          @click="handleNavSelect('glossary')"
        >
          <AppIcon name="book" size="sm" />
          <span>Glossary</span>
        </button>
      </nav>

      <section class="layout-overview">
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
            class="layout-overview__hero"
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
            class="layout-overview__controls"
            :sbType="sbType"
            :enemy="enemy"
            :environment="environment"
            :theme="theme"
            @update:theme="setTheme"
            @reset="resetAll"
            @load-preset="loadPreset"
          />
        </Transition>
      </section>

      <section class="layout-grid">
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
      @open-name-helper="openNameReference"
      @finish="handleFinish"
    />

    <div class="print-only">
      <PrintableStatblock :sbType="sbType" :enemy="enemy" :environment="environment" />
    </div>
    <NameReferenceDrawer
      :open="showNameReference"
      :sb-type="sbType"
      @close="closeNameReference"
      @apply-name="handleApplySuggestedName"
    />
    <GlossaryDrawer />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: clamp(72px, 8vw, 88px) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 2.5rem);
  padding: clamp(2.5rem, 6vw, 4rem);
  background: radial-gradient(circle at 20% -12%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 62%),
    radial-gradient(circle at 120% 40%, color-mix(in srgb, var(--md-sys-color-primary) 24%, transparent), transparent 74%),
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

.shell-layer {
  position: absolute;
  border-radius: 999px;
  opacity: 0.28;
  filter: blur(0);
}

.shell-layer--primary {
  width: clamp(22rem, 46vw, 32rem);
  height: clamp(22rem, 46vw, 32rem);
  top: clamp(-14rem, -16vw, -8rem);
  right: clamp(-10rem, -12vw, -4rem);
  background: radial-gradient(circle, color-mix(in srgb, var(--md-sys-color-secondary) 38%, transparent), transparent 70%);
}

.shell-layer--accent {
  width: clamp(20rem, 38vw, 30rem);
  height: clamp(20rem, 38vw, 30rem);
  bottom: clamp(-12rem, -18vw, -6rem);
  left: clamp(-12rem, -14vw, -5rem);
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 48%, transparent), transparent 75%);
}

.shell-grid {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      115deg,
      color-mix(in srgb, var(--md-sys-color-surface-container-high, var(--surface)) 12%, transparent),
      transparent 65%
    ),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.14)) 24%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      0deg,
      color-mix(in srgb, var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.14)) 24%, transparent) 1px,
      transparent 1px
    );
  background-size: cover, 88px 88px, 88px 88px;
  opacity: 0.12;
}

.nav-rail {
  position: sticky;
  top: clamp(1.5rem, 6vw, 3rem);
  z-index: 3;
  height: calc(100vh - clamp(2.5rem, 6vw, 4rem) * 2);
  border-radius: 1.8rem;
  padding: clamp(1rem, 2.5vw, 1.5rem) clamp(0.4rem, 2vw, 0.75rem);
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest, var(--surface)) 88%, transparent);
  box-shadow: 0 24px 50px rgba(18, 12, 54, 0.2),
    0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline-variant, rgba(44, 40, 70, 0.26)) 30%, transparent);
  backdrop-filter: blur(22px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2rem);
}

.nav-rail__logo {
  display: grid;
  place-items: center;
  width: clamp(44px, 5vw, 56px);
  height: clamp(44px, 5vw, 56px);
  border-radius: 18px;
  background: color-mix(in srgb, var(--md-sys-color-primary) 22%, transparent);
  color: var(--md-sys-color-on-primary, #fff);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.95rem;
}

.nav-rail__brand {
  transform: translateY(-1px);
}

.nav-rail__menu {
  width: 100%;
  flex: 1 1 auto;
}

.nav-rail__footer {
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;
}

.nav-rail__print {
  width: 100%;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.layout-surface {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  max-width: 1260px;
  width: min(100%, 1260px);
  padding: clamp(1.75rem, 3.5vw, 2.75rem);
  border-radius: 2.4rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest, var(--surface)) 94%, transparent);
  box-shadow: 0 30px 70px rgba(20, 12, 58, 0.22),
    0 0 0 1px color-mix(in srgb, var(--surface-outline, rgba(40, 35, 70, 0.26)) 26%, transparent);
  backdrop-filter: blur(26px);
  display: flex;
  flex-direction: column;
  gap: clamp(1.9rem, 3vw, 2.6rem);
}

.app-shell.is-phone {
  grid-template-columns: 1fr;
  padding: clamp(1.2rem, 6vw, 1.8rem) clamp(0.75rem, 5vw, 1.6rem) clamp(2.4rem, 9vw, 3.2rem);
}

.app-shell.is-phone .layout-surface {
  padding: clamp(1rem, 6vw, 1.4rem);
  border-radius: 1.5rem;
  gap: 1.6rem;
}

.app-shell.is-phone .layout-overview {
  grid-template-columns: 1fr;
  gap: clamp(1rem, 5vw, 1.4rem);
}

.app-shell.is-phone .layout-grid {
  grid-template-columns: 1fr;
  gap: clamp(1rem, 6vw, 1.6rem);
}

.mobile-app-bar {
  padding: clamp(0.9rem, 4vw, 1.1rem) clamp(1rem, 5vw, 1.4rem);
  border-radius: 1.4rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high, var(--surface)) 96%, transparent);
  box-shadow: 0 16px 40px rgba(14, 10, 44, 0.18),
    0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline-variant, rgba(40, 35, 70, 0.22)) 32%, transparent);
}

.mobile-app-bar__brand {
  display: flex;
  gap: 0.9rem;
  align-items: center;
}

.mobile-app-bar__logo {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--md-sys-color-primary) 22%, transparent);
  color: var(--md-sys-color-on-primary, #fff);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.mobile-app-bar__headline {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-app-bar__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant, var(--muted)) 85%, transparent);
}

.mobile-app-bar__title {
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: -0.01em;
}

.mobile-app-bar__subtitle {
  font-size: 0.82rem;
  line-height: 1.2;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant, var(--muted)) 85%, transparent);
}

.mobile-app-bar__actions {
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
}

.mobile-app-bar__icon {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.2)) 30%, transparent);
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high, var(--surface)) 92%, transparent);
}

.mobile-action-bar {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem clamp(0.75rem, 6vw, 1.4rem);
  border-radius: 1.4rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-highest, var(--surface)) 96%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline-variant, rgba(40, 35, 70, 0.22)) 36%, transparent);
  overflow-x: auto;
  scrollbar-width: none;
}

.mobile-action-bar::-webkit-scrollbar {
  display: none;
}

.mobile-action {
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.55rem 0.85rem;
  border-radius: 1.1rem;
  border: none;
  background: transparent;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant, var(--muted)) 88%, transparent);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mobile-action:is(:hover, :focus-visible) {
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high, var(--surface)) 88%, transparent);
  color: var(--md-sys-color-on-surface, var(--fg));
}

.mobile-action.is-active {
  background: color-mix(in srgb, var(--md-sys-color-secondary-container, var(--surface)) 88%, transparent);
  color: var(--md-sys-color-on-secondary-container, var(--fg));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.3)) 45%, transparent);
}

.top-app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1rem, 2.5vw, 1.8rem);
  padding: clamp(0.85rem, 2vw, 1.25rem) clamp(1rem, 2vw, 1.6rem);
  border-radius: 1.8rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high, var(--surface-translucent)) 94%, transparent);
  box-shadow: 0 20px 44px rgba(18, 12, 54, 0.18),
    0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline-variant, transparent) 38%, transparent);
  backdrop-filter: blur(18px);
}

.top-app-bar__headline {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.top-app-bar__eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface-variant, var(--muted)) 90%, transparent);
}

.top-app-bar__title {
  font-size: clamp(1.5rem, 1.4vw + 1rem, 2.2rem);
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
  gap: 0.65rem;
  align-items: center;
  justify-content: flex-end;
}

.top-app-bar__action {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
}

.top-app-bar__icon {
  border-radius: 0.9rem;
  box-shadow: 0 12px 28px rgba(24, 16, 60, 0.18);
}

.layout-overview {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: clamp(1.4rem, 2.8vw, 2.2rem);
  align-items: stretch;
}

.layout-overview__hero,
.layout-overview__controls {
  height: 100%;
}

.layout-overview__controls :deep(.toolbar-card) {
  border-radius: 1.6rem;
  background: color-mix(in srgb, var(--md-sys-color-surface-container-high, var(--surface-translucent)) 95%, transparent);
  box-shadow: 0 18px 40px rgba(18, 12, 54, 0.18), var(--glass-highlight);
}

.layout-grid {
  display: grid;
  gap: clamp(1.6rem, 3vw, 2.4rem);
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  align-items: start;
}

.layout-primary {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 2vw, 1.8rem);
}

.layout-preview {
  position: sticky;
  top: clamp(6.5rem, 11vw, 8rem);
  align-self: flex-start;
}

.print-only {
  display: none;
}

@media (max-width: 1280px) {
  .app-shell {
    grid-template-columns: clamp(64px, 8vw, 80px) minmax(0, 1fr);
  }

  .layout-surface {
    max-width: 1120px;
  }

  .layout-overview {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .app-shell {
    grid-template-columns: 1fr;
    padding: clamp(2rem, 7vw, 3rem) clamp(1rem, 5vw, 2rem);
  }

  .nav-rail {
    position: static;
    height: auto;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 1.6rem;
    gap: 1rem;
  }

  .nav-rail__logo {
    width: 48px;
    height: 48px;
  }

  .nav-rail__footer {
    margin-top: 0;
  }

  .nav-rail__menu {
    width: auto;
  }

  .nav-rail__print {
    width: auto;
  }

  .layout-surface {
    padding: clamp(1.4rem, 5vw, 2rem);
    border-radius: 1.8rem;
  }

  .top-app-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .top-app-bar__subtitle {
    white-space: normal;
  }

  .top-app-bar__actions {
    justify-content: flex-start;
  }

  .layout-grid {
    grid-template-columns: 1fr;
  }

  .layout-preview {
    position: relative;
    top: 0;
  }
}

@media (max-width: 720px) {
  .app-shell {
    padding: clamp(1.5rem, 8vw, 2.2rem) clamp(0.75rem, 6vw, 1.5rem);
  }

  .nav-rail {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .nav-rail__menu {
    width: 100%;
  }

  .layout-surface {
    padding: clamp(1.1rem, 8vw, 1.6rem);
    border-radius: 1.4rem;
    box-shadow: 0 18px 48px rgba(14, 10, 44, 0.18);
  }
}

@media print {
  .layout-surface,
  .top-app-bar,
  .nav-rail,
  .shell-background,
  :deep(.wizard-overlay) {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .layout-surface,
  .top-app-bar,
  .nav-rail {
    backdrop-filter: none;
  }
}
</style>
