import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Unit tests for pure logic only (ADR-003); Nuxt auto-imports are not available here.
export default defineConfig({
  resolve: {
    alias: { '~': fileURLToPath(new URL('./', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
