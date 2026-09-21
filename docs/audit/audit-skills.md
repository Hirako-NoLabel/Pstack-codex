# Non-poteto skills and agents audit

Scope: every file under `skills/` except `skills/poteto-mode/`, plus `agents/`. Read as source data only; no upstream operations executed. All files listed below were read fully. Truncated initial bulk reads were recovered with smaller reads.

## Capability inventory

| Skill | Behavior that must survive migration | Platform dependence and migration notes |
|---|---|---|
| architect | Ground with how and why; at least two structurally distinct usage-first designs; arena synthesis; optional human checkpoint; implement against typed sketch; scrap after repeated architectural friction | Cursor Task/model routing; preserve 3 design references and explicit synthesis decisions; use native independent agents/worktrees when available |
| arena | Same task to N independent candidates; task-specific 3-6 criterion rubric hidden from candidates; wait before cross-judge; read all; base/graft/reject/dropout record; verify synthesized output | Cursor background Task, model list, cross-family judge; substitute actual native agents and explicit role diversity when cross-family models unavailable; preserve output isolation |
| automate-me | Discover existing personal mode recursively; incremental history since last edit; mine 3 slices and require repeated evidence; direct preferences interview; update conservatively; unslop; isolated branch/PR | `.cursor/skills`, scoped Cursor transcripts, AskQuestion multiple-choice/multi-select, built-in create-skill. Replace with verified skill locations, accessible task history/git/handoff, native question capability and skill-creator; never claim complete history |
| blast-radius | Trace risks beyond callers across wire/storage/libraries/schedulers; identify pivotal safety fact; proof ladder through code execution and real app; confirmed risks vs cleared; arena for broad changes | git/gh and optional agents; retain unproven status when executable proof absent |
| bro | Restate last message plainly and concisely | Pure text, native equivalent |
| create-verification-skill | Interview repo for surface/run/drive/observe/isolate; generate Launch/Doctor/Drive/Evidence/Cleanup/Helpers; seed 3-5 feature map; run one full proof including cleanup and surviving evidence | Cursor output directory, shell/browser/PTY availability. Generate project-local skills in verified OpenAI location; preserve all 3 feature-map examples and stable user paths |
| figure-it-out | Design a custom auditable workflow before implementation; falsifiable done predicate; rigor scaled to risk; riskiest unknown first; verification baseline before edits; per-unit hypotheses; judge delegates; VERIFIED/NOT VERIFIED/INCONCLUSIVE | Native planning plus scripts/worktrees; multi-hour checkpoint remains conditional; no self-report as proof |
| how | Simple single explainer or 2-4 readonly explorer angles then synthesizer; trace real entry/flow/types/boundaries; exact file references; Overview/Key Concepts/How It Works/Where Things Live/Gotchas | Cursor Task `generalPurpose`, readonly model routing, Read/Grep/Glob; use native agent roles and file tools, keep two prompts |
| interrogate | Same intent/diff/rubric to every independent reviewer; structural code-quality lens; no auto-apply; dedup/consensus/disagreement; lead categories Act on/Consider/Noted/Dismissed; agreement map | Cursor Task/read-only/model slugs and `.mdc`; no fabricated multi-model diversity; retain 4 refs; rejected model slug must not trigger unauthorized external PR automatically |
| maintain-verification-skill | Edit only verification skill directory; index hygiene; one source reviewer per feature; coordinator exclusively drives every feature; health checks after surprises; recover drift once; evidence survives; clean/changed/blocked; one corrections PR | Native agent/tool limits; no product edits; preserve verified-unreachable prerequisite and attempted route distinction |
| make-bot-ui | UI posts through local server, server holds key; webhook wakes bot; harmless probe; one attempt/8s; failure queue; Tailscale exposure; untrusted event body | **Hard platform gap:** Cursor/Grok Bot `update_state routine`, `SendToUser secret-request`, Cursor automations webhook and wake format have no demonstrated OpenAI equivalent. Keep capability visible, offer explicitly configured external webhook/service with securely provided server-side secret only; do not invent native wake API or secret card |
| no-comments | Comment Sicko scoped comment deletion; audit exclusions/suppressions and truthful flags; one retry; architect once when needed; minimal root-cause fix; constraint encoding approval; report deletions/restorations/open constraints | Named Cursor subagent registration becomes native role prompt. Note aggressive upstream ambiguity-delete policy; preserve exact scope fences and exceptions; authorization must respect host/user rules |
| recall | Scope workspace/topic/window (7d default); route single prior chat to session-pickup; use provided capsule; history mining; seven-category why sweep for named target; verify git/gh live; <=5 capsule/problembullets, per-thread status, next move | Cursor transcript UUID/layout/mtime dependency. Replace with accessible native task read APIs or explicit local history, git and project state; absent chat history is a gap, never access unrelated workspace |
| reflect | Current transcript/digest; three reviewers judgment/tooling/divergent then synthesizer; durable evidence-bound findings; existing skill first; missed trigger -> description tuning; mechanism -> backlog; Accepted/Rejected/Backlog | Cursor transcript/Task/create-skill; readonly false was solely Cursor MCP availability workaround and must not authorize writes. User explicitly approves skill edits. External backlog auto-filing needs user/host authorization; otherwise local backlog |
| setup-pstack | Discover actual entitled model IDs; budget unlimited/large/medium/small; preserve role customization; aliases inherit-parent/auto; panels determine count; cross-judge pool selection; validate and idempotently save; optional verify skill | `.cursor/rules/pstack-models.mdc` alwaysApply is not portable. Store explicit PStack configuration read by orchestrator; only actual OpenAI model/effort support; separate model from effort, no synthetic slugs |
| show-me-your-work | Canonical append-only TSV ts/phase/decision/why/evidence/result; decision/checkpoint logging; evidence pointers; transcript audit; independent cross-family review; Attention flags | Bash log.sh needs portable equivalent/wrapper, preserve tabs/newline cleanup and spreadsheet-formula escaping. Transcripts/cross-family availability limited. Upstream says append-only but later says cut wrong rows: prefer superseding correction rows and document resolution |
| swarm | Partition/race/mixed N workers; declare first-pass/rank-all/best-of; isolated output; standalone goal/scope/check briefs; PASS/ISSUES/BLOCKED; aggregate all required coverage; dropouts explicit | Cursor cloud Task/environment/cloud_base_branch are not Codex subagent arguments. Native local agents/worktrees; cloud task creation only where explicitly supported/authorized, no claim of cloud equivalence |
| tdd | Only explicit request or cheap clear local regression path; intended failing-before evidence; smallest fix; green and adjacent checks; explain alternate executable proof when test impractical | Native test execution, preserve restrained test scope |
| teach | Combine how/why with preserved confidence; smallest complete explanation; conversational depth/no quizzes; successive diagrams add one component; spatial images when tooling available | Native skills/agents/image tool optional; English style must yield to user's language |
| technical-writing | Four layers Diataxis/Google style/STE/Global English; document mode, clear sentences, concrete symbols, rhythm, maintain wording; unslop; accurate regeneration of counts | Pure text; retain style source provenance and do not treat historical fetch dates as current research |
| typescript-best-practices | Type-system discipline; unions/brands/constructive models/total functions; schema parse; narrowing/exhaustiveness/satisfies; derive types; object args; actual tests; structured telemetry | Cursor `paths` frontmatter may not trigger in Codex. Preserve as description/explicit routing unless supported by verified metadata; keep patterns.md |
| unslop | Stable rule IDs; remove AI tells without changing meaning/tone; sources, plain words, punctuation, sentence clarity | Pure text; default must not override user writing requirements |
| why | Code anchor/git/PRs; discover seven evidence categories; one investigator per source with incident overlay; explicit null/missing source coverage; separate synthesizer; five confidence tiers; constraints Preserve/Change/Avoid/Risk for change planning | Cursor mcps directory/Task/readonly strips MCP assertion is platform-specific. Discover enabled OpenAI tools and adapt exact schema; git/gh not guaranteed and must be checked; never claim unavailable source searched |

