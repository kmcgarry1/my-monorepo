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

// Labels / text tones and sizes
export type Tone = 'muted' | 'fg' | 'accent' | 'primary' | 'secondary' | 'success'
export type TextSize = 'xs' | 'sm' | 'md' | 'lg'

// Icons
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inline'
export type IconColor = 'default' | 'muted' | 'accent' | 'danger' | 'fg' | 'bg' | 'primary' | 'success'
export type IconWeight = 'outline' | 'solid'

// Dropdown
export type DropdownAlign = 'left' | 'right'
