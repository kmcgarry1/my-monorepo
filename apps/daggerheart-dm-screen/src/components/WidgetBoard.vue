<script setup lang="ts">
import type { Component } from 'vue';
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
</script>

<template>
  <section class="board" :class="{ 'board--mobile': props.disableInteractions }" aria-label="Daggerheart control board">
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
  overflow: hidden;
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
}

.grid-surface {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(130, 165, 220, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(130, 165, 220, 0.08) 1px, transparent 1px);
  background-size: 96px 96px;
  opacity: 0.35;
  pointer-events: none;
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

  .grid-surface {
    opacity: 0.22;
    background-size: 72px 72px;
  }
}
</style>
