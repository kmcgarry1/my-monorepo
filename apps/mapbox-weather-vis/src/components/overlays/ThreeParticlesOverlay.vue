<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, watch } from 'vue'
import * as THREE from 'three'
import mapboxgl from 'mapbox-gl'
import { MapboxKey, MapUiStateKey, type MapEffect } from '../di/keys'

type Effect = Exclude<MapEffect, 'off'>

const mapRef = inject(MapboxKey, null)
const uiState = inject(MapUiStateKey, null)

const LAYER_ID = 'three-particles-layer'

let renderer: any = null
let camera: any = null
let scene: any = null
let root: any = null
let geometry: any = null
let points: any = null
let rainGeom: any = null
let rainLines: any = null
let rainLinePositions: Float32Array | null = null
let velocities: Float32Array | null = null
let mapInstance: mapboxgl.Map | null = null
let prevMerc: mapboxgl.MercatorCoordinate | null = null
let spreadX = 300
let spreadY = 300
let zMax = 150

// Splash pool for rain ground impacts
type Splash = { sprite: any; age: number; maxAge: number; active: boolean }
let splashPool: Splash[] = []
let splashIndex = 0
let splashTexture: any = null

function createSplashTexture(): any {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const half = size / 2
  const grd = ctx.createRadialGradient(half, half, 0, half, half, half)
  grd.addColorStop(0.0, 'rgba(255,255,255,0.8)')
  grd.addColorStop(0.6, 'rgba(255,255,255,0.25)')
  grd.addColorStop(1.0, 'rgba(255,255,255,0.0)')
  ctx.fillStyle = grd
  ctx.fillRect(0,0,size,size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function initSplashes(count = 64) {
  if (!root) return
  if (!splashTexture) splashTexture = createSplashTexture()
  for (let i = 0; i < count; i++) {
    const mat = new THREE.SpriteMaterial({ map: splashTexture!, color: 0x9ec5fe, transparent: true, opacity: 0.0, depthWrite: false })
    const sprite = new THREE.Sprite(mat)
    sprite.visible = false
    sprite.position.set(0, 0, 0.1)
    sprite.scale.set(6, 6, 1)
    root.add(sprite)
    splashPool.push({ sprite, age: 0, maxAge: 0, active: false })
  }
}

function spawnSplash(x: number, y: number) {
  if (!splashPool.length) return
  const s = splashPool[splashIndex]
  splashIndex = (splashIndex + 1) % splashPool.length
  s.active = true
  s.age = 0
  s.maxAge = 22 + Math.floor(Math.random() * 12)
  s.sprite.visible = true
  s.sprite.position.set(x, y, 0.1)
  s.sprite.scale.set(6, 6, 1)
  ;(s.sprite.material as any).opacity = 0.8
}

function updateSplashes() {
  for (const s of splashPool) {
    if (!s.active) continue
    s.age++
    const t = s.age / s.maxAge
    const scale = 6 + t * 18
    s.sprite.scale.set(scale, scale, 1)
    const mat = s.sprite.material as any
    mat.opacity = 0.8 * (1 - t)
    if (s.age >= s.maxAge) {
      s.active = false
      s.sprite.visible = false
      mat.opacity = 0
    }
  }
}

function metersPerPixel(lat: number, zoom: number) {
  const earthCircumference = 40075016.686
  return (Math.cos((lat * Math.PI) / 180) * earthCircumference) / Math.pow(2, zoom + 8)
}

function updateSpreads(map: mapboxgl.Map) {
  const { width, height } = map.getCanvas()
  const mpp = metersPerPixel(map.getCenter().lat, map.getZoom())
  // Oversize slightly to cover edges
  spreadX = Math.max(100, Math.floor(width * mpp * 0.6))
  spreadY = Math.max(100, Math.floor(height * mpp * 0.6))
  zMax = Math.max(spreadX, spreadY) * 0.5
}

function getWind(map: mapboxgl.Map) {
  const bearingDeg = map.getBearing()
  const bearingRad = (bearingDeg * Math.PI) / 180
  // Map local meters: x = East, y = North
  const dirX = Math.sin(bearingRad)
  const dirY = Math.cos(bearingRad)
  const t = Math.max(0, Math.min(100, uiState?.time ?? 0))
  const strength = 0.5 + (t / 100) * 1.5 // 0.5 .. 2.0 m/step
  return { dirX, dirY, strength }
}

function buildParticles(effect: Effect) {
  if (points && scene) {
    scene.remove(points)
    points.geometry.dispose()
    ;(points.material as any).dispose()
  }
  if (rainLines && scene) {
    scene.remove(rainLines)
    rainLines.geometry.dispose()
    ;(rainLines.material as any).dispose()
    rainLines = null
    rainGeom = null
    rainLinePositions = null
  }

  if (mapInstance) updateSpreads(mapInstance)
  const count = effect === 'rain' ? 4000 : effect === 'snow' ? 2500 : 3000

  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  velocities = new Float32Array(count * 3)

  const wind = mapInstance ? getWind(mapInstance) : { dirX: 1, dirY: 0, strength: 1 }
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3 + 0] = (Math.random() * 2 - 1) * spreadX
    positions[i3 + 1] = (Math.random() * 2 - 1) * spreadY
    // Start above camera so things fall into view
    positions[i3 + 2] = Math.random() * zMax

    if (effect === 'wind') {
      const base = wind.strength
      // Align initial velocity to wind with small jitter
      velocities[i3 + 0] = wind.dirX * base + (Math.random() - 0.5) * 0.3
      velocities[i3 + 1] = wind.dirY * base + (Math.random() - 0.5) * 0.3
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.2
    } else if (effect === 'rain') {
      velocities[i3 + 0] = (Math.random() - 0.5) * 0.2
      velocities[i3 + 1] = -2.5 - Math.random() * 2.5
      velocities[i3 + 2] = 0
    } else if (effect === 'snow') {
      velocities[i3 + 0] = (Math.random() - 0.5) * 0.2
      velocities[i3 + 1] = -0.6 - Math.random() * 0.3
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: effect === 'rain' ? 0x60a5fa : effect === 'snow' ? 0xffffff : 0x38bdf8,
    size: effect === 'rain' ? 2.0 : effect === 'snow' ? 2.5 : 1.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: effect === 'snow' ? 0.95 : 0.85,
    depthWrite: false,
  })

  if (effect === 'rain') {
    // Use line segments for streaks instead of points
    const linePos = new Float32Array(count * 2 * 3)
    rainGeom = new THREE.BufferGeometry()
    rainGeom.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
    const lineMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.9, depthWrite: false })
    rainLines = new THREE.LineSegments(rainGeom, lineMat)
    rainLinePositions = linePos
    root?.add(rainLines)
  } else {
    points = new THREE.Points(geometry, material)
    root?.add(points)
  }
}

