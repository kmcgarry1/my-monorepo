<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'default' | 'primary' | 'danger' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{ variant?: Variant; size?: Size; block?: boolean; type?: 'button'|'submit'|'reset'; disabled?: boolean }>(), {
  variant: 'default', size: 'md', block: false, type: 'button', disabled: false,
})

const base = [
  'inline-flex items-center justify-center rounded-xl border-2 font-bold',
  'transition-colors transition-transform duration-150 ease-out',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
  'disabled:opacity-60 disabled:cursor-not-allowed',
  'hover:translate-y-[-1px] active:translate-y-[0]'
].join(' ')

const sizeClass = computed(() => ({
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
}[props.size]))

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-[var(--accent)] text-white border-[var(--accent)] hover:brightness-110'
    case 'danger': return 'bg-rose-600 text-white border-rose-600 hover:bg-rose-500'
    case 'ghost': return 'bg-transparent text-[var(--button-text)] border-transparent hover:bg-[var(--panel-weak)]'
    case 'outline': return 'bg-[var(--button-bg)] text-[var(--button-text)] border-[var(--panel-border)] hover:bg-[var(--panel-weak)]'
    default: return 'bg-[var(--button-bg)] text-[var(--button-text)] border-[var(--panel-border)] hover:bg-[var(--panel-weak)]'
  }
})

const blockClass = computed(() => (props.block ? 'w-full' : ''))
</script>

<template>
  <button :type="props.type" :disabled="props.disabled" :class="[base, sizeClass, variantClass, blockClass]">
    <slot />
  </button>
</template>

<style scoped>
</style>
