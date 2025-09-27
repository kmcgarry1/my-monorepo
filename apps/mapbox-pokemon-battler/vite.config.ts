import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@my-monorepo/ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
      '@my-monorepo/ui/': fileURLToPath(new URL('../../packages/ui/src/', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
  },
})
