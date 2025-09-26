<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { AppIconButton } from '@my-monorepo/ui'
import WizardBuilder from './WizardBuilder.vue'
import type { Enemy, Environment } from '../types'

const props = defineProps<{
  open: boolean
  displayName: string
  wizardKey: number
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
  (e: 'close'): void
  (e: 'finish'): void
  (e: 'update:sbType', value: 'enemy' | 'environment'): void
  (e: 'update:name', value: string): void
  (e: 'update:archetype', value: string): void
  (e: 'update:tier', value: number | null): void
  (e: 'update:description', value: string): void
  (e: 'update:traits', value: string): void
}>()

let listening = false

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
}

watch(
  () => props.open,
  (open) => {
    document.body.style.setProperty('overflow', open ? 'hidden' : '')

    if (open && !listening) {
      window.addEventListener('keydown', onKeydown)
      listening = true
    }

    if (!open && listening) {
      window.removeEventListener('keydown', onKeydown)
      listening = false
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (listening) {
    window.removeEventListener('keydown', onKeydown)
  }
  document.body.style.removeProperty('overflow')
})
</script>

<template>
  <Transition name="wizard-fade">
    <div
      v-if="open"
      class="wizard-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Daggerheart statblock builder"
      @click.self="emit('close')"
    >
      <div class="wizard-dialog">
        <header class="wizard-header">
          <div>
            <p class="eyebrow">Guided builder</p>
            <h2>{{ displayName }}</h2>
          </div>
          <AppIconButton name="x" variant="outline" title="Close builder" @click="emit('close')" />
        </header>
        <div class="wizard-body">
          <WizardBuilder
            :key="wizardKey"
            :sbType="sbType"
            :enemy="enemy"
            :environment="environment"
            :name="name"
            :archetype="archetype"
            :tier="tier"
            :description="description"
            :traits="traits"
            @update:sbType="(value) => emit('update:sbType', value)"
            @update:name="(value) => emit('update:name', value)"
            @update:archetype="(value) => emit('update:archetype', value)"
            @update:tier="(value) => emit('update:tier', value)"
            @update:description="(value) => emit('update:description', value)"
            @update:traits="(value) => emit('update:traits', value)"
            @finish="emit('finish')"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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

.eyebrow {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 82%, transparent);
}

.wizard-body {
  flex: 1;
  min-height: 0;
}

.wizard-body :deep(.wizard-shell) {
  height: 100%;
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

@media (max-width: 768px) {
  .wizard-dialog {
    padding: 1.25rem;
  }
}
</style>
