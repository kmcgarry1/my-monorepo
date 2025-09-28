# @my-monorepo/ui-platform

Platform-specific UI shells that wrap the shared `@my-monorepo/ui` primitives. These
components keep bespoke navigation and gesture-driven layouts isolated from the
core component library while still inheriting design tokens, theming, and motion
utilities.

## Usage

```ts
import { provideDesignStyle } from '@my-monorepo/ui'
import { CupertinoNavigationBar } from '@my-monorepo/ui-platform'

provideDesignStyle({ preset: 'cupertino-mobile' })
```
