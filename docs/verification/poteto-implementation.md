# Poteto implementation and verification

Owned scope: `outputs/pstack-openai/plugins/pstack-openai/skills/poteto-mode/**` only. Upstream audit is in `work/audit-playbooks.md`.

## Implemented

- All 23 original playbooks retained with complete workflow bodies, principles and output contracts. Host/runtime boundary added, model routing defaults to inherit-parent, actual subagent fields only, no user-owned task substitution, optional cloud/scheduler behavior, scoped authorization before external actions.
- Poteto SKILL metadata is OpenAI skill frontmatter plus agents/openai.yaml. Every original task category and principle remains. Config uses actual setup-pstack roles/panels and reasoning_effort.
- PR and merge workflows are conditional on authorization. Investigation stays read-only. Autonomous runs no longer authorize unrelated fixes or outbound messages. Existing user grants remain effective.
- Ten live scenario lanes remain in multi-phase planning; specific Grok slug and ten-concurrent-cloud-machine claims removed. Installed workflow paths replace invalid assumptions that the user's repository contains PStack sources. Plan validator and full template updated together.
- Typed Bun watcher, policy state machine, renderers, schema and test suite retained. Added cycle protection in stack ancestry traversal with a regression test.
- Orchestration plain TSV/JSON/MD store, lock recovery, inbox drain, ledger, standing orders, gates, status output and CLI/exit contracts retained. Graphite-specific frontier replaced with `gh` base/head chain provider and explicit frozen PR list. It refuses cycles, ambiguous branches, missing or reversed PRs, invalid source data and discovery limit saturation. It uses remote head SHAs and survives merged-parent retargets.
- Removed Bash fake gt / Unix PATH / true-command test dependencies. Cross-platform provider fixtures cover the replacement; real store and subprocess CLI tests remain.
- Added Node worktree auditor with NUL Git parsing, spaces/Unicode support, tracked/untracked/ignored protection, active/locked/read-error gates, real merge proof, optional disk-size and PR lookup, age/remote status. It never deletes, prunes or fetches. Original `.sh` path remains as forwarding wrapper. Simulator and Cursor-cache cleanup remain documented conditional capabilities, not indiscriminate Codex-state deletion.
- Added script usage/limitations README and expanded type checking to include orch.

## Actual runs on Windows

- Bun 1.4.2: `bun test orch watch-pr` => **57 pass, 0 fail, 219 assertions**. Log `work/poteto-bun-tests.log`.
- `bun run typecheck` => exit **0**, full scripts/ orch/ watch-pr coverage. Log `work/poteto-typecheck.log`.
- Node `--test worktree-audit.test.mjs check-plan.test.mjs` => **7 pass, 0 fail**. Log `work/poteto-portable-tests.log`.
- Final worktree auditor after adding preserved size/age/remote/PR fields: **4 pass, 0 fail**, including real temporary Git worktree under a path with spaces and Chinese characters, unchanged file and worktree inventory assertions. Log `work/poteto-worktree-final.log`.
- Extracted the actual multi-phase plan template and ran check-plan => **1 PR sections, 0 problems**. This supplements positive/negative fixture tests.
- Initial tests found a missed CRLF string replacement in the adapter wiring and its fixture injection; fixed before final successful runs.

## Not claimed

No live GitHub PR lifecycle, authenticated gh frontier, Origin, actual cloud VM, scheduler restart, different-model panel, macOS/Linux native run or ChatGPT Work execution was performed by this worker. Scripts tests are deterministic fixtures plus Windows local Git. The Bash forwarding wrapper has not been executed on macOS/Linux. The upstream watcher READY semantics and finite query limits are explicitly documented; READY is not a merge permission.

Parent should include these distinctions in compatibility and migration matrices, keep node_modules out of source deliverables, and run its final installer/discovery/native-agent integration checks.
