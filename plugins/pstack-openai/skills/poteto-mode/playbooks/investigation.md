Read [OpenAI runtime](../../../references/openai-runtime.md) before executing. Host instructions, user scope, and existing authorization take priority. Role models and reasoning effort come from `.pstack/config.json` (`roles` and `panels`); the default is `inherit-parent`. Use only available subagent tools and supported fields; never create a user-owned task to simulate a subagent. Parallel lanes may run in bounded waves. Cloud isolation, different model families, scheduling, and transcript access are conditional capabilities, not promises. External messages, publishing, and merges require authorization for that action. A workflow mentioning PR creation runs that stage only when publication is authorized; otherwise finish and verify locally and prepare the reviewable change. Do not expand task scope to unrelated fixes. Missing live tools or evidence means blocked/untested, never PASS.

### Investigation

**You own the answer. Plan, route, write.**

Investigation requests are read-only. They produce a cited explanation or a recommendation, not a code change.

1. Route through the **how** skill. For motivation questions, also route through the **why** skill.
2. Throughput checkpoint stays one line: `throughput checkpoint: n/a, read-only investigation`.
3. Produce the `how`-shaped output (Overview / Key Concepts / How It Works / Where Things Live / Gotchas), or a recommendation with a tradeoffs table if the request is a decision between alternatives.
4. Apply the **unslop** skill to the reply.

No PR, no babysit, no `architect` unless the investigation precedes a code change. If it does, hand back to the user and re-route to Bug fix or Feature.

**Reply:** the investigation output. For "are we sure?" answers, include your real judgment with reasons. Push back if the premise is wrong (see Autonomy).
