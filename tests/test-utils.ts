import { expect } from 'vitest';
import { mkdtemp, rm, writeFile, mkdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';
import type { AgentType, McpServerConfig } from '../src/types.ts';

const execFileAsync = promisify(execFile);
const CLI_PATH = join(import.meta.dirname, '..', 'src', 'cli.ts');

export type FileTree = Record<string, string>;

export function skillFile(name: string): string {
  const description = name.replace(/-/g, ' ');
  return `---\nname: ${name}\ndescription: ${description}\n---\n${description}`;
}

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function setupScenario() {
  let tempDir: string;
  let sourceDir: string;
  let targetDir: string;

  async function init() {
    tempDir = await mkdtemp(join(tmpdir(), 'maconfai-e2e-'));
    sourceDir = join(tempDir, 'source');
    targetDir = join(tempDir, 'target');
    await mkdir(sourceDir, { recursive: true });
    await mkdir(targetDir, { recursive: true });
  }

  async function cleanup() {
    await rm(tempDir, { recursive: true, force: true });
  }

  async function given(files: FileTree) {
    for (const [path, content] of Object.entries(files)) {
      const fullPath = join(sourceDir, path);
      await mkdir(join(fullPath, '..'), { recursive: true });
      await writeFile(fullPath, content);
    }
  }

  async function givenSkill(...names: string[]) {
    const files: FileTree = {};
    for (const name of names) {
      files[`./skills/${name}/SKILL.md`] = skillFile(name);
    }
    await given(files);
  }

  async function givenSkillWithMcp(
    name: string,
    mcpServers: Record<string, McpServerConfig>
  ) {
    const files: FileTree = {
      [`./skills/${name}/SKILL.md`]: skillFile(name),
      [`./skills/${name}/mcp.json`]: JSON.stringify({ mcpServers }, null, 2),
    };
    await given(files);
  }

  async function when(opts: { skills?: string[]; agents?: AgentType[]; mcps?: string[]; extraArgs?: string[] }) {
    const args = ['--experimental-strip-types', CLI_PATH, 'install', sourceDir, '-y'];

    if (opts.skills?.length) {
      args.push(`--skills=${opts.skills.join(',')}`);
    }
    if (opts.agents?.length) {
      args.push(`--agents=${opts.agents.join(',')}`);
    }
    if (opts.mcps?.length) {
      args.push(`--mcps=${opts.mcps.join(',')}`);
    }
    if (opts.extraArgs?.length) {
      args.push(...opts.extraArgs);
    }

    return execFileAsync('node', args, { cwd: targetDir });
  }

  function getTargetDir() {
    return targetDir;
  }

  async function then(expected: FileTree) {
    for (const [path, expectedContent] of Object.entries(expected)) {
      const fullPath = join(targetDir, path);
      const content = await readFile(fullPath, 'utf-8');
      expect(content).toBe(expectedContent);
    }
  }

  async function thenExists(path: string): Promise<boolean> {
    return exists(join(targetDir, path));
  }

  async function thenMcpConfig(path: string): Promise<Record<string, any>> {
    const fullPath = join(targetDir, path);
    const content = await readFile(fullPath, 'utf-8');
    return JSON.parse(content);
  }

  return { init, cleanup, given, givenSkill, givenSkillWithMcp, when, then, thenExists, thenMcpConfig, getTargetDir };
}
