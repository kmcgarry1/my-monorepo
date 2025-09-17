<script setup lang="ts">
import { useStore, type PokemonInstance } from '../../store'
import AppButton from '../ui/AppButton.vue'
const store = useStore()
const emit = defineEmits(['close', 'inspect'])

function setActive(i: number) {
  store.setPartyIndex(i)
  emit('close')
}

function inspect(p: PokemonInstance) {
  emit('inspect', p)
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="panel max-w-[520px] w-full">
      <h3 class="m-0 mb-2">Your Team</h3>
      <div class="grid gap-2">
        <div class="grid [grid-template-columns:56px_1fr_auto] gap-2 items-center bg-[var(--panel-weak)] p-2 rounded-lg" v-for="(p,i) in store.team" :key="p.id">
          <img :src="p.sprites.front_default" loading="lazy" decoding="async" class="w-[56px] [image-rendering:pixelated]" />
          <div>
            <div class="capitalize font-semibold">{{ p.name }}</div>
            <div class="text-[0.85rem] opacity-70">Lv {{ p.level }} • {{ p.types.map(t=>t.type.name).join(', ') }}</div>
          </div>
          <div class="row gap-[0.4rem]">
            <AppButton variant="outline" size="sm" @click="inspect(p)">Inspect</AppButton>
            <AppButton variant="primary" size="sm" @click="setActive(i)" :disabled="store.battle.partyIndex===i">Set Active</AppButton>
          </div>
        </div>
      </div>
      <div class="row justify-end mt-2">
        <AppButton variant="outline" @click="emit('close')">Close</AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
