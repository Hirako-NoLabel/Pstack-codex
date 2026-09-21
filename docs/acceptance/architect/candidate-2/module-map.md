# Module map and design checks

- `usage.md`: caller-first contract and three realistic call sites.
- `loading-cache.sketch.ts`: proposed sole production module, public interfaces and private state; placeholder body plus transition pseudocode only.
- `rationale.md`: required rationale and structural alternatives.
- `evidence.md`: phase checklist, host capability evidence and verification limits.

No load/validate/save modules, registry wrapper, transport types or forwarding class is proposed. Future deterministic tests import only the public factory.

## Dominant access traces

| Access | Lookup and transition | Caller outcome |
| --- | --- | --- |
| Cold key | Absent -> publish unique Pending -> invoke loader in microtask | Return pending promise |
| Concurrent same key | Pending -> no transition | Return exact same promise |
| Different key | Its own map slot and operation | Independent progress |
| Success | Current token -> Ready(value, completion clock) | Fulfill with value |
| Undefined success | Ready tag establishes presence | Fulfill with undefined and reuse |
| Before TTL | Ready, elapsed < TTL | Fulfilled promise of cached value |
| At/after TTL | Ready -> new Pending | Fresh computation |
| Rejection or sync throw | Delete only matching Pending | Original error; later get retries |
| Invalidation | Delete current entry | Original promise remains intact |
| Read after invalidation | Absent -> different Pending token | Fresh computation immediately |
| Old success after invalidation | Identity mismatch -> no write | Old caller still gets old value |
| Old failure after invalidation | Identity mismatch -> no delete | Old caller gets error; fresh entry survives |
| Repeated invalidation | Absent -> absent | No effect |
| Reentrant loader get | Already published Pending | Same promise; self-await excluded |

Race check: A begins, invalidation removes A, B begins. Whether A or B settles first, only B can install/delete the mapped state. If A settles after B becomes Ready, identity still mismatches. Failed A never erases B. No generation reuse/ABA issue occurs because each Pending is a new object retained by its settlement closure.

Shared writes occur only synchronously inside get, invalidate or a settlement callback on one JavaScript event loop. Each settlement checks ownership immediately before mutation with no intervening await. No lock, networking, timers, persistence or package is needed. The completion timestamp is sampled before the authority check, so no external callback can intervene between that check and insertion.

Red-flag screen: no shallow coordinating API (two operations hide all lifecycle policy); no information leakage (token, tagged state and timestamps private); no temporal decomposition (one domain owner); no pass-through layers. All bodies remain unimplemented. Proposed checks are design cases, not claims of executed tests.

