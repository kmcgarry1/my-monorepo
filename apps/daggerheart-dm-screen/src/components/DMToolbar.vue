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
  gap: 28px;
  align-items: center;
  padding: 20px 28px;
  background: linear-gradient(135deg, rgba(25, 36, 54, 0.72), rgba(14, 22, 35, 0.9));
  border: 1px solid rgba(138, 180, 235, 0.24);
  border-radius: 26px;
  box-shadow: 0 22px 56px rgba(6, 14, 28, 0.45);
  backdrop-filter: blur(16px) saturate(1.05);
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
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 196, 121, 0.7), rgba(255, 115, 162, 0.48));
  font-size: 1.55rem;
  box-shadow: inset 0 0 16px rgba(255, 255, 255, 0.18);
}

.metrics {
  display: flex;
  gap: 20px;
  padding: 10px 18px;
  border-radius: 16px;
  background: rgba(20, 30, 46, 0.62);
  border: 1px solid rgba(138, 180, 235, 0.2);
  box-shadow: inset 0 0 0 1px rgba(138, 180, 235, 0.08);
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
  border: 1px solid rgba(138, 180, 235, 0.35);
  background: rgba(18, 30, 46, 0.65);
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
  padding: 11px 20px;
  border: 1px solid transparent;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

button:focus-visible {
  outline: 2px solid rgba(134, 198, 255, 0.8);
  outline-offset: 2px;
}

button.ghost {
  background: rgba(22, 32, 48, 0.7);
  border-color: rgba(138, 180, 235, 0.35);
  color: #e8f1ff;
}

.ghost[aria-pressed='true'] {
  background: rgba(138, 180, 235, 0.22);
  border-color: rgba(138, 180, 235, 0.6);
}

button.primary {
  background: linear-gradient(135deg, rgba(132, 192, 255, 0.92), rgba(108, 212, 255, 0.68));
  color: #041220;
  box-shadow: 0 12px 30px rgba(80, 170, 255, 0.32);
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
