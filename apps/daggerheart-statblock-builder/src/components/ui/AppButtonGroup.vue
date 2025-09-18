<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  options: { label: string; value: string }[]
  size?: 'sm'|'md'
}>(), { size: 'md' })
const emit = defineEmits<{ (e:'update:modelValue', v:string): void }>()
</script>

<template>
  <div class="inline-flex overflow-hidden rounded-md border border-[var(--btn-border)] bg-[var(--surface)]">
    <button
      v-for="opt in props.options"
      :key="opt.value"
      type="button"
      :class="[
        'px-3 transition-colors',
        props.size==='sm' ? 'py-1.5 text-sm' : 'py-2 text-sm',
        props.modelValue===opt.value ? 'bg-[var(--accent)] text-white' : 'text-[var(--fg)] hover:bg-[var(--surface-2)]'
      ]"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

