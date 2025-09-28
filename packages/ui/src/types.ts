// Shared UI types for consumers

// Buttons
export type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'filled-tonal'
  | 'outlined'
  | 'text'
  | 'elevated'
  | 'surface'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'subtle'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

// Icon buttons share the same variant set; sizes are square
export type IconButtonSize = ButtonSize

// Form controls
export type ControlVariant = 'filled' | 'outlined' | 'text' | 'outline'
export type ControlSize = 'sm' | 'md' | 'lg'

// Global design style coordination
export type DesignStylePreset =
  | 'material-desktop'
  | 'material-mobile'
  | 'material-compact'
  | 'cupertino-desktop'
  | 'cupertino-mobile'

export type DesignStyleFamily = 'material' | 'apple'
export type DesignDensity = 'comfortable' | 'compact'

export interface DesignStyleContext {
  /**
   * The base preset requested by the host application. Responsive providers
   * may promote this to a mobile-friendly variant but keep the base preset for
   * reference when returning to larger viewports.
   */
  basePreset: DesignStylePreset
  /**
   * The currently resolved preset after responsive adjustments.
   */
  preset: DesignStylePreset
  /**
   * Density hint applied across primitives. Components may opt-in to more
   * compact spacing or typography when density is `compact`.
   */
  density: DesignDensity
  /**
   * The design family controls typography, casing, and shape defaults.
   */
  family: DesignStyleFamily
  /**
   * Shared feature flags exposed to all components.
   */
  featureFlags: Record<string, boolean>
}

// Labels / text tones and sizes
export type Tone = 'muted' | 'fg' | 'accent' | 'primary' | 'secondary' | 'success'
export type TextSize = 'xs' | 'sm' | 'md' | 'lg'

// Icons
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inline'
export type IconColor = 'default' | 'muted' | 'accent' | 'danger' | 'fg' | 'bg' | 'primary' | 'success'
export type IconWeight = 'outline' | 'solid'

// Dropdown
export type DropdownAlign = 'left' | 'right'
