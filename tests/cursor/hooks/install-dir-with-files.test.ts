import { it, expect } from 'vitest'
import { describeConfai } from '../../test-utils.ts'

describeConfai(
  'cursor / install hook dir with companion files',
  ({ givenSource, whenInstall, targetFile, targetFiles }) => {
    it('should copy companion files to .agents/hooks/<name>/', async () => {
      await givenSource({
        hookDirs: {
          'security-guard': {
            cursor: {
              PreToolUse: [
                {
                  matcher: 'Bash|Edit|Write',
                  hooks: [
                    {
                      type: 'command',
                      command: '.agents/hooks/security-guard/security-guard.sh',
                    },
                  ],
                },
              ],
            },
          },
        },
        hookDirFiles: {
          'security-guard': {
            'security-guard.sh': '#!/bin/bash\necho "checking..."',
          },
        },
      })

      await whenInstall({ hooks: ['security-guard'], agents: ['cursor'] })

      expect(await targetFiles()).toMatchInlineSnapshot(`
        [
          ".agents/hooks/security-guard/security-guard.sh",
          ".cursor/hooks.json",
          "ai-lock.json",
        ]
      `)

      expect(await targetFile('.agents/hooks/security-guard/security-guard.sh'))
        .toMatchInlineSnapshot(`
        "#!/bin/bash
        echo "checking...""
      `)
    })
  },
)
