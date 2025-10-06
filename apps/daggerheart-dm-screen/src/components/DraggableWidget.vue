<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { columnFromOffset, GRID_SIZE, MIN_WIDGET_HEIGHT, MIN_WIDGET_WIDTH } from '../constants/layout';
import type { WidgetState } from '../types';

const props = defineProps<{
  widget: WidgetState;
  disableInteractions?: boolean;
}>();

const MIN_WIDTH = MIN_WIDGET_WIDTH;
const MIN_HEIGHT = MIN_WIDGET_HEIGHT;
const KEYBOARD_STEP = GRID_SIZE;
const KEYBOARD_STEP_FAST = GRID_SIZE * 3;

const emit = defineEmits<{
  (e: 'dragging', payload: { id: string; x: number; y: number }): void;
  (e: 'focus'): void;
  (e: 'toggle-pin'): void;
  (e: 'resizing', payload: { id: string; width: number; height: number }): void;
  (e: 'hover-column', payload: { column: number | null }): void;
}>();

const root = ref<HTMLElement | null>(null);

const titleId = computed(() => `widget-${props.widget.id}-title`);
const descriptionId = computed(() => `widget-${props.widget.id}-description`);
const describedBy = computed(() => (props.widget.description ? descriptionId.value : undefined));
const roleDescription = computed(() =>
  props.widget.pinned ? 'Pinned dashboard widget' : 'Dashboard widget'
);

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
let dragFrame: number | null = null;
let resizeFrame: number | null = null;
let pendingDrag: { x: number; y: number } | null = null;
let pendingResize: { width: number; height: number } | null = null;

function interactionsDisabled() {
  return Boolean(props.disableInteractions);
}

function getBoardCanvas(element: HTMLElement | null) {
  if (!element) {
    return null;
  }
  return element.closest<HTMLElement>('[data-board-canvas]') ?? element.parentElement;
}

function emitColumnHover(x: number | null) {
  if (x === null) {
    emit('hover-column', { column: null });
    return;
  }

  const column = columnFromOffset(Math.max(x, 0));
  emit('hover-column', { column });
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

  emitColumnHover(startX);

  element.classList.add('is-dragging');

  element.setPointerCapture(pointerId);
  element.addEventListener('lostpointercapture', cleanup, { once: true });

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerCancel);
  window.addEventListener('blur', handleWindowBlur);
  document.addEventListener('visibilitychange', handleVisibilityChange);
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
  const board = getBoardCanvas(element);

  if (board) {
    const maxX = Math.max(board.clientWidth - props.widget.size.width, 0);
    const maxY = Math.max(board.clientHeight - props.widget.size.height, 0);
    nextX = Math.min(Math.max(nextX, 0), maxX);
    nextY = Math.min(Math.max(nextY, 0), maxY);
  }

  emitColumnHover(nextX);

  scheduleDragEmit({ x: nextX, y: nextY });
}

function onPointerUp(event: PointerEvent) {
  if (event.pointerId !== pointerId) {
    return;
  }

  cleanup();
}

function onPointerCancel(event: PointerEvent) {
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
  element?.classList.remove('is-dragging');
  if (dragFrame !== null) {
    cancelAnimationFrame(dragFrame);
    dragFrame = null;
  }
  pendingDrag = null;
  emitColumnHover(null);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerCancel);
  window.removeEventListener('blur', handleWindowBlur);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
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
  window.addEventListener('pointerup', onResizePointerUp);
  window.addEventListener('pointercancel', onResizePointerCancel);
  window.addEventListener('blur', handleWindowBlur);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  root.value?.classList.add('is-resizing');
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
  const board = getBoardCanvas(element);

  if (board) {
    const maxWidth = Math.max(board.clientWidth - props.widget.position.x, MIN_WIDTH);
    const maxHeight = Math.max(board.clientHeight - props.widget.position.y, MIN_HEIGHT);
    nextWidth = Math.min(Math.max(nextWidth, MIN_WIDTH), maxWidth);
    nextHeight = Math.min(Math.max(nextHeight, MIN_HEIGHT), maxHeight);
  }

  scheduleResizeEmit({ width: nextWidth, height: nextHeight });
}

function onResizePointerUp(event: PointerEvent) {
  if (event.pointerId !== resizePointerId) {
    return;
  }

  cleanupResize();
}

function onResizePointerCancel(event: PointerEvent) {
  if (event.pointerId !== resizePointerId) {
    return;
  }

  cleanupResize();
}

function cleanupResize() {
  if (resizePointerId !== null) {
    window.removeEventListener('pointermove', onResizePointerMove);
    window.removeEventListener('pointerup', onResizePointerUp);
    window.removeEventListener('pointercancel', onResizePointerCancel);
    window.removeEventListener('blur', handleWindowBlur);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    resizeHandleEl?.releasePointerCapture(resizePointerId);
  }
  isResizing = false;
  resizePointerId = null;
  resizeHandleEl = null;
  if (resizeFrame !== null) {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = null;
  }
  pendingResize = null;
  root.value?.classList.remove('is-resizing');
}

function scheduleDragEmit(payload: { x: number; y: number }) {
  pendingDrag = payload;

  if (dragFrame !== null) {
    return;
  }

  dragFrame = requestAnimationFrame(() => {
    dragFrame = null;
    if (!pendingDrag) {
      return;
    }

    emit('dragging', {
      id: props.widget.id,
      x: pendingDrag.x,
      y: pendingDrag.y
    });

    pendingDrag = null;
  });
}

function scheduleResizeEmit(payload: { width: number; height: number }) {
  pendingResize = payload;

  if (resizeFrame !== null) {
    return;
  }

  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = null;
    if (!pendingResize) {
      return;
    }

    emit('resizing', {
      id: props.widget.id,
      width: pendingResize.width,
      height: pendingResize.height
    });

    pendingResize = null;
  });
}

