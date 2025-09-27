<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { AppBadge, AppButton, AppInput, fadeSlideUp } from '@my-monorepo/ui'
import {
  describeType,
  randomName,
  searchNames,
  type NameFilter,
  NAME_RECORDS,
  NAME_TYPE_LABELS
} from '../lib/nameDatabase'

const props = defineProps<{ open: boolean; sbType: 'enemy' | 'environment' }>()

const emit = defineEmits<{ (e: 'close'): void; (e: 'apply-name', value: string): void }>()

const query = ref('')
const filter = ref<NameFilter>('all')
const lastRoll = ref<string>('')
const searchInput = ref<{ focus: () => void } | null>(null)

const filterOptions = computed(() => {
  const base = [{ value: 'all' as NameFilter, label: 'All' }]
  const typed = (Object.entries(NAME_TYPE_LABELS) as Array<[NameFilter, string]>).map(([value, label]) => ({
    value,
    label
  }))
  return base.concat(typed)
})

const results = computed(() => searchNames(query.value, filter.value, 120))

const resultSummary = computed(() => {
  const total = NAME_RECORDS.length
  if (!query.value.trim() && (filter.value === 'all')) {
    return `${results.value.length} of ${total} entries`
  }
  return `${results.value.length} matches`
})

function close() {
  emit('close')
}

function applyName(name: string) {
  emit('apply-name', name)
}

function roll() {
  const pick = randomName(filter.value === 'all' ? props.sbType : filter.value)
  lastRoll.value = pick?.name ?? ''
  if (pick?.name) {
    emit('apply-name', pick.name)
  }
}

function setFilter(next: NameFilter) {
  filter.value = next
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      query.value = ''
      lastRoll.value = ''
      filter.value = props.sbType
      window.addEventListener('keydown', onKeydown)
      nextTick(() => {
        searchInput.value?.focus?.()
      })
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  }
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    window.removeEventListener('keydown', onKeydown)
    close()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <teleport to="body">
    <Transition
      :enter-active-class="fadeSlideUp.enterActiveClass"
      :enter-from-class="fadeSlideUp.enterFromClass"
      :enter-to-class="fadeSlideUp.enterToClass"
      :leave-active-class="fadeSlideUp.leaveActiveClass"
      :leave-from-class="fadeSlideUp.leaveFromClass"
      :leave-to-class="fadeSlideUp.leaveToClass"
    >
      <div v-if="open" class="fixed inset-0 z-[110]">
        <div class="absolute inset-0 bg-black/40" @click="close" />
        <aside class="absolute right-0 top-0 h-full w-full max-w-2xl bg-[var(--surface)] text-[var(--fg)] shadow-2xl">
          <header class="flex items-center justify-between border-b border-[var(--border)] p-4">
            <div>
              <h2 class="text-lg font-semibold">Name reference</h2>
              <p class="text-xs text-[var(--muted)]" role="status" aria-live="polite">{{ resultSummary }}</p>
            </div>
            <AppButton size="sm" variant="outline" @click="close">Close</AppButton>
          </header>
          <div class="flex h-full flex-col gap-4 p-4">
            <div class="space-y-3">
              <label class="sr-only" for="name-reference-search">Search names, tags, or sources</label>
              <AppInput
                id="name-reference-search"
                ref="searchInput"
                v-model="query"
                placeholder="Search names, tags, or sources"
              />
              <div class="flex flex-wrap gap-2">
                <AppButton
                  v-for="option in filterOptions"
                  :key="option.value"
                  size="sm"
                  :variant="option.value === filter ? 'primary' : 'surface'"
                  @click="setFilter(option.value)"
                >
                  {{ option.label }}
                </AppButton>
              </div>
            </div>
            <div class="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-translucent)] px-4 py-3">
              <div class="flex flex-col text-xs text-[var(--muted)]">
                <span class="font-semibold uppercase tracking-[0.18em] text-[0.62rem]">Need inspiration?</span>
                <span>{{ lastRoll ? `Applied “${lastRoll}”` : 'Roll a themed name based on your current statblock.' }}</span>
              </div>
              <AppButton size="sm" variant="primary" @click="roll">
                Roll name
              </AppButton>
            </div>
            <div class="name-results" role="list">
              <article v-for="record in results" :key="record.id" role="listitem" class="name-card">
                <header class="name-card__header">
                  <div>
                    <h3 class="name-card__title">{{ record.name }}</h3>
                    <div class="name-card__meta">
                      <AppBadge size="xs" variant="neutral">{{ describeType(record.type) }}</AppBadge>
                      <AppBadge v-if="record.category" size="xs" variant="surface">{{ record.category }}</AppBadge>
                    </div>
                  </div>
                  <AppButton size="sm" variant="ghost" @click="applyName(record.name)">
                    Use name
                  </AppButton>
                </header>
                <p class="name-card__description">{{ record.description }}</p>
                <div v-if="record.tags.length" class="name-card__tags">
                  <span v-for="tag in record.tags" :key="tag" class="tag-chip">{{ tag }}</span>
                </div>
                <footer class="name-card__footer">
                  <span class="name-card__source">{{ record.source }}</span>
                </footer>
              </article>
              <p v-if="!results.length" class="empty-state">No names match your search yet. Try a broader query.</p>
            </div>
          </div>
        </aside>
      </div>
    </Transition>
  </teleport>
</template>

<style scoped>
.name-results {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 0.5rem;
}

.name-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  border: 1px solid color-mix(in srgb, var(--border-muted) 70%, transparent);
  background: var(--glass-surface-strong);
  box-shadow: var(--glass-shadow-sm), var(--glass-highlight);
}

.name-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.name-card__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
}

.name-card__meta {
  margin-top: 0.4rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.name-card__description {
  margin: 0;
  color: color-mix(in srgb, var(--muted) 92%, transparent);
}

.name-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface-translucent) 94%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-muted) 70%, transparent);
  color: color-mix(in srgb, var(--muted) 90%, transparent);
}

.name-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: color-mix(in srgb, var(--muted) 88%, transparent);
}

.name-card__source {
  font-weight: 600;
}

.empty-state {
  margin: 0;
  text-align: center;
  color: color-mix(in srgb, var(--muted) 92%, transparent);
  padding: 2rem 0;
}
</style>