function respawnParticle(i3: number, effect: Effect, wind: { dirX: number; dirY: number; strength: number }) {
  // Spawn close to camera with slight random offset; above the camera
  const positions = (geometry!.getAttribute('position') as any).array as Float32Array
  positions[i3 + 0] = (Math.random() * 2 - 1) * (spreadX * 0.1)
  positions[i3 + 1] = (Math.random() * 2 - 1) * (spreadY * 0.1)
  positions[i3 + 2] = zMax * (0.8 + Math.random() * 0.2)

  if (effect === 'wind') {
    const base = wind.strength
    velocities![i3 + 0] = wind.dirX * base + (Math.random() - 0.5) * 0.3
    velocities![i3 + 1] = wind.dirY * base + (Math.random() - 0.5) * 0.3
    velocities![i3 + 2] = -0.05 + (Math.random() - 0.5) * 0.1
  } else if (effect === 'rain') {
    velocities![i3 + 0] = (Math.random() - 0.5) * 0.2 + wind.dirX * 0.1 * wind.strength
    velocities![i3 + 1] = -3.0 - Math.random() * 2.0 + wind.dirY * 0.05 * wind.strength
    velocities![i3 + 2] = 0
  } else if (effect === 'snow') {
    velocities![i3 + 0] = (Math.random() - 0.5) * 0.15 + wind.dirX * 0.05 * wind.strength
    velocities![i3 + 1] = -0.5 - Math.random() * 0.3 + wind.dirY * 0.03 * wind.strength
    velocities![i3 + 2] = (Math.random() - 0.5) * 0.08
  }
}