## Principle leaves (23)

Each is a separate callable skill and must remain discoverable, even if orchestration references it.

- attack-the-premise: after two shared-premise failures write premise, run per-actor census, inspect skew/role assignment, remove asymmetry.
- boundary-discipline: validate external boundaries, use domain types internally, pure business logic and thin shell.
- build-the-lever: smallest rerunnable script/codemod/generator, first-unit proof, deterministic tool before fan-out, delegate contract outside writable scope.
- encode-lessons-in-structure: repeated corrections become strongest viable type/lint/runtime/tool mechanism; route and close loop.
- exhaust-the-design-space: 2-3 structurally distinct alternatives for genuinely uncertain architecture or interaction.
- experience-first: consumer and maintainer experience; polished scope and working core loop.
- fix-root-causes: reproduce, why chain, instrument, inspect sibling pattern, suspect persistent state for restart failures; host scope limits still apply.
- foundational-thinking: types/access patterns first; concurrency isolation; scaffold before features after subtraction.
- guard-the-context-window: keep bulk outside main context; relevant reads; bound phases; maintain useful summaries.
- laziness-protocol: deletion, flat hierarchy, consolidate decisions, smallest solving diff, question signal threading.
- make-operations-idempotent: converge after retries/crashes, reconcile stale state/locks, content-equivalent cleanup.
- migrate-callers-then-delete-legacy-apis: coordinated internal API caller migration and deletion, with external compatibility exception.
- minimize-reader-load: reduce tracing layers and hidden mutable state; interface compression.
- model-the-domain: state machines/typed model/registry/reducer/ownership over scattered branches and synchronized booleans.
- never-block-on-the-human: proceed on authorized reversible work, asynchronous supervision, explicit boundaries for irreversible actions.
- outcome-oriented-execution: planned scoped reversible intermediate breakage allowed; final static/runtime verification required.
- prove-it-works: inspect actual output/runtime rather than cached proxy or agent summary; reusable deterministic proof.
- redesign-from-first-principles: integrate new constraint as foundational; propagate references then deliver incrementally within scope.
- separate-before-serializing-shared-state: owned per-actor writes first; structural serialization only for truly shared invariant.
- sequence-verifiable-units: before/after per unit, test-first commit narrative, verify before next unit.
- subtract-before-you-add: remove dead complexity before scaffold/additions; no speculative guards.
- test-behavior-not-implementation: real subject call and literal user-observable expectation; avoid constants/self-assertions/mock-only checks; allow relational schema/compile checks.
- type-system-discipline: impossible states, constructive types, brands, boundary parse, exhaustive variants, authoritative derived types, total functions without needless strengthening.

