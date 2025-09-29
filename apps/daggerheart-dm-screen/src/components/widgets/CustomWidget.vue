<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  CustomChecklistConfig,
  CustomChecklistItem,
  CustomNoteConfig,
  CustomStatBlockConfig,
  CustomTrackerConfig,
  CustomTrackerTrack,
  CustomWidgetConfig
} from '../../types';

const props = defineProps<{ config?: CustomWidgetConfig; widgetId: string }>();

const emit = defineEmits<{
  (e: 'update-config', payload: { id: string; config: CustomWidgetConfig }): void;
}>();

const checklistItems = ref<CustomChecklistItem[]>([]);
const trackerTracks = ref<CustomTrackerTrack[]>([]);

const isNote = computed(() => props.config?.type === 'note');
const isChecklist = computed(() => props.config?.type === 'checklist');
const isTracker = computed(() => props.config?.type === 'tracker');
const isStatBlock = computed(() => props.config?.type === 'stat-block');

const noteBody = computed(() => {
  if (!isNote.value) {
    return [] as string[];
  }
  const config = props.config as CustomNoteConfig;
  return config.body.split(/\n+/).map((segment) => segment.trim()).filter(Boolean);
});

const statSummary = computed(() => {
  if (!isStatBlock.value) {
    return '';
  }
  const config = props.config as CustomStatBlockConfig;
  return config.summary ?? '';
});

const statEntries = computed(() => {
  if (!isStatBlock.value) {
    return [];
  }
  const config = props.config as CustomStatBlockConfig;
  return config.entries;
});

watch(
  () => props.config,
  (config) => {
    if (config?.type === 'checklist') {
      const checklist = config as CustomChecklistConfig;
      checklistItems.value = checklist.items.map((item) => ({ ...item }));
    } else {
      checklistItems.value = [];
    }

    if (config?.type === 'tracker') {
      const tracker = config as CustomTrackerConfig;
      trackerTracks.value = tracker.tracks.map((track) => ({ ...track }));
    } else {
      trackerTracks.value = [];
    }
  },
  { immediate: true, deep: true }
);

function toggleChecklistItem(index: number) {
  if (props.config?.type !== 'checklist') {
    return;
  }
  const next = [...checklistItems.value];
  const target = next[index];
  if (!target) {
    return;
  }
  next[index] = { ...target, complete: !target.complete };
  const updatedItems = next.map((item) => ({ ...item }));
  checklistItems.value = updatedItems;
  emit('update-config', {
    id: props.widgetId,
    config: {
      type: 'checklist',
      items: updatedItems
    }
  });
}

function adjustTrack(index: number, delta: number) {
  if (props.config?.type !== 'tracker') {
    return;
  }
  const next = [...trackerTracks.value];
  const target = next[index];
  if (!target) {
    return;
  }
  const updated = {
    ...target,
    current: Math.min(Math.max(target.current + delta, 0), Math.max(target.max, 0))
  };
  next[index] = updated;
  const updatedTracks = next.map((track) => ({ ...track }));
  trackerTracks.value = updatedTracks;
  emit('update-config', {
    id: props.widgetId,
    config: {
      type: 'tracker',
      tracks: updatedTracks
    }
  });
}
</script>

