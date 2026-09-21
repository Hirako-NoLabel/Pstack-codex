# Automation and guide implementation

Owned output scope: `outputs/pstack-openai/plugins/pstack-openai/automations` and `docs` only.

- Retained the complete dormant Benny pack, triage, reproduction, existing-fix verification, feature map, routing map and control-adapter details.
- Replaced Cursor setup/settings/editor flow with capability-checked OpenAI host setup. Installation alone never activates external integrations. Missing native Slack events, live Slack/tracker/UI recording/draft-PR capabilities remain explicit Untested/Unsupported conditions.
- Normalized all operational triggers and templates to `{source_channel_id,message_ts,thread_ts}`. Kept exact source root freezing, trusted markers, no-root-retry, ownership, twice-before/twice-after proof and draft-only gates.
- Added `automations/benny/scripts/protocol.mjs`, a pure local helper. It has no network, no SDK dependency, no fictional Slack API. Provides immutable source, parent preflight, thread-only envelope, trusted marker parser, per-workflow claim keys, ticket/compensation gates, draft proof gate and enforced isolation fallback.
- Added seven Node behavioral tests, 7 passed / 0 failed. Covered wrong/deleted/inaccessible parent, untrusted/multiple markers, replay idempotence, missing compensation, failed handoff, no-proof/no-competing-draft, and coordinator fallback when isolation is uncertain.
- The claim helper uses caller-supplied Set only; README explicitly requires atomic persisted claims in a real adapter. Offline protocol tests do not certify event delivery or external mutations.
- Adapted all 11 guide Markdown files. Codex `$skill` invocation; conditional ChatGPT Work `@skill`; native marketplace installation link; role inheritance default; supported override only; explicit scheduler/goal capability and context/tool limits; accessible evidence alternatives for history; no false `/loop` or Cursor settings instructions.
- Preserved six guide illustrations as decorative upstream assets. Their artwork may show upstream command labels; text specifies the OpenAI invocation contract.
- Relative Markdown link check: 132 local links, 0 missing targets.
- No live automations created, no Slack messages, tracker issues, PRs, or secrets configured.

Validation commands:

```
node --test outputs/pstack-openai/plugins/pstack-openai/automations/benny/tests/protocol.test.mjs
node work/check-automation-links.cjs
```

Shared runtime reference is owned by root agent. Final global validation should include these seven tests in addition to other suites.
