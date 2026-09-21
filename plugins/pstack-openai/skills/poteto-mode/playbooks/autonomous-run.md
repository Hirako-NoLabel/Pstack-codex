Read [OpenAI runtime](../../../references/openai-runtime.md) before executing. Host instructions, user scope, and existing authorization take priority. Role models and reasoning effort come from `.pstack/config.json` (`roles` and `panels`); the default is `inherit-parent`. Use only available subagent tools and supported fields; never create a user-owned task to simulate a subagent. Parallel lanes may run in bounded waves. Cloud isolation, different model families, scheduling, and transcript access are conditional capabilities, not promises. External messages, publishing, and merges require authorization for that action. A workflow mentioning PR creation runs that stage only when publication is authorized; otherwise finish and verify locally and prepare the reviewable change. Do not expand task scope to unrelated fixes. Missing live tools or evidence means blocked/untested, never PASS.

### Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.**

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero).
2. Pick the wake mechanism using the available host scheduling or event-wait capability (see OpenAI runtime). An event to watch (CI, a merge, a ref advancing) gets a watcher subagent that wakes you on the event, with a long time-based heartbeat as fallback. No event gets a fixed-interval heartbeat sized to when the result is worth re-checking.
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if it advanced, discards changes that didn't help. Belt-and-suspenders that "might help" gets reverted, not left to ride.
   Sequence the work via the **sequence-verifiable-units** principle skill, verifying each unit before the next instead of batching checks at the end.
4. Mid-run discoveries are yours. Address in-scope blockers through poteto-mode. Record unrelated bugs and improvements as follow-ups; obtain scope authorization before implementing or publishing them. Do not park reversible work for the human or use a user question. Surface only irreversible actions, genuine product or preference calls no experiment can settle, or a real dead end. Keep the predicate as the main drive, and return to it after each side fix.
5. Checkpoint every iteration via the **show-me-your-work** skill, a row for what changed and whether the predicate moved.
6. Stop when the predicate is met. A plateau is not a stop, so keep going and pivot your approach to push past it. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state.
