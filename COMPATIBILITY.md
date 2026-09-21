# Compatibility

Status applies to this port's evidence, not every possible account. **Supported** means a matching local mechanism or representative workflow was executed; it is not a full-equivalence certificate. **Partial** means a retained workflow has a substitute or conditional dependency. **Unsupported** means the named native capability has no verified equivalent on that surface. **Untested** means no live run on that surface. Consult VERIFICATION.md for the exact test scope.

| Capability | Codex (Windows tested) | ChatGPT Work | Ordinary Chat | Evidence / boundary |
|---|---|---|---|---|
| Official plugin package and 47-skill discovery | Supported | Untested | Untested | Real CLI install and app-server skills/list. Official docs describe plugin skills across Chat/Work; no live Work/Chat install performed. |
| GitHub repository marketplace installation | Partial | Untested | Untested | Local-source lifecycle verified. Remote publication/install awaits owner approval. Local marketplaces differ from public directory listings. |
| Poteto task dispatch | Supported | Untested | Untested | Bug/feature/how-investigation fixtures; all 23 route instructions retained, not all exercised. |
| Sticky mode across conversation turns | Partial | Untested | Untested | Explicit conversation instruction replaces Cursor mode metadata; no platform-enforced sticky flag or automatic fresh-session activation. |
| Bug Fix + cheap-path TDD | Supported | Untested | Partial | Core rerun preserves sync contracts, has committed pre-work phases, native investigation/fix/review and 8 passing checks. Swarm leaf timing limitation retained. Chat needs executable tools for proof. |
| Feature + default behavior preservation | Supported | Untested | Partial | Actual Unicode literal search option fixture. |
| Investigation read-only | Supported | Untested | Partial | Reviewer read-only How run; hashes/status/diff unchanged. Chat can explain accessible source; repo access conditional. |
| Architecture exploration | Partial | Untested | Partial | Four independent same-model candidates and separate judge, two distinct ownership shapes, parent synthesis and implemented fixture with 11 passing checks. Cross-family diversity and conditional redesign remain untested. |
| Review panel / Interrogate | Partial | Untested | Partial | Independent native same-model reviewers and lead synthesis. Cross-family panel not verified; no model diversity claim. |
| Review UI/panel | Partial | Untested | Unsupported | Native host review tools used only when exposed; portable file/line findings remain. Plugin adds no custom review UI. |
| TDD, principles, writing, unslop | Partial | Untested | Untested | All preserved and discovered; TDD executed, not all 23 principles/writing behaviors independently evaluated. |
| Native parallel subagents | Supported | Untested | Unsupported | Actual parallel audits, implementation and independent review. Work is documented for eligible accounts but untested here. |
| Named agent registration | Partial | Untested | Unsupported | Role prompts work portably; optional .codex/agents TOML requires explicit setup and actual installed path. Not auto-registered by plugin. |
| Model and reasoning routing | Partial | Untested | Unsupported | Config validation/budget tests pass, explicit IDs must be actually available. Live tests inherited parent; no forced unavailable model. |
| Cross-model family diversity | Partial | Untested | Unsupported | Role diversity available; upstream Claude/Grok/OpenAI panel cannot be claimed equivalent inside an OpenAI-only host. |
| Cloud VM per worker / deep nesting | Partial | Untested | Unsupported | Local bounded native agents and worktrees; no Cursor Task environment/cloud_base_branch emulation. |
| Git worktree isolation and audit | Supported | Untested | Unsupported | Real worktree and read-only audit with spaces/Chinese paths. Deletion never automatic; active-use unknown holds candidate. |
| macOS simulator / Cursor cache cleanup | Untested | Untested | Unsupported | Retained optional capability for explicitly named installed targets; not translated into deleting Codex state. |
| Recall and context restoration | Partial | Untested | Partial | Actual Git/AGENTS/checkpoint save/recall. Full chat corpus may be unavailable; no unrelated history scan. |
| Reflect | Partial | Untested | Partial | Actual three parallel review lenses plus separate synthesizer; same inherited model and labelled evidence digest. Rule-edit approval gate preserved; proposals not applied. |
| Automate-me / personal mode composition | Partial | Untested | Partial | Full evidence/interview/incremental workflow retained; complete history unavailable and no personal-mode end-to-end run. |
| Persistent orchestration store / ledger | Supported | Untested | Unsupported | Bun tests cover unit/inbox/gates/standing/status/lock/ledger and replacement frontier fixtures. Live GitHub frontier untested. |
| Long-running active session | Partial | Untested | Unsupported | Checkpoints and exit predicates implemented. Duration/host limits and user authorization still apply. |
| Scheduled wake / execution after shutdown | Partial | Untested | Unsupported | Actual native scheduler required and explicit scheduling request. No restart-survival test or unsolicited automation activation. |
| PR watcher, babysit, shipping, stacks | Partial | Untested | Unsupported | 57 Bun tests plus type checks. gh login/live PR cycle not executed. READY is not merge authorization; finite query limits documented. |
| Runtime/trace/performance/hillclimb | Partial | Untested | Partial | Complete playbooks retained, specific profiler/live workload not exercised. |
| UI verification / visual parity / recording | Partial | Untested | Partial | Actual browser/native control needed; no recording or pixel-parity fixture. Unit test pass cannot replace real UI evidence. |
| Native Cursor/Grok webhook wake + secret card | Unsupported | Unsupported | Unsupported | make-bot-ui explicitly retains the D gap. Configured external endpoint is only a partial substitute. |
| Benny event trigger + Slack/tracker/UI/draft PR | Partial | Untested | Unsupported | Pack remains dormant. Seven offline protocol tests pass; no live integrations or messages. Tool/credential isolation required or coordinator fallback. |
| Installation/update/removal shell portability | Partial | Untested | Unsupported | Windows CLI verified. Shell/native OS results recorded in VERIFICATION; CI matrix supplied, not assumed green. |

## Migration decisions

Cursor Task parameters become actual host subagent calls and role briefs. GitHub head/base relationships replace mandatory Graphite metadata in orchestration; the pinned upstream copy preserves the original for review. Worktree audit uses Git NUL output and conservative dirty/unknown-use classification instead of BSD-only commands and whitespace splitting. Model IDs and reasoning levels are separate and checked against real capability evidence. Scoped project context replaces assumed Cursor transcript directories.

External `cursor-team-kit` deslop/control-ui/control-cli and Cursor create-skill/loop are not silently dropped or falsely bundled. Their purposes map to scoped diff review, actual available UI/terminal tools, skill-creator, and explicit native scheduling. Where the mechanism is absent, the relevant step remains blocked/untested with its reason.

## Official evidence checked 2026-09-22

- [Plugin packaging](https://developers.openai.com/plugins/build/plugins): repository marketplaces and supported `.codex-plugin/plugin.json` compatibility fallback.
- [Skill authoring and invocation](https://learn.chatgpt.com/docs/build-skills): `SKILL.md`, repository `.agents/skills`, Codex `$` and ChatGPT `@` invocation.
- [Subagents and model configuration](https://learn.chatgpt.com/docs/agent-configuration/subagents): actual inheritance, local TOML agent configuration and surface differences.
- [ChatGPT Work](https://learn.chatgpt.com/docs/get-started-with-work): local/cloud capabilities depend on available tools/account. Documentation is not a live compatibility test.

Local CLI `0.155.0-alpha.9.2` help and native execution are the authoritative evidence for the install/add/remove commands used here. The docs and CLI can differ during rollout; installers fail on unsupported commands rather than silently copying partial content.
