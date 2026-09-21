# Usage written before types

A cache owns the loader and time policy. Consumers only request values and invalidate keys. `get` always returns a promise; invalidation is synchronous and does not cancel promises already returned.

```ts
import { createLoadingCache } from './loading-cache';

// Call site 1: one computation for two simultaneous consumers.
let now = 100;
let calls = 0;
const profiles = createLoadingCache<string, { name: string }>({
  ttlMs: 500,
  clock: () => now,
  loader: async key => { calls++; return { name: key }; },
});
const sidebar = profiles.get('Ada');
const header = profiles.get('Ada');
// sidebar === header; calls becomes 1 when the loader microtask runs.
await Promise.all([sidebar, header]);
now = 599;
await profiles.get('Ada'); // cached: completed at 100, age 499
now = 600;
await profiles.get('Ada'); // expired at equality; new computation
```

```ts
// Call site 2: update flow may invalidate while a read is pending.
const oldRead = profiles.get('Grace');
profiles.invalidate('Grace');
const newRead = profiles.get('Grace');
// oldRead and newRead each deliver their own loader outcome.
// Only newRead may populate the current cache, regardless of completion order.
await profiles.get('Lin'); // independent key is not blocked by Grace
```

```ts
// Call site 3: absent data is still successful data; rejection is retryable.
let attempts = 0;
const optional = createLoadingCache<string, undefined>({
  ttlMs: 1000,
  clock: () => now,
  loader: () => {
    if (++attempts === 1) throw new Error('try again');
    return undefined;
  },
});
try { await optional.get('missing'); } catch { /* caller chooses retry */ }
await optional.get('missing'); // starts attempt 2 and caches undefined
await optional.get('missing'); // still attempt 2 within TTL
```

The clock supplies finite, monotonic milliseconds; TTL must be finite and greater than zero. Keys use normal JavaScript Map equality. Loader invocation is deferred one microtask so the pending entry is installed before user code executes. These are API semantics, independent of wall-clock timers.
