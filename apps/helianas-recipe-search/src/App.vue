<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import DataManager from './components/DataManager.vue'
import RecipeEditor from './components/RecipeEditor.vue'
import RecipeList from './components/RecipeList.vue'
import type { RecipeData } from './types/recipe'

type TabId = 'browse' | 'edit' | 'data'

const data = ref<RecipeData>({ version: 1, recipes: [] })
const tab = ref<TabId>('browse')

const navTabs: Array<{ id: TabId; label: string; description: string }> = [
  { id: 'browse', label: 'Browse & search', description: 'Search every recipe and component instantly.' },
  { id: 'edit', label: 'Add & refine', description: 'Craft new entries or iterate on existing ones.' },
  { id: 'data', label: 'Import & export', description: 'Bring data in from CSV or back everything up.' }
]

function loadInitial() {
  const ls = localStorage.getItem('hrs:data')
  if (ls) {
    try {
      data.value = JSON.parse(ls)
    } catch {}
  }
  import('../data/heliana-recipes.json')
    .then((mod) => {
      if (!ls) data.value = mod.default as any
    })
    .catch(() => {})
}

onMounted(loadInitial)

watch(
  data,
  (v) => localStorage.setItem('hrs:data', JSON.stringify(v)),
  { deep: true }
)
</script>

<template>
  <div class="app-shell">
    <div class="app-aura" aria-hidden="true" />
    <main class="app-container">
      <header class="app-header">
        <p class="header-eyebrow">Heliana's Guide companion</p>
        <h1>Recipe atelier</h1>
        <p class="header-supporting">
          Import CSVs, search components, and author new magical concoctions with a workspace inspired by Material 3 expression design.
        </p>
      </header>

      <nav class="tab-rail" role="tablist">
        <button
          v-for="item in navTabs"
          :key="item.id"
          type="button"
          class="tab-chip"
          role="tab"
          :aria-selected="tab === item.id"
          @click="tab = item.id"
        >
          <span class="chip-label">{{ item.label }}</span>
          <span class="chip-description">{{ item.description }}</span>
        </button>
      </nav>

      <section v-if="tab === 'browse'" class="view-surface" role="tabpanel">
        <RecipeList v-model="data" />
      </section>
      <section v-else-if="tab === 'edit'" class="view-surface" role="tabpanel">
        <RecipeEditor v-model="data" />
      </section>
      <section v-else class="view-surface" role="tabpanel">
        <DataManager v-model="data" />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem);
  background: radial-gradient(circle at 12% -10%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%),
    radial-gradient(circle at 82% 120%, color-mix(in srgb, var(--md-sys-color-secondary) 12%, transparent), transparent 70%),
    color-mix(in srgb, var(--surface) 96%, transparent);
  display: flex;
  justify-content: center;
}

.app-aura {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(125deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
    radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent-weak) 40%, transparent), transparent 70%);
  mix-blend-mode: screen;
  opacity: 0.45;
}

.app-container {
  position: relative;
  z-index: 1;
  width: min(1100px, 100%);
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  border-radius: clamp(1.5rem, 3vw, 2.4rem);
  padding: clamp(1.75rem, 5vw, 3rem);
  box-shadow: var(--glass-shadow-lg), var(--glass-highlight);
  border: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
  backdrop-filter: blur(26px);
}

.app-header {
  display: grid;
  gap: 0.75rem;
  max-width: 48rem;
}

.header-eyebrow {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--accent) 65%, var(--md-sys-color-on-surface-variant));
}

.app-header h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--md-sys-color-on-surface);
}

.header-supporting {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.65rem;
  color: var(--md-sys-color-on-surface-variant);
}

.tab-rail {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  background: color-mix(in srgb, var(--surface-translucent) 94%, transparent);
  border-radius: clamp(1.25rem, 2.8vw, 1.9rem);
  padding: clamp(0.75rem, 2.5vw, 1.25rem);
  border: 1px solid color-mix(in srgb, var(--border-soft) 72%, transparent);
  box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
}

.tab-chip {
  display: grid;
  gap: 0.35rem;
  justify-items: flex-start;
  border: none;
  padding: clamp(0.85rem, 2vw, 1rem);
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--glass-surface-soft) 90%, transparent);
  color: var(--md-sys-color-on-surface);
  text-align: left;
  font: inherit;
  cursor: pointer;
  transition: background var(--motion-duration-sm) var(--motion-easing-emphasized),
    transform var(--motion-duration-sm) var(--motion-easing-emphasized),
    box-shadow var(--motion-duration-sm) var(--motion-easing-emphasized);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--border-muted) 65%, transparent);
  position: relative;
}

.tab-chip::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  opacity: 0;
  transition: opacity var(--motion-duration-sm) var(--motion-easing-emphasized);
  pointer-events: none;
}

.tab-chip[aria-selected='true'] {
  background: color-mix(in srgb, var(--accent-weak) 70%, var(--glass-surface-soft));
  box-shadow: var(--shadow-level2), var(--glass-highlight);
  transform: translateY(-1px);
}

.tab-chip[aria-selected='true']::after {
  opacity: var(--md-comp-state-layer-opacity-focus);
}

.tab-chip:hover::after {
  opacity: var(--md-comp-state-layer-opacity-hover);
}

.tab-chip:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent) 72%, transparent);
  outline-offset: 3px;
}

.chip-label {
  font-weight: 600;
  font-size: 1rem;
}

.chip-description {
  font-size: 0.9rem;
  color: var(--md-sys-color-on-surface-variant);
}

.view-surface {
  background: var(--glass-surface-strong);
  border-radius: clamp(1.35rem, 3vw, 1.9rem);
  padding: clamp(1.35rem, 3vw, 2rem);
  border: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
  box-shadow: var(--glass-shadow-md), var(--glass-highlight);
  backdrop-filter: blur(18px);
}

@media (max-width: 720px) {
  .app-shell {
    padding: clamp(2.5rem, 8vw, 4rem) clamp(1rem, 5vw, 2rem);
  }

  .app-container {
    padding: clamp(1.25rem, 5vw, 2rem);
    border-radius: 1.5rem;
  }

  .tab-rail {
    grid-template-columns: 1fr;
  }

  .view-surface {
    border-radius: 1.2rem;
  }
}
</style>
