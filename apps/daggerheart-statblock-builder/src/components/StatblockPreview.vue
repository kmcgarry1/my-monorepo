<script setup lang="ts">
import { computed } from 'vue'
import type { Enemy, Environment, Feature, Attack } from '../types'
import { getTierGuide } from '../lib/tierGuides'

const props = defineProps<{
  sbType: 'enemy' | 'environment'
  enemy: Enemy
  environment: Environment
}>()

const isEnemy = computed(() => props.sbType === 'enemy')
const active = computed<Enemy | Environment>(() => (isEnemy.value ? props.enemy : props.environment))

const title = computed(() => {
  const raw = (active.value.name || '').trim()
  if (raw) return raw.toUpperCase()
  return isEnemy.value ? 'UNTITLED ENEMY' : 'UNTITLED ENVIRONMENT'
})

const subtitle = computed(() => (active.value.archetype || '').trim())
const description = computed(() => (active.value.description || '').trim())

const traits = computed(() =>
  (active.value.traits || '')
    .split(',')
    .map((trait) => trait.trim())
    .filter(Boolean)
)

const primaryTag = computed(() => {
  if (isEnemy.value) return (props.enemy.rank || 'Enemy').toUpperCase()
  return (props.environment.category || 'Environment').toUpperCase()
})

const difficulty = computed(() => {
  const raw = isEnemy.value ? props.enemy.difficulty : props.environment.difficulty
  return raw != null && raw !== ('' as any) ? String(raw) : '—'
})

const tierGuide = computed(() => {
  const tier = active.value.tier
  if (tier == null || tier === ('' as any)) return null
  return getTierGuide(Number(tier)) ?? null
})

const featureIcons: Record<Feature['tag'], string> = {
  Passive: '○',
  Action: '✦',
  Reaction: '☠'
}

const features = computed(() => {
  const source = (isEnemy.value ? props.enemy.features : props.environment.features) as Feature[]
  return source.map((feature) => ({
    id: feature.id,
    name: feature.name?.trim() || 'Unnamed Feature',
    tag: feature.tag,
    icon: featureIcons[feature.tag] ?? '○',
    cost: feature.cost?.trim() || '',
    text: feature.text?.trim() || ''
  }))
})

const attacks = computed(() => (isEnemy.value ? props.enemy.attacks : []) as Attack[])

const infoBlocks = computed(() => {
  if (isEnemy.value) {
    const sections: Array<{ label: string; text: string }> = []
    if (props.enemy.experience?.trim()) sections.push({ label: 'Experience', text: props.enemy.experience })
    if (props.enemy.tactics?.trim()) sections.push({ label: 'Motives & Tactics', text: props.enemy.tactics })
    return sections
  }
  const env = props.environment
  const sections: Array<{ label: string; text: string }> = []
  if (env.impulses?.trim()) sections.push({ label: 'Impulses', text: env.impulses })
  if (env.potential?.trim()) sections.push({ label: 'Potential Adversaries', text: env.potential })
  if (env.prompts?.trim()) sections.push({ label: 'Prompts', text: env.prompts })
  return sections
})

const ctaLabel = computed(() => {
  if (isEnemy.value) return ''
  const potential = props.environment.potential?.trim()
  if (!potential) return ''
  const firstLine = potential.split(/\r?\n/).find((line) => line.trim().length > 0)
  return firstLine ? firstLine.trim().toUpperCase() : ''
})

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderRichText(text: string) {
  const lines = text.split(/\r?\n/)
  const html: string[] = []
  let inList = false
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      if (inList) {
        html.push('</ul>')
        inList = false
      }
      continue
    }
    if (/^[-•]/.test(line)) {
      if (!inList) {
        html.push('<ul>')
        inList = true
      }
      const content = escapeHtml(line.replace(/^[-•]\s*/, ''))
      html.push(`<li>${content}</li>`)
      continue
    }
    if (inList) {
      html.push('</ul>')
      inList = false
    }
    let content = escapeHtml(line)
    content = content.replace(/_(.+?)_/g, '<em>$1</em>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    html.push(`<p>${content}</p>`)
  }
  if (inList) html.push('</ul>')
  return html.join('')
}
</script>

