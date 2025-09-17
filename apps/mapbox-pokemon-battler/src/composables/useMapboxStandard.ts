import { ref, watch, onBeforeUnmount } from 'vue'
import mapboxgl from 'mapbox-gl'

export type LightPreset = 'dawn' | 'day' | 'dusk' | 'night'

export function useMapboxStandard(options: {
  container: () => HTMLDivElement | null
  initialCenter: () => [number, number]
  onLoad?: (map: any) => void
}) {
  // Loosen type to avoid deep Mapbox TS instantiation issues
  const map = ref<any>(null)
  const presetOverride = ref<LightPreset | null>(null)
  const presetInterval = ref<number | null>(null)

  function computeLightPreset(): LightPreset {
    const h = new Date().getHours()
    if (h >= 5 && h < 8) return 'dawn'
    if (h >= 8 && h < 17) return 'day'
    if (h >= 17 && h < 20) return 'dusk'
    return 'night'
  }

  function setBasemapProperty(m: any, key: string, value: any) {
    try {
      const anyMap: any = m
      if (typeof anyMap.setConfigProperty === 'function' && m.isStyleLoaded()) {
        anyMap.setConfigProperty('basemap', key, value)
      }
    } catch {}
  }

  function applyBasemapConfig(m: any, preset: LightPreset) {
    setBasemapProperty(m, 'lightPreset', preset)
  }

  function initializeBasemapConfig(m: any, preset: LightPreset) {
    setBasemapProperty(m, 'lightPreset', preset)
    setBasemapProperty(m, 'colorMotorways', '#2e89ff')
    setBasemapProperty(m, 'showPedestrianRoads', false)
    setBasemapProperty(m, 'show3dObjects', false)
  }

  function create() {
    const container = options.container()
    if (!container) return
    const m: any = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/standard',
      center: options.initialCenter(),
      zoom: 17.2,
      minZoom: 17,
      maxZoom: 19,
      pitch: 45,
      bearing: 0,
      dragRotate: false,
      pitchWithRotate: false,
      attributionControl: true,
    })
    m.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    m.addControl(new mapboxgl.FullscreenControl())

    map.value = m

    m.once('load', () => {
      initializeBasemapConfig(m, presetOverride.value ?? computeLightPreset())
      m.on('styledata', () => applyBasemapConfig(m, presetOverride.value ?? computeLightPreset()))
      if (options.onLoad) options.onLoad(m)
    })

    // Periodically update the preset in real-time
    let last = presetOverride.value ?? computeLightPreset()
    presetInterval.value = window.setInterval(() => {
      if (!map.value) return
      const next = presetOverride.value ?? computeLightPreset()
      if (next !== last) {
        applyBasemapConfig(map.value, next)
        last = next
      }
    }, 60_000)
  }

  function setBoundsAround(lngLat: [number, number], rangeMeters = 200) {
    const m = map.value
    if (!m) return
    const degPerMeterLat = 1 / 111320
    const degPerMeterLng = 1 / (111320 * Math.cos((lngLat[1] * Math.PI) / 180))
    const dLng = rangeMeters * degPerMeterLng
    const dLat = rangeMeters * degPerMeterLat
    const b = new mapboxgl.LngLatBounds(
      [lngLat[0] - dLng, lngLat[1] - dLat],
      [lngLat[0] + dLng, lngLat[1] + dLat]
    )
    m.setMaxBounds(b)
  }

  function setPresetAuto() {
    presetOverride.value = null
    if (map.value) applyBasemapConfig(map.value, computeLightPreset())
  }
  function setPresetManual(v: LightPreset) {
    presetOverride.value = v
    if (map.value) applyBasemapConfig(map.value, v)
  }

  function recenter(lngLat: mapboxgl.LngLatLike) {
    map.value?.easeTo({ center: lngLat, duration: 500, essential: true })
  }

  onBeforeUnmount(() => {
    if (presetInterval.value) {
      clearInterval(presetInterval.value)
      presetInterval.value = null
    }
    map.value?.remove()
    map.value = null
  })

  return { map, create, setBoundsAround, recenter, setPresetAuto, setPresetManual }
}
