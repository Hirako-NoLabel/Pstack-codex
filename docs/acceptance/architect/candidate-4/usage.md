# Consumer usage — written before types

Import `createLoadingCache` from the single cache module. Supply a positive finite TTL in milliseconds, a loader, and a synchronous monotonic clock in milliseconds. The clock is an injected dependency, not a timer. Cache keys use JavaScript Map equality.

```ts
import { createLoadingCache } from './loading-cache.js';

// Call site 1: concurrent consumers share one load, including promise identity.
let time = 0;
const profileCache = createLoadingCache<string, { name: string }>({
  ttlMs: 500,
  now: () => time,
  load: key => profileStore.read(key),
});
const sidebar = profileCache.get('alice');
const header = profileCache.get('alice');
// sidebar === header while pending; other keys need not wait for alice.
const [sidebarProfile, headerProfile] = await Promise.all([sidebar, header]);

// Call site 2: mutation discards installation rights, not caller results.
const oldRead = profileCache.get('bob');
await profileStore.rename('bob', 'Robert');
profileCache.invalidate('bob');
const freshRead = profileCache.get('bob');
// A separate load begins even if oldRead remains pending.
const [originalResult, currentResult] = await Promise.all([oldRead, freshRead]);

// Call site 3: undefined is a normal result; failures permit retry.
const aliases = createLoadingCache<string, string | undefined>({
  ttlMs: 100,
  now: () => time,
  load: key => aliasStore.findOptional(key),
});
try { await aliases.get('missing'); } catch { /* source temporarily failed */ }
const alias = await aliases.get('missing');
// A failed first attempt reloads. A successful undefined is reused until expiry.
```

`get` always returns a promise, including when the loader throws synchronously. Loader invocation occurs in a microtask after pending state is published. Reentrant calls for the same key therefore join that pending promise; a loader awaiting its own pending result forms an unsupported self-await cycle. Expiry occurs at age >= TTL, measured from successful completion, and is checked lazily on access.
