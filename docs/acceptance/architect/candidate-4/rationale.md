## Problem

Provide a small per-key asynchronous cache where sharing, expiry, retry and invalidation interact correctly. Greenfield Phase A has no integration constraints. The difficult boundary is an invalidated loader that must still settle its original callers without writing into a newer cache lifecycle; synchronous throws and reentrant calls must obey the same contract.

## Usage (caller's view)

Written first in [usage.md](usage.md): construct with `{ttlMs, now, load}`, call `get(key): Promise<V>` for both first and repeated reads, and call `invalidate(key): void` after mutations. The three call sites cover concurrent profile consumers, an overlapping refresh after mutation, and optional values with retry. Callers supply dependencies and choose keys; they never manage generations, pending handles or completion timestamps.

## Shape

Choose one closure-owned `Map<K, Pending<V> | Ready<V>>`, with each Pending object's identity serving as its installation capability. The tagged union excludes simultaneous pending/ready state and makes `undefined` unambiguous, per encode-lessons-in-structure. A settlement may write only when the map still points at its own Pending object; operations own their promises independently and merge only at this identity check, per separate-before-serializing-shared-state. Invalidation is idempotent deletion, per make-operations-idempotent. The constructor rejects nonfinite/nonpositive TTL; the supplied pure, finite, monotonic clock is an explicit dependency contract, per boundary-discipline. A microtask invokes the loader only after publication, normalizing synchronous throws and supporting reentrancy. Completion timestamps avoid both load-start expiry and deadline-addition overflow. One module hides promise coalescing, stale-write exclusion, lazy expiry and rejection cleanup behind two methods: substantial interface depth with a short call chain, per minimize-reader-load. No timers, networking, packages, persistence or cancellation.

## Synthesis decision

Candidate recommendation: use the single tagged-entry map as the base. Panel synthesis is pending and belongs to the orchestrator; no other candidates have been read and no cross-candidate adoption is claimed.

## Tradeoffs accepted

- We accept one microtask before loader invocation in exchange for published state before arbitrary caller-supplied code runs.
- We accept lazy retention of expired entries until access or invalidation in exchange for timer-free operation and a minimal API.
- We accept different promise identities on ready hits in exchange for storing the value and completion time directly; pending callers still share an exact promise.

## Alternatives considered

- **Two maps, ready values plus active operations:** hides the same policies behind the same two methods, but ownership of one key spans two containers and refresh/invalidation must preserve cross-map consistency. It offers no greater interface depth; the union map structurally prevents competing ready and pending records.
- **Persistent per-key cell with generation and separate pending/value fields:** also hides lifecycle details, but cells survive invalidation, generation is synchronized with fields, and absent versus cached undefined needs another tag. Stable cells help subscriptions or per-key metrics that this task does not require. It loses on unnecessary state despite an equally small public surface.

## Open questions and risks

Could unbounded distinct-key cardinality require an eviction policy in a future task, given that this timer-free design retains unvisited expired entries? Can supplied clocks honor the documented nonthrowing monotonic contract? Neither question blocks this fixture; broader eviction or hostile-clock behavior is outside the current scope.

## Next implementation step

After synthesis, implement the single module against deterministic deferred-loader tests, starting with publication-before-reentrancy and identity-guarded settlement.
