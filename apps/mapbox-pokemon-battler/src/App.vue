<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from './store'
import LoginOverlay from './components/LoginOverlay.vue'

const store = useStore()
const ready = ref(false)

// Init from localStorage
store.initFromStorage()
ready.value = true

// Subtle global parallax driven by pointer position
let motionHandler: ((e: PointerEvent) => void) | null = null
onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (reduce.matches) return
  motionHandler = (e: PointerEvent) => {
    const vw = Math.max(1, window.innerWidth)
    const vh = Math.max(1, window.innerHeight)
    const x = (e.clientX / vw) * 2 - 1
    const y = (e.clientY / vh) * 2 - 1
    const root = document.documentElement
    root.style.setProperty('--mx', (x * 1).toFixed(4)) // -1..1
    root.style.setProperty('--my', (y * 1).toFixed(4)) // -1..1
  }
  window.addEventListener('pointermove', motionHandler, { passive: true })
})
onBeforeUnmount(() => {
  if (motionHandler) {
    window.removeEventListener('pointermove', motionHandler)
    motionHandler = null
  }
})
</script>

<template>
  <div class="fullscreen">
    <router-view v-if="ready" v-slot="{ Component }">
      <Transition name="view">
        <component :is="Component" />
      </Transition>
    </router-view>
    <LoginOverlay v-if="!store.account.username" />
  </div>
</template>

<style scoped>
</style>
