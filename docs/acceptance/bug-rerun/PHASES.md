# Bug fix acceptance phases

1. Reproduce it yourself on the matching surface via the control skill (Non-negotiables). Don't hand the repro to the user. A debug or instrumentation protocol that says to ask the user does not override this. You drive the instrumented runtime. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. Won't reproduce directly, force it: synthesize the trigger, tighten conditions, or instrument until it fires.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Seed them with `how` over the affected subsystem and the **why** skill for regression history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess. Drive a long or stubborn hunt with the available host scheduling or event-wait capability. Confirm the surviving *mechanism* with runtime evidence before the step-3 architect/interrogate fan-out.
3. Plan the fix. If it crosses a function boundary, `architect` first. Delegate implementation to a subagent using your configured bug-fix model (default `inherit-parent`) with a specific scope. Review the diff.
4. Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing repro lands before the fix in git history. See the **tdd** skill for the failing-test-first cadence when the bug has a cheap local test path. Skip it when the test would be expensive, integration-heavy, or unclear.
   This is the canonical **sequence-verifiable-units** principle skill, the failing test first and the fix on top.
6. Run **Opening a PR**.


## Task-specific checkpoint

Done when duplicate-key loader repro is red before the fix, green after, and independent review evidence is saved. Scope is this clone only. Native agents are available with two worker slots. Model routing inherits parent. CLI is the real fixture surface. No external publication, network, messages, automation, or global configuration.

Throughput checkpoint. Lead owns reproduction and review. Parallel read-only how and why lanes feed a single scoped coding worker. The report persists decisions, receipts, and limits.


Swarm phases. 1. Frame. 2. Fan out. 3. Aggregate. 4. Report. Two read-only coverage lanes own runtime explanation and baseline history. No race. Both results required.
Data shape before implementation. Each createLoader instance owns a Map from key to its pending promise. Settled values do not remain cached. CLI control maps to the real terminal per runtime; no bundled control-cli leaf is present.

## Completion states

1. complete. Lead terminal repro is receipts/red-contracts.json.
2. complete within local-only scope. Native how, why investigator, and why synthesis results are saved in evidence.
3. complete. Delegated code is dafea6b. Lead reviewed actual diff. architect skip: original createLoader boundary retained.
4. complete. Lead terminal verification is receipts/green.json.
5. complete. Failing test commits a3ddc76 and e9b1de4 precede fix dafea6b.
6. complete locally. PR-BODY.md is prepared. publication skip: explicitly excluded by scope.

Swarm coverage lanes both returned. Generic Swarm phase-name list was recorded after fan-out, a retained leaf timing limitation.
