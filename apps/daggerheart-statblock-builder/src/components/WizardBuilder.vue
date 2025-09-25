<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseDetailsForm from './BaseDetailsForm.vue'
import EnemyForm from './EnemyForm.vue'
import EnvironmentForm from './EnvironmentForm.vue'
import type { Enemy, Environment } from '../types'
import { fadeSlideUp } from '@my-monorepo/ui'
import { AppBadge, AppButton, AppCard, AppIcon } from '@my-monorepo/ui'

const props = defineProps<{
  sbType: 'enemy' | 'environment'
  enemy: Enemy
  environment: Environment
  name: string
  tier: number | null
  description: string
  traits: string
}>()

const emit = defineEmits<{
  (e: 'update:sbType', v: 'enemy' | 'environment'): void
  (e: 'update:name', v: string): void
  (e: 'update:tier', v: number | null): void
  (e: 'update:description', v: string): void
  (e: 'update:traits', v: string): void
}>()

const current = ref(0)
const steps = computed(() => [
  { key: 'basics', label: 'Basics', icon: 'info' as const },
  { key: 'details', label: props.sbType === 'enemy' ? 'Enemy' : 'Environment', icon: props.sbType === 'enemy' ? 'sword' as const : 'book' as const },
  { key: 'review', label: 'Review', icon: 'print' as const },
])

function next() { if (current.value < steps.value.length - 1) current.value++ }
function back() { if (current.value > 0) current.value-- }
function goto(i: number) { current.value = i }

const atFirst = computed(() => current.value === 0)
const atLast = computed(() => current.value === steps.value.length - 1)
</script>

<template>
  <div>
    <AppCard variant="elevated" padding="md">
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <button
          v-for="(s, i) in steps"
          :key="s.key"
          type="button"
          :class="['inline-flex items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors', i===current ? 'bg-[color:var(--accent)] text-[color:var(--bg)] border-[color:var(--accent)]' : 'text-[color:var(--fg)] border-[color:var(--btn-border)] hover:bg-[color:var(--surface-veil)]']"
          @click="goto(i)"
        >
          <AppIcon :name="s.icon" size="sm" :color="i===current ? 'bg' : 'fg'" />
          <span>{{ s.label }}</span>
        </button>
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
        <div :key="steps[current].key">
          <template v-if="steps[current].key==='basics'">
            <BaseDetailsForm
              :sbType="props.sbType"
              :name="props.name"
              :tier="props.tier"
              :description="props.description"
              :traits="props.traits"
              @update:sbType="v => emit('update:sbType', v)"
              @update:name="v => emit('update:name', v)"
              @update:tier="v => emit('update:tier', v)"
              @update:description="v => emit('update:description', v)"
              @update:traits="v => emit('update:traits', v)"
            />
          </template>
          <template v-else-if="steps[current].key==='details'">
            <EnemyForm v-if="props.sbType==='enemy'" :enemy="props.enemy" />
            <EnvironmentForm v-else :environment="props.environment" />
          </template>
          <template v-else>
            <div class="text-[color:var(--muted)]">Use the preview panel to the right to review your statblock. Export options are in the top toolbar.</div>
          </template>
        </div>
      </Transition>

      <div class="mt-4 flex items-center justify-between">
        <AppButton variant="outline" size="sm" :disabled="atFirst" @click="back">Back</AppButton>
        <AppButton variant="primary" size="sm" @click="next">{{ atLast ? 'Finish' : 'Next' }}</AppButton>
      </div>
    </AppCard>
  </div>
</template>

