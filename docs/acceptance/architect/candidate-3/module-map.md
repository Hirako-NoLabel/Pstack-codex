# Module map

Proposed implementation: `loading-cache.ts` owns creation, TTL validation, the key-to-cell registry, cell lifecycle, and the two public operations. The only exported types are `LoadingCache` and `CacheOptions`; callers need no cell or ownership types. There is no second runtime module.

Proposed verification: `loading-cache.test.ts` supplies a manual clock and controlled deferred loaders. It checks same-key sharing and promise identity, distinct-key progress, TTL counted from success rather than start, exact expiry, undefined hits, synchronous and asynchronous rejection retry, old success after replacement, old failure after replacement, repeated invalidation, and synchronous reentrant get observing pending work without self-await.

Delivered package: `rationale.md` contains usage first and architectural reasoning; `loading-cache.sketch.ts` contains the typed contract and nonimplemented transition pseudocode; `evidence.md` records workflow and red-flag review. These files are sketches, not production implementation or executed tests.
