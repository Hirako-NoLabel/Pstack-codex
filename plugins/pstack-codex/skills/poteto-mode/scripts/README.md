# Poteto tools

These are local engineering tools. They do not spawn agents, schedule future work, post comments, or merge PRs.

From this directory, install the pinned dependencies with `bun install --frozen-lockfile`. `orch/orch.ts` and `watch-pr/watch-pr` also bootstrap the same lockfile on first use. Bun, Git and an authenticated GitHub CLI are needed for live GitHub reads. The portable auditor and plan checker need only Node.js (and Git for the auditor).

- `bun orch/orch.ts --store <state-directory> init` initializes the plain-file store.
- `bun orch/orch.ts --store <state-directory> unit add <id> --track <track>` adds a work unit.
- `bun orch/orch.ts --store <state-directory> frontier set --repo <repo> --prs <bottom-to-top-numbers>` records the GitHub frontier. The explicit list survives merged-parent retargeting. Without `--prs`, discovery starts at the current branch and refuses ambiguous forks or cycles. No Graphite installation is needed.
- `bun orch/orch.ts --store <state-directory> ledger record <pr> <sha> <verdict> --evidence <file>` records a verdict. The record is bookkeeping, not proof that a test ran.
- `bun orch/orch.ts --store <state-directory> status` renders the durable status page. Use `--help` on any command for the full units, inbox, gates, standing-orders and ledger interfaces.
- `bun watch-pr/watch-pr --owner <owner> --repo <repo> --pr <number> --status-only` reads current GitHub status once. Exit zero here means the read succeeded, not that the PR can merge.
- `bun watch-pr/watch-pr --queued-stack --stack-prs <numbers> --timeout <seconds>` watches an immutable queue. The default has no deadline, so prefer an explicit timeout for bounded host jobs. NDJSON is the default; add `--pretty` for a table.
- `node worktree-audit.mjs --repo <repo> --base <verified-trunk-ref> --size` audits actual Git worktrees with space/Unicode-safe paths. Add `--with-prs` for a read-only GitHub query. Add `--active-file <JSON-file>` only with a verified list of active/pinned worktree paths. Missing usage evidence, tracked/untracked/ignored files, active or locked worktrees are held. The tool never deletes, prunes, or fetches. The `.sh` entry point forwards to this portable implementation.
- `node check-plan.mjs <plan.md>` checks the complete multi-PR plan contract, including ten independently specified live scenarios, screenshots and pass predicates, perf baseline and review gates. It does not require a specific model or ten concurrent machines.

`bun test orch watch-pr`, `bun run typecheck`, and `bun run test:portable` run deterministic tests. Type checking covers both orchestration and watcher code. The worktree test creates a real temporary Git repository with spaces and Unicode in its path. Fake GitHub fixtures do not demonstrate live GitHub access.

## Known boundaries

The watcher preserves the upstream GitHub policy and event schema. It supports github.com, not an untested enterprise or Origin API. Review threads are limited to the first 100, commit-history checks to 50 and automatic stack discovery to 300 open PRs. The separate orchestration adapter refuses an unpinned discovery result at its 1000-PR limit. Use explicit queue lists for larger programs.

`READY` is the watcher's engineering verdict, not merge authorization or proof that every host-specific gate is satisfied. The upstream policy excludes `Code Review Gate` from pending checks and permits certain unknown merge states. Shipping therefore rechecks the active forge's actual mergeability, current SHA, independent verdict, CI and user authorization. External tools and host schedulers remain conditional capabilities.

The port replaces upstream Graphite text parsing with GitHub base/head-chain data. All other orchestration state contracts remain plain files. The old Graphite dependency is recorded as a replaced integration rather than silently required.
