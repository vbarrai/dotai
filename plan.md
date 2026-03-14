# Plan : Gestion des Hooks dans maconfai

## Résumé

Ajouter le support `--hooks` pour installer/désinstaller des hooks depuis des repos source vers les agents Claude Code et Cursor. Le pattern suit exactement celui des MCP servers (discover → select → install → merge).

## Agents supportés

| Agent | Config file | Format | Supporté |
|:------|:-----------|:-------|:---------|
| Claude Code | `.claude/settings.json` | `{ hooks: { EventName: [{ matcher, hooks: [handler] }] } }` | Oui |
| Cursor | `.cursor/hooks.json` | `{ version: 1, hooks: { eventName: [{ command, matcher, ... }] } }` | Oui |
| Codex | — | Pas de hooks génériques | Non |

## Format source (dans le repo)

Un fichier `hooks.json` au même niveau que `mcp.json` (racine du repo ou dans un skill dir) :

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".agents/hooks/block-rm.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".agents/hooks/lint.sh"
          }
        ]
      }
    ]
  }
}
```

Le format source utilise la **convention Claude Code** (PascalCase events, structure `matcher` + `hooks` array). La traduction vers Cursor se fait à l'installation.

## Mapping des events entre agents

| Source (Claude Code) | Cursor | Notes |
|:--------------------|:-------|:------|
| `PreToolUse` | `preToolUse` | Direct mapping |
| `PostToolUse` | `postToolUse` | Direct mapping |
| `PostToolUseFailure` | `postToolUseFailure` | Direct mapping |
| `SessionStart` | `sessionStart` | Direct mapping |
| `SessionEnd` | `sessionEnd` | Direct mapping |
| `Stop` | `stop` | Direct mapping |
| `SubagentStart` | `subagentStart` | Direct mapping |
| `SubagentStop` | `subagentStop` | Direct mapping |
| `UserPromptSubmit` | `beforeSubmitPrompt` | Nom différent |
| `PreCompact` | `preCompact` | Direct mapping |
| Pas d'équivalent | `beforeShellExecution` | Cursor-only |
| Pas d'équivalent | `afterFileEdit` | Cursor-only |
| `PermissionRequest` | — | Claude Code-only |
| `Notification` | — | Claude Code-only |
| `InstructionsLoaded` | — | Claude Code-only |

**Stratégie** : les hooks dont l'event n'a pas d'équivalent sont **ignorés silencieusement** pour l'agent cible.

## Traduction de format

### Claude Code → Claude Code (identité)
Le format source est écrit tel quel dans `.claude/settings.json` sous la clé `hooks`.

### Claude Code → Cursor
1. PascalCase → camelCase pour les event names
2. Structure aplatie : `{ matcher, hooks: [{ type, command }] }` → `{ command, matcher, type? }`
3. Env vars : `${VAR}` → `${env:VAR}` (même traduction que MCP)
4. Ajout de `version: 1` au fichier

Exemple de traduction :
```json
// Source
{ "PreToolUse": [{ "matcher": "Bash", "hooks": [{ "type": "command", "command": "./check.sh" }] }] }

