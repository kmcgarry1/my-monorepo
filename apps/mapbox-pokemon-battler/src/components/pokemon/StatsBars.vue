<script setup lang="ts">
type Stat = { base_stat: number; stat: { name: string } }
const props = defineProps<{ stats?: Stat[] | null }>()

const order: Array<{ key: string; label: string }> = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Atk' },
  { key: 'defense', label: 'Def' },
  { key: 'special-attack', label: 'SpA' },
  { key: 'special-defense', label: 'SpD' },
  { key: 'speed', label: 'Spe' },
]

function findStat(key: string) {
  const arr = props.stats || []
  return arr.find((s) => s.stat?.name === key)?.base_stat ?? 0
}

function percent(val: number) {
  const max = 200 // scale max for bar width
  return Math.min(100, Math.round((val / max) * 100))
}

function tierColor(val: number) {
  if (val <= 50) return 'var(--md-sys-color-error)'
  if (val <= 80) return 'color-mix(in srgb, var(--md-sys-color-tertiary) 60%, var(--md-sys-color-primary) 20%)'
  if (val <= 120) return 'color-mix(in srgb, var(--md-sys-color-tertiary) 70%, var(--md-sys-color-primary) 30%)'
  return 'color-mix(in srgb, var(--md-sys-color-primary) 80%, white 8%)'
}

function total() {
  return (props.stats || []).reduce((a, s) => a + (s.base_stat || 0), 0)
}
</script>

<template>
  <div class="stats-grid">
    <div class="stat-row" v-for="s in order" :key="s.key">
      <div class="stat-label">{{ s.label }}</div>
      <div class="stat-track" :style="{ '--fill-color': tierColor(findStat(s.key)) }">
        <div class="stat-fill" :style="{ width: percent(findStat(s.key)) + '%' }"></div>
      </div>
      <div class="stat-value">{{ findStat(s.key) }}</div>
    </div>
    <div class="stat-row">
      <div class="stat-label">BST</div>
      <div class="stat-track" :style="{ '--fill-color': 'var(--md-sys-color-primary)' }">
        <div class="stat-fill" :style="{ width: Math.min(100, Math.round((total()/720)*100)) + '%' }"></div>
      </div>
      <div class="stat-value">{{ total() }}</div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  gap: 0.5rem;
  width: 100%;
}

.stat-row {
  display: grid;
  grid-template-columns: 40px 1fr 48px;
  gap: 0.75rem;
  align-items: center;
}

.stat-label {
  font-weight: 600;
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 82%, transparent);
}

.stat-track {
  position: relative;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  background: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--md-sys-color-outline) 40%, transparent);
}

.stat-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: inherit;
  background: var(--fill-color);
  transition: width 220ms var(--motion-easing-standard);
}

.stat-value {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 88%, transparent);
}
</style>
