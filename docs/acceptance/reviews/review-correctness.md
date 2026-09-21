# Independent correctness review and read-only How acceptance

## Intent

Review the actual loader fix and opt-in Unicode search feature against their stated fixture contracts. The loader must coalesce overlapping same-key work, isolate different keys and release entries after success or failure. Search must preserve default literal case-sensitive behavior while explicit `caseSensitive:false` enables Unicode simple-folded literal substring matching. No product edits, commits, network access, publication or new fixture artifacts were authorized or performed by this reviewer.

## Reviewers

- Correctness reviewer: native `audit_playbooks` agent, separate from the fixture authors. Model routing inherited the parent model; no model override or cross-family diversity occurred. This is one independent review lane, not a claim that this worker ran a complete four-model panel. Parent performs panel synthesis.
- Loaded migrated Interrogate SKILL, reviewer prompt, rubric, code-quality lens and lead-judgment framework, plus How SKILL and explainer prompt and the OpenAI runtime contract. Applied actual execution-path evidence and avoided speculative null/type requests outside the string/async fixture contracts.

## Scope and evidence

- Bug: `loader.mjs`, `loader.test.mjs`, `design.md`, `REPORT.md`, AGENTS.md and Git history. Reviewed committed diff `cf379e557c1bf7e847d5ecddf3d549e0d575467c..74a64c2984fde9e558aeb2176a08b7ee7990188f`. The failing-test commit `ed789ba` precedes the fix commit `74a64c2`.
- Feature: `search.mjs`, `search.test.mjs`, `PLAN.md`, `REPORT.md`, `design-check.mjs`, AGENTS.md and actual `git diff HEAD -- search.mjs`. HEAD remains `14d865b7aec2681cd1a4c179b7eeee2373c180a0`; implementation is the working-tree diff.
- Executed `node --test loader.test.mjs`: 5 pass, 0 fail, exit 0.
- Executed `node --test search.test.mjs`: 6 pass, 0 fail, exit 0.
- Executed `node design-check.mjs`: actual output `{"lowercase":["ΟΣ","ος"],"unicodeRegex":["ΟΣ","ος","οσ"]}`.
- Independently executed both existing suites against their baseline modules via `git show` and a data-URL module import, without checking out or writing a fixture. Bug baseline: 3 pass, 2 fail, exit 1; Feature baseline: 1 pass, 5 fail, exit 1. Full actual output is in `review-correctness-red.json`. Runner is `../review-red.mjs`.
- Additional direct runtime probes in `../review-boundaries.mjs`: dot query rejects `x`; `a.b` rejects `axb`; `[A]` rejects `A`; `A+B` rejects `AAAB`; lone backslash and opening parenthesis remain literal. Same-key loader calls return exactly the same Promise, only one fetch occurs, and a post-settlement call fetches again. All expected outputs matched.

## Act On

No findings. No reproducible correctness, security or structural defect was found within either stated contract.

The loader registers the promise before its deferred fetcher invocation, so overlapping callers share one request and its success/error. `finally` removes that key before the returned promise settles. Tests and direct identity probes substantiate the state lifecycle. The Map is the minimal representation; explicit waiter records would duplicate Promise state.

The search feature compiles one escaped, non-global/non-sticky Unicode-insensitive pattern per call and preserves the prior `includes` branch verbatim for default/true/omitted options. Direct adversarial punctuation probes found no regex interpretation leak. Tests substantiate sigma, supplementary characters, ordering, duplicates, immutable input, empty query and documented non-normalization boundaries.

## Consider

None requiring a change for this acceptance fixture. Full Unicode multi-character folding, locale collation and canonical normalization would be different requirements and should remain explicit future product choices.

## Noted

The loader changes fetcher invocation to a microtask and wraps synchronous values/errors into Promise outcomes. This is an explicitly accepted async API tradeoff in design.md, rather than an unnoticed default-behavior regression. Fixture evidence does not establish a broader synchronous loader contract.

These are direct JavaScript library surfaces. Passing their Node execution is matching-surface evidence for these fixtures; it does not prove UI behavior, live GitHub operations, cloud execution or cross-model review.

## Dismissed

- Treating the regex as user-executable syntax: rejected by source escaping and concrete punctuation/counterexample probes.
- Demanding `null` options or non-string-item handling: no such input contract or caller exists in this fixture. Adding general validators would expand scope.
- Replacing the simple Map with explicit states/waiters, or introducing a search strategy interface: no second use case or demonstrated simplification justifies the extra abstraction.

## Agreement Map

One independent reviewer produced this report. Agreement with the authors' reported green results was confirmed by actual reruns and independent red-baseline reproduction; it is not counted as agreement between different models. Any other reviewer consensus must be synthesized by the parent from their own reports.

## How: Unicode matching mechanism

### Overview

`search` is one pure filtering utility. Only `options.caseSensitive === false` selects the new branch; every other supported option shape executes the original literal `String.includes` predicate. The function returns the original matching strings in their original order.

### Key Concepts

The contract is `string[]`, a string query and an optional options object. The opt-in branch treats the query as a literal, escapes regex punctuation, and then uses JavaScript's `iu` matching behavior. This is simple Unicode case equivalence, not locale sorting or normalization.

### How It Works

At `search.mjs:2`, the explicit-false check selects the branch. Line 3 escapes special pattern characters before compilation. Line 4 compiles the escaped query once with `i` and `u`; line 5 applies that same pattern to every original item using `filter`. There is no `g` or `y` flag, so repeated `test` calls do not advance a shared `lastIndex` position. The fallback at line 7 keeps the former `includes` call.

The actual sigma comparison demonstrated the reason for the chosen mechanism: lowercasing the sample found `ΟΣ` and `ος`, while the Unicode regex also found `οσ`. The suite also confirmed supplementary-plane `𐐀`/`𐐨` matching. This conclusion comes from the inspected source and the running Node engine, not an assumed external platform capability.

### Where Things Live

- `feature/search.mjs`: option branch, literal escaping, pattern compilation and filtering.
- `feature/search.test.mjs`: public behavioral contract and Unicode exclusions.
- `feature/design-check.mjs`: measured lowercase-versus-regex sigma comparison.
- `feature/PLAN.md`: selected design and rejected normalization alternative.

### Gotchas

`ß` is not treated as `ss`, and composed `é` is not made equivalent to decomposed `e` plus combining accent. Empty query matches all inputs. The returned array is new, while the values and duplicate ordering remain unchanged. This implementation does not normalize, strip accents or perform locale-specific collation.

## Read-only verification

Snapshots before and after captured HEAD, raw NUL porcelain status, full binary `git diff HEAD`, and SHA256 for every non-.git file under each fixture. Git reads used `GIT_OPTIONAL_LOCKS=0`. `../review-verify-unchanged.mjs` used strict deep equality and passed for both snapshots. The only output writes were outside the fixture directories under `work/acceptance/` or `work/`.

| Fixture | Before/after status SHA256 | Before/after working diff SHA256 |
| --- | --- | --- |
| bug | b95f8f73e152d80164cd8486dcd77ebe64df2d466d00ea80106dcc4e8fb5a70d | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| feature | 8e821c6b797bae4574839b2fd4ac9088523b04094706e1701c4abcfa82599c2c | 052fe91c99a0ab0d82ba321655ef21961a2a077eb538d57c09a5e5285df15bc7 |

Full file-level hash evidence: `review-correctness-before.json` and `review-correctness-after.json`. The bug working diff is empty because the fix is committed; the reviewed committed range is listed above. No source, tests, receipts, checkpoint, status or Git HEAD changed during this review.
