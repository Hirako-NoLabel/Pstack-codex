Read [OpenAI runtime](../../../references/openai-runtime.md) before executing. Host instructions, user scope, and existing authorization take priority. Role models and reasoning effort come from `.pstack/config.json` (`roles` and `panels`); the default is `inherit-parent`. Use only available subagent tools and supported fields; never create a user-owned task to simulate a subagent. Parallel lanes may run in bounded waves. Cloud isolation, different model families, scheduling, and transcript access are conditional capabilities, not promises. External messages, publishing, and merges require authorization for that action. A workflow mentioning PR creation runs that stage only when publication is authorized; otherwise finish and verify locally and prepare the reviewable change. Do not expand task scope to unrelated fixes. Missing live tools or evidence means blocked/untested, never PASS.

### Visual parity

**You own pixel-exact equivalence. The baseline is the spec. You do not touch it.** Equivalence is verified by image diff, not by eye.

1. Establish the baseline first, before any migration: a visual regression harness that screenshots the current component across its states, plus the target when matching two implementations. No baseline, no parity claim. A blocking prerequisite, not a follow-up.
2. Anti-shortcut clauses, stated and held: no harness modifications, no baseline tampering, no component restructuring to make a diff pass. If the baseline looks wrong, stop and ask, don't edit it.
3. Migrate one component at a time. Parallelize across worktrees, one owner per component (the **separate-before-serializing-shared-state** principle skill). Shared primitives migrate first as a blocking phase.
4. Verify each component against its baseline via image diff on the matching surface via the control skill. A nonzero diff is a fail. Investigate the pixel delta. Iterate with bounded host waits per component until the diff is zero.
5. Run **Opening a PR** per component or per safe batch.

**Reply:** components migrated, the diff result for each, the baseline harness location, what's left.
