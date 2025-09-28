<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle: string;
  pinnedCount: number;
  totalWidgets: number;
  fullBleed: boolean;
  fullscreen: boolean;
  phoneLayout: boolean;
}>();

const emit = defineEmits<{
  (e: 'reset'): void;
  (e: 'cascade'): void;
  (e: 'toggle-full-bleed'): void;
  (e: 'toggle-fullscreen'): void;
}>();
</script>

<template>
  <header class="toolbar">
    <div class="identity">
      <span class="glyph" aria-hidden="true">✦</span>
      <div>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>
    </div>
    <div class="metrics" role="status" aria-live="polite">
      <div class="metric">
        <span class="label">Widgets</span>
        <span class="value">{{ totalWidgets }}</span>
      </div>
      <div class="metric">
        <span class="label">Pinned</span>
        <span class="value">{{ pinnedCount }}</span>
      </div>
      <div v-if="props.phoneLayout" class="layout-pill">Phone layout</div>
    </div>
    <div class="actions">
      <button
        type="button"
        class="ghost"
        :aria-pressed="props.fullBleed"
        @click="emit('toggle-full-bleed')"
      >
        {{ props.fullBleed ? 'Standard Window' : 'Full Window' }}
      </button>
      <button
        type="button"
        class="ghost"
        :aria-pressed="props.fullscreen"
        @click="emit('toggle-fullscreen')"
      >
        {{ props.fullscreen ? 'Exit Fullscreen' : 'Go Fullscreen' }}
      </button>
      <button type="button" class="ghost" @click="emit('cascade')">Cascade Layout</button>
      <button type="button" class="primary" @click="emit('reset')">Reset Board</button>
    </div>
  </header>
</template>

<style scoped>
.toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 32px;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, rgba(21, 36, 58, 0.82), rgba(10, 16, 28, 0.92));
  border: 1px solid rgba(118, 174, 255, 0.2);
  border-radius: 28px;
  box-shadow: 0 24px 60px rgba(8, 18, 36, 0.65);
  backdrop-filter: blur(18px);
}

.identity {
  display: flex;
  align-items: center;
  gap: 20px;
}

.identity h1 {
  font-size: clamp(1.45rem, 1.2rem + 0.6vw, 1.75rem);
  margin: 0 0 4px;
  letter-spacing: 0.04em;
}

.identity p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.glyph {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255, 167, 94, 0.65), rgba(255, 89, 141, 0.45));
  font-size: 1.6rem;
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.15);
}

.metrics {
  display: flex;
  gap: 24px;
  padding: 12px 20px;
  border-radius: 18px;
  background: rgba(13, 22, 36, 0.7);
  border: 1px solid rgba(104, 150, 255, 0.2);
}

.metric {
  display: grid;
  gap: 4px;
  text-align: center;
}

.metric .label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(200, 219, 255, 0.65);
}

.metric .value {
  font-size: 1.4rem;
  font-variant-numeric: tabular-nums;
}

.layout-pill {
  align-self: center;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(118, 174, 255, 0.35);
  background: rgba(12, 21, 33, 0.6);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border-radius: 999px;
  padding: 12px 22px;
  border: 1px solid transparent;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

button:focus-visible {
  outline: 2px solid rgba(134, 198, 255, 0.8);
  outline-offset: 2px;
}

button.ghost {
  background: rgba(12, 21, 33, 0.75);
  border-color: rgba(118, 174, 255, 0.35);
  color: #e6f1ff;
}

.ghost[aria-pressed='true'] {
  background: rgba(118, 174, 255, 0.25);
  border-color: rgba(118, 174, 255, 0.65);
}

button.primary {
  background: linear-gradient(135deg, rgba(118, 174, 255, 0.9), rgba(94, 219, 255, 0.65));
  color: #041220;
  box-shadow: 0 12px 30px rgba(66, 149, 255, 0.35);
}

button:hover {
  transform: translateY(-2px);
}

@media (max-width: 1100px) {
  .toolbar {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .metrics,
  .actions {
    justify-self: start;
  }
}

@media (max-width: 640px) {
  .actions {
    width: 100%;
  }

  .actions button {
    flex: 1 1 48%;
  }
}
</style>
