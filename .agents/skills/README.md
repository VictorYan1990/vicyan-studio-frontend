# Skills (canonical source of truth)

This directory is the **single source of truth** for reusable Agent Skills in
this repository. Edit skills here.

Each skill lives in its own folder with a `SKILL.md` containing `name` +
`description` frontmatter.

## How tools reach these skills

`.claude/skills` and `.cursor/skills` are **relative symlinks** pointing at this
directory. They are required, not cosmetic: Claude Code's skill scanner is
hardcoded to `.claude/skills` and cannot be pointed elsewhere. Cursor also scans
`.agents/skills/` directly, so its link is redundant — kept for symmetry.

Use symlinks, never junctions. On Windows this requires Developer Mode and
`git config core.symlinks true`; see the `ai-config-discovery` skill for the
full model, the evidence behind it, and repair steps.
