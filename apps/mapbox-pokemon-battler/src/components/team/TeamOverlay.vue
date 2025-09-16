<script setup lang="ts">
import { useStore } from '../../store'
const store = useStore()
const emit = defineEmits(['close'])

function setActive(i: number) {
  store.setPartyIndex(i)
  emit('close')
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="panel" style="max-width: 520px; width: 100%;">
      <h3 style="margin:0 0 0.5rem 0;">Your Team</h3>
      <div class="list">
        <div class="item" v-for="(p,i) in store.caught" :key="p.id">
          <img :src="p.sprites.front_default" style="width:56px; image-rendering: pixelated;" />
          <div class="meta">
            <div class="name">{{ p.name }}</div>
            <div class="sub">Lv {{ p.level }} • {{ p.types.map(t=>t.type.name).join(', ') }}</div>
          </div>
          <button class="btn" @click="setActive(i)" :disabled="store.battle.partyIndex===i">Set Active</button>
        </div>
      </div>
      <div class="row" style="justify-content: end; margin-top: 0.5rem;">
        <button class="btn" @click="emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list { display: grid; gap: 0.5rem; }
.item { display: grid; grid-template-columns: 56px 1fr auto; gap: 0.5rem; align-items: center; background: var(--panel-weak); padding: 0.5rem; border-radius: 8px; }
.name { text-transform: capitalize; font-weight: 600; }
.sub { font-size: 0.85rem; opacity: 0.7; }
</style>
