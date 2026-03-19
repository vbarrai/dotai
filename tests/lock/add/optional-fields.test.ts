import { it, expect } from 'vitest'
import { addToLock } from '../../../src/lock.ts'
import { setupLockTest } from '../lock-test-utils.ts'

const { thenLockFile, getCwd } = setupLockTest()

it('stores optional fields like ref and skillPath', async () => {
  await addToLock(
    'advanced-skill',
    {
      source: 'owner/repo',
      sourceUrl: 'https://github.com/owner/repo',
      skillPath: 'skills/advanced-skill/SKILL.md',
      skillFolderHash: 'def456',
      ref: 'v2.0.0',
    },
    getCwd(),
  )

  const lock = JSON.parse(await thenLockFile())
  const entry = lock.skills['advanced-skill']

  expect({
    ref: entry.ref,
    skillPath: entry.skillPath,
  }).toMatchInlineSnapshot(`
    {
      "ref": "v2.0.0",
      "skillPath": "skills/advanced-skill/SKILL.md",
    }
  `)
})
