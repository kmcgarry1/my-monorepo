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
    <div class="panel" style="min-width: 320px;">
      <h2>Test Account</h2>
      <p>Enter a username to get started.</p>
      <div class="row">
        <input v-model="username" placeholder="Ash" style="flex:1; padding:0.5rem; border:1px solid #cbd5e1; border-radius:8px;" />
        <button class="btn primary" @click="login">Continue</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 { margin: 0 0 0.5rem 0; }
p { margin: 0 0 0.75rem 0; }
</style>

