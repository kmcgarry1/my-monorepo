<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from './store'
import LoginOverlay from './components/LoginOverlay.vue'

const store = useStore()
const ready = ref(false)

// Init from localStorage
store.initFromStorage()
ready.value = true
</script>

<template>
  <div class="fullscreen">
    <router-view v-if="ready" />
    <LoginOverlay v-if="!store.account.username" />
  </div>
</template>

<style scoped>
</style>

