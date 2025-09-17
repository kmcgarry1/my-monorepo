<script setup lang="ts">
import { useStore, type PokemonInstance } from '../../store'
import AppButton from '../ui/AppButton.vue'

const store = useStore()
const emit = defineEmits(['close'])

function moveToPc(i: number) { store.moveTeamToPc(i) }
function moveToTeam(i: number) { store.movePcToTeam(i) }
function inspect(_p: PokemonInstance) {
  // Optional: could emit inspect later; for now, keep PC simple.
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="panel max-w-[860px] w-[96vw]">
      <div class="row justify-between items-center">
        <h3 class="m-0">PC Storage</h3>
        <AppButton variant="outline" size="sm" @click="emit('close')">Close</AppButton>
      </div>
      <div class="grid md:grid-cols-2 gap-3 mt-2">
        <div>
          <h4 class="mt-0">Team ({{ store.team.length }}/6)</h4>
          <div class="grid gap-2">
            <div v-if="!store.team.length" class="text-[0.9rem] opacity-75">No Pokémon in team.</div>
            <div class="grid [grid-template-columns:56px_1fr_auto] gap-2 items-center bg-[var(--panel-weak)] p-2 rounded-lg"
                 v-for="(p,i) in store.team" :key="p.id">
              <img :src="p.sprites.front_default" class="w-[56px] [image-rendering:pixelated]" />
              <div>
                <div class="capitalize font-semibold">{{ p.name }}</div>
                <div class="text-[0.85rem] opacity-70">Lv {{ p.level }} · {{ p.types.map(t=>t.type.name).join(', ') }}</div>
              </div>
              <div class="row gap-[0.4rem]">
                <AppButton variant="outline" size="sm" title="Move to PC" @click="moveToPc(i)" :disabled="store.team.length<=1 && i===store.battle.partyIndex">To PC</AppButton>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="mt-0">PC ({{ store.pc.length }})</h4>
          <div class="grid gap-2">
            <div v-if="!store.pc.length" class="text-[0.9rem] opacity-75">No Pokémon in PC.</div>
            <div class="grid [grid-template-columns:56px_1fr_auto] gap-2 items-center bg-[var(--panel-weak)] p-2 rounded-lg"
                 v-for="(p,i) in store.pc.slice(0,60)" :key="p.id + '-' + i">
              <img :src="p.sprites.front_default" loading="lazy" decoding="async" class="w-[56px] [image-rendering:pixelated]" />
              <div>
                <div class="capitalize font-semibold">{{ p.name }}</div>
                <div class="text-[0.85rem] opacity-70">Lv {{ p.level }} · {{ p.types.map(t=>t.type.name).join(', ') }}</div>
              </div>
              <div class="row gap-[0.4rem]">
                <AppButton variant="primary" size="sm" title="Add to Team" @click="moveToTeam(i)" :disabled="store.team.length >= 6">To Team</AppButton>
              </div>
            </div>
            <div v-if="store.pc.length > 60" class="text-[0.85rem] opacity-80">Showing first 60 of {{ store.pc.length }} entries.</div>
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
