# Verification report

Date: 2026-09-22. Primary host: Windows, Codex CLI **0.155.0-alpha.9.2**, Node **24.12.0**, Bun **1.4.2**. This is a tested release candidate, not certified 1:1 parity across all platforms. GitHub publication has not been authorized yet.

## Results

| Check | Actual result | Evidence and limit |
|---|---|---|
| Full upstream inventory | 158/158 files retained with SHA-256 lock | `upstream.lock.json`; `node scripts/validate.mjs` |
| Main skill/playbook inventory | 47 skills, 23 playbooks; 2 role agents; 3 dormant Benny skills | Source and migration catalog. No upstream counterpart omitted. |
| Official plugin validator | Pass | Bundled plugin-creator validator, PyYAML 6.0.3, all manifests/resources. |
| Official skill validator | 47/47 pass | UTF-8 mode required on this Windows host; not a plugin encoding defect. |
| Markdown links in installed plugin | 197 checked, 0 broken | Templates with verified runtime URLs remain descriptive. |
| Fresh native plugin lifecycle | Pass | New isolated CODEX_HOME in a Chinese/spaced path; actual install, app-server `skills/list` discovers 47 enabled skills, local-source reload, uninstall removes them, reinstall discovers 47. |
| PowerShell wrapper lifecycle | Pass | Real local Git source/clone; 0.1.0 → 0.1.1 fast-forward update, installed cache marker and version checked, uninstall/reinstall, clean tree. |
| Git Bash wrapper lifecycle | Pass after fix | Same real lifecycle on Windows. Initial path-format comparison failed; normalization fixed and failed side rerun. **Not a native Linux/macOS test.** |
| Portable helper tests | 20/20 pass | Context recovery/corruption, upstream diff/staging boundary, configuration/effort validation, TSV injection/lock, plan gates, real worktree audit, Benny protocol. |
| Executable acceptance regression suite | 22/22 pass | Bug Fix 5 + Feature 6 + Architect 11 now run automatically through test-all alongside 20 helper tests (42 total); this reruns fixture behavior, not native agent workflows. Three-OS CI uses this same command but has not executed remotely. |
| Bun orchestrator/watcher tests | 57/57 pass, 219 assertions | Retained upstream domain tests plus gh frontier/cycle adaptation. Mock GitHub reader is not live service verification. |
| Type checks | Pass | Entire poteto scripts tree including orchestrator and watcher. |
| Bug Fix + TDD | Pass on sample | Actual concurrent-loader defect: baseline 2 failures, fixed 5/5. Failing-test commit precedes fix commit. |
| Feature | Pass on sample | Default literal search retained; optional Unicode-insensitive search: baseline 5 failures, fixed 6/6. Actual design comparison included. |
| Read-only investigation / How | Pass on sample | Independent investigator explained Unicode behavior and verified unchanged HEAD/status/diff/file hashes. |
| Review / Interrogate | Partial pass on sample | Independent non-author reviewers executed tests and boundary probes, lead examined results; all inherited the same model. Full upstream cross-family panel not claimed. |
| Architecture | Partial sample | Four independent native candidates in capacity-limited waves, separate judge, parent base/graft synthesis, selected sketch and implementation; 11/11 fixture checks plus non-author review. Same model; conditional scrap not exercised. See docs/acceptance/architect. |
| Recall | Repository fallback passes | Checkpoint write/read/HEAD/AGENTS/history assertions. Native complete chat-history mining not tested. |
| Reflect | Partial sample | Three actual parallel read-only reviewers plus a separate native synthesizer produced Accepted/Rejected/Backlog; exact template substitution verified. Same inherited model, labelled digest, no rule edits or external filing; see docs/acceptance/reflect. |
| Native parallel agents | Pass | Concurrent audit/implementation and separate review agents ran in this actual task. Slot limits respected. |
| Git worktree | Pass on Windows | Real temporary worktree; NUL path parsing, Unicode/spaces, untracked/ignored/dirty/unknown-use protection, no deletion. |

## Reproduce

```sh
node scripts/validate.mjs
node scripts/test-all.mjs
node --test docs/acceptance/bug/loader.test.mjs
node --test docs/acceptance/feature/search.test.mjs
```

In `plugins/pstack-openai/skills/poteto-mode/scripts`:

```sh
bun install --frozen-lockfile
bun test orch watch-pr
bun run typecheck
```

For a disposable real Codex installation test:

```sh
node scripts/test-native-host.mjs /absolute/path/to/codex /temporary/evidence-directory
node scripts/test-wrappers.mjs --codex /absolute/path/to/codex --pwsh /absolute/path/to/pwsh --bash /absolute/path/to/bash --work /temporary/wrapper-evidence
```

The native tests isolate CODEX_HOME, not the user's real installed plugins. Wrapper fixtures use only local Git sources. Do not mistake their successful local update for a remote GitHub marketplace fetch.

## Findings fixed before delivery

- Native local marketplace sources reject the Git-only upgrade command; local update now re-registers the local source after fast-forward pull.
- Windows Git Bash returns Git roots in a different path notation from `pwd`; normalize both before comparing.
- Update refuses to pull an enclosing unrelated Git repository.
- Upstream stage rejects recursive destinations before mutation; fetch/stage refuse preserved snapshot destinations.
- Corrupt old checkpoint reports an error but no longer prevents an explicitly requested valid replacement.
- Official agent UI metadata requires an interface object; all bundled entries validated after correction.
- Benny source link rejects invalid/non-HTTPS/credential-bearing forms; connector must still verify actual thread ownership.
- Removed residual Cursor loop/store instructions, hard-coded temporary paths, unsupported paths metadata advice, and extensionless Windows watcher invocation.
- Explicit conversational stickiness and mandatory poteto delegate orientation restored; verified local commits have a precise Recall status tag.

## Remaining verification gaps

No native macOS or Linux host was available. The three-OS GitHub Actions workflow is supplied but has not run before publication. ChatGPT Work/ordinary Chat were not installed or executed live. No live gh authentication/PR queue/merge, multi-family model panel, cloud VM fleet, scheduler restart, complete-history mining, personal-mode generation, real UI recording/pixel comparison, profiler workload, or live Benny Slack/tracker/event integration was exercised.

All 75 named source entries were audited and packaged. **11 entries received sampled agent workflow execution; 64 have no sampled full workflow run.** Helper tests and discovery do not erase that gap. **0 entries are certified complete 1:1 parity across all target hosts.** Detailed A/B/C/D architectural counts and every non-complete entry are in MIGRATION_MATRIX.md.

Initial sample-run deviations are retained in the acceptance reports: the Bug Fix worker did not copy the todo steps before execution; architecture/reflection initially used sequential lenses under occupied slots. These are evidence of sampled workflow limitations, not reasons to label the port fully equivalent. Subsequent independent read-only review substantiated fixture correctness, not perfect compliance with every instruction.

Evidence is under `docs/verification` and `docs/acceptance`. Audit/implementation reports are historical receipts; where they name an initial failure or subsequently corrected text, this report and the final source describe the current result.
