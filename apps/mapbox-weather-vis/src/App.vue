<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'

const mapContainer = ref<HTMLDivElement | null>(null)
const mapInstance = ref<mapboxgl.Map | null>(null)
const errorMessage = ref<string | null>(null)

onMounted(() => {
  if (!mapContainer.value) {
    errorMessage.value = 'Map container failed to mount.'
    return
  }

  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined
  if (!accessToken) {
    errorMessage.value =
      'Add a VITE_MAPBOX_ACCESS_TOKEN value to your environment to display the map.'
    return
  }

  mapboxgl.accessToken = accessToken

  try {
    const map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.006, 40.7128],
      zoom: 11,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(new mapboxgl.FullscreenControl())

    mapInstance.value = map
  } catch (error) {
    console.error('Failed to initialise Mapbox GL JS map', error)
    errorMessage.value = 'The map failed to load. Check the console for details.'
  }
})

onBeforeUnmount(() => {
  mapInstance.value?.remove()
  mapInstance.value = null
})
</script>

<template>
  <div class="map-page">
    <div ref="mapContainer" class="map" aria-hidden="true"></div>
    <div v-if="errorMessage" class="map-error" role="alert">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
.map-page {
  position: relative;
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
}

.map-error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.8);
}
</style>
