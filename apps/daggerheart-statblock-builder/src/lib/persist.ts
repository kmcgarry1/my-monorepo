import type { Enemy, Environment } from '../types'

const KEY = 'dhsb:last'

export type SavePayload = {
  version: 1
  sbType: 'enemy' | 'environment'
  enemy: Enemy
  environment: Environment
}

export function save(payload: SavePayload) {
  try { localStorage.setItem(KEY, JSON.stringify(payload)) } catch {}
}

export function load(): SavePayload | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data && data.version === 1) return data as SavePayload
  } catch {}
  return null
}

export function clear() {
  try { localStorage.removeItem(KEY) } catch {}
}

export function hasSaved(): boolean {
  try { return !!localStorage.getItem(KEY) } catch { return false }
}

