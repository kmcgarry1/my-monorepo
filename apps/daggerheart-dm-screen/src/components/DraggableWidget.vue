<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import type { WidgetState } from '../types';

const props = defineProps<{
  widget: WidgetState;
  disableInteractions?: boolean;
}>();

const emit = defineEmits<{
  (e: 'dragging', payload: { id: string; x: number; y: number }): void;
  (e: 'focus'): void;
  (e: 'toggle-pin'): void;
  (e: 'resizing', payload: { id: string; width: number; height: number }): void;
}>();

const root = ref<HTMLElement | null>(null);

let isDragging = false;
let pointerId: number | null = null;
let startPointerX = 0;
let startPointerY = 0;
let startX = 0;
let startY = 0;
let isResizing = false;
let resizePointerId: number | null = null;
let startWidth = 0;
let startHeight = 0;
let resizeHandleEl: HTMLElement | null = null;

function interactionsDisabled() {
  return Boolean(props.disableInteractions);
}

function onPointerDown(event: PointerEvent) {
  emit('focus');

  if (props.widget.pinned || interactionsDisabled()) {
    return;
  }

  const element = root.value;
  if (!element) {
    return;
  }

  isDragging = true;
  pointerId = event.pointerId;
  startPointerX = event.clientX;
  startPointerY = event.clientY;
  startX = props.widget.position.x;
  startY = props.widget.position.y;

  element.setPointerCapture(pointerId);
  element.addEventListener('lostpointercapture', cleanup, { once: true });

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp, { once: true });
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging || event.pointerId !== pointerId) {
    return;
  }

  const deltaX = event.clientX - startPointerX;
  const deltaY = event.clientY - startPointerY;

  let nextX = startX + deltaX;
  let nextY = startY + deltaY;

  const element = root.value;
  const board = element?.parentElement as HTMLElement | null;

  if (board) {
    const maxX = Math.max(board.clientWidth - props.widget.size.width, 0);
    const maxY = Math.max(board.clientHeight - props.widget.size.height, 0);
    nextX = Math.min(Math.max(nextX, 0), maxX);
    nextY = Math.min(Math.max(nextY, 0), maxY);
  }

  emit('dragging', {
    id: props.widget.id,
    x: nextX,
    y: nextY
  });
}

function onPointerUp(event: PointerEvent) {
  if (event.pointerId !== pointerId) {
    return;
  }

  cleanup();
}

function cleanup() {
  const element = root.value;
  if (pointerId !== null) {
    element?.releasePointerCapture(pointerId);
  }
  isDragging = false;
  pointerId = null;
  window.removeEventListener('pointermove', onPointerMove);
}

function onResizePointerDown(event: PointerEvent) {
  if (props.widget.pinned || interactionsDisabled()) {
    return;
  }

  const handle = event.currentTarget as HTMLElement | null;
  if (!handle) {
    return;
  }

  event.stopPropagation();
  event.preventDefault();

  isResizing = true;
  resizePointerId = event.pointerId;
  startPointerX = event.clientX;
  startPointerY = event.clientY;
  startWidth = props.widget.size.width;
  startHeight = props.widget.size.height;
  resizeHandleEl = handle;

  handle.setPointerCapture(resizePointerId);
  handle.addEventListener('lostpointercapture', cleanupResize, { once: true });

  window.addEventListener('pointermove', onResizePointerMove);
  window.addEventListener('pointerup', onResizePointerUp, { once: true });
}

function onResizePointerMove(event: PointerEvent) {
  if (!isResizing || event.pointerId !== resizePointerId) {
    return;
  }

  const deltaX = event.clientX - startPointerX;
  const deltaY = event.clientY - startPointerY;

  let nextWidth = startWidth + deltaX;
  let nextHeight = startHeight + deltaY;

  const element = root.value;
  const board = element?.parentElement as HTMLElement | null;

  if (board) {
    const maxWidth = Math.max(board.clientWidth - props.widget.position.x, 120);
    const maxHeight = Math.max(board.clientHeight - props.widget.position.y, 120);
    nextWidth = Math.min(Math.max(nextWidth, 200), maxWidth);
    nextHeight = Math.min(Math.max(nextHeight, 160), maxHeight);
  }

  emit('resizing', {
    id: props.widget.id,
    width: nextWidth,
    height: nextHeight
  });
}

