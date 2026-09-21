# Usage first

Create one cache around one loader. The loader and clock are injected; get always returns a promise. TTL uses the same units as the clock, conventionally milliseconds. Keys use JavaScript Map equality.

```ts
import { createLoadingCache } from './loading-cache.js';

// Call site 1: repeated callers share a computation, including undefined values.
const profiles = createLoadingCache<string, string | undefined>({
  ttl: 100,
  now: () => fakeTime,
  loader: key => controlledProfiles.load(key),
});
let fakeTime = 0;
const alice1 = profiles.get('alice');
const alice2 = profiles.get('alice'); // same pending Promise as alice1
const bob = profiles.get('bob');     // independently scheduled computation
// Resolve alice's controlled loader with undefined at fakeTime = 20.
// Until fakeTime = 120, get('alice') resolves to undefined without a load.

// Call site 2: invalidate while an old read remains outstanding.
const oldRead = profiles.get('carol');
profiles.invalidate('carol');
const newRead = profiles.get('carol'); // starts a fresh computation
// Complete either operation first. Each caller receives its own result.
// Only newRead may populate the current cache entry.
await Promise.all([oldRead, newRead]);

// Call site 3: failure permits retry, even if loader throws synchronously.
const items = createLoadingCache<string, number>({ ttl: 10, now: () => fakeTime,
  loader: key => controlledItems.load(key) });
try { await items.get('missing'); } catch { /* application handles failure */ }
const retry = items.get('missing'); // new computation after rejection
```

The controlled loaders are test/application dependencies, not exports from the cache. now is a finite, monotonic, nonthrowing clock. Invalid nonfinite or nonpositive TTL throws at construction. No cancellation, timers, persistence, networking or eviction limits are included.
