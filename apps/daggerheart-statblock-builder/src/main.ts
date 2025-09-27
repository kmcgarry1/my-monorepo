import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initTheme } from './lib/theme'

initTheme()

createApp(App).mount('#app')

