# Per-operation cell cache

## Problem

Design a greenfield Node loading cache that coalesces same-key work, isolates keys, caches successful values including undefined for a positive TTL after completion, and permits retry after failure. Invalidation must disconnect old work without changing its original callers' outcomes. There is no existing subsystem to trace. The difficult boundary is ownership: an old operation must never overwrite a replacement operation.

## Usage (caller's view)

These call sites are the API specification, written before the types. Construction takes a loader, TTL and deterministic clock; get always returns a promise and invalidate returns nothing.

```ts
import { createLoadingCache } from './loading-cache.js';

// 1. Independent request handlers share one load per account.
const accounts = createLoadingCache({ ttlMs: 5_000, now: () => performance.now(),
  load: (id: string) => repository.readAccount(id) });
const first = accounts.get('account-7');
const concurrent = accounts.get('account-7'); // same pending promise
const other = accounts.get('account-9'); // independent work
const [a, b] = await Promise.all([first, concurrent]);

// 2. A mutation disconnects a previously pending read.
const before = accounts.get('account-8');
accounts.invalidate('account-8');
const after = accounts.get('account-8'); // fresh operation even if before is pending
await Promise.all([before, after]); // each retains its own result

// 3. A missing optional value is a successful cached result.
let time = 0;
const labels = createLoadingCache<string, string | undefined>({
  ttlMs: 10, now: () => time, load: () => undefined
});
await labels.get('optional');
time = 9;
await labels.get('optional'); // cached undefined
 time = 10;
await labels.get('optional'); // expiry boundary: fresh load
```

## Shape

A single `Map<K, Cell<V>>` is the read boundary. Each operation owns a unique cell whose discriminated state is pending or ready. Pending contains its one published promise; ready contains a value and completion time. The operation mutates only its own cell on success. Invalidation deletes the registry reference, so detached completion cannot install anything in the registry. This applies separate-before-serializing-shared-state: concurrent completion actors own distinct state; the registry chooses which actor future reads observe.

`get` reads the selected cell: pending returns its promise; a ready cell younger than TTL returns its value wrapped in a promise; expired or absent starts a cell and publishes it before invoking the loader in a microtask. The loader can throw synchronously; promise assimilation converts that into rejection. Success samples the clock and moves that cell to ready before resolving callers. Failure removes the registry entry only if it still references that same cell, then rejects callers. A late old failure therefore cannot delete replacement work. Other keys access different cells. Reentrant same-key loading observes the published pending promise; self-await is outside the contract.

Discriminated states encode absence of an optional-value sentinel, per encode-lessons-in-structure. Construction checks TTL is a finite number greater than zero and stores a private validated brand, per boundary-discipline; no clocks run at construction. Freshness is derived as `now - completedAt < ttlMs`, including expiration at equality; no separately synchronized expiration index, per single-source-of-truth. The clock must be finite, nondecreasing and nonthrowing; the sketch accepts that injected dependency contract rather than adding a clock repair policy.

The interface hides sharing, promise rejection, stale ownership and TTL behind `get` and `invalidate`, per interface-depth. There are no locks, timers, external packages, network logic, cancellation or persistence. Repeated invalidation is a no-op after the first. Repeated gets while pending have no added loader effect. A process crash loses this intentionally in-memory state. The loader's business operation stays outside the module; the module owns only cache policy, with pure freshness comparison inside it.

## Synthesis decision

Pending parent arena synthesis. This runner recommends the operation-owned cell shape as its base; it has not inspected other runners and makes no cross-candidate selection or graft claims.

## Tradeoffs accepted

- We accept a mutable state union per operation in exchange for detached completions being harmless by ownership.
- We accept a guarded registry deletion on failure in exchange for not retaining failed cells or allocating generation tombstones.
- We accept lazy removal of expired values in exchange for having no timers; idle keys can retain expired values until accessed or invalidated.
- We accept a microtask before loader invocation in exchange for publishing pending work before synchronous throws or reentrant calls.
- We accept a trusted monotonic clock contract in exchange for avoiding policies for backward time or clock exceptions.

## Alternatives considered

- **Central registry state machine with identity tokens:** one map stores pending promises and ready values; completion replaces registry records only when its token is current. It provides equally deep public methods and hides all coordination, but both success and failure callbacks become registry writers requiring stale-write checks. The cell design makes stale success structurally unable to republish itself.
- **Separate generation, pending and value maps:** completions compare generations before committing. This can offer the same public depth and hides generation handling from callers, but freshness and identity invariants span three stores; deletion also needs a policy for generation retention. It loses because the extra state does not provide required caller capability.

## Open questions and risks

- If this later becomes a long-lived cache with unbounded distinct keys, should capacity eviction become a separately requested policy rather than expanding this fixture?
- Will production callers supply a finite, nondecreasing, nonthrowing clock as specified, or will a later integration require an explicit clock-failure policy?

## Next implementation step

After synthesis, implement the single-module cell ownership transition and deterministic deferred-loader cases for invalidation, replacement completion ordering, synchronous rejection, reentrancy, and completion-based TTL.
