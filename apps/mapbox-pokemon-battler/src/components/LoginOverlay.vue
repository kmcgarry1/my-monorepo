<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store'
import AppButton from './ui/AppButton.vue'

const store = useStore()
const username = ref('')

function login() {
  if (!username.value.trim()) return
  store.login(username.value.trim())
}
</script>

<template>
  <div class="overlay">
    <div class="panel login-card">
      <div class="stack">
        <header class="stack gap-1">
          <p class="eyebrow">Prototype login</p>
          <h2 class="title">Sign in to explore</h2>
          <p class="body">Enter a display name to sync your caught Pokémon and battle history on this device.</p>
        </header>
        <form class="stack" @submit.prevent="login">
          <label class="field">
            <span class="field-label">Trainer name</span>
            <input v-model="username" placeholder="Ash Ketchum" autocomplete="off" />
          </label>
          <AppButton type="submit" variant="primary" block>Continue</AppButton>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  max-width: min(480px, 90vw);
  padding: clamp(1.25rem, 3vw, 2rem);
}

.eyebrow {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 60%, transparent);
}

.title {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
}

.body {
  margin: 0;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 78%, transparent);
  font-size: 0.95rem;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 64%, transparent);
}

input::placeholder {
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 44%, transparent);
}
</style>
