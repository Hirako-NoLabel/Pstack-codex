# Benny for OpenAI

Benny retains two cooperating workflows: triage Slack issue reports, then reproduce confirmed defects and prepare a bounded draft fix. This pack is dormant. Installing PStack does not activate automations, connect Slack, create tickets or open pull requests.

1. Point the host at [FOR_AGENTS.md](./FOR_AGENTS.md) and identify the target repository.
2. Merge the pack into `.pstack/automations/benny/`, preserving local edits and destination-only files.
3. Install and verify shared PStack dependencies using the distribution's supported installer. Verify project scope in a fresh task; user-scoped discovery is not proof of project scope.
4. Copy configuration, routing and feature-map templates outside the source-managed pack, for example to `.pstack/benny/`. Keep secrets in a secret manager or environment.
5. Commit operational sources and secret-free configuration before live runs.
6. Follow [setup](./skills/setup-benny/SKILL.md) to verify capabilities and explicitly activate only after a harmless thread-safety test.

## Compatibility

The operational behavior is portable, but live Slack, tracker compensation, native Slack-event triggers, app-control recording and draft-PR integrations are **Untested**. A host without a required capability must stop the affected workflow. Scheduled polling is not equivalent to a native event trigger. ChatGPT Work support depends on actual tool exposure; plain ChatGPT cannot execute this pack merely by reading it.

## Protocol helper

[protocol.mjs](./scripts/protocol.mjs) implements pure local gates for normalized triggers, immutable coordinates, trusted verdicts, idempotent claims, compensation planning, proof-gated drafts and worker fallback. Run `node --test automations/benny/tests/protocol.test.mjs` from the plugin directory. It does not call Slack or any tracker. Persistent claims require adapter-provided atomic storage; passing these tests does not certify a live deployment.

Trigger schema: `{source_channel_id, message_ts, thread_ts}`; an empty thread_ts selects message_ts. External adapters must normalize their own event payload to this schema. Never guess alternate field names inside the operational workflow. Resolve `${TEMP}` to the operating system's temporary directory in the adapter, not by committing a machine-specific path.
