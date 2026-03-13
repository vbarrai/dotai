import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { setupScenario } from '../../test-utils.ts';

describe('cursor MCP install', () => {
  const { init, cleanup, givenSkillWithMcp, when, thenFiles, getTargetDir } = setupScenario();

  beforeEach(() => init());
  afterEach(() => cleanup());

  it('installs MCP servers to .cursor/mcp.json with env-prefix syntax', async () => {
    await givenSkillWithMcp('my-skill', {
      github: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-github'],
        env: { GITHUB_TOKEN: '${GITHUB_TOKEN}' },
      },
      linear: {
        command: 'npx',
        args: ['-y', 'mcp-remote', 'https://mcp.linear.app/mcp'],
      },
    });

    await when({ skills: ['my-skill'], agents: ['cursor'] });

    expect(await thenFiles()).toMatchInlineSnapshot(`
      [
        ".agents/skills/my-skill/SKILL.md",
        ".agents/skills/my-skill/mcp.json",
        ".cursor/mcp.json",
        ".cursor/skills/my-skill",
      ]
    `);

    const content = await readFile(join(getTargetDir(), '.cursor/mcp.json'), 'utf-8');
    expect(content).toMatchInlineSnapshot(`
      "{
        "mcpServers": {
          "github": {
            "command": "npx",
            "args": [
              "-y",
              "@modelcontextprotocol/server-github"
            ],
            "env": {
              "GITHUB_TOKEN": "\${env:GITHUB_TOKEN}"
            }
          },
          "linear": {
            "command": "npx",
            "args": [
              "-y",
              "mcp-remote",
              "https://mcp.linear.app/mcp"
            ]
          }
        }
      }
      "
    `);
  });
});
