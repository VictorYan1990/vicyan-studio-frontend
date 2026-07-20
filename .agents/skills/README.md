# Skills (canonical source of truth)

This directory is the **single source of truth** for reusable Agent Skills in
this repository. Edit skills here.

Tool-specific paths are **symlinks** into this directory, so every AI tool
discovers the same skills:

- `.claude/skills` → `../.agents/skills`
- `.cursor/skills` → `../.agents/skills`

Do not edit skills through the symlinked paths — always edit the files under
`.agents/skills/`. Each skill lives in its own folder with a `SKILL.md`
containing `name` + `description` frontmatter.
