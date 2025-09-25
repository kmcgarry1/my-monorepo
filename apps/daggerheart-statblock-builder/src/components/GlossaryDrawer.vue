<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { AppInput, AppButton } from '@my-monorepo/ui'
import { fadeSlideUp } from '@my-monorepo/ui'
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
    <Transition
      :enter-active-class="fadeSlideUp.enterActiveClass"
      :enter-from-class="fadeSlideUp.enterFromClass"
      :enter-to-class="fadeSlideUp.enterToClass"
      :leave-active-class="fadeSlideUp.leaveActiveClass"
      :leave-from-class="fadeSlideUp.leaveFromClass"
      :leave-to-class="fadeSlideUp.leaveToClass"
    >
      <div v-if="glossaryOpen" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/40" @click="closeGlossary" />
        <aside class="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--surface)] text-[var(--fg)] shadow-2xl">
          <header class="flex items-center justify-between border-b border-[var(--border)] p-4">
            <h2 class="text-lg font-semibold">Glossary</h2>
            <AppButton size="sm" variant="outline" @click="closeGlossary">Close</AppButton>
          </header>
          <div class="space-y-3 p-4">
            <div>
              <AppInput v-model="q" placeholder="Search terms..." />
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
    </Transition>
  </teleport>
  
</template>

