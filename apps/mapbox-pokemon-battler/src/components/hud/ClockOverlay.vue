<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import AppButton from '../ui/AppButton.vue'

type Preset = 'auto' | 'dawn' | 'day' | 'dusk' | 'night'

const props = defineProps<{ selected: Preset }>()
const emit = defineEmits<{
  (e: 'set-auto'): void
  (e: 'set-preset', v: Exclude<Preset, 'auto'>): void
}>()

const now = ref(new Date())
let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => (now.value = new Date()), 1000)
})
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})

const timeStr = computed(() => {
  const h = now.value.getHours().toString().padStart(2, '0')
  const m = now.value.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
})

const ampm = computed(() => (now.value.getHours() < 12 ? 'AM' : 'PM'))

function btnClass(key: Preset) {
  return {
    btn: true,
    selected: props.selected === key,
  }
}
</script>

<template>
  <div class="absolute top-3 left-1/2 -translate-x-1/2 z-[11]">
    <div class="panel grid gap-[0.35rem] items-center">
      <div class="font-bold text-xl tracking-[0.5px]">{{ timeStr }}<span class="font-semibold text-[0.8rem] ml-[0.35rem] opacity-80">{{ ampm }}</span></div>
      <div class="flex gap-1 justify-center flex-wrap">
        <AppButton size="sm" :variant="props.selected==='auto' ? 'primary' : 'outline'" @click="$emit('set-auto')">Auto</AppButton>
        <AppButton size="sm" :variant="props.selected==='dawn' ? 'primary' : 'outline'" @click="$emit('set-preset','dawn')">Dawn</AppButton>
        <AppButton size="sm" :variant="props.selected==='day' ? 'primary' : 'outline'" @click="$emit('set-preset','day')">Day</AppButton>
        <AppButton size="sm" :variant="props.selected==='dusk' ? 'primary' : 'outline'" @click="$emit('set-preset','dusk')">Dusk</AppButton>
        <AppButton size="sm" :variant="props.selected==='night' ? 'primary' : 'outline'" @click="$emit('set-preset','night')">Night</AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
