<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WidgetBoard from './components/WidgetBoard.vue';
import DMToolbar from './components/DMToolbar.vue';
import type { CreateWidgetPayload, CustomWidgetConfig, UpdateWidgetPayload, WidgetState } from './types';
import { createInitialWidgets } from './data/widgets';
import {
  GRID_SIZE,
  MIN_WIDGET_WIDTH,
  MIN_WIDGET_HEIGHT,
  COLUMN_COUNT,
  clampColumnIndex,
  getColumnOffset,
  normalizeColumnWidth
} from './constants/layout';
import { calculateBoardSize, normalizeWidgetLayout, resolveRect, snapToGrid } from './utils/layout';

const MIN_WIDTH = MIN_WIDGET_WIDTH;
const MIN_HEIGHT = MIN_WIDGET_HEIGHT;

const STORAGE_KEY = 'daggerheart-dm-widgets';
const STORAGE_VERSION = 1;

type PersistedLayout = {
  version: number;
  widgets: WidgetState[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isWidgetPosition(value: unknown): value is { x: number; y: number } {
  return isRecord(value) && isNumber(value.x) && isNumber(value.y);
}

function isWidgetSize(value: unknown): value is { width: number; height: number } {
  return isRecord(value) && isNumber(value.width) && isNumber(value.height);
}

function coerceWidgetState(value: unknown): WidgetState | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.icon !== 'string' ||
    typeof value.accent !== 'string' ||
    typeof value.component !== 'string' ||
    !isWidgetPosition(value.position) ||
    !isWidgetSize(value.size) ||
    !isNumber(value.zIndex)
  ) {
    return null;
  }

  const config = value.config;

  const widget: WidgetState = {
    id: value.id,
    title: value.title,
    icon: value.icon,
    accent: value.accent,
    description: typeof value.description === 'string' ? value.description : undefined,
    position: value.position,
    size: value.size,
    component: value.component,
    pinned: typeof value.pinned === 'boolean' ? value.pinned : undefined,
    zIndex: value.zIndex,
    config: typeof config === 'object' && config !== null ? (config as CustomWidgetConfig) : undefined
  };

  return widget;
}

function sanitizeWidgets(value: unknown): WidgetState[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const coerced = value
    .map((item) => coerceWidgetState(item))
    .filter((widget): widget is WidgetState => widget !== null);

  if (coerced.length !== value.length) {
    console.warn('Discarded invalid widgets from stored layout.');
  }

  if (coerced.length === 0 && value.length > 0) {
    return null;
  }

  return coerced;
}

