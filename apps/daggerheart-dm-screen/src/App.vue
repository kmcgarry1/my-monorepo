<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WidgetBoard from './components/WidgetBoard.vue';
import DMToolbar from './components/DMToolbar.vue';
import type { CreateWidgetPayload, CustomWidgetConfig, UpdateWidgetPayload, WidgetState } from './types';
import { createInitialWidgets } from './data/widgets';

const GRID_SIZE = 32;
const MIN_WIDTH = GRID_SIZE * 5;
const MIN_HEIGHT = GRID_SIZE * 4;
const CANVAS_PADDING = GRID_SIZE * 4;

const STORAGE_KEY = 'daggerheart-dm-widgets';

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
      return parsed as WidgetState[];
    }
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to parse stored widget layout:', error);
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return null;
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

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function createRect(widget: WidgetState): Rect {
  return {
    x: widget.position.x,
    y: widget.position.y,
    width: widget.size.width,
    height: widget.size.height
  };
}

function rectsOverlap(a: Rect, b: Rect) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function resolveRect(allWidgets: WidgetState[], widgetId: string, target: Rect): Rect {
  const others = allWidgets
    .filter((widget) => widget.id !== widgetId)
    .map((widget) => ({ ...createRect(widget) }));

  const baseX = snapToGrid(Math.max(target.x, 0));
  const baseY = snapToGrid(Math.max(target.y, 0));
  const desiredWidth = Math.max(snapToGrid(target.width), MIN_WIDTH);
  const desiredHeight = Math.max(snapToGrid(target.height), MIN_HEIGHT);
  const maxExistingRight = others.reduce((max, rect) => Math.max(max, rect.x + rect.width), desiredWidth);
  const rightLimit = Math.max(maxExistingRight + CANVAS_PADDING * 8, baseX + desiredWidth + CANVAS_PADDING * 4);

  let attempt = 0;
  const maxAttempts = Math.max(others.length * 40, 600);
  let x = baseX;
  let y = baseY;

  while (attempt < maxAttempts) {
    const candidate: Rect = {
      x,
      y,
      width: desiredWidth,
      height: desiredHeight
    };

    const collider = others.find((rect) => rectsOverlap(candidate, rect));

    if (!collider) {
      return candidate;
    }

    const shiftRight = snapToGrid(collider.x + collider.width + GRID_SIZE);

    if (shiftRight + desiredWidth <= rightLimit) {
      x = shiftRight;
    } else {
      x = baseX;
      y = snapToGrid(Math.max(y, collider.y + collider.height + GRID_SIZE));
    }

    attempt += 1;
  }

  return {
    x,
    y,
    width: desiredWidth,
    height: desiredHeight
  };
}

function calculateBoardSize(state: WidgetState[]): { width: number; height: number } {
  if (state.length === 0) {
    return { width: MIN_WIDTH + CANVAS_PADDING * 2, height: MIN_HEIGHT + CANVAS_PADDING * 2 };
  }

  const { maxRight, maxBottom } = state.reduce(
    (acc, widget) => {
      const rect = createRect(widget);
      return {
        maxRight: Math.max(acc.maxRight, rect.x + rect.width),
        maxBottom: Math.max(acc.maxBottom, rect.y + rect.height)
      };
    },
    { maxRight: 0, maxBottom: 0 }
  );

  return {
    width: Math.max(maxRight + CANVAS_PADDING, MIN_WIDTH * 4),
    height: Math.max(maxBottom + CANVAS_PADDING, MIN_HEIGHT * 3)
  };
}

const initialWidgets = loadPersistedWidgets() ?? createInitialWidgets();
const widgets = ref<WidgetState[]>(initialWidgets);
const boardSize = computed(() => calculateBoardSize(widgets.value));

let customWidgetCounter = getNextCustomIndex(initialWidgets);

const pinnedCount = computed(() => widgets.value.filter((widget) => widget.pinned).length);
const isFullBleed = ref(false);
const isFullscreen = ref(false);
const isPhoneLayout = ref(false);

let phoneMediaQuery: MediaQueryList | null = null;

watch(
  widgets,
  (next) => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },
  { deep: true, immediate: true }
);

function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

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
  const column = index % 3;
  const row = Math.floor(index / 3);
  const baseX = snapToGrid(96 + column * (MIN_WIDTH + GRID_SIZE * 5));
  const baseY = snapToGrid(96 + row * (MIN_HEIGHT + GRID_SIZE * 6));
  return { x: baseX, y: baseY };
}

function addCustomWidget(payload: CreateWidgetPayload) {
  const highest = getHighestZIndex();
  const { x, y } = getNextCustomPosition();
  const newWidget: WidgetState = {
    id: `custom-${customWidgetCounter++}`,
    title: payload.title,
    icon: payload.icon,
    accent: payload.accent,
    description: payload.description,
    position: { x, y },
    size: {
      width: Math.max(MIN_WIDTH, snapToGrid(payload.size.width)),
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
  widgets.value = createInitialWidgets();
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  customWidgetCounter = getNextCustomIndex(widgets.value);
}

function cascadeWidgets() {
  const pinnedWidgets = widgets.value.filter((widget) => widget.pinned);
  const updated: WidgetState[] = pinnedWidgets.map((widget) => ({ ...widget }));
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

    const desired: Rect = {
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

  widgets.value = updated;
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
    padding: 24px 16px 32px;
    gap: 20px;
  }

  .app-shell--phone .content {
    min-height: 100vh;
  }
}
</style>
