<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  CreateWidgetPayload,
  CustomChecklistConfig,
  CustomChecklistItem,
  CustomNoteConfig,
  CustomStatBlockConfig,
  CustomStatBlockEntry,
  CustomTrackerConfig,
  CustomTrackerTrack,
  CustomWidgetConfig,
  CustomWidgetTemplate,
  WidgetSize
} from '../../types';

interface WidgetTemplateDefinition {
  id: CustomWidgetTemplate;
  name: string;
  summary: string;
  description: string;
  icon: string;
  accent: string;
  size: WidgetSize;
  defaults: CustomWidgetConfig;
}

const templates: WidgetTemplateDefinition[] = [
  {
    id: 'note',
    name: 'Lore Notebook',
    summary: 'Freeform notes for clues, lore, or table rules.',
    description: 'Capture fresh discoveries or improvised story beats in a dedicated note card.',
    icon: '📝',
    accent: 'linear-gradient(135deg, rgba(255, 224, 140, 0.6), rgba(255, 160, 90, 0.4))',
    size: { width: 360, height: 320 },
    defaults: {
      type: 'note',
      body: 'Who? What do they want? What stands in the way?\n\nUse this space to jot down emergent story beats and NPC truths.'
    }
  },
  {
    id: 'checklist',
    name: 'Scene Checklist',
    summary: 'Track beats that you want to reveal during play.',
    description: 'Create a punch list of reveals, complications, or reminders for the current scene.',
    icon: '✅',
    accent: 'linear-gradient(135deg, rgba(160, 255, 180, 0.6), rgba(92, 200, 255, 0.4))',
    size: { width: 380, height: 340 },
    defaults: {
      type: 'checklist',
      items: [
        { text: 'Reveal the secret sigil', complete: false },
        { text: 'Offer a dramatic choice', complete: false },
        { text: 'Show the cost of failure', complete: false }
      ]
    }
  },
  {
    id: 'tracker',
    name: 'Resource Tracker',
    summary: 'Monitor a shared resource or looming clock.',
    description: 'Flexible progress bars for momentum, threats, clocks, or other evolving resources.',
    icon: '📊',
    accent: 'linear-gradient(135deg, rgba(140, 200, 255, 0.6), rgba(180, 120, 255, 0.4))',
    size: { width: 400, height: 340 },
    defaults: {
      type: 'tracker',
      tracks: [
        { label: 'Momentum', current: 3, max: 6 },
        { label: 'Threat Clock', current: 1, max: 4 }
      ]
    }
  },
  {
    id: 'stat-block',
    name: 'Quick NPC Card',
    summary: 'One glance NPC or location reference.',
    description: 'Keep the drive, tactics, and hooks for an important NPC or location at hand.',
    icon: '🪪',
    accent: 'linear-gradient(135deg, rgba(255, 180, 220, 0.6), rgba(120, 130, 255, 0.4))',
    size: { width: 420, height: 360 },
    defaults: {
      type: 'stat-block',
      summary: 'Grimwarden of the Emberwood — protective but secretive.',
      entries: [
        { label: 'Drive', value: 'Shield the refugees from the Iron Chorus.' },
        { label: 'Approach', value: 'Measured speech, wary eyes, defensive stance.' },
        { label: 'Hook', value: 'Knows a shortcut through the dreaming paths.' }
      ]
    }
  }
];

const accentPresets = [
  { label: 'Azure Pulse', value: 'linear-gradient(135deg, rgba(86, 196, 255, 0.6), rgba(86, 132, 255, 0.4))' },
  { label: 'Dramatic Ember', value: 'linear-gradient(135deg, rgba(255, 138, 92, 0.6), rgba(255, 90, 90, 0.4))' },
  { label: 'Glimmering Veil', value: 'linear-gradient(135deg, rgba(255, 180, 220, 0.6), rgba(120, 130, 255, 0.4))' },
  { label: 'Sylvan Bloom', value: 'linear-gradient(135deg, rgba(160, 255, 180, 0.6), rgba(92, 200, 255, 0.4))' },
  { label: 'Void Prism', value: 'linear-gradient(135deg, rgba(110, 160, 255, 0.6), rgba(160, 92, 255, 0.4))' }
];

const selectedTemplateId = ref<CustomWidgetTemplate>(templates[0].id);
const title = ref('');
const icon = ref('');
const accent = ref('');
const description = ref('');
const feedback = ref('');

const noteBody = ref('');
const checklistItems = ref<string[]>([]);
const trackerTracks = ref<CustomTrackerTrack[]>([]);
const statSummary = ref('');
const statEntries = ref<CustomStatBlockEntry[]>([]);

