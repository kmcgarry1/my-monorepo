# @my-monorepo/ui-platform

Platform-specific UI shells that wrap the shared `@my-monorepo/ui` primitives. These
components keep bespoke navigation and gesture-driven layouts isolated from the
core component library while still inheriting design tokens, theming, and motion
utilities.

## Usage

```ts
import { provideDesignStyle } from '@my-monorepo/ui'
import {
  MaterialWebTopBar,
  MaterialAndroidNavigationRail,
  AppleGlassControlStrip,
} from '@my-monorepo/ui-platform'

provideDesignStyle({ preset: 'material3-web', responsive: true })
```

Each exported shell focuses on a single device family:

- `MaterialWebTopBar` — responsive Material 3 top app bar tuned for widescreen web layouts.
- `MaterialAndroidNavigationRail` — compact navigation rail that matches Material 3 guidance for Android.
- `AppleGlassControlStrip` — floating glassmorphic toolbar inspired by visionOS and Apple Glass.
