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
      <AppCard padding="lg" variant="surface" class="summary-card">
        <AppText as="h2" variant="title" class="section-title">Quick summary</AppText>
        <AppText variant="muted" size="sm" class="section-subtitle">
          Use the guided modal to capture every detail. This panel updates as you go.
        </AppText>
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
      <AppCard padding="lg" variant="surface" class="tips-card">
        <AppText as="h2" variant="title" class="section-title">Workflow tips</AppText>
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
      <AppCard padding="lg" variant="surface" class="tier-card">
        <AppBadge size="xs" variant="accent" class="tier-badge">Tier insights</AppBadge>
        <AppText as="h3" variant="title" class="tier-heading">{{ tierCallout.heading }}</AppText>
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

.summary-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-title {
  margin: 0;
}

.section-subtitle {
  margin: 0;
}

.summary-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.summary-item {
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 83%, transparent);
}

.summary-value {
  font-size: 1rem;
  font-weight: 600;
}

.empty-state {
  margin: 0;
}

.tips-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tips-list {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.tier-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tier-heading {
  margin: 0;
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
  background: color-mix(in srgb, var(--surface-veil) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
}

.tier-focus :deep(p) {
  margin: 0;
}
</style>
