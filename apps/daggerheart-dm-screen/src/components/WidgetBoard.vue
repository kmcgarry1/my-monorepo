<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue';
import DraggableWidget from './DraggableWidget.vue';
import EncounterTimeline from './widgets/EncounterTimeline.vue';
import MomentumTracker from './widgets/MomentumTracker.vue';
import ConditionsQuickRef from './widgets/ConditionsQuickRef.vue';
import SRDLibrary from './widgets/SRDLibrary.vue';
import DiceOracle from './widgets/DiceOracle.vue';
import ThreatsAndHooks from './widgets/ThreatsAndHooks.vue';
import CustomWidgetLibrary from './widgets/CustomWidgetLibrary.vue';
import CustomWidget from './widgets/CustomWidget.vue';
import type { CreateWidgetPayload, CustomWidgetConfig, UpdateWidgetPayload, WidgetState } from '../types';
import { COLUMN_COUNT, COLUMN_STEP, COLUMN_WIDTH } from '../constants/layout';

const componentMap: Record<string, Component> = {
  EncounterTimeline,
  MomentumTracker,
  ConditionsQuickRef,
  SRDLibrary,
  DiceOracle,
  ThreatsAndHooks,
  CustomWidgetLibrary,
  CustomWidget
};

const props = defineProps<{
  widgets: WidgetState[];
  disableInteractions?: boolean;
  canvasSize: { width: number; height: number };
}>();

const emit = defineEmits<{
  (e: 'update:position', payload: { id: string; x: number; y: number }): void;
  (e: 'update:size', payload: { id: string; width: number; height: number }): void;
  (e: 'focus', id: string): void;
  (e: 'toggle-pin', id: string): void;
  (e: 'create-widget', payload: CreateWidgetPayload): void;
  (e: 'update-config', payload: { id: string; config: CustomWidgetConfig }): void;
  (e: 'update-widget', payload: UpdateWidgetPayload): void;
  (e: 'delete-widget', id: string): void;
}>();

const highlightedColumn = ref<number | null>(null);

const columns = computed(() =>
  Array.from({ length: COLUMN_COUNT }, (_, index) => ({
    index,
    style: {
      width: `${COLUMN_WIDTH}px`,
      left: `${index * COLUMN_STEP}px`
    }
  }))
);

watch(
  () => props.disableInteractions,
  (disabled) => {
    if (disabled) {
      highlightedColumn.value = null;
    }
  }
);

function getWidgetProps(widget: WidgetState) {
  if (widget.component === 'CustomWidget') {
    return { config: widget.config, widgetId: widget.id };
  }
  if (widget.component === 'CustomWidgetLibrary') {
    const customWidgets = props.widgets.filter((item) => item.component === 'CustomWidget');
    return { customWidgets };
  }
  return {};
}

function handleCreateWidget(payload: CreateWidgetPayload) {
  emit('create-widget', payload);
}

function handleUpdateConfig(payload: { id: string; config: CustomWidgetConfig }) {
  emit('update-config', payload);
}

function handleUpdateWidget(payload: UpdateWidgetPayload) {
  emit('update-widget', payload);
}

function handleDeleteWidget(id: string) {
  emit('delete-widget', id);
}

function handleHoverColumn(payload: { column: number | null }) {
  highlightedColumn.value = payload.column;
}
</script>

