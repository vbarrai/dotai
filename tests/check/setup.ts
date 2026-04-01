import { vi } from 'vitest'
import { mocks, mockSpawnSync } from './check-test-utils.ts'

vi.mock('picocolors')
vi.mock('@clack/prompts', () => mocks)
vi.mock('child_process', () => ({
  spawnSync: (...args: any[]) => mockSpawnSync(...args),
}))
