# @my-monorepo/theme

Global theme helpers and CSS surface for the monorepo. Import the CSS once per app to get
the shared Material/Apple design system baseline, then use the helper utilities to switch
between presets or persist a user preference.

```ts
import { applyTheme, themeOptions } from '@my-monorepo/theme'
import '@my-monorepo/theme/styles.css'
```

`applyTheme('material-midnight', { persist: true })` will update the `<html>` tag, set CSS
custom properties, and remember the choice across sessions.
