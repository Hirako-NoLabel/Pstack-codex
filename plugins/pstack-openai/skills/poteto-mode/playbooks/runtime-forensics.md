Read [OpenAI runtime](../../../references/openai-runtime.md) before executing. Host instructions, user scope, and existing authorization take priority. Role models and reasoning effort come from `.pstack/config.json` (`roles` and `panels`); the default is `inherit-parent`. Use only available subagent tools and supported fields; never create a user-owned task to simulate a subagent. Parallel lanes may run in bounded waves. Cloud isolation, different model families, scheduling, and transcript access are conditional capabilities, not promises. External messages, publishing, and merges require authorization for that action. A workflow mentioning PR creation runs that stage only when publication is authorized; otherwise finish and verify locally and prepare the reviewable change. Do not expand task scope to unrelated fixes. Missing live tools or evidence means blocked/untested, never PASS.

### Runtime forensics

**You own the diagnosis. Instrument the live process, don't theorize from source.** The deliverable is a cited diagnosis, not a fix.

1. Capture the live signal on the matching surface via the control skill: a CPU profile for a spinning process, a heap snapshot for a leak, a CDP trace for a visual glitch. A real artifact, not a guess.
2. Reduce the artifact to the smoking gun: the function on the hot path, the retainer chain from the leaked object to a GC root, the loop firing without input. Parse large artifacts in a subagent (the **guard-the-context-window** principle skill), keep the reduced finding in the main thread.
3. Prove the mechanism before believing it. Inject instrumentation via CDP eval on the running process, or hotfix the live code without reloading, to confirm the hypothesis cheaply.
4. Map the finding back to source: file, symbol, the line that allocates or schedules.
5. Throughput checkpoint stays one line: `throughput checkpoint: n/a, read-only forensics`.

**Reply:** the signal captured, the reduced finding, how you proved the mechanism, the source location, artifact paths. No fix unless asked. Hand back to Bug fix or Perf once the cause is known.
