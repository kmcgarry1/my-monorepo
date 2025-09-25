<script setup lang="ts">
import { computed } from 'vue'
import type { Enemy, Environment } from '../types'
import { AppBadge, AppCard, AppText } from '@my-monorepo/ui'
const props = defineProps<{
  sbType: 'enemy' | 'environment'
  enemy: Enemy
  environment: Environment
}>()

const title = computed(() => {
  const isEnemy = props.sbType === 'enemy'
  const sb = isEnemy ? props.enemy : props.environment
  const parts = [sb.name || (isEnemy ? 'New Enemy' : 'New Environment')]
  if (sb.tier != null && sb.tier !== ('' as any)) parts.push(`— Tier ${sb.tier}`)
  if (isEnemy && props.enemy.rank) parts.push(props.enemy.rank)
  if (!isEnemy && props.environment.category) parts.push(props.environment.category)
  return parts.join(' ')
})
</script>

<template>
  <AppCard :title="'Preview'" variant="elevated" padding="md">
    <div>
      <h3 class="mb-2 mt-1 text-base font-semibold">{{ title }}</h3>
      <AppText v-if="(props.sbType==='enemy' ? props.enemy.description : props.environment.description)" variant="lead" class="mt-1">
        {{ props.sbType==='enemy' ? props.enemy.description : props.environment.description }}
      </AppText>
      <div v-if="(props.sbType==='enemy' ? props.enemy.traits : props.environment.traits)" class="mt-1 flex flex-wrap gap-1">
        <AppBadge v-for="t in (props.sbType==='enemy' ? props.enemy.traits : props.environment.traits).split(',').map(s=>s.trim()).filter(Boolean)" :key="t" variant="neutral">{{ t }}</AppBadge>
      </div>

      <template v-if="props.sbType==='enemy'">
            <p style="margin:.25rem 0;">Difficulty: {{ props.enemy.difficulty ?? '—' }} | Thresholds: {{ props.enemy.thresholds || '—' }} | HP: {{ props.enemy.hp ?? '—' }} | Stress: {{ props.enemy.stress ?? '—' }}</p>
            <p v-if="props.enemy.atkBonus != null" style="margin:.25rem 0;">ATK: +{{ props.enemy.atkBonus }}</p>
            <div v-if="props.enemy.attacks.length" style="margin:.25rem 0;">
              <div v-for="a in props.enemy.attacks" :key="a.id" class="flex items-center gap-2">
                <strong>{{ a.name || '—' }}</strong>
                <AppBadge variant="accent">{{ a.range || '—' }}</AppBadge>
                <span class="font-mono">{{ a.details || '—' }}</span>
              </div>
            </div>
        <p v-if="props.enemy.experience" style="margin:.25rem 0;">Experience: {{ props.enemy.experience }}</p>
        <p v-if="props.enemy.tactics" style="margin:.25rem 0;">Motives & Tactics: {{ props.enemy.tactics }}</p>
        <div v-if="props.enemy.features.length" style="margin-top:.5rem;">
          <h4 style="margin:.25rem 0;">Features</h4>
          <div v-for="f in props.enemy.features" :key="f.id" style="margin:.25rem 0;">
            <strong>{{ f.name || '—' }}</strong>
            <span v-if="f.tag"> - {{ f.tag }}</span>
            <span v-if="f.cost">: {{ f.cost }}</span>
            <div v-if="f.text">
              <pre style="white-space:pre-wrap; margin:.25rem 0 0;">{{ f.text }}</pre>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <p style="margin:.25rem 0;">Difficulty: {{ props.environment.difficulty ?? '—' }}</p>
        <p v-if="props.environment.impulses" style="margin:.25rem 0;">Impulses: {{ props.environment.impulses }}</p>
        <div v-if="props.environment.features.length" style="margin-top:.5rem;">
          <h4 style="margin:.25rem 0;">Features</h4>
          <div v-for="f in props.environment.features" :key="f.id" style="margin:.25rem 0;">
            <strong>{{ f.name || '—' }}</strong>
            <span v-if="f.tag"> - {{ f.tag }}</span>
            <span v-if="f.cost">: {{ f.cost }}</span>
            <div v-if="f.text">
              <pre style="white-space:pre-wrap; margin:.25rem 0 0;">{{ f.text }}</pre>
            </div>
          </div>
        </div>
        <p v-if="props.environment.potential" style="margin:.25rem 0;">Potential Adversaries: {{ props.environment.potential }}</p>
        <div v-if="props.environment.prompts">
          <h4 style="margin:.25rem 0;">GM Prompts</h4>
          <pre style="white-space:pre-wrap; margin:.25rem 0 0;">{{ props.environment.prompts }}</pre>
        </div>
      </template>
    </div>
  </AppCard>
</template>