<template>
  <section class="board" :class="{ 'board--mobile': props.disableInteractions }" aria-label="Daggerheart control board">
    <div
      v-if="!props.disableInteractions"
      class="board__canvas"
      :class="{ 'board__canvas--dragging': highlightedColumn !== null }"
      data-board-canvas
      :style="{
        width: `${Math.max(props.canvasSize.width, 0)}px`,
        height: `${Math.max(props.canvasSize.height, 0)}px`,
        '--column-width': `${COLUMN_WIDTH}px`,
        '--column-step': `${COLUMN_STEP}px`
      }"
    >
      <div class="grid-surface" aria-hidden="true"></div>
      <div class="board__columns" aria-hidden="true">
        <div
          v-for="column in columns"
          :key="column.index"
          class="board__column"
          :class="{ 'board__column--highlighted': highlightedColumn === column.index }"
          :style="column.style"
        ></div>
      </div>
      <DraggableWidget
        v-for="widget in props.widgets"
        :key="widget.id"
        :widget="widget"
        :disable-interactions="props.disableInteractions"
        @dragging="(payload) => emit('update:position', payload)"
        @resizing="(payload) => emit('update:size', payload)"
        @focus="emit('focus', widget.id)"
        @toggle-pin="emit('toggle-pin', widget.id)"
        @hover-column="handleHoverColumn"
      >
        <component
          :is="componentMap[widget.component] ?? componentMap.EncounterTimeline"
          v-bind="getWidgetProps(widget)"
          @create-widget="handleCreateWidget"
          @update-config="handleUpdateConfig"
          @update-widget="handleUpdateWidget"
          @delete-widget="handleDeleteWidget"
        />
      </DraggableWidget>
    </div>
    <template v-else>
      <div class="grid-surface" aria-hidden="true"></div>
      <DraggableWidget
        v-for="widget in props.widgets"
        :key="widget.id"
        :widget="widget"
        :disable-interactions="props.disableInteractions"
        @dragging="(payload) => emit('update:position', payload)"
        @resizing="(payload) => emit('update:size', payload)"
        @focus="emit('focus', widget.id)"
        @toggle-pin="emit('toggle-pin', widget.id)"
        @hover-column="handleHoverColumn"
      >
        <component
          :is="componentMap[widget.component] ?? componentMap.EncounterTimeline"
          v-bind="getWidgetProps(widget)"
          @create-widget="handleCreateWidget"
          @update-config="handleUpdateConfig"
          @update-widget="handleUpdateWidget"
          @delete-widget="handleDeleteWidget"
        />
      </DraggableWidget>
    </template>
  </section>
</template>

<style scoped>
.board {
  position: relative;
  min-height: 680px;
  border-radius: 26px;
  border: 1px solid var(--surface-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), var(--surface-strong));
  box-shadow: 0 26px 60px rgba(7, 14, 26, 0.38);
  overflow: auto;
  padding: 26px 28px;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

.board:hover {
  border-color: rgba(150, 190, 245, 0.28);
  box-shadow: 0 32px 70px rgba(6, 13, 24, 0.42);
}

.board--mobile {
  min-height: 0;
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: none;
  overflow: visible;
}

.board__canvas {
  position: relative;
  min-width: 100%;
  --column-width: 224px;
  --column-step: calc(var(--column-width) + 32px);
}

.board__canvas--dragging .grid-surface {
  opacity: 0.45;
}

.grid-surface {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
      to right,
      rgba(130, 165, 220, 0.18) 0,
      rgba(130, 165, 220, 0.18) var(--column-width, 224px),
      transparent var(--column-width, 224px),
      transparent var(--column-step, 256px)
    ),
    linear-gradient(rgba(130, 165, 220, 0.12) 1px, transparent 1px);
  background-size: var(--column-step, 256px) 100%, 96px 96px;
  opacity: 0.35;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.board__columns {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.board__column {
  position: absolute;
  top: 8px;
  bottom: 8px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(110, 160, 255, 0.16), rgba(30, 52, 86, 0.08));
  opacity: 0;
  transition: opacity 0.18s ease;
}

.board__canvas--dragging .board__column {
  opacity: 0.16;
}

.board__column--highlighted {
  opacity: 0.38;
  box-shadow: 0 0 0 1px rgba(150, 190, 245, 0.38);
}

@media (max-width: 900px) {
  .board {
    padding: 24px;
    min-height: 600px;
  }
}

@media (max-width: 720px) {
  .board {
    border-radius: 22px;
    border-width: 1px;
  }

  .board__canvas {
    min-width: 0;
    width: 100% !important;
    height: auto !important;
  }

  .grid-surface {
    opacity: 0.22;
    background-size: 72px 72px;
  }
}
</style>
