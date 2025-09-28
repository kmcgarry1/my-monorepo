<script setup lang="ts">
import { computed, ref } from 'vue';
import WidgetBoard from './components/WidgetBoard.vue';
import DMToolbar from './components/DMToolbar.vue';
import type { WidgetState } from './types';
import { createInitialWidgets } from './data/widgets';

const widgets = ref<WidgetState[]>(createInitialWidgets());

const pinnedCount = computed(() => widgets.value.filter((widget) => widget.pinned).length);

function updateWidgetPosition(payload: { id: string; x: number; y: number }) {
  widgets.value = widgets.value.map((widget) =>
    widget.id === payload.id
      ? {
          ...widget,
          position: {
            x: Math.round(payload.x),
            y: Math.round(payload.y)
          }
        }
      : widget
  );
}

function bringWidgetToFront(id: string) {
  const highest = Math.max(...widgets.value.map((widget) => widget.zIndex));
  widgets.value = widgets.value.map((widget) =>
    widget.id === id
      ? {
          ...widget,
          zIndex: highest + 1
        }
      : widget
  );
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
        x: newX,
        y: newY
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
</script>

<template>
  <div class="app-shell">
    <div class="aurora" aria-hidden="true"></div>
    <div class="content">
      <DMToolbar
        title="Daggerheart Director"
        subtitle="A living control board for guiding dramatic encounters"
        :pinned-count="pinnedCount"
        :total-widgets="widgets.length"
        @reset="resetLayout"
        @cascade="cascadeWidgets"
      />
      <WidgetBoard
        :widgets="widgets"
        @update:position="updateWidgetPosition"
        @focus="bringWidgetToFront"
        @toggle-pin="togglePin"
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
</style>
