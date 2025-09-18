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
    <button :title="props.buttonTitle" type="button" @click="open = !open" class="inline-flex items-center gap-1 rounded-md border border-[var(--btn-border)] bg-[var(--btn-bg)] px-2.5 py-1.5 text-sm text-[var(--btn-fg)] hover:border-[var(--accent)]">
      <slot name="button" />
    </button>
    <div v-if="open" :class="['absolute z-50 mt-2 w-48 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-lg', props.align==='right' ? 'right-0' : 'left-0']">
      <button v-for="it in props.items" :key="it.value" type="button" @click="choose(it.value)" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--surface-2)]">
        <AppIcon v-if="it.icon" :name="it.icon" />
        <span>{{ it.label }}</span>
      </button>
    </div>
  </div>
</template>

