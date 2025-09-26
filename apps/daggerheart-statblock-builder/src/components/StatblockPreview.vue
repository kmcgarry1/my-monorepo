<script setup lang="ts">
import { computed } from 'vue'
import type { Enemy, Environment } from '../types'
import { AppBadge, AppCard, AppText } from '@my-monorepo/ui'
import { getTierGuide } from '../lib/tierGuides'

const props = defineProps<{
  sbType: 'enemy' | 'environment'
  enemy: Enemy
  environment: Environment
}>()

const isEnemy = computed(() => props.sbType === 'enemy')
const enemyData = computed(() => props.enemy)
const environmentData = computed(() => props.environment)

const activeBlock = computed(() => (isEnemy.value ? enemyData.value : environmentData.value))

const title = computed(() => {
  const base = (activeBlock.value.name || '').trim()
  if (base) return base
  return isEnemy.value ? 'New Enemy' : 'New Environment'
})

const subtitle = computed(() => (activeBlock.value.archetype || '').trim())
const description = computed(() => (activeBlock.value.description || '').trim())

const tierInfo = computed(() => {
  const tier = activeBlock.value.tier as number | null
  if (tier != null && tier !== ('' as any)) {
    return getTierGuide(Number(tier))
  }
  return null
})

const traits = computed(() => {
  const value = activeBlock.value.traits || ''
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
})

const metaStats = computed(() => {
  const items: Array<{ label: string; value: string; hint?: string }> = []
  const tierLabel = tierInfo.value ? `Tier ${tierInfo.value.tier}` : 'Unassigned'
  items.push({ label: 'Tier', value: tierLabel, hint: tierInfo.value?.title })

  if (isEnemy.value) {
    const enemy = enemyData.value
    items.push({ label: 'Rank', value: enemy.rank || '—' })
    items.push({ label: 'Difficulty', value: enemy.difficulty != null ? String(enemy.difficulty) : '—' })
    items.push({ label: 'HP', value: enemy.hp != null ? String(enemy.hp) : '—' })
    items.push({ label: 'Stress', value: enemy.stress != null ? String(enemy.stress) : '—' })
    items.push({ label: 'Thresholds', value: enemy.thresholds || '—' })
    if (enemy.atkBonus != null) {
      items.push({ label: 'Attack Bonus', value: `+${enemy.atkBonus}` })
    }
  } else {
    const env = environmentData.value
    items.push({ label: 'Category', value: env.category || '—' })
    items.push({ label: 'Difficulty', value: env.difficulty != null ? String(env.difficulty) : '—' })
    items.push({ label: 'Impulses', value: env.impulses || '—' })
    if (env.potential) {
      items.push({ label: 'Potential Adversaries', value: env.potential })
    }
  }

  return items
})

const hasDetailContent = computed(() => {
  if (isEnemy.value) {
    const enemy = enemyData.value
    return (
      enemy.attacks.length > 0 ||
      enemy.features.length > 0 ||
      Boolean(enemy.experience) ||
      Boolean(enemy.tactics)
    )
  }

  const env = environmentData.value
  return env.features.length > 0 || Boolean(env.prompts)
})
</script>

