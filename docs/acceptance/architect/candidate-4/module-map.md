# Module map and access traces

Proposed production layout: one `loading-cache.ts` owns public signatures, constructor validation, the private entry union, and all lifecycle policy. One adjacent deterministic test file owns fixtures. There is no coordinator, storage adapter, expiry service, background sweep, or exported state helper. `usage.md`, this map, the sketch, and rationale are design artifacts only.

| Access | Trace through owned structure |
| --- | --- |
| Cold miss | Absent map entry → publish fresh Pending → invoke loader in microtask |
| Duplicate request, including loader reentrancy | Same key → Pending → same promise |
| Independent key | Distinct map entry → separate promise; no serialization |
| Success | Check current entry identity → Ready with completion timestamp → fulfill original promise |
| Valid hit, including undefined | Ready discriminant → compare age → fulfill stored value |
| Exact expiry boundary | age >= TTL → replace with fresh Pending |
| Failure or synchronous loader throw | Promise chain rejects → identity-guarded deletion → caller rejection |
| Invalidate pending | Delete entry; detached Pending still settles its promise |
| Request after invalidate | Missing → new Pending; old settlement cannot match new identity |
| Old rejection after fresh success | Identity mismatch → leave new Ready untouched → reject old caller only |

The map is the sole publication authority. Each asynchronous operation owns its own promise and captured Pending identity. Settlement is an attempted merge into the current read boundary; revoked operations remain useful to original callers without coordinating with newer operations. No shared generation counter or global queue is required.

Validation cases planned, not executed: shared loader count/promise identity; independent deferred keys; slow-load TTL starting at settlement; equality-at-expiry; cached undefined; failed retry; synchronous-throw rejection; old success and old rejection both before/after fresh settlement; repeated invalidation; reentrant get joins published promise; zero, negative, NaN and infinite TTL rejection. Use manually settled promises and a mutable supplied clock, no sleeps/timers.

Red-flag screen: two public operations hide all lifecycle rules (not shallow); entry identity and timestamps stay private (no representation leakage); one module owns cache knowledge rather than one module per time stage (no temporal decomposition); no forwarding layers exist (no pass-through methods).
