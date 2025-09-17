<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store'

const store = useStore()
const username = ref('')

function login() {
  if (!username.value.trim()) return
  store.login(username.value.trim())
}
</script>

<template>
  <div class="overlay">
    <div class="panel min-w-[320px]">
      <h2 class="mb-2">Test Account</h2>
      <p class="mb-3">Enter a username to get started.</p>
      <div class="row">
        <input v-model="username" placeholder="Ash" class="flex-1 p-2 border border-slate-300 rounded-lg" />
        <button class="btn primary" @click="login">Continue</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
