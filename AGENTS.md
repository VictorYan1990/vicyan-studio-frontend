# AGENTS.md

Canonical, vendor-neutral source of truth for AI agent guidance in this
repository. Tool-specific files re-export this one — edit here, not there.

## Project overview

`vicyan-studio-frontend` is the React frontend for Victor Yan's personal
website (`https://vicyan.studio`). It is a Create React App project (customized
with CRACO) written in TypeScript, built as static assets and deployed to AWS
S3 + CloudFront.

**Stack:** React 18, TypeScript, Ant Design 5, React Router 7, react-markdown.
CRACO adds a webpack rule so `.md` files import as raw strings, and a Jest
`moduleNameMapper` so modern ESM-only dependencies resolve under CRA's Jest 27.

## Key conventions

- **Pages** live in `src/pages/<Name>/` as co-located `Name.tsx` + `Name.css`
  (+ optional `Name.md` for markdown-driven content pages).
- **Routing** is centralized in `src/App.tsx`; the shared chrome (nav header)
  is `src/layouts/MainLayout.tsx`.
- **Tests** sit next to the code they cover as `*.test.ts(x)`, using Jest +
  React Testing Library. Query by role/label/text, not implementation details.
- **Verify UI changes** by running the app and observing rendered output.
- Run the suite once (non-watch) with `npm test -- --watchAll=false`.

## Personas

Reusable personas live in [`.agents/personas/`](.agents/personas/). See
[`frontend-engineer.md`](.agents/personas/frontend-engineer.md).

## Agent config layout

`.agents/` is the single source of truth. Tool-specific directories are
**relative symlinks** into it — edit only the canonical files:

| Path | Type | Role |
| --- | --- | --- |
| `AGENTS.md` | canonical | this file; auto-loaded as an always-applied rule |
| `.agents/personas/` | canonical | reusable personas / subagents |
| `.agents/skills/` | canonical | reusable Agent Skills |
| `CLAUDE.md` | derived | thin file that imports `AGENTS.md` |
| `.claude/skills`, `.cursor/skills` | derived | symlink → `../.agents/skills` |
| `.claude/agents`, `.cursor/agents` | derived | symlink → `../.agents/personas` |

The links are **required**: Claude Code's skill scanner is hardcoded to
`.claude/skills` and has no setting for extra roots, so this file's guidance
cannot redirect it. Cursor also scans `.agents/skills/` directly, making its
links redundant — they are kept for symmetry.

Use symlinks, never junctions (a junction stores an absolute, machine-specific
path). On Windows this needs Developer Mode plus `core.symlinks=true`. See the
`ai-config-discovery` skill for the full model, evidence, and repair steps.

## Session start: Layer 1 skill check

On your **first substantive reply of a session only** — never repeat it on later
turns — check whether the skills in `.agents/skills/` appear in the
available-skills list you were given at startup, and report one line:

- All present → `Layer 1 skill discovery: OK (N project skills).`
- Any missing → name them and flag the likely broken `.claude/skills` or
  `.cursor/skills` link.

Then continue with the user's request. Only diagnose further if asked; the
`ai-config-discovery` skill has the procedure.
