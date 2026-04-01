import { readdir, readFile, stat } from 'fs/promises'
import { join, dirname } from 'path'
import type { Skill, McpServerConfig, HookGroup } from './types.ts'

function parseFrontmatter(content: string): { data: Record<string, string> } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { data: {} }
  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const sep = line.indexOf(':')
    if (sep === -1) continue
    const key = line.slice(0, sep).trim()
    const val = line.slice(sep + 1).trim()
    if (key) data[key] = val.replace(/^['"]|['"]$/g, '')
  }
  return { data }
}

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__'])

async function hasFile(dir: string, filename: string): Promise<boolean> {
  try {
    const s = await stat(join(dir, filename))
    return s.isFile()
  } catch {
    return false
  }
}

async function parseMcpJson(
  skillDir: string,
): Promise<Record<string, McpServerConfig> | undefined> {
  try {
    const content = await readFile(join(skillDir, 'mcp.json'), 'utf-8')
    const parsed = JSON.parse(content) as { mcpServers?: Record<string, McpServerConfig> }
    if (parsed.mcpServers && typeof parsed.mcpServers === 'object') {
      return parsed.mcpServers
    }
  } catch {
    // No mcp.json or invalid — that's fine
  }
  return undefined
}

async function parseHooksJson(dir: string): Promise<Record<string, HookGroup> | undefined> {
  try {
    const content = await readFile(join(dir, 'hooks.json'), 'utf-8')
    const parsed = JSON.parse(content) as { hooks?: Record<string, HookGroup> }
    if (parsed.hooks && typeof parsed.hooks === 'object') {
      return parsed.hooks
    }
  } catch {
    // No hooks.json or invalid — that's fine
  }
  return undefined
}

export async function parseSkillMd(skillMdPath: string): Promise<Skill | null> {
  try {
    const content = await readFile(skillMdPath, 'utf-8')
    const { data } = parseFrontmatter(content)

    if (typeof data.name !== 'string' || typeof data.description !== 'string') {
      return null
    }

    const skillDir = dirname(skillMdPath)

    return {
      name: data.name,
      description: data.description,
      path: skillDir,
      rawContent: content,
    }
  } catch {
    return null
  }
}

/**
 * Discovers skills in the ./skills directory of a repository.
 * Each subdirectory of ./skills that contains a SKILL.md is a skill.
 */
export async function discoverSkills(basePath: string): Promise<Skill[]> {
  const skillsDir = join(basePath, 'skills')
  const skills: Skill[] = []

  try {
    const entries = await readdir(skillsDir, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue

      const skillDir = join(skillsDir, entry.name)
      if (await hasFile(skillDir, 'SKILL.md')) {
        const skill = await parseSkillMd(join(skillDir, 'SKILL.md'))
        if (skill) skills.push(skill)
      }
    }
  } catch {
    // skills/ directory doesn't exist
  }

  // Also check if basePath itself has a SKILL.md (single skill repo)
  if (skills.length === 0 && (await hasFile(basePath, 'SKILL.md'))) {
    const skill = await parseSkillMd(join(basePath, 'SKILL.md'))
    if (skill) skills.push(skill)
  }

  return skills
}

/**
 * Discovers MCP servers from a root-level mcp.json in the repository.
 * Separate from skills — MCP configs live at the repo root, not inside skill directories.
 */
export async function discoverMcpServers(
  basePath: string,
): Promise<Record<string, McpServerConfig>> {
  return (await parseMcpJson(basePath)) ?? {}
}

/**
 * Discovers MCP servers from mcps/<name>/mcp.json directories.
 * Each subdirectory under mcps/ can contain its own mcp.json.
 */
export async function discoverMcpDirs(basePath: string): Promise<Record<string, McpServerConfig>> {
  const mcpsDir = join(basePath, 'mcps')
  const result: Record<string, McpServerConfig> = {}

  try {
    const entries = await readdir(mcpsDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue
      const servers = await parseMcpJson(join(mcpsDir, entry.name))
      if (servers) Object.assign(result, servers)
    }
  } catch {
    // mcps/ directory doesn't exist
  }

  return result
}

/**
 * Discovers hook groups from a root-level hooks.json in the repository.
 * Each hook group has a name and agent-specific event definitions.
 */
export async function discoverHooks(basePath: string): Promise<Record<string, HookGroup>> {
  return (await parseHooksJson(basePath)) ?? {}
}

interface DiscoveredHookDir {
  group: HookGroup
  dirPath: string
}

/**
 * Discovers hook groups from hooks/<name>/hooks.json directories.
 * Each subdirectory under hooks/ can contain its own hooks.json.
 * Returns the hook group along with the source directory path (for companion file copying).
 */
export async function discoverHookDirs(
  basePath: string,
): Promise<Record<string, DiscoveredHookDir>> {
  const hooksDir = join(basePath, 'hooks')
  const result: Record<string, DiscoveredHookDir> = {}

  try {
    const entries = await readdir(hooksDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue
      const dirPath = join(hooksDir, entry.name)
      const groups = await parseHooksJson(dirPath)
      if (groups) {
        for (const [name, group] of Object.entries(groups)) {
          result[name] = { group, dirPath }
        }
      }
    }
  } catch {
    // hooks/ directory doesn't exist
  }

  return result
}