function updateParticles(effect: Effect) {
  if (!geometry || !velocities) return
  const attr = geometry.getAttribute('position') as any
  const positions = attr.array as Float32Array
  const count = positions.length / 3
  const wind = mapInstance ? getWind(mapInstance) : { dirX: 1, dirY: 0, strength: 1 }
  const g = effect === 'rain' ? 0.08 : effect === 'snow' ? 0.01 : 0.02

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    if (effect === 'snow') {
      velocities[i3 + 0] += Math.sin((positions[i3 + 1] + positions[i3 + 2]) * 0.01) * 0.002
    }
    if (effect === 'wind') {
      // Small acceleration towards wind direction
      const ax = wind.dirX * 0.02 * wind.strength
      const ay = wind.dirY * 0.02 * wind.strength
      velocities[i3 + 0] += ax
      velocities[i3 + 1] += ay
      // Limit horizontal speed
      const vx = velocities[i3 + 0]
      const vy = velocities[i3 + 1]
      const vmax = wind.strength * 1.8
      const sp = Math.hypot(vx, vy)
      if (sp > vmax) {
        const k = vmax / sp
        velocities[i3 + 0] *= k
        velocities[i3 + 1] *= k
      }
    } else if (effect === 'rain') {
      // Wind-driven drift for rain
      velocities[i3 + 0] += wind.dirX * 0.01 * wind.strength
      velocities[i3 + 1] += wind.dirY * 0.005 * wind.strength
    } else if (effect === 'snow') {
      velocities[i3 + 0] += wind.dirX * 0.006 * wind.strength
      velocities[i3 + 1] += wind.dirY * 0.004 * wind.strength
    }

    // Gravity toward map plane (z decreasing)
    velocities[i3 + 2] -= g

    positions[i3 + 0] += velocities[i3 + 0]
    positions[i3 + 1] += velocities[i3 + 1]
    positions[i3 + 2] += velocities[i3 + 2]

    // If drawing rain streaks, update line segment start/end here
    if (effect === 'rain' && rainLinePositions) {
      const L = 2.0 + wind.strength * 2.0 // streak length
      const sx = positions[i3 + 0]
      const sy = positions[i3 + 1]
      const sz = positions[i3 + 2]
      const ex = sx - velocities[i3 + 0] * L
      const ey = sy - velocities[i3 + 1] * L
      const ez = sz - Math.max(velocities[i3 + 2], -0.5) * L
      const j = i * 6
      rainLinePositions[j + 0] = sx
      rainLinePositions[j + 1] = sy
      rainLinePositions[j + 2] = sz
      rainLinePositions[j + 3] = ex
      rainLinePositions[j + 4] = ey
      rainLinePositions[j + 5] = ez
    }

    const tooFar = Math.abs(positions[i3 + 0]) > spreadX * 1.2 || Math.abs(positions[i3 + 1]) > spreadY * 1.2
    const hitGround = positions[i3 + 2] <= 0
    const tooHigh = positions[i3 + 2] > zMax * 1.5
    if (hitGround && effect === 'rain') {
      // Splash before respawn
      spawnSplash(positions[i3 + 0], positions[i3 + 1])
    }
    if (tooFar || hitGround || tooHigh) {
      respawnParticle(i3, effect, wind)
    }
  }

  attr.needsUpdate = true
  if (effect === 'rain' && rainGeom) {
    ;(rainGeom.getAttribute('position') as any).needsUpdate = true
  }
}

