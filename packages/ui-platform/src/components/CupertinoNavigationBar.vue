<script setup lang="ts">
import { computed } from 'vue'
import { AppButton, AppIcon, useDesignStyle, cx, buttonBaseForStyle } from '@my-monorepo/ui'

type BackBehavior = 'none' | 'default'

const props = withDefaults(defineProps<{
  title?: string
  backLabel?: string | null
  translucent?: boolean
  backBehavior?: BackBehavior
}>(), {
  title: '',
  backLabel: 'Back',
  translucent: true,
  backBehavior: 'default',
})

const emit = defineEmits<{ (e: 'back'): void }>()

const designStyle = useDesignStyle()
const chromeClass = computed(() => {
  const isApple = designStyle.family === 'apple'
  return cx(
    'sticky top-0 z-40 flex w-full items-center justify-between border-b px-4 py-3 transition-[background-color,backdrop-filter] duration-[var(--motion-duration-md)]',
    props.translucent && isApple
      ? 'backdrop-blur-[28px] bg-[color:var(--surface-translucent, color-mix(in srgb,var(--surface) 92%, transparent))] border-[color:var(--border-soft, rgba(120,120,128,0.16))]'
      : 'bg-[color:var(--surface, var(--md-sys-color-surface))] border-[color:var(--border-muted, var(--md-sys-color-outline-variant))]',
    designStyle.preset === 'cupertino-mobile' ? 'rounded-b-[1.5rem]' : 'rounded-none shadow-[var(--shadow-level1)]',
  )
})

const backButtonBase = computed(() => buttonBaseForStyle(designStyle))
const backButtonClass = computed(() =>
  cx(
    backButtonBase.value,
    'h-9 px-4 text-[0.9rem] font-semibold !normal-case tracking-[0.01em] text-[color:var(--accent)] shadow-none border-transparent bg-transparent hover:bg-[color-mix(in srgb,var(--accent) 12%,transparent)]',
  ),
)

const showBackButton = computed(() => props.backBehavior === 'default' && props.backLabel)
</script>

<template>
  <header :class="chromeClass">
    <div class="flex flex-1 items-center justify-start gap-2">
      <slot name="leading">
        <AppButton
          v-if="showBackButton"
          variant="text"
          size="sm"
          :class="backButtonClass"
          @click="emit('back')"
        >
          <AppIcon name="arrows" class="-scale-x-100" />
          <span>{{ props.backLabel }}</span>
        </AppButton>
      </slot>
    </div>
    <div class="flex flex-1 items-center justify-center text-[color:var(--fg)]">
      <slot name="title">
        <h1 class="text-base font-semibold tracking-[0.01em]">{{ props.title }}</h1>
      </slot>
    </div>
    <div class="flex flex-1 items-center justify-end gap-2">
      <slot name="trailing" />
    </div>
  </header>
</template>
