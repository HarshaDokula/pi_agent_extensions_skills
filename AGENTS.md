# Project: pi-agent Extensions & Skills Hub

A curated repository of [pi coding agent](https://github.com/badlogic/pi-mono) extensions and skills, organized into independent **set branches** — each a standalone profile for a specific use case (Python development, design work, data engineering, etc.).

## Branch Model (critical — read first)

This is **not** a standard `main`-only repo. Understand this before any change:

```
main                       ← infrastructure only: README, CI, docs, LICENSE
set/<profile>              ← an independent profile branch (e.g. set/python-dev)
  └── feature/<name>       ← feature branches for that set
```

| Branch | Contains | Accepts PRs from |
|--------|----------|-------------------|
| `main` | README, CI (`.github/`), docs, meta files | `feature/*` — infrastructure only |
| `set/*` | A standalone collection of `skills/` + `extensions/` | `feature/*` branched from that same set |

**Key rules:**
- `set/*` branches are **fully independent** — they never merge into `main`, and `main` does not merge into them
- Do **not** add skills or extensions to `main` (CI will reject it)
- Do **not** target `main` for skill/extension PRs — always target the appropriate `set/<profile>`
- When creating a new `set/*` branch, **always branch from latest `main`** so it inherits CI workflows

## Project Structure

```
.
├── skills/                  # Each skill is a subdirectory with a SKILL.md
│   ├── build/               #   Implement one scoped task with tests
│   ├── commit/              #   Stage and commit changes
│   ├── compress/            #   Compress agent-facing instructions
│   ├── coverage/            #   Evaluate and fill test coverage gaps
│   ├── debug/               #   Systematic debugging workflow
│   ├── init/                #   Create/update AGENTS.md for a project
│   ├── plan/                #   Break projects into agent-ready tasks
│   ├── refactor/            #   Simplify code without changing behavior
│   ├── review/              #   Evidence-backed code review
│   ├── spec/                #   Write implementation specs
│   └── tdd/                 #   Test-first development workflow
├── extensions/              # Each extension is a subdirectory with index.ts + README.md
│   ├── context-workflow/    #   Automated workflow with context compaction
│   └── undo/                #   Revert last prompt's file changes
├── docs/                    # Additional documentation
├── .github/
│   ├── workflows/
│   │   └── pr-validation.yml  # CI: validates branch naming, structure, labeling
│   ├── CODEOWNERS             # @HarshaDokula owns everything
│   └── pull_request_template.md
├── CONTRIBUTING.md          # Full contribution guide for humans
├── README.md                # Project overview
├── LICENSE                  # MIT
└── .gitignore
```

## Tech Stack

- **No runtime.** This is a content repository — no build step, no package manager, no framework.
- **CI:** GitHub Actions (`.github/workflows/pr-validation.yml`)
- **Repository:** `HarshaDokula/pi_agent_extensions_skills` on GitHub
- **Remote:** `https://github.com/HarshaDokula/pi_agent_extensions_skills.git`

## CI / PR Validation

On every PR to `main` or `set/**`, the workflow (`.github/workflows/pr-validation.yml`) runs these jobs:

| Job | When | What it checks |
|-----|------|----------------|
| `branch-check` | Always | Source branch matches `feature/*` (or `hotfix/*`/`chore/*` for main). Target is `main` or `set/*`. |
| `main-target-guard` | Target is `main` | Only infrastructure files allowed (`^.github/`, `^README.md$`, `^CONTRIBUTING.md$`, `^LICENSE$`, `^.gitignore$`, `^docs/`). No `skills/` or `extensions/` changes. |
| `structure-check` | Target is `set/*` | Every `skills/<name>/SKILL.md` has `name` + `description` frontmatter. Every `extensions/<name>/` has `index.ts`. Warns on deletions. |
| `auto-label` | PR opened | Applies labels automatically: `skill`, `extension`, `infra`, and the set name itself (e.g. `set/python-dev`). Creates set label if missing. |

Branch protection rules:
- **`main`**: requires status checks to pass (all 3), no force pushes, no deletions
- **`set/**`**: requires 1 approving review + status checks, no force pushes, no deletions. Pull requests required.

## How to Work on This Repo

### Determine which branch to work on

- **Infrastructure changes** (CI, docs, README, .gitignore): work on `main`
- **Skill/extension changes**: find or create the relevant `set/<profile>` branch

### Adding a new skill

Create `skills/<name>/SKILL.md` with valid frontmatter and content:

```markdown
---
name: my-skill
description: "One sentence describing what it does."
user-invocable: true
argument-hint: "<optional hint for arguments>"
---

# Skill Title

## When to use
...

## Process
1. ...
```

### Adding a new extension

Create `extensions/<name>/` with at minimum:
- `index.ts` — entry point (typically `export { default } from "./module-name";`)
- `README.md` — usage documentation

### Making a PR

```bash
# For skill/extension work:
git checkout set/<profile>
git checkout -b feature/my-change
# ... make changes ...
git push -u origin feature/my-change
# Open PR targeting set/<profile>

# For infrastructure work:
git checkout main
git checkout -b feature/update-ci
# ... make changes ...
git push -u origin feature/update-ci
# Open PR targeting main
```

### Cross-set changes

If a skill or extension is useful to multiple set branches:
1. PR to the first set, get it merged
2. Open follow-up PRs to each additional `set/*` branch
3. Link back to the original PR in each description

## Conventions

### Skills
- One skill per directory under `skills/<name>/`
- File: `SKILL.md` with YAML frontmatter (`name`, `description`, `user-invocable`, optionally `argument-hint`)
- Content describes when to use, a step-by-step process, verification criteria, and rules
- Skills should be focused on a single workflow or task

### Extensions
- One extension per directory under `extensions/<name>/`
- Required: `index.ts` (entry point), `README.md` (documentation)
- TypeScript source files (`.ts`) are the canonical format
- Extensions add new commands and tool capabilities to the pi agent

### General
- Commit messages: [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
- PRs should be scoped to one skill, one extension, or one coherent infrastructure change
- Labels: CI auto-applies them on open — use `skill`, `extension`, `infra`, or the set label for routing

## Labels

| Label | Purpose |
|-------|---------|
| `skill` | PR modifies `skills/` |
| `extension` | PR modifies `extensions/` |
| `infra` | PR targets `main` (infrastructure only) |
| `bug` | Something is broken |
| `set/<profile>` | Identifies which set branch the PR targets (auto-created by CI) |

## Owner

Maintained by [@HarshaDokula](https://github.com/HarshaDokula).