function cancelActiveInteractions() {
  cleanup();
  cleanupResize();
}

function handleWindowBlur() {
  cancelActiveInteractions();
}

function handleVisibilityChange() {
  if (document.hidden) {
    cancelActiveInteractions();
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.currentTarget !== event.target) {
    return;
  }

  if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
    event.preventDefault();
    emit('toggle-pin');
    return;
  }

  if (props.widget.pinned || interactionsDisabled()) {
    return;
  }

  const step = event.shiftKey ? KEYBOARD_STEP_FAST : KEYBOARD_STEP;
  let handled = false;

  switch (event.key) {
    case 'ArrowUp':
      handled = true;
      nudgeWidget(0, -step);
      break;
    case 'ArrowDown':
      handled = true;
      nudgeWidget(0, step);
      break;
    case 'ArrowLeft':
      handled = true;
      nudgeWidget(-step, 0);
      break;
    case 'ArrowRight':
      handled = true;
      nudgeWidget(step, 0);
      break;
  }

  if (handled) {
    event.preventDefault();
  }
}

function nudgeWidget(deltaX: number, deltaY: number) {
  const element = root.value;
  const board = getBoardCanvas(element);

  let nextX = props.widget.position.x + deltaX;
  let nextY = props.widget.position.y + deltaY;

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

  emitColumnHover(null);
}

onBeforeUnmount(() => {
  cancelActiveInteractions();
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
    role="group"
    tabindex="0"
    :aria-labelledby="titleId"
    :aria-describedby="describedBy"
    :aria-roledescription="roleDescription"
    @focusin="emit('focus')"
    @keydown="onKeydown"
  >
    <header class="widget__header" @pointerdown="onPointerDown">
      <span class="icon" aria-hidden="true">{{ widget.icon }}</span>
      <div class="meta">
        <h2 :id="titleId">{{ widget.title }}</h2>
        <p v-if="widget.description" :id="descriptionId">{{ widget.description }}</p>
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
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), var(--surface));
  border: 1px solid rgba(138, 180, 235, 0.22);
  box-shadow: 0 18px 52px rgba(7, 15, 29, 0.45);
  color: inherit;
  backdrop-filter: blur(16px) saturate(1.05);
  overflow: hidden;
  transition: box-shadow 0.24s ease, transform 0.24s ease;
}

.widget:focus-visible {
  outline: 2px solid rgba(150, 198, 255, 0.82);
  outline-offset: 4px;
}

.widget::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, color-mix(in srgb, var(--accent) 65%, transparent) 0%, transparent 68%);
  opacity: 0.18;
  pointer-events: none;
  mix-blend-mode: screen;
}

.widget:hover {
  box-shadow: 0 22px 60px rgba(6, 13, 26, 0.5);
}

.widget.pinned {
  box-shadow: 0 16px 48px rgba(5, 12, 24, 0.38);
}

.widget.is-dragging,
.widget.is-resizing {
  box-shadow: 0 28px 70px rgba(6, 13, 26, 0.55);
  transform: translateZ(0);
}

.widget.is-dragging .widget__header {
  cursor: grabbing;
}

.widget.disabled {
  cursor: default;
}

.widget__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 16px 18px 12px;
  cursor: grab;
  position: relative;
  z-index: 2;
  background: color-mix(in srgb, var(--surface-strong) 82%, transparent);
  border-bottom: 1px solid rgba(138, 180, 235, 0.18);
}

.widget.pinned .widget__header {
  cursor: default;
}

.icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--accent) 40%, rgba(15, 26, 40, 0.82));
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.15);
  font-size: 1.45rem;
}

.meta h2 {
  margin: 0 0 4px;
  font-size: 1.05rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.meta p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.87rem;
}

.pin {
  background: rgba(22, 32, 48, 0.72);
  border: 1px solid rgba(138, 180, 235, 0.4);
  border-radius: 999px;
  padding: 8px 16px;
  color: rgba(229, 239, 255, 0.92);
  cursor: pointer;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.pin[aria-pressed='true'] {
  background: rgba(138, 180, 235, 0.24);
  border-color: rgba(138, 180, 235, 0.6);
}

.pin:focus-visible {
  outline: 2px solid rgba(150, 198, 255, 0.82);
  outline-offset: 2px;
}

.pin:hover {
  transform: translateY(-1px);
}

.widget__body {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 2px 18px 18px;
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
  width: 22px;
  height: 22px;
  right: 12px;
  bottom: 12px;
  border-radius: 6px;
  background: rgba(148, 190, 255, 0.55);
  border: 1px solid rgba(148, 190, 255, 0.75);
  cursor: se-resize;
  box-shadow: 0 4px 14px rgba(7, 14, 26, 0.45);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.widget:not(.pinned):hover .resize-handle,
.widget:not(.pinned):focus-within .resize-handle {
  opacity: 1;
}

:global(.board--mobile .widget) {
  position: relative;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: auto !important;
  border-radius: 18px;
  border: 1px solid rgba(138, 180, 235, 0.18);
  box-shadow: 0 14px 34px rgba(7, 14, 26, 0.32);
  transform: none !important;
}

:global(.board--mobile .widget::before) {
  opacity: 0.12;
}

:global(.board--mobile .widget__header) {
  cursor: default;
  border-bottom-color: rgba(138, 180, 235, 0.12);
  padding: 16px 16px 10px;
}

:global(.board--mobile .widget__body) {
  padding: 12px 16px 20px;
}

:global(.board--mobile .resize-handle) {
  display: none;
}
</style>
