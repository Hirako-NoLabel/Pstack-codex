Independent review completed from `task.md`, `rubric.md`, every file in candidates 1–4, and the shipped `architect/references/design-red-flags.md`. I did not read `parent-assessment.md`. This is design inspection, not execution evidence; the judge inherits the same model family.

| Candidate | 1. Ownership/races | 2. TTL/retry/undefined | 3. API/usage | 4. Boundaries/tests | 5. Maintainability/alternatives | Total |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 3 | 4 | 4 | 3 | 4 | 18/20 |
| 2 | 4 | 4 | 4 | 4 | 4 | 20/20 |
| 3 | 4 | 4 | 4 | 4 | 4 | 20/20 |
| 4 | 4 | 4 | 4 | 4 | 4 | 20/20 |

**Recommend candidate 3 as the base.** Its operation-owned cell has a useful structural advantage: successful completion never writes the registry. Invalidating removes the registry reference; an old success can change only its detached cell. Failure still needs identity-guarded deletion, which is explicitly present. This requires one map and one tagged state per operation, without a generation counter or independently synchronized stores. The mutable cell is an accepted tradeoff, not an extra lifecycle subsystem.

Candidate 2 is the strongest central-map alternative. Its success path samples the supplied clock before checking installation authority, then performs the guarded write without external callbacks between comparison and mutation. Its usage also clearly demonstrates exact expiry and synchronous-throw retry.

Candidate 4 is equally sound under its explicit **pure**, nonthrowing clock contract. It clearly specifies that the returned pending promise includes cleanup handlers, so retry observers cannot encounter failed work still installed. Candidate 1 is less precise about callback placement and the deferred promise arrangement.

Concrete grafts into candidate 3:

- From candidate 4: explicitly state that the published promise is the final promise containing settlement handlers, and cleanup/state transition completes before callers observe settlement.
- From candidate 2: capture configuration callbacks and TTL once, so mutating the caller’s options object cannot change policy.
- From candidates 2/4: specify `RangeError` for invalid TTL and retain the explicit `Number.isFinite(ttlMs) && ttlMs > 0` construction check.
- From candidate 1: preserve the warning against ignored rejecting cleanup/`finally` promises. Prefer a single returned chain rather than adding another deferred promise.
- From candidate 4: adopt the complete deterministic test matrix: slow completion-based TTL, equality expiry, undefined reuse, synchronous/asynchronous retry, same-key reentrancy, and old success/failure both before and after replacement settlement.
- Preserve candidate 3’s explicit “completion callbacks never call `cells.set`” invariant.

One correction for candidate 1 before treating it as an equally safe fallback: its pseudocode checks identity and then calls `now()` inside the replacement. Its declared clock contract is finite, monotonic and nonthrowing, but does not prohibit reentrancy. Such a clock could invalidate the key during that call, after the ownership check, allowing stale installation. Either require a pure clock consistently or move sampling before the final identity check as candidate 2 does. Under a pure-clock assumption the ordinary loader/invalidation races are correct; under the written broader contract this is a stale-write defect and disqualifies candidate 1 until revised.

All four pass the shipped architectural red-flag screen:

- **Shallow module:** two methods hide substantial sharing, expiration, retry and invalidation policy.
- **Information leakage:** entries, cells, tokens and timestamps stay private.
- **Temporal decomposition:** lifecycle stages remain within one ownership module.
- **Pass-through methods:** no unnecessary forwarding layer is proposed.

Reject the split generation/pending/value stores and persistent generation cells for this fixture: they add synchronized state without required capability. Reject caller-owned handles because callers would have to coordinate identity to preserve per-key coalescing. Do not graft candidate 4’s guarded registry publication into candidate 3; that would discard the main structural reason to select candidate 3.
