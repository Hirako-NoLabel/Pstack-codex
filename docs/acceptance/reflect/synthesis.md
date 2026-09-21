## Accepted

| Problem | Proposal | Routing |
|---|---|---|
| Passing behavior checks can obscure skipped or late workflow stages. | Report behavior and workflow adherence separately, preserving deviations after later verification. | `outputs/pstack-openai/plugins/pstack-openai/skills/poteto-mode/SKILL.md`, Writing the reply. |
| Historical findings can prompt edits for problems already corrected. | Require synthesis to classify each finding as unresolved, already fixed, or execution-only against current source. | `outputs/pstack-openai/plugins/pstack-openai/skills/reflect/SKILL.md`, Synthesize. |
| Temporary reviewer shortages can leave promised independent verification unfinished. | Track deferred verification and reassess availability before acceptance, keeping independence and model diversity distinct. | `outputs/pstack-openai/plugins/pstack-openai/skills/poteto-mode/SKILL.md`, Subagents. |

## Rejected

- Principle: Plugin distribution verification requires a new standalone skill.
- Reason: existing-skill-first

- Principle: Repeat the host-discovery and metadata-validation recommendation as another skill edit.
- Reason: duplicate

- Principle: Add distribution-integrity prose alongside an enforceable fresh-checkout hash gate.
- Reason: structural

## Backlog

- **Discovery and schema validation:** Native discovery accepted metadata that the official validator rejected; combine both checks in the package acceptance runner and report their results separately.
- **Update lifecycle:** Local-source refresh differed from Git-source upgrade; preserve the existing source-version-change and installed-cache checks, and add separate source-type cases where coverage is missing.
- **Shell paths and platform evidence:** Git and Git Bash returned different path forms; retain shell-normalized comparisons and the existing regression coverage, with explicit operating-system and shell fields in receipts.
- **Distributed source integrity:** Checkout newline conversion threatened preserved byte hashes; retain `upstream/** -text` and make fresh-checkout hash verification an automated release gate.
- **Recovery from corrupt state:** Old-state parsing prevented replacement with a valid checkpoint; the current regression already covers this repaired behavior, so retain that mechanism without reopening the defect or adding skill prose.
