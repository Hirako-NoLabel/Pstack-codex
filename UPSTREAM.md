# Upstream provenance and synchronization

- Upstream: [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack).
- Audited commit: `6ed0f7a9504f577d7529064103cecce9be7dfc5e`.
- Upstream manifest version: `0.15.2`.
- Intended OpenAI repository: `Hirako-NoLabel/pstack-openai` (publication status in VERIFICATION.md).
- Original author and copyright: Lauren Tan, 2026. Original MIT LICENSE is preserved unchanged.

`upstream/pstack` retains every original file, including Cursor metadata, agents, dormant automation, scripts, tests and images. It is a reference snapshot, not the installed plugin. `upstream.lock.json` records each SHA-256 hash. The installable derivative is `plugins/pstack-openai`. Source snapshots retain historical Cursor instructions; never execute them as current OpenAI instructions.

## Detect updates

From the repository root, choose a new temporary destination:

```sh
node scripts/upstream.mjs fetch work/upstream-next
node scripts/upstream.mjs check work/upstream-next/pstack
node scripts/upstream.mjs stage work/upstream-next/pstack work/upstream-review
```

Fetch reads the public GitHub repository. Check reports every added, removed and changed file against the lock. Stage creates a candidate snapshot and changes.json in a new review directory. None of these commands overwrites migrated skills or advances the lock. A nonempty report is a migration review queue, not permission to run upstream instructions.

Hashes use exact Git blob bytes. The preserved snapshot disables checkout text conversion, and fetch configures `core.autocrlf=false`. If checking another checkout, disable newline conversion there or expect newline-only differences on Windows.

## Integrate deliberately

1. Pin the candidate SHA. Read every changed file and newly introduced dependency.
2. Map each change to its derivative counterpart and update the migration matrix. Preserve deleted or unsupported capabilities as explicit migration decisions.
3. Port engineering behavior while keeping the OpenAI host contract. Review source-specific APIs, model IDs, paths, permissions and autonomous actions.
4. Run source-integrity, plugin/skill validation, deterministic and native lifecycle tests. Run the affected workflow acceptance scenario and record what could not be tested.
5. Only then replace the reference snapshot and regenerate its hash lock in a reviewed commit. Preserve licenses and attribution.
6. Bump the derivative version, update CHANGELOG.md and publish only under the repository owner's authorization.

An upstream update and a derivative installation update are different operations. `update.ps1`/`update.sh` only update the OpenAI repository; they never blindly synchronize Cursor code.