<template>
  <section class="statblock-card">
    <div class="statblock-ribbon">{{ primaryTag }}</div>
    <header class="statblock-header">
      <div class="header-text">
        <p class="statblock-label">{{ isEnemy ? 'Enemy statblock' : 'Environment statblock' }}</p>
        <h1 class="statblock-title">{{ title }}</h1>
        <p v-if="subtitle" class="statblock-subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-meta">
        <div class="difficulty-box">
          <span class="meta-label">Difficulty</span>
          <span class="meta-value">{{ difficulty }}</span>
        </div>
        <div v-if="tierGuide" class="tier-chip">
          <span>{{ tierGuide.tier }}</span>
        </div>
      </div>
    </header>

    <div class="statblock-divider"></div>

    <section v-if="description" class="statblock-section">
      <p class="statblock-paragraph">{{ description }}</p>
    </section>

    <section v-if="traits.length" class="statblock-section">
      <ul class="trait-list">
        <li v-for="trait in traits" :key="trait">{{ trait }}</li>
      </ul>
    </section>

    <section v-if="features.length" class="statblock-section">
      <div class="section-heading">
        <span>Features</span>
      </div>
      <div class="feature-list">
        <article v-for="feature in features" :key="feature.id" class="feature-card">
          <header class="feature-header">
            <span class="feature-icon">{{ feature.icon }}</span>
            <span class="feature-name">{{ feature.name }}</span>
            <span class="feature-tag">{{ feature.tag }}</span>
            <span v-if="feature.cost" class="feature-cost">{{ feature.cost }}</span>
          </header>
          <div v-if="feature.text" class="feature-body" v-html="renderRichText(feature.text)"></div>
        </article>
      </div>
    </section>

    <section v-if="attacks.length" class="statblock-section">
      <div class="section-heading">
        <span>Actions</span>
      </div>
      <div class="feature-list">
        <article v-for="attack in attacks" :key="attack.id" class="feature-card">
          <header class="feature-header">
            <span class="feature-icon">✥</span>
            <span class="feature-name">{{ attack.name || 'Unnamed Attack' }}</span>
            <span v-if="attack.range" class="feature-tag">{{ attack.range }}</span>
          </header>
          <div v-if="attack.details" class="feature-body" v-html="renderRichText(attack.details)"></div>
        </article>
      </div>
    </section>

    <section v-if="infoBlocks.length" class="statblock-section">
      <div class="section-heading dotted">
        <span>{{ isEnemy ? 'Intel' : 'Scene Notes' }}</span>
      </div>
      <div class="info-blocks">
        <article v-for="block in infoBlocks" :key="block.label" class="info-card">
          <h4>{{ block.label }}</h4>
          <div class="feature-body" v-html="renderRichText(block.text)"></div>
        </article>
      </div>
    </section>

    <footer v-if="ctaLabel" class="statblock-footer">
      <div class="section-heading subtle">
        <span>Summons</span>
      </div>
      <button class="cta-chip" type="button">{{ ctaLabel }}</button>
    </footer>
  </section>
</template>

<style scoped>
.statblock-card {
  position: relative;
  background: linear-gradient(180deg, rgba(36, 28, 76, 0.97), rgba(20, 16, 54, 0.98));
  color: rgba(248, 245, 255, 0.95);
  padding: 1.7rem 1.55rem 1.65rem;
  border-radius: 1.6rem;
  box-shadow: 0 22px 50px rgba(12, 10, 40, 0.48);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
}

.statblock-card::before {
  content: '';
  position: absolute;
  inset: -20% 30% auto -20%;
  height: 40%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 72%);
  opacity: 0.55;
  pointer-events: none;
}

.statblock-ribbon {
  position: absolute;
  top: 1.05rem;
  right: -1.1rem;
  background: linear-gradient(135deg, #fdd374, #f59e25);
  color: #311900;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0.42rem 2.6rem 0.42rem 1.4rem;
  clip-path: polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%);
  box-shadow: 0 12px 24px rgba(253, 195, 92, 0.35);
}

.statblock-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.75rem;
  position: relative;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-width: min(26rem, 100%);
}

