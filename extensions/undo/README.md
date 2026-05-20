# Undo Extension

Reverts file changes made by the **previous prompt only** — not the whole conversation, not the entire repo, just the last user prompt's modifications.

## Quick Start

The extension auto‑discovers at `.pi/extensions/undo/` (directory with `index.ts`). No manual setup required.

| Command | Action |
|---------|--------|
| `/undo` | Revert changes from the most recent user prompt |

## How It Works

### Snapshot capture (`before_agent_start`)

1. Before the agent processes each user prompt, `git stash create` captures the current worktree state as a lightweight commit object (no worktree modification).
2. `git stash store -m "pi-undo-pre-{entryId}" $ref` stores the stash in the stash list.
3. An in-memory `Map<entryId, stashRef>` is kept for fast lookup.

### Undo (`/undo` command)

1. Walk the session branch backwards to find the most recent user message entry with a stored snapshot.
2. Run `git checkout <stash-ref> -- .` to restore all tracked files to the captured state (overwrites worktree and index).
3. Drop the stash from the stash list and remove it from the in-memory map.
4. Repeated `/undo` pops progressively older prompts.

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| No uncommitted changes | Snapshot skipped; `/undo` skips to older prompts |
| Non-git repo | Notifies user and does nothing |
| First prompt in session | `/undo` notifies "Nothing to undo" |
| Gapped entries | Skips compaction, branch summaries, model changes — only user messages are undo targets |
| Dirty worktree | `git checkout <ref> -- .` overwrites unconditionally (this is the intent of undo) |

## Known Concerns / Future Work

The following issues were identified during code review and are noted here for ongoing development:

### Code Quality

1. **Unhandled promise rejections in `before_agent_start`** — The handler is async but has no try/catch. A failed `pi.exec` or runtime error would produce an unhandled rejection. Wrap in try-catch.
2. **`git stash create` exit code not checked** — Only stdout emptiness is checked. A command failure could produce a misleading "no changes to snapshot" outcome.
3. **`git stash store` failure silently swallowed** — If the store step fails, the ref is still added to the in-memory map, creating inconsistency.
4. **`stderr` from git commands discarded** — Error output from git is invisible to the user and not logged anywhere.
5. **`dropStashByMessage` failure silently ignored** — If the stash drop fails, the in-memory entry is still deleted, leaking the stash in the stash list.
6. **Non-null assertion on map lookup** — `snapshots.get(targetEntryId)!` (line 97 of undo) is technically safe due to the preceding `has()` check, but fragile to refactoring.

### Spec / Documentation Drift

7. **`/workspace/docs/undo/spec.md` still references `git stash apply --index`** — The implementation switched to `git checkout <ref> -- .` during development (because `git stash apply --index` refused to work with dirty worktrees). The spec needs updating.

### Resource Management

8. **Stale stash accumulation** — `pi-undo-pre-*` stashes that are never consumed (e.g., session closes without `/undo`) remain in the stash list permanently. Consider cleaning orphans on session start or shutdown.

### Test Coverage Gaps

9. **No test for non-git repo graceful handling**
10. **No test for `git checkout` failure** (e.g., bad ref passed)
11. **`dropStashByMessage` not unit-tested** — only tested indirectly via the bash integration tests

## Files

```
extensions/undo/
├── undo             # Extension implementation
├── index.ts        # Re-export
└── README.md       # This file
tests/
├── test_undo.sh    # Integration tests (git stash/checkout workflows)
└── test_undo_core.py  # Unit tests (branch-walking, snapshot map)
.pi/extensions/
└── undo/             # Auto-discovered by pi (directory with index.ts)
docs/
└── undo/
    └── spec.md     # Design specification
```
