# @my-monorepo/theme

Global theme helpers and CSS surface for the monorepo. Import the CSS once per app to get
the neon cyberpunk baseline, then use the helper utilities to switch between presets or to
persist a user preference.

```ts
import { applyTheme, themeOptions } from '@my-monorepo/theme'
import '@my-monorepo/theme/styles.css'
```

`applyTheme('neon-noir', { persist: true })` will update the `<html>` tag, set CSS custom
properties and remember the choice across sessions.
