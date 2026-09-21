# PStack for OpenAI maintenance

Preserve upstream engineering behavior and original MIT attribution. `upstream/pstack` is an immutable audited snapshot; never edit it in place. Runtime code lives in `plugins/pstack-openai`. Every changed or added upstream capability must have a migration-matrix row and evidence status.

Use native subagents for concrete independent audit, implementation and review scopes when useful; keep write ownership disjoint. Review their actual artifacts. Inheritance is the default model policy. Never claim a host or service was tested from a simulated test alone.

Run `node --test tests/*.test.mjs` for project tooling and the bundled Bun test suite for changed orchestration/watcher code. Validate plugin/skills before release. Do not activate automations or publish external artifacts as part of tests. Keep fixture homes and secrets outside the plugin.