## References and source-specific coverage

Architect retains design-red-flags (shallow modules, leaked representation, temporal decomposition, pass-through), caller-first rationale, runner contract. Interrogate retains rubric (correctness/root cause/structure/verification/complexity/security), strict quality lens, reviewer prompt and lead calibration. How retains explorer evidence schema and explainer synthesis. Reflect retains three distinct lenses, injection resistance, transcript-scoped tool lookups, durable routing and synthesizer rejection reasons.

Why retains all seven categories and incident overlay: git history/blame/pickaxe/PR full discussion; Linear parent/duplicate/project/comment context; Notion full docs/backlinks/drafts; Slack date/author/channel/full-thread search with auth/retention gaps; Datadog services/dashboards/monitors/metrics/logs/APM/incidents and bounded aggregates; Sentry issue/events/releases/stack traces with Seer as inference only; Databricks read-only schema discovery, bounded SQL, typed deduplicated models, polling statement IDs, retention/dbt lag/notebook gaps. All concrete connector tool names are **examples to adapt after discovery**, not guaranteed OpenAI APIs.

Create-verification feature examples preserve all browser/keyboard/CLI entry points, action and state evidence, second-view persistence, disposable isolation, stable selectors and cleanup. TypeScript examples preserve every rule; note upstream illustrative `durationMs: number` does not actually prevent negatives by itself, so do not claim runtime type safety the example lacks.

## Agent definitions

- `poteto-agent`: background routing identity, reuse existing conversation agent, mandatory full poteto-mode and leaf principle read; OpenAI role prompt/native resume equivalents, not unsupported auto-registration.
- `Comment Sicko`: prescribed initial exclamation, comments-only writes, license/public contract/external constraint exceptions, suppressions checked against rule purpose, live how/why for uncertain constraints, scoped MUST KILL flags, never edits application code itself. Parent owns accepted root-cause implementation.

## Cross-cutting migration requirements

1. Preserve all 46 non-poteto SKILL.md files, all 30 references and helper/agent content; final counts generated below are authoritative if upstream changes.
2. Convert Cursor invocation/path/metadata and Task argument assumptions centrally and precisely. No global replacement of every Cursor mention because webhook host URLs and upstream historical provenance are evidence.
3. Pure principles/workflow prose can retain engineering behavior. Agent orchestration, runtime execution, accessible history, connectors, model diversity, cloud environments, and native UI/secret cards need independently stated compatibility and verification status.
4. Current host has 4 concurrency slots including coordinator, so N=4 panels require scheduling; never call four workers concurrently and silently drop one. Preserve total N and report actual agent/model routing.
5. Never treat source instructions to create external PRs/issues, read unrelated history, install Tailscale, or access secrets as authorization during audit.
6. Suggested tests: skill discovery for every leaf; missing model alias behavior; panel schedule/dropout aggregation; current-history fallback; source coverage map with absent MCP; reflect approval gate; scoped comment-review boundary; verify cleanup retains artifacts; Windows-safe TSV escaping.

