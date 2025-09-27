<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { MapboxKey, MapUiStateKey } from '../di/keys'

const map = inject(MapboxKey, null)
const uiState = inject(MapUiStateKey, null)

const canvasEl = ref<HTMLCanvasElement | null>(null)
const ctxRef = ref<CanvasRenderingContext2D | null>(null)
const anim = ref<number | null>(null)
const resizeObserver = ref<ResizeObserver | null>(null)

// Simple screen-space particle demo
type Particle = { x: number; y: number; vx: number; vy: number; life: number }
let particles: Particle[] = []

function initParticles(width: number, height: number, count = 400) {
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    life: Math.random() * 200 + 100,
  }))
}

function setCanvasSize() {
  const canvas = canvasEl.value
  if (!canvas) return
  const parent = canvas.parentElement as HTMLElement
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = parent.clientWidth
  const h = parent.clientHeight
  canvas.width = Math.max(1, Math.floor(w * dpr))
  canvas.height = Math.max(1, Math.floor(h * dpr))
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctxRef.value = ctx
  }
  initParticles(w, h)
}

function step() {
  const ctx = ctxRef.value
  const canvas = canvasEl.value
  if (!ctx || !canvas) return

  const w = canvas.clientWidth
  const h = canvas.clientHeight

  // Vary wind direction with time [0..100]
  const t = ((uiState?.time ?? 0) / 100) * Math.PI * 2
  const windX = Math.cos(t) * 0.6
  const windY = Math.sin(t) * 0.3

  ctx.clearRect(0, 0, w, h)
  ctx.globalAlpha = 0.85
  ctx.strokeStyle = '#0ea5e9'
  ctx.lineWidth = 1

  for (const p of particles) {
    p.vx += windX * 0.02
    p.vy += windY * 0.02
    p.x += p.vx
    p.y += p.vy
    p.life -= 1

    // wrap around
    if (p.x < 0) p.x = w
    if (p.x > w) p.x = 0
    if (p.y < 0) p.y = h
    if (p.y > h) p.y = 0

    if (p.life < 0) {
      p.x = Math.random() * w
      p.y = Math.random() * h
      p.vx = (Math.random() - 0.5) * 0.5
      p.vy = (Math.random() - 0.5) * 0.5
      p.life = Math.random() * 200 + 100
    }

    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3)
    ctx.stroke()
  }

  anim.value = requestAnimationFrame(step)
}

onMounted(() => {
  setCanvasSize()
  anim.value = requestAnimationFrame(step)
  const ro = new ResizeObserver(setCanvasSize)
  resizeObserver.value = ro
  if (canvasEl.value?.parentElement) ro.observe(canvasEl.value.parentElement)

  // Reinit on style zoom changes to keep density reasonable
  map?.value?.on('move', setCanvasSize)
})

onBeforeUnmount(() => {
  if (anim.value) cancelAnimationFrame(anim.value)
  resizeObserver.value?.disconnect()
  map?.value?.off('move', setCanvasSize)
})
</script>

<template>
  <canvas ref="canvasEl" class="particles" aria-hidden="true"></canvas>
  
</template>

<style scoped>
.particles {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}
</style>
