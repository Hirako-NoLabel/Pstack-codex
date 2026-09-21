# PStack automation, documentation, metadata audit

Scope: local upstream snapshot `work/upstream/pstack`, metadata version **0.15.2**. This is a source audit, not an execution of upstream instructions and not a live compatibility test. All text files listed below were read in full; an initially truncated combined read was replaced with complete smaller reads.

## Automation behavior inventory

| Unit | Required behavior and purpose | Dependencies | Migration recommendation |
|---|---|---|---|
| Dormant Benny pack | Two cooperating automations; pack operational SKILL.md files are read directly, never auto-discovered normal skills. | Cursor automation editor and built-in automate, repository checkout. | Preserve dormant pack; separate setup from activation; use supported host automation tools only after explicit user request. No Slack connection means unconfigured/untested, not deleted. |
| Setup/bootstrap | Merge entire pack into target repo; preserve destination-only files and local edits; user config/routing/feature map outside source-managed pack. Enable shared PStack dependencies project-wide, verify in a fresh project agent, commit operational files before execution. | `.cursor/settings.json` JSONC and project plugin discovery. | Replace paths and discovery mechanism only after official Codex validation. Stable committed repo-relative operational files remain portable. Never use cache paths. |
| Setup integrations | Require explicit source channel, triage identity, repository, tracker, adapter, feature map, model choices and budgets. Verify integrations and harmless UI adapter test before enabling. | Slack reads/thread replies/downloads; tracker CRUD plus compensation; GitHub drafts; UI app control. | Host-capability probe with honest unsupported states. No invented model identifiers or integration endpoints. |
| Trigger and marker contract | Both workflows start from a new top-level report. Repro waits silently for exactly one trusted marker from configured identity in the original thread: bug/performance proceed, other/missing/conflicting/untrusted/timeouts stop. | Slack event trigger, identity, bounded waiting. | Native event trigger availability must be researched; polling is a substitute with explicit latency and dedupe. Keep marker protocol verbatim. |
| Thread safety | Freeze channel and root timestamp; read root and permalink; preflight before all writes; never source root, DM, cross-post or fallback thread; verify reply landed. | Thread-aware Slack adapter. | Preserve exactly. A host lacking thread-only writes cannot activate this capability. |
| Triage | Read full thread and attachments; bounded how/why source/history pass; distinguish bug/performance/feature/question-feedback/reroute; uncertain bug asks one focused question with other marker. No repro or fix here. | Repo/history/media plus tracker and optional routing map. | Portable operational instruction; unavailable repo means conservative classification, no guessed owner. |
| Routing and pings | Evidence-based routes, no keyword-only ownership. Tell reporter where to go without cross-posting. Pings default off; only explicitly configured feature owner or strongly evidenced regression author, never broad on-call. | User-owned routing map and explicit config. | Preserve user-owned configuration and defaults. |
| Dedupe and ticketing | Check source URL already handled; search signature/area/trigger/symptom/version/history; confident duplicate gets recurrence link only; plausible match no new ticket; net-new live clear defect only. | Tracker search/read/create/update and cancel/close/delete compensation. | Adapter independent of vendor. Missing compensation means no new issue. Do not silently replace safe writes with best effort. |
| Verdict atomicity | One concise thread verdict and one marker; preflight tracker writes; if newly-created issue cannot be handed off in Slack, compensate and verify cancellation. | Slack readback + tracker compensation. | Portable guarded workflow. Add executable adapters/tests for invalid parent, duplicate, post failure and compensation failure. |
| Ownership gates | Stop for human implementation ownership; utility bots only provide evidence. Existing PR/commit switches to verification, no competing edit. | Full thread, tracker, history/PR lookup. | Preserve distinctions; evidence-only diagnosis request is not ownership. |
| Reproduction | Require real UI symptom twice independently, exact discriminating final state, recording/screenshot, read-only state cross-check, independent media verdict. Missing required UI capability blocks; no repro means no authored fix. | App-specific adapter with bringup, mapped navigation/states, real input, read-only inspection, screenshot, recording, cleanup. | Keep full contract; browser/native app capability varies. Current host may lack native UI/video; cannot call unit tests an equivalent reproduction. |
| Existing fix verification | Isolated checkout; record baseline/patch SHAs and same environment; baseline broken twice, patch correct twice, evidence both sides. Confirmed/insufficient/inconclusive outcomes; no authoring. | Worktrees/builds/UI evidence. | Git native equivalent; UI adapter conditional. Preserve no-competing-PR rule. |
| Bounded fixing | Repro/media pass, rejection window, no new owner/artifact, runtime root cause, bounded scope, baseline/patch runnable. Cheap TDD then minimal root fix, before/after UI proof, focused tests and blast-radius smoke. | Repo tools, runtime, TDD, control adapter. | Preserve all gates and reason when TDD is skipped. |
| Draft PR | Coordinator reviews diff/secrets, checks, commits, creates draft only with tracker/evidence; never merges/deploys. Creation failure recorded honestly. | GitHub draft action/auth. | Native CLI/connector possible, contingent auth and external-action authorization. |
| Delegation isolation | Coordinator only Slack poster. Analysis workers read-only, no tokens or write tools. Code worker only when tooling proves Slack isolation; otherwise coordinator edits. | Enforced per-worker tools/credentials. | Prompt ban alone is insufficient. Codex shared tools may prevent enforced isolation; fall back to coordinator. |
| Operations/followup/cleanup | Optional operations root separate from immutable source; concise status, at most one unprompted repro source reply; bounded direct-answer followups; cleanup always; artifacts retained by policy outside Git. | Status edit optional token, timed followup, adapter cleanup. | Preserve scope and exact write authorization. Host scheduling conditional. Replace `/tmp` with platform temp resolution. |

