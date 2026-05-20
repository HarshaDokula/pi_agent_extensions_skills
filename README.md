# PI Dev Agent Extensions & Skills

A comprehensive collection of extensions and skills for the PI development agent, enabling intelligent workflow automation, code analysis, and development task orchestration.

## Overview

This repository contains:

- **Extensions**: Custom workflow implementations that enhance the PI agent's capabilities
- **Skills**: Specialized task handlers that guide the agent through specific development workflows

## Directory Structure

```
.
├── extensions/
│   └── context-workflow/          # Context-isolated workflow extension
│       ├── context-workflow.ts
│       ├── index.ts
│       └── README.md
└── skills/
    ├── build/                     # Implement focused tasks with tests
    ├── commit/                    # Stage and commit changes
    ├── compress/                  # Compress and optimize code
    ├── coverage/                  # Analyze test coverage
    ├── debug/                     # Debug and troubleshoot issues
    ├── plan/                      # Break down projects into tasks
    ├── refactor/                  # Simplify code without changing behavior
    ├── review/                    # Review code for quality
    ├── spec/                      # Define specifications
    └── tdd/                       # Test-driven development workflow
```

## Extensions

### Context-Isolated Workflow

Provides automated workflow orchestration with context compaction and unbiased review cycles. This extension solves the problem of manual, context-polluted agent interactions by automating the complete workflow: implementation → testing → review → refinement.

**Key Features:**
- Automatic context compaction between workflow phases
- Clean, unbiased code review with isolated context
- Deterministic validation and automated fixes
- Complete workflow automation from spec to verification

### Undo

Reverts file changes made by the **previous prompt only** — not the whole conversation, not the entire repo, just the last user prompt's modifications.

**Key Features:**
- One command: `/undo` — reverts the most recent user prompt's file changes
- Git snapshot-based: uses `git stash create` to capture worktree state before each prompt (non-destructive, no worktree modification)
- Repeated `/undo` pops progressively older prompts
- Graceful non-git handling (notifies user, no-op)

**How it works:**
1. On `before_agent_start`, `git stash create` captures the current worktree as a commit object, `git stash store` persists it, and an in-memory map links entry IDs to stash refs.
2. On `/undo`, the session branch is walked backwards to find the most recent user message with a snapshot, then `git checkout <ref> -- .` restores all tracked files to the captured state.
3. The stash is dropped and the map entry is removed.

**Files:** `extensions/undo/`, `tests/test_undo.sh`, `tests/test_undo_core.py`, `docs/undo/spec.md`

**Known concerns** (documented in `extensions/undo/README.md`): unhandled rejections in `before_agent_start`, unchecked git command exit codes, stale stash accumulation, and gaps in test coverage (non-git path, checkout failure).

## Skills

### Build
Implement one task or scoped change: make the change, add valuable tests, and verify it works.

### Commit
Stage and commit the intended changes with a clear message.

### Compress
Compress and optimize code for better performance and maintainability.

### Coverage
Analyze test coverage to ensure adequate code testing.

### Debug
Debug and troubleshoot issues in the codebase.

### Plan
Break a project, phase, spec, or rough request into small agent-ready tasks with acceptance criteria and verification.

### Refactor
Refactor code to simplify it without changing behavior.

### Review
Review code for quality, correctness, and best practices.

### Spec
Define specifications and requirements for features or changes.

### TDD
Test-driven development workflow for implementing new functionality.

## Usage

Each skill is invocable through the PI agent with specific arguments and context. Refer to the individual SKILL.md files in each skill's directory for detailed usage instructions and process flows.

## Credits & Attribution

This repository is built from:

- **Extensions**: [pi-extensions](https://github.com/owainlewis/pi-extensions.git) by Owain Lewis
- **Skills**: [blueprint](https://github.com/owainlewis/blueprint.git) by Owain Lewis

These extensions and skills are curated and organized for use with the PI development agent framework.

## License

Please refer to the original source repositories for license information.

## Contributing

This is a curated collection of PI agent extensions and skills. For contributions or improvements, consider contributing to the original source repositories:
- https://github.com/owainlewis/pi-extensions
- https://github.com/owainlewis/blueprint
