import { createRouter, createWebHashHistory } from 'vue-router'
import MapView from './views/MapView.vue'
import BattleView from './views/BattleView.vue'

const routes = [
  { path: '/', name: 'map', component: MapView },
  { path: '/battle', name: 'battle', component: BattleView },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})

