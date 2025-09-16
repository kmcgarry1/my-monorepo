Mapbox Pokémon Battler (prototype)

- Fullscreen Mapbox map using user geolocation (required)
- Spawns Pokémon markers around the player with simple environment-based weighting
- Click a marker to open details (sprite, types, stats), then Catch or Battle
- Caught Pokémon persisted in localStorage; simple username login overlay
- Basic turn-based battle view with simplified damage calculation

Setup

1. Create `.env` with `VITE_MAPBOX_ACCESS_TOKEN=...` in this app directory
2. Install deps: `npm install`
3. Run dev: `npm run dev`

