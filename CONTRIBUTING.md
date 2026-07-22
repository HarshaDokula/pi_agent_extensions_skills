# Contributing

This repository is a hub of [pi agent](https://github.com/badlogic/pi-mono) extensions and skills, organized into **set branches** — curated profiles tailored for different use cases (e.g. Python development, design work, etc.).

## Branch Model

```
main                  ← repo landing page: README, CI, docs (no skills/extensions)
set/python-dev        ← curated collection for Python development
  └── feature/*       ← feature branches for set/python-dev
set/design            ← curated collection for design work
  └── feature/*       ← feature branches for set/design
```

| Branch | Purpose | Accepts PRs from |
|--------|---------|-------------------|
| `main` | Repo landing page: README, CI workflows, docs, LICENSE | `feature/*` (infrastructure only) |
| `set/<profile>` | An independent, curated collection of extensions and skills | `feature/*` branched from that same set |

Set branches are **fully independent** of each other and of `main`. They do not merge into `main`, and `main` does not merge into them. Each `set/*` is its own standalone profile.

## How to Contribute

### 1. Pick or Create a Set Branch

If you're adding to an existing set (e.g. `set/python-dev`):

```bash
git checkout set/python-dev
git checkout -b feature/my-new-skill
```

If no set exists for your use case, create one from `main`:

```bash
git checkout main
git checkout -b set/data-engineering
git push -u origin set/data-engineering
```

### 2. Make Your Changes

#### Adding a Skill

Create a directory under `skills/<skill-name>/` with at minimum a `SKILL.md`:

```markdown
---
name: my-skill
description: "What this skill does, in one sentence."
user-invocable: true
argument-hint: "<optional argument description>"
---

# My Skill

## Process

1. Step one
2. Step two
...
```

#### Adding an Extension

Create a directory under `extensions/<extension-name>/` with at minimum:
- `index.ts` — the extension entry point
- `README.md` — usage documentation

#### Modifying Existing Content

Edit the files in place. Follow the existing conventions in that set branch.

### 3. Submit a Pull Request

Push your feature branch and open a PR:

- **PR base (target):** the `set/<profile>` branch you started from
- **PR head (source):** your `feature/<name>` branch

**Do NOT open PRs targeting `main` for skill/extension changes.** `main` only accepts infrastructure changes (CI, docs, meta).

### 4. PR Requirements

Your PR must pass automated checks:

| Check | Requirement |
|-------|-------------|
| Branch naming | Source branch must match `feature/*` |
| PR target | Target must be `set/*` (or `main` for infra PRs) |
| Skill structure | `SKILL.md` exists and has valid frontmatter (`name`, `description`) |
| Extension structure | Extension directory has `index.ts` and `README.md` |
| No deletions | Do not remove files from other skills/extensions in the set without justification |

### 5. Cross-Set Contributions

If your skill or extension is useful to multiple set branches:

1. Open your PR against the most relevant set first.
2. Once merged, open a follow-up PR against each additional `set/*` branch.
3. Include a note in each PR description linking to the original PR.

Avoid copy-pasting between sets — use the cherry-pick/PR approach so changes stay traceable.

## Branch Protection Rules

The following protections are enforced:

- **`main`**: only infrastructure PRs accepted; direct pushes blocked.
- **`set/*`**: only `feature/*` PRs accepted; at least one approving review required; CI must pass.
- **`feature/*`**: no direct PR to another `feature/*`.

## Conventions

### Skill Conventions

- Each skill lives in `skills/<name>/SKILL.md`
- Frontmatter must include `name`, `description`, and `user-invocable`
- Keep skills focused on one workflow or task

### Extension Conventions

- Each extension lives in `extensions/<name>/`
- Must include `index.ts` and `README.md`
- TypeScript source files (`.ts`) are the canonical format

### General

- PRs should be scoped: one skill, one extension, or one coherent change
- Commit messages follow [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
- If you're unsure about scope, open an issue or discussion first

## Questions?

Open a [GitHub Discussion](https://github.com/HarshaDokula/pi_agent_extensions_skills/discussions) or file an issue.