const emit = defineEmits<{ (e: 'create-widget', payload: CreateWidgetPayload): void }>();

const selectedTemplate = computed(() => templates.find((template) => template.id === selectedTemplateId.value)!);

function applyTemplateDefaults(template: WidgetTemplateDefinition) {
  title.value = template.name;
  icon.value = template.icon;
  accent.value = template.accent;
  description.value = template.description;

  if (template.defaults.type === 'note') {
    noteBody.value = (template.defaults as CustomNoteConfig).body;
  }

  if (template.defaults.type === 'checklist') {
    const checklist = template.defaults as CustomChecklistConfig;
    checklistItems.value = checklist.items.map((item) => item.text);
  }

  if (template.defaults.type === 'tracker') {
    const tracker = template.defaults as CustomTrackerConfig;
    trackerTracks.value = tracker.tracks.map((track) => ({ ...track }));
  }

  if (template.defaults.type === 'stat-block') {
    const statBlock = template.defaults as CustomStatBlockConfig;
    statSummary.value = statBlock.summary ?? '';
    statEntries.value = statBlock.entries.map((entry) => ({ ...entry }));
  }
}

watch(
  () => selectedTemplate.value,
  (template) => {
    applyTemplateDefaults(template);
  },
  { immediate: true }
);

function selectTemplate(id: CustomWidgetTemplate) {
  if (selectedTemplateId.value === id) {
    return;
  }
  selectedTemplateId.value = id;
}

function addChecklistItem() {
  checklistItems.value = [...checklistItems.value, ''];
}

function updateChecklistItem(index: number, value: string) {
  const next = [...checklistItems.value];
  next[index] = value;
  checklistItems.value = next;
}

function removeChecklistItem(index: number) {
  checklistItems.value = checklistItems.value.filter((_, idx) => idx !== index);
}

function addTracker() {
  trackerTracks.value = [
    ...trackerTracks.value,
    { label: 'New Track', current: 0, max: 4 }
  ];
}

function updateTrack(index: number, key: keyof CustomTrackerTrack, value: string) {
  const next = [...trackerTracks.value];
  const target = next[index];
  if (!target) {
    return;
  }
  if (key === 'label') {
    target.label = value;
  } else {
    const numeric = Number.parseInt(value, 10);
    target[key] = Number.isFinite(numeric) ? Math.max(numeric, 0) : 0;
  }
  trackerTracks.value = next;
}

function removeTrack(index: number) {
  trackerTracks.value = trackerTracks.value.filter((_, idx) => idx !== index);
}

function addStatEntry() {
  statEntries.value = [...statEntries.value, { label: 'Detail', value: '' }];
}

function updateStatEntry(index: number, key: keyof CustomStatBlockEntry, value: string) {
  const next = [...statEntries.value];
  const target = next[index];
  if (!target) {
    return;
  }
  target[key] = value;
  statEntries.value = next;
}

function removeStatEntry(index: number) {
  statEntries.value = statEntries.value.filter((_, idx) => idx !== index);
}

function buildConfig(template: WidgetTemplateDefinition): CustomWidgetConfig {
  if (template.id === 'note') {
    const fallback = (template.defaults as CustomNoteConfig).body;
    return {
      type: 'note',
      body: noteBody.value.trim() || fallback
    };
  }

  if (template.id === 'checklist') {
    const fallback = (template.defaults as CustomChecklistConfig).items;
    const items: CustomChecklistItem[] = checklistItems.value
      .map((item) => item.trim())
      .filter(Boolean)
      .map((text) => ({ text, complete: false }));

    return {
      type: 'checklist',
      items: items.length ? items : fallback
    };
  }

  if (template.id === 'tracker') {
    const fallback = (template.defaults as CustomTrackerConfig).tracks;
    const tracks = trackerTracks.value
      .map((track) => ({
        label: track.label.trim() || 'Track',
        current: Number.isFinite(track.current) ? Math.max(Math.round(track.current), 0) : 0,
        max: Number.isFinite(track.max) ? Math.max(Math.round(track.max), 1) : 1
      }))
      .filter((track) => track.max > 0);

    return {
      type: 'tracker',
      tracks: tracks.length ? tracks : fallback
    };
  }

  const fallback = template.defaults as CustomStatBlockConfig;
  const entries = statEntries.value
    .map((entry) => ({ label: entry.label.trim(), value: entry.value.trim() }))
    .filter((entry) => entry.label && entry.value);

  return {
    type: 'stat-block',
    summary: statSummary.value.trim() || fallback.summary,
    entries: entries.length ? entries : fallback.entries
  };
}

