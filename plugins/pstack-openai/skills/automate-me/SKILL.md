---
name: automate-me
description: "Use for \"automate me\", \"create/update/refresh my -mode skill\", \"turn/capture my preferences or working style into a skill\", or wanting agents to follow how the user works. Drafts or revises a personal -mode skill via skill-creator + unslop, optionally pulling fresh evidence from recent transcripts."
---

# Automate me

Read the [OpenAI runtime contract](../../references/openai-runtime.md) before using host tools. Its capability checks govern the platform-specific steps below. Preserve the workflow when a tool is absent, record the limitation, and never invent a tool, model, history source, or successful verification.

A guided flow for turning the user's working conventions into a skill agents will follow. The output is one `-mode` skill tailored to them (e.g. `jay-mode`, `priya-mode`).

This skill orchestrates three others: an inline mining pass (see step 1), the available OpenAI `skill-creator` skill (authoring), and the **unslop** skill (prose discipline). It sequences them. It doesn't replace them.

## Flow

### 0. Check for an existing skill

Look recursively for `.agents/skills/**/*-mode/SKILL.md` and `$HOME/.agents/skills/*-mode/SKILL.md` matching the user's handle. Mode skills can live in a personal category directory (`.agents/skills/<handle>/`), not only at the top level. If one exists, confirm intent with the available structured question tool (unless they already said "update my skill" or similar):

- Update the existing skill (default for repeat runs)
- Start fresh (rare, ask why before doing it)

Mode discovery depends on the host: recursive category folders may not be discovered automatically. Preserve existing paths only when the host discovers them; otherwise install one flat `.agents/skills/<handle>-mode/` directory and explain the move.

Update mode changes the rest of the flow:
- Step 1 mines only history since the skill was last edited (`git log -1 --format=%cI <path>`).
- Step 2 asks what's changed or missing, not what to capture from zero.
- Step 4 edits the existing file in place. Preserve sections the user hasn't contradicted. Revise ones with new evidence. Add new sections only for genuinely new rules.

### 1. Mine their history

Use native task-list/read tools when exposed and filter by the active project before reading. Otherwise use explicitly supplied conversation exports, `AGENTS.md`, project rules, git history, and project-scoped `.pstack/` task records. State which sources were accessible. Do not scan global session stores or unrelated projects. Git history can show workflow but does not prove conversational preferences.

Survey recent agent conversations within that scope for recurring patterns. Run multiple parallel subagents across slices of history (e.g. last 2-4 weeks, split into 3 slices so each has enough material). Each slice mining subagent reads the accessible project-scoped task records or supplied exports the parent provides, looks for the signals below, and returns a short structured list of patterns it saw with evidence pointers. Default signals worth hunting:

- Response preferences (length, tone, format, "dumb it down" corrections)
- Delegation habits (subagents, models, specialized workflows, parallelism)
- Verification posture (what "done" means, unit tests vs live repro, reviewers)
- Code and prose discipline (style, principles cited, lint/format tools)
- Process conventions (worktrees, commits, PRs, review/merge tooling)
- Meta preferences (fixing skills mid-task, proposing new ones)

Cross-check across slices before elevating a signal. Patterns seen in 2+ slices are high-confidence. Lone signals are weak and usually get dropped.

### 2. Ask the user directly

Mining misses intent that hasn't come up yet. Use the available structured question tool (structured multi-choice) rather than asking the user to type from scratch.

Shape: one or two questions with the number of options supported by the host, multiple selection only if the host supports it; otherwise ask concise sequential choices. Start broad ("Which areas matter most?"), then follow up on selected areas with specific options. After the structured rounds, one free-form chat question catches anything the options missed.

Don't dump 20 questions.

### 3. Cluster findings

Group the combined signals into sections. Common ones (use only what applies):

- **Response style**: length, tone, format.
- **Autonomy**: how much to do without asking, MCP tool use.
- **Understand first**: which skills to reach for when scoping or investigating a change.
- **Subagents**: default, parallelism, model-to-task, specialized workflows.
- **Prose / code discipline**: principles, lint tools, style guides.
- **Review and verify**: repro posture, verification skills, live-testing tools.
- **Process**: git worktrees, commits, PRs, review/merge tooling.
- **Skills**: skill-authoring habits, fix-the-skill-first, proposing new skills.

The **poteto-mode** skill shows the shape. Read it for granularity. Don't copy its content. The user's rules are not the same as poteto-mode's.

### 4. Draft the skill

Use the available OpenAI `skill-creator` skill to author the skill. If absent, follow the documented OpenAI skill format and disclose omitted authoring validation. Placement:

- Path: preserve an existing mode skill's category. For a new mode, default to `.agents/skills/<handle>-mode/SKILL.md`; use nested categories only after verifying host discovery in the project (or `$HOME/.agents/skills/<handle>-mode/` if the user prefers a personal skill).
- Handle: the user's first name or chosen identifier.
- Frontmatter `description`: trigger on their name + `$<handle>-mode` + "work in their style", not on generic keywords like "write code" or "review PR".
- Frontmatter formatting: follow `skill-creator`'s YAML rules. Keep `description` as one YAML scalar. Quote it or use `description: >-` with indented continuation lines when punctuation or wrapping requires it.
- Set `policy.allow_implicit_invocation: false` in `agents/openai.yaml` by default. Use supported name and description frontmatter. Enable implicit invocation only at the user's request.

### 5. Iterate on prose

Apply the **unslop** skill and `skill-creator`'s writing guidelines to every line.

Show the draft to the user and take feedback. Expect multiple iterations. Cut ruthlessly. A mode skill is not a manual.

### 6. Land it

Work in an isolated worktree from the verified base branch. Prepare a reviewable commit and PR body. Open the PR only when publication is authorized; otherwise return the local diff. Never push directly to the default branch.

## Guardrails

- **Don't overfit to one conversation.** A preference stated once and contradicted another time is noise. Require multiple instances before codifying it.
- **Don't be clever.** Restating other skills' contents, inventing metaphors, or writing "poetic" prose for an agent reader is cost without benefit. Keep it operational.
- **Reference, don't inline.** Other skills the user relies on should appear as path references, not pasted excerpts. Same for any principle docs they maintain elsewhere.
- **Keep sections minimal.** Only add a section if the user has a specific, non-default rule there. "Communicate clearly" is not a section. "Short paragraphs. Tables when comparing options. Bullets only when items are genuinely parallel." is.
- **Name conventions generic.** Use "the user" or "the human" in imperatives, not the author's first name.
- **Don't force symmetry.** If a user has no process rules worth writing down, skip the Process section entirely.

## Evaluation

A `-mode` skill is subjective output. A `skill-creator`-style test/iterate benchmark loop isn't useful here. Vibe-check with the user: does it read like them? Did it miss anything? Then ship.

Run a description-optimization loop only if the skill's trigger accuracy turns out to be a problem in practice.

## When not to use

- User wants a task-specific skill (not working conventions): `skill-creator` alone, no mining required.
- User wants to capture one narrow workflow (e.g. "how I write commit messages"). That's a regular skill, not a mode skill.



