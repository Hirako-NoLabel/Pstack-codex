## Problem

Build a greenfield per-key asynchronous cache whose concurrent reads coalesce, successful values expire relative to completion, and invalidation severs publication authority without cancelling original callers. Synchronous loader throws, reentrant reads and cached undefined must behave consistently. No surrounding subsystem requires Phase A tracing.

## Usage (caller's view)

See `usage.md`, written first: createLoadingCache({ttl, now, loader}) returns get(key) and invalidate(key). Three call sites cover coalesced reads, invalidation during a load and failure/retry. All reads return promises; callers supply domain keys and a loader without handling entry states.

## Shape

One closure owns Map<K, Entry<V>>, where Entry is an immutable Pending/Ready union. Pending object identity is its authority to publish; Ready carries value and completedAt. No second index or generation counter needs synchronization, per single-source-of-truth. Store completion time and compare elapsed duration, avoiding deadline addition overflow. Publish pending before a microtask invokes user code; reentrancy sees existing work. Each detached operation owns its own promise and attempts a guarded commit at settlement, per separate-before-serializing-shared-state. Invalidating twice is harmless; old success and old failure both fail the identity guard.

The discriminated union makes undefined a value rather than absence, per encode-lessons-in-structure. Construction validates positive finite TTL into a private branded type; the clock has a documented finite monotonic nonthrowing contract, per boundary-discipline. No timer or external I/O exists. The two-method public interface hides coalescing, expiry, failure cleanup and stale-write suppression; only loader, clock and TTL policy remain visible. One ownership module keeps call chains short, per minimize-reader-load.

## Synthesis decision

Pending parent arena synthesis. This independent candidate proposes the single-map identity-authority shape as its base; no other runner's artifacts were read and no cross-candidate choice is claimed.

## Tradeoffs accepted

- We accept lazy retention of untouched expired entries in exchange for no timers, scans or extra API.
- We accept loader invocation in a microtask in exchange for publishing pending work before synchronous throws or reentrant calls can occur.
- We accept outstanding detached promises until their loaders settle in exchange for preserving original callers after invalidation.

## Alternatives considered

A key-slot actor shape keeps a stable Map<K, Slot> with per-slot epoch, optional cached value and active operation; invalidate advances the epoch and clears state, and operations compare captured epochs before publishing. It can offer the same deep two-method API, exposing no additional caller complexity, but hides more internally synchronized mutable state and retains slots or requires slot-lifetime rules. The chosen entry-identity shape gets the same stale-write protection from deletion/replacement and one union, so slot actors lose without a need for subscriptions or long-lived per-key services.

A caller-owned memoization session would place a fresh cache scope at each caller and merge ready results centrally. It separates write ownership, but requires callers to coordinate invalidation/session lifetime and global coalescing. Its larger interface exposes the very concurrency policy this task should hide, so it loses on interface depth.

## Open questions and risks

Could future usage require bounded retention for keys never read again? Current scope deliberately uses lazy expiration. Can consumers honor the injected monotonic nonthrowing clock contract? Deterministic acceptance fixtures can. No answer is required to implement the stated scope.

## Next implementation step

Implement this one-module state machine with deterministic tests for same-key sharing, different-key independence, completion-relative TTL including exact expiry, undefined, sync/async failure retry, reentrancy and every old/new success/failure ordering across invalidation.