function onCreateWidget() {
  const template = selectedTemplate.value;
  const payload: CreateWidgetPayload = {
    title: title.value.trim() || template.name,
    icon: icon.value.trim() || template.icon,
    accent: accent.value || template.accent,
    description: description.value.trim() || template.description,
    component: 'CustomWidget',
    size: template.size,
    config: buildConfig(template)
  };

  emit('create-widget', payload);
  feedback.value = `${payload.title} added to the board.`;
  setTimeout(() => {
    if (feedback.value === `${payload.title} added to the board.`) {
      feedback.value = '';
    }
  }, 3200);
}
</script>

<template>
  <div class="library">
    <p class="intro">Build bespoke helper widgets from ready-to-use frameworks.</p>
    <div class="templates" role="tablist" aria-label="Widget templates">
      <button
        v-for="template in templates"
        :key="template.id"
        type="button"
        class="template"
        :class="{ active: template.id === selectedTemplateId }"
        role="tab"
        :aria-selected="template.id === selectedTemplateId"
        @click="selectTemplate(template.id)"
      >
        <span class="template__icon" aria-hidden="true">{{ template.icon }}</span>
        <div>
          <h3>{{ template.name }}</h3>
          <p>{{ template.summary }}</p>
        </div>
      </button>
    </div>

    <form class="builder" @submit.prevent="onCreateWidget">
      <fieldset>
        <legend>Widget identity</legend>
        <div class="grid">
          <label>
            <span>Title</span>
            <input v-model="title" type="text" placeholder="Widget title" />
          </label>
          <label>
            <span>Icon</span>
            <input v-model="icon" type="text" maxlength="2" placeholder="Emoji or letter" />
          </label>
        </div>
        <label class="description">
          <span>Description</span>
          <textarea v-model="description" rows="2" placeholder="Short helper text"></textarea>
        </label>
      </fieldset>

      <fieldset>
        <legend>Accent</legend>
        <div class="accent-grid">
          <button
            v-for="preset in accentPresets"
            :key="preset.value"
            type="button"
            :class="['accent-chip', { active: accent === preset.value }]"
            :style="{ backgroundImage: preset.value }"
            @click="accent = preset.value"
          >
            {{ preset.label }}
          </button>
        </div>
        <label class="custom-accent">
          <span>Custom gradient or color</span>
          <input v-model="accent" type="text" placeholder="CSS gradient or color value" />
        </label>
      </fieldset>

      <section class="template-fields">
        <header>
          <h4>Template details</h4>
          <p>{{ selectedTemplate.description }}</p>
        </header>

        <div v-if="selectedTemplateId === 'note'" class="field-block">
          <label>
            <span>Note body</span>
            <textarea v-model="noteBody" rows="5" placeholder="Write the notes you need at the table."></textarea>
          </label>
        </div>

        <div v-else-if="selectedTemplateId === 'checklist'" class="field-block">
          <div class="list-fields">
            <div
              v-for="(item, index) in checklistItems"
              :key="`check-${index}`"
              class="list-row"
            >
              <input
                :value="item"
                type="text"
                placeholder="Checklist item"
                @input="updateChecklistItem(index, ($event.target as HTMLInputElement).value)"
              />
              <button type="button" class="remove" @click="removeChecklistItem(index)" aria-label="Remove item">×</button>
            </div>
          </div>
          <button type="button" class="secondary" @click="addChecklistItem">Add item</button>
        </div>

        <div v-else-if="selectedTemplateId === 'tracker'" class="field-block">
          <div class="track-fields">
            <div v-for="(track, index) in trackerTracks" :key="`track-${index}`" class="track-row">
              <input
                :value="track.label"
                type="text"
                placeholder="Track name"
                @input="updateTrack(index, 'label', ($event.target as HTMLInputElement).value)"
              />
              <input
                :value="track.current"
                type="number"
                min="0"
                @input="updateTrack(index, 'current', ($event.target as HTMLInputElement).value)"
              />
              <span class="divider">/</span>
              <input
                :value="track.max"
                type="number"
                min="1"
                @input="updateTrack(index, 'max', ($event.target as HTMLInputElement).value)"
              />
              <button type="button" class="remove" @click="removeTrack(index)" aria-label="Remove track">×</button>
            </div>
          </div>
          <button type="button" class="secondary" @click="addTracker">Add track</button>
        </div>

        <div v-else class="field-block">
          <label>
            <span>Summary</span>
            <textarea v-model="statSummary" rows="3" placeholder="A quick read on this NPC or location."></textarea>
          </label>
          <div class="list-fields">
            <div v-for="(entry, index) in statEntries" :key="`entry-${index}`" class="list-row">
              <input
                :value="entry.label"
                type="text"
                placeholder="Label"
                @input="updateStatEntry(index, 'label', ($event.target as HTMLInputElement).value)"
              />
              <input
                :value="entry.value"
                type="text"
                placeholder="Detail"
                @input="updateStatEntry(index, 'value', ($event.target as HTMLInputElement).value)"
              />
              <button type="button" class="remove" @click="removeStatEntry(index)" aria-label="Remove entry">×</button>
            </div>
          </div>
          <button type="button" class="secondary" @click="addStatEntry">Add entry</button>
        </div>
      </section>

      <footer class="builder__footer">
        <button type="submit" class="primary">Add widget to board</button>
        <span v-if="feedback" class="feedback" role="status">{{ feedback }}</span>
        <span class="size-hint">Default size: {{ selectedTemplate.size.width }} × {{ selectedTemplate.size.height }} px</span>
      </footer>
    </form>
  </div>
