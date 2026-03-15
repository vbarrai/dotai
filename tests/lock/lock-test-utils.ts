import { beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

export function setupLockTest() {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'lock-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  async function givenLockFile(content: string) {
    await writeFile(join(tempDir, 'ai-lock.json'), content)
  }

  async function thenLockFile(): Promise<string> {
    return readFile(join(tempDir, 'ai-lock.json'), 'utf-8')
  }

  function getCwd(): string {
    return tempDir
  }

  return { givenLockFile, thenLockFile, getCwd }
}
