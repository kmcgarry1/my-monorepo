import type { InjectionKey, ShallowRef } from 'vue'
import type { Map as MapboxMap } from 'mapbox-gl'

export type MapEffect = 'off' | 'wind' | 'rain' | 'snow'

export interface MapUiState {
  styleId: string
  showLabels: boolean
  time: number
  playing: boolean
  effect: MapEffect
  radarOn: boolean
  radarOpacity: number
}

export const MapboxKey: InjectionKey<ShallowRef<MapboxMap | null>> = Symbol('MapboxMap')
export const MapUiStateKey: InjectionKey<MapUiState> = Symbol('MapUiState')