function updateRootTransform(map: mapboxgl.Map) {
  if (!root) return
  const center = map.getCenter()
  const merc = mapboxgl.MercatorCoordinate.fromLngLat([center.lng, center.lat], 0)
  const scale = merc.meterInMercatorCoordinateUnits()

  // If camera moved, offset particle positions by inverse delta (camera-anchored volume)
  if (geometry && prevMerc) {
    const dxMeters = (merc.x - prevMerc.x) / scale
    const dyMeters = (merc.y - prevMerc.y) / scale
    if (dxMeters !== 0 || dyMeters !== 0) {
      const attr = geometry.getAttribute('position') as any
      const positions = attr.array as Float32Array
      const len = positions.length
      for (let i = 0; i < len; i += 3) {
        positions[i + 0] -= dxMeters
        positions[i + 1] -= dyMeters
        // Z stays unchanged
        // If far outside the view bounds, respawn near camera
        if (Math.abs(positions[i + 0]) > spreadX * 1.5 || Math.abs(positions[i + 1]) > spreadY * 1.5) {
          const wind = getWind(map)
          respawnParticle(i, (uiState?.effect ?? 'wind') as Effect, wind)
        }
      }
      attr.needsUpdate = true
    }
  }

  const t = new THREE.Matrix4().makeTranslation(merc.x, merc.y, merc.z || 0)
  const r = new THREE.Matrix4().makeRotationX(Math.PI / 2)
  const s = new THREE.Matrix4().makeScale(scale, -scale, scale)
  const m = new THREE.Matrix4()
  m.multiply(t).multiply(r).multiply(s)
  root.matrix = m
  root.matrixAutoUpdate = false

  prevMerc = merc
  updateSpreads(map)
}

function addLayer(map: mapboxgl.Map) {
  const layer: any = {
    id: LAYER_ID,
    type: 'custom',
    renderingMode: '3d',
    onAdd: function (map: mapboxgl.Map, gl: WebGLRenderingContext) {
      mapInstance = map
      renderer = new THREE.WebGLRenderer({ canvas: map.getCanvas(), context: gl, antialias: true })
      renderer.autoClear = false
      camera = new THREE.Camera()
      scene = new THREE.Scene()
      root = new THREE.Object3D()
      scene.add(root)

      initSplashes()
      updateRootTransform(map)
      const effect = (uiState?.effect ?? 'wind') as Effect
      buildParticles(effect)
    },
    render: function (_gl: WebGLRenderingContext, matrix: number[]) {
      if (!renderer || !camera || !scene) return
      const effect = (uiState?.effect ?? 'wind') as Effect
      if (uiState?.playing !== false) updateParticles(effect)
      updateSplashes()
      camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix)
      renderer.state.reset()
      renderer.render(scene, camera)
      mapInstance?.triggerRepaint()
    },
  }

  map.addLayer(layer)
}

function removeLayer(map: mapboxgl.Map) {
  if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID)
}

onMounted(() => {
  const map = mapRef?.value
  if (!map) return
  const init = () => {
    addLayer(map)
    map.on('move', () => updateRootTransform(map))
    map.on('zoom', () => updateRootTransform(map))
    map.on('pitch', () => updateRootTransform(map))
    map.on('rotate', () => updateRootTransform(map))
  }
  if (map.loaded()) init()
  else map.once('load', init)
})

onBeforeUnmount(() => {
  const map = mapRef?.value
  if (!map) return
  removeLayer(map)
})

watch(
  () => uiState?.effect,
  (next) => {
    const map = mapRef?.value
    if (!map || !scene || !root || !next || next === 'off') return
    buildParticles(next as Effect)
  }
)
</script>

<template></template>

<style scoped></style>
