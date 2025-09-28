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
        @create-widget="(payload) => emit('create-widget', payload)"
        @update-config="(payload) => emit('update-config', payload)"
        @update-widget="(payload) => emit('update-widget', payload)"
        @delete-widget="(id) => emit('delete-widget', id)"
      />
    </DraggableWidget>
  </section>
</template>

<style scoped>
.board {
  position: relative;
  min-height: 740px;
  border-radius: 32px;
  border: 1px solid rgba(104, 150, 255, 0.25);
  background: linear-gradient(180deg, rgba(7, 12, 22, 0.82), rgba(7, 12, 22, 0.96));
  overflow: hidden;
  padding: 32px;
}

.board--mobile {
  min-height: 0;
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grid-surface {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(96, 144, 255, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96, 144, 255, 0.08) 1px, transparent 1px);
  background-size: 120px 120px;
  opacity: 0.4;
  pointer-events: none;
}

@media (max-width: 900px) {
  .board {
    padding: 28px;
    min-height: 640px;
  }
}

@media (max-width: 720px) {
  .board {
    border-radius: 24px;
    border-width: 1px;
  }

  .grid-surface {
    opacity: 0.25;
    background-size: 80px 80px;
  }
}
</style>