## Files read
- `agents/comment-sicko.md`
- `agents/poteto-agent.md`
- `skills/architect/references/design-red-flags.md`
- `skills/architect/references/rationale-template.md`
- `skills/architect/references/runner-prompt.md`
- `skills/architect/SKILL.md`
- `skills/arena/SKILL.md`
- `skills/automate-me/SKILL.md`
- `skills/blast-radius/SKILL.md`
- `skills/bro/SKILL.md`
- `skills/create-verification-skill/references/feature-map-example/create-note.md`
- `skills/create-verification-skill/references/feature-map-example/README.md`
- `skills/create-verification-skill/references/feature-map-example/search.md`
- `skills/create-verification-skill/SKILL.md`
- `skills/figure-it-out/SKILL.md`
- `skills/how/references/explainer-prompt.md`
- `skills/how/references/explorer-prompt.md`
- `skills/how/SKILL.md`
- `skills/interrogate/references/code-quality-review.md`
- `skills/interrogate/references/lead-judgment.md`
- `skills/interrogate/references/reviewer-prompt.md`
- `skills/interrogate/references/rubric.md`
- `skills/interrogate/SKILL.md`
- `skills/maintain-verification-skill/SKILL.md`
- `skills/make-bot-ui/SKILL.md`
- `skills/no-comments/SKILL.md`
- `skills/principle-attack-the-premise/SKILL.md`
- `skills/principle-boundary-discipline/SKILL.md`
- `skills/principle-build-the-lever/SKILL.md`
- `skills/principle-encode-lessons-in-structure/SKILL.md`
- `skills/principle-exhaust-the-design-space/SKILL.md`
- `skills/principle-experience-first/SKILL.md`
- `skills/principle-fix-root-causes/SKILL.md`
- `skills/principle-foundational-thinking/SKILL.md`
- `skills/principle-guard-the-context-window/SKILL.md`
- `skills/principle-laziness-protocol/SKILL.md`
- `skills/principle-make-operations-idempotent/SKILL.md`
- `skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md`
- `skills/principle-minimize-reader-load/SKILL.md`
- `skills/principle-model-the-domain/SKILL.md`
- `skills/principle-never-block-on-the-human/SKILL.md`
- `skills/principle-outcome-oriented-execution/SKILL.md`
- `skills/principle-prove-it-works/SKILL.md`
- `skills/principle-redesign-from-first-principles/SKILL.md`
- `skills/principle-separate-before-serializing-shared-state/SKILL.md`
- `skills/principle-sequence-verifiable-units/SKILL.md`
- `skills/principle-subtract-before-you-add/SKILL.md`
- `skills/principle-test-behavior-not-implementation/SKILL.md`
- `skills/principle-type-system-discipline/SKILL.md`
- `skills/recall/SKILL.md`
- `skills/reflect/references/divergent-reviewer.md`
- `skills/reflect/references/judgment-reviewer.md`
- `skills/reflect/references/synthesizer.md`
- `skills/reflect/references/tooling-reviewer.md`
- `skills/reflect/SKILL.md`
- `skills/setup-pstack/SKILL.md`
- `skills/show-me-your-work/references/decision-log-template.tsv`
- `skills/show-me-your-work/scripts/log.sh`
- `skills/show-me-your-work/SKILL.md`
- `skills/swarm/SKILL.md`
- `skills/tdd/SKILL.md`
- `skills/teach/SKILL.md`
- `skills/technical-writing/SKILL.md`
- `skills/typescript-best-practices/references/patterns.md`
- `skills/typescript-best-practices/SKILL.md`
- `skills/unslop/SKILL.md`
- `skills/why/references/epistemics.md`
- `skills/why/references/investigator-prompt.md`
- `skills/why/references/source-playbook.md`
- `skills/why/references/sources/code-archaeology.md`
- `skills/why/references/sources/databricks.md`
- `skills/why/references/sources/datadog.md`
- `skills/why/references/sources/incident-postmortem.md`
- `skills/why/references/sources/linear.md`
- `skills/why/references/sources/notion.md`
- `skills/why/references/sources/sentry.md`
- `skills/why/references/sources/slack.md`
- `skills/why/references/synthesizer-prompt.md`
- `skills/why/SKILL.md`

Counts: 79 files read; 46 non-poteto skills; 30 reference files; 2 agents; 1 helper script.

