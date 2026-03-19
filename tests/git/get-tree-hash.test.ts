import { it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm, mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { execSync } from 'child_process'
import { getTreeHash } from '../../src/git.ts'

let repoDir: string

beforeEach(async () => {
  repoDir = await mkdtemp(join(tmpdir(), 'maconfai-git-'))
  await mkdir(join(repoDir, 'skills', 'my-skill'), { recursive: true })
  await writeFile(join(repoDir, 'skills', 'my-skill', 'SKILL.md'), '# Skill')
  execSync('git init && git add -A && git commit -m "init"', {
    cwd: repoDir,
    stdio: 'pipe',
  })
})

afterEach(async () => {
  await rm(repoDir, { recursive: true, force: true })
})

it('should return a valid sha for an existing folder', async () => {
  const hash = await getTreeHash(repoDir, 'skills/my-skill')
  expect(hash).toMatch(/^[a-f0-9]{40}$/)
})

it('should return the same hash when folder content is unchanged', async () => {
  const hash1 = await getTreeHash(repoDir, 'skills/my-skill')
  const hash2 = await getTreeHash(repoDir, 'skills/my-skill')
  expect(hash1).toBe(hash2)
})

it('should return a different hash when folder content changes', async () => {
  const hash1 = await getTreeHash(repoDir, 'skills/my-skill')

  await writeFile(join(repoDir, 'skills', 'my-skill', 'extra.md'), 'new file')
  execSync('git add -A && git commit -m "update"', { cwd: repoDir, stdio: 'pipe' })

  const hash2 = await getTreeHash(repoDir, 'skills/my-skill')
  expect(hash2).not.toBe(hash1)
})

it('should normalize backslashes in path', async () => {
  const hash = await getTreeHash(repoDir, 'skills\\my-skill')
  expect(hash).toMatch(/^[a-f0-9]{40}$/)
})

it('should strip trailing slash', async () => {
  const hash = await getTreeHash(repoDir, 'skills/my-skill/')
  expect(hash).toMatch(/^[a-f0-9]{40}$/)
})

it('should throw for a non-existent folder', async () => {
  await expect(getTreeHash(repoDir, 'skills/nope')).rejects.toThrow()
})
