<script setup lang="ts">
import { computed } from 'vue'
import { AppButton, AppIcon, buttonBaseForStyle, cx, useDesignStyle } from '@my-monorepo/ui'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string | null
    backLabel?: string | null
    floating?: boolean
  }>(),
  {
    title: '',
    subtitle: null,
    backLabel: 'Back',
    floating: true,
  },
)

const emit = defineEmits<{ (e: 'back'): void }>()

const designStyle = useDesignStyle()

const chromeClass = computed(() =>
  cx(
    'relative z-40 flex w-full max-w-xl items-center gap-4 rounded-[2.75rem] px-6 py-4 text-[color:var(--fg)] transition-[background-color,box-shadow,transform] duration-[var(--motion-duration-md)] ease-[var(--motion-easing-standard)]',
    props.floating
      ? 'backdrop-blur-[38px] backdrop-saturate-[180%] bg-[color:color-mix(in srgb,var(--surface) 70%, transparent)] shadow-[var(--shadow-level3)] border border-[color:color-mix(in srgb,var(--border-soft, rgba(255,255,255,0.4)) 60%, transparent)]'
      : 'bg-[color:var(--surface)] border border-[color:var(--border-soft, rgba(255,255,255,0.3))] shadow-[var(--shadow-level2)]',
  ),
)

const backButtonBase = computed(() => buttonBaseForStyle(designStyle))
const backButtonClass = computed(() =>
  cx(
    backButtonBase.value,
    'h-9 rounded-full border-transparent bg-white/16 px-4 text-sm font-semibold !normal-case tracking-[0.01em] text-[color:var(--accent)] shadow-none backdrop-blur-[inherit] hover:bg-white/24',
  ),
)

const showBackButton = computed(() => props.backLabel)
</script>

<template>
  <section :class="chromeClass">
    <div class="flex flex-1 items-center gap-3">
      <slot name="leading">
        <AppButton
          v-if="showBackButton"
          variant="text"
          size="sm"
          :class="backButtonClass"
          @click="emit('back')"
        >
          <AppIcon name="arrows" class="-scale-x-100 opacity-80" />
          <span>{{ props.backLabel }}</span>
        </AppButton>
      </slot>
    </div>
    <div class="flex flex-1 flex-col items-center text-center leading-snug text-[color:var(--fg)]">
      <slot name="title">
        <h1 class="text-base font-semibold tracking-[0.01em]">
          {{ props.title }}
        </h1>
      </slot>
      <slot name="subtitle">
        <p v-if="props.subtitle" class="text-xs text-white/70">
          {{ props.subtitle }}
        </p>
      </slot>
    </div>
    <div class="flex flex-1 items-center justify-end gap-3">
      <slot name="trailing" />
    </div>
  </section>
</template>
