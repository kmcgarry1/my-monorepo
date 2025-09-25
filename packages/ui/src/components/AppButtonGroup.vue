<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '../utils/variants'

const props = withDefaults(defineProps<{
  modelValue: string
  options: { label: string; value: string }[]
  size?: 'sm'|'md'|'lg'
  variant?: 'default'|'primary'|'secondary'|'danger'|'ghost'|'outline'|'subtle'|'accent'
}>(), { size: 'md', variant: 'default' })
const emit = defineEmits<{ (e:'update:modelValue', v:string): void }>()

const sizeClass = computed(() => props.size==='sm' ? 'py-1.5 text-[0.62rem]' : props.size==='lg' ? 'py-2.5 text-[0.82rem]' : 'py-2 text-[0.72rem]')

function itemClass(active: boolean) {
  const base = 'px-3 transition-all duration-150 uppercase tracking-[0.14em] font-semibold border-r last:border-r-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--surface)]'
  const paletteActive = props.variant==='primary' || props.variant==='accent'
    ? 'bg-[color:var(--accent)] text-[color:var(--bg)] shadow-[var(--shadow-button-hover)] border-[color:var(--accent)]'
    : props.variant==='danger'
    ? 'bg-[#fb7185] text-white shadow-[var(--shadow-button-hover)] border-[#fb7185]'
    : 'bg-[color:var(--surface-veil)] text-[color:var(--fg)] border-[color:var(--btn-border)]'
  const paletteIdle = props.variant==='ghost'
    ? 'text-[color:var(--fg)] border-transparent hover:bg-[color:var(--surface-translucent)]'
    : props.variant==='outline'
    ? 'text-[color:var(--fg)] border-[color:var(--btn-border)] hover:bg-[color:var(--surface-veil)]'
    : 'text-[color:var(--fg)] border-[color:var(--btn-border)] hover:bg-[color:var(--surface-veil)]'
  return cx(base, sizeClass.value, active ? paletteActive : paletteIdle)
}
</script>

<template>
  <div :class="cx('inline-flex overflow-hidden rounded-[var(--radius-sm)] shadow-[var(--shadow-soft)] backdrop-blur-sm', props.variant==='ghost' ? 'border-transparent bg-transparent' : 'border border-[color:var(--btn-border)] bg-[color:var(--surface-translucent)]')">
    <button
      v-for="opt in props.options"
      :key="opt.value"
      type="button"
      :class="itemClass(props.modelValue===opt.value)"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

