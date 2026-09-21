# Independent tooling review

Reviewed root install/update/uninstall PowerShell and shell wrappers, scripts/upstream.mjs, plugins/pstack-openai/scripts/context.mjs, scripts/test-native-host.mjs, and Benny protocol helper. No reviewed files changed. Findings focus on concrete behavior and bounded recovery.

## Findings

### P2 — update can pull an enclosing unrelated repository

Files: update.ps1:3–7 and update.sh:4–6.

Both wrappers run `git -C <script directory> diff` and `pull` without checking that directory equals `git rev-parse --show-toplevel`. Git searches ancestor directories. If a downloaded/extracted distribution is inside another clean Git repository (an ignored vendor/output folder is a realistic case), the checks pass for that ancestor and the wrapper pulls that repository instead of PStack. Fail before any mutation unless the resolved Git top-level equals the distribution root. A local copy that is not its own checkout should receive a clear update instruction rather than modifying its parent.

### P2 — upstream stage mutates its source before rejecting a nested target

File: scripts/upstream.mjs:45–46.

`stage SOURCE SOURCE/review` inventories SOURCE, creates SOURCE/review, then cpSync rejects copying into a subdirectory of itself. Reproduced with work/probe-tooling.mjs: exit 1 and source entries changed from file.md to file.md + review. This breaks the read-only source expectation and poisons later source inventories with a failed review directory. Resolve paths and reject same/nested target before mkdir. Also enforce the documented fetch boundary against writing a new checkout under the preserved upstream snapshot; currently `fetch` only checks nonexistence, despite its error message requiring a path outside the snapshot.

### P2 — a malformed prior checkpoint prevents saving a valid replacement

Files: plugins/pstack-openai/scripts/context.mjs:35,48.

`checkpoint()` calls `snapshot()`, which parses the existing state even though checkpoint only needs repository root, HEAD and branch. A truncated or hand-edited invalid state.json therefore makes every subsequent valid checkpoint fail. Reproduced with a one-character `{` state and a valid new checkpoint object; parser error occurs before writing. Preserve/report malformed old state, but derive Git metadata independently so an explicitly requested new checkpoint can recover. Do not silently treat corrupt state as valid recall evidence.

### P2 — Benny ticket gate accepts a source link that cannot link back

File: plugins/pstack-openai/automations/benny/scripts/protocol.mjs:69–73.

`ticketGate` checks only that sourcePermalink is nonempty. Reproduced: `sourcePermalink: 'not a url'` with all other gates true returns true. The operational contract prohibits a ticket that cannot link to its source thread. Validate an absolute HTTPS URL (no embedded credentials) and have the integration adapter verify it belongs to the resolved source. Do not hard-code a Slack tenant domain in the pure helper.

## Checked and not findings

- Marketplace name collision: current CLI rejects a second local source named personal with exit 1 and preserves the original source. Tested with a fresh isolated CODEX_HOME using work/probe-marketplace.cjs. Existing wrappers stop on this failure, so no extra collision bug is reported.
- update checks both staged and tracked unstaged changes; Git itself refuses untracked overwrite conflicts. No unsafe-force pull exists.
- install/uninstall argument passing is structured and quoted for spaces; current Windows host exposes a native codex.exe, so direct Node spawning works here. Unix execution still needs actual shell/platform validation; do not describe syntax review as a macOS run.
- upstream inventory explicitly rejects symlinks and excludes .git/node_modules; check and stage do not advance lock or overwrite derivative code. The issue is boundary preflight, not automatic syncing.
- context uses an exclusive temporary file and rename, rejects linked state directory/file, and validates required input fields. It does not claim full task-history access.
- native-host test uses isolated CODEX_HOME, checks installed skill names/enabled state, uninstall disappearance and reinstall count. Its recorded scope correctly excludes remote GitHub fetching and model workflow execution. No additional blocker found in normal tested native-executable use.
- Benny immutable source, trusted single marker, duplicate claim, compensation decision, no-proof/no-existing-fix draft gates and isolation fallback have seven passing tests. Claims are an in-memory primitive only; README explicitly requires persisted atomic integration storage. No claim that unit tests verify Slack/UI operation.

## Evidence

- work/probe-marketplace.cjs: independent personal-source collision, second add rejected, original marketplace retained.
- work/probe-tooling.mjs: nested stage, corrupt checkpoint, invalid permalink cases; all reproduced as described.
- No Slack/tracker messages, PRs, live automation activation or global Codex configuration were used.
