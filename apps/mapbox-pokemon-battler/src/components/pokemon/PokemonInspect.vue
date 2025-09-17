<script setup lang="ts">
import StatsBars from './StatsBars.vue'
import type { PokemonInstance } from '../../store'
import AppButton from '../ui/AppButton.vue'

const props = defineProps<{ pokemon: PokemonInstance }>()
const emit = defineEmits(['close', 'set-active'])

function spriteUrl() {
  return (props.pokemon.sprites as any)?.other?.['official-artwork']?.front_default || props.pokemon.sprites.front_default
}

function typeList() {
  return props.pokemon.types.map((t) => t.type.name).join(', ')
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="panel max-w-[880px] w-[96vw]">
      <div class="row justify-between items-center">
        <h3 class="m-0 capitalize">{{ pokemon.name }}</h3>
        <AppButton variant="outline" size="sm" @click="emit('close')">Close</AppButton>
      </div>
      <div class="grid md:grid-cols-[1fr_1.5fr] grid-cols-1 gap-4">
        <div>
          <img :src="spriteUrl()" :alt="pokemon.name" loading="lazy" decoding="async" class="w-[clamp(180px,28vw,260px)] [image-rendering:pixelated] drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]" />
          <div class="inline-block mt-2 py-[0.2rem] px-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel-weak)] font-semibold">Lv {{ pokemon.level }}</div>
          <div class="mt-1 opacity-80">Types: {{ typeList() }}</div>
        </div>
        <div>
          <StatsBars :stats="pokemon.stats" />
          <div class="mt-2">
            <div class="font-bold mb-1">Moves</div>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="mv in pokemon.moves" :key="mv.name" class="grid gap-[0.15rem] text-left btn" :class="'type-' + (mv.type || 'normal')">
                <div class="font-semibold">{{ mv.name }}</div>
                <div class="text-[0.8rem] opacity-80">{{ mv.type }} · {{ mv.power ?? '—' }}</div>
              </div>
            </div>
          </div>
          <div class="row justify-end gap-2">
            <AppButton variant="primary" @click="emit('set-active')">Set Active</AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

