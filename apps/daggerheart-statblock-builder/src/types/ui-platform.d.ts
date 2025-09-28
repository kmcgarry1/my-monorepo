declare module '@my-monorepo/ui-platform' {
  import type { DefineComponent } from 'vue'

  type PlatformIcon =
    | 'sword'
    | 'arrows'
    | 'dice'
    | 'plus'
    | 'trash'
    | 'book'
    | 'info'
    | 'download'
    | 'copy'
    | 'print'
    | 'x'
    | 'palette'
    | 'sparkles'

  interface NavigationRailItem {
    icon: PlatformIcon
    label: string
    value: string
  }

  export const MaterialAndroidNavigationRail: DefineComponent<
    {
      items: NavigationRailItem[]
      modelValue?: string
      railPosition?: 'left' | 'right'
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {
      'update:modelValue': (value: string) => void
      select: (value: string) => void
    }
  >

  export const MaterialWebTopBar: DefineComponent<
    {
      title?: string
      subtitle?: string | null
      elevated?: boolean
      align?: 'start' | 'center'
      divider?: boolean
    }
  >

  export const AppleGlassControlStrip: DefineComponent<
    {
      title?: string
      subtitle?: string | null
      backLabel?: string | null
      floating?: boolean
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {
      back: () => void
    }
  >
}
