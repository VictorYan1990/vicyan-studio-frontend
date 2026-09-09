---
name: ai-config-discovery
description: >-
  How AI tools actually discover and load this repo's skills, personas, and
  rules: the two-layer model (always-loaded metadata vs on-demand body), which
  directories each tool hardcodes, and why `.agents/` needs symlinks into
  `.claude/` and `.cursor/`. Also defines the session-start Layer 1 self-check.
  Use when the user asks where AI skills/config/personas/rules live, how AI
  tools find them, why a skill did or did not load, the difference between
  global and project skills, how the `.agents/` links are wired, or when the
  session-start self-check reports a discovery failure. When relevant, follow
  this guidance AND verify your own actual mechanism, then report any mismatch.
---

# AI Config Discovery (source of truth for how AI content is found)

This file records how AI tools locate and load AI-specific content in this
repository, and what has been **empirically verified** here. If your actual
behavior as an AI tool differs from what is described below, **say so
explicitly** — a mismatch is itself important information.

## The two-layer loading model

1. **Layer 1 — platform engine (mechanical, pre-prompt).** Before the model
   reads anything, the tool's engine scans a fixed set of recognized locations
   and injects context: an available-skills block (skill name + description +
   path), always-applied rules, and per-message state. This is **code, not
   instruction** — it only looks where it is hardcoded to look. A prose rule
   **cannot** make the engine scan a new location.
2. **Layer 2 — the model (instructional, in-prompt).** Anything in `AGENTS.md`
   or a skill body is text the model acts on *after* Layer 1 has already decided
   what was loaded. It changes model behavior, not what the engine scanned.

**Why this matters.** The point of a skill is that its metadata is present from
the first token, so the model *volunteers* the skill when it detects relevance.
A skill reachable only by explicit user request has lost its main advantage.
"Discovery" in this file always means Layer 1.

## Where each tool actually scans (verified)

| Tool | Scans | `.agents/` directly? |
| --- | --- | --- |
| **Cursor** | `.cursor/skills/`, and `.agents/skills/` | **yes** |
| **Claude Code** | `.claude/skills/` only | **no** |

- **Cursor** discovers `.agents/skills/` directly. Confirmed by removing the
  `.cursor/skills` entry entirely and observing a fresh session still find
  `ai-layout-scaffold` at its real `.agents/skills/` path.
- **Claude Code does NOT.** Its scanner walks up from cwd building candidate
  paths with a hardcoded `path.join(dir, ".claude", "skills")`. There is no
  setting for additional skill roots. Confirmed twice:
  - **Source:** `dynamicSkillDirs` in the CLI bundle joins only
    `.claude/skills`; no `skillDir`/`skillsPath`/`skillRoot` config key exists.
  - **Behavior:** with `.claude/skills` deleted, a fresh Claude Code session in
    this repo listed zero project skills — despite `CLAUDE.md` → `AGENTS.md`
    being loaded and naming `.agents/skills/` as canonical. Exactly the Layer 1
    vs Layer 2 gap above.

**Conclusion: the links are NOT redundant.** `.cursor/*` links are redundant
(Cursor finds `.agents/` anyway) and are kept only for consistency;
`.claude/skills` is **required** for Layer 1 discovery in Claude Code.

Two scanner details worth knowing: it calls `realpath()` on the directory, so a
symlink is followed correctly; and it logs `Skipped gitignored skills dir` —
**the link must not be gitignored**.

## Link wiring (Windows + WSL)

Four relative symlinks, committed in git as mode `120000`:

```
.claude/skills  -> ../.agents/skills
.claude/agents  -> ../.agents/personas
.cursor/skills  -> ../.agents/skills
.cursor/agents  -> ../.agents/personas
```

### Symlink vs junction — measured on this machine

| Method | Needs admin | Windows reads it | WSL reads it | Git-portable |
| --- | --- | --- | --- | --- |
| WSL `ln -s` on `/mnt/c` | no | **no** | yes | yes (relative) |
| NTFS symlink (`New-Item -ItemType SymbolicLink`) | **yes** | yes | yes | yes (relative) |
| Junction (`mklink /J`) | no | yes | yes | **no** (absolute) |