<template>
  <div class="custom-widget">
    <template v-if="isNote">
      <div class="note" v-if="noteBody.length">
        <p v-for="(paragraph, index) in noteBody" :key="index">{{ paragraph }}</p>
      </div>
      <p v-else class="empty-state">Add a note body in the widget builder to fill this card.</p>
    </template>

    <template v-else-if="isChecklist">
      <ul v-if="checklistItems.length" class="checklist">
        <li v-for="(item, index) in checklistItems" :key="`${item.text}-${index}`">
          <button type="button" @click="toggleChecklistItem(index)" :aria-pressed="Boolean(item.complete)">
            <span class="indicator" aria-hidden="true">{{ item.complete ? '☑' : '☐' }}</span>
            <span :class="{ complete: item.complete }">{{ item.text }}</span>
          </button>
        </li>
      </ul>
      <p v-else class="empty-state">Use the widget library to add checklist items.</p>
    </template>

    <template v-else-if="isTracker">
      <div v-if="trackerTracks.length" class="tracker">
        <div v-for="(track, index) in trackerTracks" :key="`${track.label}-${index}`" class="tracker__item">
          <header>
            <h3>{{ track.label }}</h3>
            <span>{{ track.current }} / {{ track.max }}</span>
          </header>
          <div class="bar" role="presentation">
            <div class="fill" :style="{ width: `${track.max > 0 ? Math.min(track.current / track.max, 1) * 100 : 0}%` }"></div>
          </div>
          <div class="controls" role="group" aria-label="Adjust {{ track.label }}">
            <button type="button" @click="adjustTrack(index, -1)" aria-label="Decrease">−</button>
            <button type="button" @click="adjustTrack(index, 1)" aria-label="Increase">+</button>
          </div>
        </div>
      </div>
      <p v-else class="empty-state">Define one or more tracker tracks in the builder to see them here.</p>
    </template>

    <template v-else-if="isStatBlock">
      <div class="stat-block">
        <p v-if="statSummary" class="summary">{{ statSummary }}</p>
        <dl>
          <template v-for="entry in statEntries" :key="`${entry.label}-${entry.value}`">
            <dt>{{ entry.label }}</dt>
            <dd>{{ entry.value }}</dd>
          </template>
        </dl>
      </div>
    </template>

    <p v-else class="empty-state">Configure a template in the library to populate this widget.</p>
  </div>
</template>

<style scoped>
.custom-widget {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow: auto;
  padding-right: 6px;
}

.note {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: rgba(232, 240, 255, 0.92);
  font-size: 0.95rem;
  line-height: 1.5;
}

.checklist {
  display: grid;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.checklist li button {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  border: 1px solid rgba(118, 174, 255, 0.24);
  border-radius: 14px;
  padding: 10px 14px;
  background: rgba(10, 18, 32, 0.6);
  color: inherit;
  cursor: pointer;
  text-align: left;
  font-size: 0.92rem;
}

.checklist li button:focus-visible {
  outline: 2px solid rgba(132, 198, 255, 0.8);
  outline-offset: 2px;
}

.checklist .indicator {
  font-size: 1.1rem;
}

.checklist .complete {
  text-decoration: line-through;
  opacity: 0.6;
}

.tracker {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tracker__item {
  border: 1px solid rgba(118, 174, 255, 0.2);
  border-radius: 16px;
  padding: 12px 16px;
  background: rgba(8, 16, 28, 0.6);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tracker__item header {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.bar {
  position: relative;
  height: 8px;
  border-radius: 999px;
  background: rgba(118, 174, 255, 0.16);
  overflow: hidden;
}

.fill {
  position: absolute;
  inset: 0;
  width: 0;
  background: linear-gradient(90deg, rgba(118, 174, 255, 0.8), rgba(94, 209, 255, 0.7));
  transition: width 0.2s ease;
}

.controls {
  display: flex;
  gap: 8px;
}

.controls button {
  flex: 1;
  border-radius: 999px;
  border: 1px solid rgba(118, 174, 255, 0.35);
  background: rgba(6, 14, 26, 0.7);
  color: rgba(224, 238, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1;
  padding: 6px 0;
  cursor: pointer;
}

.controls button:focus-visible {
  outline: 2px solid rgba(132, 198, 255, 0.8);
  outline-offset: 2px;
}

.stat-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-block .summary {
  font-size: 0.95rem;
  color: rgba(224, 235, 255, 0.88);
}

.stat-block dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 6px 18px;
  margin: 0;
}

.stat-block dt {
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(200, 216, 255, 0.6);
}

.stat-block dd {
  margin: 0;
  font-size: 0.95rem;
}

.empty-state {
  margin: 0 auto;
  text-align: center;
  color: rgba(196, 212, 240, 0.65);
  font-size: 0.9rem;
  max-width: 240px;
}
</style>
