import { it, expect } from 'vitest'
import { describeConfai } from '../test-utils.ts'

describeConfai(
  'install / lock hash is empty for local source',
  ({ givenSkill, whenInstall, targetFile }) => {
    it('should write empty skillFolderHash for local sources', async () => {
      await givenSkill('my-skill')

      await whenInstall({ skills: ['my-skill'], agents: ['claude-code'] })

      const lock = JSON.parse(await targetFile('ai-lock.json'))

      expect(lock.skills['my-skill'].skillFolderHash).toBe('')
    })
  },
)
