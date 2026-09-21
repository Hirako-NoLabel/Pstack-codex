## Problem

Provide a small Node loading cache whose overlapping reads share work without allowing an invalidated operation to overwrite newer state. Completion determines TTL, failures are retryable, and undefined is data. This is greenfield, so Phase A has no existing ownership or layering to preserve.

## Usage (caller's view)

See usage.md, written before the sketch, for concurrent profile reads, invalidation during a read, and optional data with retry. Consumers construct once with loader, positive TTL and clock, then call get(key) and invalidate(key). get always returns a promise, including when the loader throws synchronously.

## Shape

One closure owns Map<K, Pending<V> | Ready<V>>. Each pending entry owns its promise and acts as its unique installation token. Successful entries own a value and completion timestamp. The tagged union makes undefined unambiguous and prevents pending timestamps or ready entries without values, per encode-lessons-in-structure. TTL validation occurs once at construction, per boundary-discipline; the supplied clock must return finite monotonic milliseconds.

Map identity defines authority: detached operations own only their caller outcomes; the currently mapped operation alone may write the cache. This separates competing operation state before the conditional merge, per separate-before-serializing-shared-state. Deferred loader invocation publishes the token before synchronous throw or reentrant access is possible; rejection deletes only that token's mapping. Reentrant get sees pending work; loader self-await is excluded. There is no duplicate generation counter to synchronize, per single-source-of-truth. Invalidation is an idempotent delete, per make-operations-idempotent.

This is a deep two-method interface: it hides promise coalescing, expiration, rejection cleanup and stale-completion fencing; consumers expose only loader/time policy and key/value domain types. One production file contains all policy, per minimize-reader-load. Pure decisions are tag/age and identity comparisons, with map writes and callback invocation in the same small shell; separate stage modules would leak this invariant.

## Synthesis decision

Pending parent arena adjudication. This runner selects the single tagged-entry map as its candidate base; it has not read or synthesized other runners.

## Tradeoffs accepted

- We accept lazy retention of unrequested expired entries in exchange for no timers, sweeping API or capacity policy outside scope.
- We accept one microtask before loader execution in exchange for safe pending publication and uniform rejection of synchronous throws.
- We accept reliance on a well-behaved injected monotonic clock in exchange for a deterministic, minimal time boundary.
- We accept allocating a ready entry on success in exchange for immutable operation tokens and no partially mutated state.

## Alternatives considered

A split ownership design uses separate ready-values and in-flight maps plus a per-key generation map. Its public surface can be equally deep, hiding the same coordination from callers, but expiration, invalidation and settlement must reconcile three sources of state and generation retention. It loses because internal ownership leaks across storage roles without buying an additional caller capability.

A caller-owned per-key cell design returns a handle with read/invalidate methods and stores state in that handle instead of a central key map. It isolates state strongly, but callers must ensure all users of a key share the same cell or coalescing fails; a handle registry restores the original hidden map with a larger API. It loses interface depth by exposing identity coordination.

## Open questions and risks

- Is a finite monotonic supplied clock an acceptable boundary contract for callers? The sketch assumes yes; non-monotonic or throwing clocks are outside the supplied-clock contract.
- Should a future requirement impose bounded memory for keys never revisited? The present task has no capacity policy and needs no answer to proceed.

## Next implementation step

After synthesis, implement the one-file state machine and deterministic cases for pending sharing, TTL equality, retry and invalidation races using deferred loader promises and a manual clock.
