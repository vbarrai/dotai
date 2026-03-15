import { cpus } from 'os'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    minWorkers: 2,
    maxWorkers: Math.max(2, cpus().length),
    fileParallelism: true,
    testTimeout: 30_000,
  },
})
