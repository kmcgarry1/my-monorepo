<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { cx, btnBase, btnSizes, btnVariants } from '../utils/variants'
import AppIcon from './AppIcon.vue'

type Item = { label: string; value: string; icon?: 'sword'|'book'|'download'|'copy'|'print'|'info'|'plus'|'palette' }

const props = withDefaults(defineProps<{
  items: Item[]
  align?: 'left' | 'right'
  buttonTitle?: string
  variant?: 'default'|'primary'|'secondary'|'danger'|'ghost'|'outline'|'subtle'|'accent'
  size?: 'xs'|'sm'|'md'|'lg'
}>(), { align: 'left', buttonTitle: '', variant: 'default', size: 'md' })

const emit = defineEmits<{ (e:'select', v:string): void }>()
const itemSize = (size: 'xs'|'sm'|'md'|'lg') => size==='xs' ? 'px-3 py-1.5 text-[0.62rem]' : size==='lg' ? 'px-3 py-2.5 text-[0.82rem]' : size==='sm' ? 'px-3 py-1.5 text-[0.68rem]' : 'px-3 py-2 text-[0.72rem]'

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
      :class="cx(btnBase, btnSizes[props.size], btnVariants[props.variant==='accent'?'primary':props.variant])"
    >
      <slot name="button" />
    </button>
    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div v-if="open" :class="['absolute z-50 mt-2 w-52 overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-panel)] shadow-[var(--shadow-elevated)] backdrop-blur-lg', props.align==='right' ? 'right-0' : 'left-0']">
        <button
          v-for="it in props.items"
          :key="it.value"
          type="button"
          @click="choose(it.value)"
          :class="['flex w-full items-center gap-3 text-left font-semibold uppercase tracking-[0.12em] text-[color:var(--fg)] transition-colors hover:bg-[color:var(--surface-veil)] focus-visible:outline-none focus-visible:bg-[color:var(--surface-veil)]', itemSize(props.size)]"
        >
          <AppIcon v-if="it.icon" :name="it.icon" />
          <span>{{ it.label }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

