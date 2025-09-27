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
              <span v-if="i < current" class="checkmark">âœ“</span>
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
  gap: 1.6rem;
  height: 100%;
  min-height: 0;
  padding: 1.5rem;
  border-radius: 1.6rem;
  background: linear-gradient(160deg, color-mix(in srgb, var(--surface) 99%, transparent), color-mix(in srgb, var(--surface-veil) 55%, transparent));
  border: 1px solid color-mix(in srgb, var(--border) 28%, transparent);
  box-shadow: 0 24px 55px rgba(15, 12, 40, 0.12);
  backdrop-filter: blur(18px);
}

.wizard-sidebar {
  width: min(270px, 28%);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.4rem;
  background: color-mix(in srgb, var(--surface) 99%, transparent);
  border-radius: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--border) 24%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 18px 40px rgba(15, 12, 40, 0.1);
}

.sidebar-copy {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.step-count {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 72%, transparent);
}

.sidebar-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--fg) 96%, transparent);
}

.sidebar-detail {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.45;
  color: color-mix(in srgb, var(--muted) 80%, transparent);
}

.stepper {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.stepper-item {
  width: 100%;
  border: 1px solid color-mix(in srgb, var(--border) 22%, transparent);
  background: color-mix(in srgb, var(--surface) 98%, transparent);
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  text-align: left;
  cursor: pointer;
  transition:
    transform var(--motion-duration-sm) var(--motion-easing-emphasized),
    border-color var(--motion-duration-sm) var(--motion-easing-standard),
    box-shadow var(--motion-duration-sm) var(--motion-easing-standard),
    background var(--motion-duration-sm) var(--motion-easing-standard);
}

.stepper-item:hover:not(.active) {
  transform: translateX(3px);
  border-color: color-mix(in srgb, var(--accent) 30%, transparent);
  box-shadow: 0 12px 24px rgba(15, 12, 40, 0.08);
}

.stepper-item.active {
  background: linear-gradient(145deg, color-mix(in srgb, var(--accent) 14%, transparent), color-mix(in srgb, var(--surface) 94%, transparent));
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  box-shadow: 0 18px 32px rgba(15, 12, 40, 0.14);
  transform: translateX(4px);
}

.stepper-item.complete {
  border-color: color-mix(in srgb, var(--accent) 34%, transparent);
}

.indicator {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.88rem;
  color: color-mix(in srgb, var(--fg) 85%, transparent);
  background: color-mix(in srgb, var(--surface-veil) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 30%, transparent);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}

.stepper-item.active .indicator,
.stepper-item.complete .indicator {
  background: linear-gradient(145deg, color-mix(in srgb, var(--accent) 75%, transparent), color-mix(in srgb, var(--accent) 45%, transparent));
  color: color-mix(in srgb, var(--bg) 96%, transparent);
  border-color: transparent;
  box-shadow: 0 10px 22px rgba(249, 193, 73, 0.35);
}

.checkmark {
  font-weight: 700;
  font-size: 0.9rem;
  color: inherit;
}

.stepper-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stepper-text .label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 600;
  font-size: 0.92rem;
  letter-spacing: 0.02em;
  color: color-mix(in srgb, var(--fg) 92%, transparent);
}

.stepper-text .hint {
  font-size: 0.76rem;
  line-height: 1.35;
  color: color-mix(in srgb, var(--muted) 78%, transparent);
}

.stepper-item.active .stepper-text .label {
  color: color-mix(in srgb, var(--fg) 98%, transparent);
}

.stepper-item.active .stepper-text .hint {
  color: color-mix(in srgb, var(--accent) 70%, transparent);
}

.step-icon {
  flex-shrink: 0;
}

.wizard-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  min-height: 0;
  padding: 1.45rem 1.55rem;
  border-radius: 1.3rem;
  background: color-mix(in srgb, var(--surface) 99%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 26%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 20px 38px rgba(15, 12, 40, 0.08);
}

.progress {
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-veil) 68%, transparent);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 65%, transparent), color-mix(in srgb, var(--accent) 45%, transparent));
  box-shadow: 0 6px 14px rgba(249, 193, 73, 0.35);
  transition: width var(--motion-duration-sm) var(--motion-easing-emphasized);
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
  border: 1px dashed color-mix(in srgb, var(--border) 40%, transparent);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  background: color-mix(in srgb, var(--surface-veil) 68%, transparent);
}

.review-hint h4 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
}

.review-hint p {
  margin: 0;
  color: color-mix(in srgb, var(--muted) 82%, transparent);
  font-size: 0.88rem;
}

.wizard-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid color-mix(in srgb, var(--border) 28%, transparent);
  padding-top: 1.25rem;
}

.nav-meta {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: color-mix(in srgb, var(--muted) 78%, transparent);
}

@media (max-width: 960px) {
  .wizard-shell {
    flex-direction: column;
    padding: 1.2rem;
    gap: 1.2rem;
  }

  .wizard-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 24%, transparent);
    padding: 1.2rem 1.1rem;
    border-radius: 1.15rem;
  }

  .wizard-main {
    padding: 1.2rem 1.1rem;
  }

  .stepper {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .stepper-item {
    width: calc(50% - 0.45rem);
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


