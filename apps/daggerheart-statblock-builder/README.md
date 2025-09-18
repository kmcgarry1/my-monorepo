# Daggerheart Statblock Builder

Basic scaffold for a Vue 3 + Vite + TypeScript applet in this monorepo.

## Scripts

- `pnpm --filter daggerheart-statblock-builder dev` — run dev server
- `pnpm --filter daggerheart-statblock-builder build` — type-check + build
- `pnpm --filter daggerheart-statblock-builder preview` — preview prod build

This app is intentionally minimal: toggle between Enemy and Environment statblocks, with shared fields (name, archetype, level, traits) and basic type-specific fields. Expand with additional Daggerheart fields, validation, and export/print as needed.
