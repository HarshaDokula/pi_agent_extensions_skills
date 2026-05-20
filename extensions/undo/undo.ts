/**
 * Undo Extension
 *
 * Reverts file changes made by the previous prompt only.
 * Uses git stash snapshots to capture worktree state before each prompt.
 *
 * How it works:
 *   1. On `before_agent_start`, git stash create captures the current
 *      worktree state as a commit object (no worktree modification).
 *   2. On `/undo`, git checkout <stash-ref> -- . restores the worktree
 *      to the state captured before the target prompt, overwriting
 *      any changes made since.
 *
 * Commands:
 *   /undo  - Revert changes from the most recent user prompt
 *
 * Events:
 *   before_agent_start  - Capture git stash snapshot before LLM makes changes
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	// In-memory map: entryId -> stash ref
	const snapshots = new Map<string, string>();

	// ── Snapshot capture ────────────────────────────────────────────
	pi.on("before_agent_start", async (_event, ctx) => {
		const leafEntry = ctx.sessionManager.getLeafEntry();
		if (!leafEntry) return;
		if (leafEntry.type !== "message" || leafEntry.message.role !== "user") return;

		const entryId = leafEntry.id;

		// Skip if not a git repo
		const { code: gitCheckCode } = await pi.exec("git", [
			"rev-parse",
			"--git-dir",
		]);
		if (gitCheckCode !== 0) return;

		// Create a stash commit representing the current worktree state.
		// This does NOT modify the worktree — it just creates a commit object.
		const { stdout: ref } = await pi.exec("git", ["stash", "create"]);
		const stashRef = ref.trim();
		if (!stashRef) return; // No uncommitted changes to snapshot

		// Store the stash in the stash list so the commit is reachable
		await pi.exec("git", [
			"stash",
			"store",
			"-m",
			`pi-undo-pre-${entryId}`,
			stashRef,
		]);

		// Keep in-memory mapping for fast lookup
		snapshots.set(entryId, stashRef);
	});

	// ── Undo command ──────────────────────────────────────────────
	pi.registerCommand("undo", {
		description: "Revert file changes from the previous prompt",
		handler: async (_args, ctx) => {
			// Check we're in a git repo
			const { code: gitCheckCode } = await pi.exec("git", [
				"rev-parse",
				"--git-dir",
			]);
			if (gitCheckCode !== 0) {
				ctx.ui.notify("Not a git repository — cannot undo", "error");
				return;
			}

			// Walk branch entries backwards to find most recent user message
			// that has a snapshot in our map
			const branchEntries = ctx.sessionManager.getBranch();
			let targetEntryId: string | undefined;

			for (let i = branchEntries.length - 1; i >= 0; i--) {
				const entry = branchEntries[i];
				if (
					entry.type === "message" &&
					entry.message.role === "user" &&
					snapshots.has(entry.id)
				) {
					targetEntryId = entry.id;
					break;
				}
			}

			if (!targetEntryId) {
				ctx.ui.notify("Nothing to undo for the previous prompt", "info");
				return;
			}

			const stashRef = snapshots.get(targetEntryId)!;

			// Restore all tracked files from the snapshot commit.
			// This overwrites worktree + index for all files tracked by git,
			// effectively reverting the worktree to the pre-prompt state.
			const { code: restoreCode } = await pi.exec("git", [
				"checkout",
				stashRef,
				"--",
				".",
			]);

			if (restoreCode !== 0) {
				ctx.ui.notify(
					"Failed to restore worktree snapshot",
					"error",
				);
				return;
			}

			// Clean up: remove our stash from the stash list
			await dropStashByMessage(pi, `pi-undo-pre-${targetEntryId}`);

			// Remove from in-memory map
			snapshots.delete(targetEntryId);

			ctx.ui.notify("Undone changes from previous prompt", "success");
		},
	});

	// ── Cleanup on shutdown ──────────────────────────────────────
	pi.on("session_shutdown", async () => {
		snapshots.clear();
	});
}

/**
 * Find a stash by message prefix in `git stash list` and drop it.
 */
async function dropStashByMessage(
	pi: ExtensionAPI,
	messagePrefix: string,
): Promise<void> {
	const { stdout: stashList, code: listCode } = await pi.exec("git", [
		"stash",
		"list",
	]);
	if (listCode !== 0) return;

	for (const line of stashList.split("\n").filter(Boolean)) {
		if (line.includes(messagePrefix)) {
			const stashRef = line.split(":")[0]; // e.g., "stash@{0}"
			await pi.exec("git", ["stash", "drop", stashRef]);
			return;
		}
	}
}
