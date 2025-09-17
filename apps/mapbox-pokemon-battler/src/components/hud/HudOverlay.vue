<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../../store'
import AppButton from '../ui/AppButton.vue'

const emit = defineEmits(['open-team', 'recenter'])
const store = useStore()

const caughtCount = computed(() => store.team.length)
const active = computed(() => store.team[store.battle.partyIndex])
const modeLabel = computed(() => (store.themeMode || 'auto').toUpperCase())

function setActive(i: number) {
  store.setPartyIndex(i)
}
</script>

<template>
  <div class="absolute top-3 left-3 grid gap-2 z-10">
    <div class="panel py-[0.45rem] px-[0.6rem]">
      <div class="row justify-between items-center">
        <div class="row items-center">
          <div class="font-bold">PokéBattler</div>
          <div class="w-[6px] h-[6px] bg-green-500 rounded-full"></div>
          <div class="text-[0.9rem] opacity-80">Team: {{ caughtCount }}</div>
        </div>
        <div class="row">
          <AppButton variant="outline" size="sm" @click="store.toggleThemeMode()">Theme: {{ modeLabel }}</AppButton>
          <AppButton variant="outline" size="sm" @click="$emit('recenter')">Recenter</AppButton>
          <AppButton variant="outline" size="sm" @click="$emit('open-team')">Team</AppButton>
        </div>
      </div>
    </div>

    <div class="panel py-[0.45rem] px-[0.6rem]" v-if="active">
      <div class="row gap-3 items-center">
        <img :src="active.sprites.front_default" alt="active" class="w-10 h-10 [image-rendering:pixelated]" />
        <div class="stack">
          <div class="capitalize font-semibold">{{ active.name }}</div>
          <div class="text-[0.85rem] opacity-80">Lv {{ active.level }} • {{ active.types.map(t=>t.type.name).join(', ') }}</div>
        </div>
      </div>
    </div>

    <div class="panel" v-if="store.team.length">
      <div class="flex gap-[0.4rem]">
        <button
          v-for="(p,i) in store.team"
          :key="p.id+'-'+i"
          class="relative w-[44px] h-[44px] rounded-lg bg-[var(--button-bg)] border border-[var(--panel-border)] grid place-items-center cursor-pointer"
          :class="i === store.battle.partyIndex ? 'outline outline-2 outline-blue-600' : ''"
          @click="setActive(i)"
          :title="p.name"
        >
          <img :src="p.sprites.front_default" alt="p.name" class="w-9 h-9 [image-rendering:pixelated]" />
          <span class="absolute bottom-[-0.55rem] text-[0.75rem] text-slate-900">{{ p.level }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

