# Heliana's Recipe Search

CSV-first app to browse, search, and edit Heliana's crafting recipes.

## Scripts

- `pnpm dev` – start dev server on port 5175
- `pnpm build` – type-check and build
- `pnpm preview` – preview production build
- `pnpm csv:to-json [in.csv] [out.json]` – convert CSV to JSON
- `pnpm csv:from-json [in.json] [out.csv]` – convert JSON to CSV

## Run

From repo root:

1. Install deps once: `pnpm install`
2. Dev all apps: `pnpm dev` (Turbo) or just this app:
   - `cd apps/helianas-recipe-search`
   - `pnpm dev`

## Data format

CSV (one row per component): `data/heliana-recipes.sample.csv`

Columns:
- id, page, name
- meta_type, value_gp, rarity, attunement (true/false/blank), attunement_note
- comp_type, metatag, component
- notes, tags (semicolon separated)

JSON (normalized): `data/heliana-recipes.json`
- version: number
- recipes: array of { id, page?, name, metadata, components[], notes?, tags? }

## App features

- Import CSV in the UI, export as CSV/JSON
- Search by name, rarity, component, tags (client-side fuzzy)
- Add/edit recipes with a simple form; data persists to localStorage

No PDF parsing is required; this app ignores PDF files.
