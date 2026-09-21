---
name: swarm
description: "Fan out N parallel workers, drain them, and return one report. Use for $swarm, 'swarm this', or parallel coverage, races, gauntlets, and exploration."
---

# Swarm

Read the [OpenAI runtime contract](../../references/openai-runtime.md) before using host tools. Its capability checks govern the platform-specific steps below. Preserve the workflow when a tool is absent, record the limitation, and never invent a tool, model, history source, or successful verification.

Fan out N parallel workers. They may cover separate slices, race the same brief, or mix both. The parent waits, aggregates, and returns one report.

## Start

Open a todolist with one entry per phase before launching anything.

1. Frame
2. Fan out
3. Aggregate
4. Report

## Phase A: Frame

1. State the done predicate and the artifact or report the swarm must return.
2. Choose the shape. Partition into slices, race N workers on identical briefs, or mix both. For a race or mixed shape, declare `first pass`, `rank all`, or `best-of` before spawning.
3. Set N from the user or derive it from the shape. N is total workers, not the cloud concurrency limit.
4. Pick the worker model from `roles.swarm_workers` in `.pstack/config.json` when present. Otherwise use `inherit-parent`. For a model race, name each arm's model up front.
5. Give each worker its own writable output when it writes.

## Phase B: Fan out

Use native subagents and schedule all N workers within host capacity. Give writers isolated worktrees. The upstream cloud-worker environment and base-branch arguments are not OpenAI subagent parameters. Use cloud execution only if the host exposes a verified capability and the user authorized it; otherwise use local workers when feasible and disclose partial cloud compatibility. Do not create user-visible tasks to simulate internal workers. Resolve a requested starting branch in the actual checkout.

Every brief stands alone. Include the goal, scope, exact slice or race arm, how to verify, and what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence.

If a worker drops out, proceed with N-1 and note it.

## Phase C: Aggregate

Read the terminal results. For coverage, every required slice needs a result. For a race, apply the selection rule declared up front. Use first pass, rank all, or best-of. Do not paste raw worker dumps.

Keep a compact result table, one-line evidenced issues, and explicit gaps or dropouts.

## Phase D: Report

Return one consolidated in-chat report with the table, issue one-liners, gaps or dropouts, and the race rule when used.

