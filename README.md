# PStack for OpenAI

A high-fidelity adaptation of [Lauren Tan's PStack](https://github.com/cursor/plugins/tree/main/pstack) for Codex, with explicitly qualified ChatGPT Work support. This is an independent derivative, not an official OpenAI or Cursor product.

The audited upstream is PStack 0.15.2 at `6ed0f7a9504f577d7529064103cecce9be7dfc5e`: **47 main skills, 23 playbooks, 2 agent roles and the dormant Benny automation pack**. All source files and copyright notices are retained. The port keeps the engineering workflows and replaces platform boundaries with real OpenAI mechanisms.

## Start

Install all skills through one repository plugin. See [INSTALL.md](INSTALL.md) for Windows/macOS/Linux, requirements, updates, uninstall and reinstall. After installation, invoke:

```text
$poteto-mode 修复登录偶尔重复请求的问题，先复现，再修复并验证。
```

Poteto routes the request to the appropriate playbook, records its steps, investigates the real behavior, delegates bounded work when useful, verifies the actual result and reviews the diff. Investigation requests remain read-only. `$setup-pstack` configures role/model preferences; inheritance is the default, and only actually available overrides are accepted.

## Included

- Bug fix, feature, refactor, performance, runtime/trace investigation, architecture exploration, review, TDD, UI parity and blinded skill evaluation.
- How/why/teach, recall, reflect, automate-me, clear writing, comment review, verification-skill creation/maintenance and all 23 engineering principles.
- Arena, swarm, role-based review panels, worktree isolation, persistent orchestration records, SHA-bound verification, PR status watcher, autonomous and multi-phase playbooks.
- Portable project context, source-integrity/update tooling, install/update/uninstall wrappers and offline protocol tests for Benny.

See [the complete guide](plugins/pstack-openai/docs/guide/README.md), [migration matrix](MIGRATION_MATRIX.md), [compatibility](COMPATIBILITY.md) and [verification evidence](VERIFICATION.md). Unsupported native bot wake behavior and untested live integrations remain visible. No claim of full ChatGPT Work compatibility is made.

## Layout

```text
.agents/plugins/marketplace.json   official repository marketplace
plugins/pstack-openai/             installed plugin and all runtime resources
upstream/pstack/                   immutable original reference snapshot
docs/audit/                       full source audit
scripts/                          integrity, validation and upstream review
tests/                            portable lifecycle/context tests
```

The nested plugin directory follows the official generated marketplace layout. `skills/` is intentionally inside the plugin so installation includes its references and scripts. There is no second source of truth to keep in sync.

## Maintain

```sh
node --test tests/*.test.mjs
node scripts/validate.mjs
```

Run the additional bundled Bun tests described in INSTALL.md when changing the orchestrator/watcher. [UPSTREAM.md](UPSTREAM.md) describes pinned snapshots and a review-first sync process. [CHANGELOG.md](CHANGELOG.md) records derivative changes. The original [MIT license](LICENSE) and attribution remain intact.