**Use symlinks; never junctions.** A junction stores an *absolute* target, so
git records `/mnt/c/Users/<you>/repos/<repo>/.agents/skills` instead of
`../.agents/skills` — machine-specific and broken on any other clone. Junctions
are also directory-only.

**The one prerequisite is Windows Developer Mode.** With it off, WSL's `ln -s`
on `/mnt/c` cannot create a real NTFS symlink and silently falls back to a
WSL-only LX reparse point. WSL reads it fine; Windows-native tools (Cursor,
PowerShell, native Claude Code) fail with *"The file cannot be accessed by the
system"*, and `dir` mislabels it `<JUNCTION>` with an unreadable `[...]`
target. **This — not link rot — is the historical cause of the "broken
junction pointing at `C:\`" in this repo.**

Enable it once per machine (elevated PowerShell), or via
Settings → System → For developers:

```powershell
Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock' `
  -Name AllowDevelopmentWithoutDevLicense -Value 1
```

Then `git config core.symlinks true` in the repo (a `false` value makes checkout
write the link as a **plain text file containing the target path**). Afterwards
`ln -s` from WSL, `git checkout` from either side, and PowerShell all produce
the same real NTFS symlink that every tool can traverse.

## Expected skill directories

- **Project-scoped, canonical:** `.agents/skills/` — each skill a folder with a
  `SKILL.md` carrying `name` + `description` frontmatter. Committed, travels
  with git.
- **User-scoped (global), Cursor:** `~/.cursor/skills-cursor/`. Applies to every
  workspace; not committed.
- **User-scoped (global), Claude Code:** `~/.claude/skills/`.

Global vs project: global lives under the user home and applies machine-wide;
project lives in the working tree and travels with the repo.

## Other auto-loaded config (Layer 1, this project)

- Root **`AGENTS.md`** — always-applied rule (canonical guidance source).
- Root **`CLAUDE.md`** — always-applied; here it only imports `AGENTS.md`.
- **Skill descriptions** — metadata only; body read on demand.
- `.agents/personas/` — reachable as subagents through the `agents` links;
  otherwise read on demand via the `AGENTS.md` pointer.

## Session-start Layer 1 self-check

**Run once per session, on your first substantive reply. Do not repeat it on
later turns in the same session.** It is triggered by a short block in
`AGENTS.md` (not by this skill's description — a broken link means this file's
metadata never loaded, so the check must be anchored somewhere always-loaded).

**Procedure — introspection, no shell command needed:**

1. Look at the available-skills list you were given at session start.
2. Check whether the project skills in `.agents/skills/` appear in it —
   currently `ai-config-discovery` and `ai-layout-scaffold`.

**Report — exactly one line, then move on to the user's request:**

- All present → `Layer 1 skill discovery: OK (N project skills).`
- Any missing → name them and state the likely cause, e.g.
  `Layer 1 skill discovery: FAILED — .agents/skills not visible. Check .claude/skills link.`

**On failure, diagnose in this order** (only when the user asks you to fix it):

1. Does the link exist? `ls -la .claude/skills .cursor/skills`
2. Is it a real symlink, or a plain file holding a path string?
   A plain file means `core.symlinks` was `false` at checkout.
3. Can Windows traverse it?
   `powershell.exe -NoProfile -Command "Get-ChildItem '<abs path>'"`
   Failure here means Developer Mode is off — fix that first, then recreate.
4. Is it gitignored? `git check-ignore -v .claude/skills` must find nothing.

Keep the check cheap: it is one line of output on success, and it exists to
catch a silent failure mode, not to narrate configuration on every turn.

## Your obligation when this file is relevant

1. Use the expectations above to infer the user's intent and vocabulary.
2. State how you *actually* discover/load the content in question.
3. If the two differ, **flag the difference clearly** and verify empirically
   (inspect the filesystem, read the tool's own scanner) rather than assuming.
