<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'

type Item = { label: string; value: string; icon?: 'sword'|'book'|'download'|'copy'|'print'|'info'|'plus'|'palette' }

const props = withDefaults(defineProps<{
  items: Item[]
  align?: 'left' | 'right'
  buttonTitle?: string
}>(), { align: 'left', buttonTitle: '' })

const emit = defineEmits<{ (e:'select', v:string): void }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function onDocClick(e: MouseEvent) {
  if (!root.value) return
  if (!root.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

function choose(v: string) {
  emit('select', v)
  open.value = false
}
</script>

<template>
  <div ref="root" class="relative inline-flex">
    <button
      :title="props.buttonTitle"
      type="button"
      @click="open = !open"
      class="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[color:var(--btn-border)] bg-[color:var(--btn-bg)] px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--btn-fg)] transition-all duration-200 shadow-[var(--shadow-button)] hover:border-[color:var(--accent)] hover:shadow-[var(--shadow-button-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface)]"
    >
      <slot name="button" />
    </button>
    <div v-if="open" :class="['absolute z-50 mt-2 w-52 overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-panel)] shadow-[var(--shadow-elevated)] backdrop-blur-lg', props.align==='right' ? 'right-0' : 'left-0']">
      <button
        v-for="it in props.items"
        :key="it.value"
        type="button"
        @click="choose(it.value)"
        class="flex w-full items-center gap-3 px-3 py-2 text-left text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--fg)] transition-colors hover:bg-[color:var(--surface-veil)] focus-visible:outline-none focus-visible:bg-[color:var(--surface-veil)]"
      >
        <AppIcon v-if="it.icon" :name="it.icon" />
        <span>{{ it.label }}</span>
      </button>
    </div>
  </div>
</template>