// → Cursor
{ "version": 1, "hooks": { "preToolUse": [{ "command": "./check.sh", "matcher": "Bash" }] } }
```

## Étapes d'implémentation

### Phase 1 : Types et agents (`src/types.ts`, `src/agents.ts`)

1. Ajouter dans `types.ts` :
   ```typescript
   export type HookHandlerType = 'command' | 'http' | 'prompt' | 'agent'

   export interface HookHandler {
     type: HookHandlerType
     command?: string
     url?: string
     prompt?: string
     timeout?: number
     headers?: Record<string, string>
     [key: string]: unknown  // async, statusMessage, failClosed, etc.
   }

   export interface HookEntry {
     matcher?: string
     hooks: HookHandler[]
   }

   export type HooksConfig = Record<string, HookEntry[]>
   ```

2. Ajouter dans `AgentConfig` :
   ```typescript
   hooksConfigPath?: string
   hooksFormat?: 'claude-code' | 'cursor'
   ```

3. Mettre à jour `agents.ts` :
   - `claude-code` : `hooksConfigPath: '.claude/settings.json'`, `hooksFormat: 'claude-code'`
   - `cursor` : `hooksConfigPath: '.cursor/hooks.json'`, `hooksFormat: 'cursor'`
   - `codex` : pas de hooks

### Phase 2 : Module hooks (`src/hooks.ts`)

Créer `src/hooks.ts` en suivant le pattern de `src/mcp.ts` :

1. **`translateHooksForAgent(hooks, agentType)`** — convertit du format source vers le format agent
   - Claude Code : identité
   - Cursor : camelCase events + flatten handlers + env vars

2. **`installHooks(hooks, agentType, options)`** — merge dans le fichier config
   - Lit le fichier existant (ou `{}`)
   - Traduit les hooks pour l'agent
   - Merge : pour chaque event, ajoute les nouveaux handlers sans dupliquer
   - Détection de doublon : même `matcher` + même `command`/`url`/`prompt`
   - Retourne `{ installed: string[], skipped: string[] }` (noms = `EventName:matcher` ou `EventName:*`)

3. **`uninstallHooks(hookIds, agentType, options)`** — retire du fichier config

4. **`listInstalledHookIds(options)`** — liste les hooks installés

### Phase 3 : Discovery (`src/skills.ts`)

1. Ajouter `discoverHooks(basePath)` — lit `hooks.json` à la racine
2. Ajouter `parseHooksJson(dir)` — parse le fichier `hooks.json` d'un skill dir
3. Étendre `Skill` avec `hooks?: HooksConfig`

### Phase 4 : Installer (`src/installer.ts`)

1. Étendre `installSkill()` pour accepter `hooks?: HooksConfig`
2. Appeler `installHooks()` comme pour les MCP servers
3. Étendre `uninstallSkill()` pour les hooks
4. Retourner `hooksInstalled` / `hooksSkipped`

### Phase 5 : CLI (`src/cli.ts`, `src/install.ts`)

1. Ajouter `--hooks=hook1,hook2` dans `cli.ts` (help text)
2. Dans `install.ts` :
   - Appeler `discoverHooks()` à côté de `discoverMcpServers()`
   - Collecter les hooks (depuis skills + racine)
   - Prompt de sélection des hooks (comme MCP)
   - Installer les hooks standalone (racine) et ceux liés aux skills
3. Dans `runUninstall()` : gérer les hooks dans le lock file

### Phase 6 : Lock file (`src/lock.ts`)

1. Ajouter `hooks?: string[]` dans `SkillLockEntry` (liste des hook IDs installés)

### Phase 7 : Tests

Structure des tests E2E :

```
tests/
  claude-code/
    hooks/
      install-single.test.ts           # Un seul hook PreToolUse
      install-multiple.test.ts         # Plusieurs events
      install-merge.test.ts            # Merge avec hooks existants
      install-skip-existing.test.ts    # Hooks déjà présents = skip
      install-with-skill.test.ts       # Hooks alongside SKILL.md
  cursor/
    hooks/
      install-single.test.ts           # Un seul hook traduit en camelCase
      install-multiple.test.ts         # Plusieurs events traduits
      install-env.test.ts              # ${VAR} → ${env:VAR}
      install-merge.test.ts            # Merge avec hooks existants
      install-skip-existing.test.ts    # Hooks déjà présents = skip
      install-with-skill.test.ts       # Hooks alongside SKILL.md
```

Tests unitaires :
- `tests/hooks.test.ts` — traduction, merge, détection de doublons

### Phase 8 : Documentation

1. Mettre à jour `docs/agents-config/claude-code/hooks.md` — changer le status banner en "Supported"
2. Mettre à jour `docs/agents-config/cursor/hooks.md` — changer le status banner en "Supported"
3. Mettre à jour `CLAUDE.md` :
   - Ajouter `src/hooks.ts` dans la structure du projet
   - Mettre à jour le tableau agents-config (hooks → Supported)
   - Ajouter `--hooks` dans les CLI flags
   - Ajouter les tests hooks dans le file tree

## Points d'attention

- **Merge non-destructif** : ne jamais écraser les hooks existants dans `.claude/settings.json` (ce fichier contient d'autres settings)
- **Idempotence** : réinstaller les mêmes hooks = skip, pas de doublon
- **Fichiers de scripts** : les scripts référencés dans les hooks (`./check.sh`, etc.) doivent être copiés dans le canonical dir. Le chemin dans le hook doit pointer vers `.agents/hooks/` ou le chemin relatif correct
- **Pas de Codex** : Codex n'a pas de support hooks génériques, on l'ignore silencieusement
