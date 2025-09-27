<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'default' | 'primary' | 'danger' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    block?: boolean
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    size: 'md',
    block: false,
    type: 'button',
    disabled: false,
  }
)

const classes = computed(() => [
  'md-button',
  `md-button--${props.size}`,
  `md-button--${props.variant}`,
  props.block ? 'md-button--block' : '',
])
</script>

<template>
  <button :type="props.type" :disabled="props.disabled" :class="classes">
    <slot />
  </button>
</template>

<style scoped>
.md-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  overflow: hidden;
  color: var(--md-sys-color-on-surface);
  background: var(--md-sys-color-surface-container-highest);
  transition:
    transform var(--motion-duration-short) var(--motion-easing-standard),
    box-shadow var(--motion-duration-short) var(--motion-easing-standard),
    background-color var(--motion-duration-short) var(--motion-easing-standard),
    color var(--motion-duration-short) var(--motion-easing-standard);
  box-shadow: 0 1px 1px rgba(12, 12, 14, 0.12);
}

.md-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.md-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity var(--motion-duration-short) var(--motion-easing-standard);
  pointer-events: none;
}

.md-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: var(--md-sys-elevation-level1);
}

.md-button:not(:disabled):active {
  transform: translateY(0);
}

.md-button:not(:disabled):hover::after {
  opacity: 0.08;
}

.md-button:not(:disabled):active::after {
  opacity: 0.14;
}

.md-button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent);
  outline-offset: 2px;
}

.md-button--block {
  width: 100%;
}

.md-button--sm {
  min-height: 36px;
  padding: 0.4rem 0.9rem;
  font-size: 0.78rem;
}

.md-button--md {
  min-height: 44px;
  padding: 0.6rem 1.2rem;
  font-size: 0.88rem;
}

.md-button--lg {
  min-height: 52px;
  padding: 0.8rem 1.6rem;
  font-size: 0.95rem;
}

.md-button--default {
  background: color-mix(in srgb, var(--md-sys-color-primary) 16%, var(--md-sys-color-surface-container-highest));
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 80%, var(--md-sys-color-primary) 20%);
}

.md-button--primary {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  box-shadow: var(--md-sys-elevation-level1);
}

.md-button--outline {
  background: transparent;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline) 70%, transparent);
  box-shadow: none;
}

.md-button--ghost {
  background: transparent;
  color: var(--md-sys-color-primary);
  box-shadow: none;
}

.md-button--danger {
  background: var(--md-sys-color-error);
  color: var(--md-sys-color-on-error);
  box-shadow: var(--md-sys-elevation-level1);
}

.md-button--outline::after,
.md-button--ghost::after {
  background: currentColor;
}

.md-button--primary::after,
.md-button--danger::after {
  background: rgba(255, 255, 255, 0.48);
}

.md-button--ghost {
  text-transform: none;
  font-weight: 500;
  padding-inline: 0.4rem;
  min-height: 36px;
}

.md-button--ghost.md-button--sm,
.md-button--ghost.md-button--md,
.md-button--ghost.md-button--lg {
  min-height: inherit;
}
</style>
