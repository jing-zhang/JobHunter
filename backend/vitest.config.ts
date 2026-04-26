import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Keep cache outside `backend/` so the suite can run in constrained environments.
  cacheDir: '../node_modules/.vite-backend',
  test: {
    environment: 'node',
    include: ['src/test/**/*.test.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
})