function loadPersistedWidgets(): WidgetState[] | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return sanitizeWidgets(parsed);
    }

    if (isRecord(parsed)) {
      const version = typeof parsed.version === 'number' ? parsed.version : 0;
      if (version === STORAGE_VERSION && 'widgets' in parsed) {
        const sanitized = sanitizeWidgets((parsed as PersistedLayout).widgets);
        if (sanitized) {
          return sanitized;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to parse stored widget layout:', error);
  }

  window.localStorage.removeItem(STORAGE_KEY);
  return null;
}

function persistWidgets(state: WidgetState[]) {
  if (typeof window === 'undefined') {
    return;
  }

  const payload: PersistedLayout = {
    version: STORAGE_VERSION,
    widgets: state.map((widget) => ({
      ...widget,
      position: { ...widget.position },
      size: { ...widget.size }
    }))
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function getNextCustomIndex(existing: WidgetState[]): number {
  return (
    existing.reduce((max, widget) => {
      const match = /custom-(\d+)/.exec(widget.id);
      if (!match) {
        return max;
      }
      const value = Number.parseInt(match[1], 10);
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0) + 1
  );
}

const initialWidgets = loadPersistedWidgets() ?? createInitialWidgets();
const widgets = ref<WidgetState[]>(normalizeWidgetLayout(initialWidgets));
const boardSize = computed(() => calculateBoardSize(widgets.value));

let customWidgetCounter = getNextCustomIndex(widgets.value);

const pinnedCount = computed(() => widgets.value.filter((widget) => widget.pinned).length);
const isFullBleed = ref(false);
const isFullscreen = ref(false);
const isPhoneLayout = ref(false);

let phoneMediaQuery: MediaQueryList | null = null;
let persistTimer: number | null = null;
let lastSerialized = JSON.stringify(widgets.value);

watch(
  widgets,
  (next) => {
    if (typeof window === 'undefined') {
      return;
    }

    const serialized = JSON.stringify(next);
    if (serialized === lastSerialized) {
      return;
    }

    lastSerialized = serialized;

    if (persistTimer !== null) {
      clearTimeout(persistTimer);
    }

    persistTimer = window.setTimeout(() => {
      persistWidgets(next);
      persistTimer = null;
    }, 150);
  },
  { deep: true }
);

function updateWidgetPosition(payload: { id: string; x: number; y: number }) {
  if (isPhoneLayout.value) {
    return;
  }

  const nextWidgets = widgets.value.map((widget) => ({ ...widget }));
  const target = nextWidgets.find((widget) => widget.id === payload.id);

  if (!target) {
    return;
  }

  const resolved = resolveRect(nextWidgets, payload.id, {
    x: payload.x,
    y: payload.y,
    width: target.size.width,
    height: target.size.height
  });

  widgets.value = nextWidgets.map((widget) =>
    widget.id === payload.id
      ? {
          ...widget,
          position: {
            x: resolved.x,
            y: resolved.y
          },
          size: {
            width: resolved.width,
            height: resolved.height
          }
        }
      : widget
  );
}

function updateWidgetSize(payload: { id: string; width: number; height: number }) {
  if (isPhoneLayout.value) {
    return;
  }

  const nextWidgets = widgets.value.map((widget) => ({ ...widget }));
  const target = nextWidgets.find((widget) => widget.id === payload.id);

  if (!target) {
    return;
  }

  const resolved = resolveRect(nextWidgets, payload.id, {
    x: target.position.x,
    y: target.position.y,
    width: payload.width,
    height: payload.height
  });

  widgets.value = nextWidgets.map((widget) =>
    widget.id === payload.id
      ? {
          ...widget,
          position: {
            x: resolved.x,
            y: resolved.y
          },
          size: {
            width: resolved.width,
            height: resolved.height
          }
        }
      : widget
  );
}

function getHighestZIndex() {
  return widgets.value.reduce((max, widget) => Math.max(max, widget.zIndex), 0);
}

function bringWidgetToFront(id: string) {
  const highest = getHighestZIndex();
  widgets.value = widgets.value.map((widget) =>
    widget.id === id
      ? {
          ...widget,
          zIndex: highest + 1
        }
      : widget
  );
}

function getNextCustomPosition() {
  const nonPinned = widgets.value.filter((widget) => !widget.pinned);
  const index = nonPinned.length;
  const column = clampColumnIndex(index % COLUMN_COUNT, 1);
  const row = Math.floor(index / COLUMN_COUNT);
  const baseX = getColumnOffset(column);
  const baseY = snapToGrid(GRID_SIZE * 3 + row * (MIN_HEIGHT + GRID_SIZE * 6));
  return { x: baseX, y: baseY };
}

function addCustomWidget(payload: CreateWidgetPayload) {
  const highest = getHighestZIndex();
  const { x, y } = getNextCustomPosition();
  const { width: normalizedWidth } = normalizeColumnWidth(Math.max(payload.size.width, MIN_WIDTH));
  const newWidget: WidgetState = {
    id: `custom-${customWidgetCounter++}`,
    title: payload.title,
    icon: payload.icon,
    accent: payload.accent,
    description: payload.description,
    position: { x, y },
    size: {
      width: normalizedWidth,
      height: Math.max(MIN_HEIGHT, snapToGrid(payload.size.height))
    },
    component: payload.component,
    zIndex: highest + 1,
    config: payload.config
  };

  const resolved = resolveRect(widgets.value, newWidget.id, {
    x: newWidget.position.x,
    y: newWidget.position.y,
    width: newWidget.size.width,
    height: newWidget.size.height
  });

  newWidget.position = { x: resolved.x, y: resolved.y };
  newWidget.size = { width: resolved.width, height: resolved.height };

  widgets.value = [...widgets.value, newWidget];
}

function updateWidgetConfig(payload: { id: string; config: CustomWidgetConfig }) {
  widgets.value = widgets.value.map((widget) =>
    widget.id === payload.id
      ? {
          ...widget,
          config: payload.config
        }
      : widget
  );
}

function updateCustomWidget(payload: UpdateWidgetPayload) {
  const nextWidgets = widgets.value.map((widget) => ({ ...widget }));
  const target = nextWidgets.find((widget) => widget.id === payload.id);

  if (!target) {
    return;
  }

  const resolved = resolveRect(nextWidgets, payload.id, {
    x: target.position.x,
    y: target.position.y,
    width: payload.size.width,
    height: payload.size.height
  });

  widgets.value = nextWidgets.map((widget) =>
    widget.id === payload.id
      ? {
          ...widget,
          title: payload.title,
          icon: payload.icon,
          accent: payload.accent,
          description: payload.description,
          position: {
            x: resolved.x,
            y: resolved.y
          },
          size: {
            width: resolved.width,
            height: resolved.height
          },
          component: widget.component,
          config: payload.config
        }
      : widget
  );
}

function deleteCustomWidget(id: string) {
  widgets.value = widgets.value.filter((widget) => widget.id !== id);
}

function togglePin(id: string) {
  widgets.value = widgets.value.map((widget) =>
    widget.id === id
      ? {
          ...widget,
          pinned: !widget.pinned
        }
      : widget
  );
}

function resetLayout() {
  const reset = normalizeWidgetLayout(createInitialWidgets());
  widgets.value = reset;
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  customWidgetCounter = getNextCustomIndex(reset);
}

function cascadeWidgets() {
  const pinnedWidgets = widgets.value.filter((widget) => widget.pinned);
  const updated: WidgetState[] = pinnedWidgets.map((widget) => ({
    ...widget,
    position: { ...widget.position },
    size: { ...widget.size }
  }));
  const gap = GRID_SIZE * 0.75;
  const columnWidth = MIN_WIDTH + GRID_SIZE * 5;
  const startX = GRID_SIZE * 2;
  const startY = GRID_SIZE * 3;
  let column = 0;
  let columnHeight = 0;

  for (const widget of widgets.value) {
    if (widget.pinned) {
      continue;
    }

    const newX = startX + column * (columnWidth + gap);
    const newY = startY + columnHeight;

    const desired = {
      x: newX,
      y: newY,
      width: widget.size.width,
      height: widget.size.height
    };

    const resolved = resolveRect(updated, widget.id, desired);

    updated.push({
      ...widget,
      position: {
        x: resolved.x,
        y: resolved.y
      },
      size: {
        width: resolved.width,
        height: resolved.height
      }
    });

    columnHeight += widget.size.height + gap;

    if (columnHeight > 520) {
      column += 1;
      columnHeight = 0;
    }
  }

  widgets.value = normalizeWidgetLayout(updated);
}

function toggleFullBleed() {
  isFullBleed.value = !isFullBleed.value;
}

function toggleFullscreen() {
  if (!isFullscreen.value) {
    const root = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    const request = root.requestFullscreen?.() ?? root.webkitRequestFullscreen?.();
    if (request && typeof request.catch === 'function') {
      request.catch(() => {
        isFullscreen.value = false;
      });
    }
  } else {
    const exit = document.exitFullscreen?.();
    if (exit && typeof exit.catch === 'function') {
      exit.catch(() => {
        isFullscreen.value = Boolean(document.fullscreenElement);
      });
    }
  }
}

function handleFullscreenChange() {
  isFullscreen.value = Boolean(document.fullscreenElement);
}

function updatePhoneLayoutState() {
  if (!phoneMediaQuery) {
    return;
  }
  isPhoneLayout.value = phoneMediaQuery.matches;
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  phoneMediaQuery = window.matchMedia('(max-width: 720px)');
  phoneMediaQuery.addEventListener('change', updatePhoneLayoutState);
  updatePhoneLayoutState();
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  phoneMediaQuery?.removeEventListener('change', updatePhoneLayoutState);
  if (persistTimer !== null) {
    clearTimeout(persistTimer);
    if (typeof window !== 'undefined') {
      persistWidgets(widgets.value);
    }
    persistTimer = null;
  }
});
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--full': isFullBleed, 'app-shell--phone': isPhoneLayout }">
    <div class="aurora" aria-hidden="true"></div>
    <div class="content" :class="{ 'content--full': isFullBleed }">
      <DMToolbar
        title="Daggerheart Director"
        subtitle="A living control board for guiding dramatic encounters"
        :pinned-count="pinnedCount"
        :total-widgets="widgets.length"
        :full-bleed="isFullBleed"
        :fullscreen="isFullscreen"
        :phone-layout="isPhoneLayout"
        @reset="resetLayout"
        @cascade="cascadeWidgets"
        @toggle-full-bleed="toggleFullBleed"
        @toggle-fullscreen="toggleFullscreen"
      />
      <WidgetBoard
        :widgets="widgets"
        :disable-interactions="isPhoneLayout"
        :canvas-size="boardSize"
        @update:position="updateWidgetPosition"
        @update:size="updateWidgetSize"
        @focus="bringWidgetToFront"
        @toggle-pin="togglePin"
        @create-widget="addCustomWidget"
        @update-config="updateWidgetConfig"
        @update-widget="updateCustomWidget"
        @delete-widget="deleteCustomWidget"
      />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0d1726 0%, #0b1422 36%, #08101b 100%);
}

.app-shell--full {
  padding: 0;
}

.aurora {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% -10%, rgba(109, 173, 255, 0.28), transparent 55%),
    radial-gradient(circle at 90% -20%, rgba(255, 176, 196, 0.22), transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(95, 255, 198, 0.18), transparent 55%);
  opacity: 0.85;
  filter: blur(6px) saturate(1.1);
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 2;
  padding: 40px clamp(32px, 4vw, 68px) 64px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content--full {
  min-height: 100vh;
  padding: 16px clamp(16px, 2vw, 32px) 32px;
}

.content--full .board {
  min-height: calc(100vh - 220px);
}

@media (max-width: 900px) {
  .content {
    padding: 32px clamp(20px, 5vw, 42px) 44px;
  }
}

@media (max-width: 720px) {
  .content {
    padding: 20px 14px 32px;
    gap: 22px;
  }

  .app-shell--phone .content {
    min-height: 100vh;
    gap: 28px;
    padding-bottom: 44px;
  }
}
</style>
