# @my-monorepo/design-tokens

Shared design foundations for the apps in this monorepo. The package is intentionally
framework-agnostic and exposes the color palettes, spacing scale, typography ramps, motion
curves, radii, shadows and theme metadata that power the rest of the design system. Tokens are plain TypeScript
objects so they can be consumed from UI libraries, build tooling or even server-side
renderers without needing a CSS pipeline.

```ts
import { fonts, spacing, typography, motion, stateLayers, radii, themeVariables, themeMeta } from '@my-monorepo/design-tokens'
```

Use these exports when you need to align bespoke components with the core theme, or when
you want to generate documentation / theming controls.

