<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapContainer = ref<HTMLDivElement | null>(null);
let map: mapboxgl.Map | null = null;

onMounted(() => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string;
  if (!token) {
    console.error('Missing VITE_MAPBOX_TOKEN');
    return;
  }

  mapboxgl.accessToken = token;

  map = new mapboxgl.Map({
    container: mapContainer.value!,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-6.2603, 53.3498], // Dublin
    zoom: 10,
    attributionControl: true
  });

  // Basic nav control
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  // Example: add a marker
  map.on('load', () => {
    new mapboxgl.Marker().setLngLat([-6.2603, 53.3498]).addTo(map!);
  });
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.map-container {
  position: absolute;
  inset: 0;
}
</style>
