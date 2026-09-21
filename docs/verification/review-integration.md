# Independent final integration review

Reviewer: native audit_automation worker, inherited parent model. This pass is independent of the root installation/context/upstream implementation and the poteto tooling owner. It is not independent of this worker's own Benny/docs implementation, which is explicitly excluded from any claim of fresh independent review. Lens: migrated Interrogate correctness, structural integrity, verification and complexity rubric. No external messages or remote mutations. No implementation files changed in this pass.

## Act on

### P2 — workflow entrypoints still require Unix execution and a skill-relative working directory

Files: plugins/pstack-openai/skills/poteto-mode/playbooks/babysit.md:14; shipping.md:16; orchestrate.md:25; worktree-cleanup.md:7.

Babysit explicitly says to run `scripts/watch-pr/watch-pr` directly and Shipping repeats it as an executable. On Windows this extensionless Bun script is not a native executable and PowerShell does not honor its Unix shebang. In addition, these paths resolve from the current project, while the files live in the installed plugin under skills/poteto-mode/scripts. Orchestrate and cleanup also use relative `scripts/...` without defining a working directory. The scripts README gives correct `bun`/`node` invocation, but the actual playbooks do not require reading it before execution. Use quoted installed-plugin absolute paths and the appropriate interpreter in the playbook itself. Do not change into the plugin directory for repository-sensitive gh operations unless the target repo is passed explicitly.

### P2 — Orchestrate still depends on nonexistent host store and loop-skill contracts

File: plugins/pstack-openai/skills/poteto-mode/playbooks/orchestrate.md:25,73.

The persistent store location is described as the current agent's store, with its path supposedly in the system prompt. OpenAI hosts do not universally supply that Cursor-style store contract. Later the drain procedure tells the coordinator to arm a frontier wake via the loop skill, which is neither bundled nor a verified OpenAI capability. This undermines the long-task path even though the shared runtime describes capability checks correctly. Specify an explicit project-local durable store (or user-supplied path), pass it through ORCH_STORE/--store, and route wakes to an actually available native scheduler/event tool with session-only fallback. Do not invent a generic loop skill.

### P2 — generated multi-phase evidence paths are still hard-coded to Unix /tmp

File: plugins/pstack-openai/skills/poteto-mode/playbooks/multi-phase-plan.md:79.

The copied verification checklist requires every screenshot at `/tmp/swarm-<pr-id>/...`. In native Windows this is not the operating system temp directory, may resolve to the drive root, and can fail sandbox/write permissions. Because this is an instruction copied into all worker plans, it propagates to the exact multi-agent workflow being ported. Resolve the actual host temp/work directory once, allocate one scoped directory per worker, and write that concrete path into the plan. The create-verification-skill worked example also uses `/tmp/notes-verify-$RUN_ID`; mark its shell/platform context or supply a portable translation. The cleanup reply still asks for `df -h /` despite its earlier host-neutral disk-space instruction; make that reply requirement host-neutral as well.

## Resolved earlier findings

- update.ps1/update.sh now reject an enclosing unrelated Git repository by comparing the top-level to the script directory before pulling.
- upstream stage rejects nested source output before mkdir; outputPath also blocks preservation-snapshot destinations.
- context snapshot records invalid JSON as state_error, while checkpoint derives repository metadata without parsing old state. A valid replacement can recover.
- Benny ticketGate now validates HTTPS source URLs without credentials, whitespace, backslashes or scheme shorthand; expanded negatives pass. This confirmation is not an independent review of my own patch.

## Checks and non-findings

- Root Node suite executed in this pass: 3 passed, 0 failed, including real Git checkpoint with Unicode/spaces and nested upstream staging rejection.
- Bun frontier + orchestration suite executed on native Windows: 18 passed, 0 failed, 94 assertions. These are deterministic tests with injected GitHub responses, not live GitHub verification.
- Read the complete frontier adapter and operational store paths, lock acquisition/release, atomic state writes, inbox, ledger, frontier update and status rendering. No additional high-confidence introduced P1/P2 code defect found within the CLI's one-command-per-store lifecycle.
- Frontier validates returned PR rows, refuses ambiguous unpinned branches/cycles, uses remote SHAs, and requires explicit lists when discovery reaches its cap. Closed entries remain visible in the frozen list; this bookkeeping does not authorize merging. Shipping must still stop on closed-unmerged PRs and independently verify current patches.
- Store's lock and portable inbox filenames passed actual Windows tests. No claim of process-race proof or network filesystem compatibility is made.
- Current CLI rejects a different source reusing marketplace personal; earlier isolated-home evidence remains applicable. Update now refreshes the same local marketplace with add instead of pretending local sources require a remote upgrade.
- Skill role routing defaults to inherited models and conditionally uses supported overrides. Discovery/docs never constitute evidence that ChatGPT Work executed tools or background jobs.
- Retained upstream review policy quirks and limitations are documented; no blanket green-CI/READY merge permission was inferred.

## Noted / limitations

No P1 finding. Remaining P2s are executable workflow instructions, not cosmetic prose. No live ChatGPT Work, macOS, Linux, GitHub API or scheduler run occurred in this review. Tests and static inspection cannot be promoted to those compatibility claims. Windows test evidence is scoped to the actual Node/Bun commands above.
