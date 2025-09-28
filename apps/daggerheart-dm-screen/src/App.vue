<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import WidgetBoard from './components/WidgetBoard.vue';
import DMToolbar from './components/DMToolbar.vue';
import type { CreateWidgetPayload, WidgetState } from './types';
import { createInitialWidgets } from './data/widgets';

const GRID_SIZE = 40;
const MIN_WIDTH = GRID_SIZE * 5;
const MIN_HEIGHT = GRID_SIZE * 4;

const widgets = ref<WidgetState[]>(createInitialWidgets());

let customWidgetCounter = 1;

const pinnedCount = computed(() => widgets.value.filter((widget) => widget.pinned).length);
const isFullBleed = ref(false);
const isFullscreen = ref(false);
const isPhoneLayout = ref(false);

let phoneMediaQuery: MediaQueryList | null = null;

function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function updateWidgetPosition(payload: { id: string; x: number; y: number }) {
  if (isPhoneLayout.value) {
    return;
  }

  widgets.value = widgets.value.map((widget) =>
    widget.id === payload.id
      ? {
          ...widget,
          position: {
            x: snapToGrid(payload.x),
            y: snapToGrid(payload.y)
          }
        }
      : widget
  );
}

function updateWidgetSize(payload: { id: string; width: number; height: number }) {
  if (isPhoneLayout.value) {
    return;
  }

  widgets.value = widgets.value.map((widget) =>
    widget.id === payload.id
      ? {
          ...widget,
          size: {
            width: Math.max(MIN_WIDTH, snapToGrid(payload.width)),
            height: Math.max(MIN_HEIGHT, snapToGrid(payload.height))
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
  const baseX = snapToGrid(160 + column * 220);
  const baseY = snapToGrid(160 + row * 220);
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

  widgets.value = [...widgets.value, newWidget];
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
}

function cascadeWidgets() {
  const updated: WidgetState[] = [];
  const gap = 28;
  const columnWidth = 360;
  const startX = 48;
  const startY = 120;
  let column = 0;
  let columnHeight = 0;

  for (const widget of widgets.value) {
    if (widget.pinned) {
      updated.push(widget);
      continue;
    }

    const newX = startX + column * (columnWidth + gap);
    const newY = startY + columnHeight;

    updated.push({
      ...widget,
      position: {
        x: snapToGrid(newX),
        y: snapToGrid(newY)
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
        @update:position="updateWidgetPosition"
        @update:size="updateWidgetSize"
        @focus="bringWidgetToFront"
        @toggle-pin="togglePin"
        @create-widget="addCustomWidget"
      />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at 12% 8%, rgba(100, 146, 255, 0.18), transparent 55%),
    radial-gradient(circle at 85% 0%, rgba(255, 120, 221, 0.14), transparent 40%),
    radial-gradient(circle at 50% 80%, rgba(95, 255, 198, 0.12), transparent 45%),
    #05080f;
}

.app-shell--full {
  padding: 0;
}

.aurora {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 220px,
      rgba(104, 150, 255, 0.03) 220px,
      rgba(104, 150, 255, 0.03) 440px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 220px,
      rgba(104, 150, 255, 0.03) 220px,
      rgba(104, 150, 255, 0.03) 440px
    );
  mask: linear-gradient(180deg, rgba(5, 8, 15, 1) 0%, rgba(5, 8, 15, 0.45) 40%, rgba(5, 8, 15, 0) 100%);
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 2;
  padding: 48px clamp(32px, 4vw, 72px) 72px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.content--full {
  min-height: 100vh;
  padding: 12px clamp(12px, 2vw, 32px) 32px;
}

.content--full .board {
  min-height: calc(100vh - 220px);
}

@media (max-width: 900px) {
  .content {
    padding: 32px clamp(20px, 5vw, 42px) 48px;
  }
}

@media (max-width: 720px) {
  .content {
    padding: 24px 16px 32px;
    gap: 24px;
  }

  .app-shell--phone .content {
    min-height: 100vh;
  }
}
</style>
