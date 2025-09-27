<script setup lang="ts">
import { AppBadge, AppButton, AppCard, AppText } from '@my-monorepo/ui'

type HighlightMeta = { label: string; value: string }

defineProps<{
  displayName: string
  typeLabel: string
  summaryMessage: string
  tierStatus: string
  highlightedMeta: HighlightMeta[]
}>()

const emit = defineEmits<{ (e: 'open-wizard'): void; (e: 'reset'): void }>()
</script>

<template>
  <AppCard
    padding="lg"
    variant="surface"
    overline="Currently editing"
    class="hero-card"
  >
    <template #header>
      <div class="hero-header">
        <div class="hero-heading">
          <AppText as="h1" variant="display" class="hero-title">{{ displayName }}</AppText>
          <AppBadge variant="accent" size="sm" class="hero-type">{{ typeLabel }}</AppBadge>
        </div>
        <div class="hero-actions">
          <AppButton size="lg" variant="primary" class="primary" @click="emit('open-wizard')">
            Launch guided builder
          </AppButton>
          <AppButton size="lg" variant="surface" class="ghost" @click="emit('reset')">Start fresh</AppButton>
        </div>
      </div>
    </template>

    <section class="hero-summary">
      <AppText variant="body" size="lg" class="hero-lead">{{ summaryMessage }}</AppText>
      <AppText variant="muted" size="sm" class="hero-note">
        Saved automatically — export whenever you're ready using the toolbar.
      </AppText>
    </section>

    <div class="hero-highlights">
      <div class="highlight-card tier">
        <span class="highlight-label">Tier status</span>
        <span class="highlight-value">{{ tierStatus }}</span>
      </div>
      <div v-for="item in highlightedMeta" :key="item.label" class="highlight-card">
        <span class="highlight-label">{{ item.label }}</span>
        <span class="highlight-value">{{ item.value }}</span>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.hero-card {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: color-mix(in srgb, var(--surface-translucent) 94%, transparent);
}

.hero-card::before,
.hero-card::after {
  content: '';
  position: absolute;
  pointer-events: none;
  inset: auto;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.6;
}

.hero-card::before {
  width: 60%;
  height: 240px;
  bottom: -120px;
  right: -20%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 26%, transparent), transparent 65%);
}

.hero-card::after {
  width: 45%;
  height: 200px;
  top: -140px;
  left: -10%;
  background: radial-gradient(circle, color-mix(in srgb, var(--md-sys-color-secondary) 18%, transparent), transparent 70%);
}

.hero-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: flex-end;
  justify-content: space-between;
}

.hero-heading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.hero-title {
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.hero-type {
  align-self: flex-start;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: flex-end;
}

.hero-actions :deep(.primary) {
  min-width: 14rem;
}

.hero-summary {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hero-lead {
  margin: 0;
  max-width: 52rem;
  font-size: clamp(1.125rem, 1.1vw + 1rem, 1.35rem);
}

.hero-note {
  margin: 0;
}

.hero-highlights {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.highlight-card {
  position: relative;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-lg);
  border: none;
  background: var(--glass-surface-strong);
  box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition: transform var(--motion-duration-sm) var(--motion-easing-emphasized),
    box-shadow var(--motion-duration-sm) var(--motion-easing-emphasized);
}

.highlight-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--glass-shadow-md), var(--glass-highlight);
}

.highlight-card.tier {
  background: color-mix(in srgb, var(--accent-weak) 42%, transparent);
  box-shadow: var(--glass-shadow-md), var(--glass-highlight), 0 18px 36px rgba(103, 80, 164, 0.25);
}

.highlight-label {
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 85%, transparent);
}

.highlight-card.tier .highlight-label {
  color: color-mix(in srgb, var(--accent) 80%, var(--muted) 30%);
}

.highlight-value {
  font-weight: 600;
  font-size: 1.05rem;
}

@media (min-width: 960px) {
  .hero-header {
    align-items: flex-start;
  }

  .hero-actions {
    align-items: center;
  }
}
</style>
