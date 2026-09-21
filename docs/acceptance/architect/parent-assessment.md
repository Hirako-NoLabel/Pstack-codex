# Parent independent design assessment

Read candidate 1, 2 and 3 packages end to end before this assessment. Candidate 4 remains pending; no final selection yet. Criteria use rubric.md, scored 0-4.

| Candidate | Ownership/races | TTL/failure/value | Usage/depth | Boundary/testing | Maintainability | Total |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 4 | 4 | 4 | 4 | 3 | 19 |
| 2 | 4 | 4 | 4 | 4 | 4 | 20 |
| 3 | 4 | 4 | 4 | 4 | 4 | 20 |

Candidate 1's manually deferred promise is viable but adds settlement plumbing relative to a promise chain. Candidate 2 guards both success and failure registry writes. Candidate 3 instead mutates only its detached operation cell on success, so stale success cannot republish itself; only failure deletion requires a registry identity guard. Candidate 3 is the provisional tie-break winner for local state ownership with the same two-method API.

All three satisfy the red-flag screen: one policy-owning module; no public internal representation, lifecycle-stage modules, or pass-through facade. Types encode Pending/Ready state, while runtime TTL validation protects JavaScript callers. Two whole-shape alternatives exist across actual candidates: immutable registry entry replacement versus operation-owned mutable cells. No model diversity is claimed.

Candidate 4 read end to end after completion: 4/4/4/4/4 = 20. It converges on candidates 1/2's immutable registry-entry ownership shape, while spelling out promise-chain settlement and pure-clock assumptions. No red flags. Parent provisional base remains candidate 3 because stale successful completion cannot reinsert into the registry at all. Candidate 2/4's promise-chain semantics and option capture are useful implementation detail grafts; candidate 1's elapsed-time subtraction avoids deadline overflow and is already shared by candidate 3.

All four complete packages have now been read. Parent and independent cross-judge selection remain to be reconciled before implementation.

Final reconciliation: the judge and parent both select candidate 3. Parent accepts the judge correction for candidate 1: sampling a reentrant clock after checking ownership can permit stale insertion; initial parent score missed that contract detail. Candidate 1 is rejected as a fallback until revised rather than silently repaired. No changes to other candidate scores or chosen base are needed.
