import { computed, inject, provide, reactive, watchEffect } from 'vue'
import type {
  DesignDensity,
  DesignStyleContext,
  DesignStyleFamily,
  DesignStylePreset,
} from '../types'
import { useBreakpoints } from './useBreakpoints'

const DESIGN_STYLE_SYMBOL = Symbol('DesignStyle')

const presetFamilyMap: Record<DesignStylePreset, DesignStyleFamily> = {
  'material3-web': 'material',
  'material3-android': 'material',
  'apple-glass': 'apple',
}

const defaultFeatureFlags: Record<DesignStylePreset, Record<string, boolean>> = {
  'material3-web': {
    'buttons.uppercase': true,
    'buttons.fullWidthMobile': false,
    'buttons.autoBlock': false,
  },
  'material3-android': {
    'buttons.uppercase': true,
    'buttons.fullWidthMobile': true,
    'buttons.autoBlock': true,
  },
  'apple-glass': {
    'buttons.uppercase': false,
    'buttons.fullWidthMobile': true,
    'buttons.autoBlock': true,
  },
}

const densityDefaults: Record<DesignStylePreset, DesignDensity> = {
  'material3-web': 'comfortable',
  'material3-android': 'compact',
  'apple-glass': 'comfortable',
}

function createContext(preset: DesignStylePreset, density?: DesignDensity): DesignStyleContext {
  const resolvedDensity = density ?? densityDefaults[preset] ?? 'comfortable'
  return reactive<DesignStyleContext>({
    basePreset: preset,
    preset,
    density: resolvedDensity,
    family: presetFamilyMap[preset],
    featureFlags: { ...defaultFeatureFlags[preset] },
  })
}

const fallbackContext = createContext('material3-web')

export interface ProvideDesignStyleOptions {
  preset?: DesignStylePreset
  density?: DesignDensity
  featureFlags?: Record<string, boolean>
  /**
   * When true, the provider will automatically swap between desktop and mobile
   * presets based on the current viewport breakpoints.
   */
  responsive?: boolean
}

export interface PlatformPresetLike {
  designStyle: DesignStylePreset
  density: DesignDensity
  featureFlags?: Record<string, boolean>
}

export function provideDesignStyle(options: ProvideDesignStyleOptions = {}) {
  const preset = options.preset ?? 'material3-web'
  const ctx = createContext(preset, options.density)

  if (options.featureFlags) {
    Object.assign(ctx.featureFlags, options.featureFlags)
  }

  let breakpoints: ReturnType<typeof useBreakpoints> | null = null
  if (options.responsive) {
    breakpoints = useBreakpoints()
    const mobileFallback: Record<DesignStyleFamily, DesignStylePreset> = {
      material: 'material3-android',
      apple: 'apple-glass',
    }

    watchEffect(() => {
      if (!breakpoints) return
      if (breakpoints.mobile.value) {
        const mobilePreset = mobileFallback[ctx.family] ?? ctx.preset
        ctx.preset = mobilePreset
        ctx.density = densityDefaults[mobilePreset]
        ctx.family = presetFamilyMap[mobilePreset]
      } else {
        ctx.preset = ctx.basePreset
        ctx.density = densityDefaults[ctx.basePreset]
        ctx.family = presetFamilyMap[ctx.basePreset]
      }
    })

    watchEffect(() => {
      if (!breakpoints) return
      const autoFullWidth = ctx.featureFlags['buttons.fullWidthMobile']
      if (!autoFullWidth) return
      ctx.featureFlags['buttons.autoBlock'] = breakpoints.mobile.value
    })
  }

  provide(DESIGN_STYLE_SYMBOL, ctx)

  return ctx
}

export function providePlatformDesignStyle(
  preset: PlatformPresetLike,
  options: Omit<ProvideDesignStyleOptions, 'preset' | 'density' | 'featureFlags'> = {},
) {
  return provideDesignStyle({
    ...options,
    preset: preset.designStyle,
    density: preset.density,
    featureFlags: preset.featureFlags,
  })
}

export function useDesignStyle() {
  const ctx = inject<DesignStyleContext | null>(DESIGN_STYLE_SYMBOL, null)
  if (!ctx) {
    return fallbackContext
  }
  return ctx
}

export function useDesignFamily() {
  const ctx = useDesignStyle()
  return computed(() => ctx.family)
}

export function useDesignFeatureFlags(extra?: Record<string, boolean>) {
  const ctx = useDesignStyle()
  return computed(() => ({
    ...ctx.featureFlags,
    ...(extra ?? {}),
  }))
}

export function setFeatureFlag(name: string, value: boolean) {
  const ctx = useDesignStyle()
  ctx.featureFlags[name] = value
}

export function toggleFeatureFlag(name: string) {
  const ctx = useDesignStyle()
  ctx.featureFlags[name] = !ctx.featureFlags[name]
}
