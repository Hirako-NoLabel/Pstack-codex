# Feature acceptance task list

Route: Feature. The request adds an optional search behavior, rather than fixing an existing contract.

1. `how` over the affected subsystem.
2. `architect` for parallel design exploration. Skipping stays as `architect skipped: <reason>`. Do not fold the design decision silently into implementation.
3. Write the throughput checkpoint as four todo items.
   - Blocking first steps. Read search and pin its existing results; compare Unicode behavior before implementing.
   - Independent workstreams. n/a: one source function, one owner. Reviewer reads after implementation.
   - Shared mutable state. n/a: search returns a new filtered array and does not mutate inputs.
   - Smallest safe decomposition. One code owner prevents overlapping edits; native team already uses all four slots.
4. Delegate code-writing to a subagent using your configured feature model (default `inherit-parent`) with a specific scope.
   - Root delegated this fixture to audit_automation. No extra nested agent launched because all four slots are occupied. Root can review the resulting diff independently. Two design alternatives here are same-author sketches, not an independent arena panel.
5. Verify on the matching surface.
6. Rebase into small, ordered commits. Stack follow-ups.
   - skip: local acceptance fixture; no shared history rewrite or publication requested. Leave an inspectable diff.
7. If the design is contested, `interrogate` before shipping.
   - Design comparison below resolves the choice with executable evidence. Same-author adversarial pass is recorded honestly; fresh root review is separate and pending at report creation.
8. Run **Opening a PR**.
   - skip: fixture AGENTS.md forbids network and remote publication.

## Ground

search(items, query) calls Array.filter and String.includes. It returns matching original strings in original order, preserves duplicates, and does not change items. Existing search is literal and case-sensitive. An empty query matches every item. There is no other subsystem, dependency, UI or storage layer.

## Data shape and interface

search(items: string[], query: string, options?: {caseSensitive?: boolean}): string[]

Examples: search(['École','école'],'é') returns ['école']; search(['École','école'],'é',{caseSensitive:false}) returns both. Only the explicit boolean false enables insensitive matching. Omitted options, {} and caseSensitive:true use the existing includes branch unchanged.

## Architecture alternatives

A. Normalize query once with toLowerCase, then normalize each candidate and use includes. Small and literal, but Unicode context-sensitive case mappings make final sigma σ/ς differ. Uppercase-only normalization instead changes multi-character folding behavior and still needs a precise contract.

B. Compile one escaped literal query as a Unicode case-insensitive RegExp (`iu`), then filter by test. Escaping ensures punctuation remains literal and avoids regex injection; no global/sticky flag means no mutable lastIndex coupling. JavaScript Unicode simple case folding handles sigma and supplementary-plane case pairs. It does not promise locale-specific collation, accent normalization or full multi-character equivalence such as ß = ss.

Choose B after executable comparison. Public API stays one function with one options object; default calls preserve the old branch verbatim. No new module, dependency, validator or caching layer.
