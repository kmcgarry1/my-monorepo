import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@my-monorepo/ui-platform': fileURLToPath(new URL('../../packages/ui-platform/src/index.ts', import.meta.url)),
      '@my-monorepo/ui-platform/': fileURLToPath(new URL('../../packages/ui-platform/src/', import.meta.url)),
      '@my-monorepo/ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
      '@my-monorepo/ui/': fileURLToPath(new URL('../../packages/ui/src/', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0'
  }
})