function onResizePointerUp(event: PointerEvent) {
  if (event.pointerId !== resizePointerId) {
    return;
  }

  cleanupResize();
}

function cleanupResize() {
  if (resizePointerId !== null) {
    window.removeEventListener('pointermove', onResizePointerMove);
    resizeHandleEl?.releasePointerCapture(resizePointerId);
  }
  isResizing = false;
  resizePointerId = null;
  resizeHandleEl = null;
}

onBeforeUnmount(() => {
  cleanup();
  cleanupResize();
});
</script>

<template>
  <article
    ref="root"
    class="widget"
    :class="{ pinned: widget.pinned, disabled: disableInteractions }"
    :style="{
      top: `${widget.position.y}px`,
      left: `${widget.position.x}px`,
      width: `${widget.size.width}px`,
      height: `${widget.size.height}px`,
      zIndex: widget.zIndex,
      '--accent': widget.accent
    }"
  >
    <header class="widget__header" @pointerdown="onPointerDown">
      <span class="icon" aria-hidden="true">{{ widget.icon }}</span>
      <div class="meta">
        <h2>{{ widget.title }}</h2>
        <p>{{ widget.description }}</p>
      </div>
      <button
        type="button"
        class="pin"
        :aria-pressed="widget.pinned"
        @click.stop="emit('toggle-pin')"
      >
        {{ widget.pinned ? 'Unpin' : 'Pin' }}
      </button>
    </header>
    <section class="widget__body">
      <slot />
    </section>
    <span
      v-if="!widget.pinned && !disableInteractions"
      class="resize-handle"
      :data-resize-id="widget.id"
      @pointerdown="onResizePointerDown"
      aria-hidden="true"
    ></span>
  </article>
</template>

<style scoped>
.widget {
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: var(--surface);
  border: 1px solid rgba(120, 182, 255, 0.18);
  box-shadow: 0 22px 60px rgba(6, 16, 32, 0.6), inset 0 0 0 1px rgba(120, 182, 255, 0.16);
  color: inherit;
  backdrop-filter: blur(14px);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.widget::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent);
  opacity: 0.32;
  pointer-events: none;
  mix-blend-mode: screen;
}

.widget.pinned {
  box-shadow: 0 14px 40px rgba(5, 14, 28, 0.4), inset 0 0 0 1px rgba(120, 182, 255, 0.32);
}

.widget.disabled {
  cursor: default;
}

.widget__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 18px 20px 14px;
  cursor: grab;
  position: relative;
  z-index: 2;
}

.widget.pinned .widget__header {
  cursor: default;
}

.icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: rgba(5, 12, 24, 0.6);
  box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.12);
  font-size: 1.6rem;
}

.meta h2 {
  margin: 0 0 4px;
  font-size: 1.1rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.meta p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.pin {
  background: rgba(8, 16, 30, 0.7);
  border: 1px solid rgba(120, 182, 255, 0.4);
  border-radius: 999px;
  padding: 8px 16px;
  color: rgba(220, 236, 255, 0.9);
  cursor: pointer;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pin[aria-pressed='true'] {
  background: rgba(120, 182, 255, 0.24);
}

.pin:focus-visible {
  outline: 2px solid rgba(134, 198, 255, 0.8);
  outline-offset: 2px;
}

.widget__body {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 0 20px 20px;
  overflow: hidden;
}

.widget__body :deep(*) {
  color: inherit;
}

.widget:active {
  transform: scale(1.01);
}

.resize-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 8px;
  bottom: 8px;
  border-radius: 4px;
  background: rgba(118, 174, 255, 0.45);
  border: 1px solid rgba(118, 174, 255, 0.7);
  cursor: se-resize;
  box-shadow: 0 4px 12px rgba(6, 16, 32, 0.45);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.widget:not(.pinned):hover .resize-handle,
.widget:not(.pinned):focus-within .resize-handle {
  opacity: 1;
}

@media (max-width: 720px) {
  .widget {
    position: relative;
    width: 100% !important;
    height: auto !important;
    left: 0 !important;
    top: 0 !important;
  }

  .widget::before {
    opacity: 0.18;
  }

  .widget__header {
    cursor: default;
  }

  .resize-handle {
    display: none;
  }
}
</style>
