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

`.agents/` is the single source of truth. Tool-specific paths are wired to it:

| Path | Type | Points at |
| --- | --- | --- |
| `AGENTS.md` | canonical | (this file) |
| `.agents/personas/` | canonical | reusable personas |
| `.agents/skills/` | canonical | reusable Agent Skills |
| `CLAUDE.md` | derived | imports `AGENTS.md` |
| `.claude/skills` | symlink | `.agents/skills` |
| `.cursor/skills` | symlink | `.agents/skills` |
| `.cursor/agents` | symlink | `.agents/personas` |

Edit the canonical files; never edit through the derived paths.