<template>
  <AppCard padding="lg" variant="elevated" class="preview-card">
    <header class="preview-header">
      <div>
        <p class="preview-eyebrow">{{ isEnemy ? 'Enemy statblock' : 'Environment statblock' }}</p>
        <h2 class="preview-title">{{ title }}</h2>
        <p v-if="subtitle" class="preview-subtitle">{{ subtitle }}</p>
      </div>
      <div class="preview-badges">
        <AppBadge variant="accent">{{ tierInfo ? tierInfo.title : 'Tier pending' }}</AppBadge>
        <AppBadge variant="neutral">{{ isEnemy ? 'Enemy' : 'Environment' }}</AppBadge>
      </div>
    </header>

    <AppText v-if="description" variant="lead" class="preview-description">{{ description }}</AppText>

    <div v-if="traits.length" class="preview-traits">
      <AppBadge v-for="trait in traits" :key="trait" variant="neutral">{{ trait }}</AppBadge>
    </div>

    <div v-if="metaStats.length" class="preview-meta">
      <div v-for="item in metaStats" :key="item.label" class="meta-card">
        <span class="meta-label">{{ item.label }}</span>
        <span class="meta-value">{{ item.value }}</span>
        <span v-if="item.hint" class="meta-hint">{{ item.hint }}</span>
      </div>
    </div>

    <template v-if="isEnemy">
      <section v-if="enemyData.attacks.length" class="detail-section">
        <h3>Attacks</h3>
        <div class="attack-list">
          <div v-for="attack in enemyData.attacks" :key="attack.id" class="attack-item">
            <div class="attack-heading">
              <span class="attack-name">{{ attack.name || 'Unnamed attack' }}</span>
              <AppBadge v-if="attack.range" variant="accent">{{ attack.range }}</AppBadge>
            </div>
            <p v-if="attack.details" class="attack-details">{{ attack.details }}</p>
          </div>
        </div>
      </section>

      <section v-if="enemyData.features.length" class="detail-section">
        <h3>Features</h3>
        <div class="feature-list">
          <div v-for="feature in enemyData.features" :key="feature.id" class="feature-item">
            <div class="feature-head">
              <span class="feature-name">{{ feature.name || 'Unnamed feature' }}</span>
              <span v-if="feature.tag" class="feature-pill">{{ feature.tag }}</span>
              <span v-if="feature.cost" class="feature-pill muted">{{ feature.cost }}</span>
            </div>
            <p v-if="feature.text" class="feature-text">{{ feature.text }}</p>
          </div>
        </div>
      </section>

      <section v-if="enemyData.experience || enemyData.tactics" class="detail-section info-grid">
        <div v-if="enemyData.experience" class="info-card">
          <h4>Experience</h4>
          <p>{{ enemyData.experience }}</p>
        </div>
        <div v-if="enemyData.tactics" class="info-card">
          <h4>Motives &amp; Tactics</h4>
          <p>{{ enemyData.tactics }}</p>
        </div>
      </section>
    </template>

    <template v-else>
      <section v-if="environmentData.features.length" class="detail-section">
        <h3>Features</h3>
        <div class="feature-list">
          <div v-for="feature in environmentData.features" :key="feature.id" class="feature-item">
            <div class="feature-head">
              <span class="feature-name">{{ feature.name || 'Unnamed feature' }}</span>
              <span v-if="feature.tag" class="feature-pill">{{ feature.tag }}</span>
              <span v-if="feature.cost" class="feature-pill muted">{{ feature.cost }}</span>
            </div>
            <p v-if="feature.text" class="feature-text">{{ feature.text }}</p>
          </div>
        </div>
      </section>

      <section v-if="environmentData.prompts" class="detail-section">
        <h3>GM Prompts</h3>
        <pre class="prompt-text">{{ environmentData.prompts }}</pre>
      </section>
    </template>

    <p v-if="!hasDetailContent" class="preview-placeholder">
      Add more details in the guided builder to see them reflected here.
    </p>
  </AppCard>
</template>

<style scoped>
.preview-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.preview-eyebrow {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 82%, transparent);
}

.preview-title {
  margin: 0.2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.preview-subtitle {
  margin: 0.25rem 0 0;
  color: color-mix(in srgb, var(--muted) 85%, transparent);
  font-style: italic;
}

.preview-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.preview-description {
  margin-top: 0.25rem;
}

.preview-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preview-meta {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.meta-card {
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 78%, transparent);
  border: 1px solid color-mix(in srgb, var(--btn-border) 60%, transparent);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--muted) 85%, transparent);
}

.meta-value {
  font-weight: 600;
  font-size: 1rem;
}

.meta-hint {
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--muted) 80%, transparent);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-section h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.attack-list,
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attack-item,
.feature-item {
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 75%, transparent);
  border: 1px solid color-mix(in srgb, var(--btn-border) 58%, transparent);
}

.attack-heading,
.feature-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.attack-name,
.feature-name {
  font-weight: 600;
}

.attack-details,
.feature-text {
  margin: 0.4rem 0 0;
  white-space: pre-line;
  color: color-mix(in srgb, var(--muted) 85%, transparent);
  font-size: 0.9rem;
}

.feature-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: color-mix(in srgb, var(--accent) 90%, transparent);
  font-size: 0.75rem;
  font-weight: 600;
}

.feature-pill.muted {
  background: color-mix(in srgb, var(--surface-veil) 70%, transparent);
  color: color-mix(in srgb, var(--muted) 82%, transparent);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.info-card {
  padding: 0.95rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 78%, transparent);
  border: 1px solid color-mix(in srgb, var(--btn-border) 55%, transparent);
}

.info-card h4 {
  margin: 0 0 0.45rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.info-card p {
  margin: 0;
  color: color-mix(in srgb, var(--muted) 85%, transparent);
  white-space: pre-line;
}

.prompt-text {
  margin: 0;
  padding: 0.95rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 76%, transparent);
  border: 1px solid color-mix(in srgb, var(--btn-border) 58%, transparent);
  white-space: pre-wrap;
  font-size: 0.92rem;
}

.preview-placeholder {
  margin: 0;
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--surface-veil) 72%, transparent);
  border: 1px dashed color-mix(in srgb, var(--btn-border) 58%, transparent);
  color: color-mix(in srgb, var(--muted) 82%, transparent);
  text-align: center;
  font-size: 0.88rem;
}

@media (max-width: 600px) {
  .preview-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .preview-badges {
    flex-direction: row;
  }
}
</style>
