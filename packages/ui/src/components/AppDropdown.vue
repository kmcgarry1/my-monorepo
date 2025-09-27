<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { cx, btnBase, btnSizes, btnVariants } from '../utils/variants'
import { fadeScale } from '../utils/motion'
import AppIcon from './AppIcon.vue'
import type { ButtonVariant, ButtonSize, DropdownAlign } from '../types'

type Item = { label: string; value: string; icon?: 'sword'|'book'|'download'|'copy'|'print'|'info'|'plus'|'palette' }

const props = withDefaults(defineProps<{
  items: Item[]
  align?: DropdownAlign
  buttonTitle?: string
  variant?: ButtonVariant
  size?: ButtonSize
}>(), { align: 'left', buttonTitle: '', variant: 'surface', size: 'md' })

const emit = defineEmits<{ (e:'select', v:string): void }>()
const itemSize = (size: ButtonSize) => size==='xs' ? 'px-3 py-1.5 text-[0.66rem]' : size==='lg' ? 'px-3 py-2.5 text-[0.84rem]' : size==='sm' ? 'px-3 py-1.5 text-[0.72rem]' : 'px-3 py-2 text-[0.78rem]'

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
      :class="cx(btnBase, btnSizes[props.size], btnVariants[props.variant] ?? btnVariants.surface)"
    >
      <slot name="button" />
    </button>
    <Transition
      :enter-active-class="fadeScale.enterActiveClass"
      :enter-from-class="fadeScale.enterFromClass"
      :enter-to-class="fadeScale.enterToClass"
      :leave-active-class="fadeScale.leaveActiveClass"
      :leave-from-class="fadeScale.leaveFromClass"
      :leave-to-class="fadeScale.leaveToClass"
    >
      <div v-if="open" :class="['absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-[1rem] border border-[color:color-mix(in srgb, var(--md-sys-color-outline-variant) 55%, transparent)] bg-[color-mix(in srgb, var(--surface) 98%, transparent)] shadow-[0_18px_32px_rgba(15,12,40,0.16)] backdrop-blur-xl ring-1 ring-[color:color-mix(in srgb, var(--accent) 18%, transparent)]/10', props.align==='right' ? 'right-0' : 'left-0']">
        <button
          v-for="it in props.items"
          :key="it.value"
          type="button"
          @click="choose(it.value)"
          :class="['flex w-full items-center gap-3 text-left font-medium uppercase tracking-[0.08em] text-[color:var(--md-sys-color-on-surface)] transition-[color,background] duration-[var(--motion-duration-sm)] hover:bg-[color-mix(in srgb,var(--accent) 12%,transparent)] focus-visible:outline-none focus-visible:bg-[color-mix(in srgb,var(--accent) 15%,transparent)]', itemSize(props.size)]"
        >
          <AppIcon v-if="it.icon" :name="it.icon" />
          <span>{{ it.label }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>
