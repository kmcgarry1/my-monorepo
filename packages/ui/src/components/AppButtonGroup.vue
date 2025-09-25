<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  options: { label: string; value: string }[]
  size?: 'sm'|'md'
}>(), { size: 'md' })
const emit = defineEmits<{ (e:'update:modelValue', v:string): void }>()
</script>

<template>
  <div class="inline-flex overflow-hidden rounded-[var(--radius-sm)] border border-[color:var(--btn-border)] bg-[color:var(--surface-translucent)] shadow-[var(--shadow-soft)] backdrop-blur-sm">
    <button
      v-for="opt in props.options"
      :key="opt.value"
      type="button"
      :class="[
        'px-3 transition-all duration-150 uppercase tracking-[0.14em] font-semibold border-r border-[color:var(--btn-border)] last:border-r-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--surface)]',
        props.size==='sm' ? 'py-1.5 text-[0.62rem]' : 'py-2 text-[0.72rem]',
        props.modelValue===opt.value
          ? 'bg-[color:var(--accent)] text-[color:var(--bg)] shadow-[var(--shadow-button-hover)]'
          : 'text-[color:var(--fg)] hover:bg-[color:var(--surface-veil)]'
      ]"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

