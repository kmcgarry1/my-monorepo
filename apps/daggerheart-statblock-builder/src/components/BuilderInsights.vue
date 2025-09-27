<script setup lang="ts">
import { AppBadge, AppCard, AppCol, AppRow, AppText } from '@my-monorepo/ui'

type SummaryItem = { label: string; value: string }
type TierCallout = { heading: string; summary: string; focus: string } | null

defineProps<{
  summaryMeta: SummaryItem[]
  tierCallout: TierCallout
  typeLabel: string
}>()
</script>

<template>
  <AppRow class="insight-grid" :cols="2" gap="lg">
    <AppCol :span="2">
      <AppCard
        padding="lg"
        variant="surface"
        overline="Summary"
        title="Quick snapshot"
        subtitle="Use the guided modal to capture every detail. This panel updates as you go."
        class="summary-card"
      >
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
      <AppCard
        padding="lg"
        variant="surface"
        overline="Workflow"
        title="Tips while you build"
        class="tips-card"
      >
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
      <AppCard
        padding="lg"
        variant="surface"
        overline="Tier insights"
        :title="tierCallout.heading"
        class="tier-card"
      >
        <AppText variant="muted" size="sm" class="tier-summary">{{ tierCallout.summary }}</AppText>
        <div class="tier-focus">
          <AppBadge size="xs" variant="neutral">{{ typeLabel }} focus</AppBadge>
          <AppText variant="body" size="sm">{{ tierCallout.focus }}</AppText>
        </div>
      </AppCard>
    </AppCol>
  </AppRow>
</template>

<style scoped>
.insight-grid {
  width: 100%;
}

.summary-card,
.tips-card,
.tier-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  isolation: isolate;
}

.summary-card::after,
.tips-card::after,
.tier-card::after {
  content: '';
  position: absolute;
  inset: auto;
  border-radius: 999px;
  pointer-events: none;
  opacity: 0.35;
  filter: blur(28px);
}

.summary-card::after {
  width: 40%;
  height: 160px;
  bottom: -90px;
  right: -15%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%);
}

.tips-card::after {
  width: 36%;
  height: 140px;
  top: -80px;
  left: -20%;
  background: radial-gradient(circle, color-mix(in srgb, var(--md-sys-color-secondary) 14%, transparent), transparent 75%);
}

.tier-card::after {
  width: 34%;
  height: 120px;
  bottom: -70px;
  left: 30%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 72%);
}

.summary-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.summary-item {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 72%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 32%, transparent);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  transition: transform var(--motion-duration-sm) var(--motion-easing-emphasized),
    box-shadow var(--motion-duration-sm) var(--motion-easing-emphasized);
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-level2);
}

.summary-label {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 83%, transparent);
}

.summary-value {
  font-size: 1.02rem;
  font-weight: 600;
}

.empty-state {
  margin: 0;
}

.tips-list {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
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
  background: color-mix(in srgb, var(--surface-veil) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 32%, transparent);
}

.tier-focus :deep(p) {
  margin: 0;
}
</style>
