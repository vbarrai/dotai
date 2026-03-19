import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'
import { execSync } from 'child_process'

describeConfai(
  'install / lock hash is computed from git source',
  ({ givenSkill, whenInstall, targetFile, getSourceDir }) => {
    it('should write a real skillFolderHash when source is a git repo', async () => {
      await givenSkill('my-skill')

      const sourceDir = getSourceDir()
      execSync('git init && git add -A && git commit -m "init"', {
        cwd: sourceDir,
        stdio: 'pipe',
      })

      await whenInstall({ skills: ['my-skill'], agents: ['claude-code'] })

      const lock = JSON.parse(await targetFile('ai-lock.json'))

      expect(lock.skills['my-skill'].skillFolderHash).toMatch(/^[a-f0-9]{40}$/)
    })
  },
)
