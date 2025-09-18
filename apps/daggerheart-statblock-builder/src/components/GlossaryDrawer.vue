<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { glossaryOpen, glossaryTerm, closeGlossary } from '../lib/glossaryState'
import { findEntries } from '../lib/glossary'
// @ts-ignore
import srdUrl from '../SRD/Daggerheart-SRD-9-09-25.pdf?url'

const q = ref('')
const filtered = computed(() => findEntries(q.value))

watch(glossaryOpen, (o) => {
  if (o && glossaryTerm.value) q.value = glossaryTerm.value
})
</script>

<template>
  <teleport to="body">
    <div v-if="glossaryOpen" class="fixed inset-0 z-[100]">
      <div class="absolute inset-0 bg-black/40" @click="closeGlossary" />
      <aside class="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--surface)] text-[var(--fg)] shadow-2xl">
        <header class="flex items-center justify-between border-b border-[var(--border)] p-4">
          <h2 class="text-lg font-semibold">Glossary</h2>
          <button class="rounded-md border border-[var(--btn-border)] px-2 py-1 text-sm hover:border-[var(--accent)]" @click="closeGlossary">Close</button>
        </header>
        <div class="space-y-3 p-4">
          <div>
            <input
              v-model="q"
              type="text"
              placeholder="Search terms..."
              class="w-full rounded-md border border-[var(--btn-border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div class="flex items-center gap-2 text-sm">
            <a :href="srdUrl" target="_blank" rel="noreferrer" class="text-[var(--link)] underline">Open SRD PDF</a>
          </div>
          <div class="max-h-[70vh] overflow-auto">
            <div v-for="e in filtered" :key="e.id" class="border-b border-[var(--border)] py-3">
              <div class="text-sm font-semibold">{{ e.title }}</div>
              <div class="text-sm text-[var(--muted)] whitespace-pre-line">{{ e.description }}</div>
              <div v-if="e.aliases?.length" class="mt-1 text-xs text-[var(--muted)]">Also: {{ e.aliases.join(', ') }}</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </teleport>
  
</template>

