Read [OpenAI runtime](../../../references/openai-runtime.md) before executing. Host instructions, user scope, and existing authorization take priority. Role models and reasoning effort come from `.pstack/config.json` (`roles` and `panels`); the default is `inherit-parent`. Use only available subagent tools and supported fields; never create a user-owned task to simulate a subagent. Parallel lanes may run in bounded waves. Cloud isolation, different model families, scheduling, and transcript access are conditional capabilities, not promises. External messages, publishing, and merges require authorization for that action. A workflow mentioning PR creation runs that stage only when publication is authorized; otherwise finish and verify locally and prepare the reviewable change. Do not expand task scope to unrelated fixes. Missing live tools or evidence means blocked/untested, never PASS.

### Pause safely

**You own a clean stop. Leave a checkpoint a cold-start agent can resume from.** This is explicit only. On "keep going", "going to bed, keep going", or "don't stop", do not pause.

1. Stop at a safe boundary. Finish the current atomic step or back out of it. Never stop mid-edit in a known-broken state. Start nothing new, and cancel any nested subagents.
2. Take no irreversible action to pause. No PR and no push unless you already had one out.
3. Make the work durable. Preserve only this task's edits in an authorized `wip:` commit or a durable patch/checkpoint. Do not stage unrelated user changes. If the tree is broken, say so in the commit body in one line.
4. Write the resume note off-context. Capture intent, what you were doing, progress and what's verified, current state, next steps, key files, and gotchas. For the compaction trigger write it to a durable project checkpoint such as `.pstack/resume.md` (outside temporary directories). If a show-me-your-work trail exists, point at it instead of duplicating it.

**Reply:** where you are in the loop, what's on disk versus still in your head (paths, no diff dumps), the commits you made and whether the tree is clean, and the first action on resume. This is a pause, not a final report.
