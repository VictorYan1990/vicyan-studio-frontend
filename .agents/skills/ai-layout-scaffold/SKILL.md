---
name: ai-layout-scaffold
description: >-
  Scaffold a vendor-neutral AI agent config layout in a repository: a canonical
  .agents/ source of truth (AGENTS.md, personas, skills) that Cursor and Claude
  reference via imports and symlinks. Use when the user asks to set up, create,
  bootstrap, or standardize AI agent config / rules / skills / personas layout,
  or wants a "source of truth + import" structure for AI tooling.
---

# AI Layout Scaffold

Create a **single source of truth** for AI agent config under `.agents/`, then
wire tool-specific paths (`.cursor/`, `.claude/`) to it via imports and
symlinks so every tool auto-discovers the same content at its required fixed
path. You edit one place; every agent stays in sync.

## Core principle

- **Canonical (edit here):** `AGENTS.md`, `.agents/personas/`, `.agents/skills/`.
- **Derived (never edit directly):** `CLAUDE.md` (imports `AGENTS.md`),
  `.cursor/skills`, `.claude/skills`, `.cursor/agents` (symlinks into `.agents/`).

## Idempotency rule (important)

This skill is **non-destructive**. For every file or symlink below:

1. If it does **not** exist → create it.
2. If it **already** exists → **skip it** and record it in a "skipped
   (already exists)" list.

After processing everything, if anything was skipped:

- Present the list of existing files/symlinks that were left untouched.
- **Ask the user** whether to update/overwrite any of them, and wait for
  confirmation before changing existing content. Do not overwrite silently.

## Steps

Run all path checks relative to the repository root.

### 1. Create the canonical `.agents/` tree

```
.agents/
├── personas/     # reusable personas (source of truth)
└── skills/       # reusable Agent Skills (source of truth)
```

- If `.agents/skills/README.md` is missing, create it explaining that this dir
  is canonical and that `.cursor/skills` / `.claude/skills` symlink to it.
- Add at least one example persona in `.agents/personas/` only if the directory
  is empty (e.g. a project-appropriate engineer persona with `name` +
  `description` frontmatter). If personas already exist, leave them.

### 2. Create `AGENTS.md` (instructions source of truth)

If `AGENTS.md` does not exist at the repo root, create it with, at minimum:
- a one-line note that it is the canonical, vendor-neutral source of truth;
- a project overview and key conventions (infer from the repo; keep concise);
- a "Personas" section pointing at `.agents/personas/`;
- an "Agent config layout" section documenting the import/symlink wiring below.

If it already exists, skip and report it.

### 3. Create `CLAUDE.md` (import, not a copy)

If `CLAUDE.md` does not exist, create it so Claude Code re-exports the canonical
file instead of duplicating it:

```markdown
# CLAUDE.md

This project keeps its agent guidance in the vendor-neutral `AGENTS.md`:

@AGENTS.md

Do not duplicate guidance here — edit `AGENTS.md` instead.
```

### 4. Wire tool-specific paths via symlinks

Create these **relative** symlinks (skip any that already exist):

```
.cursor/skills   -> ../.agents/skills
.cursor/agents   -> ../.agents/personas
.claude/skills   -> ../.agents/skills
```

Create parent dirs (`.cursor/`, `.claude/`) if missing. Use relative targets so
the repo stays portable. Suggested commands:

```bash
mkdir -p .cursor .claude
[ -e .cursor/skills ] || ln -s ../.agents/skills   .cursor/skills
[ -e .cursor/agents ] || ln -s ../.agents/personas .cursor/agents
[ -e .claude/skills ] || ln -s ../.agents/skills   .claude/skills
```

### 5. Update `.gitignore`

Ensure the shared config **is committed** and only personal/secret files are
ignored. Add these entries if absent (do not remove unrelated existing rules):

```gitignore
# AI assistants — commit AGENTS.md, CLAUDE.md, .agents/, and the .cursor/.claude
# symlinks that point at .agents/. Ignore only personal/secret files:
.claude/settings.local.json
*.local.json
.cursor/mcp.json           # may hold secrets; template it if you commit one
.ai/                       # scratch prompts / working notes
```

If a broad rule like `.claude` or `.cursor` already ignores the whole tool dir,
flag it: it would exclude the symlinks. Ask the user before narrowing it.

### 6. Verify and report

- Confirm symlinks resolve (`ls -la .cursor .claude`).
- Confirm git tracks the shared files and ignores the personal ones
  (`git check-ignore -v <path>` where useful).
- Summarize: what was created, what was skipped (already existed), and any
  open questions for the user (esp. from steps 2 and 5).

## Caveats to surface to the user

- **Windows:** symlinks work on Linux/macOS/WSL. On native Windows, cloning may
  need `git config core.symlinks true` + Developer Mode, or the symlinks
  materialize as plain files. Offer real per-tool copies + a sync step as a
  fallback if the team is on native Windows.
- **Format drift:** a tool may expect specific frontmatter for its custom
  agents/skills. The symlink wiring is standard; adjust frontmatter per tool if
  it rejects the shared files.
