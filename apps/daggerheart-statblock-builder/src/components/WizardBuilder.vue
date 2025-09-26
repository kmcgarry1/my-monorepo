<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseDetailsForm from './BaseDetailsForm.vue'
import TierSelectionStep from './TierSelectionStep.vue'
import EnemyProfileForm from './EnemyProfileForm.vue'
import EnemyAbilitiesForm from './EnemyAbilitiesForm.vue'
import EnvironmentProfileForm from './EnvironmentProfileForm.vue'
import EnvironmentFeaturesForm from './EnvironmentFeaturesForm.vue'
import type { Enemy, Environment } from '../types'
import { fadeSlideUp } from '@my-monorepo/ui'
import { AppButton, AppIcon } from '@my-monorepo/ui'

type StepKey = 'tier' | 'identity' | 'profile' | 'abilities' | 'review'
type StepDefinition = {
  key: StepKey
  label: string
  icon: 'info' | 'book' | 'sword' | 'palette' | 'print'
}

const props = defineProps<{
  sbType: 'enemy' | 'environment'
  enemy: Enemy
  environment: Environment
  name: string
  archetype: string
  tier: number | null
  description: string
  traits: string
}>()

const emit = defineEmits<{
  (e: 'update:sbType', v: 'enemy' | 'environment'): void
  (e: 'update:name', v: string): void
  (e: 'update:archetype', v: string): void
  (e: 'update:tier', v: number | null): void
  (e: 'update:description', v: string): void
  (e: 'update:traits', v: string): void
  (e: 'finish'): void
}>()

const current = ref(0)

const isEnemy = computed(() => props.sbType === 'enemy')

const steps = computed<StepDefinition[]>(() => [
  { key: 'tier', label: 'Tier', icon: 'info' },
  { key: 'identity', label: 'Identity', icon: 'book' },
  {
    key: 'profile',
    label: isEnemy.value ? 'Threat Profile' : 'Environment Profile',
    icon: isEnemy.value ? 'sword' : 'book'
  },
  {
    key: 'abilities',
    label: isEnemy.value ? 'Abilities' : 'Features',
    icon: 'palette'
  },
  { key: 'review', label: 'Review', icon: 'print' }
])

const stepCopy = computed<Record<StepKey, { short: string; detail: string }>>(() => ({
  tier: {
    short: 'Select tier & statblock type',
    detail: 'Choose the encounter tier and whether you are building an enemy or environment.'
  },
  identity: {
    short: 'Describe the identity',
    detail: 'Give the statblock a name, archetype, summary, and traits to set the tone.'
  },
  profile: isEnemy.value
    ? {
        short: 'Dial in the threat profile',
        detail: 'Tune difficulty, thresholds, HP, and stress to match the tier guidance.'
      }
    : {
        short: 'Shape the environment profile',
        detail: 'Outline category, difficulty, impulses, and core identity of the scene.'
      },
  abilities: isEnemy.value
    ? {
        short: 'Craft signature abilities',
        detail: 'Add attacks, experience notes, and features that define the enemy encounter.'
      }
    : {
        short: 'Describe features and prompts',
        detail: 'Capture features, prompts, and potential adversaries that bring the environment to life.'
      },
  review: {
    short: 'Review & final touches',
    detail: 'Cross-check your work in the live preview and prepare for export.'
  }
}))

const activeCopy = computed(() => {
  const activeStep = steps.value[current.value]
  if (!activeStep) return { short: '', detail: '' }
  return stepCopy.value[activeStep.key]
})

function next() {
  if (current.value < steps.value.length - 1) {
    current.value++
    return
  }
  emit('finish')
}

function back() {
  if (current.value > 0) current.value--
}

function goto(i: number) {
  current.value = i
}

const atFirst = computed(() => current.value === 0)
const atLast = computed(() => current.value === steps.value.length - 1)
const progress = computed(() => Math.round(((current.value + 1) / steps.value.length) * 100))
</script>

