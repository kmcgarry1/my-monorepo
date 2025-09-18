<script setup lang="ts">
import { computed } from 'vue'
import type { Enemy, Environment } from '../types'

const props = defineProps<{
  sbType: 'enemy' | 'environment'
  enemy: Enemy
  environment: Environment
}>()

const title = computed(() => {
  const isEnemy = props.sbType === 'enemy'
  const sb = isEnemy ? props.enemy : props.environment
  const parts = [sb.name || (isEnemy ? 'New Enemy' : 'New Environment')]
  if (sb.tier != null && sb.tier !== ('' as any)) parts.push(`Tier ${sb.tier}`)
  if (isEnemy && props.enemy.rank) parts.push(props.enemy.rank)
  if (!isEnemy && props.environment.category) parts.push(props.environment.category)
  return parts.join(' • ')
})
</script>

<template>
  <div class="print-root">
    <div class="block statblock" :class="props.sbType">
      <h1 class="title">{{ title }}</h1>
      <p v-if="(props.sbType==='enemy' ? props.enemy.description : props.environment.description)" class="desc">
        {{ props.sbType==='enemy' ? props.enemy.description : props.environment.description }}
      </p>

      <template v-if="props.sbType==='enemy'">
        <p class="meta">Difficulty {{ props.enemy.difficulty ?? '—' }} • Thresholds {{ props.enemy.thresholds || '—' }} • HP {{ props.enemy.hp ?? '—' }} • Stress {{ props.enemy.stress ?? '—' }}</p>
        <p v-if="props.enemy.atkBonus != null" class="meta">ATK +{{ props.enemy.atkBonus }}</p>
        <div v-if="props.enemy.attacks.length">
          <h2>Attacks</h2>
          <ul>
            <li v-for="a in props.enemy.attacks" :key="a.id"><strong>{{ a.name || '—' }}</strong>: {{ a.range || '—' }} | {{ a.details || '—' }}</li>
          </ul>
        </div>
        <p v-if="props.enemy.experience"><strong>Experience:</strong> {{ props.enemy.experience }}</p>
        <p v-if="props.enemy.tactics"><strong>Motives & Tactics:</strong> {{ props.enemy.tactics }}</p>
        <div v-if="props.enemy.features.length">
          <h2>Features</h2>
          <div v-for="f in props.enemy.features" :key="f.id" class="feature">
            <div class="feature-head"><strong>{{ f.name || '—' }}</strong><span v-if="f.tag"> • {{ f.tag }}</span><span v-if="f.cost"> • {{ f.cost }}</span></div>
            <div v-if="f.text" class="feature-body">{{ f.text }}</div>
          </div>
        </div>
      </template>

      <template v-else>
        <p class="meta">Difficulty {{ props.environment.difficulty ?? '—' }}</p>
        <p v-if="props.environment.impulses"><strong>Impulses:</strong> {{ props.environment.impulses }}</p>
        <div v-if="props.environment.features.length">
          <h2>Features</h2>
          <div v-for="f in props.environment.features" :key="f.id" class="feature">
            <div class="feature-head"><strong>{{ f.name || '—' }}</strong><span v-if="f.tag"> • {{ f.tag }}</span><span v-if="f.cost"> • {{ f.cost }}</span></div>
            <div v-if="f.text" class="feature-body">{{ f.text }}</div>
          </div>
        </div>
        <p v-if="props.environment.potential"><strong>Potential Adversaries:</strong> {{ props.environment.potential }}</p>
        <div v-if="props.environment.prompts">
          <h2>GM Prompts</h2>
          <pre class="prompts">{{ props.environment.prompts }}</pre>
        </div>
      </template>
    </div>
  </div>
  
</template>

<style scoped>
.print-root { display: none; }
.block { page-break-inside: avoid; }
.title { font-size: 24pt; margin: 0 0 .2in; }
.desc { margin: 0 0 .15in; }
.meta { color: #555; margin: 0 0 .1in; }
.feature { margin: .05in 0; }
.feature-head { font-size: 11pt; }
.feature-body { white-space: pre-wrap; }
.prompts { white-space: pre-wrap; }
@media print {
  :host { display:block; }
  .print-root { display: block; }
}
</style>
