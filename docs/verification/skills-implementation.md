# Skills implementation

Owned scope: `outputs/pstack-openai/plugins/pstack-openai/skills/` excluding `poteto-mode`, plus plugin `agents/`. No parent-owned runtime, installer, manifest or orchestration files changed.

Implemented 46 skills with all 30 reference files retained. Every upstream file in this scope has a corresponding ported file. Skill names equal directory slugs; frontmatter contains name/description; explicit invocation policy is `agents/openai.yaml` (setup retains its upstream implicit eligibility). Invocation examples use `$skill`.

Platform-sensitive workflows link `../../references/openai-runtime.md`. Semantic changes include bounded native agent scheduling, independent same-model fallback with truthful diversity limits, local worktree isolation, documented cloud gap, actual tool discovery, read-only task contracts rather than Cursor readonly flags, project-scoped native history or git/handoff fallback, and review authorization boundaries. Full architecture, source investigation, evidence calibration, principle leaves, review rubrics, TDD discipline, verification-feature examples, technical writing and TypeScript patterns remain.

`setup-pstack/scripts/configure.mjs` owns the PStack project config (not Codex config). Version 1 uses budget, roles and panels. Models and reasoning effort are distinct. Defaults inherit parent. Explicit models require caller-provided actual capability evidence. Budget changes select only advertised effort <= target, preserve inherited aliases and custom panel lengths, then atomically save. Roles: feature, refactoring, bug_fix, perf_issue, hillclimb, judgment_and_prose, hardest_tasks, how_explorer, how_explainer, why_investigators, why_synthesizer, reflect_tooling, reflect_judgment, swarm_workers. Panels: arena_runners, arena_cross_judge_pool, architect_runners, interrogate_reviewers.

`show-me-your-work/scripts/log.mjs` writes append-only TSV with single-line cells, spreadsheet formula escaping, header creation, ISO timestamp and exclusive write lock. A POSIX `log.sh` wrapper delegates to Node. An existing lock fails safely rather than overwriting it; inspect its PID owner after a crash before removing stale locks.

Agent Markdown files are role prompts, not claimed auto-registered agents. Optional TOML templates under `agents/templates/` omit model/effort and require an actual absolute plugin path before deliberate installation. Comment Sicko preserves protected comments, scoped comments-only edits and parent-owned implementation. The default persona greeting is optional under user preferences.

`make-bot-ui` retains the complete UI/server/secret delivery, timeout/no-retry, failure log, Tailscale, untrusted event and proof workflow. Native Cursor routine wake/secret card is explicitly D. A configured external endpoint is a partial substitute, never claimed native wake parity. Local test receiver is permitted but cannot prove external processing.

Verification on Windows Node:

- `node --test .../setup-pstack/scripts/configure.test.mjs .../show-me-your-work/scripts/log.test.mjs`: 3/3 passed.
- Configuration tests exercised fresh install in a path with spaces, supported budget downgrade, save/re-save/readback, alias preservation, and model/effort/panel rejection.
- Log test exercised actual writes/appends, exact stored TSV, formula neutralization, newlines, and exclusive-lock refusal without altering another lock.
- Source inventory comparison: 46 skills, 0 missing upstream files.
- Residual scan for `.cursor`, Cursor Task arguments, hard-coded external model families, `AskQuestion`, `alwaysApply`, `disable-model-invocation`, and `agent-transcripts`: 0 active residuals in non-poteto skills.
- No bash executable was available on PATH. POSIX wrapper and native macOS/Linux execution remain untested here; cross-platform Node logic was executed on Windows only.
- Host skill discovery and actual model panel behavior require parent integration tests. Do not count static metadata as runtime invocation proof.

Intentional upstream behavior adaptations: no-comments no longer deletes an exception-protected constraint merely because encoding approval is absent; external publishing/backlog needs authorization; TypeScript duration example explicitly notes a plain number can be negative. These avoid weakening constraints or claiming unsupported type guarantees while retaining engineering intent.
