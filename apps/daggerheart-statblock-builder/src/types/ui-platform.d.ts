import type { DefineComponent } from 'vue'

declare module '@my-monorepo/ui-platform' {
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

  export const AndroidNavigationRail: DefineComponent<
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

  export const CupertinoNavigationBar: DefineComponent<
    {
      title?: string
      backLabel?: string | null
      translucent?: boolean
      backBehavior?: 'none' | 'default'
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