<template>
  <div class="wizard-shell">
    <aside class="wizard-sidebar">
      <div class="sidebar-copy">
        <p class="step-count">Step {{ current + 1 }} of {{ steps.length }}</p>
        <h3 class="sidebar-title">{{ steps[current].label }}</h3>
        <p class="sidebar-detail">{{ activeCopy.detail }}</p>
      </div>
      <ol class="stepper" role="list">
        <li v-for="(s, i) in steps" :key="s.key">
          <button
            type="button"
            class="stepper-item"
            :class="{ active: i === current, complete: i < current }"
            @click="goto(i)"
          >
            <span class="indicator" :aria-label="`Step ${i + 1}`">
              <span v-if="i < current" class="checkmark">✓</span>
              <span v-else>{{ i + 1 }}</span>
            </span>
            <span class="stepper-text">
              <span class="label">
                <AppIcon :name="s.icon" size="inline" color="accent" class="step-icon" />
                {{ s.label }}
              </span>
              <span class="hint">{{ stepCopy[s.key].short }}</span>
            </span>
          </button>
        </li>
      </ol>
    </aside>

    <section class="wizard-main">
      <div class="progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" :style="{ width: progress + '%' }" />
      </div>

      <Transition
        :enter-active-class="fadeSlideUp.enterActiveClass"
        :enter-from-class="fadeSlideUp.enterFromClass"
        :enter-to-class="fadeSlideUp.enterToClass"
        :leave-active-class="fadeSlideUp.leaveActiveClass"
        :leave-from-class="fadeSlideUp.leaveFromClass"
        :leave-to-class="fadeSlideUp.leaveToClass"
        mode="out-in"
      >
        <div :key="steps[current].key" class="step-container">
          <template v-if="steps[current].key==='tier'">
            <TierSelectionStep
              :sbType="props.sbType"
              :tier="props.tier"
              @update:sbType="v => emit('update:sbType', v)"
              @update:tier="v => emit('update:tier', v)"
            />
          </template>
          <template v-else-if="steps[current].key==='identity'">
            <BaseDetailsForm
              :name="props.name"
              :archetype="props.archetype"
              :description="props.description"
              :traits="props.traits"
              @update:name="v => emit('update:name', v)"
              @update:archetype="v => emit('update:archetype', v)"
              @update:description="v => emit('update:description', v)"
              @update:traits="v => emit('update:traits', v)"
            />
          </template>
          <template v-else-if="steps[current].key==='profile'">
            <EnemyProfileForm v-if="props.sbType==='enemy'" :enemy="props.enemy" :tier="props.tier" />
            <EnvironmentProfileForm v-else :environment="props.environment" :tier="props.tier" />
          </template>
          <template v-else-if="steps[current].key==='abilities'">
            <EnemyAbilitiesForm v-if="props.sbType==='enemy'" :enemy="props.enemy" :tier="props.tier" />
            <EnvironmentFeaturesForm v-else :environment="props.environment" :tier="props.tier" />
          </template>
          <template v-else>
            <div class="review-hint">
              <h4>Review everything in the preview</h4>
              <p>
                The preview card outside of this modal updates in real time. Export, print, or copy to markdown once the
                statblock feels right.
              </p>
            </div>
          </template>
        </div>
      </Transition>

      <footer class="wizard-nav">
        <AppButton variant="subtle" size="sm" :disabled="atFirst" @click="back">Back</AppButton>
        <div class="nav-meta">Step {{ current + 1 }} of {{ steps.length }}</div>
        <AppButton variant="primary" size="sm" @click="next">{{ atLast ? 'Finish' : 'Next step' }}</AppButton>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.wizard-shell {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  height: 100%;
  min-height: 0;
}

.wizard-sidebar {
  width: min(260px, 28%);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-right: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  padding-right: 1.25rem;
}

.sidebar-copy {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.step-count {
  margin: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: color-mix(in srgb, var(--muted) 82%, transparent);
}

.sidebar-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
}

.sidebar-detail {
  margin: 0;
  color: color-mix(in srgb, var(--muted) 86%, transparent);
  font-size: 0.88rem;
  line-height: 1.4;
}

.stepper {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stepper-item {
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.6rem 0.5rem;
  border-radius: var(--radius-md);
  transition: background 0.15s ease, transform 0.15s ease;
  text-align: left;
  cursor: pointer;
}

.stepper-item:hover {
  background: color-mix(in srgb, var(--surface-veil) 80%, transparent);
}

.stepper-item.active {
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  transform: translateX(2px);
}

.stepper-item.active .indicator {
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  background: color-mix(in srgb, var(--accent) 26%, transparent);
  color: color-mix(in srgb, var(--bg) 90%, transparent);
}

.stepper-item.complete .indicator {
  background: color-mix(in srgb, var(--accent) 85%, transparent);
}

.stepper-item.complete .indicator span {
  color: color-mix(in srgb, var(--bg) 100%, transparent);
}

.indicator {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--btn-border) 70%, transparent);
  background: color-mix(in srgb, var(--surface-veil) 70%, transparent);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: color-mix(in srgb, var(--fg) 90%, transparent);
}

.stepper-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stepper-text .label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.stepper-text .hint {
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--muted) 82%, transparent);
}

.step-icon {
  flex-shrink: 0;
}

.checkmark {
  font-weight: 700;
  color: color-mix(in srgb, var(--bg) 100%, transparent);
  font-size: 0.85rem;
}

.wizard-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}

.progress {
  height: 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-veil) 70%, transparent);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: color-mix(in srgb, var(--accent) 60%, transparent);
  transition: width 0.2s ease;
}

.step-container {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-hint {
  border: 1px dashed color-mix(in srgb, var(--border) 65%, transparent);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  background: color-mix(in srgb, var(--surface-veil) 70%, transparent);
}

.review-hint h4 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
}

.review-hint p {
  margin: 0;
  color: color-mix(in srgb, var(--muted) 85%, transparent);
  font-size: 0.88rem;
}

.wizard-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  padding-top: 1rem;
}

.nav-meta {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: color-mix(in srgb, var(--muted) 80%, transparent);
}

@media (max-width: 960px) {
  .wizard-shell {
    flex-direction: column;
    gap: 1.25rem;
  }

  .wizard-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
    padding-right: 0;
    padding-bottom: 1rem;
  }

  .stepper {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .stepper-item {
    width: calc(50% - 0.25rem);
  }

  .wizard-main {
    padding-bottom: 0.5rem;
  }
}

@media (max-width: 640px) {
  .stepper-item {
    width: 100%;
  }

  .wizard-nav {
    flex-direction: column;
    align-items: stretch;
  }

  .wizard-nav > * {
    width: 100%;
    justify-content: center;
  }

  .nav-meta {
    order: -1;
    text-align: center;
  }
}
</style>