## Source inconsistencies to resolve explicitly

- Prompt templates encode `source_channel_id`, `message_ts`, `thread_ts`; operational steps sometimes read `trigger.channel` / `trigger.ts`. The bridge needs an explicit normalized trigger schema instead of blindly copying mismatched names.
- Triage says configured marker strings, while example live prompt names literal defaults. Use one validated config source.
- The configuration has `prefer_cursor_actions` and `/tmp/benny-artifacts`: platform-specific adapters must replace these intentionally.
- Public GitHub PR links are upstream's contract; enterprise GitHub support would be a recorded extension, not an unannounced behavior change.
- Automation pack creation currently instructs explicit approval/editor handoff and forbids backend APIs because of Cursor's own workflow; translate to the supported OpenAI host flow, retain activation authorization, do not preserve nonexistent `/automate` syntax.

## Documentation promises that migration must preserve or qualify

1. README declares 23 playbooks, 24 named main skills, 23 principles, two named subagents, and dormant Benny. Counts must be checked against actual trees rather than treated as one undifferentiated feature count.
2. Poteto is sticky within a conversation, reroutes explicit new task, copies matched playbook steps into task list verbatim, leaves skipped steps with reasons, and keeps read-only investigation read-only.
3. Setup's model rules are user-level `.cursor/rules/pstack-models.mdc`, fresh-session applied, partial overrides with fallback. `auto` / `inherit-parent` mean omit model field, never model slugs. Panel list length defines reviewer count. OpenAI migration must qualify fixed-model and cross-family claims.
4. how traces runtime/types; why searches accessible evidence categories and labels inference/null results; teach composes explanation with diagrams; recall reconstructs current state from accessible chat/shared record; session pickup verifies inherited claims instead of blindly trusting handoff.
5. architect grounds design then arena, usage-first types/modules; checkpoint only when requested. Arena same brief, isolated candidates, read-only cross-judge, full output read, base+graft+verify. Swarm independent scopes or declared races, PASS/ISSUES/BLOCKED plus missing workers. These are distinct workflows.
6. Interrogate promises diverse-model reviewers, triage into Act on/Consider/Noted/Dismissed, reasons and no automatic application. Same-model independent roles are a partial substitute, never diversity equivalence.
7. TDD is cheap fail-first behavioral test then fix; expensive mock scaffolding may use a stronger executable check and explanation. TypeScript skill automatic loading is a Cursor discovery promise to revalidate.
8. deslop and control-cli/control-ui are NOT bundled; provided by cursor-team-kit. create-skill, babysit, loop are Cursor built-ins. PStack's own babysit supersedes built-in only inside the mode. Migration must provide explicit substitutes or identify missing dependencies.
9. Verification generator supplies Launch/Doctor/Drive/Evidence/Cleanup plus per-feature maps, proves one end-to-end execution before delivery. Maintainer source wave + live all-features pass changes only verification skill; clean/changed/blocked and one PR max.
10. Babysit resolves conflicts, review, CI in order and stops at merge-ready; Shipping fresh independent per-PR live validation and contiguous bottom-up merge. Authorized shipping is not implied by babysit.
11. Overnight contract has finish predicate, isolated worktree, permissions, escape hatch, persistent wake mechanism. `loop` is host capability. Per-iteration evidence, keep/revert, decision TSV, no relaxed finish predicate; resumed/multiday execution requires host support, not a prompt promise.
12. Autopilot-full independent PR owners and independent merge-head verification; autopilot-stack prepares but never lands; orchestrate standing coordinator delegates code and maintains stack, does not code itself.
13. automate-me mines observed preferences and confirms them, generates personal mode layered over PStack; update since last edit preserves uncontradicted rules. reflect has three parallel reviewers, Accepted/Rejected/Backlog, approval before skill changes. Missing full transcript access must be declared.
14. Skill eval is blinded in sanitized isolated dirs, common rubric, actual read evidence, no candidate cross-contamination; skill edits separately reviewed. Technical-writing applies Diataxis, developer style, STE and Global English.
15. Principle use names concrete changed decisions rather than name-dropping. Worktree cleanup checks merge state, dirty state and active chats, protects uncommitted work.

