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
  padding: clamp(1.2rem, 4vw, 3rem);
  background: radial-gradient(circle at 15% 20%, rgba(82, 62, 155, 0.24), transparent 55%),
    radial-gradient(circle at 80% 80%, rgba(34, 160, 195, 0.18), transparent 60%),
    rgba(12, 10, 32, 0.58);
  backdrop-filter: blur(26px);
  z-index: 50;
}

.wizard-dialog {
  width: min(1160px, 100%);
  max-height: clamp(70vh, 86vh, 900px);
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  padding: 1.9rem;
  border-radius: 2rem;
  border: 1px solid color-mix(in srgb, var(--border) 24%, transparent);
  background: color-mix(in srgb, var(--surface) 96%, transparent);
  box-shadow: 0 32px 70px rgba(12, 10, 40, 0.32);
  backdrop-filter: blur(24px);
}

.wizard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 26%, transparent);
  padding-bottom: 1.1rem;
}

.eyebrow {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 78%, transparent);
}

.wizard-header h2 {
  margin: 0.25rem 0 0;
  font-size: 1.4rem;
  letter-spacing: 0.04em;
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
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.wizard-fade-enter-from,
.wizard-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

@media (max-width: 768px) {
  .wizard-dialog {
    padding: 1.35rem;
    border-radius: 1.6rem;
  }
}
</style>
