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
        <AppButton size="lg" variant="primary" @click="emit('open-wizard')">Launch guided builder</AppButton>
        <AppButton size="lg" variant="surface" @click="emit('reset')">Start fresh</AppButton>
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
</template>

<style scoped>
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
</style>