## Metadata, copyright, assets

`.cursor-plugin/plugin.json`: name/displayName pstack, version 0.15.2, author Lauren Tan, MIT, canonical Cursor upstream URLs, logo assets/logo.png, developer-tools category, `skills: ./skills/`, `agents: ./agents/`. This is Cursor metadata, not evidence that identical Codex fields are legal. Derivative identity must state PStack for OpenAI and preserve attribution/upstream provenance.

LICENSE: MIT, `Copyright (c) 2026 Lauren Tan`. Keep original notice and full permission/warranty text with substantial copied code/docs. Do not replace author with fork maintainer. This is a direct inventory of license content, not a legal interpretation. `.gitignore`: node_modules/, .DS_Store, *.log. Generated recordings, auth/config/state need additional intentional exclusions in derivative.

Images are documentation assets, not runtime logic: router.jpg (dispatch), understanding.jpg (how/why), design.jpg (design candidates/review), verification.jpg (real evidence), overnight.jpg (long-running decisions), recipes.jpg (workflow examples). Listed/registered only; image content not inspected. Root logo is referenced by metadata.

## Verification recommendations

Test normalized trigger, missing/deleted parent, untrusted/conflicting markers, dedupe idempotence, tracker compensation, no root posts, enforced worker isolation fallback, before/after twice requirement, existing artifact no edit, no proof no PR, bounded followup and cleanup. An offline protocol test does not prove live Slack/event trigger/UI integration. Compatibility must keep separate static checks, simulated workflow execution, host runtime tests and live external integration tests.

## Read manifest
- automations/benny/FOR_AGENTS.md
- automations/benny/README.md
- automations/benny/skills/reproduce-and-fix-issues/SKILL.md
- automations/benny/skills/reproduce-and-fix-issues/references/control-adapter.md
- automations/benny/skills/reproduce-and-fix-issues/references/feature-map.example.md
- automations/benny/skills/reproduce-and-fix-issues/references/verify-existing-fix.md
- automations/benny/skills/setup-benny/SKILL.md
- automations/benny/skills/triage-issue-reports/SKILL.md
- automations/benny/skills/triage-issue-reports/references/routing.example.md
- automations/benny/templates/configuration.example.yaml
- automations/benny/templates/reproduce-automation-prompt.md
- automations/benny/templates/triage-automation-prompt.md
- docs/guide/01-setup.md
- docs/guide/02-poteto-mode.md
- docs/guide/03-understand.md
- docs/guide/04-design.md
- docs/guide/05-build-and-clean.md
- docs/guide/06-verify-and-ship.md
- docs/guide/07-overnight.md
- docs/guide/08-principles.md
- docs/guide/09-make-it-yours.md
- docs/guide/10-recipes-and-pitfalls.md
- docs/guide/README.md
- .cursor-plugin/plugin.json
- README.md
- LICENSE
- .gitignore
