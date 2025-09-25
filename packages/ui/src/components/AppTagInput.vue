<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppBadge from './AppBadge.vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
}>(), { modelValue: '', placeholder: 'Add and press Enter…' })
const emit = defineEmits<{ (e:'update:modelValue', v:string): void }>()

const input = ref('')
const tags = ref<string[]>([])

function normalize(s: string) {
  return s.split(',').map(t => t.trim()).filter(Boolean)
}

watch(() => props.modelValue, (v) => { tags.value = normalize(v || '') }, { immediate: true })

const valueStr = computed(() => tags.value.join(', '))

function commit() {
  const next = normalize([ ...tags.value, input.value ].join(', '))
  tags.value = Array.from(new Set(next))
  input.value = ''
  emit('update:modelValue', valueStr.value)
}

function removeAt(i: number) {
  tags.value.splice(i, 1)
  emit('update:modelValue', valueStr.value)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    if (input.value.trim()) commit()
  } else if (e.key === 'Backspace' && !input.value && tags.value.length) {
    tags.value.pop()
    emit('update:modelValue', valueStr.value)
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-1 rounded-[var(--radius-sm)] border border-[color:var(--btn-border)] bg-[color:var(--surface-translucent)] px-2.5 py-2 shadow-[var(--shadow-soft)]">
    <AppBadge v-for="(t, i) in tags" :key="t" variant="neutral">
      <span>{{ t }}</span>
      <button
        type="button"
        class="ml-1 inline-flex items-center justify-center rounded-[var(--radius-xs)] p-0.5 text-[color:var(--muted)] transition-colors hover:bg-[color:var(--surface-veil)] hover:text-[color:var(--fg)]"
        @click="removeAt(i)"
      >
        <AppIcon name="x" />
      </button>
    </AppBadge>
    <input
      v-model="input"
      :placeholder="props.placeholder"
      @keydown="onKey"
      class="flex-1 bg-transparent px-2 py-1 text-sm text-[color:var(--fg)] placeholder:text-[color:var(--muted)] focus-visible:outline-none"
    />
  </div>
</template>

