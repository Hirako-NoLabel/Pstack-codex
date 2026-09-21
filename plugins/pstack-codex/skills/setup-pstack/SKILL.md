---
name: setup-pstack
description: Configure PStack agent roles, optional verified models, reasoning budgets, and review panels for the current OpenAI host.
---

# Setup pstack

Read the [OpenAI runtime contract](../../references/openai-runtime.md). Write project-local `.pstack/config.json`, which PStack reads explicitly. This is PStack configuration, not a Codex configuration schema or an automatically applied global rule.

## Detect capabilities

Inspect the native subagent tool schema and its advertised model and reasoning choices. A skill cannot force the parent chat's model. Never invent a model slug or concatenate a reasoning suffix. If the host does not expose model routing, inherit the parent and record role routing only. `inherit-parent` and `auto` both omit model and effort overrides. Optional native custom-agent templates live in `../../agents/`; they are not automatically registered by the plugin.

## Load and choose

Read an existing `.pstack/config.json`; otherwise use the helper's defaults. Keep customized model families, role choices and panel sizes on reconfiguration. Ask for a budget using the host's supported question format:

- `unlimited — keep max`: preserve each explicit route's current effort; this does not manufacture a maximum the host lacks.
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

For an explicit model, choose the highest advertised effort at or below the target. Keep inherited entries inherited. If no such effort exists, surface the role needing a choice. Show every resulting role and panel before saving the user's selected mapping. Do not repeatedly ask for approval when the requested mapping is already explicit.

The roles are `feature`, `refactoring`, `bug_fix`, `perf_issue`, `hillclimb`, `judgment_and_prose`, `hardest_tasks`, `how_explorer`, `how_explainer`, `why_investigators`, `why_synthesizer`, `reflect_tooling`, `reflect_judgment`, and `swarm_workers`. Reflect judgment also supplies divergent and synthesizer roles.

Panels are `arena_runners`, `arena_cross_judge_pool`, `architect_runners`, and `interrogate_reviewers`. Runner/reviewer list length sets total candidates, not concurrent slots. Aliases still count. Arena chooses one cross-judge entry, preferring a different verified family when available. Default panels contain four inherited entries. Schedule waves within host capacity. Swarm workers inherit their role unless a configured race arm explicitly overrides it.

Each route is `{ "model": "inherit-parent" }` or an explicitly verified `{ "model": "actual-host-model", "reasoning_effort": "high" }`. Model and effort are separate. The document has `version: 1`, `budget`, `roles`, and `panels`.

## Validate and save

Initialize a fresh project with inherited defaults:

```sh
node "<skill-root>/scripts/configure.mjs" --repo "<repo>"
```

For an explicit configuration, prepare a JSON input and a capability JSON mapping each actually advertised model ID to its supported efforts. The capability file is evidence supplied by the current host, not a way to invent availability.

```sh
node "<skill-root>/scripts/configure.mjs" --repo "<repo>" --input "<chosen-config.json>" --available "<host-models.json>" --budget medium
```

The helper validates routes, preserves aliases, selects supported budget effort, and atomically replaces the project configuration. Re-running without `--input` loads the current mapping. Explicit models require fresh availability evidence. Read back the written file and report what will apply at the next PStack invocation. The same Node command works in PowerShell and POSIX shells when paths are quoted.

## Optional verification skill

Check for a project `verify-*` skill or real application harness. If none exists, offer `$create-verification-skill` once. Generate it only when requested. Do not claim discovery or runtime compatibility merely because files were written.