</template>

<style scoped>
.library {
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: rgba(230, 240, 255, 0.92);
  height: 100%;
  overflow: auto;
  padding-right: 6px;
}

.intro {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(200, 218, 255, 0.75);
}

.templates {
  display: grid;
  gap: 12px;
}

.template {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  border-radius: 18px;
  border: 1px solid rgba(118, 174, 255, 0.3);
  background: rgba(10, 18, 30, 0.65);
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.template:focus-visible {
  outline: 2px solid rgba(134, 198, 255, 0.8);
  outline-offset: 2px;
}

.template.active {
  border-color: rgba(134, 198, 255, 0.75);
  transform: translateY(-1px);
  background: rgba(18, 26, 44, 0.8);
}

.template__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(8, 16, 28, 0.65);
  font-size: 1.6rem;
}

.template h3 {
  margin: 0 0 4px;
  font-size: 1rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.template p {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(190, 208, 240, 0.7);
}

.builder {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 18px 20px 24px;
  border-radius: 18px;
  background: rgba(10, 18, 34, 0.65);
  border: 1px solid rgba(118, 174, 255, 0.22);
}

fieldset {
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

legend {
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(186, 205, 240, 0.7);
}

label span {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
  color: rgba(190, 208, 240, 0.6);
}

input,
textarea {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(118, 174, 255, 0.25);
  background: rgba(8, 16, 28, 0.65);
  color: inherit;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-family: inherit;
}

input:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 2px solid rgba(134, 198, 255, 0.8);
  outline-offset: 2px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.description textarea {
  min-height: 60px;
}

.accent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.accent-chip {
  border-radius: 14px;
  border: 1px solid rgba(118, 174, 255, 0.25);
  color: rgba(10, 16, 28, 0.85);
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  background-size: 140% 140%;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.accent-chip.active {
  border-color: rgba(134, 198, 255, 0.85);
  transform: translateY(-1px);
}

.custom-accent input {
  font-size: 0.85rem;
  font-family: 'Fira Code', 'SFMono-Regular', Consolas, monospace;
}

.template-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.template-fields header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.template-fields h4 {
  margin: 0;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.template-fields p {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(190, 208, 240, 0.7);
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-fields,
.track-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-row,
.track-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}

.track-row {
  grid-template-columns: 1.2fr 0.6fr auto 0.6fr auto;
}

.track-row .divider {
  justify-self: center;
  color: rgba(190, 208, 240, 0.5);
}

.remove {
  border-radius: 12px;
  border: 1px solid rgba(180, 120, 255, 0.4);
  background: rgba(40, 20, 80, 0.35);
  color: rgba(232, 218, 255, 0.85);
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.secondary {
  align-self: flex-start;
  border-radius: 999px;
  border: 1px solid rgba(118, 174, 255, 0.35);
  background: rgba(10, 18, 30, 0.65);
  color: rgba(224, 236, 255, 0.9);
  padding: 8px 16px;
  cursor: pointer;
}

.builder__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.primary {
  border-radius: 999px;
  border: none;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(118, 174, 255, 0.9), rgba(94, 219, 255, 0.65));
  color: #041220;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(90, 160, 255, 0.25);
}

.feedback {
  font-size: 0.85rem;
  color: rgba(186, 210, 255, 0.9);
}

.size-hint {
  margin-left: auto;
  font-size: 0.8rem;
  color: rgba(178, 198, 235, 0.6);
}

@media (max-width: 800px) {
  .library {
    padding-right: 0;
  }

  .builder {
    padding: 16px;
  }
}
</style>
