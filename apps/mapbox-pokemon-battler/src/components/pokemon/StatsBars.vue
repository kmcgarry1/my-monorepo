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

function tier(val: number) {
  if (val <= 50) return 'bg-red-500'
  if (val <= 80) return 'bg-amber-500'
  if (val <= 120) return 'bg-green-500'
  return 'bg-blue-500'
}

function total() {
  return (props.stats || []).reduce((a, s) => a + (s.base_stat || 0), 0)
}
</script>

<template>
  <div class="grid gap-[0.35rem] w-full">
    <div class="grid [grid-template-columns:36px_1fr_42px] items-center gap-2" v-for="s in order" :key="s.key">
      <div class="font-semibold text-[0.85rem] opacity-85">{{ s.label }}</div>
      <div class="h-[14px] bg-[var(--panel-border)] rounded-[6px] overflow-hidden relative border-2 border-[var(--panel-border)]">
        <div class="h-full rounded-[4px] transition-[width] duration-200 ease-linear" :class="tier(findStat(s.key))" :style="{ width: percent(findStat(s.key)) + '%' }"></div>
      </div>
      <div class="text-right [font-variant-numeric:tabular-nums] font-semibold min-w-[36px]">{{ findStat(s.key) }}</div>
    </div>
    <div class="grid [grid-template-columns:36px_1fr_42px] items-center gap-2">
      <div class="font-semibold text-[0.85rem] opacity-85">BST</div>
      <div class="h-[10px] bg-[var(--panel-border)] rounded-[6px] overflow-hidden relative border-2 border-[var(--panel-border)]">
        <div class="h-full rounded-[4px] transition-[width] duration-200 ease-linear bg-[var(--accent)]" :style="{ width: Math.min(100, Math.round((total()/720)*100)) + '%' }"></div>
      </div>
      <div class="text-right [font-variant-numeric:tabular-nums] font-semibold min-w-[36px]">{{ total() }}</div>
    </div>
  </div>
  
</template>

<style scoped>
</style>
