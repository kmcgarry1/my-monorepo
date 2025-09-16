# Mapbox Weather Visualiser

A minimal Vue 3 + Vite application that renders a full-screen [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) map.

## Getting started

1. Install dependencies from the repository root:
   ```bash
   pnpm install
   ```
2. Provide a Mapbox access token. Create an `.env` file in `apps/mapbox-weather-vis` (or export the variable in your shell) with:
   ```bash
   VITE_MAPBOX_ACCESS_TOKEN=your_public_token_here
   ```
   You can create a free token from the [Mapbox dashboard](https://account.mapbox.com/access-tokens/).
3. Launch the development server:
   ```bash
   pnpm --filter mapbox-weather-vis dev
   ```
4. Open the printed URL in your browser to view the map.

The map centres on New York City and includes navigation and fullscreen controls. Feel free to adjust the configuration in `src/App.vue` to suit your needs.