.statblock-label {
  margin: 0;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.58);
}

.statblock-title {
  margin: 0;
  font-size: 1.58rem;
  letter-spacing: 0.09em;
}

.statblock-subtitle {
  margin: 0;
  font-size: 0.88rem;
  color: rgba(229, 224, 255, 0.72);
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.difficulty-box {
  display: flex;
  flex-direction: column;
  padding: 0.62rem 1rem;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 0.95rem;
  min-width: 116px;
  text-align: center;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.meta-label {
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.meta-value {
  font-size: 1.04rem;
  font-weight: 700;
  margin-top: 0.18rem;
}

.tier-chip {
  display: grid;
  place-items: center;
  width: 2.05rem;
  height: 2.05rem;
  border-radius: 50%;
  background: rgba(253, 195, 92, 0.93);
  color: #351d00;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 12px 24px rgba(253, 195, 92, 0.35);
}

.statblock-divider {
  border-top: 1px dashed rgba(255, 255, 255, 0.18);
  margin: -0.25rem -0.25rem 0;
}

.statblock-section {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.statblock-paragraph {
  margin: 0;
  font-size: 0.94rem;
  line-height: 1.55;
  color: rgba(239, 236, 255, 0.88);
}

.trait-list {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.32rem;
  font-size: 0.9rem;
  color: rgba(239, 236, 255, 0.85);
}

.section-heading {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(249, 228, 255, 0.78);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-heading::after {
  content: '';
  flex: 1;
  height: 1px;
  background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.45) 15%, rgba(255, 255, 255, 0) 70%);
}

.section-heading.dotted::after {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.5) 18%, rgba(255, 255, 255, 0) 21%);
  background-size: 6px 6px;
}

.section-heading.subtle {
  color: rgba(249, 193, 73, 0.72);
}

.section-heading.subtle::after {
  background-image: radial-gradient(circle, rgba(249, 193, 73, 0.65) 18%, rgba(249, 193, 73, 0) 21%);
  background-size: 6px 6px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 0.9rem 1.05rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: wrap;
  margin-bottom: 0.45rem;
}

.feature-icon {
  font-size: 0.78rem;
  line-height: 1;
  color: rgba(249, 193, 73, 0.82);
}

.feature-name {
  font-weight: 700;
  font-size: 0.96rem;
  letter-spacing: 0.01em;
}

.feature-tag {
  padding: 0.18rem 0.55rem;
  border-radius: var(--radius-pill);
  background: rgba(249, 193, 73, 0.18);
  color: rgba(249, 193, 73, 0.92);
  text-transform: uppercase;
  font-size: 0.63rem;
  letter-spacing: 0.16em;
}

.feature-cost {
  margin-left: auto;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.72);
  font-style: italic;
}

.feature-body {
  font-size: 0.92rem;
  line-height: 1.55;
  color: rgba(239, 236, 255, 0.88);
}

.feature-body ul {
  margin: 0.35rem 0 0.35rem 1.2rem;
  padding: 0;
  list-style: disc;
}

.feature-body ul li {
  margin-bottom: 0.3rem;
}

.feature-body p {
  margin: 0.22rem 0;
}

.feature-body em {
  font-style: italic;
  color: rgba(249, 193, 73, 0.85);
}

.info-blocks {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.info-card {
  padding: 0.92rem 1rem;
  border-radius: 1rem;
  background: rgba(18, 16, 44, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.info-card h4 {
  margin: 0 0 0.42rem;
  font-size: 0.9rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.statblock-footer {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.cta-chip {
  background: rgba(249, 193, 73, 0.2);
  color: rgba(249, 193, 73, 0.92);
  border: 1px solid rgba(249, 193, 73, 0.48);
  border-radius: var(--radius-pill);
  padding: 0.5rem 1.25rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 700;
  align-self: flex-start;
}

@media (max-width: 640px) {
  .statblock-card {
    padding: 1.4rem 1.1rem;
    border-radius: 1.25rem;
    gap: 1.25rem;
  }

  .statblock-header {
    flex-direction: column;
    gap: 1.1rem;
  }

  .statblock-ribbon {
    right: -0.8rem;
  }
}
</style>
